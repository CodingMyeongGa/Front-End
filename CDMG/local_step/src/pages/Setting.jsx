import { useNavigate } from "react-router-dom";

function Settings() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // 세션/토큰 삭제 (localStorage나 쿠키 사용 시)
    localStorage.removeItem("token");

    // signup 페이지로 이동
    navigate("/login-main");
  };

  return (
    <div>
      <h1></h1>
      <button onClick={handleLogout}>로그아웃</button>
    </div>
  );
}

export default Settings;
