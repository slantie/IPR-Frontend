import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DashCreateQuiz = () => {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [newQuiz, setNewQuiz] = useState({
    title: "",
    startDate: "",
    endDate: "",
    categories: [],
    isBasic: false,
    imageLink: "",
    description: "",
    language: "",
  });

  const [categoryOptions, setCategoryOptions] = useState([]);
  const [languageOptions, setLanguageOptions] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCategoriesAndLanguages = async () => {
      try {
        const [categoriesResponse, languagesResponse] = await Promise.all([
          axios.get("/api/questions/category"),
          axios.get("/api/questions/languages"),
        ]);
        setCategoryOptions(categoriesResponse.data.categories);
        setLanguageOptions(languagesResponse.data.languages);
      } catch (error) {
        console.error("Error fetching categories and languages:", error);
      }
    };

    fetchCategoriesAndLanguages();
  }, []);
  useEffect(() => {
    if (!currentUser.user || !currentUser.user.isAdmin) {
      navigate("/dashboard");
    }
  }, [currentUser, navigate]);


  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewQuiz((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCategoryChange = (e) => {
    const { value, checked } = e.target;
    setNewQuiz((prev) => {
      const updatedCategories = checked
        ? [...prev.categories, value]
        : prev.categories.filter((cat) => cat !== value);

      if (updatedCategories.length > 4) {
        setError("You can only select up to 4 categories");
        return prev;
      }
      setError("");
      return { ...prev, categories: updatedCategories };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !newQuiz.title ||
      !newQuiz.startDate ||
      !newQuiz.endDate ||
      newQuiz.categories.length !== 4 ||
      !newQuiz.language
    ) {
      toast.error(
        "Please fill all required fields, select exactly 4 categories, and choose a language"
      );
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("/api/quiz/create", newQuiz, {
        withCredentials: true,
      });

      if (response.data.success) {
        toast.success("Quiz created successfully!");
        setNewQuiz({
          title: "",
          startDate: "",
          endDate: "",
          categories: [],
          isBasic: false,
          imageLink: "",
          description: "",
          language: "",
        });
      } else {
        toast.error(response.data.message || "Failed to create quiz");
      }
    } catch (error) {
      console.error("Error creating quiz:", error);
      toast.error(
        error.response?.data?.message ||
          "An error occurred while creating the quiz"
      );
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="flex justify-center min-h-[calc(88vh)] items-center bg-white p-8 sm:p-8 md:p-8">
      <div className="bg-white rounded-xl shadow-2xl p-4 sm:p-6 md:p-8 max-w-[98rem] w-full border-2">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-4 text-blue-600">
          Create New Quiz
        </h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="mb-4">
            <label
              className="block text-gray-700 text-base sm:text-lg font-bold mb-2"
              htmlFor="title"
            >
              Title *
            </label>
            <input
              id="title"
              name="title"
              type="text"
              placeholder="Quiz Title"
              value={newQuiz.title}
              onChange={handleInputChange}
              required
              className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="w-full sm:w-1/2">
              <label
                className="block text-gray-700 text-base sm:text-lg font-bold mb-2"
                htmlFor="startDate"
              >
                Start Date *
              </label>
              <input
                id="startDate"
                name="startDate"
                type="datetime-local"
                value={newQuiz.startDate}
                onChange={handleInputChange}
                min={new Date().toISOString().slice(0, 16)}
                required
                className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="w-full sm:w-1/2">
              <label
                className="block text-gray-700 text-base sm:text-lg font-bold mb-2"
                htmlFor="endDate"
              >
                End Date *
              </label>
              <input
                id="endDate"
                name="endDate"
                type="datetime-local"
                value={newQuiz.endDate}
                onChange={handleInputChange}
                min={newQuiz.startDate}
                required
                className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-base sm:text-lg font-bold mb-2">
              Language *
            </label>
            <select
              name="language"
              value={newQuiz.language}
              onChange={handleInputChange}
              required
              className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a language</option>
              {languageOptions.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-base sm:text-lg font-bold mb-2">
              Categories * (Select exactly 4)
            </label>
            <div className="flex flex-wrap">
              {categoryOptions.map((category) => (
                <label
                  key={category}
                  className="inline-flex items-center mr-4 mb-2"
                >
                  <input
                    type="checkbox"
                    name="categories"
                    value={category}
                    checked={newQuiz.categories.includes(category)}
                    onChange={handleCategoryChange}
                    disabled={
                      newQuiz.categories.length >= 4 &&
                      !newQuiz.categories.includes(category)
                    }
                    className="form-checkbox h-5 w-5 text-blue-600"
                  />
                  <span className="ml-2 text-gray-700 text-sm sm:text-base">{category}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="isBasic"
                checked={newQuiz.isBasic}
                onChange={handleInputChange}
                className="form-checkbox h-5 w-5 text-blue-600"
              />
              <span className="ml-2 text-gray-700 text-sm sm:text-base">Is Basic Quiz</span>
            </label>
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-base sm:text-lg font-bold mb-2"
              htmlFor="imageLink"
            >
              Image Link
            </label>
            <input
              id="imageLink"
              name="imageLink"
              type="text"
              placeholder="Image URL"
              value={newQuiz.imageLink}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-base sm:text-lg font-bold mb-2"
              htmlFor="description"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              placeholder="Quiz description"
              value={newQuiz.description}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-md p-2 w-full h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-md transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </span>
              ) : (
                "Create Quiz"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DashCreateQuiz;