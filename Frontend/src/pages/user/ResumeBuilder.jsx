import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SkillSection from "../../component/SkillSection";
import Section from "../../component/ResumeBuilderSection";
import Loader from "../../component/Loader";

const ResumeBuilder = () => {
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    location: "",
    gender: "",
    profile_photo: null,
    dateOfBirth: "",
    phone: "",
    email: "",
    website: "",
    objective: "",
    workExperience: [
      {
        company: "",
        jobTitle: "",
        startDate: "",
        endDate: "",
        location: "",
        description: ""
      }
    ],
    education: [
      {
        school: "",
        startDate: "",
        endDate: "",
        degree: "",
        cgpa: "",
        additionalInfo: "",
        location: ""
      }
    ],
    certificates: [{ name: "", location: "", startDate: "", endDate: "" }],
    projects: [{ projectName: "", date: "", description: "", url: "" }],
    languages: [{ name: "" }],
    interests: [{ name: "" }],
    skills: [{ name: "" }],
    featuredSkills: [{ name: "" }]
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file" && files[0]) {
      const file = files[0];
      setFormData((prev) => ({ ...prev, profile_photo: file }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleArrayChange = (index, field, section, value) => {
    setFormData((prev) => {
      const updatedArray = [...(prev[section] || [])];
      updatedArray[index] = { ...updatedArray[index], [field]: value };
      return { ...prev, [section]: updatedArray };
    });
  };

  const addSectionItem = (section, newItem) => {
    setFormData((prev) => ({
      ...prev,
      [section]: [...prev[section], newItem]
    }));
  };

  const removeSectionItem = (section, index) => {
    const updatedArray = formData[section].filter((_, idx) => idx !== index);
    setFormData((prev) => ({ ...prev, [section]: updatedArray }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required.";
    if (!formData.role.trim()) newErrors.role = "Role is required.";
    if (!formData.location.trim()) newErrors.location = "Location is required.";
    if (!formData.gender.trim()) newErrors.gender = "Gender is required.";
    if (!formData.phone.trim() || !/^[6-9]\d{9}$/.test(formData.phone))
      newErrors.phone =
        "Phone number must start with 6, 7, 8, or 9 and be 10 digits long.";
    if (
      !formData.email.trim() ||
      !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)
    )
      newErrors.email = "Valid email is required.";
    if (
      !formData.website.trim() ||
      !/^https?:\/\/[\w\-]+(\.[\w\-]+)+[/#?]?.*$/.test(formData.website)
    )
      newErrors.website = "Valid website URL is required.";
    if (!formData.objective.trim())
      newErrors.objective = "Objective is required.";

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    setErrors(validationErrors);
    setLoader(true);
    if (Object.keys(validationErrors).length === 0) {
      const filteredFormData = Object.fromEntries(
        Object.entries(formData).map(([key, value]) => {
          if (Array.isArray(value)) {
            return [
              key,
              value.filter((item) =>
                Object.values(item).some((field) => field && field.trim?.())
              )
            ];
          }
          return [key, value];
        })
      );

      navigate("/user/select-resume", {
        state: { formData: filteredFormData }
      });
    }
    setLoader(false);
  };

  return (
    <form
      className="p-6 mx-auto space-y-3 bg-white shadow-lg rounded-lg"
      onSubmit={handleSubmit}
    >
      <h1 className="text-3xl font-bold text-[#005151] relative mb-8">
        Resume Builder
        <span className="absolute bottom-[-8px] left-0 w-[100px] h-[2px] bg-[#005151]"></span>
      </h1>

      {/* Form Fields */}
      <div className=" items-start block md:flex gap-10">
        <div className="relative w-[160px] h-[160px] max-sm:w-[160px] max-md:w-[160px] max-lg:w-[200px] max-2xl:w-[250px] max-xl:w-[180px] 3xl:w-[180px] rounded-xl bg-gray-200 flex items-center justify-center  group">
          <label
            htmlFor="uploadProfile"
            className="cursor-pointer w-full h-full relative"
          >
            {formData.profile_photo ? (
              <img
                src={URL.createObjectURL(
                  formData.profile_photo ||
                    "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg"
                )}
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
                className="w-10 h-10 text-gray-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 16.5v-4.5m0 0V7.5m0 4.5H7.5m4.5 0h4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            )}

            {/* Hover Effect */}
            <label
              htmlFor="profile_photo"
              className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 rounded-xl transition-opacity duration-300 cursor-pointer"
            >
              <span className="text-white text-xl">Upload Photo</span>
            </label>

            {/* Hidden File Input */}
            <input
              id="profile_photo"
              type="file"
              name="profile_photo"
              className="hidden"
              accept=".png,.jpeg,.jpg"
              onChange={handleChange}
            />
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6 max-">
          <div>
            <label htmlFor="">
              Full Name<span className="text-red-600">*</span>
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name (e.g., John Doe)"
              className="input border border-gray-300 w-full rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#4DC3AB] truncate"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}
          </div>
          <div>
            <label htmlFor="">
              Role<span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              name="role"
              value={formData.role}
              onChange={handleChange}
              placeholder="Enter your role (e.g., Frontend Developer)"
              className="input border border-gray-300 w-full rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#4DC3AB] truncate"
            />
            {errors.role && (
              <p className="text-red-500 text-sm">{errors.role}</p>
            )}
          </div>
          <div>
            <label htmlFor="">
              Location<span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Enter your location (e.g., New York, USA)"
              className="input border border-gray-300 w-full rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#4DC3AB] truncate"
            />
            {errors.location && (
              <p className="text-red-500 text-sm">{errors.location}</p>
            )}
          </div>
          <div>
            <label htmlFor="">
              Phone Number<span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={(e) => {
                const { value } = e.target;
                if (/^\d{0,10}$/.test(value)) {
                  handleChange(e);
                }
              }}
              placeholder="Enter your phone number"
              className="input border border-gray-300 w-full rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#4DC3AB] truncate"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm">{errors.phone}</p>
            )}
          </div>
          <div>
            <label htmlFor="">
              Email<span className="text-red-600">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email address"
              className="input border border-gray-300 w-full rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#4DC3AB] truncate"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>
          {/* gender */}
          <div>
            <label htmlFor="gender">
              Gender<span className="text-red-600">*</span>
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="input border border-gray-300 w-full rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#4DC3AB]"
            >
              <option value="">Select your gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            {errors.gender && (
              <p className="text-red-500 text-sm">{errors.gender}</p>
            )}
          </div>
          <div>
            <label htmlFor="">
              URL<span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="Enter your website (e.g., LinkedIn URL)"
              className="input border border-gray-300 w-full rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#4DC3AB] truncate"
            />
            {errors.website && (
              <p className="text-red-500 text-sm">{errors.website}</p>
            )}
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="">
          Objective<span className="text-red-600">*</span>
        </label>
        <textarea
          name="objective"
          value={formData.objective}
          onChange={handleChange}
          rows={4}
          placeholder="Enter your objective"
          className="input border border-gray-300 w-full rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#4DC3AB] overflow-y-auto box-border scroll-py-10"
        />
        {errors.objective && (
          <p className="text-red-500 text-sm">{errors.objective}</p>
        )}
      </div>

      {/* Work Experience, Education, Certificates, Projects */}
      <Section
        title="Work Experience"
        sectionKey="workExperience"
        items={formData.workExperience}
        fields={[
          "company",
          "jobTitle",
          "startDate",
          "endDate",
          "location",
          "description"
        ]}
        handleArrayChange={handleArrayChange}
        addSectionItem={() =>
          addSectionItem("workExperience", {
            company: "",
            jobTitle: "",
            startDate: "",
            endDate: "",
            location: "",
            description: ""
          })
        }
        removeSectionItem={(index) =>
          removeSectionItem("workExperience", index)
        }
      />

      <Section
        title="Education"
        sectionKey="education"
        items={formData.education}
        fields={[
          "school",
          "degree",
          "startDate",
          "endDate",
          "cgpa",
          "additionalInfo",
          "location"
        ]}
        handleArrayChange={handleArrayChange}
        addSectionItem={() =>
          addSectionItem("education", {
            school: "",
            startDate: "",
            endDate: "",
            degree: "",
            cgpa: "",
            additionalInfo: "",
            location: ""
          })
        }
        removeSectionItem={(index) => removeSectionItem("education", index)}
      />

      <Section
        title="Certificates"
        sectionKey="certificates"
        items={formData.certificates}
        fields={["name", "location", "startDate", "endDate"]}
        handleArrayChange={handleArrayChange}
        addSectionItem={() =>
          addSectionItem("certificates", {
            name: "",
            location: "",
            startDate: "",
            endDate: ""
          })
        }
        removeSectionItem={(index) => removeSectionItem("certificates", index)}
      />

      <Section
        title="Projects"
        sectionKey="projects"
        items={formData.projects}
        fields={["projectName", "date", "description", "url"]}
        handleArrayChange={handleArrayChange}
        addSectionItem={() =>
          addSectionItem("projects", {
            projectName: "",
            date: "",
            description: "",
            url: ""
          })
        }
        removeSectionItem={(index) => removeSectionItem("projects", index)}
      />

      {/* Languages */}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <SkillSection
          title="Languages"
          sectionKey="languages"
          items={formData.languages}
          fields={["name"]}
          handleArrayChange={handleArrayChange}
          addSectionItem={() =>
            addSectionItem("languages", {
              name: ""
            })
          }
          removeSectionItem={(index) => removeSectionItem("languages", index)}
        />

        {/* Interests */}
        <SkillSection
          title="Interests - (Hobbies)"
          sectionKey="interests"
          items={formData.interests}
          fields={["name"]}
          handleArrayChange={handleArrayChange}
          addSectionItem={() =>
            addSectionItem("interests", {
              name: ""
            })
          }
          removeSectionItem={(index) => removeSectionItem("interests", index)}
        />

        {/* Skills */}
        <SkillSection
          title="Skills"
          sectionKey="skills"
          items={formData.skills}
          fields={["name"]}
          handleArrayChange={handleArrayChange}
          addSectionItem={() =>
            addSectionItem("skills", {
              name: ""
            })
          }
          removeSectionItem={(index) => removeSectionItem("skills", index)}
        />

        {/* Featured Skills */}
        <SkillSection
          title="Featured Skills"
          sectionKey="featuredSkills"
          items={formData.featuredSkills}
          fields={["name"]}
          handleArrayChange={handleArrayChange}
          addSectionItem={() => addSectionItem("featuredSkills", { name: "" })}
          removeSectionItem={(index) =>
            removeSectionItem("featuredSkills", index)
          }
        />
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          className="text-[#fff] w-[150px] text-sm font-semibold px-5 py-3 rounded-lg bg-[#005151]"
          disabled={loader}
        >
          {!loader ? "Submit" : <Loader />}
        </button>
      </div>
    </form>
  );
};

export default ResumeBuilder;
