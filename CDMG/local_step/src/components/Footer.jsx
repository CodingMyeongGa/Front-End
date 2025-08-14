// import './Footer.css';
// import Button from './Foot_Button';

// const Footer = ({ active, setActive }) => (
//   <div id="footer">
//     <Button name="home" isActive={active === 'home'} onClick={() => setActive('home')} />
//     <Button name="setRoute" isActive={active === 'setRoute'} onClick={() => setActive('setRoute')} />
//     <Button name="mypage" isActive={active === 'mypage'} onClick={() => setActive('mypage')} />
//   </div>
// );

// export default Footer;

import { useLocation, useNavigate } from 'react-router-dom'
import './Footer.css'
import Button from './Foot_Button'

export default function Footer() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const active =
    pathname === '/' ? 'home' :
    pathname === '/set-route' ? 'setRoute' :
    pathname === '/mypage' ? 'mypage' : ''

  return (
    <div id="footer">
      <Button name="home"     isActive={active === 'home'}     onClick={() => navigate('/')} />
      <Button name="setRoute" isActive={active === 'setRoute'} onClick={() => navigate('/set-route')} />
      <Button name="mypage"   isActive={active === 'mypage'}   onClick={() => navigate('/mypage')} />
    </div>
  )
}