import { useState } from "react";
import {
  FaClock,
  FaQuestionCircle,
  FaCalendarAlt,
  FaTag,
} from "react-icons/fa";
import QuizPopup from "./QuizPopup";
import LoginPopup from "./LoginPopup";
const QuizCard = ({ quiz, isLoggedIn }) => {
  const [showQuizPopup, setShowQuizPopup] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const handleStart = () => {
    if (isLoggedIn) {
      setShowQuizPopup(true);
    } else {
      setShowLoginPopup(true);
    }
  };

  const currentDate = new Date();
  const startDate = new Date(quiz.startDate);
  const endDate = new Date(quiz.endDate);

  const isOngoing = currentDate >= startDate && currentDate <= endDate;
  const isUpcoming = currentDate < startDate;

  const getDaysRemaining = (targetDate) => {
    const timeDiff = targetDate.getTime() - currentDate.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  };

  return (
    <>
      <div className="bg-white bg-opacity-60 backdrop-blur-md shadow-lg rounded-lg p-4 mb-4 transition-transform transform hover:scale-105 duration-300 ease-in-out border border-orange-200">
        <img
          src={quiz.imageLink}
          alt={quiz.title}
          className="w-full h-40 object-cover rounded-lg mb-4"
        />
        <h3 className="text-lg font-semibold mb-2 text-orange-700 flex items-center">
          <FaQuestionCircle className="mr-2 text-yellow-500" />
          {quiz.title}
        </h3>
        <p className="text-gray-600 mb-2">{quiz.description}</p>
        <div className="flex flex-wrap text-gray-600 mb-2">
          {quiz.categories.map((category, index) => (
            <span key={index} className="flex items-center mr-2 mb-1 bg-yellow-200 rounded-[5%] p-1 ">
              {category}
            </span>
          ))}
        </div>
        <p className="text-gray-600 mb-2">
          <FaQuestionCircle className="mr-1 inline text-green-500" />
          {quiz.isBasic ? "Basic" : "Advanced"}
        </p>
        <div className="text-gray-500 mb-2">
          {isOngoing && (
            <p className="flex items-center">
              <FaClock className="mr-1 text-red-500" />
              Quiz ending in {getDaysRemaining(endDate)} Days
            </p>
          )}
          {isUpcoming && (
            <p className="flex items-center">
              <FaCalendarAlt className="mr-1 text-purple-500" />
              Quiz will start in {getDaysRemaining(startDate)} Days
            </p>
          )}
          {!isOngoing && !isUpcoming && (
            <p className="flex items-center">
              <FaCalendarAlt className="mr-1 text-gray-500" />
              Quiz submission is Closed now
            </p>
          )}
        </div>
        {isOngoing && (
          <button
            onClick={handleStart}
            className="mt-4 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition duration-300 ease-in-out"
          >
            Start
          </button>
        )}
      </div>
      <QuizPopup show={showQuizPopup} onClose={() => setShowQuizPopup(false)} quizId={quiz.id} />
      <LoginPopup show={showLoginPopup} onClose={() => setShowLoginPopup(false)} onLogin={() => {/* Implement login logic */}} />
    </>
  );
};

export default QuizCard;