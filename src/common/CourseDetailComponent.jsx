import React from "react";

const CourseDetailComponent = ({ course, onClose }) => {
  return (
    <div className="course-detail  bg-gradient-to-r from-blue-600 to-blue-400 text-white p-4 border border-gray-300 shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Course Details</h2>
      <p>
        <strong>Title:</strong> {course.title}
      </p>
      <p>
        <strong>Course Code:</strong> {course.courseCode}
      </p>
      <p>
        <strong>Description:</strong> {course.description}
      </p>
      {/* Add more details as needed */}
      <button
        onClick={onClose}
        className="mt-4 bg-blue-500 text-white p-2 rounded"
      >
        Close
      </button>
    </div>
  );
};

export default CourseDetailComponent;
