const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userDB = require("../schema/user-schema");
const validator = require("validator");

function createToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
}

async function login(req, res) {
  const { email, password } = req.body;
  try {
    if (!email) throw Error("Email is required");
    if (!password) throw Error("Password is required");
    let user = await userDB.findOne({ email });
    if (!user) throw Error("Incorrect credentials");
    const match = await bcrypt.compare(password, user.password);
    if (!match) throw Error("Incorrect credentials");
    const token = createToken(user._id);
    console.log("✅ Login Successful");
    return res
      .status(200)
      .json({ success: true, message: "Login Successful", token, user });
  } catch (error) {
    console.log("❌ Login failed");
    return res.status(400).json({ success: false, message: error.message });
  }
}

async function signUp(req, res) {
  const { email, password } = req.body;
  try {
    if (!email) throw Error("Email is required");
    if (!password) throw Error("Password is required");

    //validate email
    if (!validator.isEmail(email)) throw Error("Invalid email");

    //validate password
    if (!validator.isStrongPassword(password))
      throw Error("Password is not strong enough");
    //Hash password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    //Create user
    const user = await userDB.create({
      email,
      password: hash,
    });

    const token = createToken(user._id);
    console.log("✅ Create user successfully");
    return res
      .status(201)
      .json({ success: true, message: "Signed Up Successfully", token, user });
  } catch (error) {
    console.log("❌ Create user failed");
    return res.status(400).json({
      success: false,
      message: error ? error.message : "Create user failed",
    });
  }
}

module.exports = { login, signUp, checkLoggedIn };
