const User = require("../models/User");

const search = {
  searchUser: async (req, res) => {
    try {
      const { keyword } = req.query;
      const { _id } = req.headers;

      const users = await User.find({
        keyword: {
          $regex: keyword,
          $options: "i",
        },
        _id: { $ne: _id },
      })
        .select("_id username email avatar online")
        .limit(10);

      return res.status(200).json(users);
    } catch (error) {
      return res
        .status(500)
        .json({ msg: "Error while searching user. Reason: " + error });
    }
  },
};

module.exports = search;
