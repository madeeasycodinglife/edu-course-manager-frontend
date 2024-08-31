import axios from "axios";

// The base URL for the API Gateway
const API_URL = "http://localhost:8080/api/instances";

// Function to create a new course instance
export const createInstance = async (instance, accessToken) => {
  try {
    console.log("inside instance create:", instance);
    const response = await axios.post(API_URL, instance, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (
      response.data ===
      "The Instance Service is currently unavailable. Please try again later. If you need immediate help, please contact support at support@madeeasy.com."
    ) {
      const error = new Error(
        "The Instance Service is currently unavailable !!"
      );
      error.statusCode = 503;
      throw error;
    }

    return response.data;
  } catch (error) {
    if (error.response) {
      // If the error is from the server and has a status code
      const serverError = new Error(
        error.response.data.message || "Server error"
      );
      serverError.statusCode = error.response.status;
      throw serverError;
    } else if (error.request) {
      // If the request was made but no response was received
      const requestError = new Error("No response received from the server");
      requestError.statusCode = 503;
      throw requestError;
    } else {
      // If the error was thrown during the request setup
      const generalError = new Error(error.message);
      generalError.statusCode = error.statusCode || 500;
      throw generalError;
    }
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
export const getInstancesByYearAndSemester = async (year, semester) => {
  try {
    const response = await axios.get(`${API_URL}/${year}/${semester}`);
    return response.data;
  } catch (error) {
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
