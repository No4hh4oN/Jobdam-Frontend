/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import "@/styles/editUserInfo.css";
import { useRouter } from "next/navigation";
import BackNavigator from "../../../components/backButton";
import { useState, ChangeEvent } from "react";


// import AxiosClient from "../../AxiosClient";


// interface EmailVerificationState {
//     userEmail: string;
// }

export default function CheckPassword(){
    const router = useRouter();

    return(
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
                    <input
                        id="chkEmail"
                        type="email"
                        placeholder="aaa@aaa.com"
                        readOnly
                    />
                    <input
                        id="checkPw"
                        type="password"
                        placeholder="비밀번호를 입력해주세요."
                    />
                </div>
                <div className="ReChk-nextButton"  onClick={() => router.push("/mypage/my-editInfo")} >
                    다음
                </div>
        </div>
    )
}