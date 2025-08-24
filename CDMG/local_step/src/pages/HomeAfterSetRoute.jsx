import Map from "../components/Home/Map";
import TodayStep from "../components/Home/TodayStep";
import StartStop_btn from "../components/Home/StartStop_btn.jsx";
import WeatherDateCompact from "../components/Home/WeatherDateCompact"; 
import GuideLine from "../components/Home/GuideLine"; 

const HomeAfterSetRoute = () => {
  return (
    <div>
      <WeatherDateCompact />
      <Map />
      <TodayStep />
      <GuideLine />
      <StartStop_btn />
    </div>
  )
};

export default HomeAfterSetRoute;