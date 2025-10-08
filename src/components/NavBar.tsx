"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import "../styles/navbar.css";
import Image from "next/image";

type MenuKey = "contents" | "llmTuter" | "profile";

export default function NavBar() {
    const router = useRouter();
    const pathname = usePathname();
    const [activeMenu, setActiveMenu] = useState<MenuKey>("llmTuter");

    useEffect(() => {
        if (pathname.startsWith("/contents")) setActiveMenu("contents");
        else if (pathname.startsWith("/llmTuter")) setActiveMenu("llmTuter");
        else if (pathname.startsWith("/mypage")) setActiveMenu("profile");
    }, [pathname]);

    const handleClick = (menu: MenuKey) => {
        setActiveMenu(menu);
        switch (menu) {
            case "contents":
                router.push("/contents");
                break;
            case "llmTuter":
                router.push("/llmTuter");
                break;
            case "profile":
                router.push("/mypage");
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

            <div className="NavBar-menu" onClick={() => handleClick("llmTuter")}>
                <Image
                    src={
                        activeMenu === "llmTuter"
                            ? "/images/AItuterActive.png"
                            : "/images/AItuter.png"
                    }
                    alt="AI튜터메뉴"
                    width={38}
                    height={30}
                />
                <span className={activeMenu === "llmTuter" ? "active" : ""}>
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
