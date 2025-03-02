import { Navigate, useLocation } from "react-router-dom";


export const ProtectedRoute = ({ children }) => {

    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    const location = useLocation();
  
    if (!token) {
      return <Navigate to="/" replace state={{ from: location }} />;
    }
  
    if (user?.role === "admin") {
      return location.pathname.startsWith("/admin") ? (children) : (<Navigate to="/admin" replace />);
    }  
    else if (user?.role === "user") {
      return location.pathname.startsWith("/user") ? (children) : (<Navigate to="/user" replace />);
    }
    else if (user?.role === "recruiter") {
      return location.pathname.startsWith("/recruiter") ? (children) : (<Navigate to="/recruiter" replace />);
    }
    
  };


  export const PublicRoute = ({ children }) => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    const location = useLocation();
  
    return token ? (
      <Navigate
        to={user?.role==="admin" ? "/admin" : user?.role==="user" ? "/user" : "/recruiter"}
        replace
        state={{ from: location }}
      />
    ) : (
      children
    );
  };