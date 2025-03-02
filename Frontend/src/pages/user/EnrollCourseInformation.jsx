import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import ExamModal from "../../component/models/ExamModal";
import toast from "react-hot-toast";
import axios from "axios";
import Loader from "../../component/Loader";
import ExamInformationModal from "../../component/models/ExamInformationModal";

const EnrollCourseInformation = () => {
  const location = useLocation();
  const { selectedCourse } = location?.state;
  const [loading, setLoading] = useState(false);
  const [isExamInfoModel, setIsExamInfoModel] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [getExamQuestion, setGetExamQuestion] = useState([]);
  const [getExam, setGetExam] = useState([]);

  const handleEnrollExam = async () => {
    setIsExamInfoModel(true);
    // const inputPrompt = `Create exactly 10 multiple-choice questions (MCQs) based on the course: "${selectedCourse.title}". Each question should have 4 options, and rightAnswer with the format should be:
    // [
    //   {
    //     "question": "Question text",
    //     "options": ["Option1", "Option2", "Option3", "Option4"],
    //     "rightAnswer": 0
    //   }
    // ].`;
    // const currentUser = JSON.parse(localStorage.getItem("user"));
    // const response = await axios.post(
    //   `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${
    //     import.meta.env.VITE_GEMINI_API_KEY
    //   }`,
    //   {
    //     contents: [
    //       {
    //         parts: [
    //           {
    //             text: inputPrompt,
    //           },
    //         ],
    //       },
    //     ],
    //   },
    //   {
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //   }
    // );

    // const mockJsonResp = JSON.parse(
    //   response.data?.candidates?.[0]?.content?.parts?.[0]?.text
    //     .replace("```json", "")
    //     .replace("```", "")
    // );
    // setGetExamQuestion(mockJsonResp);
    // if (mockJsonResp) {
    //   const backendResponse = await axios.post(
    //     `${import.meta.env.VITE_BASE_URL}/api/v2/exam/exams`,
    //     {
    //       questions: JSON.stringify(mockJsonResp),
    //       course: selectedCourse?._id,
    //       user: currentUser?._id,
    //       status: "pending",
    //     },
    //     {
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //     }
    //   );
    //   setGetExam(backendResponse?.data?.data);
    //   setShowModal(!showModal);
    // }
  };

  if (!selectedCourse) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500 text-lg">
          No course information available.
        </p>
      </div>
    );
  }
  return (
    <div className="w-full h-[80vh]">
      <div
        className="relative w-full h-[15vh] flex items-center justify-center text-center bg-cover bg-center rounded-lg mb-8"
        style={{
          backgroundImage: `url('/assets/education-image.jpg')`,
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-30 rounded-md"></div>

        <div className="relative z-10 px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white">
            {selectedCourse.title}
          </h1>
        </div>
      </div>
      {/* Overview Card */}
      <div className="bg-white w-full h-auto max-w-8xl mx-auto p-8 rounded-lg custom-shadow">
        <p className="text-base md:text-lg text-gray-700 leading-relaxed">
          {selectedCourse.description}
        </p>
      </div>
      <div className="flex justify-end mt-8">
        <button
          onClick={handleEnrollExam}
          className="bg-[#e5f2ea] hover:bg-[#d9ece1] text-[#005151] font-semibold border border-[#278a8a] py-2 px-6 rounded-lg"
        >
          Give Exam
        </button>
      </div>

      {isExamInfoModel && (
        <ExamInformationModal
          selectedCourse={selectedCourse}
          onClose={() => setIsExamInfoModel(false)}
          setGetExamQuestion={setGetExamQuestion}
          setGetExam={setGetExam}
          setShowModal={setShowModal}
        />
      )}

      {showModal && (
        <ExamModal
          getExamQuestion={getExamQuestion}
          getExam={getExam}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default EnrollCourseInformation;
