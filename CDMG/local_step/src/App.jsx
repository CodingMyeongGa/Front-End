import { useState } from 'react';
import Header from './components/Header/Header.jsx';
import Footer from './components/Footer/Footer';
import WeatherDate from './components/Home/WeatherDate.jsx';
import './App.css';

import { Routes, Route, Navigate } from "react-router-dom";
import RootLayout from "./layouts/RootLayout.jsx";
import Home from "./pages/Home.jsx";
import Mypage from "./pages/Mypage.jsx";
import Edit from "./pages/Edit.jsx";
import SetRoute from "./pages/SetRoute.jsx";
// import Login from "./pages/Login.jsx";
import Setting from "./pages/Setting.jsx";
import StepsWeekly from './pages/StepsWeekly.jsx';
import LoginMain from './pages/LoginMain.jsx';



function App() {
  const [active, setActive] = useState('home');
  const headerTitles = {
    home: '홈',
    setRoute: '경로 설정',
    mypage: '마이 페이지'
  };

  return (
    // <div id="mobile-wrapper">
    //   <Header title={headerTitles[active]} />

    //   <main id="content">
    //     <WeatherDate />
    //   </main>

    //   <Footer active={active} setActive={setActive} />

    // </div>
    <Routes>
      <Route element={<RootLayout />}>
        <Route index element={<Home />} />
        <Route path="mypage" element={<Mypage />} />
        <Route path="edit" element={<Edit />} />
        <Route path="set-route" element={<SetRoute />} />
        {/* <Route path="login" element={<Login/>} /> */}
        <Route path="setting" element={<Setting/>} />
        <Route path="stepsweekly" element={<StepsWeekly/>} />
        <Route path="login-main" element={<LoginMain/>} />
      </Route>
    </Routes>
  );
}

export default App;