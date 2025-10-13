// app/llmTuter/page.tsx
"use client";

import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import NavBar from "../../components/NavBar";
import { getRandomScenario, Scenario, getMyProfile, MyProfile } from "../api/chatapi";
import "./llmTuter.css";

// "Leader" → "상사" 치환 (대소문자/공백 안전)
function normalizeRole(role?: string): string {
    const r = (role ?? "").trim();
    if (/^leader$/i.test(r)) return "상사";
    return r;
}

export default function LlmTuter() {
    const router = useRouter();
    const [scenario, setScenario] = useState<Scenario | null>(null);
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState<string | null>(null);
    const abortRef = useRef<AbortController | null>(null);

    const safeAbort = () => abortRef.current?.abort();

    const loadScenario = useCallback(async () => {
        safeAbort();
        const ctrl = new AbortController();
        abortRef.current = ctrl;
        setLoading(true);
        setErr(null);
        try {
            const s = await getRandomScenario(ctrl.signal);
            setScenario(s);
        } catch (e: any) {
            if (e.name !== "CanceledError") setErr("시나리오 로드 실패");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadScenario();
        return () => safeAbort();
    }, [loadScenario]);

    // 표시용으로 치환된 시나리오
    const scenarioForUI = useMemo<Scenario | null>(() => {
        if (!scenario) return null;
        return { ...scenario, partnerRole: normalizeRole(scenario.partnerRole) };
    }, [scenario]);

    const goChat = () => {
        if (!scenarioForUI) return;
        // 세션 저장 시에도 치환된 값으로 저장
        sessionStorage.setItem(`scenario:${scenarioForUI.scenarioId}`, JSON.stringify(scenarioForUI));
        router.push(`/chat/${scenarioForUI.scenarioId}`);
    };

    const [me, setMe] = useState<MyProfile | null>(null);
    const [profileErr, setProfileErr] = useState<string | null>(null);
    const profAbortRef = useRef<AbortController | null>(null);

    const loadProfile = useCallback(async () => {
        // 이전 요청 취소
        profAbortRef.current?.abort();

        // 올바른 생성
        const ctrl = new AbortController();
        profAbortRef.current = ctrl;

        setProfileErr(null);
        try {
            const p = await getMyProfile(ctrl.signal);
            setMe(p);
        } catch (e: any) {
            // Axios 취소는 조용히 무시
            if (e?.name === "CanceledError" || e?.code === "ERR_CANCELED") return;
            const status = e?.response?.status;
            setProfileErr(status === 401 ? "로그인이 필요합니다." : "프로필을 불러오지 못했습니다.");
        }
    }, []);

    useEffect(() => {
        loadProfile();
        return () => profAbortRef.current?.abort();
    }, [loadProfile]);

    return (
        <div className="llmTuter">
            <div className="tuter-main">
                <span className="crumb">홈</span>
                {err && <div className="error">{err}</div>}
                {scenarioForUI ? (
                    <div className="scenariro">
                        {scenarioForUI.partnerRole}와{" "}
                        {scenarioForUI.situation}
                        상황에서의 대화입니다.<br />
                        {me?.userNm && <span id="userIdTuter">{me.userNm}</span>}
                        님은 어떻게 대화를 하실건가요?
                    </div>
                ) : (
                    <p>시나리오 정보를 불러오는 중...</p>
                )}
                <Image className="scenarioImg" src="/images/scenario.png" alt="시나리오" width={393} height={272} />
                <button className="goChat" onClick={goChat} disabled={!scenarioForUI || loading}>시작하기</button>

                <span className="hotContents-Title">요즘 많이 찾는 콘텐츠</span>
                <div className="hotContentsList">
                    <div className="hotContents">
                        <span id="wrapper1" className="hotContentImg-Wrapper">
                            <Image src="/images/cultureImg/menu1.png" alt="상황1" width={32} height={32} />
                        </span>
                        <div className="hotContent">
                            <span className="hotContent-title">첫 출근 전 준비 체크리스트</span>
                            <span className="hotContent-body">출근 당일, 당황하지 않으려면 전날에 끝내야 할 것들</span>
                        </div>
                    </div>
                    <div className="hotContents">
                        <span id="wrapper2" className="hotContentImg-Wrapper">
                            <Image src="/images/cultureImg/menu2.png" alt="상황2" width={32} height={32} />
                        </span>
                        <div className="hotContent">
                            <span className="hotContent-title">첫 회식, 어디에 앉아야 하죠?</span>
                            <span className="hotContent-body">자리 선택이 눈치 싸움일 땐, 이 원칙만 기억하세요</span>
                        </div>
                    </div>
                </div>
            </div>

            <NavBar />
        </div>
    );
}
