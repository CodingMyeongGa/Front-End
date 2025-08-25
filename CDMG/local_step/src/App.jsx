import { useEffect, useState } from 'react';
import Header from './components/Header/Header.jsx';
import Footer from './components/Footer/Footer';
import WeatherDate from './components/Home/WeatherDate.jsx';
import { isAuthed } from "./utils/auth";
import './App.css';

import { Routes, Route, Navigate } from "react-router-dom";
import RootLayout from "./layouts/RootLayout.jsx";
import Home from "./pages/Home.jsx";
import Mypage from "./pages/Mypage.jsx";
import Edit from "./pages/Edit.jsx";
import SetRoute from "./pages/SetRoute.jsx";
import Setting from "./pages/Setting.jsx";
import StepsWeekly from './pages/StepsWeekly.jsx';
import LoginMain from './pages/LoginMain.jsx';
import Signup from './pages/Signup.jsx';
import AuthGate from "./routes/AuthGate.jsx";
import RouteRecommendPage from './pages/RouteRecommendPage.jsx';



function App() {
  const [active, setActive] = useState('home');
  const headerTitles = {
    home: '홈',
    setRoute: '경로 설정',
    mypage: '마이 페이지'
  };

  const totalSteps = 49000;

  const [authed, setAuthed] = useState(isAuthed());
  useEffect(() => {
    const on = () => setAuthed(isAuthed());
    window.addEventListener('storage', on);
    window.addEventListener('auth:change', on);
    return () => {
        window.removeEventListener('storage', on);
        window.removeEventListener('auth:change', on);
    };
  }, []);

  return (
    <Routes>
        {/* ▼ 로그인 필요 영역 */}
        <Route element={<RootLayout />}>
          <Route index element={<Home week_step_total={totalSteps} />} />
          <Route path="mypage" element={<Mypage />} />
          <Route path="edit" element={<Edit />} />
          <Route path="set-route" element={<SetRoute />} />
          <Route path="setting" element={<Setting/>} />
          <Route path="stepsweekly" element={<StepsWeekly/>} />
          <Route path="signup" element={<Signup/>} />
          <Route path="login-main" element={<LoginMain/>} />
          <Route path="route-recommend-page" element={<RouteRecommendPage/>} />
        </Route>
    </Routes>
  );
}

export default App;