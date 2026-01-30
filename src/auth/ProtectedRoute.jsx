import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
  const userId = localStorage.getItem("userId");
  const userRole = localStorage.getItem("role");

  // Not logged in
  if (!userId || !userRole) {
    return <Navigate to="/login" replace />;
  }

  // Role mismatch
  if (role && role !== userRole) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;