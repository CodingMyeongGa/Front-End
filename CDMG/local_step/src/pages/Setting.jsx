import { useNavigate } from "react-router-dom";
import { logout } from "../utils/auth";

function Settings() {
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate("/login-main", { replace: true });
  };
  return (
    <div>
      <h1></h1>
      <button onClick={handleLogout}>로그아웃</button>
    </div>
  );
}
export default Settings;