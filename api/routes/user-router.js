const express = require("express");

const router = express.Router();

const userController = require("../controllers/user-controller");
const authMiddleware = require("../middleware/auth-middleware");

router.get("/:id", userController.getUser);
router.post("/", userController.createUser);
router.patch("/:id", authMiddleware.loggedOn, userController.editUser);

module.exports = router;
