import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import courseService from "../apis/CourseService";
import { FaSearch, FaTrash } from "react-icons/fa";
import CourseDetailComponent from "./CourseDetailComponent";
import { ToastContainer, toast } from "react-toastify"; // Import toast and ToastContainer
import "react-toastify/dist/ReactToastify.css"; // Import the default styles for react-toastify

const ListCourseComponent = () => {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false); // State to manage loading

  const { user, userProfile } = useContext(AuthContext);

  useEffect(() => {
    if (userProfile) {
      const adminCheck = userProfile.roles?.includes("ADMIN");
      setIsAdmin(adminCheck);
    }
  }, [userProfile]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        if (user && user.accessToken) {
          setLoading(true); // Set loading to true
          const response = await courseService.getAllCourses(user.accessToken);
          setCourses(response);
        }
      } catch (error) {
        handleError(error);
      } finally {
        setLoading(false); // Set loading to false
      }
    };

    fetchCourses();
  }, [user.accessToken]);

  const handleError = (error) => {
    if (error.response) {
      if (error.response.status === 503) {
        setError("Service is currently unavailable. Please try again later.");
      } else if (error.response.status === 404) {
        setError(
          "Sorry, we couldn't find the courses. Please contact support."
        );
      } else {
        setError("An error occurred while fetching courses. Please try again.");
      }
    } else if (error.request) {
      setError(
        "No response from the server. Please check your network connection."
      );
    } else {
      setError("An unexpected error occurred. Please try again.");
    }
    console.error("Error fetching courses:", error);
  };

  const handleSearchClick = (course) => {
    setSelectedCourse(course);
    setShowDetail(true);
  };

  const handleDeleteClick = async (courseId) => {
    try {
      if (user && user.accessToken) {
        setLoading(true); // Set loading to true
        console.log("courseId:", courseId);
        await courseService.deleteCourseById(courseId, user.accessToken);
        setCourses(courses.filter((course) => course.id !== courseId));
        toast.success("Course successfully deleted!"); // Show success notification
      }
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false); // Set loading to false
    }
  };

  if (showDetail) {
    return (
      <CourseDetailComponent
        course={selectedCourse}
        onClose={() => setShowDetail(false)}
      />
    );
  }

  const headers = [
    "Course Title",
    "Course Code",
    ...(isAdmin ? ["Action"] : ["View"]),
  ];

  return (
    <>
      <ToastContainer /> {/* Add ToastContainer to your component */}
      <div className="header bg-gray-200 text-gray-800 text-xl text-center font-bold p-2">
        List of Courses
      </div>
      {loading && (
        <div className="loading-overlay flex items-center justify-center">
          <div className="loading-spinner"></div>
          <span className="ml-4">Loading...</span>
        </div>
      )}
      <div className={`grid ${"grid-cols-3"} gap-0 p-4`}>
        {headers.map((header, index) => (
          <div
            key={index}
            className="border border-gray-300 p-2 text-center bg-gray-200 text-gray-800 font-bold"
          >
            {header}
          </div>
        ))}
        {error ? (
          <div
            className={`col-span-${
              isAdmin ? 3 : 2
            } text-center error-text font-bold text-2xl mt-10`}
          >
            {error}
          </div>
        ) : courses.length > 0 ? (
          courses.map((course) => (
            <React.Fragment key={course.id}>
              <div className="border border-gray-300 p-2 flex items-center justify-center">
                {course.title}
              </div>
              <div className="border border-gray-300 p-2 flex items-center justify-center">
                {course.courseCode}
              </div>
              {isAdmin ? (
                <div className="border border-gray-300 p-2 flex items-center justify-center gap-10">
                  <span className="bg-black text-white p-1 mt-1 rounded-none cursor-pointer">
                    <FaSearch
                      className="text-lg"
                      onClick={() => handleSearchClick(course)}
                    />
                  </span>
                  <span
                    className="text-black rounded-none cursor-pointer"
                    onClick={() => handleDeleteClick(course.id)}
                  >
                    <FaTrash className="text-xl" />
                  </span>
                </div>
              ) : (
                <div className="border border-gray-300 p-2 flex items-center justify-center gap-10">
                  <span
                    className="bg-black text-white p-1 mt-1 rounded-none cursor-pointer"
                    onClick={() => handleSearchClick(course)}
                  >
                    <FaSearch className="text-lg" />
                  </span>
                </div>
              )}
            </React.Fragment>
          ))
        ) : (
          <div
            className={`col-span-${3} border border-gray-300 p-2 text-center text-gradient-red font-bold text-2xl mt-10`}
          >
            {isAdmin
              ? "No courses instance available. Please create course instance."
              : "No courses instance available. Please ask an admin or create an admin using the REST API to create course instance, then log in again."}
          </div>
        )}
      </div>
    </>
  );
};

export default ListCourseComponent;
