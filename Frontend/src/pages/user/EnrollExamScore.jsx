import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { axiosInstance, endPoints } from "../../api/axios";

const EnrollExamScore = () => {
  // const location = useLocation();
  const [activeIndex, setActiveIndex] = useState(null);
  const navigate = useNavigate();
  const [getExam, setGetExam] = useState([]);
  const [getExamQuestion, setExamQuestion] = useState([]);
  const [loading, setLoading] = useState(true);

  const { id } = useParams();

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const response = await axiosInstance.get(
          `${endPoints.exam.getById}/${id}`,
          {
            withCredentials: true,
          }
        );
        setGetExam(response?.data?.data);
        setExamQuestion(JSON.parse(response?.data?.data?.questions));

        // const correctAnswers = response?.data?.data?.;
        // const incorrectCount = response?.data?.data?.userAnswer.length - correctAnswers;
      } catch (error) {
        toast.error("Error Fetching exam:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExam();
  }, []);


  const toggleAccordion = (index) => {
    setActiveIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  return (
    <div className="bg-white">
      <div className="mb-10">
        <div className="flex justify-between items-start max-sm:flex-col max-sm:items-center max-sm:mb-3 max-lg:items-center">
          <h2
            className={`text-3xl font-semibold ${
              getExam?.result === "Pass" ? "text-green-700" : "text-red-700"
            } leading-[60px] max-sm:mb-2`}
          >
            {getExam?.result === "Pass"
              ? "Congratulations... 🎉"
              : "Bad Luck... 😓"}
          </h2>
          {/* <div className="flex justify-center">
            {getExam?.result === "Pass" ? (
              <Link
                to={"/user/practical-exam"}
                className="bg-[#e5f2ea] hover:bg-[#d9ece1] text-[#005151] font-semibold border border-[#278a8a] py-2 px-6 rounded-md transition-all duration-300"
              >
                Take Practical Exam
              </Link>
            ) : ( */}
              <div className="flex justify-center">
              <button
                onClick={() => navigate("/user/enroll-course")}
                className="bg-[#e5f2ea] hover:bg-[#d9ece1] text-[#005151] font-semibold border border-[#278a8a] py-2 px-6 rounded-md transition-all duration-300"
              >
                Back to Course
              </button>
            
          </div>
        </div>

        <span
          className={`${
            getExam?.result === "Pass" ? "text-green-700" : "text-red-700"
          } font-semibold max-sm:text-center block`}
        >
          {getExam?.result === "Pass"
            ? "You are Pass in this Exam."
            : "You are Fail in this Exam."}
        </span>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-sm:gap-1 mt-3">
          <div className="flex items-center gap-3 max-sm:text-center max-sm:block bg-white shadow-md py-6 px-4 border">
            <span className=" flex items-center text-md font-medium text-slate-700">
              <img src="/assets/right.png" alt="" className="mr-4 h-10 w-10" />
              Correct Answer:
            </span>
            <span className="text-lg font-bold text-green-700">
              {
                getExam?.userAnswer?.filter(
                  (answer) => answer?.rightAnswer === true
                ).length
              }
            </span>
          </div>

          <div className="flex items-center gap-3 max-sm:text-center max-sm:block bg-white shadow-md py-6 px-4 max-sm:mt-4 border">
            <span className="flex items-center text-md font-medium text-slate-700">
              <img src="/assets/cross.png" alt="" className="mr-4 h-10 w-10" />
              Wrong Answer:
            </span>
            <span className="text-lg font-bold text-red-600">
              {getExam?.userAnswer?.length -
                getExam?.userAnswer?.filter(
                  (answer) => answer?.rightAnswer === true
                )?.length}
            </span>
          </div>

          <div className="flex items-center gap-3 max-sm:text-center max-sm:block bg-white shadow-md py-6 px-4 max-sm:mt-4 border">
            <div className="flex items-center gap-3 max-sm:text-center max-sm:block">
              <span className="flex items-center text-md font-medium text-slate-700">
                <img
                  src="/assets/score.png"
                  alt=""
                  className="mr-4 h-10 w-10"
                />
                Total Score:
              </span>
              <span className="text-lg font-bold text-green-600">
                {getExam?.Score}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {getExamQuestion &&
        getExamQuestion.map((question, index) => {
          const userAnswerData = getExam.userAnswer.find(
            (answer) => answer.question === question.question
          );

          return (
            <div className="border-b border-slate-200" key={index}>
              <button
                onClick={() => toggleAccordion(index)}
                className="w-full flex justify-between items-center py-5 text-slate-800 font-semibold"
              >
                <span className="text-[18px]">
                  {index + 1}. {question.question}
                </span>
                <span
                  id={`icon-${index}`}
                  className="text-slate-800 transition-transform duration-300"
                >
                  {activeIndex === index ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                      className="w-4 h-4"
                    >
                      <path d="M3.75 7.25a.75.75 0 0 0 0 1.5h8.5a.75.75 0 0 0 0-1.5h-8.5Z" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                      className="w-4 h-4"
                    >
                      <path d="M8.75 3.75a.75.75 0 0 0-1.5 0v3.5h-3.5a.75.75 0 0 0 0 1.5h3.5v3.5a.75.75 0 0 0 1.5 0v-3.5h3.5a.75.75 0 0 0 0-1.5h-3.5v-3.5Z" />
                    </svg>
                  )}
                </span>
              </button>
              <div
                id={`content-${index}`}
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  activeIndex === index ? "max-h-screen" : "max-h-0"
                }`}
              >
                <div className="pb-5 text-md text-slate-500">
                  <div className="flex items-center justify-start max-sm:justify-center">
                    <div className="grid grid-cols-4 max-lg:grid-cols-2 max-sm:grid-cols-1 gap-4 max-sm:flex-col max-sm:items-center">
                      {question.options.map((option, optIndex) => (
                        <div
                          key={optIndex}
                          className={`flex items-center gap-1 cursor-pointer max-sm:w-full  ${
                            optIndex === question.rightAnswer
                              ? "border-green-500 bg-green-100"
                              : "border-gray-300"
                          } ${
                            userAnswerData?.userAnswer === option &&
                            optIndex !== question.rightAnswer
                              ? "bg-red-100 border-red-500"
                              : ""
                          } p-2 border rounded-md`}
                        >
                          <div
                            className={`w-4 h-4 rounded-full border flex-shrink-0  ${
                              optIndex === question.rightAnswer
                                ? "bg-green-500"
                                : userAnswerData?.userAnswer === option &&
                                  optIndex !== question.rightAnswer
                                ? "bg-red-500"
                                : "bg-gray-300"
                            }`}
                          ></div>

                          <span
                            className={`font-bold ${
                              optIndex === question.rightAnswer
                                ? "text-green-500"
                                : userAnswerData?.userAnswer === option &&
                                  optIndex !== question.rightAnswer
                                ? "text-red-500"
                                : "text-gray-500"
                            }`}
                          >
                            ({String.fromCharCode(65 + optIndex)}){" "}
                          </span>
                          <span
                            className={`ml-[10px] ${
                              optIndex === question.rightAnswer
                                ? "text-green-500"
                                : userAnswerData?.userAnswer === option &&
                                  optIndex !== question.rightAnswer
                                ? "text-red-500"
                                : "text-gray-500"
                            }`}
                          >
                            {option}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <p
                    className={`mt-3 max-sm:text-center ${
                      userAnswerData?.rightAnswer
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    <strong className="">Your Answer:</strong>{" "}
                    <span className={`font-semibold `}>
                      {userAnswerData?.userAnswer
                        ? `(${String.fromCharCode(
                            65 +
                              question.options.indexOf(
                                userAnswerData.userAnswer
                              )
                          )})`
                        : "No Answer"}
                    </span>
                  </p>
                  <p className="text-green-600 max-sm:text-center ">
                    <strong className="">Correct Answer:</strong>{" "}
                    <span className=" font-semibold">
                      {/* {question.options[question.rightAnswer]} */}(
                      {String.fromCharCode(65 + question.rightAnswer)})
                    </span>
                  </p>
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default EnrollExamScore;
