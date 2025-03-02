import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import eyeSlash from "../../public/assets/eye-slash.svg";
import eye from "../../public/assets/eye.svg";
import axios from "axios";
import toast from "react-hot-toast";
import Loader from "../component/Loader";
import { auth, provider } from "../../firebase";
import { signInWithPopup } from "firebase/auth";
import { axiosInstance, endPoints } from "../api/axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [loader, setLoader] = useState(false);
  const [googleLoader, setGoogleLoader] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    const newErrors = { email: "", password: "" };

    if (!email) {
      newErrors.email = "Email is required.";
    }
    if (!password) {
      newErrors.password = "Password is required.";
    }

    setErrors(newErrors);

    if (!newErrors.email && !newErrors.password) {
      try {
        setLoader(true);
        const { data } = await axiosInstance.post(
          endPoints.auth.login,
          { email, password },
          { withCredentials: true }
        );
        toast.success(data.message);
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        const { role } = data.user;
        setLoader(false);
        if (role === "admin") {
          navigate("/admin");
        } else if (role === "user") {
          navigate("/user");
        } else if (role === "recruiter") {
          navigate("/recruiter");
        }
      } catch (error) {
        setLoader(false);
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Something went wrong. Please try again.";
        toast.error(errorMessage);
      }
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setGoogleLoader(true);
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log(user);

      const { data } = await axiosInstance.post(
        endPoints.auth.loginWithGoogle,
        { email: user.email, users: user },
        { withCredentials: true }
      );
      toast.success(data.message);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      const { role } = data.user;
      if (role === "admin") {
        navigate("/admin");
      } else if (role === "user") {
        navigate("/user");
      } else if (role === "recruiter") {
        navigate("/recruiter");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong. Please try again.";
      toast.error(errorMessage);
    } finally {
      setGoogleLoader(false);
    }
  };

  return (
    <form className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-gray-500 mb-1">
          Email
        </label>
        <input
          id="email"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-[#4DC3AB] focus:outline-none"
        />
        {errors.email && <span className="text-red-500">{errors.email}</span>}
      </div>

      <div className="relative">
        <label htmlFor="password" className="block text-gray-500 mb-1">
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-[#4DC3AB] focus:outline-none pr-10"
          />
          <img
            src={showPassword ? eye : eyeSlash}
            alt="Toggle password visibility"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 cursor-pointer"
          />
        </div>
        {errors.password && (
          <span className="text-red-500">{errors.password}</span>
        )}
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="rememberMe"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="form-checkbox h-4 w-4 text-green-600 border-gray-300 rounded"
          />
          <label htmlFor="rememberMe" className="ml-2 text-gray-500">
            Remember me
          </label>
        </div>
        <Link to="/send-otp" className="text-red-500">
          Forgot password?
        </Link>
      </div>

      <div className="space-y-4">
        <button
          type="button"
          onClick={handleLogin}
          className="w-full py-2 bg-[#4DC3AB] hover:bg-[#43b8a0] text-white rounded-lg"
          disabled={loader}
        >
          {!loader ? "Login" : <Loader />}
        </button>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="w-full py-2 border flex justify-center items-center gap-3 border-[#4DC3AB] rounded-lg text-[#4DC3AB]"
          disabled={googleLoader}
        >
          {!googleLoader ? (
            <>
              {" "}
              <img
                src="/assets/google.svg"
                className="me-2"
                width={"25px"}
                alt="google"
                title="Google"
              />{" "}
              Login with Google
            </>
          ) : (
            <Loader />
          )}
        </button>
      </div>
    </form>
  );
};

export default Login;
