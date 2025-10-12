"use client";

import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import NavBar from "../../../components/NavBar";
// import BackNavigator from "@/components/backButton";
import Image from "next/image";
import "@/styles/contentsList.css";

export default function ContentsList() {
    const searchParams = useSearchParams();
    const type = searchParams.get("type"); // "culture" | "manner" | "tip" | "money"

    const router = useRouter();
    const handleBack = () => {
        router.back();
    };

    // 클릭 핸들러 예시
    const handleClick = (index: number) => {
        if (index === 0) {
            router.push(`/contents/detail?type=${type}&id=${index}`);
        } else {
            // 나머지 클릭 → 공개 예정
            alert("공개 예정입니다.");
        }
    };

    // 조직문화 (culture)
    const cultureList = [
        {
            img: "/images/cultureImg/menu1.png",
            listTitle: "첫 출근 전 준비 체크리스트",
            listSubText: "출근 당일, 당황하지 않으려면 전날에 끝내야 할 것들",
        },
        {
            img: "/images/cultureImg/menu2.png",
            listTitle: "첫 회식, 어디에 앉아야 하죠?",
            listSubText: "자리 선택이 눈치 싸움일 땐, 이 원칙만 기억하세요",
        },
        {
            img: "/images/cultureImg/menu3.png",
            listTitle: "팀 소개 시 자기소개 매너",
            listSubText: "이름만 말하긴 아쉬워요. 딱 10초 소개가 남는 인상!",
        },
        {
            img: "/images/cultureImg/menu4.png",
            listTitle: "명함 언제부터 들고 다녀야 하나요?",
            listSubText: "신입도 명함이 필요할까요? 주는 타이밍부터 정리해드려요",
        },
        {
            img: "/images/cultureImg/menu5.png",
            listTitle: "인수인계 받을 때 주의할 점",
            listSubText: "받기만 하지 마세요. 질문이 곧 생존 전략",
        },
    ];

    // 비즈니스 매너 (manner)
    const mannerList = [
        {
            img: "/images/mannerImg/menu1.png",
            listTitle: "명함 건넬 땐 어떻게 건네야 하나요?",
            listSubText: "‘잘 챙긴 명함 한 장’의 힘",
        },
        {
            img: "/images/mannerImg/menu2.png",
            listTitle: "전화받을 땐 뭐라고 말해야 할까?",
            listSubText: "프로와 아마추어를 가르는 전화 용어",
        },
        {
            img: "/images/mannerImg/menu3.png",
            listTitle: "차 안에서의 예의, 센스 있는 자리 선택법",
            listSubText: "상석과 하석 구분법",
        },
        {
            img: "/images/mannerImg/menu4.png",
            listTitle: "이메일/메시지, 어떤 표현이 좋을까요?",
            listSubText: "존댓말 이모티콘 사용 가이드",
        },
        {
            img: "/images/mannerImg/menu5.png",
            listTitle: "업무 메일의 기본 포맷, 이렇게 시작하고 마무리하세요",
            listSubText: "제목, 인사말, 정보부, 서명까지 예시 포함",
        },
    ];

    // 업무 꿀팁 (tip)
    const tipList = [
        {
            img: "/images/tipImg/menu1.png",
            listTitle: "보기 좋은 파일 저장명",
            listSubText: "파일명 작명법 정리",
        },
        {
            img: "/images/tipImg/menu2.png",
            listTitle: "실무에서 배우는 엑셀 단축키",
            listSubText: "초보도 써먹을 핵심 단축키 모음",
        },
        {
            img: "/images/tipImg/menu3.png",
            listTitle: "보고서 첫 줄이 제일 중요해요",
            listSubText: "두괄식 구성의 원칙",
        },
        {
            img: "/images/tipImg/menu4.png",
            listTitle: "업무 메모는 어디에, 어떻게 남겨야 할까?",
            listSubText: "협업 가능한 정리 습관 만들기",
        },
        {
            img: "/images/tipImg/menu5.png",
            listTitle: "회의록은 구조가 전부",
            listSubText: "포맷 없이도 빠르게 정리하는 법",
        },
    ];

    // 금융 생활 (money)
    const moneyList = [
        {
            img: "/images/moneyImg/menu1.png",
            listTitle: "사회초년생이 돈 모으려면, 통장 쪼개기가 필요한 이유",
            listSubText: "급여·저축·소비 계좌 분리",
        },
        {
            img: "/images/moneyImg/menu2.png",
            listTitle: "월말 통장 잔고가 0원이 되는 이유",
            listSubText: "사회초년생이 빠지기 쉬운 지출 함정 정리",
        },
        {
            img: "/images/moneyImg/menu3.png",
            listTitle: "비상금 통장 만들기 가이드",
            listSubText: "얼마가 적당할까, 어떻게 따로 모을까",
        },
        {
            img: "/images/moneyImg/menu4.png",
            listTitle: "신용카드 사용법 A to Z",
            listSubText: "발급부터 연체 주의까지 사회초년생 카드 가이드",
        },
        {
            img: "/images/moneyImg/menu5.png",
            listTitle: "초년생 금융상품 비교",
            listSubText: "청년도약계좌, 적금, 예금 뭐가 나에게 맞을까?",
        },
    ];

    return (
        <div className="Each-contents">
            <div className="contentsList">
                {type === "culture" && (
                    <div className="contentsList-box">
                        <div className="contentsList-top-box">
                            <div className="contentsList-top-title">
                                <Image
                                    src="/images/backNavigator.webp"
                                    alt="뒤로가기"
                                    onClick={handleBack}
                                    width={12}
                                    height={24}
                                />
                                <div className="contentsList-title">조직 문화</div>
                            </div>
                            <div className="contentsList-top-comments">
                                <span>
                                    함께 일하는 법을 배우는 첫 걸음, <br />
                                    회사 안의 &apos;눈에 안 보이는 룰&apos;을 알려드릴게요.
                                </span>
                                <Image src="/images/culture.png" alt="조직 문화" width={38} height={38} />
                            </div>
                        </div>
                        <div className="contentsList-menu-list">
                            {cultureList.map((item, index) => {
                                const bgColors = ["#E5F8FF", "#E2F2DD", "#FFE7E7", "#FFF9CC", "#CCEBF1"];
                                return (
                                    <div className="contentsList-menu-list-ImgBox" key={index} onClick={() => handleClick(index)}>
                                        <div
                                            className="contentsList-menu-list-img-bg"
                                            style={{ backgroundColor: bgColors[index % bgColors.length] }}
                                        >
                                            <Image src={item.img} alt={item.listTitle} width={32} height={32} />
                                        </div>
                                        <div className="contentsList-menu-list-text">
                                            <span>{item.listTitle}</span>
                                            <span>{item.listSubText}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
                {type === "manner" && (
                    <div className="contentsList-box">
                        <div className="contentsList-top-box">
                            <div className="contentsList-top-title">
                                <Image
                                    src="/images/backNavigator.webp"
                                    alt="뒤로가기"
                                    onClick={handleBack}
                                    width={12}
                                    height={24}
                                />
                                <div className="contentsList-title">비즈니스 매너</div>
                            </div>
                            <div className="contentsList-top-comments">
                                <span>
                                    &apos;눈치&apos; 대신 확신을 갖고 행동할 수 있도록,<br />
                                    비즈니스 현장의 기본 예절을 알려드릴게요.
                                </span>
                                <Image src="/images/manner.png" alt="비즈니스 매너" width={55} height={39} />
                            </div>
                        </div>
                        <div className="contentsList-menu-list">
                            {mannerList.map((item, index) => {
                                const bgColors = ["#E5F8FF", "#E2F2DD", "#FFE7E7", "#FFF9CC", "#CCEBF1"];
                                return (
                                    <div className="contentsList-menu-list-ImgBox" key={index} onClick={() => handleClick(index)}>
                                        <div
                                            className="contentsList-menu-list-img-bg"
                                            style={{ backgroundColor: bgColors[index % bgColors.length] }}
                                        >
                                            <Image src={item.img} alt={item.listTitle} width={32} height={32} />
                                        </div>
                                        <div className="contentsList-menu-list-text">
                                            <span>{item.listTitle}</span>
                                            <span>{item.listSubText}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
                {type === "tip" && (
                    <div className="contentsList-box">
                        <div className="contentsList-top-box">
                            <div className="contentsList-top-title">
                                <Image
                                    src="/images/backNavigator.webp"
                                    alt="뒤로가기"
                                    onClick={handleBack}
                                    width={12}
                                    height={24}
                                />
                                <div className="contentsList-title">업무 꿀팁</div>
                            </div>
                            <div className="contentsList-top-comments">
                                <span>
                                    실무의 디테일이 곧 실력입니다. <br />
                                    몰랐던 업무 요령을 차근차근 익혀보세요.
                                </span>
                                <Image src="/images/tip.png" alt="업무 꿀틴" width={27} height={38} />
                            </div>
                        </div>
                        <div className="contentsList-menu-list">
                            {tipList.map((item, index) => {
                                const bgColors = ["#E5F8FF", "#E2F2DD", "#FFE7E7", "#FFF9CC", "#CCEBF1"];
                                return (
                                    <div className="contentsList-menu-list-ImgBox" key={index} onClick={() => handleClick(index)}>
                                        <div
                                            className="contentsList-menu-list-img-bg"
                                            style={{ backgroundColor: bgColors[index % bgColors.length] }}
                                        >
                                            <Image src={item.img} alt={item.listTitle} width={32} height={32} />
                                        </div>
                                        <div className="contentsList-menu-list-text">
                                            <span>{item.listTitle}</span>
                                            <span>{item.listSubText}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
                {type === "money" && (
                    <div className="contentsList-box">
                        <div className="contentsList-top-box">
                            <div className="contentsList-top-title">
                                <Image
                                    src="/images/backNavigator.webp"
                                    alt="뒤로가기"
                                    onClick={handleBack}
                                    width={12}
                                    height={24}
                                />
                                <div className="contentsList-title">금융 생활</div>
                            </div>
                            <div className="contentsList-top-comments">
                                <span>
                                    첫 월급부터 퇴사까지, 돈 관리도 사회생활의 일부예요. <br />
                                    사회초년생을 위한 똑똑한 금융 습관을 도와드릴게요.
                                </span>
                                <Image src="/images/money.png" alt="업무 꿀틴" width={35} height={35} />
                            </div>
                        </div>
                        <div className="contentsList-menu-list">
                            {moneyList.map((item, index) => {
                                const bgColors = ["#E5F8FF", "#E2F2DD", "#FFE7E7", "#FFF9CC", "#CCEBF1"];
                                return (
                                    <div className="contentsList-menu-list-ImgBox" key={index} onClick={() => handleClick(index)}>
                                        <div
                                            className="contentsList-menu-list-img-bg"
                                            style={{ backgroundColor: bgColors[index % bgColors.length] }}
                                        >
                                            <Image src={item.img} alt={item.listTitle} width={32} height={32} />
                                        </div>
                                        <div className="contentsList-menu-list-text">
                                            <span>{item.listTitle}</span>
                                            <span>{item.listSubText}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            <NavBar />
        </div>
    );
}
