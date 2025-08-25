import { useLocation, useNavigate } from 'react-router-dom'
import './Footer.css'
import Button from './Foot_Button'
import { readGoal } from '../../hooks/useAutoGoalSession'

export default function Footer() {
  const { pathname } = useLocation()

  const navigate = useNavigate()
  const active =
    pathname === '/' ? 'home' :
     (pathname === '/set-route' || pathname === '/edit' || pathname === '/route-recommend-page') ? 'setRoute' :
    pathname === '/mypage' ? 'mypage' : ''

  const goSet = () => {
    const g = readGoal()
    if (g > 0) navigate('/route-recommend-page')
    else navigate('/edit')
  }

  return (
    <div id="footer">
      <Button name="home"     isActive={active === 'home'}     onClick={() => navigate('/')} />
      <Button name="setRoute" isActive={active === 'setRoute'} onClick={goSet} />
      <Button name="mypage"   isActive={active === 'mypage'}   onClick={() => navigate('/mypage')} />
    </div>
  )
}
