import React, { useState } from "react";
import { AiOutlinePlus, AiOutlineDelete } from "react-icons/ai";
import axios from "axios";
import { uploadFile } from "../upload";
import Loader from "./Loader";
import Select from "react-select";
function PortfolioForm() {
  // const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    emailId: "",
    phoneNo: "",
    techStacks: [""],
    projects: [{ title: "", description: "", technologies: [], repoLink: "" }],
    resume: "",
    experiences: [
      {
        companyName: "",
        logo: "",
        role: "",
        description: "",
        technologies: [], // Initialize as an array
        duration: "",
      },
    ],

    contactDetails: [""],
    codingProfiles: [""],
    certifications: [""],
    achievements: [
      {
        title: "",
        description: "",
      },
    ],
    about: "",
    profilePhoto: "",
  });
  const technologyOptions = [
    { value: "React", label: "React" },
    { value: "Angular", label: "Angular" },
    { value: "Vue", label: "Vue" },
    { value: "Python", label: "Python" },
    { value: "Java", label: "Java" },
    { value: "C#", label: "C#" },
    { value: "Ruby", label: "Ruby" },
    { value: "Go", label: "Go" },
    { value: "C++", label: "C++" },
    { value: "HTML", label: "HTML" },
    { value: "CSS", label: "CSS" },
    { value: "Java Script", label: "Java Script" },
    { value: "Bootstrap", label: "Bootstrap" },
    { value: "Tailwind CSS", label: "Tailwind CSS" },
    { value: "Express", label: "Express" }, // Corrected value
    { value: "Node JS", label: "Node JS" },
    { value: "Mongo DB", label: "Mongo DB" },
    { value: "Git Hub", label: "Git Hub" },
    { value: "Git", label: "Git" },
    { value: "SQL", label: "SQL" },
    { value: "Postman", label: "Postman" },
    { value: "Linux", label: "Linux" },
    { value: "Firebase", label: "Firebase" },
    { value: "Figma", label: "Figma" },
    { value: "Docker", label: "Docker" },
    { value: "C", label: "C" },
    { value: "NextJS", label: "NextJS" },
    { value: "ThunderClient", label: "ThunderClient" },
    { value: "AWS", label: "AWS" },
    { value: "threeJS", label: "threeJS" },
  ];

  const handleAddItem = (field) => {
    const newItem =
      field === "projects"
        ? { title: "", description: "", technologies: [], repoLink: "" }
        : field === "experiences"
        ? {
            companyName: "",
            role: "",
            description: "",
            technologies: [],
            duration: "",
          }
        : field === "achievements"
        ? { title: "", description: "" }
        : "";

    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], newItem],
    }));
  };
  const handleTechnologyChange = (selectedOptions, field, index) => {
    const selectedTechnologies = selectedOptions.map((option) => option.value);
    if (field == "techStacks") {
      handleChange(null, field, null, null, selectedTechnologies);
    }
    handleChange(null, field, index, "technologies", selectedTechnologies);
  };

  const handleChange = (
    e,
    field,
    index = null,
    subField = null,
    value = e?.target?.value
  ) => {
    const newFormData = { ...formData };
    const newErrors = { ...errors };

    // Debugging log
    console.log("Value:", value, "Type:", typeof value);

    if (index !== null && subField) {
      const updatedArray = newFormData[field].map((item, idx) =>
        idx === index
          ? {
              ...item,
              [subField]:
                subField === "technologies"
                  ? Array.isArray(value)
                    ? value
                        .map((item) =>
                          typeof item === "string" ? item.trim() : item
                        )
                        .filter(Boolean)
                    : []
                  : value,
            }
          : item
      );
      newFormData[field] = updatedArray;

      if (typeof value === "string" && !value.trim()) {
        if (!newErrors[field]) newErrors[field] = [];
        newErrors[field][index] = {
          ...newErrors[field][index],
          [subField]: `${subField} is required.`,
        };
      } else if (newErrors[field]?.[index]?.[subField]) {
        delete newErrors[field][index][subField];
      }
    } else {
      newFormData[field] = value;

      if (typeof value === "string" && !value.trim()) {
        newErrors[field] = `${field} is required.`;
      } else {
        delete newErrors[field];
      }
    }

    setFormData(newFormData);
    setErrors(newErrors);
    console.log("Updated Form Data:", newFormData);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required.";
    if (!formData.emailId.trim()) newErrors.emailId = "Email is required.";
    if (!formData.phoneNo.trim())
      newErrors.phoneNo = "Phone Number is required.";

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.emailId.trim()) {
      newErrors.emailId = "Email is required.";
    } else if (!emailRegex.test(formData.emailId)) {
      newErrors.emailId = "Invalid email format.";
    }
    // Phone Number validation
    const phoneRegex = /^[6-9]\d{9}$/; // Indian phone number format
    if (!formData.phoneNo.trim()) {
      newErrors.phoneNo = "Phone Number is required.";
    } else if (!phoneRegex.test(formData.phoneNo)) {
      newErrors.phoneNo = "Invalid phone number format.";
    }

    // Validate array fields
    if (formData.projects.some((project) => !project.title.trim()))
      newErrors.projects = "Project Title is required.";
    if (formData.projects.some((project) => !project.description.trim()))
      newErrors.projects = "Project Description is required.";

    if (formData.contactDetails.some((contact) => !contact.trim()))
      newErrors.contactDetails = "Contact details are required.";

    if (formData.codingProfiles.some((profile) => !profile.trim()))
      newErrors.codingProfiles = "Coding profile URL is required.";

    if (formData.certifications.some((cert) => !cert.trim()))
      newErrors.certifications = "Certification URL is required.";

    return newErrors;
  };

  const handleRemoveItem = (field, index) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleArrayChange = (e, field, index, subField = null) => {
    const newFormData = { ...formData };

    if (subField) {
      // Handle subfields for objects within arrays
      newFormData[field] = newFormData[field].map((item, i) =>
        i === index
          ? {
              ...item,
              [subField]: e.target.value,
            }
          : item
      );
    } else {
      // Handle simple arrays
      newFormData[field][index] = e.target.value;
    }

    setFormData(newFormData);
  };

  const handleImageChange = async (e, field, index = null, subField = null) => {
    console.log("Image uploading...");

    // Get the selected file
    const file = e.target.files[0];
    if (!file) {
      console.error("No file selected.");
      return;
    }

    // Upload the file and get the URL
    const uploadedPhoto = await uploadFile(file);
    if (!uploadedPhoto || !uploadedPhoto.url) {
      console.error("Failed to upload image.");
      return;
    }

    console.log("Uploaded URL:", uploadedPhoto.url);

    // Update form data
    setFormData((prevData) => {
      const updatedData = { ...prevData };

      if (field === "profilePhoto") {
        // Directly update the profile photo
        updatedData.profilePhoto = uploadedPhoto.url;
      } else if (field === "experiences" && index !== null && subField) {
        // Update a specific company's logo or other field in experiences
        updatedData.experiences = updatedData.experiences.map((exp, i) =>
          i === index
            ? {
                ...exp,
                [subField]: uploadedPhoto.url,
              }
            : exp
        );
      } else {
        console.error("Invalid field or missing parameters for updating.");
      }

      return updatedData;
    });

    console.log("Updated form data:", formData);
  };

  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    // setLoading(true);
    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      console.log("Form submitted successfully!");
      // Proceed with submission logic
    }
    console.log("formData", formData);
    try {
      const res = await axios.post(
        "http://localhost:3000/api/v1/post/userInfo",
        formData
      );
      console.log("res", res);
      if (res.data) {
        // setLoading(false);
        window.location.href = res.data.portfolioURL;
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="bg-gradient-to-r from-purple-400 to-pink-500 min-h-screen flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="p-8 bg-white shadow-lg rounded-lg w-full max-w-3xl"
      >
        <h1 className="text-3xl font-bold text-center mb-6">Portfolio Form</h1>
        {/* Name */}
        <label className="block font-semibold mb-2">Name</label>
        <input
          required
          type="text"
          value={formData.name}
          onChange={(e) => handleChange(e, "name")}
          // className="w-full mb-4 p-2 border border-gray-300 rounded-lg"
          className={`w-full px-4 py-2 border ${
            errors.name ? "border-red-500" : "border-gray-300"
          } rounded focus:outline-none focus:ring ${
            errors.name ? "focus:ring-red-500" : "focus:ring-blue-500"
          }`}
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name}</p>
        )}

        {/* Email */}
        <label className="block font-semibold mb-2">Email</label>
        <input
          required
          type="email"
          value={formData.emailId}
          onChange={(e) => handleChange(e, "emailId")}
          className={`w-full px-4 py-2 border ${
            errors.emailId ? "border-red-500" : "border-gray-300"
          } rounded focus:outline-none focus:ring ${
            errors.emailId ? "focus:ring-red-500" : "focus:ring-blue-500"
          }`}
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.emailId}</p>
        )}

        {/* Phone Number */}
        <label className="block font-semibold mb-2">Phone Number</label>
        <input
          required
          type="text"
          value={formData.phoneNo}
          onChange={(e) => handleChange(e, "phoneNo")}
          className={`w-full px-4 py-2 border ${
            errors.phoneNo ? "border-red-500" : "border-gray-300"
          } rounded focus:outline-none focus:ring ${
            errors.phoneNo ? "focus:ring-red-500" : "focus:ring-blue-500"
          }`}
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.phoneNo}</p>
        )}
        <label className="block font-semibold mb-2">TechStacks</label>
        <Select
          isMulti
          options={technologyOptions}
          value={technologyOptions.filter((option) =>
            formData.techStacks.includes(option.value)
          )}
          onChange={(selectedOptions) =>
            handleTechnologyChange(selectedOptions, "techStacks")
          }
          placeholder="Select Technologies"
          className="w-full mb-2"
        />
        {/* Projects */}
        <label className="block font-semibold mb-2">Projects</label>
        {formData.projects.map((project, index) => (
          <div
            key={index}
            className="mb-4 p-2 bg-gray-100 rounded-lg flex flex-row-reverse "
          >
            <button
              type="button"
              onClick={() => handleRemoveItem("projects", index)}
              className="ml-2 text-red-500"
            >
              <AiOutlineDelete />
            </button>
            <div style={{ width: "100%" }}>
              <input
                required
                type="text"
                placeholder="Project Title"
                value={project.title}
                onChange={(e) => handleChange(e, "projects", index, "title")}
                className={` w-full mb-2 p-2 border border-gray-300 rounded-lg ${
                  errors.name ? "border-red-500" : "border-gray-300"
                } rounded focus:outline-none focus:ring ${
                  errors.name ? "focus:ring-red-500" : "focus:ring-blue-500"
                }`}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
              )}

              <textarea
                required
                type="text"
                placeholder="Description"
                value={project.description || ""}
                onChange={(e) =>
                  handleChange(e, "projects", index, "description")
                }
                className={`w-full mb-2 p-2 border rounded-lg ${
                  errors.projects?.[index]?.description
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              ></textarea>

              <Select
                isMulti
                options={technologyOptions}
                value={technologyOptions.filter((option) =>
                  project.technologies.includes(option.value)
                )}
                onChange={(selectedOptions) =>
                  handleTechnologyChange(selectedOptions, "projects", index)
                }
                placeholder="Select Technologies"
                className="w-full mb-2"
              />

              <input
                required
                type="text"
                placeholder="Repo Link"
                value={project.repoLink}
                onChange={(e) => handleChange(e, "projects", index, "repoLink")}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() => handleAddItem("projects")}
          className="flex items-center text-purple-700 font-semibold"
        >
          <AiOutlinePlus className="mr-2" /> Add Project
        </button>

        {/* Profile Photo */}
        <label className="block font-semibold mb-2 mt-4">Profile Photo</label>
        <input
          required
          type="file"
          onChange={(e) => handleImageChange(e, "profilePhoto")}
          className="mb-4"
        />

        {/* Resume */}
        <label className="block font-semibold mb-2">Resume</label>
        <input
          required
          type="file"
          onChange={handleImageChange}
          className="mb-4"
        />

        {/* Experiences */}
        <label className="block font-semibold mb-2">Experiences</label>
        {formData.experiences.map((experience, index) => (
          <div
            key={index}
            className="flex flex-row-reverse mb-4 p-2 bg-gray-100 rounded-lg relative"
          >
            <button
              type="button"
              onClick={() => handleRemoveItem("experiences", index)}
              className="text-red-500 flex items-center"
            >
              <AiOutlineDelete className="mr-1" />
            </button>
            <div style={{ width: "100%" }}>
              <input
                required
                type="text"
                placeholder="Company Name"
                value={experience.companyName}
                onChange={(e) =>
                  handleChange(e, "experiences", index, "companyName")
                }
                className="w-full mb-2 p-2 border border-gray-300 rounded-lg"
              />
              <input
                required
                type="text"
                placeholder="Role"
                value={experience.role}
                onChange={(e) => handleChange(e, "experiences", index, "role")}
                className="w-full mb-2 p-2 border border-gray-300 rounded-lg"
              />
              <textarea
                placeholder="Description"
                value={experience.description}
                onChange={(e) =>
                  handleChange(e, "experiences", index, "description")
                }
                className="w-full mb-2 p-2 border border-gray-300 rounded-lg"
              ></textarea>
              <Select
                isMulti
                options={technologyOptions}
                value={technologyOptions.filter((option) =>
                  experience.technologies.includes(option.value)
                )}
                onChange={(selectedOptions) =>
                  handleTechnologyChange(selectedOptions, "experiences", index)
                }
                placeholder="Select Technologies"
                className="w-full mb-2"
              />
              <input
                required
                type="text"
                placeholder="Duration (e.g., Jan 2022 - Dec 2022)"
                value={experience.duration}
                onChange={(e) =>
                  handleChange(e, "experiences", index, "duration")
                }
                className="w-full mb-2 p-2 border border-gray-300 rounded-lg"
              />
              {/* Optional Company Logo Upload */}
              <label className="block text-gray-600 text-sm mb-2">
                Company Logo (Optional):
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  handleImageChange(e, "experiences", index, "logo")
                }
                className="w-full mb-2 p-2 border border-gray-300 rounded-lg"
              />
              {experience.companyLogo && (
                <img
                  src={experience.companyLogo}
                  alt="Company Logo"
                  className="w-20 h-20 object-cover mt-2 rounded-lg"
                />
              )}
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={() => handleAddItem("experiences")}
          className="flex items-center text-purple-700 font-semibold"
        >
          <AiOutlinePlus className="mr-2" /> Add Experience
        </button>

        <label className="block font-semibold mb-2">
          Contact Details (GitHub, LinkedIn, etc.)
        </label>
        {formData.contactDetails.map((contact, index) => (
          <div key={index} className="flex items-center mb-2">
            <input
              required
              type="text"
              value={contact}
              placeholder="Contact URL"
              onChange={(e) => handleArrayChange(e, "contactDetails", index)}
              className="flex-1 p-2 border border-gray-300 rounded-lg"
            />
            <button
              type="button"
              onClick={() => handleRemoveItem("contactDetails", index)}
              className="ml-2 text-red-500"
            >
              <AiOutlineDelete />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => handleAddItem("contactDetails")}
          className="flex items-center text-indigo-700 font-semibold"
        >
          <AiOutlinePlus className="mr-2" /> Add Contact URL
        </button>

        {/* Coding Profiles */}
        <label className="block font-semibold mb-2 mt-4">
          Coding Profiles (LeetCode, etc.)
        </label>
        {formData.codingProfiles.map((profile, index) => (
          <div key={index} className="flex items-center mb-2">
            <input
              required
              type="text"
              value={profile}
              placeholder="Coding Profile URL"
              onChange={(e) => handleArrayChange(e, "codingProfiles", index)}
              className="flex-1 p-2 border border-gray-300 rounded-lg"
            />
            <button
              type="button"
              onClick={() => handleRemoveItem("codingProfiles", index)}
              className="ml-2 text-red-500"
            >
              <AiOutlineDelete />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => handleAddItem("codingProfiles")}
          className="flex items-center text-indigo-700 font-semibold"
        >
          <AiOutlinePlus className="mr-2" /> Add Coding Profile URL
        </button>

        {/* Certifications */}
        <label className="block font-semibold mb-2 mt-4">Certifications</label>
        {formData.certifications.map((cert, index) => (
          <div key={index} className="flex items-center mb-2">
            <input
              required
              type="text"
              value={cert}
              placeholder="Certification URL"
              onChange={(e) => handleArrayChange(e, "certifications", index)}
              className="flex-1 p-2 border border-gray-300 rounded-lg"
            />
            <button
              type="button"
              onClick={() => handleRemoveItem("certifications", index)}
              className="ml-2 text-red-500"
            >
              <AiOutlineDelete />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => handleAddItem("certifications")}
          className="flex items-center text-indigo-700 font-semibold"
        >
          <AiOutlinePlus className="mr-2" /> Add Certification URL
        </button>

        {/* Achievements */}
        <label className="block font-semibold mb-2 mt-4">Achievements</label>
        {formData.achievements.map((achievement, index) => (
          <div key={index} className="mb-4 p-2 bg-gray-100 rounded-lg">
            <input
              required
              type="text"
              placeholder="Achievement Title"
              value={achievement.title}
              onChange={(e) =>
                handleArrayChange(e, "achievements", index, "title")
              }
              className="w-full mb-2 p-2 border border-gray-300 rounded-lg"
            />
            <textarea
              placeholder="Achievement Description"
              value={achievement.description}
              onChange={(e) =>
                handleArrayChange(e, "achievements", index, "description")
              }
              className="w-full p-2 border border-gray-300 rounded-lg"
            ></textarea>
            <button
              type="button"
              onClick={() => handleRemoveItem("achievements", index)}
              className="mt-2 text-red-500 flex items-center"
            >
              <AiOutlineDelete className="mr-2" /> Remove Achievement
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => handleAddItem("achievements")}
          className="flex items-center text-indigo-700 font-semibold"
        >
          <AiOutlinePlus className="mr-2" /> Add Achievement
        </button>

        {/* About Section */}
        <label className="block font-semibold mb-2">About</label>
        <textarea
          value={formData.about}
          onChange={(e) => handleChange(e, "about")}
          className="w-full mb-4 p-2 border border-gray-300 rounded-lg"
        ></textarea>

        <button
          type="submit"
          className="w-full mt-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 rounded-lg"
        >
          Submit
        </button>
      </form>
      {/* <Loader show={loading} /> */}
    </div>
  );
}

export default PortfolioForm;
