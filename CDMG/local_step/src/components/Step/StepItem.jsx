import Button from "./Button";
import "./StepItem.css";
import { useNavigate } from "react-router-dom";

const StepItem = ({ id, date, steps }) => {
  const nav = useNavigate();

  return (
    <div className="StepItem">
      <div onClick={() => nav(`/steps/${id}`)} className="info_section">
        <div className="date">
          {new Date(date).toLocaleDateString()}
        </div>
        <div className="steps">
          {new Intl.NumberFormat().format(steps || 0)} 걸음
        </div>
      </div>
      <div className="point_section">
        포인트
      </div>
    </div>
  );
};

export default StepItem;
