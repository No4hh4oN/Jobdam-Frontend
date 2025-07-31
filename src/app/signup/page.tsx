/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, ChangeEvent, useEffect } from "react";
import { useRouter } from 'next/navigation';
import AxiosClient from "../AxiosClient";
import BackNavigator from "@/components/backButton";
import '../../styles/signup.css';
import Image from 'next/image';



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
    const router = useRouter();
    const [step, setStep] = useState<"verify" | "form" | "complete">("verify");
    const [codeSent, setCodeSent] = useState(false); // 텍스트 : 인증번호 전송 -> 재전송 
    const [emailVerified, setEmailVerified] = useState<boolean>(false); // 확인여부에 따른 '다음' 버튼 활성화,비활성화
    const [emailVerifyFailed, setEmailVerifyFailed] = useState(false); // 인증번호 틀렸을때 메시지 나오게
    const [userIdCheck, setUserIdCheck] = useState<boolean | null>(null); //아이디 중복확인부분 , 초기값은 null

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

    // 이메일 인증번호 전송
    const handleSendCode = async ()=>{
        try{
            const res = await AxiosClient.post(`/join/sendAuthEmail`, null, {
                params: {
                    userEmail: emailVerify.userEmail,
                    type: "",
                },
            });
            console.log(res)
            // alert("인증번호가 이메일로 전송되었습니다.");
            setCodeSent(true);
        }catch(error){
            console.error(error)
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
                    type: "",
                },
            });
            console.log(res);
            setEmailVerified(true);
            setEmailVerifyFailed(false)
        } catch (error) {
            console.error(error);
            setEmailVerifyFailed(true);
        }
    };

    //아이디 중복 확인
    const handleCheck = async () => {
        try {
            const res = await AxiosClient.get('/join/chkUserId', {
                params: {
                    userId: form.userId,
                    type: "",
                },
            });
            console.log(res);
            setUserIdCheck(true);
            // alert("사용 가능한 아이디입니다.");
        } catch (error) {
            console.error("중복 확인 실패", error);
            setUserIdCheck(false);
            // alert("이미 사용 중인 아이디입니다.");
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
            // alert("비밀번호는 8~20자의 영문, 숫자, 특수문자를 포함해야 합니다.");
            return;
        }
        if (form.userPassword !== form.passwordCheck) {
            // alert("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
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
            // alert("회원가입 성공");
            setStep("complete");
            console.log(response)
        } catch (error) {
            console.error("회원가입 실패", error);
            // alert("회원가입 실패");
        }
    };

    // 인증번호 타이핑 부분
    const isAuthCodeEmpty = emailVerify.authCode.trim() === "";
    const isAuthCodeTyping = !isAuthCodeEmpty && !emailVerified;

    const isFormVaild = 
        userIdCheck===true && 
        isPasswordValid(form.userPassword) && 
        form.userPassword===form.passwordCheck

    return (
        <div className="Signup-Screen">
            {(step === "verify" || step === "form") && <BackNavigator />}
            <div className="SignUp-Box">
                {(step === "verify" || step === "form") && (
                    <div className="SignUp-Title">회원가입</div>
                )}

            {step === 'verify' && (
                <div className="SignUp-verify-Box">
                    <div className="SignUp-emailForm">
                        <input 
                            id="signEmail" 
                            type="email" 
                            name="userEmail" 
                            placeholder="이메일을 입력해주세요" 
                            value={emailVerify.userEmail}  
                            onChange={handleEmailVerifyChange} 
                        />
                        <button onClick={handleSendCode}>
                            {codeSent ? "재전송" : "인증번호 전송"}
                        </button>
                    </div>

                    <div className="SignUp-verifycheck">
                        <input 
                            id="signCode" 
                            type="text" 
                            name="authCode" 
                            placeholder="인증번호를 입력해주세요" 
                            value={emailVerify.authCode} 
                            onChange={handleEmailVerifyChange} 
                            className={emailVerifyFailed ? "error" : ""}
                        />
                        <button
                            onClick={handleCheckEmail}
                            className={
                                emailVerified
                                ? "signup-verify-btn-gray"
                                : (!isAuthCodeEmpty && !emailVerified)
                                ? "signup-verify-btn-purple"
                                : "signup-verify-btn-gray"
                            }
                        >
                            {emailVerified ? "인증완료" : "확인"}
                        </button>
                    </div>
                    {emailVerifyFailed && (<span className="signup-fail-code">인증번호가 일치하지 않습니다.</span>)}                    
                    <div className="SignUp-next">
                        <button 
                            className={`SignUpButton ${emailVerified ? "nextbtn-purple" : "nextbtn-gray"}`} 
                            onClick={() => setStep("form")} 
                            disabled={!emailVerified}
                        > 
                            다음 
                        </button>                        
                    </div>
                </div>
            )}
            {step === "form" && (    
                <div className="SignUp-input-Box">
                    <div className="signup-id-check">
                        <input 
                            id="signId" 
                            type="text" 
                            name="userId" 
                            placeholder="아이디를 입력해주세요" 
                            value={form.userId}  
                            onChange={handleChange}
                            className={userIdCheck === false ? "error" : ""}
                        />
                        <button onClick={handleCheck}>중복확인</button>
                    </div>
                    {userIdCheck === null ? null :                     
                        userIdCheck ? (
                            <span className="userIdCheck-T">사용 가능한 아이디입니다.</span>
                        ):(
                            <span className="userIdCheck-F">중복된 아이디입니다.</span>
                        )
                    }

                    <input 
                        id="signPass" 
                        type="password" 
                        name="userPassword" 
                        placeholder="비밀번호를 입력해주세요" 
                        value={form.userPassword} 
                        onChange={handleChange} 
                        className={!isPasswordValid(form.userPassword)&& form.userPassword ? "error" : ""}
                    />
                    {!isPasswordValid(form.userPassword) && form.userPassword && (
                        <span className="userPassword-fail">비밀번호는 8~20자의 영문, 숫자, 특수문자를 포함해야 합니다.</span>
                    )}
                    
                    <input 
                        id="signcheckPass" 
                        type="password" 
                        name="passwordCheck" 
                        placeholder="비밀번호를 확인해주세요" 
                        value={form.passwordCheck || ""} 
                        onChange={handleChange} 
                        className={form.passwordCheck && form.userPassword !== form.passwordCheck ? "error" : ""}
                    />
                    {form.passwordCheck && form.userPassword !== form.passwordCheck &&(
                        <span className="userPassword-fail">비밀번호가 일치하지 않습니다.</span>
                    )}
                    
                    <button className={`SignUpButton ${isFormVaild ? "nextbtn-purple" : "nextbtn-gray"}`}  onClick={handleRegister} disabled={!isFormVaild}>회원가입하기</button>
                </div>
            )}
            {step === "complete" && (
                <div className="SignUp-complete-Box" >
                    <Image
                        src="/images/signupFinish.png"
                        alt="완료체크"
                        width={70}
                        height={70}
                        priority
                    />
                    <div>회원가입 완료!</div>
                    <span>로그인 화면으로 돌아가 <br /> 로그인 해주세요.</span>
                    <button className="SignUpButton" onClick={() => router.push('/login')}>
                        로그인 화면으로
                    </button>
                </div>
            )}            
            </div>
        </div>
    );
}