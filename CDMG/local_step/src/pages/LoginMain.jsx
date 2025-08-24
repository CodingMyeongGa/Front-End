import React, { useState , useEffect} from "react";
import { login, isAuthed } from "../utils/auth";   
import { useNavigate, Link } from "react-router-dom";  
import { setSessionLoggedIn } from "../routes/AuthGate";
import "../components/Login/loginMain.css"; // 파일명 대소문자 일치

export default function LoginMain() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => { if (isAuthed()) navigate("/", { replace:true }) }, [navigate])

  // 🔑 카카오 로그인 설정
  const REST_API_KEY = "42751a9b7d932eac24627939d11d3120";
  const REDIRECT_URI = "http://43.201.15.212/api/auth/kakao";
  const kakaoLink = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;

  const handleSubmit = (e) => {
    e.preventDefault();

    // 간단한 유효성 검사
    if (!email.includes("@")) {
      setError("이메일 형식을 확인하세요.");
      return;
    }
    if (pw.length < 6) {
      setError("비밀번호는 6자 이상 입력하세요.");
      return;
    }

    setError(null);
    // TODO: 실제 로그인 API 연동
    setSessionLoggedIn(true);
    navigate("/", { replace:true });
    // alert("로그인 성공! 🎉");
  };

  const kakaoLoginHandler = () => {
    window.location.href = kakaoLink;
  };

  return (
    <div className="login-container">
      <form className="login-box" onSubmit={handleSubmit}>
        <h2 className="login-title">로그인</h2>

        <label>이메일</label>
        <input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>비밀번호</label>
        <input
          type="password"
          placeholder="비밀번호 입력"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
        />

        {error && <div className="error">{error}</div>}

        <button type="submit">로그인</button>

        {/* 🔽 카카오 로그인 버튼 추가 */}
        <button
          type="button"
          onClick={kakaoLoginHandler}
          className="kakao-btn"
        >
          카카오로 로그인하기
        </button>

        <p className="signup-text">
          아직 계정이 없으신가요? <Link to="/signup">회원가입</Link>
        </p>
      </form>
    </div>
  );
}
