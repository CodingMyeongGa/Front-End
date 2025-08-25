import { useEffect, useState } from "react";
import settingsIcon from "../../assets/Mypage_Icon/settingsIcon.png";
import "./Profile.css";
import { useNavigate } from "react-router-dom";
import { getToken } from "../../utils/auth";

const API_BASE = "http://43.201.15.212:8080";

function Profile() {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState("");

  const goLogin = () => navigate("/login"); // (변경 없음)
  const openSettings = () => navigate("/setting"); // (변경 없음)

  useEffect(() => {
    const token = getToken();
    if (!token) return;
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/auth/me`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("ME_FAILED");
        const data = await res.json();
        setNickname(data?.nickname || "");
      } catch (e) {
        // 필요 시 처리
      }
    })();
  }, []);



  return (
    <section className="profile-card" role="region" aria-label="프로필 카드">
      <button className="settings-btn" onClick={openSettings} aria-label="설정 열기">
        <img src={settingsIcon} alt="" />
      </button>
      <div className="avatar" aria-hidden="true" />
      <div className="info">
        <h2 className="name">{nickname || "..."}</h2>
        {/* <button className="verify-btn" onClick={goLogin}>카카오로 로그인</button> */}
      </div>
      <div className="points">
        <div className="points-left">
          <span className="money-icon" aria-hidden="true">🪙</span>
          <span className="points-label">포인트</span>
        </div>
        <div className="points-value">5000p</div>
      </div>
    </section>
  );
}

export default Profile;