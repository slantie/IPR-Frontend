import { FaChevronDown, FaUser, FaBars, FaTimes } from "react-icons/fa";
import { IoLanguage } from "react-icons/io5";
import Logo from "/Logo.jpg";
import { useTranslation } from "react-i18next";
import { Button, Modal } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState, useRef, useEffect } from "react";
import { signInSuccess } from "../slices/userSlice";

const useOutsideClick = (callback) => {
  const ref = useRef();

  useEffect(() => {
    const handleClick = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClick);

    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, [callback]);

  return ref;
};

const Header = () => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [showSignoutModal, setShowSignoutModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { currentUser } = useSelector((state) => state.user);

  const handleDropdownToggle = (dropdownName) => {
    setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
  };

  const closeDropdown = () => {
    setOpenDropdown(null);
  };

  const dropdownRef = useOutsideClick(closeDropdown);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    closeDropdown();
    setMobileMenuOpen(false);
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
      } else {
        console.error("Signout failed");
      }
    } catch (error) {
      console.error("Error during signout:", error);
    }
    setShowSignoutModal(false);
    setMobileMenuOpen(false);
    closeDropdown();
  };

  return (
    <nav className="fixed bg-white shadow-lg w-full">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center space-x-4">
            <img src={Logo} alt="IPR Logo" className="h-18 w-20" />
            <div>
              <div className="text-orange-500 text-xl sm:text-3xl font-black">Institute for Plasma Research</div>
              <div className="text-gray-600 text-sm sm:text-2xl">{t("instituteHindi")}</div>
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-8" ref={dropdownRef}>
            <Link to="/about-us" className="text-gray-800 hover:text-orange-500 text-lg font-medium transition duration-300">
              About Us
            </Link>
            <div className="relative">
              <button
                onClick={() => handleDropdownToggle('language')}
                className="flex items-center text-gray-800 hover:text-orange-500 text-lg font-medium transition duration-300"
              >
                <IoLanguage className="mr-2 text-3xl" />
                <span>{t("language")}</span>
                <FaChevronDown className={`ml-2 w-5 h-5 transition-transform ${openDropdown === 'language' ? "rotate-180" : "rotate-0"}`} />
              </button>
              {openDropdown === 'language' && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                  {["en", "gu", "hi"].map((lang) => (
                    <button
                      key={lang}
                      onClick={() => changeLanguage(lang)}
                      className={`block w-full text-left px-4 py-2 text-lg text-gray-700 hover:bg-orange-100 transition duration-300 ${
                        i18n.language === lang ? "bg-orange-200 text-orange-600 font-semibold" : ""
                      }`}
                    >
                      {lang === "en" ? "English" : lang === "gu" ? "ગુજરાતી" : "हिंदी"}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {currentUser ? (
              <div className="relative group">
                <button
                  onClick={() => handleDropdownToggle('user')}
                  className="flex justify-center items-center text-gray-800 text-xl font-medium transition duration-300 border-2 h-14 w-64 border-gray-400 rounded-md hover:border-orange-500"
                >
                  <FaUser className="mr-2 text-2xl" />
                  <span className="text-lg">Welcome, <span className="text-orange-500 opacity-85">{currentUser?.user.firstName ? ` ${currentUser.user.firstName}` : ' Guest'}</span></span>
                  <FaChevronDown className={`ml-2 w-5 h-5 transition-transform ${openDropdown === 'user' ? "rotate-180" : "rotate-0"}`} />
                </button>
                <div className={`absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg py-1 z-10 transition-opacity duration-300 ${openDropdown === 'user' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                  <Link
                    to="/dashboard"
                    className="block px-4 py-2 text-lg text-gray-700 hover:bg-orange-100 transition duration-300"
                    onClick={closeDropdown}
                  >
                    {t("accountSettings")}
                  </Link>
                  <button
                    onClick={() => setShowSignoutModal(true)}
                    className="block w-full text-left px-4 py-2 text-lg text-gray-700 hover:bg-orange-100 transition duration-300"
                  >
                    {t("signOut")}
                  </button>
                </div>
              </div>            
            ) : (
              <Link to="/sign-up">
                <Button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-2 rounded-md text-5xl font-medium transition duration-300">
                  <span className="text-xl">Sign Up</span>
                </Button>
              </Link>
            )}
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-800 hover:text-orange-500 transition duration-300"
            >
              {mobileMenuOpen ? <FaTimes size={28} /> : <FaBars size={28} />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link
                to="/past-quiz"
                className="block text-gray-800 hover:text-orange-500 text-lg font-medium transition duration-300"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t("pastQuizzes")}
              </Link>
              <button
                onClick={() => handleDropdownToggle('language')}
                className="flex items-center w-full text-gray-800 hover:text-orange-500 text-lg font-medium transition duration-300"
              >
                <IoLanguage className="mr-2 text-xl" />
                <span className="font-medium">{t("language")}</span>
                <FaChevronDown className={`ml-2 w-5 h-5 transition-transform ${openDropdown === 'language' ? "rotate-180" : "rotate-0"}`} />
              </button>
              {openDropdown === 'language' && (
                <div className="pl-4">
                  {["en", "gu", "hi"].map((lang) => (
                    <button
                      key={lang}
                      onClick={() => changeLanguage(lang)}
                      className={`block w-full text-left py-2 text-lg text-gray-700 hover:bg-orange-100 transition duration-300 ${
                        i18n.language === lang ? "bg-orange-200 text-orange-600 font-semibold" : ""
                      }`}
                    >
                      {lang === "en" ? "English" : lang === "gu" ? "ગુજરાતી" : "हिंदी"}
                    </button>
                  ))}
                </div>
              )}
              {currentUser ? (
                <>
                  <Link
                    to="/dashboard"
                    className="block text-gray-800 hover:text-orange-500 text-lg font-medium transition duration-300"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t("accountSettings")}
                  </Link>
                  <button
                    onClick={() => setShowSignoutModal(true)}
                    className="block w-full text-left text-gray-800 hover:text-orange-500 text-lg font-medium transition duration-300"
                  >
                    {t("signOut")}
                  </button>
                </>
              ) : (
                <Link
                  to="/sign-up"
                  className="block text-gray-800 hover:text-orange-500 text-lg font-medium transition duration-300"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              )}
            </div>
          </div>
        )}
      </div>

      <Modal show={showSignoutModal} onClose={() => setShowSignoutModal(false)}>
        <Modal.Header>Confirm Sign Out</Modal.Header>
        <Modal.Body>
          <p className="text-base leading-relaxed text-gray-500">
            Are you sure you want to sign out?
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button className="bg-orange-500" onClick={handleSignout}>
            Yes, Sign Out
          </Button>
          <Button color="gray" onClick={() => setShowSignoutModal(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </nav>
  );
};

export default Header;
