// import './Header.css';

// const Header = ({ title }) => (
//   <div id="header">
//     <p id='header_txt'>{title}</p>
//   </div>
// );
// export default Header;

import { useLocation } from 'react-router-dom'
import './Header.css'

const TITLES = {
  '/': '홈',
  '/set-route': '경로 설정',
  '/route-recommend-page': '경로 추천',  // ⬅️ 추가
  '/mypage': '마이 페이지',
  '/edit': '설정'
}

export default function Header() {
  const { pathname } = useLocation()
  const title = TITLES[pathname] ?? 'Local_Step'
  return (
    <div id="header">
      <p id="header_txt">{title}</p>
    </div>
  )
}