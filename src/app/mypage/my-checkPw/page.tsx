/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import "@/styles/editUserInfo.css";
import { useRouter } from "next/navigation";
import BackNavigator from "../../../components/backButton";
import { useEffect, useState } from "react";
import AxiosClient from "../../AxiosClient";

export default function CheckPassword() {
    const router = useRouter();
    const [userEmail, setUserEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const token = localStorage.getItem("accessToken");

                if (!token) {
                    console.error("Access token이 없습니다.");
                    return;
                }

                const response = await AxiosClient.get("/user/my", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                console.log("내 정보:", response.data);
                setUserEmail(response.data.userEmail);
            } catch (error) {
                console.error("내 정보 불러오기 실패:", error);
            }
        };

        fetchUserInfo();
    }, []);

    const handlePasswordCheck = async () => {
        try {
            const token = localStorage.getItem("accessToken");

            if (!token) {
                console.error("Access token이 없습니다.");
                return;
            }

            const response = await AxiosClient.post(
                "/user/password",
                { password }, // Request body
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            router.push("/mypage/my-editInfo");
            console.log("비밀번호 인증 성공:", response.data);
        } catch (error) {
            console.error("비밀번호 인증 실패:", error);
            alert("비밀번호 인증 실패"); 
        }
    };

    return (
        <div className="Edit-UserInfo-Container">
            <BackNavigator />
            <div className="Edit-UserInfo-Intro-Box">
                <span className="Edit-UserInfo-Intro-Title">
                    비밀번호 재확인
                </span>
                <div className="Edit-UserInfo-Intro-subTitle">
                    정보보호를 위해 비밀번호를 재확인하고 있습니다.
                </div>
            </div>
            <div className="MyInfo-Verify-Box">
                <input id="chkEmail" type="email" value={userEmail} readOnly />
                <input
                    id="checkPw"
                    type="password"
                    placeholder="비밀번호를 입력해주세요."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <div className="ReChk-nextButton" onClick={handlePasswordCheck}>
                다음
            </div>
        </div>
    );
}
