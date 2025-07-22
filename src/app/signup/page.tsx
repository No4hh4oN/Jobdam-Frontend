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
    passwordCheck?: string;
}


interface EmailVerificationState {
    userEmail: string;
    authCode: string;
}

export default function Signup() {

    const [form, setForm] = useState<FormState>({
        userEmail: "",
        userId: "",
        userPassword: "",
        userNm: "",
    });

    const [emailVerify, setEmailVerify] = useState<EmailVerificationState>({
        userEmail: "",
        authCode: "",
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleEmailVerifyChange = (e:ChangeEvent<HTMLInputElement>)=>{
        const {name,value}=e.target;
        setEmailVerify((prev) => ({ ...prev, [name]: value }));
    }

    // 인증번호 전송
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
                },
            });
            console.log(res);
            alert("이메일 인증 완료");
        } catch (error) {
            console.error(error);
            alert("이메일 인증 실패");
        }
    };

    //아이디 중복 확인
    const handleCheck = async () => {
        try {
            const res = await AxiosClient.get('/join/chkUserId', {
                params: {
                    userId: form.userId,
                },
            });
            console.log(res);
            alert("사용 가능한 아이디입니다.");
        } catch (error) {
            console.error("중복 확인 실패", error);
            alert("이미 사용 중인 아이디입니다.");
        }
    };

    // 비밀번호 조건 확인 
    const isPasswordValid = (password: string) => {
        const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=~`[\]{}|\\:;"'<>,.?/])[A-Za-z\d!@#$%^&*()_\-+=~`[\]{}|\\:;"'<>,.?/]{8,20}$/;
        return regex.test(password);
    };

    //회원가입하기 버튼 클릭시
    const handleRegister = async () => {
        if (!isPasswordValid(form.userPassword)) {
            alert("비밀번호는 8~20자의 영문, 숫자, 특수문자를 포함해야 합니다.");
            return;
        }
        if (form.userPassword !== form.passwordCheck) {
            alert("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
            return;
        }
        try {
            const authCodeNumber = parseInt(emailVerify.authCode as any, 10);
            const response = await AxiosClient.post(`/join/register`, {
                userEmail: emailVerify.userEmail,
                userId: form.userId,
                userPassword: form.userPassword,
            }, {
                params: {
                    authCode: authCodeNumber,
                },
            });
            alert("회원가입 성공");
            console.log(response)
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
                    <input id="signCode" type="text" name="authCode" placeholder="인증번호를 입력해주세요" value={emailVerify.authCode} onChange={handleEmailVerifyChange} />
                    <button onClick={handleCheckEmail}>이메일 인증 확인</button>
                </div>

                <div className="SignUp-input-Box">
                    <input id="signId" type="text" name="userId" placeholder="아이디를 입력해주세요" value={form.userId}  onChange={handleChange} />
                    <button onClick={handleCheck}>아이디 중복확인</button>
                    <input id="signPass" type="password" name="userPassword" placeholder="비밀번호를 입력해주세요" value={form.userPassword} onChange={handleChange} />
                    <input id="signcheckPass" type="password" name="passwordCheck" placeholder="비밀번호를 확인해주세요" value={form.passwordCheck || ""} onChange={handleChange} />
                </div>
                <span>비밀번호는 8~20자의 영문, 숫자, 특수문자를 포함해야 합니다.</span>
                <button className="SignUpButton" onClick={handleRegister}>회원가입하기</button>
            </div>
        </div>
    );
}