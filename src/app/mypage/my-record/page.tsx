/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import "@/styles/myRecord.css";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import BackNavigator from "../../../components/backButton";
import AxiosClient from "../../AxiosClient";
import Image from "next/image";

export default function MyRecordPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const type = searchParams.get("type"); // 'ai' 또는 'bookmark'

    const [topTitle, setTopTitle] = useState("");
    const [contents, setContents] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true); 

    useEffect(() => {
        if (type === "ai") {
            setTopTitle("AI 튜터 기록");
        } else if (type === "bookmark") {
            setTopTitle("북마크한 콘텐츠");
        }
    }, [type]);

    useEffect(() => {
        const fetchContents = async () => {
            setIsLoading(true);
            try {
                const response = await AxiosClient.get("/contents/my-bookmarks");
                console.log("콘텐츠 목록:", response.data);
                setContents(response.data);
            } catch (error) {
                console.error("콘텐츠 불러오기 실패:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchContents();
    }, []);

    // 추후 콘텐츠 추가되면 수정
    const getTypeById = (id: number) => {
        switch (id) {
            case 1: return "culture";
            case 6: return "manner";
            case 11: return "tip";
            case 16: return "money";
            default: return "culture";
        }
    };

    const TYPE_ID_MAP: Record<number, string> = {
        1: "culture",
        6: "manner",
        11: "tip",
        16: "money",
    };

    return (
        <div className="Mypage-Record">
            <div className="Mypage-Record-title">
                <BackNavigator />
                <span>{topTitle}</span>
            </div>

            {type === "ai" && (
                <div className="my-ai-record">
                    {isLoading ? (
                        <div className="loadingWrapper3">
                            <div className="typing">
                                <i></i><i></i><i></i>
                            </div>
                        </div>
                    ) : contents.length === 0 ? (
                        <p>아직 AI 튜터와 시뮬레이션 한 기록이 없어요</p>
                    ) : (
                        <div className="my-record-list">
                            <Image 
                                src="/images/bot.png" 
                                alt="ai-img" 
                                width={66} 
                                height={66}
                            />
                            <div className="my-ai-list-text">
                                <span>직장 상사의 발표요청</span>
                                <span>2025.10.13</span>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {type === "bookmark" && (
                <div className="my-bookmark">
                    {isLoading ? (
                        <div className="loadingWrapper3">
                            <div className="typing">
                                <i></i><i></i><i></i>
                            </div>
                        </div>
                    ) : contents.length > 0 ? (
                        contents.map((data, index) => (
                            <div
                                className="my-record-list"
                                key={index}
                                style={{ cursor: "pointer" }}
                                onClick={() => {
                                    const itemType = TYPE_ID_MAP[data.id] ?? "culture"; // id로 type 매핑
                                    router.push(`/contents/detail?type=${itemType}&id=${data.id}`);
                                }}
                            >
                                <div
                                    className="my-bookmark-img-box"
                                    style={{ backgroundColor: "#E5F8FF" }}
                                >
                                    <img
                                        src={data.icon}
                                        alt="bookmark-img"
                                        width={32}
                                        height={32}
                                    />
                                </div>
                                <div className="my-bookmark-list-text">
                                    <span>{data.title}</span>
                                    <span>{data.subtitle}</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>북마크한 콘텐츠가 없습니다.</p>
                    )}
                </div>
            )}

            {!type && <p>유효하지 않은 접근입니다.</p>}
        </div>
    );
}
