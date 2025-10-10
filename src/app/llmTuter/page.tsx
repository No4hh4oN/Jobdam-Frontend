// app/llmTuter/page.tsx
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import NavBar from "../../components/NavBar";
import {
    getRandomScenario,
    startConversation,
    askGpt,
    getMessages,
    Scenario,
    ChatMessage,
} from "../api/chatapi";
import "./llmTuter.css";

type UiMessage = {
    id: string;
    role: "user" | "bot" | "system";
    content: string;
    createdAt: number;
};

export default function LlmTuter() {
    const [scenario, setScenario] = useState<Scenario | null>(null);
    const [conversationId, setConversationId] = useState<number | null>(null);
    const [messages, setMessages] = useState<UiMessage[]>([]);
    const [input, setInput] = useState("");
    const [loadingScenario, setLoadingScenario] = useState(false);
    const [starting, setStarting] = useState(false);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const bottomRef = useRef<HTMLDivElement | null>(null);
    const reqRef = useRef<AbortController | null>(null);

    const scrollToBottom = () => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    };

    const safeAbort = () => {
        reqRef.current?.abort();
    };

    const loadScenario = useCallback(async () => {
        safeAbort();
        const ctrl = new AbortController();
        reqRef.current = ctrl;
        setLoadingScenario(true);
        setError(null);
        try {
            const s = await getRandomScenario(ctrl.signal);
            setScenario(s);
            // 초기화
            setConversationId(null);
            setMessages([]);
        } catch (e: any) {
            if (e.name !== "CanceledError") setError("시나리오 로드 실패");
        } finally {
            setLoadingScenario(false);
        }
    }, []);

    const createConversation = useCallback(async () => {
        if (!scenario) return;
        safeAbort();
        const ctrl = new AbortController();
        reqRef.current = ctrl;
        setStarting(true);
        setError(null);
        try {
            const id = await startConversation(scenario.scenarioId, ctrl.signal);
            setConversationId(id);

            // 규격상 첫 턴은 빈 메시지로 ask 호출
            const botTypingId = crypto.randomUUID();
            setMessages((prev) => [
                ...prev,
                {
                    id: crypto.randomUUID(),
                    role: "system",
                    content: `시나리오 #${scenario.scenarioId} 시작: ${scenario.situation} (상대역할: ${scenario.partnerRole})`,
                    createdAt: Date.now(),
                },
                { id: botTypingId, role: "bot", content: "입장을 준비 중...", createdAt: Date.now() },
            ]);

            const content = await askGpt(id, "", ctrl.signal);
            setMessages((prev) =>
                prev
                    .filter((m) => m.id !== botTypingId)
                    .concat({
                        id: crypto.randomUUID(),
                        role: "bot",
                        content,
                        createdAt: Date.now(),
                    })
            );
            scrollToBottom();
        } catch (e: any) {
            if (e.name !== "CanceledError") setError("대화 생성 실패");
        } finally {
            setStarting(false);
        }
    }, [scenario]);

    const sendUserMessage = useCallback(async () => {
        if (!conversationId) return;
        const text = input.trim();
        if (!text) return;

        setInput("");
        const userId = crypto.randomUUID();
        const typingId = crypto.randomUUID();

        setMessages((prev) => [
            ...prev,
            { id: userId, role: "user", content: text, createdAt: Date.now() },
            { id: typingId, role: "bot", content: "답변 작성 중...", createdAt: Date.now() },
        ]);
        scrollToBottom();

        safeAbort();
        const ctrl = new AbortController();
        reqRef.current = ctrl;
        setSending(true);
        setError(null);

        try {
            const content = await askGpt(conversationId, text, ctrl.signal);
            setMessages((prev) =>
                prev
                    .filter((m) => m.id !== typingId)
                    .concat({ id: crypto.randomUUID(), role: "bot", content, createdAt: Date.now() })
            );
            scrollToBottom();
        } catch (e: any) {
            if (e.name !== "CanceledError") {
                setError("메시지 전송 실패");
                // 실패 시 타이핑 제거
                setMessages((prev) => prev.filter((m) => m.id !== typingId));
            }
        } finally {
            setSending(false);
        }
    }, [conversationId, input]);

    const syncHistory = useCallback(async () => {
        if (!conversationId) return;
        safeAbort();
        const ctrl = new AbortController();
        reqRef.current = ctrl;
        try {
            const server = await getMessages(conversationId, ctrl.signal);
            const mapped: UiMessage[] = server.map((m) => ({
                id: String(m.messageId ?? crypto.randomUUID()),
                role: m.sender?.toUpperCase() === "USER" ? "user" : "bot",
                content: m.message ?? "",
                createdAt: m.createdAt ? new Date(m.createdAt).getTime() : Date.now(),
            }));
            setMessages(mapped);
            scrollToBottom();
        } catch {
            setError("히스토리 동기화 실패");
        }
    }, [conversationId]);

    useEffect(() => {
        loadScenario();
        return () => safeAbort();
    }, [loadScenario]);

    return (
        <div className="llmTuter">
            <header className="tuter-header">
                <div className="left">
                    <span className="crumb">홈</span>
                    <button className="link" onClick={loadScenario} disabled={loadingScenario || starting}>
                        {loadingScenario ? "시나리오 불러오는 중..." : "다른 시나리오"}
                    </button>
                </div>
                <div className="right">
                    {!conversationId && (
                        <button className="primary" onClick={createConversation} disabled={!scenario || starting}>
                            {starting ? "대화 생성..." : "대화 시작"}
                        </button>
                    )}
                    {conversationId && (
                        <button className="ghost" onClick={syncHistory}>
                            히스토리 동기화
                        </button>
                    )}
                </div>
            </header>

            <main className="tuter-main">
                {error && <div className="error">{error}</div>}

                <section className="scenario-box">
                    <h3>Scenario</h3>
                    {scenario ? (
                        <ul>
                            <li><b>ID</b> {scenario.scenarioId}</li>
                            <li><b>Situation</b> {scenario.situation}</li>
                            <li><b>Partner</b> {scenario.partnerRole}</li>
                        </ul>
                    ) : (
                        <p>시나리오 정보를 불러오는 중...</p>
                    )}
                </section>

                <section className="chat-box">
                    <div className="messages">
                        {messages.map((m) => (
                            <div key={m.id} className={`bubble ${m.role}`}>
                                <div className="content">{m.content}</div>
                            </div>
                        ))}
                        <div ref={bottomRef} />
                    </div>

                    <div className="composer">
                        <input
                            placeholder="메시지를 입력하세요..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    sendUserMessage();
                                }
                            }}
                            disabled={!conversationId || sending}
                        />
                        <button className="primary" onClick={sendUserMessage} disabled={!conversationId || sending || !input.trim()}>
                            보내기
                        </button>
                    </div>
                </section>
            </main>

            <NavBar />
        </div>
    );
}
