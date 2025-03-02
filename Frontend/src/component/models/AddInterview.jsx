import axios from "axios";
import React, { useState } from "react";
import Loader from "../Loader";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import { axiosInstance, endPoints } from "../../api/axios";

const AddInterview = ({ isOpen, onClose }) => {
  const [loader, setLoader] = useState(false);
  const [jobPosition, setJobPosition] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [jobExperience, setJobExperience] = useState("");
  const [jsonResponse, setJsonResponse] = useState([]);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const inputPrompt = `Based on the Job Position: ${jobPosition}, Job Description: ${jobDesc}, and Years of Experience: ${jobExperience}, generate exactly 10 interview questions and their answers in the format [{"question": "Question", "answer": "Answer"}].`;

    try {
      setLoader(true);
      const currentUser = JSON.parse(localStorage.getItem("user"));

      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${
          import.meta.env.VITE_GEMINI_API_KEY
        }`,
        {
          contents: [
            {
              parts: [
                {
                  text: inputPrompt,
                },
              ],
            },
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const mockJsonResp = JSON.parse(
        response.data?.candidates?.[0]?.content?.parts?.[0]?.text
          .replace("```json", "")
          .replace("```", "")
      );


      setJsonResponse(mockJsonResp);

      if (mockJsonResp) {
        const backendResponse = await axiosInstance.post(
          endPoints.interview.mockInterview,
          {
            jsonMockResp: JSON.stringify(mockJsonResp), 
            jobPosition,
            jobDesc,
            jobExperience,
            createdBy: currentUser._id,
            mockId: uuidv4(),
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        onClose();
        navigate(`/user/start-interview/${backendResponse?.data?.data.mockId}`);
      }

      setLoader(false);
    } catch (error) {
      console.error(
        "Error calling Gemini API:",
        error.response?.data || error.message
      );
      setLoader(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[9999] overflow-y-auto">
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-[90%] max-h-[90%] sm:w-[450px] lg:w-[500px] overflow-y-auto">
        <h2 className="text-2xl font-semibold mb-4">
          Tell us more about your job interview
        </h2>
        <p className=" mb-4">
          Add details about your job position/role, job description and year of
          experience.
        </p>
        <form action="" onSubmit={handleSubmit}>
          <div className="mt-2">
            <label htmlFor="" className="text-gray-700 font-semibold">
              Job Role/Job Position
            </label>
            <input
              type="text"
              name="role"
              value={jobPosition}
              onChange={(e) => setJobPosition(e.target.value)}
              placeholder="Ex. Frontend Developer"
              className="input border border-gray-300 w-full rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#4DC3AB]"
              required
            />
          </div>
          <div className="mt-3">
            <label htmlFor="" className="text-gray-700 font-semibold">
              Job Description/ Tech Stack (In Short)
            </label>
            <textarea
              name="objective"
              value={jobDesc}
              onChange={(e) => setJobDesc(e.target.value)}
              placeholder="Ex. React, Angular, NodeJs, MySql etc."
              className="input border border-gray-300 w-full rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#4DC3AB]"
              required
            />
          </div>
          <div className="mt-3">
            <label htmlFor="" className="text-gray-700 font-semibold">
              Years of experience
            </label>
            <input
              type="number"
              name="role"
              value={jobExperience}
              onChange={(e) => setJobExperience(e.target.value)}
              placeholder="Ex. 05"
              className="input border border-gray-300 w-full rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#4DC3AB]"
              required
            />
          </div>
          <div className="mt-5 flex gap-4">
            <button
              onClick={onClose}
              className="border border-[#005151] text-[#005151] bg-[#e5f2ea] hover:bg-[#d9ece1] font-semibold py-2 px-4 rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              type="submit"
              className="border border-[#005151] text-[#005151] bg-[#e5f2ea] hover:bg-[#d9ece1] font-semibold py-2 px-4 rounded-md"
            >
              {loader ? (
                <>
                  <Loader />
                </>
              ) : (
                "Start Interview"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddInterview;
