import { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  FaUser,
  FaUpload,
  FaPlusCircle,
  FaHistory,
  FaChartBar,
  FaBars,
  FaSignOutAlt,
  FaTasks,
  FaTimes,
} from "react-icons/fa";
import { signInSuccess } from "../slices/userSlice";
import { toast } from "react-toastify";

const DashSidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [tab, setTab] = useState("");
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

  const studentSidebarItems = [
    {
      name: "Profile",
      param: "profile",
      icon: <FaUser size={24} />,
      component: "DashProfile",
    },
    {
      name: "Past Quizzes",
      param: "past-quizzes",
      icon: <FaHistory size={24} />,
      component: "DashPastQuizzes",
    },
  ];

  const adminSidebarItems = [
    {
      name: "Profile",
      param: "profile",
      icon: <FaUser size={24} />,
      component: "DashProfile",
    },
    {
      name: "Upload Excel",
      param: "upload-excel",
      icon: <FaUpload size={24} />,
      component: "DashUploadExcel",
    },
    {
      name: "Create Quiz",
      param: "create-quiz",
      icon: <FaPlusCircle size={24} />,
      component: "DashCreateQuiz",
    },
    {
      name: "Manage Quiz",
      param: "manage-quiz",
      icon: <FaTasks size={24} />,
      component: "DashManageQuiz",
    },
    {
      name: "Analytics",
      param: "analytics",
      icon: <FaChartBar size={24} />,
      component: "DashboardAnalytics",
    },
  ];

  const sidebarItems = currentUser?.user.isAdmin
    ? adminSidebarItems
    : studentSidebarItems;

  const closeSidebar = () => {
    if (window.innerWidth < 1024) {
      toggleSidebar();
    }
  };

  const handleSignout = async () => {
    try {
      const response = await fetch("/api/user/signout", {
        method: "POST",
        credentials: "include",
      });
      if (response.ok) {
        dispatch(signInSuccess(null));
        navigate("/");
        toast.success("Signed out successfully");
      } else {
        toast.error("Signout failed");
      }
    } catch (error) {
      toast.error("Error during signout");
    }
  };

  return (
    <>
      <button
        className={`fixed top-32 z-30 text-blue-600 p-3 rounded-md lg:hidden transition-all duration-300 ${
          isOpen ? 'left-56 top-36' : ' top-[6.9rem]'
        }`}
        onClick={toggleSidebar}
      >
        {isOpen ? <FaTimes size={24} /> : <FaBars size={26} />}
      </button>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={closeSidebar}
        ></div>
      )}
      <div
        className={`fixed top-28 left-0 h-screen bg-white text-gray-800 w-72 p-6 z-20 transition-transform duration-300 ease-in-out transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 shadow-lg overflow-y-auto`}
      >
        <h2 className="text-3xl font-bold mb-8 text-blue-600">
          IPR Quiz Dashboard
        </h2>
        <nav className="flex flex-col justify-between h-[calc(100%-13.5rem)]">
          <ul className="space-y-6">
            {sidebarItems.map((item) => (
              <li key={item.param}>
                <Link
                  to={`/dashboard?tab=${item.param}`}
                  className={`flex items-center py-3 px-5 rounded transition duration-200 ${
                    tab === item.param
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 hover:bg-blue-100"
                  }`}
                  onClick={() => {
                    setTab(item.param);
                    closeSidebar();
                  }}
                >
                  <span
                    className={`mr-4 ${
                      tab === item.param ? "text-white" : "text-blue-600"
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span className="text-lg">{item.name}</span>
                  {item.param === "profile" && (
                    <span
                      className={`ml-auto px-2 py-1 text-sm font-semibold rounded-md ${
                        currentUser?.user.isAdmin
                          ? "bg-yellow-300 text-black"
                          : "bg-green-300 text-green-900"
                      }`}
                    >
                      {currentUser?.user.isAdmin ? "Admin" : "Student"}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
          <button
            onClick={handleSignout}
            className="flex items-center py-3 px-5 rounded transition duration-200 text-gray-700 hover:bg-red-100 mt-auto text-lg"
          >
            <span className="mr-4 text-red-600">
              <FaSignOutAlt size={24} />
            </span>
            Sign Out
          </button>
        </nav>
      </div>
    </>
  );
};

export default DashSidebar;
