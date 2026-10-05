import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { session } = useAuth();
  const location = useLocation();

  if (session.loading) {
    return <div className="page-shell"><div className="form-card"><h1>Loading...</h1></div></div>;
  }

  if (!session.role || session.role === "unauthenticated") {
    const redirect = location.pathname.startsWith("/foodpartner") || location.pathname === "/createFood"
      ? "/foodpartner/login"
      : "/user/login";

    return <Navigate to={redirect} replace state={{ from: location }} />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(session.role)) {
    const fallback = session.role === "foodpartner" ? "/foodpartner/dashboard" : "/";
    return <Navigate to={fallback} replace />;
  }

  return children;
};

export default ProtectedRoute;
