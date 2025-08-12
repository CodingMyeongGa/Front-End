import './Footer.css';

import home from '../assets/Footer_btn/Home_btn_clicked.png'
import setRoute from '../assets/Footer_btn/SetRoute_btn_default.png'
import mypage from '../assets/Footer_btn/Mypage_btn_default.png'


const Footer = () => {

  return (
    <div id="footer">
      <img src={home} alt="home" />
      <img src={setRoute} alt="set route" />
      <img src={mypage} alt="mypage" />
    </div>
  )
};

export default Footer;