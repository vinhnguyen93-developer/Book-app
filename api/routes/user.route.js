var express = require("express");
var multer = require("multer");
var cors = require('cors');

var controllerUser = require("../controllers/user.controller");
var validate = require("../../validate/user.validate");

var upload = multer({ dest: "uploads/" });

var router = express.Router();

router.use(cors());

router.get("/", controllerUser.index);

// router.get("/search", controllerUser.search);

router.get("/:id/delete", controllerUser.delete);

// router.get("/:id/update", controllerUser.getUpdate);

router.get("/:id/profile", controllerUser.profile);

router.post("/register", validate.postCreate, controllerUser.postCreate);

router.post("/login", controllerUser.postLogin);

router.post("/:id/update", controllerUser.postUpdate);

router.post(
  "/:id/profile/avatar",
  upload.single("avatar"),
  controllerUser.postAvatar
);

module.exports = router;