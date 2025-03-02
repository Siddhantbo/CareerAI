import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useParams, useLocation } from 'react-router-dom'
import Select from 'react-select'
import makeAnimated from 'react-select/animated'
import { toast } from 'react-hot-toast'

import { useNavigate } from 'react-router-dom'
import Loader from '../../component/Loader'
import { axiosInstance, endPoints } from '../../api/axios'

const CandidateInformation = () => {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [selectedFileName, setSelectedFileName] = useState('')
  const { search } = useLocation()
  const params = new URLSearchParams(search)
  const candidateId = params.get('id')
  const [loader, setLoader] = useState(false);

  const user = JSON.parse(localStorage.getItem('user'))
  const formattedBirthDate = user.birth_Date ? user.birth_Date.split('T')[0] : '';
  const [previewProfile, setPreviewProfile] = useState(user.profilePhoto?.url || 'https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg');
  const [formData, setFormData] = useState({
    first_Name: user.first_Name || '',
    last_Name: user.last_Name || '',
    email: user.email || '',
    phoneNumber: '',
    gender: user.gender || '',
    birth_Date: formattedBirthDate || '',
    address: '',
    graduation: '',
    skill: [],
    file: null,
    profile: user.profilePhoto?.url || '',
    role: ''
  })

  const [roles, setRoles] = useState([])
  const [skills, setSkills] = useState([])
  const [errors, setErrors] = useState({})

  const animatedComponents = makeAnimated()

  useEffect(() => {
    fetchRolesAndSkills()
    if (candidateId) {
      setIsEdit(true)
      candidateInfoById()
    }
  }, [])

  function formatDate(dateInput) {
    const date = new Date(dateInput)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const candidateInfoById = async () => {
    try {
      const response = await axiosInstance.get(
        `${endPoints.candidates.getById
        }/${candidateId}`
      )
      const user = response.data.data
      const formatDated = formatDate(user.birth_Date)
      setPreviewProfile(user.profile)
      setSelectedFileName(user.file)

      setFormData({
        first_Name: user.first_Name,
        last_Name: user.last_Name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        gender: user.gender,
        birth_Date: formatDated,
        address: user.address,
        graduation: user.graduation,
        skill: user.skill,
        file: user.file,
        profile: user.profile,
        role: user.role
      })
    } catch (error) {
      toast.error('Error fetching data:', error)
    }
  }

  const fetchRolesAndSkills = async () => {
    try {
      const rolesResponse = await axiosInstance.get(
        `${endPoints.roles.getAll}`
      )
      setRoles(rolesResponse.data.data)
      const skillsResponse = await axiosInstance.get(
        endPoints.skills.getAll
      )
      const fetchedSkills = skillsResponse.data.skills.map(skill => ({
        value: skill.title,
        label: skill.title
      }))
      setSkills(fetchedSkills)
    } catch (error) {
      toast.error('Failed to load roles and skills')
    }
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.first_Name) newErrors.first_Name = 'First name is required'
    if (!formData.last_Name) newErrors.last_Name = 'Last name is required'
    if (!formData.email) newErrors.email = 'Email is required'
    if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = 'Invalid email format'
    if (!formData.phoneNumber)
      newErrors.phoneNumber = 'Phone number is required'
    if (!formData.gender) newErrors.gender = 'Gender is required'
    if (!formData.birth_Date) newErrors.birth_Date = 'Date of birth is required'
    if (!formData.address) newErrors.address = 'Address is required'
    if (!formData.graduation) newErrors.graduation = 'Graduation is required'
    if (!formData.role) newErrors.role = 'Role is required'
    if (formData.skill.length === 0)
      newErrors.skill = 'At least one skill is required'
    if (!formData.file) newErrors.file = 'Resume is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }


  const handleChange = e => {
    const { name, value, type, files } = e.target;

    if (type === 'file') {
      const file = files[0];
      if (!file) return;

      if (name === "file" && file.size > 10 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          file: "Please upload a file smaller than 10MB"
        }));
        return;
      } else {
        setErrors(prev => ({
          ...prev,
          file: undefined
        }));
      }

      if (name === "profile") {
        if (!file.type.startsWith("image/")) {
          setErrors(prev => ({
            ...prev,
            profile: "Please upload an image file"
          }));
          return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewProfile(reader.result);
        };
        reader.readAsDataURL(file);
      } else if (name === "file") {
        if (file.type !== "application/pdf") {
          setErrors(prev => ({
            ...prev,
            file: "Please upload a PDF file"
          }));
          return;
        }
        setSelectedFileName(file.name);
      }

      setFormData(prev => ({
        ...prev,
        [name]: file
      }));
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };



  const handleSkillsChange = selectedOptions => {
    setFormData(prev => ({
      ...prev,
      skill: selectedOptions.map(option => option.value)
    }))
    setErrors(prev => ({
      ...prev,
      skill: undefined
    }))
  }

  const handleSubmit = async e => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error('Please fill in all required fields correctly')

      return
    }

    setIsSubmitting(true)
    const formDataToSend = new FormData()
    Object.keys(formData).forEach(key => {
      if (key !== 'file' && key !== 'profile' && key !== 'skill') {
        formDataToSend.append(key, formData[key])
      }
    })

    formDataToSend.append('skill', JSON.stringify(formData.skill))
    if (formData.profile) {
      formDataToSend.append('profile', formData.profile)
    }
    if (formData.file) {
      formDataToSend.append('file', formData.file)
    }

    try {
      setLoader(true)
      const url = isEdit
        ? `${endPoints.candidates.update}/${candidateId}`
        : endPoints.candidates.create

      const method = isEdit ? 'put' : 'post'

      await axiosInstance({
        method,
        url,
        data: formDataToSend,
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      toast.success(
        `Information ${isEdit ? 'updated' : 'submitted'} successfully!`
      )
      navigate('/user/schedule-interview')
      toast.success("")
    } catch (error) {
      console.error('Upload failed:', error)
      toast.error(
        error.response?.data?.message || 'Failed to submit information'
      )
    } finally {
      setIsSubmitting(false)
      setLoader(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 p-4 sm:p-6 mx-auto bg-white shadow-lg rounded-lg"
    >
      <h1 className="text-3xl font-bold text-[#005151] relative mb-8">
        {isEdit ? "Edit Candidate Information" : "Candidate Information"}
        <span className="absolute bottom-[-8px] left-0 w-[130px] h-[2px] bg-[#005151]"></span>
      </h1>

      <div className="grid grid-cols-12 gap-4 items-center">
        {/* Profile Photo */}
        <div className="col-span-12 sm:col-span-3 flex flex-col items-center">
          <div className="relative w-[160px] h-[160px] rounded-xl bg-gray-200 flex items-center justify-center overflow-hidden group">
            <label
              htmlFor="uploadProfile"
              className="cursor-pointer w-full h-full relative"
            >
              {previewProfile ? (
                <img
                  src={previewProfile}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-10 h-10 text-gray-500 absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 16.5v-4.5m0 0V7.5m0 4.5H7.5m4.5 0h4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              )}

              <input
                type="file"
                id="uploadProfile"
                onChange={handleChange}
                name="profile"
                className="hidden"
                accept=".png,.jpeg,.jpg"
                disabled={previewProfile ? true : false}
              />
            </label>
          </div>

          {errors.profile && (
            <span className="text-red-500 text-sm mt-1">{errors.profile}</span>
          )}
        </div>

        {/* Form Fields */}
        <div className="col-span-12 sm:col-span-9 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label
              htmlFor="first_Name"
              className="block text-sm font-medium text-gray-700 mb-"
            >
              First Name
            </label>
            <input
              type="text"
              name="first_Name"
              value={formData.first_Name}
              onChange={handleChange}
              placeholder="Enter first name"
              className={`input border ${errors.first_Name ? "border-red-500" : "border-gray-300"
                } w-full bg-gray-200  rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#4DC3AB]`}
              disabled
            />
            {errors.first_Name && (
              <span className="text-red-500 text-sm">{errors.first_Name}</span>
            )}
          </div>

          <div>
            <label
              htmlFor="last_name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Last Name
            </label>
            <input
              type="text"
              name="last_Name"
              value={formData.last_Name}
              onChange={handleChange}
              placeholder="Enter last name"
              className={`input border ${errors.last_Name ? "border-red-500" : "border-gray-300"
                } w-full bg-gray-200  rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#4DC3AB]`}
              disabled
            />
            {errors.last_name && (
              <span className="text-red-500 text-sm">{errors.last_Name}</span>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
              className={`input border ${errors.email ? "border-red-500" : "border-gray-300"
                } w-full bg-gray-200  rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#4DC3AB]`}
              disabled
            />
            {errors.email && (
              <span className="text-red-500 text-sm">{errors.email}</span>
            )}
          </div>

          {/* <div>
            <label
              htmlFor="gender"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Gender
            </label>
            <input
              type="text"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className={`input border ${
                errors.gender ? "border-red-500" : "border-gray-300"
              } w-full  rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#4DC3AB]`}
              
            />
            {errors.gender && (
              <span className="text-red-500 text-sm">{errors.gender}</span>
            )}
          </div> */}
          <div className="flex flex-col w-full mb-4 pt-1">
            <label className="mb-1 text-gray-500">Gender</label>
            <div className="relative">
              <select
                name="gender" // This is critical for handleChange to work correctly
                value={formData.gender}
                onChange={handleChange}
                className={`input border ${errors.gender ? "border-red-500" : "border-gray-300"
                  } w-full rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#4DC3AB]`}
                style={{ height: "42px" }}
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {errors.gender && (
                <span className="text-red-500 text-sm">{errors.gender}</span>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="birth_Date"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Date of Birth
            </label>
            <input
              type="date"
              name="birth_Date"
              value={formData.birth_Date}
              onChange={handleChange}
              className={`input border ${errors.birth_Date ? "border-red-500" : "border-gray-300"
                } w-full  rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#4DC3AB]`}

            />
            {errors.birth_Date && (
              <span className="text-red-500 text-sm">{errors.birth_Date}</span>
            )}
          </div>
          <div>
            <label
              htmlFor="phoneNumber"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Enter phone number"
              className={`input border ${errors.phoneNumber ? "border-red-500" : "border-gray-300"
                } w-full rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#4DC3AB]`}
            />
            {errors.phoneNumber && (
              <span className="text-red-500 text-sm">{errors.phoneNumber}</span>
            )}
          </div>
        </div>
      </div>

      {/* Address */}
      <div>
        <label
          htmlFor="address"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Address <span className="text-red-500">*</span>
        </label>
        <textarea
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Enter your address"
          className={`input border ${errors.address ? "border-red-500" : "border-gray-300"
            } w-full rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#4DC3AB]`}
          rows="4"
        />
        {errors.address && (
          <span className="text-red-500 text-sm">{errors.address}</span>
        )}
      </div>

      {/* Skills, Graduation, Role */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <label
            htmlFor="graduation"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Graduation <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="graduation"
            value={formData.graduation}
            onChange={handleChange}
            placeholder="Enter graduation"
            className={`input border ${errors.graduation ? "border-red-500" : "border-gray-300"
              } w-full rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#4DC3AB]`}
          />
          {errors.graduation && (
            <span className="text-red-500 text-sm">{errors.graduation}</span>
          )}
        </div>

        <div>
          <label
            htmlFor="role"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Role <span className="text-red-500">*</span>
          </label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className={`input border ${errors.role ? "border-red-500" : "border-gray-300"
              } w-full rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#4DC3AB]`}
          >
            <option value="">Select Role</option>
            {roles.map((roleItem) => (
              <option key={roleItem._id} value={roleItem.roleName}>
                {roleItem.roleName}
              </option>
            ))}
          </select>
          {errors.role && (
            <span className="text-red-500 text-sm">{errors.role}</span>
          )}
        </div>
        <div>
          <label
            htmlFor="file"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Upload Resume <span className="text-red-500">*</span>
          </label>
          <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-2 text-center overflow-hidden">
            <input
              type="file"
              name="file"
              onChange={handleChange}
              accept="application/pdf"
              className="hidden"
              id="fileInput"
            />
            <label
              htmlFor="fileInput"
              className="cursor-pointer w-full h-full flex flex-col items-center justify-center"
            >
              <span className="text-gray-500 text-sm min-w-[200px] inline-block">
                {selectedFileName ? (
                  <span className="font-bold text-[#005151] ">
                    {selectedFileName}
                  </span>
                ) : (
                  "Upload your resume here.."
                )}
              </span>
            </label>
          </div>
          {errors.file && (
            <span className="text-red-500 text-sm">{errors.file}</span>
          )}

        </div>
        <div>
          <label
            htmlFor="skills"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Skills <span className="text-red-500">*</span>
          </label>
          <Select
            closeMenuOnSelect={false}
            components={animatedComponents}
            isMulti
            options={skills}
            onChange={handleSkillsChange}
            value={formData.skill.map((skill) => ({
              value: skill,
              label: skill,
            }))}
            className={errors.skill ? "select-error" : ""}
          />
          {errors.skill && (
            <span className="text-red-500 text-sm">{errors.skill}</span>
          )}
        </div>
      </div>
      <div className="flex justify-center sm:justify-end space-x-4">
        <button
          type="submit"
          disabled={isSubmitting || loader}
          className={`bg-[#e5f2ea] hover:bg-[#d9ece1] text-[#005151] font-semibold border border-[#278a8a] py-2 px-6 rounded-lg transition-all ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
        >
          {loader ? (
            <Loader />
          ) : isSubmitting ? (
            "Processing..."
          ) : isEdit ? (
            "Update Information"
          ) : (
            "Schedule Interview"
          )}
        </button>
      </div>
    </form>
  );
}

export default CandidateInformation
