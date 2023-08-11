const Message = require("../models/Message");
const User = require("../models/User");
const Room = require("../models/Room");

async function socket(io) {
  io.on("connection", async (socket) => {
    const user = {};

    socket.on("online", async (data) => {
      const { email } = data;

      await User.findOneAndUpdate({ email }, { online: true });

      user[socket.id] = email;
    });

    socket.on("timeRoom", async (data) => {
      await Room.findByIdAndUpdate(data, {
        $currentDate: {
          updatedAt: true,
        },
      });

      const room = await Room.findById(data);

      const members = await User.find({
        _id: { $in: room.members },
      }).select("_id username avatar");

      io.emit("timeRoom", { ...room._doc, members });
    });

    //update room
    socket.on("updateRoom", async (data) => {
      try {
        const { _id } = data;
        const room = await Room.findById(_id);

        io.emit("updateRoom", room);
      } catch (error) {}
    });

    socket.on("sendDataClient", async function (msg) {
      const { data, ...rest } = msg;

      const message = new Message(rest);
      await message.save();
      await Room.findByIdAndUpdate(rest.room, {
        $currentDate: {
          updatedAt: true,
        },
      });

      io.emit("sendDataServer", [...data, message._doc]);
    });

    socket.on("disconnect", async () => {
      if (user[socket.id]) {
        await User.findOneAndUpdate(
          { email: user[socket.id] },
          { online: false }
        );
        delete user[socket.id];
      }
    });
  });
}

module.exports = socket;
