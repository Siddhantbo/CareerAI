import React, { useEffect, useState } from "react";
import editButton from "../../../public/assets/EditButton.svg";
import deleteButton from "../../../public/assets/DeleteButton.svg";
import viewbutton from "../../../public/assets/viewbutton.svg";
import AddCourseList from "../../component/models/AddCourseList";
import axios from "axios";
import DeleteModel from "../../component/models/DeleteModel";
import { useNavigate } from "react-router-dom";
import ViewScheduleInterview from "../../component/models/ViewScheduleInterview";
import ViewLiveInterview from "../../component/models/ViewLiveInterview";
import PageLoader from "../../component/PageLoader";
import toast from "react-hot-toast";
import Pagination from "../../component/Pagination";
import { axiosInstance, endPoints } from "../../api/axios";

const ScheduleInterview = () => {
  const [loader, setLoader] = useState(false);
  const [hasPendingInterview, setHasPendingInterview] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isLiveInterviewOpen, setIsLiveInterviewOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [scheduleInterview, setScheduleInterview] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [interviewData, setInterviewData] = useState(null);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(scheduleInterview?.length / itemsPerPage);

  useEffect(() => {
    getCourses();
    getCandidates();
    getInterviewProgress();
  }, []);

  const getInterviewProgress = async () => {
    try {
      const { data } = await axiosInstance.get(
        endPoints.interview.viewSchedule,
        { withCredentials: true }
      );
      setInterviewData(data);
    } catch (error) {
      toast.error("Error ", error);
    }
  };

  function canScheduleNewInterview(userId, role) {
    console.log(interviewData, userId);
    // Ensure data is valid and contains interviews
    if (
      !interviewData ||
      !interviewData.interviews ||
      !Array.isArray(interviewData.interviews)
    ) {
      return true; // If there's no interview data, allow scheduling
    }

    // Check for an existing interview with the given userId and "Pending" status
    const hasPendingInterview = interviewData.interviews.some(
      (interview) =>
        interview.userId === userId &&
        interview.status === "Pending" &&
        interview.role === role
    );

    // If a pending interview exists, return false; otherwise, true
    return !hasPendingInterview;
  }

  const getCandidates = async () => {
    try {
      setLoader(true);
      const { data } = await axiosInstance.get(endPoints.candidates.getAll, {
        withCredentials: true,
      });
      console.log(data);
      setLoader(false);
      setScheduleInterview(data.data);
    } catch (error) {
      setLoader(false);
      toast.error("Error ", error);
    }
  };

  const getCourses = async () => {
    try {
      const { data } = await axiosInstance.get(endPoints.courses.getAll);
    } catch (error) {
      toast.error("Error ", error);
    }
  };

  const navigate = useNavigate();

  const handleEdit = (guard) => {
    navigate(`/user/candidate-info?id=${guard._id}`);
  };

  const handleDelete = async () => {
    try {
      const { data } = await axiosInstance.delete(
        `${endPoints.candidates.delete}/${selectedCandidate._id}`
      );
      toast.success("Candidate Deleted Successfully.");
      getCandidates();
      setIsDeleteModalOpen(false);
    } catch (error) {
      toast.error("Error ", error);
    }
  };

  const handleLiveInterviewClick = (data) => {
    setIsLiveInterviewOpen(true);
  };

  const filteredScheduleInterview = scheduleInterview?.filter(
    (guard) =>
      guard.first_Name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guard.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guard.gender.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guard.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guard.phoneNumber.toString().includes(searchQuery) ||
      new Date(guard?.birth_Date)
        .toLocaleString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
        .includes(searchQuery)
  );

  const currentItems = filteredScheduleInterview?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="p-4 sm:p-6 bg-white shadow rounded-lg w-full border">
      <div className="flex justify-between flex-col md:flex-row max-sm:mb-5">
        <h2 className="text-xl font-bold text-[#005151] relative mb-6 text-center sm:text-left">
          Schedule Interview
          <span className="absolute bottom-[-8px] left-1/2 sm:left-0 transform -translate-x-1/2 sm:translate-x-0 w-[100px] h-[2px] bg-[#005151]"></span>
        </h2>

        <div className="relative w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search..."
            className="w-full sm:w-[300px] border rounded py-2 px-4 shadow-sm focus:ring focus:ring-[#4DC3AB] focus:outline-none pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <img
            src="/assets/search-Bordere.svg"
            alt="Search Icon"
            className="absolute left-3 top-2.5 w-5 h-5"
          />
        </div>
      </div>

      <div className="overflow-x-auto h-[75vh] rounded-lg overflow-hidden border">
        <table className="w-full bg-white ">
          <thead className="bg-gray-200 w-full">
            <tr className="font-semibold capitalize ">
              <th className="p-3 text-gray-700 sm:px-6 text-nowrap">Name</th>
              <th className="p-3  text-gray-700 sm:px-6 text-nowrap">Email</th>
              <th className="p-3 text-gray-700 sm:px-6 text-nowrap">Gender</th>
              <th className="p-3 text-gray-700 sm:px-6 text-nowrap">Role</th>
              {/* <th className="p-4 text-gray-700 sm:px-6 text-nowrap">Skills</th> */}
              <th className="p-3 text-gray-700 sm:px-6 text-nowrap">
                Phone No
              </th>
              <th className="p-3 text-gray-700 sm:px-6 text-nowrap">
                Date of Birth
              </th>
              <th className="p-3 text-gray-700 sm:px-6 text-nowrap">Action</th>
            </tr>
          </thead>
          <tbody>
            {loader ? (
              <tr className="text-gray-500 select-none">
                <td className="text-center py-4 leading-[140px]" colSpan="100%">
                  <PageLoader />
                </td>
              </tr>
            ) : currentItems?.length > 0 ? (
              currentItems.map((guard) => (
                <tr key={guard.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4 sm:px-6 text-nowrap flex items-center min-w-[200px]">
                    <img
                      src={
                        guard.profile
                          ? guard.profile
                          : "https://via.placeholder.com/50"
                      }
                      alt="Profile"
                      className="w-12 h-12 rounded-full object-cover me-2"
                    />
                    <span className="capitalize ">
                      {guard.first_Name} {guard.last_Name}
                    </span>
                  </td>
                  <td className="py-2 px-4 sm:px-6 text-nowrap">
                    {guard.email}
                  </td>
                  <td className="py-2 px-4 sm:px-6 text-nowrap capitalize">
                    {guard.gender}
                  </td>
                  <td className="py-2 px-4 sm:px-6 text-nowrap capitalize">
                    {guard.role}
                  </td>
                  <td className="py-2 px-4 sm:px-6 text-nowrap">
                    {guard.phoneNumber}
                  </td>
                  <td className="py-2 px-4 sm:px-6 text-nowrap">
                    {new Date(guard?.birth_Date).toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </td>
                  <td className="py-2 px-4 sm:px-6 text-center flex space-x-3">
                    <button
                      className=" h-10 w-10"
                      onClick={() => handleEdit(guard)}
                    >
                      <img src={editButton} alt="Edit" />
                    </button>
                    <button
                      className=" h-10 w-10"
                      onClick={() => {
                        setSelectedCandidate(guard);
                        setIsDeleteModalOpen(true);
                      }}
                    >
                      <img src={deleteButton} alt="Delete" />
                    </button>
                    <button
                      className=" h-10 w-10"
                      onClick={() => {
                        setSelectedCandidate(guard);
                        setIsViewModalOpen(true);
                      }}
                    >
                      <img src={viewbutton} alt="View" />
                    </button>
                    {canScheduleNewInterview(guard.userId, guard.role) ? (
                      <button
                        className="h-10 w-10 flex justify-center items-center bg-[#F6F8FB] rounded-xl"
                        onClick={() => {
                          setSelectedCandidate(guard);
                          handleLiveInterviewClick("Live Interview");
                        }}
                      >
                        <img
                          src="/assets/calendar-tick.svg"
                          alt="Schedule Interview"
                        />
                      </button>
                    ) : (
                      <button className="h-10 w-10 flex justify-center items-center bg-[#F6F8FB] rounded-xl opacity-50 cursor-not-allowed">
                        <img
                          src="/assets/calendar-tick.svg"
                          alt="Schedule Interview"
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

      {currentItems?.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={paginate}
          setCurrentPage={setCurrentPage}
        />
      )}

      {/* Modals */}
      {isModalOpen && (
        <AddCourseList
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          getCourses={getCourses}
        />
      )}

      {isDeleteModalOpen && (
        <DeleteModel
          closePopup={() => {
            setIsDeleteModalOpen(false);
            setSelectedCandidate(null);
          }}
          onDelete={handleDelete}
          message={{
            title: "Delete Candidate?",
            sms: "Are you sure you want to delete this candidate?",
          }}
        />
      )}

      {isViewModalOpen && (
        <ViewScheduleInterview
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          data={selectedCandidate} // Pass selected data to the modal
        />
      )}

      {/* Live Interview Modal */}
      {isLiveInterviewOpen && (
        <ViewLiveInterview
          isOpen={isLiveInterviewOpen}
          onClose={() => setIsLiveInterviewOpen(false)}
          data={selectedCandidate}
        />
      )}
    </div>
  );
};

export default ScheduleInterview;
