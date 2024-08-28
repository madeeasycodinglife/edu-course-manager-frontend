import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import courseService from "../apis/CourseService";
import { FaSearch, FaSearchPlus, FaTimes, FaTrash } from "react-icons/fa"; // Import icons from react-icons

const ListCourseComponent = () => {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const isAdmin = user?.roles?.includes("ADMIN"); // Check if user has 'ADMIN' role

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await courseService.getAllCourses();
        console.log("Course response: ", response);
        setCourses(response); // Make sure to access the data properly
      } catch (error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          if (error.response.status === 503) {
            setError(
              "Service is currently unavailable. Please try again later."
            );
          } else if (error.response.status === 404) {
            setError(
              "Sorry, we couldn't find the course you were looking for. Please contact support for assistance."
            );
          } else {
            setError(
              "An error occurred while fetching courses. Please try again."
            );
          }
        } else if (error.request) {
          // The request was made but no response was received
          setError(
            "No response from the server. Please check your network connection."
          );
        } else {
          // Something happened in setting up the request that triggered an Error
          setError("An unexpected error occurred. Please try again.");
        }
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, [user.accessToken]);

  // Set grid columns based on user role
  const gridColumns = isAdmin ? "grid-cols-3" : "grid-cols-2";
  const headers = [
    "Course Title",
    "Course Code",
    ...(isAdmin ? ["Action"] : []),
  ];
  console.log("isAdmin :", isAdmin);
  return (
    <>
      <div className="header bg-gray-200 text-gray-800 text-xl text-center font-bold p-2">
        List of Courses
      </div>
      <div className={`grid ${gridColumns} gap-0 p-4`}>
        {headers.map((header, index) => (
          <div
            key={index}
            className="border border-gray-300 p-2 text-center bg-gray-200 text-gray-800 font-bold"
          >
            {header}
          </div>
        ))}
        {error ? (
          <div className="col-span-4 text-center error-text font-bold text-2xl mt-10">
            {error}
          </div>
        ) : courses.length > 0 ? (
          courses.map((course, rowIndex) => (
            <React.Fragment key={course.id}>
              <div className="border border-gray-300 p-2 flex items-center justify-center">
                {course.title}
              </div>
              <div className="border border-gray-300 p-2 flex items-center justify-center">
                {course.courseCode}
              </div>

              <div className="border border-gray-300 p-2 flex items-center justify-center gap-10">
                <span className="bg-black text-white p-1 mt-1 rounded-none  cursor-pointer">
                  <FaSearch className="text-lg" />
                </span>
                <span className=" text-black rounded-none  cursor-pointer">
                  <FaTrash className="text-xl" />
                </span>
              </div>
            </React.Fragment>
          ))
        ) : (
          <div className="col-span-4 border border-gray-300 p-2 text-center text-gradient-red font-bold text-2xl mt-10">
            No Courses Available !!
          </div>
        )}
      </div>
    </>
  );
};

export default ListCourseComponent;
