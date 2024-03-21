const jwt = require("jsonwebtoken");
const userDB = require("../schema/user-schema");

const loggedOn = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      throw Error("You must send an authorization header");
    }
    const token = authorization;

    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    req._user = await userDB.findById(id).select("_id");
    console.log(req._user._id);
    next();
  } catch (error) {
    return res.status(401).json({ success: false, error: error.message });
  }
};

module.exports = { loggedOn };
