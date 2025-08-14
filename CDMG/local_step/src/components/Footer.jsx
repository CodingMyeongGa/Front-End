import './Footer.css';
import Button from './Foot_Button';

const Footer = ({ active, setActive }) => (
  <div id="footer">
    <Button name="home" isActive={active === 'home'} onClick={() => setActive('home')} />
    <Button name="setRoute" isActive={active === 'setRoute'} onClick={() => setActive('setRoute')} />
    <Button name="mypage" isActive={active === 'mypage'} onClick={() => setActive('mypage')} />
  </div>
);

export default Footer;
