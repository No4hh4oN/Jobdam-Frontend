"use client";

import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
    startConversation,
    askGpt,
    getMessages,
    createCorrection,
    getCorrectionsByMessage,
    CorrectionItem,
} from "../../api/chatapi";
import { useAutoScroll } from "./useAutoScroll";
import "./chat.css";

type UiMessage = {
    id: string;
    serverMessageId?: number;
    role: "user" | "bot" | "system";
    content: string;
    createdAt: number;
};

type NoteMap = Record<number, { items: CorrectionItem[]; fetchedAt: number }>;

export default function ChatPage() {
    const { scenarioId } = useParams<{ scenarioId: string }>();
    const sid = Number(scenarioId);

    const [mode, setMode] = useState<"tutor" | "note">("tutor");
    const [convId, setConvId] = useState<number | null>(null);
    const [msgs, setMsgs] = useState<UiMessage[]>([]);
    const [typing, setTyping] = useState(false);
    const [sending, setSending] = useState(false);
    const [input, setInput] = useState("");
    const [error, setError] = useState<string | null>(null);

    // ===== 오답노트 상태 =====
    const [notes, setNotes] = useState<NoteMap>({});
    const [sheetError, setSheetError] = useState<string | null>(null);
    const NOTE_TTL = 60_000; // 60s
    // 패널 리사이즈(vh 단위)
    const MIN_VH = 20;
    const MAX_VH = 85;
    const [sheetVh, setSheetVh] = useState<number>(40);
    const dragStartY = useRef(0);
    const dragStartVh = useRef(40);
    const dragging = useRef(false);

    // 스크롤 기준 컨테이너
    const { listRef, bottomRef, onScroll, scrollToBottom } =
        useAutoScroll<HTMLDivElement>({ bottomOffset: 64 });

    // (변경) 스크롤 함수 ref로 캡쳐해 의존성에서 제거
    const scrollAfterPaintRef = useRef(
        (force = false, behavior: ScrollBehavior = "auto") => { }
    );
    useEffect(() => {
        scrollAfterPaintRef.current = (force = false, behavior: ScrollBehavior = "auto") => {
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    scrollToBottom(behavior, force);
                });
            });
        };
    }, [scrollToBottom]);

    // (추가) 대화 시작 중복 실행 방지 (StrictMode 포함)
    const startedRef = useRef<number | null>(null);

    // ===== 대화 시작 =====
    useEffect(() => {
        if (startedRef.current === sid) return; // 이미 시작됨
        startedRef.current = sid;

        let mounted = true;
        (async () => {
            try {
                const cid = await startConversation(sid);
                if (!mounted) return;
                setConvId(cid);

                setTyping(true);
                scrollAfterPaintRef.current(false);

                const first = await askGpt(cid, "");
                if (!mounted) return;

                setTyping(false);
                setMsgs((p) =>
                    p.concat({
                        id: crypto.randomUUID(),
                        role: "bot",
                        content: first,
                        createdAt: Date.now(),
                    })
                );
                scrollAfterPaintRef.current(true);
            } catch {
                if (!mounted) return;
                setTyping(false);
                setError("대화 시작 중 오류가 발생했습니다.");
            }
        })();

        return () => {
            mounted = false;
        };
    }, [sid]); // ← 의존성은 sid만

    // ===== 전송 + 자동 교정 =====
    // ===== 전송 + 자동 교정 =====
    const send = useCallback(async () => {
        if (!convId) return;
        const text = input.trim();
        if (!text) return;

        setInput("");
        setSending(true);
        setError(null);

        const localUserId = crypto.randomUUID();

        // 1) 사용자 버블만 추가
        setMsgs((p) => [
            ...p,
            { id: localUserId, role: "user", content: text, createdAt: Date.now() },
        ]);

        // 2) 모든 응답 대기 시 공통 타이핑 표시
        setTyping(true);
        scrollAfterPaintRef.current(true);

        try {
            const reply = await askGpt(convId, text);

            // 3) 봇 응답 추가 + 타이핑 종료
            setMsgs((p) =>
                p.concat({
                    id: crypto.randomUUID(),
                    role: "bot",
                    content: reply,
                    createdAt: Date.now(),
                })
            );
            setTyping(false);
            scrollAfterPaintRef.current();

            // 4) 서버 메시지 id 매칭 → 교정 생성/조회(백그라운드)
            const serverList = await getMessages(convId);
            const lastUser =
                [...serverList].reverse().find(
                    (m) => m.sender?.toUpperCase() === "USER" && (m.message ?? "").trim() === text
                ) || [...serverList].reverse().find((m) => m.sender?.toUpperCase() === "USER");

            if (lastUser?.messageId != null) {
                const mid = lastUser.messageId;
                setMsgs((p) =>
                    p.map((m) => (m.id === localUserId ? { ...m, serverMessageId: mid } : m))
                );

                try { await createCorrection(mid); } catch { }
                try {
                    const items = await getCorrectionsByMessage(mid);
                    setNotes((prev) => ({ ...prev, [mid]: { items, fetchedAt: Date.now() } }));
                } catch {
                    setSheetError("오답노트 동기화 중 오류가 발생했습니다.");
                }
            }
        } catch {
            setTyping(false);
            setError("메시지 전송/교정 처리 중 오류가 발생했습니다.");
        } finally {
            setSending(false);
        }
    }, [convId, input]);


    // 튜터 모드: 하단 고정
    useEffect(() => {
        if (mode === "tutor") scrollAfterPaintRef.current();
    }, [msgs.length, typing, mode]);

    // ===== 그룹화 =====
    const grouped = useMemo(() => {
        const out: { role: "user" | "bot"; items: UiMessage[] }[] = [];
        msgs.forEach((m) => {
            if (m.role === "system") return;
            const last = out[out.length - 1];
            if (last && last.role === m.role) last.items.push(m);
            else out.push({ role: m.role, items: [m] });
        });
        return out;
    }, [msgs]);

    // ===== 노트 확보(단건 보장; silent면 로딩 UI 없음) =====
    const ensureNotes = useCallback(
        async (mid: number, silent = false) => {
            const cached = notes[mid];
            if (cached && Date.now() - cached.fetchedAt < NOTE_TTL) return;

            if (!silent) setSheetError(null);
            try {
                try {
                    await createCorrection(mid);
                } catch { }
                const items = await getCorrectionsByMessage(mid);
                setNotes((prev) => ({
                    ...prev,
                    [mid]: { items, fetchedAt: Date.now() },
                }));
            } catch {
                if (!silent) setSheetError("오답노트 불러오는 중 오류가 발생했습니다.");
            }
        },
        [notes]
    );

    // 노트 모드에서 전체 사용자 메시지에 대해 백그라운드 프리페치
    useEffect(() => {
        if (mode !== "note") return;
        const mids = msgs
            .filter((m) => m.role === "user" && m.serverMessageId != null)
            .map((m) => m.serverMessageId!) as number[];
        const toFetch = mids.filter((mid) => !notes[mid]);
        if (!toFetch.length) return;
        toFetch.forEach((mid) => {
            void ensureNotes(mid, true);
        });
    }, [mode, msgs, notes, ensureNotes]);

    // ===== 패널 드래그 =====
    const onDragStart = (clientY: number) => {
        dragging.current = true;
        dragStartY.current = clientY;
        dragStartVh.current = sheetVh;
        window.addEventListener("mousemove", onMove);
        window.addEventListener("touchmove", onTouchMove, { passive: false });
        window.addEventListener("mouseup", onEnd);
        window.addEventListener("touchend", onEnd);
    };
    const onMove = (e: MouseEvent) => {
        e.preventDefault();
        if (!dragging.current) return;
        const dy = dragStartY.current - e.clientY;
        const deltaVh = (dy / window.innerHeight) * 100;
        setSheetVh((v) =>
            Math.max(MIN_VH, Math.min(MAX_VH, dragStartVh.current + deltaVh))
        );
    };
    const onTouchMove = (e: TouchEvent) => {
        if (!dragging.current) return;
        const touch = e.touches[0];
        const dy = dragStartY.current - touch.clientY;
        const deltaVh = (dy / window.innerHeight) * 100;
        setSheetVh((v) =>
            Math.max(MIN_VH, Math.min(MAX_VH, dragStartVh.current + deltaVh))
        );
    };
    const onEnd = () => {
        dragging.current = false;
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("touchmove", onTouchMove);
        window.removeEventListener("mouseup", onEnd);
        window.removeEventListener("touchend", onEnd);
    };

    // ===== 오답노트: 버블 클릭 → 섹션 포커싱 + 패널 확장 =====
    const focusMid = useCallback((mid?: number) => {
        if (!mid) return;
        // 최소 40vh 보장
        setSheetVh((prev) => (prev < 40 ? 40 : prev));
        // 조회 호출 제거: ensureNotes(mid) 삭제
        const el = document.getElementById(`mid-${mid}`);
        if (el) {
            // note-sheet 내부 스크롤 컨테이너 기준으로 부드럽게 이동
            el.scrollIntoView({ block: "start", behavior: "smooth" });
        }
    }, []);
    // ===== 전체 교정 목록(메시지 순서대로) =====
    const allNoteSections = useMemo(() => {
        const userMsgs = msgs.filter(
            (m) => m.role === "user" && m.serverMessageId != null
        );
        return userMsgs.map((m) => ({
            mid: m.serverMessageId!,
            content: m.content,
            items: notes[m.serverMessageId!]?.items ?? [],
        }));
    }, [msgs, notes]);

    const totalItems = useMemo(
        () => allNoteSections.reduce((acc, s) => acc + s.items.length, 0),
        [allNoteSections]
    );

    // ===== 렌더 =====
    return (
        <div
            className="chat"
            style={
                mode === "note"
                    ? ({ ["--note-sheet-h" as any]: `${sheetVh}vh` } as React.CSSProperties)
                    : undefined
            }
        >
            <header className="chat-header">
                <div className="tabs" role="tablist" aria-label="모드 선택">
                    <button
                        role="tab"
                        aria-selected={mode === "tutor"}
                        className={`tab ${mode === "tutor" ? "is-active" : ""}`}
                        onClick={() => setMode("tutor")}
                    >
                        AI 튜터
                    </button>
                    <button
                        role="tab"
                        aria-selected={mode === "note"}
                        className={`tab ${mode === "note" ? "is-active" : ""}`}
                        onClick={() => setMode("note")}
                    >
                        오답노트
                    </button>
                </div>
            </header>

            <main
                className={`chat-main ${mode === "note" ? "note" : ""}`}
                ref={listRef}
                onScroll={onScroll}
            >
                {error && <div className="error">{error}</div>}

                {/* 튜터 모드 */}
                {mode === "tutor" && (
                    <>
                        {grouped.map((g, i) => (
                            <div key={i} className={`group ${g.role}`}>
                                {g.role === "bot" && (
                                    <Image src="/images/bot.png" alt="봇아이콘" width={45} height={45} />
                                )}
                                {g.items.map((item) => (
                                    <div key={item.id} className={`bubble ${g.role}`}>
                                        <div className="bubble__text">{item.content}</div>
                                    </div>
                                ))}
                            </div>
                        ))}
                        {typing && (
                            <div className="group bot">
                                <Image src="/images/bot.png" alt="봇아이콘" width={45} height={45} />
                                <div className="bubble bot">
                                    <span className="typing"><i></i><i></i><i></i></span>
                                </div>
                            </div>
                        )}
                        <div ref={bottomRef} />
                    </>
                )}

                {/* 오답노트 모드 - 상단 채팅 뷰(클릭 포커싱) */}
                {mode === "note" && (
                    <>
                        {grouped.map((g, i) => (
                            <div key={i} className={`group ${g.role}`}>
                                {g.role === "bot" && (
                                    <Image src="/images/bot.png" alt="봇아이콘" width={45} height={45} />
                                )}
                                {g.items.map((item) => {
                                    const clickable = g.role === "user";
                                    return (
                                        <div
                                            key={item.id}
                                            className={`bubble ${g.role} ${clickable ? "note-clickable" : ""}`}
                                            onClick={() => clickable && focusMid(item.serverMessageId)}
                                            role={clickable ? "button" : undefined}
                                            tabIndex={clickable ? 0 : undefined}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter" && clickable) focusMid(item.serverMessageId);
                                            }}
                                            aria-label={clickable ? "오답노트 포커싱" : undefined}
                                            data-mid={item.serverMessageId}
                                        >
                                            <div className="bubble__text">{item.content}</div>
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </>
                )}
            </main>

            {/* 메시지 입력창: 튜터 모드에서만 */}
            {mode === "tutor" && (
                <footer className="composer">
                    <input
                        placeholder="메시지를 입력하세요…"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                send();
                            }
                        }}
                        aria-label="메시지 입력"
                        disabled={!convId || sending}
                    />
                    <button
                        className="send"
                        onClick={send}
                        aria-label="전송"
                        disabled={!convId || sending || !input.trim()}
                    >
                        <Image src="/images/send.png" alt="send" width={19.5} height={19.5} />
                    </button>
                </footer>
            )}

            {/* ===== 오답노트 하단 패널: 모드 전환 시 항상 표시 ===== */}
            {mode === "note" && (
                <div className="note-sheet" role="region" aria-label="오답노트 전체">
                    <div
                        className="note-grip"
                        onMouseDown={(e) => onDragStart(e.clientY)}
                        onTouchStart={(e) => onDragStart(e.touches[0].clientY)}
                        aria-label="패널 크기 조절 그립"
                    >
                        <Image src="/images/Dragbar.png" alt="드래그바" width={41} height={29} />
                    </div>
                    <div className="note-sheet__header">
                        <div className="sheet__header__1"><span>AI</span>가 수정한 답변입니다.</div>
                        <div className="sheet__header__2">비추천 표현 <span>{totalItems ? `${totalItems}개` : ""}</span></div>
                    </div>
                    <div className="note-sheet__body" id="note-body">
                        {sheetError && <div className="error">{sheetError}</div>}

                        {allNoteSections.length === 0 ? (
                            <div className="note-empty">아직 교정 데이터가 없습니다.</div>
                        ) : (
                            <ul className="note-sections">
                                {allNoteSections.map((sec) => (
                                    <li key={sec.mid} id={`mid-${sec.mid}`} className="note-section">
                                        {sec.items.length === 0 ? (
                                            <div className="note-empty small">이 메시지에 교정이 없습니다.</div>
                                        ) : (
                                            <ul className="note-list">
                                                {sec.items.map((it, idx) => (
                                                    <li
                                                        key={`${it.messageId}-${idx}-${it.correctedMessage.slice(0, 16)}`}
                                                        className="note-item"
                                                    >
                                                        <div className="note-item__label"><i />기존 답변 내용</div>
                                                        <div className="note-item__orig">{it.userMessage}</div>
                                                        {it.explanation && (
                                                            <>
                                                                <div className="note-item__exp">{it.explanation}</div>
                                                            </>
                                                        )}
                                                        <div className="note-item__editLabel"><i />수정된 답변</div>
                                                        <div className="note-item__corr">{it.correctedMessage}</div>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
