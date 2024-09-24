import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import DashSidebar from "../components/DashSidebar";
import DashUploadExcel from "../components/DashUploadExcel";
import DashCreateQuiz from "../components/DashCreateQuiz";
import DashPastQuizzes from "../components/DashPastQuizzes";
import DashboardAnalytics from "../components/DashboardAnalytics";
import DashProfile from "../components/DashProfile";
import DashManageQuiz from "../components/DashManageQuiz";

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [tab, setTab] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    } else {
      navigate("/dashboard?tab=profile");
    }
  }, [location.search, navigate]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };
  
    window.addEventListener('resize', handleResize);
    handleResize(); // Call it initially
  
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex grow">
      <DashSidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-72' : 'ml-0'} lg:ml-72 p-0`}>
        {tab === "profile" && <DashProfile />}
        {currentUser?.user.isAdmin && tab === "upload-excel" && <DashUploadExcel />}
        {currentUser?.user.isAdmin && tab === "create-quiz" && <DashCreateQuiz />}
        {currentUser?.user.isAdmin && tab === "manage-quiz" && <DashManageQuiz />}
        {!currentUser?.user.isAdmin && tab === "past-quizzes" && <DashPastQuizzes />}
        {currentUser?.user.isAdmin && tab === "analytics" && <DashboardAnalytics />}
      </div>
    </div>
  );
};

export default Dashboard;