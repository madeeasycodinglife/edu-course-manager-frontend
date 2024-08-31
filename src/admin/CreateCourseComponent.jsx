import React, { useContext, useState } from "react";
import courseService from "../apis/CourseService";
import { AuthContext } from "../context/AuthContext";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CreateCourseComponent = () => {
  const [course, setCourse] = useState({
    title: "",
    courseCode: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // State for handling errors

  const { user } = useContext(AuthContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourse({ ...course, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Show loading spinner
    try {
      await courseService.createCourse(course, user.accessToken);
      // Submit form logic here
      console.log("Course submitted:", course);
      toast.success("Course created successfully!"); // Show success notification

      setCourse({
        title: "",
        courseCode: "",
        description: "",
      });
      setError(null);
    } catch (error) {
      console.error("Error creating Course:", error);
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
          setError(errorMessage ? errorMessage : "Course Code Format Invalid.");
          toast.error(errorMessage ? errorMessage : errorResponse.courseCode);
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
    setCourse({
      title: "",
      courseCode: "",
      description: "",
    });
  };

  return (
    <div className="p-4">
      <h2 className="header bg-gray-200 text-gray-800 text-xl text-center font-bold p-2">
        Create Course
      </h2>
      <ToastContainer />
      <form onSubmit={handleSubmit} className="mt-12 max-w-lg mx-auto">
        <div className="mb-4 flex items-center">
          <label htmlFor="fullName" className="mr-4 w-40 text-right">
            Title :
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={course.title}
            onChange={handleChange}
            placeholder="Title"
            className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-4 flex items-center">
          <label htmlFor="email" className="mr-4 w-40 text-right">
            Course Code :
          </label>
          <input
            type="text"
            id="courseCode"
            name="courseCode"
            value={course.courseCode}
            onChange={handleChange}
            placeholder="Course Code"
            className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-4 flex items-center">
          <label htmlFor="phoneNumber" className="mr-4 w-40 text-right">
            Description :
          </label>
          <input
            id="description"
            name="description"
            value={course.description}
            onChange={handleChange}
            placeholder="Description"
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
            Add Course
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

export default CreateCourseComponent;
