/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import "@/styles/editUserInfo.css";
import { useRouter } from "next/navigation";
import BackNavigator from "../../../components/backButton";
import { useState, useEffect } from "react";
import AxiosClient from "../../AxiosClient";


export default function EditUserInfo() {
    const router = useRouter();

    // 이메일 관련 상태
    const [isEditingEmail, setIsEditingEmail] = useState(false);
    const [email, setEmail] = useState("");
    const [verifyCode, setVerifyCode] = useState("");
    const [isVerified, setIsVerified] = useState(false);

    // 비밀번호 관련 상태
    const [isEditingPw, setIsEditingPw] = useState(false);
    const [currentPw, setCurrentPw] = useState("");
    const [newPw, setNewPw] = useState("");
    const [confirmPw, setConfirmPw] = useState("");
    const [isPwFilled, setIsPwFilled] = useState(false);

    // 이메일 버튼 클릭
    const handleEmailClick = () => {
        setIsEditingEmail(true);
        setIsVerified(false);
        setVerifyCode("");
        // 비밀번호 변경 중이면 초기화
        if (isEditingPw) {
            setIsEditingPw(false);
            setCurrentPw("");
            setNewPw("");
            setConfirmPw("");
        }
    };

    // 인증 확인 버튼 클릭
    const handleVerifyClick = () => {
        if (verifyCode.trim() !== "") {
            setIsVerified(true);
        }
    };

    // 이메일 변경 취소
    const handleCancelEmailChange = () => {
        setIsEditingEmail(false);
        setEmail("");
        setVerifyCode("");
        setIsVerified(false);
    };

    // 비밀번호 변경 버튼 클릭
    const handlePwClick = () => {
        setIsEditingPw(true);
        if (isEditingEmail) {
            handleCancelEmailChange();
        }
    };

    // 비밀번호 변경 취소
    const handleCancelPwChange = () => {
        setIsEditingPw(false);
        setCurrentPw("");
        setNewPw("");
        setConfirmPw("");
    };

    // 비밀번호 변경 버튼 활성화 여부
    useEffect(() => {
        setIsPwFilled(!!(currentPw && newPw && confirmPw));
    }, [currentPw, newPw, confirmPw]);

    // 비밀번호 조건 검사 (영문, 숫자, 특수문자 포함 8~20자)
    const isValidPassword = (pw: string) => {
        const pwRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+{}[\]:;<>,.?~\\/-]).{8,20}$/;
        return pwRegex.test(pw);
    };

    const handleChangePw = async () => {
        try {
            // 현재 비밀번호 검증 API 요청
            const res = await AxiosClient.post("/api경로 들어감", {
                currentPw,
            });
            if (!res.data.isValid) {
                alert("현재 비밀번호가 일치하지 않습니다.");
                return;
            }
            if (!isValidPassword(newPw)) {
                alert("비밀번호 조건을 확인해주세요.");
                return;
            }
            if (newPw !== confirmPw) {
                alert("비밀번호가 일치하지 않습니다.");
                return;
            }
            alert("비밀번호가 성공적으로 변경되었습니다!");
            handleCancelPwChange();
        } catch (error) {
            console.error(error);
            alert("비밀번호 확인 중 오류가 발생했습니다.");
        }
    };


    return (
        <div className="Edit-UserInfo-Container">
            <BackNavigator />

            <div className="Edit-UserInfo-Intro-Box">
                <span className="Edit-UserInfo-Intro-Title">회원정보 수정</span>
            </div>

            <div className="Edit-Email-or-Pw-Box">
                {/* 이메일 수정 영역 */}
                <div className="Edit-Form-Box">
                    <span className="Edit-Form-title">이메일</span>
                    <div className="Edit-Email-Box">
                        <input
                            id="EditEmail"
                            type="email"
                            name="userEmail"
                            value={email}
                            className={isEditingEmail ? "editing-email-input" : ""}
                            placeholder={
                                isEditingEmail
                                    ? "변경할 이메일을 입력해주세요"
                                    : "aaa@aaa.com"
                            }
                            readOnly={!isEditingEmail}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="off"
                        />
                        <button onClick={handleEmailClick}>
                            {isEditingEmail ? "인증번호 받기" : "이메일 변경"}
                        </button>
                    </div>

                    {isEditingEmail && (
                        <div className="Edit-Save-New-Email">
                            <div className="Edit-Email-Verify-Box">
                                <input
                                    id="EditEmailVerify"
                                    type="text"
                                    className="editing-verify-input"
                                    placeholder="인증번호를 입력해주세요"
                                    value={verifyCode}
                                    onChange={(e) => setVerifyCode(e.target.value)}
                                    readOnly={isVerified}
                                    autoComplete="off"
                                />
                                <button
                                    onClick={handleVerifyClick}
                                    className={!isVerified && verifyCode.length > 0 ? "active" : ""}
                                    disabled={isVerified}
                                >
                                    {isVerified ? "인증완료" : "확인"}
                                </button>
                            </div>
                            <div className="Save-New-Email-btn">
                                <button onClick={handleCancelEmailChange}>이메일 변경 취소</button>
                                <button>변경 이메일 저장</button>
                            </div>
                        </div>
                    )}
                </div>

                {/* 비밀번호 수정 영역 */}
                <div className="Edit-Form-Box">
                    <span className="Edit-Form-title" style={{ marginTop: "25px" }}>
                        비밀번호
                    </span>
                    <div className="Edit-Pw-Box">
                        <input
                            id="EditPw"
                            type="password"
                            placeholder={isEditingPw ? "현재 비밀번호를 입력해주세요" : "**********"}
                            readOnly={!isEditingPw}
                            value={currentPw}
                            onChange={(e) => setCurrentPw(e.target.value)}
                            className={isEditingPw ? "editing-current-pw" : ""}
                        />
                        <button
                            onClick={isEditingPw ? handleCancelPwChange : handlePwClick}
                            className={isEditingPw ? "cancel-pw-btn" : ""}
                        >
                            {isEditingPw ? "비밀번호 변경 취소" : "비밀번호 변경"}
                        </button>
                    </div>

                    {isEditingPw && (
                        <div className="Edit-NewPw-input-Box">
                            <input
                                id="NewPw"
                                type="password"
                                placeholder="새로운 비밀번호를 입력해주세요"
                                value={newPw}
                                onChange={(e) => setNewPw(e.target.value)}
                            />
                            <input
                                id="ConfirmPw"
                                type="password"
                                placeholder="새로운 비밀번호를 확인해주세요"
                                value={confirmPw}
                                onChange={(e) => setConfirmPw(e.target.value)}
                            />
                            <span>비밀번호는 8~20자의 영문, 숫자, 특수문자를 포함해야 합니다.</span>
                            <button
                                onClick={handleChangePw}
                                className={`change-pw-btn ${isPwFilled ? "active" : ""}`}
                                disabled={!isPwFilled}
                            >
                                비밀번호 변경
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
