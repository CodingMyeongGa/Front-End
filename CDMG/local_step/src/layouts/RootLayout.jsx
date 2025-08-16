import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import { Outlet } from "react-router-dom";

export default function RootLayout() {
  return (
    <div id="mobile-wrapper">
      <Header />
      <main id="content">
        <Outlet /> 
      </main>
      <Footer />
    </div>
  );
}
