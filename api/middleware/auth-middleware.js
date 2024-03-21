const jwt = require("jsonwebtoken");
const userDB = require("../schema/user-schema");

const loggedOn = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      throw Error("You must send an authorization header");
    }
    const token = authorization.split(" ")[1];
    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await userDB.findById(id).select("_id");
    console.log(req.user);
    next();
  } catch (error) {
    return res.status(401).json({ success: false, error: error.message });
  }
};

module.exports = { loggedOn };
