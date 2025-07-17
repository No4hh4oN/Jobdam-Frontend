"use client";

import BackNavigator from "@/components/backButton";
import { useState, ChangeEvent } from "react";
import AxiosClient from "../AxiosClient";
import '../../styles/login.css';


interface FormState {
    userId: string;
    password: string;
    userName?: string;
    userEmail?: string;
    telNo?: string;
}

export default function Login() {
    const [form, setForm] = useState<FormState>({
        userId: "",
        password: "",
        userName: "",
        userEmail: "",
        telNo: "",
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleLogin = async () => {
        try {
            const response = await AxiosClient.post<{ message: string }>("/login", {
                userId: form.userId,
                password: form.password,
            });
            alert("로그인 성공: " + response.data.message);
        } catch (error) {
            console.error("로그인 실패", error);
            alert("로그인 실패");
        }
    };

    return (
        <div className="LoginScreen">
            <BackNavigator />
            <div className="Login-Title">로그인</div>
            <div className="Login-Box">
                <input id="userId" type="text" name="userId" placeholder="아이디를 입력해주세요" onChange={handleChange} />

                <input id="password" type="password" name="password" placeholder="비밀번호를 입력해주세요" onChange={handleChange} />

                <div className="Find-Signup-Form">
                    <span>아이디 찾기</span>
                    <span>|</span>
                    <span>비밀번호 찾기</span>
                    <span>|</span>
                    <span>회원가입</span>
                </div>
                <button className="LoginButton" onClick={handleLogin}>로그인하기</button>
            </div>
        </div>
    );
}
