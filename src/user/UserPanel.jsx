import { useContext, useEffect, useState } from "react";
import Sidebar from "../components/Sidebar"; // Adjust path as needed
import DashboardComponent from "../common/DashboardComponent";
import EditProfileComponent from "../common/EditProfileComponent";
import ChangePasswordComponent from "../common/ChangePasswordComponent";
import LogoutPage from "../auth/LogoutPage";
import ListCourseComponent from "../common/ListCourseComponent";
import ListCourseInstanceComponent from "../common/ListCourseInstanceComponent";
import EnrollmentComponent from "../common/EnrollmentComponent";
import { AuthContext } from "../context/AuthContext";
import userService from "../apis/UserService";

const UserPanel = () => {
  const [selectedComponent, setSelectedComponent] = useState("dashboard");
  const { user, userProfile, setUserProfile } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);
  const [foundUser, setFoundUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const validateUserToken = async () => {
      if (user && user.accessToken) {
        try {
          const response = await userService.getUserDetailsByEmailId(
            userProfile.email,
            user.accessToken
          );
          if (response.status === 200) {
            setFoundUser(response.data);
          } else {
            setFoundUser(null);
          }
        } catch (error) {
          console.error("Error:", error);
          setFoundUser(null);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };
    validateUserToken();
  }, [user, userProfile]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const renderSelectedComponent = () => {
    switch (selectedComponent) {
      case "dashboard":
        return <DashboardComponent />;
      case "listCourses":
        return <ListCourseComponent />;
      case "listInstances":
        return <ListCourseInstanceComponent />;
      case "enrollment":
        return <EnrollmentComponent />;
      case "editProfile":
        return <EditProfileComponent />;
      case "changePassword":
        return <ChangePasswordComponent />;
      case "logOut":
        return <LogoutPage />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-full min-h-screen font-serif font-bold mx-auto bg-gradient-to-r from-blue-600 to-blue-400 text-white">
      <header className="text-3xl bg-gradient-to-r from-blue-600 to-blue-400 text-white pt-2">
        <div className="flex justify-between p-3">
          <h1 className="md:text-2xl text-xl">Course Manager</h1>
          <ul className="hidden md:flex gap-x-7 md:text-2xl">
            <li className="hover:cursor-pointer">Home</li>
            <li className="hover:cursor-pointer">About</li>
            <li className="hover:cursor-pointer">Services</li>
            <li className="hover:cursor-pointer">Contact</li>
          </ul>
          <button
            className="md:hidden text-3xl focus:outline-none"
            onClick={toggleSidebar} // This function should toggle the visibility of the mobile menu
          >
            ☰
          </button>
        </div>
        {isSidebarOpen && (
          <ul className="md:hidden flex flex-col items-center gap-y-2 p-3 absolute left-0 right-0 bg-blue-500 text-white text-2xl">
            <li onClick={toggleSidebar} className="hover:cursor-pointer">
              Home
            </li>
            <li onClick={toggleSidebar} className="hover:cursor-pointer">
              About
            </li>
            <li onClick={toggleSidebar} className="hover:cursor-pointer">
              Services
            </li>
            <li onClick={toggleSidebar} className="hover:cursor-pointer">
              Contact
            </li>
          </ul>
        )}
      </header>
      <section id="profile" className="min-h-[10.125rem]p-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex flex-col md:flex-row items-center gap-8 md:ml-32">
            <div className="text-2xl font-serif font-semibold mt-8 text-center md:text-left md:ml-[-5rem] ">
              <div className="flex flex-col md:flex-row items-center gap-5">
                <p>{foundUser?.fullName || "No user found"}</p>
              </div>
              <div className="flex flex-col md:flex-row items-center gap-5">
                <p>+91 {foundUser?.phone || "N/A"}</p>
              </div>
              <div className="flex flex-col md:flex-row items-center gap-5">
                <p>{foundUser?.email || "N/A"}</p>
              </div>
            </div>
          </div>
          {!isSidebarOpen && (
            <div className="text-xl bg-gradient-to-r from-purple-600 to-purple-400 text-white p-4 rounded-lg animate-pulse mt-4 md:mt-0">
              <p className="text-center">
                Welcome! We're excited to have you here.
              </p>
            </div>
          )}

          {isSidebarOpen && (
            <div className="text-xl bg-gradient-to-r from-purple-600 to-purple-400 text-white p-4 rounded-lg animate-pulse mt-11 md:mt-0">
              <p className="text-center">
                Welcome! We're excited to have you here.
              </p>
            </div>
          )}
        </div>
      </section>

      <main className="max-w-screen-xl mx-auto mt-10 min-h-[30.625rem] flex shadow-lg lg:ml-0">
        <button
          className="text-xl ms-3 mt-[-33rem] md:hidden"
          onClick={toggleSidebar}
        >
          ☰
        </button>
        <Sidebar
          isOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          setSelectedComponent={setSelectedComponent}
        />
        <div className="flex-1 min-h-96 col-span-3 lg:ml-48 overflow-y-auto">
          <div className="p-4 max-h-[calc(100vh-200px)] overflow-y-auto">
            {renderSelectedComponent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserPanel;
