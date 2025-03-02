import React, { useEffect, useState } from "react";
import axios from "axios";
import add from "../../../public/assets/add-square.svg";
import editButton from "../../../public/assets/EditButton.svg";
import deleteButton from "../../../public/assets/DeleteButton.svg";
import AddRecruiter from "../../component/models/AddRecruiter";
import DeleteModel from "../../component/models/DeleteModel";
import PageLoader from "../../component/PageLoader";
import toast from "react-hot-toast";
import Pagination from "../../component/Pagination";
import { axiosInstance, endPoints } from "../../api/axios";

const RecruiterManagement = () => {
  const [recruiterManagement, setRecruiterManagement] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedRecruiter, setSelectedRecruiter] = useState({});
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [recruiterToDelete, setRecruiterToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const skillsPerPage = 10;
  const [loader, setLoader] = useState(false);

  const fetchRecruiters = async () => {
    try {
      setLoader(true);
      const response = await axiosInstance.get(endPoints.recruiters.getAll);
      setLoader(false);
      setRecruiterManagement(response.data.data);
    } catch (error) {
      toast.error("Error fetching recruiters.", error.message);
      setLoader(false);
    }
  };

  const deleteRecruiter = async (id) => {
    if (!id) {
      return;
    }

    try {
      const response = await axiosInstance.delete(
        `${endPoints.recruiters.delete}/${id}`
      );
      if (response.data.success) {
        setRecruiterManagement((prevRecruiters) =>
          prevRecruiters.filter((recruiter) => recruiter._id !== id)
        );
        toast.success("Recruiters Deleted Successfully.");
        setIsDeleteModalOpen(false);
      } else {
        toast.error("Failed to delete recruiter.", response.statusText);
      }
    } catch (error) {
      toast.error("Error during deletion.", error);
    }
  };

  useEffect(() => {
    fetchRecruiters();
  }, []);

  const openEditModal = (recruiter) => {
    setSelectedRecruiter(recruiter);
    setIsModalOpen(true);
    setIsEditing(true);
  };

  const openDeleteModal = (recruiter) => {
    setRecruiterToDelete(recruiter);
    setIsDeleteModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedRecruiter({});
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRecruiter({});
    setIsEditing(false);
  };

  const filteredRecruiters = recruiterManagement.filter((recruiter) =>
    `${recruiter.firstName} ${recruiter.lastName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const totalPages = Math.ceil(recruiterManagement.length / skillsPerPage);
  const indexOfLastRecruiter = currentPage * skillsPerPage;
  const indexOfFirstRecruiter = indexOfLastRecruiter - skillsPerPage;
  const currentRecruiters = filteredRecruiters.slice(
    indexOfFirstRecruiter,
    indexOfLastRecruiter
  );

  const currentSkills = currentRecruiters.slice(
    indexOfFirstRecruiter,
    indexOfLastRecruiter
  );

  return (
    <div className="border p-4">
      <h2 className="text-xl font-bold text-[#005151] relative mb-4 text-center sm:text-left">
        Recruiter Management
        <span className="absolute bottom-[-8px] left-1/2 sm:left-0 transform -translate-x-1/2 sm:translate-x-0 w-[80px] h-[2px] bg-[#005151]"></span>
      </h2>
      <div className="flex flex-col-reverse sm:flex-row flex-wrap items-center justify-between mb-4 gap-4">
        <div className="relative w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search..."
            className="w-full sm:w-[300px] border rounded py-2 px-4 shadow-sm focus:ring focus:ring-[#4DC3AB] focus:outline-none pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <img
            src="/assets/search-Bordere.svg"
            alt="Search Icon"
            className="absolute left-3 top-2.5 w-5 h-5"
          />
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-3 h-10 px-5 rounded-lg bg-[#e5f2ea] text-[#005151] font-bold transition-colors hover:bg-[#d9ece1]"
        >
          <img src={add} alt="Add" className="w-5 h-5" />
          <span>Add Recruiter</span>
        </button>
      </div>
      <div className="rounded-lg w-full overflow-x-auto border">
        <table className="w-full bg-white shadow-lg rounded-lg overflow-hidden">
          <thead className="bg-gray-200 w-full">
            <tr className="font-semibold capitalize">
              <th className="p-3 text-left text-gray-700 text-nowrap">
                Recruiter Fullname
              </th>
              <th className="py-3 px-4 text-left text-gray-700">Email</th>
              <th className="p-3 text-left text-gray-700 text-nowrap">
                Date of Birth
              </th>
              <th className="p-3 text-left text-gray-700">Gender</th>
              <th className="p-3 px-2 text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody>
            {loader ? (
              <tr className="text-gray-500 select-none">
                <td className="text-center py-4 leading-[140px]" colSpan="100%">
                  <PageLoader />
                </td>
              </tr>
            ) : currentSkills.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-3 text-gray-500">
                  No data found
                </td>
              </tr>
            ) : (
              currentSkills.map((recruiter) => (
                <tr key={recruiter._id} className="border-b hover:bg-gray-50">
                  <td className="py-1 px-4 flex items-center space-x-3 capitalize min-w-[220px]">
                    <img
                      src={
                        recruiter.userPhoto?.url ||
                        "https://via.placeholder.com/50"
                      }
                      alt="Profile"
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <span className="text-gray-800 text-semibold">{`${recruiter.first_Name} ${recruiter.last_Name}`}</span>
                  </td>
                  <td className="py-1 px-4 text-gray-700  text-semibold">
                    {recruiter.email}
                  </td>
                  <td className="py-1 px-4 text-gray-700  text-semibold">
                    {new Date(recruiter.birth_Date).toLocaleDateString()}
                  </td>
                  <td className="py-1 px-4 capitalize text-semibold text-gray-700">
                    {recruiter.gender}
                  </td>
                  <td className="py-1 px-4 items-center space-x-3 flex justify-center">
                    <button
                      className="h-10 w-10"
                      onClick={() => openEditModal(recruiter)}
                    >
                      <img src={editButton} alt="Edit" />
                    </button>

                    <button
                      className="h-10 w-10"
                      onClick={() => openDeleteModal(recruiter)}
                    >
                      <img src={deleteButton} alt="Delete" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {filteredRecruiters.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={paginate}
          setCurrentPage={setCurrentPage}
        />
      )}

      <AddRecruiter
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        recruiter={selectedRecruiter}
        isEditing={isEditing}
        fetchRecruiters={fetchRecruiters}
        // onSave={handleSave}
      />
      {isDeleteModalOpen && (
        <DeleteModel
          closePopup={closeModal}
          onDelete={() => {
            if (recruiterToDelete && recruiterToDelete._id) {
              deleteRecruiter(recruiterToDelete._id);
            } else {
              console.error("No valid recruiter _id");
            }
          }}
          message={{
            title: "Are you sure?",
            sms: "Do you really want to delete this recruiter?",
          }}
        />
      )}
    </div>
  );
};

export default RecruiterManagement;
