const router = require("express").Router();

const {
  getMessages,
  createMessage,
} = require("../controllers/message.controller");
const middleware = require("../controllers/middleware");

router.get("/:room", middleware.checkToken, getMessages);
router.post("/:room", createMessage);

module.exports = router;
