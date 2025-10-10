// app/api/chatApi.ts
import AxiosClient from "../AxiosClient";

export interface Scenario {
  scenarioId: number;
  situation: string;
  partnerRole: string;
}

export interface ChatMessage {
  messageId?: number;
  turnNumber?: number;
  sender: "USER" | "AI" | "SYSTEM" | string;
  message: string;
  createdAt?: string;
}

export async function getRandomScenario(signal?: AbortSignal): Promise<Scenario> {
  const res = await AxiosClient.get<Scenario>("/scenario/random", { signal });
  return res.data;
}

// app/api/chatApi.ts
export async function startConversation(scenarioId: number, signal?: AbortSignal): Promise<number> {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");

  const res = await AxiosClient.post<number>(
    "/conversation/start",
    "", // ✅ 빈 바디 (cURL -d ''와 동일)
    {
      params: { scenarioId: Number(scenarioId) },
      signal,
      headers: {
        Accept: "*/*",
        "Content-Type": "application/x-www-form-urlencoded", // ✅ cURL과 동일
        // 필요시 직접 토큰 주입 (인터셉터가 이미 처리하면 생략 가능)
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    }
  );
  return Number(res.data);
}


export async function askGpt(conversationId: number, message: string, signal?: AbortSignal): Promise<string> {
  const res = await AxiosClient.post<{ content: string }>(
    "/gpt/ask",
    { message }, // ✅ JSON 본문
    {
      params: { conversationId },
      signal,
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json", // ✅ 여기서만 JSON 지정
      },
    }
  );
  return res.data?.content ?? "";
}

export async function getMessages(conversationId: number, signal?: AbortSignal): Promise<ChatMessage[]> {
  const res = await AxiosClient.get<ChatMessage[]>(`/conversation/${conversationId}/messages`, {
    signal,
    headers: { Accept: "*/*" },
  });
  return res.data ?? [];
}
