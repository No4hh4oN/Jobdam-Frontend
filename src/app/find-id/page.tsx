/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import BackNavigator from "@/components/backButton";
import { useRouter } from 'next/navigation';
import { useState, ChangeEvent } from "react";
import '../../styles/find.css';
import AxiosClient from "../AxiosClient";

interface EmailVerificationState {
    userEmail: string;
    authCode: string;
}

export default function FindId() {
    const router = useRouter();
    const [userId, setUserId] = useState<string | null>(null);
    const [step, setStep] = useState<"empty" | "filled" | "complete">("empty");
    const [emailVerify, setEmailVerify] = useState<EmailVerificationState>({
        userEmail: "",
        authCode: "",
    });

    const handleEmailVerifyChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEmailVerify((prev) => {
            const newState = { ...prev, [name]: value };

            if (name === "authCode" && value.trim() !== "") {
                setStep("filled");
            }

            return newState;
        });
    }

    // 회원가입 인증번호 전송
    const handleSendCode = async () => {
        try {
            const res = await AxiosClient.post(`/join/sendAuthEmail`, null, {
                params: {
                    userEmail: emailVerify.userEmail,
                    type: "find",
                },
            });
            console.log(res)
            alert("인증번호가 이메일로 전송되었습니다.");
        } catch (e: any) {
            console.log(e)
        }
    }

    // 이메일 인증 확인
    const handleCheckEmail = async () => {
        try {
            const authCodeNumber = parseInt(emailVerify.authCode, 10);
            if (isNaN(authCodeNumber)) {
                alert("인증번호를 숫자로 입력해주세요.");
                return;
            }
            const res = await AxiosClient.post(`/join/authEmail`, null, {
                params: {
                    userEmail: emailVerify.userEmail,
                    authCode: authCodeNumber, //여기서 number로 변환해서 전송
                    type: "find",
                },
            });
            alert("이메일 인증 완료");
            
            setUserId(res.data.id);
            setStep("complete");

        } catch (error) {
            console.error(error);
            alert("이메일 인증 실패");
        }
    };

    return (
        <div className="FindIdContainer">
            <BackNavigator />
            <div className="FindId-Intro-Box">
                <span className="FindId-Intro-Title">
                    아이디 찾기
                </span>
                {step !== "complete" &&
                    <div className="FindId-Intro-subTitle">
                        회원가입에 등록한 이메일을 입력해주세요.
                    </div>
                }
                {step === "complete" &&
                    <div className="FindId-Intro-subTitle">
                        해당 이메일과 일치하는 아이디를 찾았어요.
                    </div>
                }
            </div>
            {step !== "complete" &&
                <div className="findId-Verify-Box">
                    <div className="EmailForm">
                        <input id="email" type="email" name="userEmail" placeholder="이메일을 입력해주세요."
                            value={emailVerify.userEmail}
                            onChange={handleEmailVerifyChange} />
                        <button onClick={handleSendCode}>인증번호 전송</button>
                    </div>
                    <input id="autoCode" type="text" name="authCode" placeholder="인증번호를 입력해주세요"
                        value={emailVerify.authCode}
                        onChange={handleEmailVerifyChange} />
                </div>
            }
            {step === "complete" && 
                <div className="findId-Id-Box">
                    <span className="findId-Id-Box-userId">{userId}</span>
                    <span className="findId-Id-Box-userEmail">{emailVerify.userEmail}</span>
                </div>
            }
            
            {step === "empty" &&
                <div id="empty" className="findIdButton">
                    아이디 찾기
                </div>
            }
            {step === "filled" &&
                <div id="filled" className="findIdButton" onClick={handleCheckEmail}>
                    아이디 찾기
                </div>
            }
            {step === "complete" &&
                <div className="findIdButton" onClick={() => router.push('/login')}>
                    확인
                </div>
            }
        </div>
    )
}