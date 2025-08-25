import { useEffect, useState } from "react";
import settingsIcon from "../../assets/Mypage_Icon/settingsIcon.png";
import "./Profile.css";
import { useNavigate } from "react-router-dom";
import { getToken } from "../../utils/auth";
import { fetchUserPointsBalance } from "../../services/stepsApi";

const API_BASE = import.meta.env.VITE_API_BASE;

function Profile() {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState("");
  const [points, setPoints] = useState(0);

  const openSettings = () => navigate("/setting");

  useEffect(() => {
    const token = getToken();
    if (!token) return;
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/auth/me`, {
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("ME_FAILED");
        const data = await res.json();
        setNickname(data?.nickname || "");
        const uid = data?.id ?? sessionStorage.getItem("userId");
        if (uid != null) {
          try {
            const bal = await fetchUserPointsBalance(uid);
            setPoints(Number(bal?.total_points) || 0);
          } catch {}
        }
      } catch {}
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
      </div>
      <div className="points">
        <div className="points-left">
          <span className="money-icon" aria-hidden="true">🪙</span>
          <span className="points-label">포인트</span>
        </div>
        <div className="points-value">{points.toLocaleString()}p</div>
      </div>
    </section>
  );
}

export default Profile;