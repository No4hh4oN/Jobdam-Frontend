"use client";

import { useState, ChangeEvent } from "react";
import AxiosClient from "../AxiosClient";

interface FormState {
  userId: string;
  password: string;
  userName?: string;
  userEmail?: string;
  telNo?: string;
}

export default function login() {
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
        <div className="Login-Box">
          <div>로그인</div>
          <input type="text" name="userId" placeholder="아이디" onChange={handleChange} />
          <input type="password" name="password" placeholder="비밀번호" onChange={handleChange} />
          <button onClick={handleLogin}>로그인</button>
        </div>
    </div>
  );
}
