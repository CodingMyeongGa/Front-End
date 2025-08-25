import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { isAuthed, login } from "../utils/auth";
import "../components/Login/loginMain.css";

const API_BASE = import.meta.env.VITE_API_BASE;
const KAKAO_REST_KEY = import.meta.env.VITE_KAKAO_REST_KEY;
const KAKAO_REDIRECT_URI = import.meta.env.VITE_KAKAO_REDIRECT_URI;

export default function LoginMain() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isAuthed()) navigate("/", { replace: true });
  }, [navigate]);

  const kakaoLink = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_REST_KEY}&redirect_uri=${encodeURIComponent(KAKAO_REDIRECT_URI || "")}&response_type=code`;

  const storeMe = async (token) => {
    try {
      const meRes = await fetch(`${API_BASE}/api/auth/me`, {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
      if (meRes.ok) {
        const me = await meRes.json();
        if (me?.id != null) sessionStorage.setItem("userId", String(me.id));
        if (me?.nickname) sessionStorage.setItem("nickname", me.nickname);
      }
    } catch {}
  };

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const code = query.get("code");
    if (code) {
      fetch(`${API_BASE}/api/auth/kakao`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      })
        .then((res) => res.json())
        .then(async (data) => {
          if (data.token) {
            sessionStorage.setItem("authToken", data.token);
            login(data.token);
            await storeMe(data.token);
            navigate("/", { replace: true });
          } else {
            throw new Error("카카오 로그인 실패");
          }
        })
        .catch(() => setError("카카오 로그인 중 오류가 발생했습니다."));
    }
  }, [location, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: pw }),
      });
      const data = await res.json();
      if (!res.ok || !data.token) throw new Error("이메일 또는 비밀번호가 올바르지 않습니다.");
      sessionStorage.setItem("authToken", data.token);
      login(data.token);
      await storeMe(data.token);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message || "서버 오류가 발생했습니다.");
    }
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
          autoComplete="email"
        />
        <label>비밀번호</label>
        <input
          type="password"
          placeholder="비밀번호 입력"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          autoComplete="current-password"
        />
        {error && <div className="error">{error}</div>}
        <button type="submit">로그인</button>
        <button type="button" onClick={kakaoLoginHandler} className="kakao-btn">
          카카오로 로그인하기
        </button>
        <p className="signup-text">
          아직 계정이 없으신가요? <Link to="/signup">회원가입</Link>
        </p>
      </form>
    </div>
  );
}