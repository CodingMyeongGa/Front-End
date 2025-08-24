export const AUTH_KEY = 'auth_token'

// ⬇️ dev 용: 세션 단위 로그인(새 탭/서버 재기동 시 초기화 용이)
const S = sessionStorage

export const isAuthed = () => !!S.getItem(AUTH_KEY)
export const getToken = () => S.getItem(AUTH_KEY) || null

export const login = (token = 'localdev') => {
  S.setItem(AUTH_KEY, token)
  window.dispatchEvent(new Event('auth:change')) // 동일 탭 즉시 반영
}
export const logout = () => {
  S.removeItem(AUTH_KEY)
  window.dispatchEvent(new Event('auth:change'))
}