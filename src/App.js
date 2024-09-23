import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import RegisterPage from "./pages/Register/Register";
import Loginpage from "./pages/Login/Login";
import ProjectList from "./pages/UserProjects/UserProjects";
import CreateProject from "./pages/CreateProject/Createproject";
import ProjectDashBoard from "./pages/ProjectDashBoard/ProjectDashBoard";
import UnannotedImages from "./pages/UnannotedImages/UnannotedImages";
import AnnotatedImages from "./pages/AnnotedImages/AnnotedImages";
import LabelCategory from "./pages/LabelCategory/LabelCategory";
import ForgotPasswordPage from "./pages/forgetPassword/forgetPassword";
import PasswordResetPage from "./pages/PasswordResetPage/PasswordResetPage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<Loginpage />} />
        <Route path="/projectList" element={<ProjectList />} />
        <Route path="/CreateProject" element={<CreateProject />} />
        <Route
          path="/ProjectDashBoard/:projectId"
          element={<ProjectDashBoard />}
        />
        <Route
          path="/UnannotedImages/:projectId"
          element={<UnannotedImages />}
        />
        <Route path="/annotedImages/:projectId" element={<AnnotatedImages />} />
        <Route
          path="/labelCategory/:catId/:category/:projectId"
          element={<LabelCategory />}
        />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route
          path="/reset-password/:uidb64/:token"
          element={<PasswordResetPage />}
        />
      </Routes>
    </Router>
  );
};

export default App;
