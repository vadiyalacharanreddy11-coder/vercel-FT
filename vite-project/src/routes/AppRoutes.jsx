import { Navigate, Route, Routes } from "react-router-dom";
import UserRegister from "../pages/UserRegister.jsx";
import UserLogin from "../pages/UserLogin.jsx";
import FoodPartnerRegister from "../pages/FoodPartnerRegister.jsx";
import FoodPartnerLogin from "../pages/FoodPartnerLogin.jsx";
import HomePage from "../pages/generals/HomePage.jsx";
import CreateFoodpage from "../pages/generals/CreateFoodPage.jsx";
import Profile from "../pages/generals/Profile.jsx";
import SearchPage from "../pages/SearchPage.jsx";
import UserProfilePage from "../pages/UserProfilePage.jsx";
import FoodPartnerDashboard from "../pages/FoodPartnerDashboard.jsx";
import ProtectedRoute from "../components/ProtectedRoute.jsx";
import SavedReelsPage from "../pages/SavedReelsPage.jsx";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/saved" element={<SavedReelsPage />} />
      <Route path="/user/register" element={<UserRegister />} />
      <Route path="/user/login" element={<UserLogin />} />
      <Route path="/foodpartner/register" element={<FoodPartnerRegister />} />
      <Route path="/foodpartner/login" element={<FoodPartnerLogin />} />
      <Route path="/search" element={<ProtectedRoute allowedRoles={["user"]}><SearchPage /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute allowedRoles={["user"]}><UserProfilePage /></ProtectedRoute>} />
      <Route path="/foodpartner/dashboard" element={<ProtectedRoute allowedRoles={["foodpartner"]}><FoodPartnerDashboard /></ProtectedRoute>} />
      <Route path="/createFood" element={<ProtectedRoute allowedRoles={["foodpartner"]}><CreateFoodpage /></ProtectedRoute>} />
      <Route path="/store/:id" element={<Profile />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;