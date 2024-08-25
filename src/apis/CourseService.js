import axios from "axios";

const API_URL = "http://localhost:8080/api/courses";

// Function to create a new course
export const createCourse = async (course, accessToken) => {
  try {
    const response = await axios.post(API_URL, course, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating course:", error);
    throw error;
  }
};

// Function to get all courses
export const getAllCourses = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching courses:", error);
    throw error;
  }
};

// Function to get a course by ID
export const getCourseById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching course with ID ${id}:`, error);
    throw error;
  }
};

// Function to get a course by course code
export const getCourseByCourseCode = async (courseCode, accessToken) => {
  try {
    const response = await axios.get(`${API_URL}/code/${courseCode}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      `Error fetching course with course code ${courseCode}:`,
      error
    );
    throw error;
  }
};

// Function to delete a course by ID
export const deleteCourseById = async (id, accessToken) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data; // response will be empty in case of 204 No Content
  } catch (error) {
    console.error(`Error deleting course with ID ${id}:`, error);
    throw error;
  }
};

const courseService = {
  createCourse,
  getAllCourses,
  getCourseById,
  getCourseByCourseCode,
  deleteCourseById,
};

export default courseService;
