import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import { Outlet, useLocation } from "react-router-dom";
import { LocationProvider } from "../context/LocationContext";

export default function RootLayout() {
  const { pathname } = useLocation();
  const isAuthPage = pathname === "/login-main" || pathname === "/signup";
  return (
    <div id="mobile-wrapper">
      {!isAuthPage && <Header />}
      <main id="content">
        <LocationProvider>
          <Outlet />
        </LocationProvider>
      </main>
      {!isAuthPage && <Footer />}
    </div>
  );
}