import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Loader from "../component/Loader";
import { axiosInstance, endPoints } from "../api/axios";

const OtpScreen = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(180);
  const [loader, setLoader] = useState(false);
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const [otpExpired, setOtpExpired] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  // const email = location.state?.emailOrPhone;
  const [errorMessage, setErrorMessage] = useState("");
  const inputRefs = useRef([]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    } else {
      setOtpExpired(true);
      setErrorMessage("OTP has expired. Please resend the OTP.");
    }
  }, [timer]);

  const handleOtpChange = (e, index) => {
    const value = e.target.value;
    if (/^[0-9]$/.test(value) || value === "") {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value !== "" && index < 5) {
        inputRefs.current[index + 1].focus();
      }
      if (value === "" && index > 0) {
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const handleResendOtp = async () => {
    try {
      setLoader(true);
      const response = await axiosInstance.post(
        location.state.email ? endPoints.auth.sendCode : endPoints.auth.sendOtp,
        {
          email: location.state.email
            ? location.state.email
            : location.state.emailOrPhone,
        }
      );
      if (response.status === 200) {
        setOtp(["", "", "", "", "", ""]);
        setTimer(180);
        setOtpExpired(false);
        toast.success("OTP has been resent successfully!");
        setErrorMessage("");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to resend OTP.";
      toast.error(errorMessage);
      setErrorMessage(errorMessage);
    } finally {
      setLoader(false);
    }
  };

  const handleVerifyOtp = async () => {
    const otpValue = otp.join("");
    if (otpValue.length < 6) {
      setErrorMessage("Please enter the complete OTP.");
      return;
    }

    if (otpExpired) {
      setErrorMessage("OTP has expired. Please resend the OTP.");
      return;
    }

    try {
      setLoader(true);
      const response = await axiosInstance.post(
        location.state.email
          ? endPoints.auth.verifyCode
          : endPoints.auth.verify,
        {
          otp: otpValue,
          email: location.state.email
            ? location.state.email
            : location.state.emailOrPhone,
        }
      );

      if (response.status === 200) {
        toast.success("OTP verified successfully!");
        setErrorMessage("");
        setOtp(["", "", "", "", "", ""]);

        if (location.state.email) {
          // for register
          const { data } = await axiosInstance.post(
            endPoints.auth.register,
            location.state.user
          );
          toast.success(data?.message);
          navigate("/");
        } else {
          navigate("/reset-password", {
            state: { email: location.state?.emailOrPhone },
          });
        }
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong. Please try again.";
      toast.error(errorMessage);
      setErrorMessage(errorMessage);
    } finally {
      setLoader(false);
    }
  };

  const isOtpValid = otp.every((digit) => digit.length === 1);

  return (
    <div className="w-full max-w-lg p-10 bg-white shadow rounded-md border">
      <h2 className="text-3xl font-bold mb-3 text-gray-800">Enter OTP</h2>
      <p className="text-gray-600 text-sm mb-4">
        Please enter the 6-digit code that was sent to your phone number.
      </p>
      <div className="flex space-x-4">
        {otp.map((digit, index) => (
          <input
            key={index}
            type="text"
            maxLength={1}
            value={digit}
            placeholder="0"
            className={`w-12 h-12 border rounded-md text-center focus:outline-none  ${
              errorMessage
                ? "border-[#E74C3C]"
                : "border-gray-300 focus:ring-1 focus:ring-slate-600"
            }`}
            onChange={(e) => handleOtpChange(e, index)}
            ref={(el) => (inputRefs.current[index] = el)}
          />
        ))}
      </div>
      {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
      <div className="flex justify-between mt-4">
        <p className="text-gray-600 flex gap-2">
          <img src="/assets/clock.svg" alt="" />
          {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, "0")}
        </p>
        <button
          disabled={isResendDisabled}
          onClick={handleResendOtp}
          className="text-[#E74C3C] hover:underline"
        >
          Resend OTP
        </button>
      </div>
      <button
        disabled={!isOtpValid || loader || otpExpired}
        onClick={handleVerifyOtp}
        className={`w-full font-semibold py-2 mt-4 px-4 rounded-md ${
          isOtpValid && !otpExpired
            ? "bg-[#4DC3AB] text-white"
            : "bg-[#F6F8FB] text-[#A7A7A7]"
        }`}
      >
        {!loader ? "Verify" : <Loader />}
      </button>
    </div>
  );
};

export default OtpScreen;
