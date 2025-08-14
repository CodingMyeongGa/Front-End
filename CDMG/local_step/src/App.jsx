import { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import WeatherDate from './components/WeatherDate';
import './App.css';

function App() {
  const [active, setActive] = useState('home');
  const headerTitles = {
    home: '홈',
    setRoute: '경로 설정',
    mypage: '마이 페이지'
  };

  return (
    <div id="mobile-wrapper">
      <Header title={headerTitles[active]} />

      <main id="content">
        <WeatherDate />
      </main>

      <Footer active={active} setActive={setActive} />

    </div>
  );
}

export default App;