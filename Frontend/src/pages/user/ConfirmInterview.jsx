import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useParams } from "react-router-dom";
import Webcam from "react-webcam";
import { axiosInstance, endPoints } from "../../api/axios";

const ConfirmInterview = () => {
  const { id } = useParams();
  const [interviewData, setInterviewData] = useState({});
  const [webCamEnabled, setWebCamEnabled] = useState(false);

  useEffect(() => {
    const getInterview = async () => {
      try {
        const { data } = await axiosInstance.get(
          `${endPoints.interview.mockInterview}/${id}`
        );
        setInterviewData(data?.data);
      } catch (error) {
        toast.error("Error ", error);
      }
    };

    getInterview();
  }, []);

  return (
    <div className=" items-center">
      <h2 className="text-xl font-bold text-[#005151] relative mb-8">
        Let's get Started
        <span className="absolute bottom-[-8px] left-0 w-[100px] h-[2px] bg-[#005151]"></span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2">
        <div>
          <div className="flex flex-col gap-3 rounded-lg border p-5">
            <h2 className="text-lg">
              <strong>Job Role/Job Position:</strong>{" "}
              {interviewData.jobPosition}
            </h2>
            <h2 className="text-lg">
              <strong>Job Description/Tech Stack:</strong>{" "}
              {interviewData.jobDesc}
            </h2>
            <h2 className="text-lg">
              <strong>Years of Experience:</strong>{" "}
              {interviewData.jobExperience}
            </h2>
          </div>
          <div className="p-4 border rounded-lg border-yellow-300 mt-4 bg-yellow-100">
            <div className="flex font-bold text-yellow-500">
              <img src="/assets/magicpen.svg" alt="" />
              Information
            </div>
            <p>
              Enabled Video webcam and microphone to start ai generated mock
              interview, it Has 5 questions which you can answer and at the last
              you will get the report on the basic of your answer. NOTE:we never
              record your video, web cam access you can disable at any time if
              you wont..
            </p>
          </div>
        </div>

        <div className="flex flex-col justify-center items-center">
          {webCamEnabled ? (
            <div className="relative">
              <Webcam
                onUserMedia={() => setWebCamEnabled(true)}
                onUserMediaError={() => setWebCamEnabled(false)}
                style={{ width: "100%", height: 350 }}
                mirrored={true}
              />
              <button
                onClick={() => setWebCamEnabled(false)}
                className="absolute top-2 right-2 bg-white/80 px-3 py-1 rounded-md hover:bg-white"
              >
                Hide Camera
              </button>
            </div>
          ) : (
            <>
              <img src="/assets/webcam-clipart.jpg" className="w-60" alt="" />
              <button
                className={`px-4 py-2 rounded-lg bg-[#e5f2ea] hover:bg-[#d9ece1] text-[#005151] border border-[#2a8f8f]`}
                onClick={() => setWebCamEnabled(true)}
              >
                Enabled Web Cam and Microphone
              </button>
            </>
          )}
          <div className="mt-5">
            <Link
              to={`/user/start-interview/${id}/start`}
              className={`px-4 py-2 rounded-lg bg-[#005151] text-[white]`}
            >
              Start Interview
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmInterview;
