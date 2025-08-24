import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import { Outlet } from "react-router-dom";
import { LocationProvider } from "../context/LocationContext";

export default function RootLayout() {
  return (
    <div id="mobile-wrapper">
      <Header />
      <main id="content">
        <LocationProvider>
          <Outlet />
        </LocationProvider>
      </main>
      <Footer />
    </div>
  );
}