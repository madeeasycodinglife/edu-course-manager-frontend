import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import courseService from "../apis/CourseService";

const DashboardComponent = () => {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState(null);
  const { user, userProfile } = useContext(AuthContext);
  const navigate = useNavigate();
  const isAdmin = userProfile?.roles?.includes("ADMIN"); // Check if user has 'ADMIN' role

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await courseService.getAllCourses(user.accessToken);
        console.log("Course response: ", response);

        // Validate response to ensure it's an array
        if (Array.isArray(response)) {
          setCourses(response);
        } else {
          console.warn("Unexpected data format:", response);
          setCourses([]);
          setError("Unexpected data format received from the server.");
        }
      } catch (error) {
        handleError(error);
        setCourses([]); // Ensure courses is always an array
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
          "Sorry, we couldn't find the courses you were looking for. Please contact support for assistance."
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

  const headers = ["Course Title", "Course Code"];

  console.log("isAdmin:", isAdmin);

  return (
    <>
      <div className="header bg-gray-200 text-gray-800 text-xl text-center font-bold p-2">
        Dashboard
      </div>
      <div className="grid grid-cols-2 gap-0 p-4">
        {headers.map((header, index) => (
          <div
            key={index}
            className="border border-gray-300 p-2 text-center bg-gray-200 text-gray-800 font-bold"
          >
            {header}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-0 p-4 max-h-[400px] overflow-y-auto">
        {error ? (
          <div className="col-span-2 text-center text-red-500 font-bold text-2xl mt-10">
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
            </React.Fragment>
          ))
        ) : (
          <div className="col-span-2 border border-gray-300 p-2 text-center text-red-500 font-bold text-2xl mt-10">
            {isAdmin
              ? "No courses available. Please create courses."
              : "No courses available. Please ask an admin to create courses, or create an admin using the REST API to create courses, then log in again."}
          </div>
        )}
      </div>
    </>
  );
};

export default DashboardComponent;
