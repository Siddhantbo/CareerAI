import React, { useState } from "react";
import eyeSlash from "../../public/assets/eye-slash.svg";
import eye from "../../public/assets/eye.svg";
import DatePicker from "react-datepicker";
import axios from "axios";
import toast from "react-hot-toast";
import Loader from "../component/Loader";
import { useNavigate } from "react-router-dom";
import { axiosInstance, endPoints } from "../api/axios";

const Registration = ({ setIsLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showSecondPassword, setShowSecondPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loader, setLoader] = useState(false);
  const navigation = useNavigate();

  const handleRegister = async () => {
    const newErrors = {};
    if (!firstName) newErrors.firstName = "First Name is required";
    if (!lastName) newErrors.lastName = "Last Name is required";
    if (!email) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";
    if (password !== confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    if (!dateOfBirth) newErrors.dateOfBirth = "Date of Birth is required";
    if (!gender) newErrors.gender = "Gender is required";
    if (!termsAccepted)
      newErrors.terms = "You must accept the terms and conditions.";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      newErrors.password =
        "Password must be at least 8 characters long, contain at least one uppercase letter, one number, and one special character.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    try {
      setLoader(true);

      const response = await axiosInstance.post(endPoints.auth.sendCode, {
        email,
      });
      if (response.status === 200) {
        toast.success("OTP has been resent successfully!");
        navigation("/verify-otp", {
          state: {
            email,
            user: {
              first_Name: firstName,
              last_Name: lastName,
              email,
              password,
              birth_Date: dateOfBirth,
              gender,
              termsAccepted,
              Cpassword: confirmPassword,
              role: "user",
            },
          },
        });
      }

      setLoader(false);
      setIsLogin(true);
    } catch (error) {
      setLoader(false);
      console.error("Error in login:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong. Please try again.";
      toast.error(errorMessage);
    }
    setErrors({});
  };

  return (
    <form className="space-y-4">
      <div className="flex space-x-4">
        <div className="flex flex-col w-full">
          <label className="mb-1 text-gray-500">First Name</label>
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-600 rounded-lg outline-none transition duration-200 hover:border-[#76a988] focus:border-[#6bcc8d] max-w-[400px] focus:ring focus:ring-[#4DC3AB] focus:outline-none pr-10"
          />
          {errors.firstName && (
            <span className="text-red-500">{errors.firstName}</span>
          )}
        </div>
        <div className="flex flex-col w-full">
          <label className="mb-1 text-gray-500">Last Name</label>
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-600 rounded-lg outline-none  transition duration-200 hover:border-[#76a988] focus:border-[#6bcc8d] max-w-[400px] focus:ring focus:ring-[#4DC3AB] focus:outline-none pr-10"
          />
          {errors.lastName && (
            <span className="text-red-500">{errors.lastName}</span>
          )}
        </div>
      </div>
      <div className="flex flex-col">
        <label className="mb-1 text-gray-500">Email</label>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border border-gray-600 rounded-lg outline-none transition duration-200 hover:border-[#76a988] focus:border-[#6bcc8d] focus:ring focus:ring-[#4DC3AB] focus:outline-none pr-10"
        />
        {errors.email && <span className="text-red-500">{errors.email}</span>}
      </div>
      <div className="flex flex-col relative  ">
        <label className="mb-1 text-gray-500">Password</label>
        <div className="flex items-center relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="relative w-full px-4 py-2 border border-gray-600 rounded-lg outline-none transition duration-200 hover:border-[#76a988] focus:border-[#6bcc8d]  focus:ring focus:ring-[#4DC3AB] focus:outline-none pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="ml-2 text-gray-600"
          >
            {showPassword ? (
              <img
                src={eye}
                className="w-6 absolute right-4 top-2"
                alt="Hide password"
                width="16"
                height="16"
              />
            ) : (
              <img
                src={eyeSlash}
                className="w-6 absolute right-4 top-2"
                alt="Show password"
                width="16"
                height="16"
              />
            )}
          </button>
        </div>
        {errors.password && (
          <span className="text-red-500">{errors.password}</span>
        )}
      </div>
      <div className="flex flex-col relative">
        <label className="mb-1 text-gray-500">Confirm Password</label>
        <div className="flex items-center relative">
          <input
            type={showSecondPassword ? "text" : "password"}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="relative w-full px-4 py-2 border border-gray-600 rounded-lg outline-none transition duration-200 hover:border-[#76a988] focus:border-[#6bcc8d] focus:ring focus:ring-[#4DC3AB] focus:outline-none pr-10"
          />
          <button
            type="button"
            onClick={() => setShowSecondPassword(!showSecondPassword)}
            className="ml-2 text-gray-600"
          >
            {showSecondPassword ? (
              <img
                src={eye}
                className="w-6 absolute right-4 top-2"
                alt="Hide password"
                width="16"
                height="16"
              />
            ) : (
              <img
                src={eyeSlash}
                className="w-6 absolute right-4 top-2"
                alt="Show password"
                width="16"
                height="16"
              />
            )}
          </button>
        </div>
        {errors.confirmPassword && (
          <span className="text-red-500">{errors.confirmPassword}</span>
        )}
      </div>
      <div className="flex space-x-4">
        <div className="flex flex-col w-full">
          <label className="text-gray-500">Date Of Birth</label>
          <DatePicker
            selected={dateOfBirth}
            onChange={(date) => setDateOfBirth(date)}
            maxDate={new Date()}
            dateFormat="dd-MM-yyyy"
            placeholderText="Select Date"
            className={`w-full transition border border-gray-600 duration-200 hover:border-[#76a988] focus:border-[#6bcc8d] max-w-[400px] focus:ring focus:ring-[#4DC3AB] focus:outline-none pr-10 p-2 rounded-md mt-2 outline-none ${
              errors.date ? "border-red-500" : ""
            }`}
            style={{ height: "48px" }}
          />
          {errors.dateOfBirth && (
            <span className="text-red-500">{errors.dateOfBirth}</span>
          )}
        </div>
        <div className="flex flex-col w-full mb-4 pt-1">
          <label className="mb-1 text-gray-500">Gender</label>
          <div className="relative">
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full p-2 border border-gray-600 rounded-lg outline-none transition duration-200 hover:border-[#76a988] focus:border-[#6bcc8d] focus:ring focus:ring-[#4DC3AB] focus:outline-none pr-10"
              style={{ height: "42px" }}
            >
              <option value="">Select</option>
              <option value="male" className="select">
                Male
              </option>
              <option value="female">Female</option>
              <option value="Other">Other</option>
            </select>
            {errors.gender && (
              <span className="text-red-500">{errors.gender}</span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          checked={termsAccepted}
          onChange={(e) => setTermsAccepted(e.target.checked)}
          className="mr-2"
        />
        <label className="text-gray-500">
          I accept the{" "}
          <a href="/terms" className="text-[#005151]">
            Terms and Conditions
          </a>
        </label>
      </div>
      {errors.terms && <span className="text-red-500">{errors.terms}</span>}

      <div className="flex justify-between items-center">
        <button
          type="button"
          onClick={handleRegister}
          className="w-full py-2 bg-[#4dc3ab] hover:bg-[#2a6e6f] text-white rounded-lg transition duration-200"
          disabled={loader}
        >
          {!loader ? "Register" : <Loader />}
        </button>
      </div>
    </form>
  );
};

export default Registration;
