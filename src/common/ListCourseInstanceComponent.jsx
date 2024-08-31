import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import instanceService from "../apis/CourseInstaceService";
import courseService from "../apis/CourseService";
import { FaSearch, FaTrash } from "react-icons/fa";
import { TailSpin } from "react-loader-spinner"; // Import a spinner component or use any other spinner

import { ToastContainer, toast } from "react-toastify"; // Import toast and ToastContainer
import "react-toastify/dist/ReactToastify.css"; // Import the default styles for react-toastify
import CourseAndInstanceDetailComponent from "./CourseAndInstanceDetailComponent";

const ListCourseInstanceComponent = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCoursesInstances, setFilteredCoursesInstances] = useState([]);
  const [year, setYear] = useState("");
  const [semester, setSemester] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // State for loading
  const [validationError, setValidationError] = useState(""); // State for validation errors
  const { user, userProfile } = useContext(AuthContext);
  const isAdmin = userProfile?.roles?.includes("ADMIN");
  const [searchPerformed, setSearchPerformed] = useState(false); // State to track if search has been performed

  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await instanceService.getAllInstances();
        console.log("Course instance response:", response);
        if (Array.isArray(response)) {
          setFilteredCoursesInstances(response);
          const uniqueCourseIds = [
            ...new Set(response.map((instance) => instance.courseId)),
          ];

          const coursePromises = uniqueCourseIds.map((courseId) =>
            courseService.getCourseById(courseId)
          );
          const courseResponses = await Promise.all(coursePromises);
          const coursesMap = uniqueCourseIds.reduce((acc, courseId, index) => {
            acc[courseId] = courseResponses[index];
            return acc;
          }, {});

          const enrichedCourses = response.map((instance) => ({
            ...instance,
            ...coursesMap[instance.courseId],
          }));

          setCourses(enrichedCourses);
        } else {
          console.warn("Unexpected data format:", response);
          setFilteredCoursesInstances([]);
          setError(response);
        }
      } catch (error) {
        console.error("Error fetching course instances:", error);
        handleError(error);
        setFilteredCoursesInstances([]);
      }
    };

    fetchCourses();
  }, [user.accessToken]);

  const handleError = (error) => {
    if (error.response) {
      if (error.response.status === 503) {
        setError("Service is currently unavailable. Please try again later.");
      } else if (error.response.status === 404) {
        setError("Course instances not found. Please contact support.");
      } else {
        setError("An error occurred. Please try again.");
      }
    } else if (error.request) {
      setError("No response from the server. Check your network connection.");
    } else {
      setError("An unexpected error occurred.");
    }
  };

  const handleSearch = async () => {
    if (!year || !semester) {
      setValidationError("Please enter all required fields.");
      return;
    }
    setError("");
    setValidationError(""); // Clear previous validation errors
    setLoading(true); // Start loading
    setSearchPerformed(true); // Mark search as performed

    try {
      // Fetch instances by year and semester
      const instanceResponse =
        await instanceService.getInstancesByYearAndSemester(
          year,
          semester,
          user.accessToken
        );
      console.log("Instance response:", instanceResponse);

      if (!Array.isArray(instanceResponse)) {
        console.warn("Unexpected data format:", instanceResponse);
        setFilteredCoursesInstances([]);
        setCourses([]);
        setError(instanceResponse);
        return;
      }

      // Extract unique course IDs
      const uniqueCourseIds = [
        ...new Set(instanceResponse.map((instance) => instance.courseId)),
      ];

      // Fetch course details for each unique course ID
      const coursePromises = uniqueCourseIds.map((courseId) =>
        courseService.getCourseById(courseId)
      );
      const courseResponses = await Promise.all(coursePromises);

      // Create a mapping of courseId to course details
      const coursesMap = uniqueCourseIds.reduce((acc, courseId, index) => {
        acc[courseId] = courseResponses[index];
        return acc;
      }, {});

      // Enrich instance data with course details
      const enrichedInstances = instanceResponse.map((instance) => ({
        ...instance,
        courseCode: coursesMap[instance.courseId]?.courseCode || "N/A",
        courseTitle: coursesMap[instance.courseId]?.title || "Unknown Title",
      }));
      console.log("enrichedInstaces :", enrichedInstances);
      // Set state
      setFilteredCoursesInstances(enrichedInstances);
      setCourses(enrichedInstances);
    } catch (error) {
      console.log("erorr:", error);
      handleError(error);
      setFilteredCoursesInstances([]);
      setCourses([]);
    } finally {
      setLoading(false); // End loading
    }
  };

  const handleDeleteClick = async (courseId) => {
    try {
      if (user && user.accessToken) {
        setLoading(true); // Set loading to true
        console.log("courseId:", courseId);
        await courseService.deleteCourseById(courseId, user.accessToken);
        setFilteredCoursesInstances([]);
        toast.success("Course successfully deleted!"); // Show success notification
      }
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false); // Set loading to false
    }
  };
  const handleSearchClick = (courses) => {
    console.log("courses :", courses);
    setCourses(courses);
    setShowDetail(true);
  };
  const headers = ["Course Title", "Year-Semester", "Course Code", "Action"];

  if (showDetail) {
    return (
      <CourseAndInstanceDetailComponent
        course={courses}
        onClose={() => setShowDetail(false)}
      />
    );
  }
  return (
    <>
      <div className="header bg-gray-200 text-gray-800 text-xl text-center font-bold p-2">
        List of Courses
      </div>
      <div className="flex flex-col items-center p-4">
        <div className="flex">
          <input
            type="text"
            placeholder="Enter Year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="border bg-blue-500 text-white border-gray-300 p-2 mr-4"
          />
          <select
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            className="border bg-blue-500 text-white border-gray-300 p-2 mr-4"
          >
            <option value="" disabled>
              Select Semester
            </option>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((sem) => (
              <option key={sem} value={sem}>
                Semester {sem}
              </option>
            ))}
          </select>
          <button
            onClick={handleSearch}
            className="bg-blue-500 text-white p-2 rounded flex items-center"
          >
            <FaSearch className="mr-2" />
            Search
          </button>
        </div>
        {validationError && (
          <div className="text-red-500 font-bold text-2xl mt-8">
            {validationError}
          </div>
        )}
        {!searchPerformed && (
          <div className="text-center text-2xl mt-24 text-gray-700 p-4">
            Please enter the year, select a semester, and click search to find
            the courses you're looking for.
          </div>
        )}
      </div>

      {searchPerformed && (
        <>
          {loading ? (
            <div className="flex justify-center items-center p-4">
              <TailSpin color="#000000" height={30} width={30} />
            </div>
          ) : (
            <div className="overflow-x-auto p-4">
              <div className="grid grid-cols-4 gap-0 p-4">
                {headers.map((header, index) => (
                  <div
                    key={index}
                    className="border border-gray-300 p-2 text-center bg-gray-200 text-gray-800 font-bold"
                  >
                    {header}
                  </div>
                ))}
                {error ? (
                  <div className="col-span-4 text-center text-red-500 font-bold text-2xl mt-10">
                    {error}
                  </div>
                ) : filteredCoursesInstances.length > 0 ? (
                  filteredCoursesInstances.map((course) => (
                    <React.Fragment key={course.id}>
                      <div className="border border-gray-300 p-2 flex items-center justify-center">
                        {course.courseTitle}
                      </div>
                      <div className="border border-gray-300 p-2 flex items-center justify-center">
                        {course.year}-{course.semester}
                      </div>
                      <div className="border border-gray-300 p-2 flex items-center justify-center">
                        {course.courseCode}
                      </div>
                      <div className="border border-gray-300 p-2 flex items-center justify-center">
                        {isAdmin ? (
                          <div className="border border-gray-300 p-2 flex items-center justify-center gap-4">
                            <span
                              className="bg-black text-white p-1 mt-1 rounded-none cursor-pointer"
                              onClick={() => handleSearchClick(course)}
                            >
                              <FaSearch className="text-lg" />
                            </span>
                            <span
                              className="text-black rounded-none cursor-pointer"
                              onClick={() => handleDeleteClick(course.courseId)}
                            >
                              <FaTrash className="text-xl" />
                            </span>
                          </div>
                        ) : (
                          <div className="border border-gray-300 p-2 flex items-center justify-center gap-4">
                            <span
                              className="bg-black text-white p-1 mt-1 rounded-none cursor-pointer"
                              onClick={() => handleSearchClick(course)}
                            >
                              <FaSearch className="text-lg" />
                            </span>
                          </div>
                        )}
                      </div>
                    </React.Fragment>
                  ))
                ) : (
                  <div className="col-span-4 border border-gray-300 p-2 text-center text-red-500 font-bold text-2xl mt-10">
                    {isAdmin
                      ? "No courses found."
                      : "No courses found for this user."}
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {/* {loading ? (
        <div className="flex justify-center items-center p-4">
          <TailSpin color="#000000" height={30} width={30} />
        </div>
      ) : (
        <div className="overflow-x-auto p-4">
          <div className="grid grid-cols-4 gap-0 p-4">
            {headers.map((header, index) => (
              <div
                key={index}
                className="border border-gray-300 p-2 text-center bg-gray-200 text-gray-800 font-bold"
              >
                {header}
              </div>
            ))}
            {error ? (
              <div className="col-span-4 text-center text-red-500 font-bold text-2xl mt-10">
                {error}
              </div>
            ) : filteredCoursesInstances.length > 0 ? (
              filteredCoursesInstances.map((course) => (
                <React.Fragment key={course.id}>
                  <div className="border border-gray-300 p-2 flex items-center justify-center">
                    {course.courseTitle}
                  </div>
                  <div className="border border-gray-300 p-2 flex items-center justify-center">
                    {course.year}-{course.semester}
                  </div>
                  <div className="border border-gray-300 p-2 flex items-center justify-center">
                    {course.courseCode}
                  </div>
                  <div className="border border-gray-300 p-2 flex items-center justify-center">
                    {isAdmin ? (
                      <div className="border border-gray-300 p-2 flex items-center justify-center gap-4">
                        <span
                          className="bg-black text-white p-1 mt-1 rounded-none cursor-pointer"
                          onClick={() => handleSearchClick(course)}
                        >
                          <FaSearch className="text-lg" />
                        </span>
                        <span
                          className="text-black rounded-none cursor-pointer"
                          onClick={() => handleDeleteClick(course.id)}
                        >
                          <FaTrash className="text-xl" />
                        </span>
                      </div>
                    ) : (
                      <div className="border border-gray-300 p-2 flex items-center justify-center gap-4">
                        <span
                          className="bg-black text-white p-1 mt-1 rounded-none cursor-pointer"
                          onClick={() => handleSearchClick(course)}
                        >
                          <FaSearch className="text-lg" />
                        </span>
                      </div>
                    )}
                  </div>
                </React.Fragment>
              ))
            ) : (
              <div className="col-span-4 border border-gray-300 p-2 text-center text-red-500 font-bold text-2xl mt-10">
                {isAdmin
                  ? "No courses found."
                  : "No courses found for this user."}
              </div>
            )}
          </div>
        </div>
      )} */}
    </>
  );
};

export default ListCourseInstanceComponent;
