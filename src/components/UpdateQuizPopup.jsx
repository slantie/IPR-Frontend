import { useState } from "react";
import { FaTimes, FaTrash } from "react-icons/fa";

const UpdateQuizPopup = ({ quiz, onClose, onUpdate, onDelete }) => {
  const [updatedQuiz, setUpdatedQuiz] = useState({
    id: quiz.id,
    title: quiz.title,
    startDate: new Date(quiz.startDate).toISOString().slice(0, 16),
    endDate: new Date(quiz.endDate).toISOString().slice(0, 16),
    imageLink: quiz.imageLink,
    description: quiz.description,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedQuiz((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (new Date(updatedQuiz.endDate) <= new Date(updatedQuiz.startDate)) {
      toast.error("End time must be after start time");
      return;
    }
    onUpdate(updatedQuiz);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Update Quiz</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="title"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={updatedQuiz.title}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="startDate"
            >
              Start Date and Time
            </label>
            <input
              type="datetime-local"
              id="startDate"
              name="startDate"
              value={updatedQuiz.startDate}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="endDate"
            >
              End Date and Time
            </label>
            <input
              type="datetime-local"
              id="endDate"
              name="endDate"
              value={updatedQuiz.endDate}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="imageLink"
            >
              Image Link
            </label>
            <input
              type="text"
              id="imageLink"
              name="imageLink"
              value={updatedQuiz.imageLink}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="description"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={updatedQuiz.description}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              rows="3"
            ></textarea>
          </div>
          <div className="flex items-center justify-between mt-6">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Update Quiz
            </button>
            <button
              type="button"
              onClick={() => onDelete(quiz.id)}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center"
            >
              <FaTrash className="mr-2" />
              Delete Quiz
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateQuizPopup;
