
const cloudinary = require('../config/cloudinary');
const Auth = require('../models/authmodel');
const Candidate = require('../models/candidateInformationmodel');
const fs = require("fs");
const Interview = require('../models/interviewmodel');
const { log } = require('console');
exports.createCandidateInfo = async (req, res) => {
  try {
    const loginUserId = req.user.id;
    const loginUser = await Auth.findById(loginUserId);
    
    if (!loginUser) {
      return res.status(404).json({
        success: false,
        message: "Logged-in user not found",
      });
    }

    const {
      first_Name,
      last_Name,
      email,
      birth_Date,
      gender,
      phoneNumber,
      address,
      graduation,
      skill,
      role,
      profile 
    } = req.body;

    const uploadFileToCloudinary = async (filePath) => {
      try {
        const result = await cloudinary.uploader.upload(filePath, {
          folder: "candidates",
        });

        fs.unlinkSync(filePath);
        return result.secure_url;
      } catch (error) {
        throw new Error("Failed to upload file");
      }
    };

    let fileUrl = null;
    let profileUrl = profile || null;  

    if (req.files && req.files.file) {
      fileUrl = await uploadFileToCloudinary(req.files.file[0].path);
    }

    if (req.files && req.files.profile) {
      profileUrl = await uploadFileToCloudinary(req.files.profile[0].path);
    }

    let parsedSkills = [];
    if (typeof skill === "string") {
      parsedSkills = JSON.parse(skill);
    } else if (Array.isArray(skill)) {
      parsedSkills = skill;
    }

    const candidateInfo = await Candidate.create({
      userId: loginUserId,
      first_Name,
      last_Name,
      email,
      birth_Date,
      gender,
      phoneNumber,
      address,
      graduation,
      skill: parsedSkills,
      role,
      file: fileUrl,
      profile: profileUrl,
      createdEmail: loginUser.email || email,
    });

    if (!candidateInfo) {
      return res.status(400).json({
        success: false,
        message: "Something went wrong while creating candidate info",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Candidate info successfully created",
      data: candidateInfo,
    });
  } catch (error) {
    console.error("Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to add candidate data",
    });
  }
};

//ind all
exports.viewCandidates = async (req, res) => {
  try {
    const loginUserId = req.user.id;



   
    const loginUser = await Auth.findById(loginUserId);
    if (!loginUser) {
      return res.status(404).json({
        success: false,
        message: "Logged-in user not found",
      });
    }
    const candidates = await Candidate.find({ userId: loginUserId });



    return res.status(200).json({
      success: true,
      data: candidates,
    });
  } catch (error) {


    return res.status(500).json({
      success: false,
      message: "Failed to retrieve candidates",
    });
  }
};
//find by id
exports.findCandidateById = async (req, res) => {
  try {
    const { id } = req.params;
    const candidate = await Candidate.findById(id);

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Candidate retrieved successfully",
      data: candidate,
    });
  } catch (error) {

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve candidate data",
    });
  }
};
//delete candidate 
exports.deleteCandidate = async (req, res) => {
  try {
    const { id } = req.params;

   
    const candidate = await Candidate.findById(id);
    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate not found",
      });
    }

    
    await Interview.deleteMany({ candidateId: id });

    
    await Candidate.deleteOne({ _id: id });

    return res.status(200).json({
      success: true,
      message: "Candidate and associated interviews deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting candidate:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete candidate",
    });
  }
};
//update candidate
exports.updateCandidate = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      first_Name,
      last_Name,
      email,
      birth_Date,
      gender,
      phoneNumber,
      address,
      graduation,
      skill,
      role,
    } = req.body;

   
    const existingCandidate = await Candidate.findById(id);
    if (!existingCandidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate not found",
      });
    }

    
    const uploadAndDeleteLocal = async (fileArray) => {
      if (fileArray?.[0]) {
        const filePath = fileArray[0].path;
        try {
          const result = await cloudinary.uploader.upload(filePath, {
            folder: "candidates",
          });
          fs.unlinkSync(filePath);
          return result.secure_url;
        } catch (error) {
          throw error;
        }
      }
      return null;
    };

  
    const fileUrl = req.files?.file
      ? await uploadAndDeleteLocal(req.files.file)
      : existingCandidate.file;

    const profileUrl = req.files?.profile
      ? await uploadAndDeleteLocal(req.files.profile)
      : existingCandidate.profile;

    // Parse skills
    let parsedSkills = [];
    if (typeof skill === "string") {
      parsedSkills = JSON.parse(skill);
    } else if (Array.isArray(skill)) {
      parsedSkills = skill;
    } else {
      parsedSkills = existingCandidate.skill;
    }

    const updatedCandidate = await Candidate.findByIdAndUpdate(
      id,
      {
        first_Name: first_Name || existingCandidate.first_Name,
        last_Name: last_Name || existingCandidate.last_Name,
        email: email || existingCandidate.email,
        birth_Date: birth_Date || existingCandidate.birth_Date,
        gender: gender || existingCandidate.gender,
        phoneNumber: phoneNumber || existingCandidate.phoneNumber,
        address: address || existingCandidate.address,
        graduation: graduation || existingCandidate.graduation,
        skill: parsedSkills,
        role: role || existingCandidate.role,
        file: fileUrl,
        profile: profileUrl
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Candidate updated successfully",
      data: updatedCandidate,
    });
  } catch (error) {
    console.error("Update error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update candidate data",
    });
  }
};;


