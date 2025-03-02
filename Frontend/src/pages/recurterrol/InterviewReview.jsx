import React, { useEffect, useState } from "react";
import editButton from "../../../public/assets/EditButton.svg";
import viewbutton from "../../../public/assets/viewbutton.svg";
import interviewStatusEdit from "../../../public/assets/interview-status-edit.svg";
import axios from "axios";
import InterviewReviewEdit from "../../component/models/InterviewReviewEdit";
import ViewInterviewReview from "../../component/models/ViewInterviewReview";
import InterviewStatusEdit from "../../component/models/InterviewStatusEdit";
import PageLoader from "../../component/PageLoader";
import toast from "react-hot-toast";
import Pagination from "../../component/Pagination";
import { axiosInstance, endPoints } from "../../api/axios";

const InterviewReview = () => {
  const [loader, setLoader] = useState(false);
  const [isInterviewViewModal, setIsInterviewViewModal] = useState(false);
  const [isInterviewReviewEdit, setIsInterviewReviewEdit] = useState(false);
  const [isInteviewStatusEdit, SetIsInterviewStatusEdit] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  const [scheduleInterview, setScheduleInterview] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [searchTerm, setSearchTerm] = useState("");

  const getInterview = async () => {
    try {
      setLoader(true);
      const { data } = await axiosInstance.get(
        endPoints.interview.allViewSchedule
      );
      setScheduleInterview(data.interviews);
      setLoader(false);
    } catch (error) {
      toast.error("Error ", error);
      setLoader(false);
    }
  };

  const handleEditRoundClick = (data) => {
    setSelectedExam(data);
    setIsInterviewReviewEdit(true);
  };

  useEffect(() => {
    getInterview();
  }, []);

  const totalPages = Math.ceil(scheduleInterview.length / itemsPerPage);

  const filteredInterviews = scheduleInterview.filter((guard) => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return (
      guard.candidateName.toLowerCase().includes(lowerCaseSearchTerm) ||
      guard.candidateEmail.toLowerCase().includes(lowerCaseSearchTerm) ||
      guard.gender.toLowerCase().includes(lowerCaseSearchTerm) ||
      guard.role.toLowerCase().includes(lowerCaseSearchTerm) ||
      guard.status.toLowerCase().includes(lowerCaseSearchTerm)
    );
  });

  const paginatedInterviews = filteredInterviews.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="p-4 sm:p-6 bg-white shadow rounded-lg w-full border">
      {/* Search Bar */}
      <div className="flex justify-between max-sm:flex-col">
        <h2 className="text-xl font-bold text-[#005151] relative mb-8">
          Interview Review
          <span className="absolute bottom-[-8px] left-0 w-[100px] h-[2px] bg-[#005151]"></span>
        </h2>
        <div className="relative mb-5">
          <input
            type="text"
            placeholder="Search..."
            className="sm:mt-0 border rounded py-2 px-4 shadow-sm focus:ring focus:ring-[#4DC3AB] focus:outline-none mb-5 md:mb-0 w-auto md:w-[350px] pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <img
            src="/assets/search-Bordere.svg"
            alt="Search Icon"
            className="absolute left-2 top-3 w-6 h-5 "
          />
        </div>
      </div>
      <div className="overflow-x-auto h-[75vh]">
        <table className="w-full text-left border-collapse ">
          <thead>
            <tr className="bg-gray-100 text-gray-600 text-semibold capitalize">
              <th className="py-3 px-2 sm:px-3 text-nowrap">Name</th>
              <th className="py-3 px-2 sm:ps-12 sm:pe-3 text-nowrap">Email</th>
              <th className="py-3 px-2 sm:px-3 text-nowrap">Gender</th>
              <th className="py-3 px-2 sm:px-3 text-nowrap">Role</th>
              <th className="py-3 px-2 sm:px-3 text-nowrap">Live Interview</th>
              <th className="py-3 px-2 sm:px-6 text-nowrap">
                interview status
              </th>
              <th className="py-3 px-2 sm:px-3 text-nowrap text-center">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {loader ? (
              <tr className="text-gray-500 select-none">
                <td className="text-center py-4 leading-[140px]" colSpan="100%">
                  <PageLoader />
                </td>
              </tr>
            ) : paginatedInterviews.length > 0 ? (
              paginatedInterviews.map((guard) => (
                <tr key={guard?.id} className="border-b ">
                  <td className="py-2 px-2 sm:px-3 text-nowrap flex items-center min-w-[200px]">
                    <img
                      src={guard?.profile}
                      alt="Profile"
                      className="w-12 h-12 rounded-full object-cover me-2"
                    />
                    <span>{guard?.candidateName}</span>
                  </td>
                  <td className="py-2 px-2 sm:px-12 text-nowrap  min-w-[250px]">
                    {guard.candidateEmail}
                  </td>
                  <td className="py-2 px-2 sm:px-3 text-nowrap  min-w-[120px]">
                    {guard.gender}
                  </td>
                  <td className="py-2 px-2 sm:px-3 text-nowrap  min-w-[200px]">
                    {guard.role}
                  </td>

                  {guard.status === "Pending" ? (
                    <td className="py-2 px-2 sm:px-6 text-nowrap min-w-[150px]">
                      <button className="text-red-600 bg-red-100 px-4 py-1 rounded-full capitalize">
                        {guard.status}
                      </button>
                    </td>
                  ) : (
                    <td className="py-2 px-2 sm:px-6 text-nowrap min-w-[150px]">
                      <button className="text-[#4DC3AB] bg-[#d3f5eeb4] px-4 py-1 rounded-full capitalize">
                        {guard.status}
                      </button>
                    </td>
                  )}

                  {guard.selected === "Selected" ? (
                    <td className="py-2 px-2 sm:px-6 text-nowrap min-w-[200px]">
                      <button className="text-white bg-[#4DC3AB] px-4 py-1 rounded-full capitalize">
                        {guard.selected}
                      </button>
                    </td>
                  ) : (
                    <td className="py-2 px-2 sm:px-6 text-nowrap min-w-[200px]">
                      <button className="text-white bg-[#E74C3C] px-4 py-1 rounded-full capitalize">
                        {guard.selected === "Not_Selected"
                          ? "Not Selected"
                          : guard.selected}
                      </button>
                    </td>
                  )}

                  <td className="py-2 px-2 sm:px-6 text-center flex space-x-3 justify-center relative">
                    {/* View Button */}
                    <button
                      className="h-10 w-10"
                      onClick={() => {
                        setSelectedExam(guard);
                        setIsInterviewViewModal(true);
                      }}
                    >
                      <img src={viewbutton} alt="View" />
                    </button>

                    {/* Edit Button */}
                    {guard.status === "Pending" ? (
                      <button
                        className="h-10 w-10 opacity-100 cursor-pointer"
                        onClick={() => handleEditRoundClick(guard)}
                      >
                        <img src={editButton} alt="Edit" />
                      </button>
                    ) : (
                      <button
                        className="h-10 w-10 hidden"
                        onClick={() => handleEditRoundClick()}
                      >
                        <img src={editButton} alt="Edit" />
                      </button>
                    )}

                    {/* Interview Status Edit Button */}
                    {guard.status === "Completed" &&
                    guard.selected !== "Selected" ? (
                      <button
                        className="h-10 w-10 flex justify-center items-center bg-[#F6F8FB] rounded-lg"
                        onClick={() => {
                          setSelectedExam(guard);
                          SetIsInterviewStatusEdit(true);
                        }}
                      >
                        <img
                          src={interviewStatusEdit}
                          alt="Edit Interview Status"
                        />
                      </button>
                    ) : (
                      <button
                        className="h-10 w-10 hidden"
                        onClick={() => {
                          setSelectedExam(guard);
                          SetIsInterviewStatusEdit(true);
                        }}
                      >
                        <img
                          src={interviewStatusEdit}
                          alt="Edit Interview Status"
                        />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr className="text-gray-500 select-none">
                <td className="text-center py-4" colSpan="100%">
                  No Data Found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Component */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={paginate}
        setCurrentPage={setCurrentPage}
      />

      {isInterviewReviewEdit && (
        <InterviewReviewEdit
          isOpen={isInterviewReviewEdit}
          onClose={() => setIsInterviewReviewEdit(false)}
          data={selectedExam}
          onUpdate={getInterview}
        />
      )}

      {isInterviewViewModal && (
        <ViewInterviewReview
          isOpen={isInterviewViewModal}
          onClose={() => setIsInterviewViewModal(false)}
          data={selectedExam}
          profileImage={selectedExam?.profile}
        />
      )}

      {isInteviewStatusEdit && (
        <InterviewStatusEdit
          isOpen={isInteviewStatusEdit}
          onClose={() => SetIsInterviewStatusEdit(false)}
          data={selectedExam}
          onUpdate={getInterview}
        />
      )}
    </div>
  );
};

export default InterviewReview;
