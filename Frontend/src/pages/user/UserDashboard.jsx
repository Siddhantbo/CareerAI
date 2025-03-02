import React, { useEffect, useState } from "react";
import { features } from "../../utils/defaultData";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import PageLoader from "../../component/PageLoader";
import toast from "react-hot-toast";
import Pagination from "../../component/Pagination";
import { axiosInstance, endPoints } from "../../api/axios";

const UserDashboard = () => {
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const [Enrollexamtable, setEnrollexamtable] = useState([]);
  const [loader, setLoader] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const navigate = useNavigate();

  const handelToolsClick = (tool) => {
    navigate(tool.link);
    localStorage.setItem("activeItem", tool.name);
    const sidebarItem = sidebarData.find((item) => item.name === tool.name);
    if (sidebarItem?.subMenu) {
      setOpenSubItems({ [sidebarItem.name]: true });
    }
  };

  const getEnroll = async () => {
    try {
      setLoader(true);
      const { data } = await axiosInstance.get(
        endPoints.exam.getLatest,
        {
          withCredentials: true,
        }
      );
      setEnrollexamtable(data?.data);
    } catch (error) {
      toast.error("Error fetching course info.", error);
    } finally {
      setLoader(false);
    }
  };
  useEffect(() => {
    getEnroll();
  }, []);

  const filteredEnrollments = Enrollexamtable.filter(
    (item) =>
      item.course?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item?.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.course?.roleId?.roleName
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredEnrollments.length / itemsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <div className="mb-6 max-sm:mb-3">
        <h1 className="text-4xl font-semibold text-[#005151] leading-[60px] capitalize max-sm:text-3xl max-sm:mb-2">
          Welcome {currentUser?.first_Name} {currentUser?.last_Name} 🎉,
        </h1>
        <p className="font-normal text-base text-won-blue leading-4">
          Let’s land your dream job with Interview AI!
        </p>

        <h2 className="text-xl mt-10 font-semibold text-[#005151] relative text-center sm:text-left">
          Interview AI Tools
          <span className="absolute bottom-[-8px] left-1/2 sm:left-0 transform -translate-x-1/2 sm:translate-x-0 w-[100px] h-[2px] bg-[#005151]"></span>
        </h2>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-3 gap-4 max-2xl:grid-cols-2 max-sm:grid-cols-1">
        {features.map((tool, index) => (
          <button
            onClick={() => handelToolsClick(tool)}
            // to={link}
            key={index}
            className={`flex items-center bg-white rounded-lg p-2 w-full h-full cursor-pointer shadow-[0px_0px_40px_0px_rgba(0,0,0,0.08)] max-sm:flex-col ${
              location.pathname === tool.link ? "bg-[#005151] text-white" : ""
            }`}
          >
            {/* Icon */}
            <div className="bg-[#e5f2ea] hover:bg-[#d9ece1] rounded-lg flex flex-col items-center justify-center w-[70px] h-[70px] max-sm:mb-4">
              <span className="text-xs text-center font-medium text-[#005151] mb-2">
                {tool?.title2}
              </span>
              <img src={tool.icon} alt={tool.title} className="w-[25px]" />
            </div>
            {/* Content */}
            <div className="ml-4 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-gray-800">
                  {tool.title}
                </h3>
                <img src="/assets/nextarrow.png" alt="" className="w-[20px]" />
              </div>
              <p className="text-sm text-gray-500 text-left mt-0">
                {tool.description}
              </p>
            </div>
          </button>
        ))}
      </div>

      <div className="md:flex md:justify-between mb-2 mt-10 items-center">
        <h2 className="text-xl font-semibold text-[#005151] relative text-center sm:text-left">
          Recent Exams History
          <span className="absolute bottom-[-8px] left-1/2 sm:left-0 transform -translate-x-1/2 sm:translate-x-0 w-[100px] h-[2px] bg-[#005151]"></span>
        </h2>
        <div className="relative">
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
      <div className="overflow-y-auto max-h-[375px] overflow-auto max-sm:overflow-y-auto max-sm:overflow-x-auto rounded-lg border ">
        <table className="w-full bg-white rounded-lg">
          <thead className="bg-gray-200 w-full sticky top-0 z-10">
            <tr className="font-semibold capitalize">
              <th className="p-3 text-gray-700  text-left rounded-tl-lg text-nowrap">
                course
              </th>
              <th className="p-3 text-gray-700 text-nowrap">Role</th>
              <th className="p-3 text-gray-700 text-nowrap text-center">
                Exam Laval
              </th>
              <th className="p-3 text-gray-700 text-nowrap text-center">
                Status
              </th>
              <th className="p-3 text-gray-700 text-nowrap text-center">
                Exam Score
              </th>
              <th className="p-3 text-gray-700 text-nowrap text-center">
                Exam Result
              </th>
              <th className="p-3 text-gray-700 text-nowrap text-center rounded-tr-lg">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {loader ? (
              <tr className="text-gray-500 select-none">
                <td className="py-14 leading-[140px]" colSpan="100%">
                  <PageLoader />
                </td>
              </tr>
            ) : filteredEnrollments.length !== 0 ? (
              filteredEnrollments.map((item, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4 flex gap-3 items-center text-semibold text-gray-800 capitalize max-w-[500px] ">
                    <img
                      src={item?.course?.courseImage}
                      alt={item?.course?.title}
                      className="w-12 h-12 rounded-full"
                    />{" "}
                    {item?.course?.title}
                  </td>
                  <td className="py-2 px-4 text-semibold text-gray-800 text-center capitalize">
                    {item.course?.roleId?.roleName}
                  </td>
                  <td className="py-2 px-4 text-center">
                    {/* <div className="flex items-center justify-center px-4 py-1 rounded-full text-center border text-green-500 bg-[#E8FFEB] border-green-500"> */}
                    <span className="ml-1 capitalize">{item?.examLaval}</span>
                    {/* </div> */}
                  </td>
                  <td className="py-2 px-4">
                    <div className="flex items-center justify-center">
                      <button
                        className={`flex items-center justify-center px-4 py-1 rounded-full text-center border ${
                          item?.status === "pending"
                            ? "text-red-500 bg-[#ff6d6d33] border-red-500"
                            : "text-green-500 bg-[#E8FFEB] border-green-500"
                        }`}
                      >
                        {item?.status === "pending" ? (
                          <img
                            src="/assets/warning.svg"
                            alt="Pending"
                            className="w-5 h-5"
                          />
                        ) : (
                          <img
                            src="/assets/true.svg"
                            alt="Completed"
                            className="w-5 h-5"
                          />
                        )}
                        <span className="ml-1">{item?.status}</span>
                      </button>
                    </div>
                  </td>
                  <td className="p-2 flex items-center justify-center">
                    <div
                      className={`relative inline-block w-10 h-10 rounded-full ${
                        item.status === "completed"
                          ? item.Score >= 70
                            ? "bg-green-100"
                            : "bg-red-100"
                          : "bg-gray-200"
                      }`}
                    >
                      <div
                        className={`absolute inset-0 flex items-center justify-center text-xs font-semibold ${
                          item.status === "completed"
                            ? item.Score >= 70
                              ? "text-green-500"
                              : "text-red-500"
                            : "text-gray-500"
                        }`}
                      >
                        {item.Score ? `${item.Score}%` : "N/A"}
                      </div>
                      <div
                        className={`absolute inset-0 rounded-full border-2 border-solid ${
                          item.Score >= 70
                            ? "border-green-500"
                            : item.Score < 70 && item.Score > 0
                            ? "border-red-500"
                            : "border-gray-500"
                        }`}
                      />
                    </div>
                    {/* {item.theoryExamStatus === "completed" && (
                      <span className="ml-2">
                        {item.result >= 70 ? "Pass" : "Fail"}
                      </span>
                    )} */}
                  </td>

                  <td className="py-2 px-2 sm:px-6 text-nowrap">
                    <div className="flex items-center justify-center">
                      <button
                        className={`flex items-center justify-center px-4 py-1 rounded-full text-center border ${
                          item.result === "Fail"
                            ? "text-red-500 bg-[#ff6d6d33] border-red-500"
                            : "text-green-500 bg-[#E8FFEB] border-green-500"
                        }`}
                      >
                        {item.result === "Fail" ? (
                          <img
                            src="/assets/warning.svg"
                            alt="Pending"
                            className="w-5 h-5 mr-1"
                          />
                        ) : (
                          <img
                            src="/assets/true.svg"
                            alt="Completed"
                            className="w-5 h-5 mr-1"
                          />
                        )}
                        {item.result} Exam
                      </button>
                    </div>
                  </td>

                  <td className="py-2 px-4 text-semibold text-gray-800 text-center capitalize">
                    {item?.status === "pending" ? (
                      <img
                        src="/assets/viewbutton.svg"
                        alt="Disabled View"
                        className="opacity-50 cursor-not-allowed"
                      />
                    ) : (
                      <Link to={`/user/enroll-exam-score/${item?._id}`}>
                        <img src="/assets/viewbutton.svg" alt="View" />
                      </Link>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="100%"
                  className="py-20 text-center text-gray-500 max-sm:py-8"
                >
                  No data found!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={paginate}
        setCurrentPage={setCurrentPage}
      /> */}
    </>
  );
};

export default UserDashboard;
