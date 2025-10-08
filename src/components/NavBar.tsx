"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import "../styles/navbar.css";
import Image from "next/image";

type MenuKey = "contents" | "AI" | "profile";

export default function NavBar() {
    const [activeMenu, setActiveMenu] = useState<MenuKey>("contents");
    const router = useRouter();

    const handleClick = (menu: MenuKey) => {
        setActiveMenu(menu);
        switch (menu) {
            case "contents":
                router.push("/contents");
                break;
            case "AI":
                // router.push("/AItuter");
                break;
            case "profile":
                // router.push("/mypage");
                break;
        }
    };

    return (
        <div className="NavBar">
            <div className="NavBar-menu" onClick={() => handleClick("contents")}>
                <Image
                    src={
                        activeMenu === "contents"
                            ? "/images/contentsActive.png"
                            : "/images/contents.png"
                    }
                    alt="컨텐츠메뉴"
                    width={30}
                    height={30}
                />
                <span className={activeMenu === "contents" ? "active" : ""}>
                    컨텐츠
                </span>
            </div>

            <div className="NavBar-menu" onClick={() => handleClick("AI")}>
                <Image
                    src={
                        activeMenu === "AI"
                            ? "/images/AItuterActive.png"
                            : "/images/AItuter.png"
                    }
                    alt="AI튜터메뉴"
                    width={38}
                    height={30}
                />
                <span className={activeMenu === "AI" ? "active" : ""}>
                    AI튜터
                </span>
            </div>

            <div className="NavBar-menu" onClick={() => handleClick("profile")}>
                <Image
                    src={
                        activeMenu === "profile"
                            ? "/images/profileActive.png"
                            : "/images/profile.png"
                    }
                    alt="마이페이지메뉴"
                    width={31}
                    height={31}
                />
                <span className={activeMenu === "profile" ? "active" : ""}>
                    마이페이지
                </span>
            </div>
        </div>
    );
}
