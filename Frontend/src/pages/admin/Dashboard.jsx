import React, { useEffect, useState } from "react";
import axios from "axios";
import PageLoader from "../../component/PageLoader";
import toast from "react-hot-toast";
import { axiosInstance, endPoints } from "../../api/axios";

const Dashboard = () => {
  const [roleCount, setRoleCount] = useState(0);
  const [recruiterCount, setRecruiterCount] = useState(0);
  const [courseCount, setCourseCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [recentRecruiters, setRecentRecruiters] = useState([]);
  const [recentRoles, setRecentRoles] = useState([]);
  const [courseInfo, setCourseInfo] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loader, setLoader] = useState(false);
  const [searchRecruiterTerm, setSearchRecruiterTerm] = useState("");
  const [searchCourseTerm, setSearchCourseTerm] = useState("");

  const cardData = [
    {
      id: "rolecount",
      title: "Role Count",
      count: roleCount,
      image: "/assets/role.png",
      iconBg: "bg-gray-900",
    },
    {
      id: "recruitercount",
      title: "Recruiter Count",
      count: recruiterCount,
      image: "/assets/recruiter.png",
      iconBg: "bg-blue-500",
    },
    {
      id: "coursecount",
      title: "Course Count",
      count: courseCount,
      image: "/assets/course.png",
      iconBg: "bg-green-500",
    },
    {
      id: "usercount",
      title: "User Count",
      count: userCount,
      image: "/assets/usericon.png",
      iconBg: "bg-pink-500",
    },
  ];

  useEffect(() => {
    const fetchRoleCount = async () => {
      try {
        const response = await axiosInstance.get(
          `${endPoints.roles.getAll}`
        );
        const roles = response.data.data || [];
        setRoleCount(roles.length);
        setRecentRoles(roles.slice(-5));
      } catch (error) {
        toast.error("Error fetching roles:", error);
      }
    };

    const fetchRecruiterCount = async () => {
      try {
        setLoader(true);
        const response = await axiosInstance.get(endPoints.recruiters.getAll);
        setLoader(false);
        setRecruiterCount(response.data.count);
        setRecentRecruiters(response.data.data.slice(-6));
      } catch (error) {
        toast.error("Error fetching recruiters:", error);
        setLoader(false);
      }
    };

    const fetchCourseCount = async () => {
      try {
        setLoader(true);
        const response = await axiosInstance.get(
          endPoints.courses.getAll
        );
        setLoader(false);
        setCourseCount(response.data.count);
        setCourseInfo(response.data.data);
      } catch (error) {
        toast.error("Error fetching courses:", error);
        setLoader(false);
      }
    };
    const fetchUserCount = async () => {
      try {
        setLoader(true);
        const response = await axiosInstance.get(endPoints.auth.getAllUsers,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setLoader(false);
        setUserCount(response.data.count);
      } catch (error) {
        setLoader(false);
        toast.error("Error fetching user count:", error);
      }
    };
    const fetchCourseInfo = async () => {
      try {
        const response = await axiosInstance.get(
          endPoints.courses.getAll
        );
        setCourseInfo(response.data.data.slice(-6));
      } catch (error) {
        toast.error("Error fetching course information:", error);
      }
    };
    const fetchSkills = async () => {
      try {
        const response = await axiosInstance.get(
          endPoints.skills.getAll
        );
        setSkills(response.data.skills.slice(-5));
      } catch (error) {
        toast.error("Error fetching skills:", error);
      }
    };

    fetchRoleCount();
    fetchRecruiterCount();
    fetchCourseCount();
    fetchUserCount();
    fetchCourseInfo();
    fetchSkills();
  }, []);

  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  return (
    <div className="flex">
      <main className="flex-1">
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-14 lg:gap-4 mt-10">
            {cardData.map((card, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md p-6 relative border h-[115px]"
              >
                <div className="flex items-center justify-between space-x-4">
                  <div
                    className={`w-[60px] h-[60px] rounded-[15px] flex items-center justify-center absolute top-0 translate-x-0 translate-y-[-50%] shadow-md ${card.iconBg}`}
                  >
                    <img
                      src={card.image}
                      alt={card.title}
                      className="w-8 h-8"
                    />
                  </div>
                </div>

                <div className="flex flex-col justify-end items-end">
                  <p className="text-[16px] text-gray-500">{card.title}</p>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {!!card.count ? card.count : 0}
                  </h3>
                </div>
                <div className={`mt-6 pt-[3px] ${card.iconBg}`}></div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-8 w-full gap-4 h-full max-xl:grid-cols-6 max-2xl:grid-cols-6 mt-[20px] max-4xl:grid-cols-8">
            <div className="col-span-6 max-md:col-span-12 max-lg:col-span-12 rounded-lg max-xl:col-span-12 max-2xl:col-span-4">
              <div className="bg-white p-4 rounded-[15px] shadow-md h-[310px] border overflow-hidden">
                <div className="flex justify-between flex-col md:flex-row max-sm:mb-2">
                  <h3 className="text-xl font-bold text-[#005151] relative mb-6 text-center sm:text-left">
                    Recent Recruiter List
                    <span className="absolute bottom-[-8px] left-1/2 sm:left-0 transform -translate-x-1/2 sm:translate-x-0 w-[100px] h-[2px] bg-[#005151]"></span>
                  </h3>

                  <div className="relative w-full sm:w-auto">
                    <input
                      type="text"
                      placeholder="Search Recruiter..."
                      className="w-full sm:w-[300px] border rounded py-2 px-4 shadow-sm focus:ring focus:ring-[#4DC3AB] focus:outline-none pl-10"
                      value={searchRecruiterTerm}
                      onChange={(e) => setSearchRecruiterTerm(e.target.value)}
                    />
                    <img
                      src="/assets/search-Bordere.svg"
                      alt="Search Icon"
                      className="absolute left-3 top-2.5 w-5 h-5"
                    />
                  </div>
                </div>
                <div className="pb-4 overflow-y-auto max-h-[225px] max-sm:overflow-y-auto max-sm:overflow-x-auto rounded-lg border">
                  <table className="w-full bg-white">
                    <thead className="bg-gray-200 w-full sticky top-0 z-10">
                      <tr className="capitalize font-semibold">
                        <th className="p-3  text-gray-700 text-left rounded-tl-lg">
                          Profile
                        </th>
                        <th className="p-3 text-gray-700 text-left text-nowrap">
                          Date of Birth
                        </th>
                        <th className="p-3 text-gray-700 text-left">Gender</th>
                        <th className="p-3 text-gray-700 text-left">Date</th>
                        <th className="p-3 text-gray-700 text-left rounded-tr-lg">
                          Email
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {loader ? (
                        <tr className="text-gray-500 select-none">
                          <td
                            className="text-center py-4 leading-[140px]"
                            colSpan="100%"
                          >
                            <PageLoader />
                          </td>
                        </tr>
                      ) : recentRecruiters.length !== 0 ? (
                        recentRecruiters.filter(
                          (recruiter) =>
                            `${recruiter.first_Name || ""} ${
                              recruiter.last_Name || ""
                            }`
                              .toLowerCase()
                              .includes(searchRecruiterTerm.toLowerCase()) ||
                            new Date(recruiter.birth_Date)
                              .toLocaleDateString()
                              .includes(searchRecruiterTerm) ||
                            recruiter.gender
                              .toLowerCase()
                              .includes(searchRecruiterTerm.toLowerCase()) ||
                            new Date(recruiter.createdAt)
                              .toLocaleDateString()
                              .includes(searchRecruiterTerm) ||
                            recruiter.email
                              .toLowerCase()
                              .includes(searchRecruiterTerm.toLowerCase())
                        ).length > 0 ? (
                          recentRecruiters
                            .filter(
                              (recruiter) =>
                                `${recruiter.first_Name || ""} ${
                                  recruiter.last_Name || ""
                                }`
                                  .toLowerCase()
                                  .includes(
                                    searchRecruiterTerm.toLowerCase()
                                  ) ||
                                new Date(recruiter.birth_Date)
                                  .toLocaleDateString()
                                  .includes(searchRecruiterTerm) ||
                                recruiter.gender
                                  .toLowerCase()
                                  .includes(
                                    searchRecruiterTerm.toLowerCase()
                                  ) ||
                                new Date(recruiter.createdAt)
                                  .toLocaleDateString()
                                  .includes(searchRecruiterTerm) ||
                                recruiter.email
                                  .toLowerCase()
                                  .includes(searchRecruiterTerm.toLowerCase())
                            )
                            .map((recruiter, index) => (
                              <tr
                                key={index}
                                className="border-b hover:bg-gray-50"
                              >
                                <td className="py-2 text-semibold text-gray-800 min-w-[200px]">
                                  <div className="flex items-center justify-start py-2 px-4 capitalize">
                                    <img
                                      src={
                                        recruiter.userPhoto?.url || "profile"
                                      }
                                      alt="Profile"
                                      className="rounded-full mr-2 w-8 h-8"
                                    />
                                    <span className="text-semibold leading-[24px] capitalize">
                                      {`${recruiter.first_Name} ${recruiter.last_Name}`}
                                    </span>
                                  </div>
                                </td>
                                <td className="py-2 px-4 text-semibold text-gray-800 ">
                                  {new Date(
                                    recruiter.birth_Date
                                  ).toLocaleDateString()}
                                </td>
                                <td className="py-2 px-4 text-semibold text-gray-800 capitalize">
                                  {recruiter.gender}
                                </td>
                                <td className="py-2 px-4 text-semibold text-gray-800 ">
                                  {new Date(
                                    recruiter.createdAt
                                  ).toLocaleDateString()}
                                </td>
                                <td className="py-2 px-4 text-semibold text-gray-800">
                                  {recruiter.email}
                                </td>
                              </tr>
                            ))
                        ) : (
                          <tr>
                            <td
                              colSpan="100%" // Ensure this matches the total number of columns
                              className="py-20 text-center text-gray-500"
                            >
                              No data found!
                            </td>
                          </tr>
                        )
                      ) : (
                        <tr>
                          <td
                            colSpan="100%" // Ensure this matches the total number of columns
                            className="py-20 text-center text-gray-500"
                          >
                            No data found!
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="col-span-2 max-sm:col-span-12 max-md:col-span-12 max-xl:col-span-12">
              <div className="bg-white p-6 md:p-[20px] rounded-[15px] shadow-md h-[310px] border">
                <div className="flex flex-col justify-center items-center ">
                  <h3 className="text-lg md:text-xl font-bold text-[#005151] relative mb-4 md:mb-8">
                    Recent Role List
                    <span className="absolute bottom-[-8px] left-1/2 transform -translate-x-1/2 w-[50px] md:w-[60px] h-[2px] bg-[#005151]"></span>
                  </h3>
                </div>
                <ul className="max-h-[250px] overflow-y-auto pr-[8px]">
                  {loader ? (
                    <li className="text-center py-4">
                      <div className="flex justify-center items-center">
                        <PageLoader />
                      </div>
                    </li>
                  ) : recentRoles.length > 0 ? (
                    recentRoles.map((role, index) => (
                      <li
                        key={index}
                        className="text-nowrap py-2 px-2 md:px-4 border-b truncate"
                      >
                        {role.roleName}
                      </li>
                    ))
                  ) : (
                    <li className="text-center py-4 text-gray-500">
                      No roles found.
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-8 w-full gap-4 h-full max-xl:grid-cols-6 max-2xl:grid-cols-6 mt-[20px] max-4xl:grid-cols-8">
            <div className="col-span-6 max-md:col-span-12 max-lg:col-span-12 rounded-lg max-xl:col-span-12 max-2xl:col-span-4">
              <div className="bg-white p-4 rounded-[15px] shadow-md border">
                <div className="flex flex-col md:flex-row justify-between items-center mb-2">
                  <div className="mb-2">
                    <h3 className="text-xl font-bold text-[#005151] relative mb-4 md:mb-0 text-center md:text-left">
                      Recent Course List
                      <span className="absolute bottom-[-8px] left-1/2 md:left-0 transform -translate-x-1/2 md:translate-x-0 w-[100px] h-[2px] bg-[#005151]"></span>
                    </h3>
                  </div>

                  <div className="relative w-full sm:w-auto">
                    <input
                      type="text"
                      placeholder="Search Course..."
                      className="w-full sm:w-[300px] border rounded py-2 px-4 shadow-sm focus:ring focus:ring-[#4DC3AB] focus:outline-none pl-10"
                      value={searchCourseTerm}
                      onChange={(e) => setSearchCourseTerm(e.target.value)}
                    />
                    <img
                      src="/assets/search-Bordere.svg"
                      alt="Search Icon"
                      className="absolute left-3 top-2.5 w-5 h-5"
                    />
                  </div>
                </div>
                <div className="overflow-y-auto max-h-[230px] max-sm:overflow-y-auto max-sm:overflow-x-auto rounded-lg border">
                  <table className="w-full bg-white rounded-lg">
                    <thead className="bg-gray-200 w-full sticky top-0 z-10">
                      <tr className="capitalize font-semibold">
                        <th className="p-3  text-gray-700 text-left rounded-tl-lg">
                          Course Title
                        </th>
                        <th className="p-3 text-gray-700  text-nowrap">
                          Course information
                        </th>
                        {/* <th className="p-3 text-gray-700 text-left">
                          information List
                        </th> */}
                      </tr>
                    </thead>
                    <tbody>
                      {loader ? (
                        <tr className="text-gray-500 select-none">
                          <td
                            className="text-center py-4 leading-[140px]"
                            colSpan="100%"
                          >
                            <PageLoader />
                          </td>
                        </tr>
                      ) : courseInfo.length !== 0 ? (
                        courseInfo.filter((course) =>
                          (course.title || "")
                            .toLowerCase()
                            .includes(searchCourseTerm.toLowerCase())
                        ).length > 0 ? (
                          courseInfo
                            .filter((course) =>
                              (course.title || "")
                                .toLowerCase()
                                .includes(searchCourseTerm.toLowerCase())
                            )
                            .map((course, index) => (
                              <tr
                                key={index}
                                className="border-b hover:bg-gray-50"
                              >
                                <td className="py-2 px-4 text-semibold text-gray-800 min-w-[250px] flex items-center gap-3">
                                  {/* <img
                                    src={course.courseImage}
                                    alt={course.title}
                                    className="w-10 h-10 rounded-full object-cover"
                                  /> */}
                                  {course?.courseType}
                                </td>
                                <td className="py-2 px-4 text-semibold text-gray-800 text-center">
                                  {course.roleId
                                    ? course.roleId.roleName
                                    : "Loading..."}
                                </td>
                                {/* <td className="py-2 px-4 text-semibold text-gray-800 min-w-[300px]">
                                  {course.title}
                                </td> */}
                              </tr>
                            ))
                        ) : (
                          <tr>
                            <td
                              colSpan="100%" // Ensure this matches the total number of columns
                              className="py-20 text-center text-gray-500"
                            >
                              No data found!
                            </td>
                          </tr>
                        )
                      ) : (
                        <tr>
                          <td
                            colSpan="100%" // Ensure this matches the total number of columns
                            className="py-20 text-center text-gray-500"
                          >
                            No data found!
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="col-span-2 max-sm:col-span-12 max-md:col-span-12 max-xl:col-span-12">
              <div className="bg-white p-[20px] rounded-[15px] shadow-md h-full border">
                <div className="flex flex-col justify-center items-center">
                  <h3 className="text-xl font-bold text-[#005151] relative mb-8">
                    Recent Skills
                    <span className="absolute bottom-[-8px] left-1/2 transform -translate-x-1/2 w-[50px] md:w-[60px] h-[2px] bg-[#005151]"></span>
                  </h3>
                </div>
                <ul className="max-h-[210px] overflow-y-auto pr-[8px]">
                  {loader ? (
                    <li className="text-center py-4">
                      <div className="py-14 flex justify-center items-center">
                        <PageLoader />
                      </div>
                    </li>
                  ) : (
                    skills.map((skill, index) => (
                      <li
                        key={index}
                        className="py-[8px] px-[12px] text-black font-normal border-b last:border-0"
                      >
                        {skill.title}
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
