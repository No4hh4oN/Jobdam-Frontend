/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, ChangeEvent } from "react";
import AxiosClient from "../AxiosClient";
import BackNavigator from "@/components/backButton";
import '../../styles/signup.css';


interface FormState {
    userId: string;
    userPassword: string;
    userNm: string;
    userEmail: string;
    authCode:Int32Array;
}

interface EmailVerificationState {
    userEmail: string;
}

export default function Signup() {

    const [form, setForm] = useState<FormState>({
        userEmail: "",
        userId: "",
        userPassword: "",
        userNm: "",
        authCode : new Int32Array(),
    });

    const [emailVerify, setEmailVerify] = useState<EmailVerificationState>({
        userEmail: "",
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleEmailVerifyChange = (e:ChangeEvent<HTMLInputElement>)=>{
        const {name,value}=e.target;
        setEmailVerify((prev) => ({ ...prev, [name]: value }));
    }

    // const handleSendCode = async ()=>{
    //     try{
    //         const res = await AxiosClient.post('/join/SendAuthEmail',{
    //             userEmail : emailVerify.userEmail,
    //         })
    //         console.log(res)
    //         alert("인증번호가 이메일로 전송되었습니다.");
    //     }catch(e:any){
    //         console.log(e)
    //     }
    // }

    const handleSendCode = async ()=>{
        try{
            const res = await AxiosClient.post(`/join/sendAuthEmail`, null, {
                params: {
                    userEmail: emailVerify.userEmail,
                },
            });
            console.log(res)
            alert("인증번호가 이메일로 전송되었습니다.");
        }catch(e:any){
            console.log(e)
        }
    }

    const handleRegister = async () => {
        try {
            const response = await AxiosClient.post(`/join/register/authCode=${form.authCode}`, {
                userEmail: form.userEmail,
                userId: form.userId,
                userPassword: form.userPassword,
                userNm: form.userNm,
            });
            alert("회원가입 성공: " + response.data.message);
        } catch (error) {
            console.error("회원가입 실패", error);
            alert("회원가입 실패");
        }
    };

    return (
        <div className="Signup-Screen">
            <BackNavigator />
            <div className="SignUp-Box">
                <div className="SignUp-Title">회원가입</div>

                <div className="SignUp-verify-Box">
                    <div className="SignUp-emailForm">
                        <input id="signEmail" type="email" name="userEmail" placeholder="이메일을 입력해주세요" value={emailVerify.userEmail}  onChange={handleEmailVerifyChange} />
                        <button onClick={handleSendCode}>인증번호 전송</button>
                    </div>
                    <input id="signCode" type="text" name="authCode" placeholder="인증번호를 입력해주세요" onChange={handleChange} />
                </div>

                <div className="SignUp-input-Box">
                    <input id="signId" type="text" name="userNm" placeholder="아이디를 입력해주세요" onChange={handleChange} />
                    <input id="signPass" type="password" name="userPassword" placeholder="비밀번호를 입력해주세요" onChange={handleChange} />
                    <input id="signcheckPass" type="password" name="telNo" placeholder="비밀번호를 확인해주세요" onChange={handleChange} />
                </div>
                <span>비밀번호는 8~20자의 영문, 숫자, 특수문자를 포함해야 합니다.</span>
                <button className="SignUpButton" onClick={handleRegister}>회원가입하기</button>
            </div>
        </div>
    );
}
