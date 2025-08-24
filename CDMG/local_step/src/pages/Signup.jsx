import { useState } from "react";
import "../components/Login/LoginMain.css";
import { useNavigate } from "react-router-dom";
import "../components/Login/Signup.css";

export default function Signup() {
  const nav = useNavigate();
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [emailMsg, setEmailMsg] = useState("");
  const [emailValid, setEmailValid] = useState(false);
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [err, setErr] = useState("");

  const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  const onEmailChange = (v) => {
    setEmail(v);
    setEmailMsg("");
    const ok = isEmail(v);
    setEmailValid(ok);
  };

  const checkDuplicate = () => {
    if (!emailValid) { setEmailMsg("이메일 형식을 확인해 주세요."); return; }
    // TODO: 중복 확인 실제 API 연동
    // setEmailMsg("이미 가입된 이메일입니다");
    setEmailMsg("가입되지 않은 이메일입니다");
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setErr("");
    if (!nickname.trim() || !email.trim() || !pw || !pw2) { setErr("모든 항목을 입력해 주세요."); return; }
    if (!emailValid) { setErr("이메일 형식을 확인해 주세요."); return; }
    if (pw.length < 6) { setErr("비밀번호는 6자 이상 입력해 주세요."); return; }
    if (pw !== pw2) { setErr("비밀번호가 일치하지 않습니다."); return; }
    alert("회원가입이 완료되었습니다.");
    nav("/login-main", { replace: true });
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
        {emailMsg && <div className="email-msg">{emailMsg}</div>}

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
          <button type="button" className="back-btn" onClick={() => nav("/login-main")}>돌아가기</button>
          <button type="submit" className="submit-btn">회원가입하기</button>
        </div>
      </form>
    </div>
  );
}