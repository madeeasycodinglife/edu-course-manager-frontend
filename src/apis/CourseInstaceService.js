// CourseInstanceService.js

import axios from "axios";

// The base URL for the API Gateway
const API_URL = "http://localhost:8080/api/instances";

// Function to create a new course instance
export const createInstance = async (instance, accessToken) => {
  try {
    const response = await axios.post(API_URL, instance, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating course instance:", error);
    throw error;
  }
};
export const getAllInstances = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error getting course instances:", error);
    throw error;
  }
};
// Function to get instances by year and semester
export const getInstancesByYearAndSemester = async (
  year,
  semester,
  accessToken
) => {
  try {
    const response = await axios.get(`${API_URL}/${year}/${semester}`);
    return response.data;
  } catch (error) {
    console.error(
      `Error fetching instances for year ${year} and semester ${semester}:`,
      error
    );
    throw error;
  }
};

// Function to get a specific instance by year, semester, and course ID
export const getInstanceByYearSemesterAndCourseId = async (
  year,
  semester,
  courseId,
  accessToken
) => {
  try {
    const response = await axios.get(
      `${API_URL}/${year}/${semester}/${courseId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      `Error fetching instance for course ID ${courseId} in year ${year}, semester ${semester}:`,
      error
    );
    throw error;
  }
};

// Function to delete an instance by year, semester, and course ID
export const deleteInstanceByYearAndSemesterAndCourseId = async (
  year,
  semester,
  courseId,
  accessToken
) => {
  try {
    const response = await axios.delete(
      `${API_URL}/${year}/${semester}/${courseId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data; // response will be empty in case of 204 No Content
  } catch (error) {
    console.error(
      `Error deleting instance for course ID ${courseId} in year ${year}, semester ${semester}:`,
      error
    );
    throw error;
  }
};

const courseInstanceService = {
  createInstance,
  getAllInstances,
  getInstancesByYearAndSemester,
  getInstanceByYearSemesterAndCourseId,
  deleteInstanceByYearAndSemesterAndCourseId,
};
export default courseInstanceService;
