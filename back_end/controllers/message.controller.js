const Message = require("../models/Message");
const User = require("../models/User");

const message = {
  getMessages: async (req, res) => {
    try {
      const { room } = req.params;
      const { page } = req.query || 1;

      const messages = await Message.find({ room })
        .limit(15)
        .skip(15 * (page - 1))
        .sort({ createdAt: -1 });

      if (messages.length > 0) {
        const members_read = await Promise.all(
          messages[0]?.read?.map(async (item) => {
            const read = await User.find({
              _id: { $in: item },
            }).select("_id username avatar");

            return Object.assign({}, read[0]._doc);
          })
        );

        messages[0]._doc.read = members_read;
      }

      if (messages) {
        return res.json(messages.reverse());
      }
    } catch (error) {
      return res
        .status(500)
        .json({ msg: "Get messages failed. Reason: " + error });
    }
  },
  createMessage: async (req, res) => {
    try {
      const { msg, picture } = req.body;
      const { room } = req.params;
      const { _id } = req.headers;

      const newMessage = new Message({
        msg,
        sender: _id,
        room,
        read: [_id],
        picture,
      });

      await newMessage.save();

      const newDataMess = await Message.find({ room });

      res.json(newDataMess);
    } catch (error) {
      return res
        .status(500)
        .json({ msg: "Send message failed. Reason: " + error });
    }
  },
};

module.exports = message;
