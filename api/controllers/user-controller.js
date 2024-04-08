const userDB = require("../schema/user-schema");
const validator = require("validator");

const getUser = async (req, res) => {
  let { id } = req.params;
  if (!id) {
    //From middleware
    id = req.user._id;
  }
  try {
    const user = await userDB.findById(id).select("-password -email").exec();
    if (!user) {
      throw Error("User not found");
    }
    console.log("✅ Get user successfully");
    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.log("❌ Get user failed");
    console.log(error);
    return res.status(400).json({
      success: false,
      message: error ? error.message : "Get user failed",
    });
  }
};

const editUser = async (req, res) => {
  try {
    const id = req.user._id;
    const body = req.body;
    const update = {};
    if (typeof body.firstName !== "undefined") {
      if (body.firstName === null) throw Error("First name cannot be null");
      if (!body.firstName) {
        throw Error("First name is required");
      }
      update.firstName = body.firstName;
    }
    if (typeof body.lastName !== "undefined") {
      if (body.lastName === null) throw Error("Last name cannot be null");
      if (!body.lastName) {
        throw Error("Last name is required");
      }
      update.lastName = body.lastName;
    }
    if (typeof body.overview !== "undefined") {
      if (body.overview === null) throw Error("Overview cannot be null");
      if (!body.overview) {
        throw Error("Overview is required");
      }
      update.overview = body.overview;
    }
    if (typeof body.workHistory !== "undefined") {
      if (body.workHistory && !Array.isArray(body.workHistory)) {
        throw Error("Work history must be an array");
      }
      if (body.workHistory) {
        body.workHistory.forEach((workEntry) => {
          if (!workEntry.company) {
            throw Error("Company is required for every work entry");
          }
          if (!workEntry.position) {
            throw Error("Position is required for every work entry");
          }
          if (!workEntry.startDate) {
            throw Error("Start date is required for every work entry");
          }
          if (!workEntry.endDate) {
            throw Error("End date is required for every work entry");
          }
        });
      }
      update.workHistory = body.workHistory;
    }
    if (typeof body.educationHistory !== "undefined") {
      if (body.educationHistory && !Array.isArray(body.educationHistory)) {
        throw Error("Education history must be an array");
      }
      if (body.educationHistory) {
        body.educationHistory.forEach((educationEntry) => {
          if (!educationEntry.institution) {
            throw Error("Institution is required for every education entry");
          }
          if (!educationEntry.qualifications) {
            throw Error("Qualifications is required for every education entry");
          }
          if (!Array.isArray(educationEntry.qualifications)) {
            throw Error("Qualifications must be an array");
          }
          educationEntry.qualifications.forEach((qualification) => {
            if (!qualification.level) {
              throw Error("Level is required for every qualification");
            }
            if (!qualification.name) {
              throw Error("Name is required for every qualification");
            }
            if (!qualification.grade) {
              throw Error("Grade is required for every qualification");
            }
          });
          if (!educationEntry.startDate) {
            throw Error("Start date is required for every education entry");
          }
          if (!educationEntry.endDate) {
            throw Error("End date is required for every education entry");
          }
        });
      }
      update.educationHistory = body.educationHistory;
    }
    if (typeof body.interests !== "undefined") {
      if (body.interests && !Array.isArray(body.interests)) {
        throw Error("Interests must be an array");
      }
      update.interests = body.interests;
    }
    if (typeof body.contact !== "undefined") {
      if (body.contact.email && !validator.isEmail(body.contact.email)) {
        throw Error("Invalid email");
      }
      if (body.contact.phone && !validator.isMobilePhone(body.contact.phone)) {
        throw Error("Invalid phone number");
      }
      update.contact = body.contact;
    }

    const user = await userDB.findByIdAndUpdate(id, update, { new: true });
    console.log("✅ Update user successfully");
    return res.status(201).json({ success: true, user });
  } catch (error) {
    console.log(error);
    console.log("❌ Update user failed");
    return res.status(400).json({
      success: false,
      message: error ? error.message : "Update user failed",
    });
  }
};

module.exports = { getUser, editUser };
