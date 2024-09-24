import { useTranslation } from "react-i18next";
import "./App.css";
import { useState, useEffect } from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import Header from "./components/Header";
import MobileNav from "./components/MobileNav";
import ScrollToTop from "./components/ScrollToTop";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Error404 from "./pages/Error404";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import QuizPage from "./pages/QuizPage.jsx";
import Results from "./pages/Results.jsx";
import { AboutUs } from "./pages/AboutUs.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const { t } = useTranslation();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <ToastContainer />
        <div className="fixed top-0 left-0 right-0 z-30">
          {isMobile ? <MobileNav /> : <Header />}
        </div>
        <main className="flex-grow mt-28 z-0">
          <ScrollToTop /> 
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route element={<PrivateRoute />}>
              <Route path="/quiz/:id" element={<QuizPage />} />
              <Route path="/result/:id" element={<Results />} />
            </Route>
            <Route element={<PrivateRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>
            <Route path="*" element={<Error404 />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
