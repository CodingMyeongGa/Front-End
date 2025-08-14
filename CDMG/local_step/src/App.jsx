import { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import WeatherDate from './components/WeatherDate';
import './App.css';

import { Routes, Route, Navigate } from "react-router-dom";
import RootLayout from "./layouts/RootLayout.jsx";
import Home from "./pages/Home.jsx";
import Mypage from "./pages/Mypage.jsx";
import Edit from "./pages/Edit.jsx";
import SetRoute from "./pages/SetRoute.jsx";

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
      </Route>
    </Routes>
  );
}

export default App;