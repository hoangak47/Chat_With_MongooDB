const router = require("express").Router();

const middleware = require("../controllers/middleware");
const {
  getRoom,
  createRoom,
  updateRoom,
  leaveRoom,
  getRoomById,
  deleteRoom,
} = require("../controllers/room.controller.js");

router.post("/", middleware.checkToken, createRoom);
router.get("/", middleware.checkToken, getRoom);
router.get("/:_id", middleware.checkToken, getRoomById);
router.put("/:_id", middleware.checkToken, updateRoom);
router.put("/:_id/leave", middleware.checkToken, leaveRoom);
router.delete("/:_id", middleware.checkToken, deleteRoom);

module.exports = router;
