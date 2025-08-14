import { useNavigate } from "react-router-dom";

export default function Goto_GoalSwitch_Btn() {
  const navigate = useNavigate();
  return (
    <button onClick={() => navigate("/edit")}>
      목표 걸음 수 설정
    </button>
  );
}