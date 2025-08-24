// src/routes/AuthGate.jsx  ← 새 파일
import { useEffect, useState } from "react"
import { Navigate, Outlet } from "react-router-dom"

const KEY = "auth_session"

export function setSessionLoggedIn(v=true){ v ? sessionStorage.setItem(KEY,"1") : sessionStorage.removeItem(KEY) }
export function isSessionLoggedIn(){ return sessionStorage.getItem(KEY) === "1" }

export default function AuthGate(){
  const [ok, setOk] = useState(null)
  useEffect(() => { setOk(isSessionLoggedIn()) }, [])
  if (ok == null) return null
  return ok ? <Outlet/> : <Navigate to="/login-main" replace />
}