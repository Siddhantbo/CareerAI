import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import Loader from "../component/Loader";
import { axiosInstance, endPoints } from "../api/axios";

const ForgetPassword = () => {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [errors, setErrors] = useState({});
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();
  const validate = () => {
    const newErrors = {};
    if (!emailOrPhone) {
      newErrors.emailOrPhone = "Email is required.";
    } else if (
      !/^\S+@\S+\.\S+$/.test(emailOrPhone) &&
      !/^\d+$/.test(emailOrPhone)
    ) {
      newErrors.emailOrPhone = "Enter a valid email.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    
    e.preventDefault();
    if (validate()) {
      setLoader(true);
      try {
        const { data } = await axiosInstance.post(endPoints.auth.sendOtp,
          { email: emailOrPhone }
        );
        toast.success(data.message);
        setEmailOrPhone("");
        navigate("/verify-otp", { state: { emailOrPhone } });
      } catch (error) {
        console.error("Error in OTP request:", error);
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Something went wrong. Please try again.";
        toast.error(errorMessage);
      } finally {
        setLoader(false);
      }
    }
  };  

  return (
    <div className="w-full max-w-xs md:max-w-md lg:max-w-lg p-10 bg-white shadow rounded-md mx-auto border">
      <h2 className="text-3xl font-semibold mb-3 text-gray-800">Forget Password</h2>
      <p className="text-[#4F4F4F] text-sm mb-4">
        Enter your email and we’ll send you a otp to reset your password.
      </p>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            className="block text-gray-700 font-semibold mb-1"
            htmlFor="emailOrPhone"
          >
            Email <span className="text-[#E74C3C]">*</span>
          </label>
          <input
            type="text"
            id="emailOrPhone"
            className={`w-full px-4 py-2 border ${
              errors.emailOrPhone ? "border-[#E74C3C]" : "border-gray-300"
            } rounded-md focus:outline-none focus:ring-1 focus:ring-slate-600`}
            placeholder="Enter Your Email"
            value={emailOrPhone}
            onChange={(e) => {
              setEmailOrPhone(e.target.value);
              if (errors.emailOrPhone) validate();
            }}
          />
          {errors.emailOrPhone && (
            <p className="text-[#E74C3C] text-sm mt-1">{errors.emailOrPhone}</p>
          )}
        </div>

        <button
          type="submit"
          className={`w-full font-semibold py-2 mt-4 px-4 rounded-md ${"bg-[#4DC3AB] text-white"}`}
          disabled={loader}
        >
          {!loader ? "Get OTP" : <Loader />}
        </button>

        <p className="mt-4 text-center text-gray-600">
          <Link to="/" className="text-red-500 hover:underline">
            Back to Login
          </Link>
        </p>
      </form>
    </div>
  );
};
export default ForgetPassword;
