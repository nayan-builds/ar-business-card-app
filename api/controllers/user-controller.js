const userDB = require("../schema/user-schema");
const mongoose = require("mongoose");

const getUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await userDB.findById(id);
    if (!user) {
      throw Error("User not found");
    }
    console.log("✅ Get user successfully");
    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.log("❌ Get user failed");
    return res
      .status(400)
      .json({ success: false, message: error ? error : "Get user failed" });
  }
};

const createUser = async (req, res) => {
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
    return res
      .status(400)
      .json({ success: false, message: "First name is required" });
  }
  if (!lastName) {
    return res
      .status(400)
      .json({ success: false, message: "Last name is required" });
  }
  if (!overview) {
    return res
      .status(400)
      .json({ success: false, message: "Overview is required" });
  }
  if (workHistory && !Array.isArray(workHistory)) {
    return res
      .status(400)
      .json({ success: false, message: "Work history must be an array" });
  }
  workHistory.forEach((workEntry) => {
    if (!workEntry.company) {
      return res.status(400).json({
        success: false,
        message: "Company is required for every work entry",
      });
    }
    if (!workEntry.position) {
      return res.status(400).json({
        success: false,
        message: "Position is required for every work entry",
      });
    }
    if (!workEntry.startDate) {
      return res.status(400).json({
        success: false,
        message: "Start date is required for every work entry",
      });
    }
    if (!workEntry.endDate) {
      return res.status(400).json({
        success: false,
        message: "End date is required for every work entry",
      });
    }
  });
  try {
    const user = new userDB({
      firstName,
      lastName,
      overview,
      workHistory,
      educationHistory,
      interests,
      contact,
    });
    await user.save();
    console.log("✅ Create user successfully");
    return res.status(201).json({ success: true, user });
  } catch (error) {
    console.log("❌ Create user failed");
    return res
      .status(400)
      .json({ success: false, message: error ? error : "Create user failed" });
  }
};
