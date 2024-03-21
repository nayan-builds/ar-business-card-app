const userDB = require("../schema/user-schema");

const getUser = async (req, res) => {
  let { id } = req.params;
  if (!id) {
    //From middleware
    id = req.user._id;
  }
  try {
    const user = await userDB.findById(id);
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

const createUser = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      overview,
      workHistory,
      educationHistory,
      interests,
      contact,
    } = req.body;
    if (!firstName) {
      throw Error("First name is required");
    }
    if (!lastName) {
      throw Error("Last name is required");
    }
    if (!overview) {
      throw Error("Overview is required");
    }
    if (workHistory && !Array.isArray(workHistory)) {
      throw Error("Work history must be an array");
    }
    if (workHistory) {
      workHistory.forEach((workEntry) => {
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
    if (educationHistory && !Array.isArray(educationHistory)) {
      throw Error("Education history must be an array");
    }
    if (educationHistory) {
      educationHistory.forEach((educationEntry) => {
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
    if (interests && !Array.isArray(interests)) {
      throw Error("Interests must be an array");
    }

    const user = await userDB.create({
      firstName,
      lastName,
      overview,
      workHistory,
      educationHistory,
      interests,
      contact,
    });
    console.log("✅ Create user successfully");
    return res.status(201).json({ success: true, user });
  } catch (error) {
    console.log("❌ Create user failed");
    return res.status(400).json({
      success: false,
      message: error ? error.message : "Create user failed",
    });
  }
};

const editUser = async (req, res) => {
  try {
    const id = req._user._id;
    const body = req.body;
    const update = {};
    if (typeof body.firstName !== "undefined") {
      if (body.firstName === null) throw Error("First name cannot be null");
      update.firstName = body.firstName;
    }
    if (typeof body.lastName !== "undefined") {
      if (body.lastName === null) throw Error("Last name cannot be null");
      update.lastName = body.lastName;
    }
    if (typeof body.overview !== "undefined") {
      if (body.overview === null) throw Error("Overview cannot be null");
      update.overview = body.overview;
    }
    if (typeof body.workHistory !== "undefined") {
      update.workHistory = body.workHistory;
    }
    if (typeof body.educationHistory !== "undefined") {
      update.educationHistory = body.educationHistory;
    }
    if (typeof body.interests !== "undefined") {
      update.interests = body.interests;
    }
    if (typeof body.contact !== "undefined") {
      update.contact = body.contact;
    }

    const user = await userDB.findByIdAndUpdate(id, update, { new: true });
    console.log("✅ Update user successfully");
    return res.status(201).json({ success: true, user });
  } catch (error) {
    console.log("❌ Update user failed");
    return res.status(400).json({
      success: false,
      message: error ? error.message : "Update user failed",
    });
  }
};

module.exports = { getUser, createUser, editUser };
