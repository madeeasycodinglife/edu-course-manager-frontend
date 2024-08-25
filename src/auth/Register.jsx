import { useState, useContext } from "react";
import loginImage from "../../src/assets/login.jpeg";
import { FaUserCircle } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import userService from "../apis/UserService";
import { ClipLoader } from "react-spinners"; // Importing a loading spinner

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // State for handling loading indicator
  const { register, setUser, setUserProfile } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true); // Start loading

    try {
      const response = await register({
        email,
        password,
        fullName,
        phone: phoneNumber,
      });

      setUser(response.data);

      const userResponse = await userService.getUserDetailsByEmailId(
        email,
        response.data.accessToken
      );

      const localUserProfile = {
        id: userResponse.data.id,
        fullName: userResponse.data.fullName,
        email: userResponse.data.email,
        password: userResponse.data.password,
        roles: userResponse.data.roles,
      };
      setUserProfile(localUserProfile);

      setLoading(false); // Stop loading

      navigate("/"); // Redirect to the homepage
    } catch (error) {
      setLoading(false); // Stop loading
      if (error.response) {
        const status = error.response.status;

        if (status === 400) {
          setError("Bad request. Please check your inputs.");
        } else if (status === 401) {
          setError("Unauthorized. Please check your credentials.");
        } else if (status === 403) {
          setError("Forbidden. Access denied.");
        } else if (status === 404) {
          setError("Resource not found.");
        } else if (status === 405) {
          setError("Method not allowed. Please try again later.");
        } else if (status === 409) {
          setError("Conflict. User already exists.");
        } else if (status === 500) {
          setError("Internal server error. Please try again later.");
        } else {
          setError("An error occurred. Please try again later.");
        }
      } else if (error.request) {
        setError("No response received. Please try again later.");
      } else {
        setError("An error occurred. Please try again later.");
      }
    }
  };

  return (
    <div className="max-w-screen mx-auto bg-[#4c70dd] min-h-screen">
      <div className="text-center text-3xl sm:text-4xl sm:pt-5">
        <h1 className="font-bold text-gradient-exam lg:text-6xl text-5xl md:pt-4">
          Course Manager
        </h1>
      </div>
      <div className="sm:max-w-[31.25rem] mx-auto sm:mt-3 max-w-96 bg-white shadow-lg rounded-lg overflow-hidden mt-5  sm:mt-5 h-[40.5rem] md:max-w-screen-md sm:h-[39rem] md:h-[35rem]">
        <div className="grid grid-cols-1 md:h-full  md:grid-cols-2 place-items-center ">
          <div className="">
            <img
              src={loginImage}
              alt="Login"
              className="md:w-full md:h-full object-cover md:mt-5"
            />
          </div>
          <div className="pt-2 px-8">
            <h1 className="hidden md:block mb-2">
              <FaUserCircle className="text-[#2de2c1] text-6xl mx-auto" />
            </h1>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Full Name"
                className="w-full p-2 border border-gray-300 rounded"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full p-2 border border-gray-300 rounded"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="tel"
                placeholder="Phone Number"
                pattern="[0-9]{10}"
                title="Phone number should be 10 digits"
                className="w-full p-2 border border-gray-300 rounded"
                required
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                minLength="6"
                className="w-full p-2 border border-gray-300 rounded"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <input
                type="password"
                placeholder="Confirm Password"
                minLength="6"
                className="w-full p-2 border border-gray-300 rounded"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {error && (
                <p className="font-bold mt-2 text-gradient-red p-2">{error}</p>
              )}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#1e3a8a] via-[#3b82f6] to-[#60a5fa] text-white p-2 rounded font-semibold text-2xl"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex justify-center items-center">
                    <ClipLoader size={24} color={"#fff"} />{" "}
                    {/* Loading spinner */}
                    <span className="ml-2">Registering...</span>
                  </div>
                ) : (
                  "Register"
                )}
              </button>
            </form>
            <div className="mt-4 text-center text-xl">
              <p className="text-gradient-shadow">
                Already have an account?{" "}
                <button
                  className="text-gradient-shadow-pink font-bold underline"
                  onClick={() => navigate("/sign-in")}
                >
                  Login
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
