import { useState } from "react";
import "../components/Login/loginMain.css";
import { useNavigate } from "react-router-dom";
import "../components/Login/Signup.css";

export default function Signup() {
  const nav = useNavigate();
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");

  const [emailValid, setEmailValid] = useState(false);
  const [emailConfirmed, setEmailConfirmed] = useState(false);
  const [emailCheckMsg, setEmailCheckMsg] = useState("");

  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [err, setErr] = useState("");

  const validateEmailFormat = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const onEmailChange = (v) => {
    setEmail(v);
    setEmailConfirmed(false);
    if (validateEmailFormat(v)) {
      setEmailValid(true);
      setEmailCheckMsg("이메일 형식이 유효합니다.");
    } else {
      setEmailValid(false);
      setEmailCheckMsg("유효하지 않은 이메일 형식입니다.");
    }
  };

  const checkDuplicate = async () => {
    try {
      const res = await fetch("http://43.201.15.212:8080/api/auth/check-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.exists) {
        setEmailConfirmed(false);
        setEmailCheckMsg("이미 사용 중인 이메일입니다.");
      } else {
        setEmailConfirmed(true);
        setEmailCheckMsg("사용 가능한 이메일입니다.");
      }
    } catch {
      setEmailConfirmed(false);
      setEmailCheckMsg("중복 확인 중 오류가 발생했습니다.");
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");

    if (!nickname.trim() || !email.trim() || !pw || !pw2) {
      setErr("모든 항목을 입력해 주세요.");
      return;
    }
    if (!emailValid || !emailConfirmed) {
      setErr("이메일 형식 확인 및 중복 확인을 완료해주세요.");
      return;
    }
    if (pw.length < 6) {
      setErr("비밀번호는 6자 이상 입력해 주세요.");
      return;
    }
    if (pw !== pw2) {
      setErr("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      const res = await fetch("http://43.201.15.212:8080/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: pw, nickname }),
      });
      const data = await res.json();
      if (!res.ok || !data?.success) throw new Error(data.message || "회원가입 실패");

      sessionStorage.removeItem("authToken");
      sessionStorage.removeItem("isLoggedIn");

      nav("/login-main", { replace: true });
    } catch (err) {
      setErr(err.message || "문제가 발생했습니다.");
    }
  };

  return (
    <div className="signup-container">
      <form className="signup-box" onSubmit={onSubmit}>
        <h2 className="signup-title">회원가입</h2>
        <label>닉네임</label>
        <input
          type="text"
          placeholder="닉네임 입력"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />
        <label>이메일</label>
        <div className="row-email">
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
          />
          <button
            type="button"
            className="dup-btn"
            onClick={checkDuplicate}
            disabled={!emailValid}
            title={!emailValid ? "올바른 이메일을 입력하세요" : ""}
          >
            중복 확인
          </button>
        </div>
        {emailCheckMsg && (
          <div
            className="email-msg"
            style={{ color: emailConfirmed ? "green" : "red" }}
          >
            {emailCheckMsg}
          </div>
        )}
        <label>비밀번호</label>
        <input
          type="password"
          placeholder="비밀번호 입력(6자 이상)"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
        />
        <label>비밀번호 다시 입력</label>
        <input
          type="password"
          placeholder="비밀번호 재입력"
          value={pw2}
          onChange={(e) => setPw2(e.target.value)}
        />
        {err && <div className="error">{err}</div>}
        <div className="signup-actions">
          <button
            type="button"
            className="back-btn"
            onClick={() => nav("/login-main")}
          >
            돌아가기
          </button>
          <button type="submit" className="submit-btn">
            회원가입하기
          </button>
        </div>
      </form>
    </div>
  );
}