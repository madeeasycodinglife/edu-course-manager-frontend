import React, { useContext, useState } from "react";
import instanceService from "../apis/CourseInstaceService";
import { AuthContext } from "../context/AuthContext";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CreateInstanceComponent = () => {
  const [instance, setInstance] = useState({
    year: "",
    semester: "",
    courseId: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // State for handling errors

  const { user } = useContext(AuthContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInstance({ ...instance, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Show loading spinner
    try {
      await instanceService.createInstance(instance, user.accessToken);
      // Submit form logic here
      console.log("Course instance submitted:", instance);
      toast.success("Course instance created successfully!"); // Show success notification

      setInstance({
        year: "",
        semester: "",
        courseId: "",
      });
      setError(null);
    } catch (error) {
      console.error("Error creating course instance:", error);

      if (error.statusCode === 503) {
        setError(error.message);
        toast.error(error.message);
      }

      if (error.response) {
        const status = error.response.status;
        const errorMessage = error.response.data.message;

        const errorResponse = error.response.data;
        console.log("errorResponse :", errorResponse);
        if (status === 400) {
          setError(errorMessage ? errorMessage : errorResponse.semester);
          toast.error(errorMessage ? errorMessage : errorResponse.semester);
        } else if (status === 401) {
          setError(errorMessage);
          toast.error(errorMessage);
        } else if (status === 403) {
          setError(errorMessage);
          toast.error(errorMessage);
        } else if (status === 404) {
          setError(errorMessage);
          toast.error(errorMessage);
        } else if (status === 405) {
          setError(errorMessage);
          toast.error(errorMessage);
        } else if (status === 409) {
          setError(errorMessage);
          toast.error(errorMessage);
        } else if (status >= 500) {
          setError(errorMessage);
          toast.error(errorMessage);
        } else {
          setError(errorMessage);
          toast.error(errorMessage);
        }
      } else if (error.request) {
        const errorMessage = error.response.data.message;
        setError(errorMessage);
        toast.error(errorMessage);
      } else {
        const errorMessage = error.response.data.message;
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false); // Hide loading spinner
    }
  };

  // Handler to reset form fields to default values
  const handleCancel = () => {
    setInstance({
      year: "",
      semester: "",
      courseId: "",
    });
  };

  return (
    <div className="p-4">
      <h2 className="header bg-gray-200 text-gray-800 text-xl text-center font-bold p-2">
        Create Course Instance
      </h2>
      <ToastContainer />
      <form onSubmit={handleSubmit} className="mt-12 max-w-lg mx-auto">
        <div className="mb-4 flex items-center">
          <label htmlFor="year" className="mr-4 w-40 text-right">
            Year:
          </label>
          <input
            type="text"
            id="year"
            name="year"
            value={instance.year}
            onChange={handleChange}
            placeholder="Year"
            className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-4 flex items-center">
          <label htmlFor="semester" className="mr-4 w-40 text-right">
            Semester:
          </label>
          <input
            type="text"
            id="semester"
            name="semester"
            value={instance.semester}
            onChange={handleChange}
            placeholder="Semester"
            className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-4 flex items-center">
          <label htmlFor="courseId" className="mr-4 w-40 text-right">
            Course ID:
          </label>
          <input
            id="courseId"
            name="courseId"
            value={instance.courseId}
            onChange={handleChange}
            placeholder="Course ID"
            className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        {error && (
          <p className="text-center error-text font-bold text-xl mt-2 mb-2 px-2 ms-[5rem]">
            {error}
          </p>
        )}
        <div className="flex justify-end">
          <button
            type="button"
            className="bg-blue-600 text-white py-2 px-4 rounded-lg mr-2 hover:bg-[#5050c7] focus:outline-none"
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-[#6e9d27] focus:outline-none"
            disabled={loading}
          >
            Add Course Instance
          </button>
        </div>
      </form>
      {loading && (
        <div className="loading-overlay flex items-center justify-center">
          <div className="loading-spinner"></div>
          <span className="ml-4">Submitting...</span>
        </div>
      )}
    </div>
  );
};

export default CreateInstanceComponent;
