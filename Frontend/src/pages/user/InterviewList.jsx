import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import PageLoader from "../../component/PageLoader";
import { axiosInstance, endPoints } from "../../api/axios";

const InterviewList = () => {
  const [loader, setLoader] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const [interviewList, setInterviewList] = useState([]);

  useEffect(() => {
    const getInterview = async () => {
      try {
        setLoader(true);
        const { data } = await axiosInstance.get(
          `${endPoints.interview.createdBy}/${currentUser._id}`
        );
        setLoader(false);
        setInterviewList(data?.data);
      } catch (error) {
        setLoader(false);
        toast.error(error.response?.data?.message);
      }
    };

    getInterview();
  }, []);
  return (
    <div>
      <h2 className="text-xl font-bold text-[#005151] relative mb-5 mt-5">
        Previous Mock Interview
        <span className="absolute bottom-[-8px] left-0 w-[100px] h-[2px] bg-[#005151]"></span>
      </h2>

      {loader ? (
        <div className="flex justify-center items-center h-full">
          <PageLoader />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {interviewList && interviewList.length > 0 ? (
            interviewList.map((interview, index) => (
              <div className="border shadow-sm rounded-lg p-3" key={index}>
                <h2 className="font-bold text-lg">{interview?.jobPosition}</h2>
                <h2 className="font-semibold text-gray-600">
                  {interview?.jobExperience} Years of Experience
                </h2>
                <h2 className="font-semibold text-sm text-gray-600">
                  job Description : {interview?.jobDesc}
                </h2>
                <div className="flex justify-between items-end mt-5">
                  <Link
                    to={`/user/feedback/${interview?.mockId}`}
                    className="border border-[#005151] text-[#005151] bg-[#e5f2ea] hover:bg-[#d9ece1] font-semibold py-2 px-4 rounded-md"
                  >
                    Feedback
                  </Link>
                  <h2 className="text-xs text-gray-400">
                    Created At:{" "}
                    {new Date(interview?.createdAt).toLocaleDateString(
                      "en-GB",
                      {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      }
                    )}
                  </h2>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-1 md:col-span-3 text-center text-gray-500">
              No data found.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default InterviewList;
