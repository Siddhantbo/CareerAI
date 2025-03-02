import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import QuestionSection from "./QuestionSection";
import RecordAnswer from "./RecordAnswer";
import toast from "react-hot-toast";
import { axiosInstance, endPoints } from "../../api/axios";

const StartInterview = () => {
  const { id } = useParams();
  const [interviewData, setInterviewData] = useState({});
  const [mockInterviewQuestion, setMockInterviewQuestion] = useState([]);
  const [InterviewAnswerQuestion, setInterviewAnswerQuestion] = useState([]);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);

  useEffect(() => {
    const getInterview = async () => {
      try {
        const { data } = await axiosInstance.get(
          `${endPoints.interview.mockInterview}/${id}`
        );
        setInterviewData(data?.data);
        const jsonMockResp = data?.data?.jsonMockResp;
        const jsonData = JSON.parse(jsonMockResp);

        setMockInterviewQuestion(jsonData);
      } catch (error) {
        toast.error("Error fetching interview data.", error);
      }
    };

    getInterview();
  }, [id]);

  useEffect(() => {
    getInterviewQuestion();
  }, []);

  const getInterviewQuestion = async () => {
    try {
      const { data } = await axiosInstance.get(
        `${endPoints.interview.userAnswer}/${id}`
      );
      setInterviewAnswerQuestion(data?.data);
      console.log(data?.data);
    } catch (error) {
      toast.error(error.response?.data?.message);
      setLoader(false);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2">
        <QuestionSection
          mockInterviewQuestion={mockInterviewQuestion}
          activeQuestionIndex={activeQuestionIndex}
          setActiveQuestionIndex={setActiveQuestionIndex}
          InterviewAnswerQuestion={InterviewAnswerQuestion}
        />
        <div>
          <RecordAnswer
            mockInterviewQuestion={mockInterviewQuestion}
            activeQuestionIndex={activeQuestionIndex}
            interviewData={interviewData}
            setActiveQuestionIndex={setActiveQuestionIndex}
            InterviewAnswerQuestion={InterviewAnswerQuestion}
            getInterviewQuestion={getInterviewQuestion}
          />
          <div className="flex justify-center gap-4 mt-4">
            {activeQuestionIndex > 0 && (
              <button
                className="bg-[#e5f2ea] hover:bg-[#d9ece1] text-[#005151] font-semibold py-2 px-4 rounded-md"
                onClick={() => setActiveQuestionIndex(activeQuestionIndex - 1)}
              >
                Previous Question
              </button>
            )}
            {activeQuestionIndex != mockInterviewQuestion?.length - 1 && (
              <button
                className="bg-[#e5f2ea] hover:bg-[#d9ece1] text-[#005151] font-semibold py-2 px-4 rounded-md"
                onClick={() => setActiveQuestionIndex(activeQuestionIndex + 1)}
              >
                Next Question
              </button>
            )}
            {activeQuestionIndex === mockInterviewQuestion?.length - 1 && (
              <Link
                to={`/user/feedback/${interviewData.mockId}`}
                className="bg-[#e5f2ea] hover:bg-[#d9ece1] text-[#005151] font-semibold py-2 px-4 rounded-md"
              >
                End Interview
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartInterview;
