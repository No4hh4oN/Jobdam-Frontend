// app/api/chatapi.ts
import AxiosClient from "../AxiosClient";

export interface Scenario {
  scenarioId: number;
  situation: string;
  partnerRole: string;
}

export interface ChatMessage {
  messageId?: number;
  turnNumber?: number;
  sender: "USER" | "AI" | string;
  message: string;
  createdAt?: string;
}

// --- 교정 타입 ---
export interface CorrectionItem {
  messageId: number;
  userMessage: string;
  correctedMessage: string;
  explanation: string;
}

export async function getRandomScenario(signal?: AbortSignal): Promise<Scenario> {
  const res = await AxiosClient.get<Scenario>("/scenario/random", { signal, headers: { Accept: "*/*" } });
  return res.data;
}

export async function startConversation(scenarioId: number, signal?: AbortSignal): Promise<number> {
  const res = await AxiosClient.post<number>("/conversation/start", "",
    { params: { scenarioId }, signal, headers: { Accept: "*/*", "Content-Type": "application/x-www-form-urlencoded" } }
  );
  return Number(res.data);
}

export async function askGpt(conversationId: number, message: string, signal?: AbortSignal): Promise<string> {
  const res = await AxiosClient.post<{ content: string }>(
    "/gpt/ask",
    { message },
    { params: { conversationId }, signal, headers: { Accept: "*/*", "Content-Type": "application/json" } }
  );
  return res.data?.content ?? "";
}

export async function getMessages(conversationId: number, signal?: AbortSignal): Promise<ChatMessage[]> {
  const res = await AxiosClient.get<ChatMessage[]>(`/conversation/${conversationId}/messages`,
    { signal, headers: { Accept: "*/*" } }
  );
  return res.data ?? [];
}

export interface MyProfile {
  userNm: string;
  [k: string]: any;
}

function parseProfile(data: any): MyProfile {
  const nameCandidate =
    data?.userNm && String(data.userNm).trim() !== ""
      ? data.userNm
      : data?.userId && String(data.userId).trim() !== ""
      ? data.userId
      : "JOBDAM"; // 최종 fallback

  return { userNm: String(nameCandidate), ...data };
}
export async function getMyProfile(signal?: AbortSignal): Promise<MyProfile> {
  const res = await AxiosClient.get("/user/my", {
    signal,
    headers: { Accept: "*/*" },
  });
  return parseProfile(res.data ?? {});
}

// POST /correction-note/{messageId}  (빈 바디, x-www-form-urlencoded가 안전)
export async function createCorrection(messageId: number, signal?: AbortSignal): Promise<void> {
  await AxiosClient.post(`/correction-note/${messageId}`, "",
    { signal, headers: { Accept: "*/*", "Content-Type": "application/x-www-form-urlencoded" } }
  );
}

// GET /correction-note/message/{messageId}
export async function getCorrectionsByMessage(messageId: number, signal?: AbortSignal): Promise<CorrectionItem[]> {
  const res = await AxiosClient.get<CorrectionItem[]>(`/correction-note/message/${messageId}`, {
    signal, headers: { Accept: "*/*" },
  });
  return res.data ?? [];
}