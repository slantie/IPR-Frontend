import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { useSelector } from "react-redux";

const QuizPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState(15 * 60);
  const [answers, setAnswers] = useState({});
  const { currentUser } = useSelector((state) => state.user);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const optionLabels = ["A", "B", "C", "D"];

  useEffect(() => {
    document.querySelector("nav").style.display = "none";
    fetchQuizQuestions();

    const timer = setInterval(() => {
      setTimeRemaining((prevTime) => {
        if (prevTime <= 0) {
          clearInterval(timer);
          submitQuiz();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    window.history.pushState(null, null, window.location.pathname);
    window.addEventListener("popstate", handlePopState);

    return () => {
      clearInterval(timer);
      window.removeEventListener("popstate", handlePopState);
      document.querySelector("nav").style.display = "block";
    };
  }, []);

  const fetchQuizQuestions = async () => {
    try {
      const response = await axios.get(`/api/quiz/get-quiz-questions/${id}`, {
        withCredentials: true,
      });
      if (response.data.success) {
        setQuestions(response.data.quizQuestions);
      } else {
        toast.error("Failed to fetch quiz questions");
      }
    } catch (error) {
      console.error("Error fetching quiz questions:", error);
      toast.error("An error occurred while fetching quiz questions");
    }
  };

  const handlePopState = (event) => {
    event.preventDefault();
    const confirmExit = window.confirm(
      "If you go back, the quiz will be submitted automatically. Are you sure?"
    );
    if (confirmExit) {
      submitQuiz();
    } else {
      window.history.pushState(null, null, window.location.pathname);
    }
  };

  const handleAnswerChange = useCallback((questionId, answer) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: answer,
    }));
  }, []);

  const submitQuiz = async () => {
    const timeTaken = 15 * 60 - timeRemaining;
    const minutes = Math.floor(timeTaken / 60);
    const seconds = timeTaken % 60;

    const quizData = {
      userId: currentUser.user.id,
      quizId: id,
      timeTaken: `${minutes}:${seconds.toString().padStart(2, "0")}`,
      answers,
    };

    try {
      const response = await axios.post('/api/quiz/submit', quizData, {
        withCredentials: true,
      });
      if (response.data.success) {
        localStorage.setItem("quizResults", JSON.stringify(response.data.data));
        localStorage.setItem("submittedAnswers", JSON.stringify(answers));
        localStorage.setItem("quizQuestions", JSON.stringify(questions));
        navigate(`/result/${id}`, { replace: true });
      } else {
        toast.error("Failed to submit quiz");
      }
    } catch (error) {
      console.error("Error submitting quiz:", error);
      toast.error("An error occurred while submitting the quiz");
    }
  };

  const getFormattedTime = useCallback(() => {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  }, [timeRemaining]);

  return (
    <div className="min-h-screen  bg-[#fffaf7] p-4 sm:p-8 relative">
      <div className="fixed top-40 right-4 bg-white p-5 rounded-lg shadow-lg">
        <span className="text-xl font-semibold text-orange-600">
          Time Left:
        </span>
        <div className="text-2xl font-bold text-red-600">
          {getFormattedTime()}
        </div>
      </div>

      <h1 className="text-4xl font-bold text-center text-gray-700 mb-12">
        Quiz
      </h1>

      <div className="space-y-8 max-w-4xl mx-auto">
        {questions.map((question, index) => (
          <div key={question.id} className="bg-white p-8 rounded-xl shadow-xl border border-gray-200 relative">
            <div className="absolute top-0 left-0 bg-gradient-to-r from-orange-500 to-yellow-500 w-2 h-full rounded-br-lg"></div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 relative z-10">
              <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-lg font-semibold mr-2">
                {index + 1}
              </span>
              {question.question}
            </h2>
            {question.imageLink && (
              <img src={question.imageLink} alt="Question" className="w-full h-[30rem] object-cover rounded-lg shadow-md mb-4" />
            )}
            <div className="grid grid-cols-2 gap-4">
              {question.options.map((option, optionIndex) => (
                <button
                  key={`${question.id}-${optionIndex}`}
                  className={`flex items-center p-4 border border-gray-300 rounded-lg transition-transform duration-300 ease-in-out ${
                    answers[question.id] === option
                      ? "bg-orange-100 border-orange-500"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                  onClick={() => handleAnswerChange(question.id, option)}
                >
                  <span className="font-bold text-lg text-orange-600 mr-3">
                    {optionLabels[optionIndex]}
                  </span>
                  {option}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 sm:mt-12 text-center">
        <button
          onClick={() => setShowConfirmation(true)}
          className="px-6 py-3 sm:px-8 sm:py-4 bg-orange-500 text-white text-lg sm:text-xl rounded-lg hover:bg-orange-600 transition duration-200 ease-in-out shadow-md"
        >
          Submit Quiz
        </button>
      </div>

      {showConfirmation && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-10 rounded-lg shadow-lg text-center">
            <h3 className="text-3xl font-semibold mb-6">
              Are you sure you want to submit the quiz?
            </h3>
            <div className="space-x-6">
              <button
                className="px-6 py-3 bg-red-500 text-white text-lg rounded-lg hover:bg-red-600 transition"
                onClick={submitQuiz}
              >
                Yes, Submit
              </button>
              <button
                className="px-6 py-3 bg-gray-300 text-lg rounded-lg hover:bg-gray-400 transition"
                onClick={() => setShowConfirmation(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizPage;
