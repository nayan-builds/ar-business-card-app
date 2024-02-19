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
