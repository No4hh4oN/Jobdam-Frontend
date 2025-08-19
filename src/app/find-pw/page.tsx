"use client";

import BackNavigator from "@/components/backButton";
import { useRouter } from 'next/navigation';
import { useState, ChangeEvent } from "react";
import '../../styles/find.css';
import AxiosClient from "../AxiosClient";


interface EmailVerificationState {
    userEmail: string;
    authCode: string;
    userId: string;
}

export default function findPw() {
    const router = useRouter();
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [step, setStep] = useState<"empty" | "filled" | "change">("empty");
    const [emailVerify, setEmailVerify] = useState<EmailVerificationState>({
        userEmail: "",
        authCode: "",
        userId: "",
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
                    type: "change",
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
                    // userId: emailVerify.userId,
                    userEmail: emailVerify.userEmail,
                    authCode: authCodeNumber, //여기서 number로 변환해서 전송
                    type: "change",
                },
            });
            alert("이메일 인증 완료");

            setStep("change");
        } catch (error) {
            console.error(error);
            alert("이메일 인증 실패");
        }
    };

    //비밀번호 변경 로직
    const handleChangePassword = async () => {
        if (!newPassword || !confirmPassword) {
            alert("모든 항목을 입력해주세요.");
            return;
        }

        if (newPassword !== confirmPassword) {
            alert("비밀번호가 일치하지 않습니다.");
            return;
        }

        const authCodeNumber = parseInt(emailVerify.authCode, 10);
        try {
            const res = await AxiosClient.post("/join/chgUserPassword", null, {
                params: {
                    userEmail: emailVerify.userEmail,
                    authCode: authCodeNumber,
                    password: newPassword,
                    userId: emailVerify.userId,
                },
            });

            alert("비밀번호가 성공적으로 변경되었습니다.");
            router.push("/login");
        } catch (err) {
            console.error(err);
            alert("비밀번호 변경 실패");
        }
    }

    return (
        <div className="FindPwContainer">
            <BackNavigator />
            <div className="FindPw-Intro-Box">
                <span className="FindPw-Intro-Title">
                    비밀번호 찾기
                </span>
                
                {step !== "change" &&
                    <div className="FindPw-Intro-subTitle">
                    회원가입에 등록한 이메일을 입력해주세요.
                </div>
                }
                {step === "change" &&
                <div className="FindPw-Intro-subTitle">
                    비밀번호는 8~20자의 영문, 숫자, 특수문자를<br />
                    포함해야 합니다.
                </div>
                }
            </div>
            {step !== "change" &&
                <div className="findPw-Verify-Box">
                    <input id="userId" type="text" name="userId" placeholder="아이디를 입력해주세요."
                        value={emailVerify.userId}
                        onChange={handleEmailVerifyChange}
                    />
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
            {step === "change" &&
                <div className="findPw-Verify-Box">
                    <input
                        id="newPw"
                        type="password"
                        placeholder="새로운 비밀번호를 입력해주세요."
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <input
                        id="checkPw"
                        type="password"
                        placeholder="비밀번호를 확인해주세요."
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>
            }

            {step === "empty" &&
                <div id="empty" className="findPwButton">
                    비밀번호 찾기
                </div>
            }
            {step === "filled" &&
                <div id="filled" className="findPwButton" onClick={handleCheckEmail}>
                    비밀번호 찾기
                </div>
            }
            {step === "change" &&
                <div className="findPwButton" onClick={handleChangePassword}>
                    확인
                </div>
            }
        </div>
    )
}