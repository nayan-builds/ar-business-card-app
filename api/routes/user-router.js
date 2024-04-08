const express = require("express");

const router = express.Router();

const userController = require("../controllers/user-controller");
const authMiddleware = require("../middleware/auth-middleware");

router.get("/:id", userController.getUser);
router.get("/", authMiddleware.loggedOn, userController.getUser);
router.patch("/", authMiddleware.loggedOn, userController.editUser);

module.exports = router;
