import { useState, useContext } from "react";
import loginImage from "../../src/assets/login.jpeg";
import { FaUserCircle } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import userService from "../apis/UserService";
import { ClipLoader } from "react-spinners"; // Importing a loading spinner

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null); // State for error message
  const [loading, setLoading] = useState(false); // State for handling loading indicator
  const { login, setUser, setUserProfile } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading

    try {
      const response = await login(email, password);

      // Ensure accessToken is a string
      const accessToken = response.data.accessToken;

      setUser(response.data);

      const userResponse = await userService.getUserDetailsByEmailId(
        email,
        accessToken
      );

      const roles = userResponse.data.roles;
      const localUserProfile = {
        id: userResponse.data.id,
        fullName: userResponse.data.fullName,
        email: userResponse.data.email,
        password: userResponse.data.password,
        roles: userResponse.data.roles,
      };
      setUserProfile(localUserProfile);

      setLoading(false); // Stop loading

      // Check the roles and navigate accordingly
      if (roles.includes("ADMIN")) {
        navigate("/admin");
      } else if (roles.includes("USER")) {
        navigate("/user");
      } else {
        setError("Unknown role, cannot navigate");
      }
    } catch (error) {
      setLoading(false); // Stop loading
      if (error.response) {
        // The request was made and the server responded with a status code
        const status = error.response.status;

        if (status === 401 || status === 403) {
          setError("Invalid email or password.");
        } else if (status === 404) {
          setError("User not found");
        } else if (status === 405) {
          setError("Method not allowed. Please try again later.");
        } else if (status === 503) {
          setError("Service unavailable. Please try again later.");
        } else {
          setError("An error occurred. Please try again later.");
        }
      } else if (error.request) {
        // The request was made but no response was received
        setError("No response received. Please try again later.");
      } else {
        // Other errors
        setError("An error occurred. Please try again later.");
      }
    }
  };

  const handleSignUp = () => {
    navigate("/register");
  };

  return (
    <div className="max-w-screen mx-auto bg-[#4c70dd] min-h-screen">
      <div className="text-center sm:text-4xl sm:pt-12">
        <h1 className="font-bold text-gradient-exam lg:text-6xl text-5xl pt-6 sm:pt-20 md:pt-10 sm:pt-9">
          Course Manager
        </h1>
      </div>
      <div className="sm:max-w-[31.25rem] mx-auto sm:mt-10 sm:h-[30rem] max-w-96 bg-white shadow-lg rounded-lg overflow-hidden mt-12 h-[30.75rem] md:max-w-screen-md">
        <div className="grid grid-cols-1 md:h-full md:grid-cols-2 place-items-center">
          <div>
            <img
              src={loginImage}
              alt="Login"
              className="md:w-full md:h-full object-cover md:mt-5"
            />
          </div>
          <div className="pt-2 px-8">
            <h1 className="hidden md:block mb-2">
              <FaUserCircle
                className="icon-gradient text-6xl mx-auto"
                color="blue"
              />
            </h1>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Email"
                className="w-full p-2 border border-gray-300 rounded"
              />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Password"
                className="w-full p-2 border border-gray-300 rounded"
              />
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#1e3a8a] via-[#3b82f6] to-[#60a5fa] text-white p-2 rounded font-semibold text-2xl"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex justify-center items-center">
                    <ClipLoader size={24} color={"#fff"} />{" "}
                    {/* Loading spinner */}
                    <span className="ml-2">Logging in...</span>
                  </div>
                ) : (
                  "Login"
                )}
              </button>
            </form>
            {error && (
              <div className="mt-4 text-red-600 text-center">
                <p>{error}</p>
              </div>
            )}
            <div className="mt-4 text-center text-xl">
              <p className="text-gradient-shadow">
                Don't have an account?{" "}
                <button
                  className="text-gradient font-bold underline"
                  onClick={handleSignUp}
                >
                  Sign Up
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
