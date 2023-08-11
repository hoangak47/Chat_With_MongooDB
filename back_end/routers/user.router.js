const router = require("express").Router();

const middleware = require("../controllers/middleware");
const {
  getUser,
  deleteUser,
  updateUser,
} = require("../controllers/user.controller");

router.get("/:_id", middleware.checkToken, getUser);
router.delete("/:_id", middleware.checkToken, deleteUser);
router.put("/:_id", middleware.checkToken, updateUser);

module.exports = router;
