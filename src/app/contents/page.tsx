"use client";

import "../../styles/contents.css";
import { useRouter } from "next/navigation";
import NavBar from "../../components/NavBar";
import Image from "next/image";

export default function ContentsPage() {
    const router = useRouter();

    return (
        <div className="contents">
            <div className="contents-title">콘텐츠</div>
            <div className="contents-4menu">
                <div
                    className="contents-menu"
                    style={{ backgroundColor: "#DCF0F9" }}
                    onClick={() => router.push("/contents/list?type=culture")}
                >
                    <span>조직 문화</span>
                    <Image
                        src="/images/culture.png"
                        alt="조직문화"
                        width={39}
                        height={39}
                    />
                </div>

                <div
                    className="contents-menu"
                    style={{ backgroundColor: "#EAE7FB" }}
                    onClick={() => router.push("/contents/list?type=manner")}
                >
                    <span>비즈니스 매너</span>
                    <Image
                        src="/images/manner.png"
                        alt="비즈니스 매너"
                        width={45}
                        height={32}
                    />
                </div>

                <div
                    className="contents-menu"
                    style={{ backgroundColor: "#FFF9CC" }}
                    onClick={() => router.push("/contents/list?type=tip")}
                >
                    <span>업무 꿀팁</span>
                    <Image
                        src="/images/tip.png"
                        alt="업무 꿀팁"
                        width={28}
                        height={39}
                    />
                </div>

                <div
                    className="contents-menu"
                    style={{ backgroundColor: "#E2F2DD" }}
                    onClick={() => router.push("/contents/list?type=money")}
                >
                    <span>금융 생활</span>
                    <Image
                        src="/images/money.png"
                        alt="금융 생활"
                        width={40}
                        height={40}
                    />
                </div>
            </div>
            <NavBar />
        </div>
    );
}
