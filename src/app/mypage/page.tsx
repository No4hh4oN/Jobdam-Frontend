/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import "../../styles/mypageHome.css";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import NavBar from "../../components/NavBar";
import AxiosClient from "../AxiosClient";

export default function Mypage() {
    const router = useRouter();

    const [userEmail, setUserEmail] = useState<string>("");
    const [userId, setUserId] = useState<string>("");
    const [userNm, setUserNm] = useState<string>("");
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [showBox, setShowBox] = useState<boolean>(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
    const [newUserName, setNewUserName] = useState<string>("");
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    // 이미지 상태
    const [selectedImage, setSelectedImage] = useState<string>("/images/editprofileImg.png");
    const [profileImage, setProfileImage] = useState<string>("/images/mypageProfile.png");

    // 파일
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    // 프로필 이미지 불러오기
    useEffect(() => {
        const fetchUserInfo = async () => {
            setIsLoading(true); // ✅ 시작 시 true
            try {
                const token = localStorage.getItem("accessToken");
                if (!token) {
                    setIsLoggedIn(false);
                    setIsLoading(false);
                    return;
                }

                const response = await AxiosClient.get("/user/my", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setUserEmail(response.data.userEmail);
                setUserId(response.data.userId);
                setUserNm(response.data.userNm);
                setIsLoggedIn(true);

                if (response.data.profileImageId) {
                    const imageRes = await AxiosClient.get(`/image/${response.data.profileImageId}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    setProfileImage(imageRes.data.url);
                    setSelectedImage(imageRes.data.url);
                }
            } catch (error) {
                console.error("내 정보 불러오기 실패:", error);
                setIsLoggedIn(false);
            } finally {
                setIsLoading(false); // ✅ 끝나면 false
            }
        };

        fetchUserInfo();
    }, []);


    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
        setIsModalOpen(false);
        setShowBox(false);
    };
    const toggleBox = () => setShowBox(!showBox);
    const openDeleteModal = () => setIsDeleteModalOpen(true);
    const closeDeleteModal = () => setIsDeleteModalOpen(false);

    const [deleteCompleted, setDeleteCompleted] = useState<boolean>(false);

    const handleDelete = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            if (!token) {
                alert("로그인이 필요합니다.");
                return;
            }

            await AxiosClient.delete("/user/withdraw", {
                headers: { Authorization: `Bearer ${token}` },
            });

            setDeleteCompleted(true);
            localStorage.removeItem("accessToken");
        } catch (error) {
            console.error("회원탈퇴 실패:", error);
            alert("회원탈퇴 중 오류가 발생했습니다.");
        }
    };

    const handleDeleteConfirm = () => {
        setIsDeleteModalOpen(false);
        router.push("/");
    };

    const menuItems = [
        { text: "회원정보 수정", action: () => router.push("/mypage/my-checkPw") },
        {
            text: "로그아웃",
            action: () => {
                if (!isLoggedIn) return;
                localStorage.removeItem("accessToken");
                router.push("/");
            },
        },
        { text: "회원탈퇴", action: openDeleteModal },
    ];

    // 🔹 이름/이미지 저장
    const handleNameSave = async () => {
        console.log("handleNameSave 호출됨");

        const token = localStorage.getItem("accessToken");
        if (!token) {
            alert("로그인이 필요합니다.");
            return;
        }

        try {
            // 닉네임 변경
            if (newUserName.trim()) {
                console.log("닉네임 변경 요청 전:", newUserName);
                const nameResponse = await AxiosClient.patch(
                    "/user/name",
                    { userName: newUserName },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                console.log("닉네임 변경 응답:", nameResponse.data);
                setUserNm(newUserName);
            }

            // 이미지 업로드
            if (selectedFile) {
                const formData = new FormData();
                formData.append("file", selectedFile);

                console.log("이미지 업로드 요청 전");
                const imgResponse = await AxiosClient.post("/image/upload", formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                });
                console.log("이미지 업로드 응답:", imgResponse.data);

                // 업로드 후 최신 유저 정보 불러오기
                const updatedUser = await AxiosClient.get("/user/my", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                console.log("업데이트 후 내 정보:", updatedUser.data);

                if (updatedUser.data.profileImageId) {
                    const imageId = updatedUser.data.profileImageId;
                    const imageResponse = await AxiosClient.get(`/image/${imageId}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    console.log("GET /image/{imageId} 응답:", imageResponse.data);
                    setProfileImage(imageResponse.data.url);
                    setSelectedImage(imageResponse.data.url);
                }
            }

            alert("프로필이 성공적으로 수정되었습니다!");
            closeModal();
        } catch (error) {
            console.error("프로필 수정 실패:", error);
            alert("프로필 수정 중 오류가 발생했습니다.");
        }
    };

    const handleFileSelect = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        console.log("선택된 파일:", file);
        setSelectedFile(file);

        const reader = new FileReader();
        reader.onloadend = () => {
            setSelectedImage(reader.result as string);
            setShowBox(false);
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="mypage-home">
            <div className="mypage-home-title">마이페이지</div>
            <div className="mypage-home-mainBox">
                {isLoading ? (
                    // 로딩 중일 때
                    <div className="loadingWrapper2">
                        <div className="typing">
                            <i></i><i></i><i></i>
                        </div>
                    </div>
                ) : isLoggedIn ? (
                    // 로그인 후
                    <div className="mypage-home-menu">
                        <div className="mypage-home-profileInfo">
                            <img
                                src={profileImage}
                                alt="프로필사진"
                                width={54}
                                height={53}
                                style={{ borderRadius: "50%", objectFit: "cover" }}
                            />
                            <div className="mypage-home-userInfo">
                                <span>{userNm}</span>
                                <span>{userEmail}</span>
                            </div>
                        </div>
                        <button onClick={openModal}>프로필 편집</button>
                    </div>
                ) : (
                    // 비로그인 상태
                    <div className="mypage-home-menu">
                        <img
                            src="/images/mypageProfile.png"
                            alt="프로필사진"
                            width={54}
                            height={53}
                            style={{ borderRadius: "50%" }}
                        />
                        <div className="mypage-home-userInfo">
                            <span style={{ fontSize: "18px", marginLeft: "-30px" }}>로그인 • 회원가입</span>
                        </div>
                        <img src="/images/nextbtn.png" alt="다음으로" width={9} height={18} />
                    </div>
                )}

                <div className="mypage-home-menu">
                    <span>AI 튜터 기록</span>
                    <img src="/images/nextbtn.png" alt="다음으로" width={9} height={18} />
                </div>
                <div className="mypage-home-menu" style={{ marginBottom: "55px" }}>
                    <span>북마크한 콘텐츠</span>
                    <img src="/images/nextbtn.png" alt="다음으로" width={9} height={18} />
                </div>

                {menuItems.map((item, idx) => (
                    <div
                        key={idx}
                        className="mypage-home-menu-user"
                        onClick={isLoggedIn ? item.action : undefined}
                        style={{
                            color: isLoggedIn ? undefined : "#A8ADBE",
                            cursor: isLoggedIn ? "pointer" : "default",
                        }}
                    >
                        {item.text}
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <img
                            src="/images/close.png"
                            alt="모달닫기"
                            width={18}
                            height={18}
                            onClick={closeModal}
                            className="edit-modal-close"
                        />
                        <div className="edit-profile-modal-top">프로필 편집</div>
                        <div style={{ position: "relative", display: "inline-block" }}>
                            <img
                                src={selectedImage}
                                alt="프로필사진"
                                width={111}
                                height={111}
                                style={{ borderRadius: "50%", cursor: "pointer", objectFit: "cover" }}
                                onClick={toggleBox}
                            />
                            {showBox && (
                                <div className="profile-img-choice-Box">
                                    <div className="choice-library" onClick={handleFileSelect}>
                                        <img src="/images/ImgChoice.png" alt="사진선택" width={20} height={20} />
                                        <span>라이브러리에서 선택</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            ref={fileInputRef}
                                            style={{ display: "none" }}
                                            onChange={handleFileChange}
                                        />
                                    </div>
                                    <div className="img-line"></div>
                                    <div className="take-picture">
                                        <img src="/images/camera.png" alt="사진찍기" width={23} height={23} />
                                        <span>사진 찍기</span>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="edit-profile-name">
                            <input
                                type="text"
                                placeholder={userNm}
                                value={newUserName}
                                onChange={(e) => setNewUserName(e.target.value)}
                                className="edit-name-input"
                            />
                            <div className="long-dash-line"></div>
                        </div>
                        <button className="edit-modal-save" onClick={handleNameSave}>
                            저장하기
                        </button>
                    </div>
                </div>
            )}

            {isDeleteModalOpen && (
                <div className="delete-account-modal-overlay" onClick={closeDeleteModal}>
                    <div className="delete-account-modal-content" onClick={(e) => e.stopPropagation()}>
                        {!deleteCompleted ? (
                            <>
                                <div className="delete-account-modal-text">
                                    탈퇴 시 모든 활동 기록이 삭제됩니다.<br />그래도 탈퇴하시겠어요?
                                </div>
                                <div className="delete-account-modal-buttons">
                                    <button onClick={closeDeleteModal}>취소</button>
                                    <button onClick={handleDelete}>확인</button>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="delete-account-modal-text" style={{ marginTop: "40px" }}>
                                    회원탈퇴가 완료되었습니다.
                                </div>
                                <div className="delete-account-modal-button">
                                    <button onClick={handleDeleteConfirm}>확인</button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
            <NavBar />
        </div>
    );
}
