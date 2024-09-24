import { useState } from "react";
import { RiEyeLine, RiEyeOffLine } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import login from "../../assets/login.svg";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SignUp = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    password: "",
    mobileNumber: "",
    dateOfBirth: "",
    schoolName: "",
    standard: "",
    city: "",
  });

  const cities = [
    "Ahmedabad",
    "Amreli",
    "Anand",
    "Aravalli",
    "Banaskantha",
    "Bharuch",
    "Bhavnagar",
    "Botad",
    "Chhota Udaipur",
    "Dahod",
    "Dang",
    "Devbhoomi Dwarka",
    "Gandhinagar",
    "Gir Somnath",
    "Jamnagar",
    "Junagadh",
    "Kheda",
    "Kutch",
    "Mahisagar",
    "Mehsana",
    "Morbi",
    "Narmada",
    "Navsari",
    "Panchmahal",
    "Patan",
    "Porbandar",
    "Rajkot",
    "Sabarkantha",
    "Surat",
    "Surendranagar",
    "Tapi",
    "Vadodara",
    "Valsad",
  ];

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "standard" ? parseInt(value, 10) : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      if (Object.values(formData).some((field) => field === "")) {
        toast.error("Please fill in all the fields.");
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        toast.error("Please enter a valid email address.");
        return;
      }

      const mobileRegex = /^[0-9]{10}$/;
      if (!mobileRegex.test(formData.mobileNumber)) {
        toast.error("Please enter a valid mobile number (10 digits).");
        return;
      }

      if (formData.password.length < 6) {
        toast.error("Password must be at least 6 characters long.");
        return;
      }

      const response = await axios.post("/api/auth/signup", formData, {
        headers: { "Content-Type": "application/json" },
      });

      const data = response.data;

      if (data.success) {
        localStorage.setItem("token", data.token);
        toast.success("Registration successful! Redirecting to login...");
        setTimeout(() => navigate("/login"), 3000);
      } else {
        toast.error("Registration failed. Please try again.");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "An error occurred. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row bg-gray-100 py-2">
      <div className="hidden lg:flex flex-col w-1/2">
        <div className="flex-grow flex items-center justify-center ml-36">
          <img src={login} alt="Feature image" className="h-auto w-auto" />
        </div>
      </div>
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-8 pt-16 pb-14">
        <div className="bg-white px-4 lg:px-8 py-8 rounded-2xl shadow-md border-2 border-orange-200 w-full max-w-2xl">
          <h1 className="text-2xl lg:text-3xl font-bold text-center mb-6 text-orange-500">
            Let&aposs Register Account
          </h1>
          {errorMessage && (
            <div className="text-red-500 mb-4 text-center">{errorMessage}</div>
          )}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block mb-1 font-medium">
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  name="firstName"
                  placeholder="John"
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                  value={formData.firstName}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label htmlFor="middleName" className="block mb-1 font-medium">
                  Middle Name
                </label>
                <input
                  id="middleName"
                  type="text"
                  name="middleName"
                  placeholder="William"
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                  value={formData.middleName}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block mb-1 font-medium">
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  name="lastName"
                  placeholder="Doe"
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                  value={formData.lastName}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label htmlFor="email" className="block mb-1 font-medium">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="johndoe@example.com"
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label
                  htmlFor="mobileNumber"
                  className="block mb-1 font-medium"
                >
                  Mobile Number
                </label>
                <input
                  id="mobileNumber"
                  type="text"
                  name="mobileNumber"
                  placeholder="9876543210"
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                  value={formData.mobileNumber}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label htmlFor="dateOfBirth" className="block mb-1 font-medium">
                  Date of Birth
                </label>
                <input
                  id="dateOfBirth"
                  type="date"
                  name="dateOfBirth"
                  placeholder="2000-01-01"
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label htmlFor="schoolName" className="block mb-1 font-medium">
                  School Name
                </label>
                <input
                  id="schoolName"
                  type="text"
                  name="schoolName"
                  placeholder="Springfield Elementary"
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                  value={formData.schoolName}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label htmlFor="standard" className="block mb-1 font-medium">
                  Standard
                </label>
                <select
                  id="standard"
                  name="standard"
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                  value={formData.standard}
                  onChange={handleInputChange}
                >
                  <option value="" disabled>
                    Select your standard
                  </option>
                  {[...Array(8)].map((_, index) => (
                    <option key={index + 5} value={index + 5}>
                      {index + 5}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label htmlFor="city" className="block mb-1 font-medium">
                City
              </label>
              <select
                id="city"
                name="city"
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={formData.city}
                onChange={handleInputChange}
              >
                <option value="">Select your city</option>
                {cities.map((city, index) => (
                  <option key={index} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="password" className="block mb-1 font-medium">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="********"
                  className="w-full p-3 border border-gray-300 rounded pr-10 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  value={formData.password}
                  onChange={handleInputChange}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? (
                    <RiEyeOffLine size={20} />
                  ) : (
                    <RiEyeLine size={20} />
                  )}
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-orange-500 text-white text-lg font-bold transition-all hover:bg-orange-600 active:scale-[.98] disabled:bg-orange-300"
              disabled={loading}
            >
              {loading ? "Loading..." : "Register"}
            </button>
          </form>
          <div className="flex items-center justify-center mt-4">
            <hr className="flex-grow border-t border-gray-300" />
            <span className="mx-2 text-gray-500">or</span>
            <hr className="flex-grow border-t border-gray-300" />
          </div>

          <p className="text-center mt-4">
            Already have an account?
            <Link
              to="/login"
              className="font-medium text-orange-500 ml-2 hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
