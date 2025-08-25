import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { isAuthed } from "../utils/auth";

export default function AuthGate(){
  const { pathname } = useLocation();
  const [ok, setOk] = useState(null);
  useEffect(() => {
    const check = () => setOk(isAuthed());
    check();
    window.addEventListener("auth:change", check);
    return () => window.removeEventListener("auth:change", check);
  }, []);
  if (ok == null) return null;
  return ok ? <Outlet/> : <Navigate to="/login-main" replace state={{ from: pathname }} />;
}