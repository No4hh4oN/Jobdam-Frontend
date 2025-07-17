/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import BackNavigator from "@/components/backButton";
import { useState, ChangeEvent } from "react";
import '../../styles/find.css';
import AxiosClient from "../AxiosClient";


interface FormState {
    userEmail: string;
}

export default function FindPw() {
    const [emailForm, setEmailForm] = useState<FormState>({
        userEmail: "",
    })

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEmailForm((prev) => ({ ...prev, [name]: value }));
    };

    const sendCode = async () => {
        try {
            const res = await AxiosClient.post('/auth/emailCode', {
                email: emailForm.userEmail,
            });
            alert("인증번호가 이메일로 전송되었습니다.");
        } catch (e: any) {
            console.log(e);
        }
    }

    const [verifyCode, setVerifyCode] = useState("");
    const [userId, setUserId] = useState<string>("");

    const handleVerify = async () => {
        try {
            const res = await AxiosClient.post('/auth/verifyNum', {
                verifyCode: verifyCode,
            });
            setUserId(res.data.userId);
        } catch (e: any) {
            console.log(e);
        }
    }

    return (
        <div className="FindIdContainer">
            <BackNavigator />
            <div className="FindId-Intro-Box">
                <span className="FindId-Intro-Title">
                    아이디 찾기
                </span>
                <div className="FindId-Intro-subTitle">
                    회원가입에 등록한 이메일을 입력해주세요.
                </div>
            </div>
            <div className="findId-Verify-Box">
                <div className="EmailForm">
                    <input id="email" type="text" name="userEmail" placeholder="이메일을 입력해주세요."
                        value={emailForm.userEmail}
                        onChange={handleChange} />
                    <button>인증번호 전송</button>
                </div>
                <input id="verifyCode" type="text" name="verifyCode" placeholder="인증번호를 입력해주세요"
                    value={verifyCode}
                    onChange={(e) => setVerifyCode(e.target.value)} />
            </div>
            <div className="findIdButton" onClick={handleVerify}>
                아이디 찾기
            </div>
        </div>
    )
}