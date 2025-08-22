// import "./Profile.css";
// import settingsIcon from "/assets/settingsIcon.png";
// import { useNavigate } from "react-router-dom";

// const Profile = () => {
    
//     const navigate = useNavigate();
    
//     const loginButton = () => {
//         navigate("./login");
//     }
    
//     const openSettings = () => {
//         console.log("설정 열기");
//     }

//     return(
//         <div>

//             <button onClick={loginButton}>로그인</button>
//             <p>포인트</p>
//         </div>
//     );
// }

// export default Profile;

import settingsIcon from "../../assets/Mypage_Icon/settingsIcon.png";
import "./Profile.css";
import { useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();

  const goLogin = () => navigate("/login");
  const openSettings = () => navigate("/setting")


  return (
    <section className="profile-card" role="region" aria-label="프로필 카드">
      {/* 설정 버튼(이미지) */}
      <button className="settings-btn" onClick={openSettings} aria-label="설정 열기">
        <img src={settingsIcon} alt="" />
      </button>
 
      {/* 아바타 */}
      <div className="avatar" aria-hidden="true" />

      {/* 이름 + 이메일 인증 버튼 */}
      <div className="info">
        <h2 className="name">김김김</h2>
        <button className="verify-btn" onClick={goLogin}>
          카카오로 로그인
        </button>
      </div>

      {/* 포인트 */}
      <div className="points">
        <div className="points-left">
          {/* 이미지 변경 필요*/}
          <span className="money-icon" aria-hidden="true">💰</span>
          <span className="points-label">포인트</span>
        </div>
        <div className="points-value">5000p</div>
      </div>
    </section>
  );
}

export default Profile;