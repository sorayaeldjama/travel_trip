var express = require('express');
var router = express.Router();
var user_controller = require("../src/controllers/userController");

// routes
router.get("/", user_controller.getAll);
router.get("/profile/:id", user_controller.getById);
router.put("/profile/:id", user_controller.update);
router.delete("/profile/:id", user_controller.delete);

module.exports = router;