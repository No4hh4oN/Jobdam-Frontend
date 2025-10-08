"use client";

import "../../styles/mypageHome.css";
import { useRouter } from "next/navigation";
import NavBar from "../../components/NavBar";
import Image from "next/image";

export default function Mypage(){
    const router = useRouter();

    return(
        <div className="mypage-home">
            <div className="mypage-home-title">마이페이지</div>
            <div className="mypage-home-mainBox">
                <div className="mypage-home-menu">
                    <Image src="/images/mypageProfile.png" alt="프로필사진" width={54} height={53} style={{borderRadius:"50%"}}/>
                    <div className="mypage-home-userInfo">
                        <span>닉네임</span>
                        <span>aaa@aaa.com</span>
                    </div>
                    <button>프로필 편집</button>
                </div>
                {/* <div className="mypage-home-menu">
                    <Image src="/images/mypageProfile.png" alt="프로필사진" width={54} height={53} style={{borderRadius:"50%"}}/>
                    <div className="mypage-home-userInfo">
                        <span style={{fontSize:"18px", marginLeft:"-30px"}}>로그인 • 회원가입</span>
                    </div>
                    <Image
                        src="/images/nextbtn.png"
                        alt="다음으로"
                        width={9}
                        height={18}
                    />
                </div> */}
                <div className="mypage-home-menu">
                    <span>AI 튜터 기록</span>
                    <Image
                        src="/images/nextbtn.png"
                        alt="다음으로"
                        width={9}
                        height={18}
                    />
                </div>
                <div className="mypage-home-menu" style={{marginBottom:"55px"}}>
                    <span>북마크한 콘텐츠</span>
                    <Image
                        src="/images/nextbtn.png"
                        alt="다음으로"
                        width={9}
                        height={18}
                    />
                </div>
                <div className="mypage-home-menu-user" onClick={() => router.push("/mypage/my-checkPw")} >회원정보 수정</div>
                <div className="mypage-home-menu-user">로그아웃</div>
                <div className="mypage-home-menu-user">회원탈퇴 </div>
            </div>
            <NavBar />
        </div>
    )

}