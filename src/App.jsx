import React from "react";
import Register from "./auth/Register";
import Login from "./auth/Login";
import LogoutPage from "./auth/LogoutPage";
import PrivateRoute from "./routes/PrivateRoute";
import { Navigate, Route, Routes } from "react-router-dom";
import AdminPanel from "./admin/AdminPanel";
import UserPanel from "./user/UserPanel";
const App = () => {
  return (
    <div>
      <div className="">
        <Routes>
          <Route path="/sign-in" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<PrivateRoute />}>
            <Route path="/" element={<Navigate to="/user" />} />
            <Route path="/user/*" element={<UserPanel />} />
            <Route path="/admin/*" element={<AdminPanel />} />
            <Route path="/log-out" element={<LogoutPage />} />
          </Route>
        </Routes>
      </div>
    </div>
  );
};

export default App;
