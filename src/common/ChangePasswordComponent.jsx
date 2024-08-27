import React, { useContext, useState } from "react";
import userService from "../apis/UserService";
import { AuthContext } from "../context/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ChangePasswordComponent = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user, setUser, userProfile, setUserProfile } =
    useContext(AuthContext);

  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleConfirmNewPasswordChange = (e) => {
    setConfirmNewPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!newPassword || !confirmNewPassword) {
      setError("Both fields are required.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError("Passwords do not match. Please try again.");
      return;
    }

    try {
      setIsLoading(true); // Start loading
      const updatedPassword = {
        password: confirmNewPassword,
      };
      const userResponse = await userService.partiallyUpdateUser(
        userProfile.email,
        updatedPassword,
        user.accessToken
      );
      console.log("userResponse after password update: ", userResponse);
      if (userResponse.status === 200) {
        const localUserProfile = {
          id: userResponse.data.id,
          fullName: userResponse.data.fullName,
          email: userResponse.data.email,
          password: userResponse.data.password,
          roles: userResponse.data.roles,
        };
        const localUser = {
          accessToken: userResponse.data.accessToken,
          refreshToken: userResponse.data.refreshToken,
        };
        setUserProfile(localUserProfile);
        setUser(localUser);

        toast.success("Password changed successfully!");
      }

      // Reset form fields
      setNewPassword("");
      setConfirmNewPassword("");
      setError("");
    } catch (error) {
      console.error("Error updating user profile:", error);
      const errorMessage = error.response.data.message;
      toast.error(errorMessage);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <div className="p-4">
      <ToastContainer />
      <h2 className="header bg-gray-200 text-gray-800 text-xl text-center font-bold p-2">
        Change Password
      </h2>
      <form
        onSubmit={handleSubmit}
        className="mt-12 max-w-lg mx-auto grid grid-cols-2 gap-4"
      >
        {error && (
          <div className="col-span-2 mb-4 text-red-500 text-sm font-bold">
            {error}
          </div>
        )}
        <div className="flex flex-col mt-2">
          <label htmlFor="newPassword" className="text-right">
            New Password :
          </label>
          <label htmlFor="confirmNewPassword" className="text-right mt-9">
            Confirm New Password :
          </label>
        </div>
        <div className="flex flex-col">
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={handleNewPasswordChange}
            placeholder="New Password"
            className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 mb-4"
            required
          />
          <input
            type="password"
            id="confirmNewPassword"
            value={confirmNewPassword}
            onChange={handleConfirmNewPasswordChange}
            placeholder="Confirm New Password"
            className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="col-span-2 flex justify-end">
          <button
            type="button"
            className="bg-blue-600 text-white py-2 px-4 rounded-lg mr-2 hover:bg-[#5050c7] focus:outline-none"
            onClick={() => {
              setNewPassword("");
              setConfirmNewPassword("");
              setError("");
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-[#6e9d27] focus:outline-none"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="loader mr-2 border-t-4 border-white border-solid rounded-full w-5 h-5 animate-spin"></div>
                <span>Changing...</span>
              </div>
            ) : (
              "Change Password"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePasswordComponent;
