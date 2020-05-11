var express = require("express");
var multer = require("multer");

var controllerUser = require("../controllers/user.controller");
var validate = require("../validate/user.validate");

var upload = multer({ dest: "uploads/" });

var router = express.Router();

router.get("/", controllerUser.index);

router.get("/search", controllerUser.search);

router.get("/create", controllerUser.create);

router.get("/:id/delete", controllerUser.delete);

router.get("/:id/update", controllerUser.getUpdate);

router.get("/profile", controllerUser.profile);

router.post("/create", validate.postCreate, controllerUser.postCreate);

router.post("/update", controllerUser.postUpdate);

router.post(
  "/profile/avatar",
  upload.single("avatar"),
  controllerUser.postAvatar
);

module.exports = router;
