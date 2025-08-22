const Login = () => {
  const REST_API_KEY = '42751a9b7d932eac24627939d11d3120';
  const REDIRECT_URI = 'http://43.201.15.212/api/auth/kakao';
  const link = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;

  const loginHandler = () => {
    window.location.href = link;
  };

  return (
    <button type='button' onClick={loginHandler}>
      로그인 하기
    </button>
  );
};

export default Login;