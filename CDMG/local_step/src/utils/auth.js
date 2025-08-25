export const AUTH_KEY = "authToken"; // 세션스토리지 키 이름 통일

// dev 용: 세션 단위 로그인 (탭별 관리에 용이)
const S = sessionStorage;

// 로그인 여부 체크
export const isAuthed = () => !!S.getItem(AUTH_KEY);

// 로그인 시 토큰 저장
export const login = (token) => {
  S.setItem(AUTH_KEY, token);
  S.setItem("isLoggedIn", "true");
  window.dispatchEvent(new Event("auth:change")); // 로그인 상태 반영
};

// 토큰 가져오기
export const getToken = () => S.getItem(AUTH_KEY) || null;

// 로그아웃 처리
export const logout = () => {
  S.removeItem(AUTH_KEY);
  S.removeItem("isLoggedIn");
  window.dispatchEvent(new Event("auth:change"));
};