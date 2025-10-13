
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import NavBar from "../../../components/NavBar";
import BackNavigator from "@/components/backButton";
import Image from "next/image";
import "@/styles/contentsDetail.css";



export default function DetailInner() {
    const searchParams = useSearchParams();
    const type = searchParams.get("type"); // "culture" | "manner" | "tip" | "money"
    const id = searchParams.get("id"); // 0, 1, 2

    const isFirstItem = id === "0";

    const router = useRouter();
    const handleBack = () => {
        router.back();
    };

    return (
        <div className="Detail-contents">
            {type === "culture" && isFirstItem && (
                <div className="detail-contents-box">
                    <div className="detail-contents-top-box">
                        <div className="detail-contents-top-Imgs">
                            <Image
                                src="/images/backNavigator.webp"
                                alt="뒤로가기"
                                onClick={handleBack}
                                width={12}
                                height={24}
                            />
                            <Image
                                src="/images/saveIcon.png"
                                alt="저장하기"
                                width={35}
                                height={35}
                            />
                        </div>
                        <div className="detail-contents-top-text">
                            <div className="detail-contents-title">
                                <span>첫 출근 전 준비 체크리스트</span>
                                <span>
                                    출근 당일, 당황하지 않으려면 <br />
                                    전날에 끝내야 할 것들
                                </span>
                            </div>
                            <Image src="/images/cultureImg/menu1.png" alt="체크리스트" width={51} height={51} />
                        </div>
                    </div> 
                    <div className="detail-contents-notice">
                        <p>
                            회사 생활, 첫날부터 잘 시작하고 싶죠. 입사 전날부터 챙기면 좋은 것들이 있어요. 준비를 잘하면 낯선 환경에도 금방 적응할 수 있어요.
                        </p>
                        <p>오늘은 첫 출근 전에 꼭 체크해야 할 것들을 정리해봤어요.</p>
                        <hr style={{ height: "1.5px", backgroundColor:"#E1E4EE" }} />
                    </div>
                    <div className="detail-contents-main-container">
                        <div className="detail-contents-mainBox-top">첫 출근 준비물</div>
                        <div className="detail-contents-mainBox">
                            <span className="detail-main-title">입사 관련 서류</span>
                            <div className="contents-mainBox">
                                <span>입사 관련 서류</span>
                                <span>
                                    서류 종류는 회사마다 달라요.
                                    다음은 기본적으로 필요한 서류들이예요.
                                </span>
                                <div className="mainBox-document-list">
                                    <span>통장 사본</span>
                                    <span>성적 증명서</span>
                                    <span>최종 학력 증명서</span>
                                    <span>주민등록등본</span>
                                    <span>자격증 사본</span>
                                </div>
                            </div>
                        </div>
                        <div className="detail-contents-mainBox">
                            <span className="detail-main-title">필기구와 메모장</span>
                            <div className="contents-mainBox">
                                <span>
                                    적극적인 자세를 보여주기 위해선 메모 습관이 중요해요.
                                    스스로 직접 챙겨온 걸 좋게 보는 사람들도 있는 데다가, 메모장이 포스트잇이라면 기록 후 잃어버릴 수 있으니 
                                    평소 사용하던 손에 익숙한 필기구를 추천해요.
                                </span>
                            </div>
                        </div>
                        <div className="detail-contents-mainBox">
                            <span className="detail-main-title">근로계약서 미리 알아보기</span>
                            <div className="contents-mainBox">
                                <span>
                                    <ul>
                                        <li>근로계약기간: 인턴이라면 기간에 맞게 작성되었는지 확인하세요.</li>
                                        <li>근무 장소: 실제 근무지가 맞는지 확인하세요.</li>
                                        <li>업무 내용: 담당 업무 범위를 확인하고, 공고 때와 다른 업무가 없는지 보세요.</li>
                                        <li>근로일&근로시간: 채용 공고 내용과 일치하는지 확인하세요.</li>
                                        <li>임금: 합의한 임금이 맞는지, 최저임금법 위반 여부, 지급 방법 등을 확인하세요.</li>
                                    </ul>
                                </span>
                            </div>
                        </div>
                    </div>

                </div>
            )}

            {type === "manner" && isFirstItem && (
                <div className="detail-contents-box">
                    <div className="detail-contents-top-box">
                        <div className="detail-contents-top-Imgs">
                            <Image
                                src="/images/backNavigator.webp"
                                alt="뒤로가기"
                                onClick={handleBack}
                                width={12}
                                height={24}
                            />
                            <Image
                                src="/images/saveIcon.png"
                                alt="저장하기"
                                width={35}
                                height={35}
                            />
                        </div>
                        <div className="detail-contents-top-text">
                            <div className="detail-contents-title">
                                <span>명함 건넬 땐 <br /> 어떻게 건네야 하나요?</span>
                                <span>‘잘 챙긴 명함 한 장’의 힘</span>
                            </div>
                            <Image src="/images/mannerImg/menu1.png" alt="명함" width={62} height={49} />
                        </div>
                    </div> 
                    <div className="detail-contents-notice">
                        <p>
                            비즈니스 관계에서 명함 교환은 첫인상을 좌우하는 중요한 순간입니다. 
                        </p>
                        <p>앞으로 함께 일하게 될 동료나 파트너와 좋은 관계를 맺기 위해 다음의 매너를 기억해 두세요.</p>
                        <hr style={{ height: "1.5px", backgroundColor:"#E1E4EE" }} />
                    </div>
                    <div className="detail-contents-main-container">
                        <div className="detail-contents-mainBox-top">
                            <span className="detail-highlight">명함 건넬 때 순서와 방향</span>이 있다?
                        </div>
                        <div className="detail-contents-mainBox">
                            <span className="detail-main-title">명함 건넬 때의 기본 예절</span>
                            <div className="contents-mainBox">
                                <span>
                                    <ul>
                                        <li>아랫사람이 윗사람에게 먼저 전달 (상급자 동행시 상급자 우선)</li>
                                        <li>이름을 손으로 가리지 않고 오른손으로 건네는 것이 기본</li>
                                        <li>상대가 바로 내용을 확인할 수 있는 방향으로 전달</li>
                                        <li>가벼운 목례와 함께 자신의 이름, 직급 등을 구두로 소개</li>
                                    </ul>
                                </span>
                            </div>
                        </div>
                        <div className="detail-sub-comment">
                            명함을 건넬 때 가벼운 미소와 함께 목례를 하며 자신의 이름과 소속, 직급 등을 간략하게 이야기하면 분위기를 유연하게 풀어내는 데 도움이 돼요. 
                        </div>
                        <div className="detail-contents-mainBox-top">
                            <span className="detail-highlight">명함을 받을 때</span>의 예절 & 명함 관리 TIP
                        </div>
                        <div className="detail-contents-mainBox">
                            <span className="detail-main-title">명함 받을 때의 기본 예절</span>
                            <div className="contents-mainBox">
                                <span>
                                    <ul>
                                        <li>명함을 받은 후 바로 넣지 않고 5초 정도 내용 숙지</li>
                                        <li>명함에 적힌 이름과 직급 부르며 한 번 더 인사 건네기</li>
                                        <li>미팅 중에는 테이블에 명함 올려 두고 수시로 정보 확인</li>
                                        <li>미팅 후에는 잊지 않고 명함 챙기기</li>
                                    </ul>
                                </span>
                            </div>
                        </div>
                        <div className="detail-sub-comment">
                            명함을 건넬 때 가벼운 미소와 함께 목례를 하며 자신의 이름과 소속, 직급 등을 간략하게 이야기하면 분위기를 유연하게 풀어내는 데 도움이 돼요. 
                        </div>
                        <div className="detail-contents-mainBox-top">유용한 <span className="detail-highlight">명함 관리 앱</span> 추천</div>
                        <div className="detail-contents-mainBox">
                            <div className="recommend-App">
                                <Image src="/images/rememberApp.png" alt="추천앱" width={48} height={48} />
                                <span>Remember 리멤버</span>
                            </div>
                            <div className="contents-mainBox">
                                <span>
                                    <ul>
                                        <li>명함 촬영하면 정보 자동 입력</li>
                                        <li>이름, 회사, 직책 등 키워드로 검색 가능</li>
                                        <li>팀 명함첩 생성 후 거래처 명함 공동 관리</li>
                                        <li>개인 커리어 관리 & 커뮤니티 통해 업계 소식 공유</li>
                                    </ul>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {type === "tip" && isFirstItem && (
                <div className="detail-contents-box">
                    <div className="detail-contents-top-box">
                        <div className="detail-contents-top-Imgs">
                            <Image
                                src="/images/backNavigator.webp"
                                alt="뒤로가기"
                                onClick={handleBack}
                                width={12}
                                height={24}
                            />
                            <Image
                                src="/images/saveIcon.png"
                                alt="저장하기"
                                width={35}
                                height={35}
                            />
                        </div>
                        <div className="detail-contents-top-text">
                            <div className="detail-contents-title">
                                <span>보기 좋은 파일 저장명</span>
                                <span>파일명 작명법 정리</span>
                            </div>
                            <Image src="/images/tipImg/menu1.png" alt="파일저장명" width={58} height={58} />
                        </div>
                    </div> 
                    <div className="detail-contents-notice">
                        <p>
                            ‘OOO제안서.pptx’로는 부족해요. 파일명만 잘 지어도, 업무가 매끄러워지고 신뢰도는 올라갑니다.
                        </p>
                        <p>상사는 매일 수십 개의 메일과 파일을 보며 ‘이게 뭔지’ 추측해야 하는 순간이 옵니다. </p>
                        <p>누가, 언제, 무슨 내용으로 보냈는지 파일명을 보면 한눈에 보여야해요. 그게 바로 일 잘하는 첫걸음이에요.</p>
                        <hr style={{ height: "1.5px", backgroundColor:"#E1E4EE" }} />
                    </div>
                    <div className="detail-contents-main-container">
                        <div className="detail-contents-mainBox-top">파일명 작성하는 법</div>
                        <div className="detail-table-box">
                            <table className="detail-file-table">
                                <thead>
                                    <tr>
                                        <th>구분</th>
                                        <th>표시법</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>연도</td>
                                        <td>2025</td>
                                    </tr>
                                    <tr>
                                        <td>파일 주제</td>
                                        <td>2025_OO제안서</td>
                                    </tr>
                                    <tr>
                                        <td>작성자</td>
                                        <td>2025_OO제안서_김잡담</td>
                                    </tr>
                                    <tr>
                                        <td>버전</td>
                                        <td>2025_OO제안서_김잡담_V1</td>
                                    </tr>
                                    <tr>
                                        <td>날짜</td>
                                        <td>2025_OO제안서_김잡담_V1_1001</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="detail-contents-mainBox">
                            <span className="detail-main-title">파일명 앞에 연도 붙이기</span>
                            <div className="contents-mainBox">
                                <span>
                                    해가 바뀌면 이전 파일을 찾기 어려워져요. 연도를 앞에 붙이면 정렬도 깔끔하고,작업물 추적도 쉬워져요.
                                </span>
                            </div>
                        </div>
                        <div className="detail-contents-mainBox">
                            <span className="detail-main-title">주제 + 작성자 + 버전은 기본</span>
                            <div className="contents-mainBox">
                                <span>
                                    누가 작성했고, 어떤 주제인지, 그리고 몇 번째 버전인지. 이 3가지를 포함하면 파일의 정체성이 한번에 보여요.
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {type === "money" && isFirstItem && (
                <div className="detail-contents-box">
                    <div className="detail-contents-top-box">
                        <div className="detail-contents-top-Imgs">
                            <Image
                                src="/images/backNavigator.webp"
                                alt="뒤로가기"
                                onClick={handleBack}
                                width={12}
                                height={24}
                            />
                            <Image
                                src="/images/saveIcon.png"
                                alt="저장하기"
                                width={35}
                                height={35}
                            />
                        </div>
                        <div className="detail-contents-top-text">
                            <div className="detail-contents-title">
                                <span>
                                    사회초년생이 돈 모으려면, <br />
                                    통장 쪼개기가 필요한 이유
                                </span>
                                <span>급여·저축·소비 계좌 분리</span>
                            </div>
                            <Image src="/images/moneyImg/menu1.png" alt="계좌" width={48} height={48} />
                        </div>
                    </div> 
                    <div className="detail-contents-notice">
                        <p>
                            통장 쪼개기란, 급여통장에 월급을 받자마자 용도별 통장에 돈을 넣어 관리하는 걸 의미해요.
                        </p>
                        <p>씀씀이가 커지는 건 한순간이지만, 나중에 줄이려면 쉽지 않기 때문에 사회초년생에게 통장 쪼개기는 꼭 필요해요.</p>
                        <hr style={{ height: "1.5px", backgroundColor:"#E1E4EE" }} />
                    </div>
                    <div className="detail-contents-main-container">
                        <div className="detail-contents-mainBox-top">
                            <span className="detail-highlight">어떤 용도로, 몇 개로</span> 쪼개는 게 좋은가요?</div>
                        <div className="detail-main-title-sub" style={{marginTop:"30px"}}>1. 급여통장</div>
                        <div className="contents-mainBox-sub">
                            <span>
                                적극적인 자세를 보여주기 위해선 메모 습관이 중요해요.
                                스스로 직접 챙겨온 걸 좋게 보는 사람들도 있는 데다가, 메모장이 포스트잇이라면 기록 후 잃어버릴 수 있으니 
                                평소 사용하던 손에 익숙한 필기구를 추천해요.
                            </span>
                        </div>
                        <div className="detail-main-title-sub">2. 저축/투자 통장</div>
                        <div className="contents-mainBox-sub">
                            <span>
                                예금, 적금, 주식 투자, 주택 청약 등 재테크를 위한 통장이에요. 돈을 남는 돈을 모으는 게 아니라, 모으고 남는 돈을 써야 해요.
                                <br /><br />
                                급여통장에서 예적금 통장으로 바로 입금하는 방법도 있고, 별도로 저축/투자용 통장을 만들어 재테크 자금을 모두 넣어놔도 좋아요. 수시 입출금이 가능하면서, 이자도 받을 수 있는 파킹통장을 활용해보세요.
                            </span>
                        </div>
                        <div className="detail-main-title-sub">3. 생활비</div>
                        <div className="contents-mainBox-sub">
                            <span>
                                매달 쓸 생활비를 넣어놓는 통장이에요. 얼마를 넣어야 하는지 고민된다면, 우선 한 달 고정지출이 얼마나 되는지 계산해보세요. 생활비 통장 역시 입출금통장을 활용하고, 체크카드를 연결해서 바로 쓸 수 있도록 해두면 편해요.
                            </span>
                        </div>        
                        <div className="detail-main-title-sub">4. 비상금</div>
                        <div className="contents-mainBox-sub">
                            <span>
                                갑자기 큰 돈이 필요할 때가 있죠. 몸이 아파 수술을 받아야 하거나, 가까운 지인의 경조사가 여기에 해당돼요. 이런 돈을 생활비 통장에서 해결하려면 예산이 초과되겠죠. 미리 비상금 통장을 만들어 두고 꺼내 쓰는 걸 추천해요.
                            </span>
                        </div>      
                        <div className="detail-main-title-sub">5. 기타</div>
                        <div className="contents-mainBox-sub">
                            <span>
                                소비생활은 사람마다 많이 다르기 때문에 각자 필요에 따라 통장을 더 만들면 돼요. 예를 들어, 취미생활에 돈이 필요하다면 취미통장을 따로 만들고, 취미생활을 할 때는 그 통장에 있는 돈으로 소비해요.
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}