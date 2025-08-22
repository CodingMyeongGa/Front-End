import AccumulatedBlock from "../components/Mypage/AccumulatedBlock";
import Profile from "../components/Mypage/Profile";


export default function Mypage() {
  return (
    <div style={{ padding: 16 }}>
      <Profile />
      <AccumulatedBlock/>
    </div>
  );
}