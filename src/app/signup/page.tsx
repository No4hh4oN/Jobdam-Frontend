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

export default function signup() {
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

  const handleRegister = async () => {
    try {
      const response = await AxiosClient.post<{ message: string }>("/register", {
        userId: form.userId,
        password: form.password,
        userName: form.userName,
        userEmail: form.userEmail,
        telNo: form.telNo,
      });
      alert("회원가입 성공: " + response.data.message);
    } catch (error) {
      console.error("회원가입 실패", error);
      alert("회원가입 실패");
    }
  };

  return (
    <div className="MainContainer">

      <div className="Join-Container">
        <div>회원가입</div>
        <input type="text" name="userId" placeholder="아이디" onChange={handleChange} />
        <input type="password" name="password" placeholder="비밀번호" onChange={handleChange} />
        <input type="text" name="userName" placeholder="이름" onChange={handleChange} />
        <input type="email" name="userEmail" placeholder="이메일" onChange={handleChange} />
        <input type="text" name="telNo" placeholder="전화번호" onChange={handleChange} />
        <button onClick={handleRegister}>회원가입</button>
      </div>
    </div>
  );
}
