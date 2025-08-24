import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import { Outlet, useLocation } from "react-router-dom";
import { LocationProvider } from "../context/LocationContext";

export default function RootLayout() {
  const { pathname } = useLocation();
  const hideFooter = pathname === "/login-main" || pathname === "/signup";

  return (
    <div id="mobile-wrapper">
      <Header />
      <main id="content">
        <LocationProvider>
          <Outlet />
        </LocationProvider>
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
}