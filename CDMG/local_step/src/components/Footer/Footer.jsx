import { useLocation, useNavigate } from 'react-router-dom'
import './Footer.css'
import Button from './Foot_Button'
import { readGoal } from '../../hooks/useAutoGoalSession'

export default function Footer() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const active =
    pathname === '/' ? 'home' :
     (pathname === '/set-route' || pathname === '/edit') ? 'setRoute' :
    pathname === '/mypage' ? 'mypage' : ''

  const goSet = () => {
    const g = readGoal()
    if (g > 0) navigate('/set-route')
    else navigate('/edit') // 목표 없으면 설정 페이지로 직행
  }

  return (
    <div id="footer">
      <Button name="home"     isActive={active === 'home'}     onClick={() => navigate('/')} />
      <Button name="setRoute" isActive={active === 'setRoute'} onClick={goSet} />
      <Button name="mypage"   isActive={active === 'mypage'}   onClick={() => navigate('/mypage')} />
    </div>
  )
}
