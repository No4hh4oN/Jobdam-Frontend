"use client";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

type Mode = ScrollBehavior; // "auto" | "smooth"
type Options = { bottomOffset?: number };

export function useAutoScroll<T extends HTMLElement = HTMLDivElement>(
  options: Options = {}
) {
  const { bottomOffset = 0 } = options;

  // 스크롤 컨테이너 & 센티넬
  const listRef = useRef<T | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const [atBottom, setAtBottom] = useState(true);
  const rafRef = useRef<number | null>(null);

  // 하단 판정: 센티넬 가시성 기반 (가장 안정적)
  useEffect(() => {
  const root = listRef.current;
  const target = bottomRef.current;
  if (!root || !target) return;

  const io = new IntersectionObserver(
    (entries) => setAtBottom(entries[0].isIntersecting),
    {
      root,
      threshold: 0.01,
      // composer 높이만큼 하단 여유를 뺍니다.
      rootMargin: `0px 0px -${bottomOffset}px 0px`,
    }
  );

  io.observe(target);
  return () => io.disconnect();
}, [bottomOffset]);

  const onScroll = useCallback(() => {
    // 필요 시 훅 외부에서 구독할 수 있도록 noop 반환
  }, []);

  const scrollToBottom = useCallback(
  (behavior: Mode = "smooth", force = false) => {
    const list = listRef.current;
    const bottom = bottomRef.current;
    if (!list || !bottom) return;

    if (!force && !atBottom) return;

    // 1) 동기 스냅 (가장 신뢰도 높음)
    list.scrollTop = list.scrollHeight;

    // 2) 레이아웃 확정(이미지/폰트 등) 다음 프레임에서 한 번 더
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      // 우선 순정 top 스냅
      list.scrollTop = list.scrollHeight;

      // 3) 마지막으로 센티넬을 기준으로 align (iOS 등 호환)
      bottom.scrollIntoView({ behavior, block: "end" });

      // 4) 아주 드물게 또 변동되는 경우를 위해 한 프레임 더 보정
      requestAnimationFrame(() => {
        list.scrollTop = list.scrollHeight;
      });
    });
  },
  [atBottom]
);

  // 최초 마운트 시 한 번 붙이기
  useLayoutEffect(() => {
    scrollToBottom("auto", true);
  }, [scrollToBottom]);

  return { listRef, bottomRef, atBottom, onScroll, scrollToBottom };
}
