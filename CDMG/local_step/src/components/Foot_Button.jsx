import './Foot_Button.css';

const files = import.meta.glob('../assets/Footer_btn/*.png', { eager: true });
const byName = Object.fromEntries(
  Object.entries(files).map(([k, v]) => [k.split('/').pop(), v.default])
);

const Foot_Button = ({ name, isActive, onClick }) => {
  const srcMap = {
    home: {
      clicked: byName['Home_btn_clicked.png'],
      default: byName['Home_btn_default.png']
    },
    setRoute: {
      clicked: byName['SetRoute_btn_clicked.png'],
      default: byName['SetRoute_btn_default.png']
    },
    mypage: {
      clicked: byName['Mypage_btn_clicked.png'],
      default: byName['Mypage_btn_default.png']
    }
  };

  const src = isActive ? srcMap[name].clicked : srcMap[name].default;

  return (
    <button onClick={onClick} style={{ background: 'none', border: 'none', padding: 0 }}>
      <img src={src} alt={name} />
    </button>
  );
};

export default Foot_Button;