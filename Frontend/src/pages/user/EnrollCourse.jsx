import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import PageLoader from "../../component/PageLoader";
import toast from "react-hot-toast";
import { axiosInstance, endPoints } from "../../api/axios";

const EnrollCourse = () => {
  const [role, setRole] = useState("");
  const [course, setCourse] = useState("");
  const [roles, setRoles] = useState([]);
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loader, setLoader] = useState(false);
  const navigation = useNavigate();

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        setLoader(true);
        const response = await axiosInstance.get(endPoints.roles.getAll);
        setLoader(false);
        setRoles(response.data.data);
      } catch (error) {
        setLoader(false);
        toast.error("Error fetching roles.", error);
      }
    };

    const fetchEnrolledCourses = async () => {
      try {
        setLoader(true);
        const response = await axiosInstance.get(
          endPoints.courseInfo.getAll,
          { withCredentials: true }
        );
        setLoader(false);
        setEnrolledCourses(response.data.data);
      } catch (error) {
        setLoader(false);
        toast.error("Error fetching enrolled courses:", error);
      }
    };

    fetchRoles();
    fetchEnrolledCourses();
  }, []);

  const fetchCoursesByRole = async (roleId) => {
    try {
      setLoader(true);
      const response = await axiosInstance.get(
        `${endPoints.courses.getByRole}/${roleId}`,
        { withCredentials: true }
      );
      setLoader(false);
      setCourses(response.data.data);
    } catch (error) {
      setLoader(false);
      toast.error("Error fetching courses:", error);
    }
  };

  const handleRoleChange = (e) => {
    const selectedRole = e.target.value;
    setRole(selectedRole);
    setCourse("");
    setFilteredCourses([]);

    if (selectedRole) {
      fetchCoursesByRole(selectedRole);
    } else {
      setCourses([]);
    }
  };

  const handleCourseChange = (e) => {
    const selectedCourse = e.target.value;
    setCourse(selectedCourse);
    if (role && selectedCourse) {
      setLoader(true);
      const filteredByRoleAndCourse = enrolledCourses.filter(
        (item) =>
          item.roleId?._id === role && item.courseId?._id === selectedCourse
      );
      setFilteredCourses(filteredByRoleAndCourse);
    } else {
      setLoader(false);
      setFilteredCourses([]);
    }
    setLoader(false);
  };

  const handleEnroll = async (course) => {
    try {
      const response = await axiosInstance.post(
        endPoints.enrollment.enroll,
        {
          role: course?.roleId?._id,
          course: course.courseId?._id,
          courseOverview: course?._id,
        },
        {
          withCredentials: true,
        }
      );

      if (response.status === 201) {
        toast.success("Enrollment Successfully.");
        navigation("enroll-course-info", { state: { selectedCourse: course } });
      }
    } catch (error) {
      toast.error(
        error.response?.data?.error || "Enrollment failed. Please try again."
      );
    }
  };

  return (
    <>
      <div>
        <div className="flex flex-col md:flex-row">
          <div className="mb-4 mr-3">
            <label htmlFor="role" className="block text-sm font-medium mb-1">
              Role<span className="text-[#E74C3C]">*</span>
            </label>
            <select
              id="role"
              className="min-w-[250px] border border-gray-300 rounded-lg px-3 py-2 outline-none"
              value={role}
              onChange={handleRoleChange}
            >
              <option disabled value="">
                Select Role
              </option>
              {roles.map((roleItem) => (
                <option
                  className="capitalize"
                  key={roleItem._id}
                  value={roleItem._id}
                >
                  {roleItem.roleName}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4 mr-3 flex-1">
            <label htmlFor="course" className="block text-sm font-medium mb-1">
              Course<span className="text-[#E74C3C]">*</span>
            </label>
            <select
              id="course"
              className="min-w-[250px] border border-gray-300 rounded-lg px-3 py-2 outline-none"
              value={course}
              onChange={handleCourseChange}
              disabled={!role}
            >
              <option disabled value="">
                Select Course
              </option>
              {courses.map((courseItem) => (
                <option
                  className="capitalize"
                  key={courseItem._id}
                  value={courseItem._id}
                >
                  {courseItem.courseType.length > 45
                    ? courseItem.courseType.slice(0, 45) + "..."
                    : courseItem.courseType}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loader ? (
        <div className="text-gray-500 select-none">
          <div className="text-center py-4 leading-[140px]" colSpan="100%">
            <PageLoader />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-4 max-sm:grid-cols-1 max-2xl:grid-cols-2 gap-6">
          {filteredCourses.length > 0 ? (
            filteredCourses.map((course) => (
              <div
                key={course._id}
                className="bg-white rounded-lg shadow-lg border border-gray-300 hover:shadow-xl transition-all duration-300"
              >
                <img
                  src={
                    course.courseImage || "https://via.placeholder.com/400x200"
                  }
                  alt={course.title}
                  className="w-full h-60 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 my-4">
                    {course.title}
                  </h3>
                  <p className="text-gray-600 mt-2 mb-4 line-clamp-3">
                    {course.overview}
                  </p>
                  <button
                    className=" py-2 px-4 rounded-lg transition-all duration-300 bg-[#e5f2ea] hover:bg-[#d9ece1] text-[#005151] font-semibold border border-[#278a8a]"
                    onClick={() => handleEnroll(course)}
                  >
                    Enroll
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-4 h-[35vh] flex flex-col justify-center items-center">
              <p className="text-gray-400 text-center text-3xl">
                Start Your Thrilling Adventure In
                <br />
                <span>
                  <span className="text-[#005151] font-bold">Learning</span>
                  <span className="text-gray-400">
                    {" "}
                    And <span className="text-[#005151] font-bold">Growth</span>
                    !
                  </span>
                </span>
              </p>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default EnrollCourse;
