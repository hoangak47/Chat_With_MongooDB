const Message = require("../models/Message");
const Room = require("../models/Room");
const User = require("../models/User");

const room = {
  getRoom: async (req, res) => {
    try {
      const { _id } = req.query;
      const rooms = await Room.find({ members: _id });

      await Promise.all(
        rooms.map(async (room) => {
          const members = await User.find({
            _id: { $in: room.members },
          }).select("_id username avatar");

          room._doc.members = members;
        })
      );

      return res.status(200).json([...rooms]);
    } catch (error) {
      return res.status(500).json({ msg: "Cannot get room. Reason: " + error });
    }
  },
  getRoomById: async (req, res) => {
    try {
      const { _id } = req.params;
      const room = await Room.findById(_id);

      if (!room) return res.status(400).json({ msg: "Room not found." });

      if (room.members.indexOf(req?.headers?._id) === -1)
        return res.status(400).json({ msg: "You are not in this room." });

      const members = await User.find({ _id: { $in: room.members } }).select(
        "_id username avatar"
      );

      await Message.find({
        room: _id,
        read: { $ne: req?.headers?._id },
      }).updateMany({ $push: { read: req?.headers?._id } });

      return res.status(200).json({ ...room._doc, members });
    } catch (error) {}
  },
  createRoom: async (req, res) => {
    try {
      const { name, members } = req.body;
      const { _id } = req.headers;
      if (!name) return res.status(400).json({ msg: "Name is required." });

      const newRoom = new Room({
        name,
        members: [...members, _id],
        userCreate: _id,
      });

      await newRoom.save();

      return res.status(200).json({ msg: "Create room successfully." });
    } catch (error) {
      return res
        .status(500)
        .json({ msg: "Cannot create room. Reason: " + error });
    }
  },
  updateRoom: async (req, res) => {
    try {
      const { _id } = req.params;
      const { name, members, avatar } = req.body;

      if (avatar) {
        await Room.findByIdAndUpdate(_id, {
          $set: {
            avatar: avatar,
          },
        });
      } else {
        if (!name && !members) {
          return res.status(400).json({ msg: "You must update something." });
        }

        await Room.findByIdAndUpdate(_id, {
          $set: {
            name: name,
            members: members,
          },
        });
      }

      return res.status(200).json({ msg: "Update room successfully." });
    } catch (error) {
      return res
        .status(500)
        .json({ msg: "Cannot update room. Reason: " + error });
    }
  },
  leaveRoom: async (req, res) => {
    try {
      const { _id } = req.params;

      const room = await Room.findById(_id);

      if (!room) return res.status(400).json({ msg: "Room not found." });

      if (room.members.indexOf(req?.headers?._id) === -1)
        return res.status(400).json({ msg: "You are not in this room." });

      if (room.userCreate === req?.headers?._id) {
        await Room.findByIdAndUpdate(_id, {
          $pull: {
            members: req?.headers?._id,
          },
          $set: {
            userCreate: room.members[0],
          },
        });
      } else {
        await Room.findByIdAndUpdate(_id, {
          $pull: {
            members: req?.headers?._id,
          },
        });
      }

      return res.status(200).json({ msg: "Leave room successfully." });
    } catch (error) {
      return res
        .status(500)
        .json({ msg: "Cannot leave room. Reason: " + error });
    }
  },
  deleteRoom: async (req, res) => {
    try {
      const { _id } = req.params;

      const room = await Room.findById(_id);

      if (!room) return res.status(400).json({ msg: "Room not found." });

      if (room.userCreate !== req?.headers?._id) {
        return res
          .status(400)
          .json({ msg: "You are not the owner of this room." });
      }

      await Room.findByIdAndDelete(_id);

      return res.status(200).json({ msg: "Delete room successfully." });
    } catch (error) {
      return res
        .status(500)
        .json({ msg: "Cannot delete room. Reason: " + error });
    }
  },
};

module.exports = room;
