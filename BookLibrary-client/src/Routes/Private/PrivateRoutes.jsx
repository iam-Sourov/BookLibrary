import { Navigate, useLocation } from "react-router";
import { useContext } from "react";


import { Spinner } from "@/components/ui/spinner";
import { AuthContext } from "../../contexts/AuthContext";
import useRole from "../../hooks/useRole";

const PrivateRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useContext(AuthContext);
  const [role, isRoleLoading] = useRole();
  const location = useLocation();

  if (loading || (user && isRoleLoading)) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
      </div>  
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;