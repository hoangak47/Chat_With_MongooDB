const User = require("../models/User");
const bycrypt = require("bcrypt");

const user = {
  getUser: async (req, res) => {
    try {
      const { _id } = req.params;
      console.log(_id);
      const user = await User.findById(_id).select("-password");
      return res.json({ ...user._doc });
    } catch (error) {
      return res
        .status(500)
        .json({ msg: "Error while getting user. Reason: " + error });
    }
  },
  deleteUser: async (req, res) => {
    try {
      const { _id } = req.params;
      await User.findByIdAndDelete(_id);
      return res.json({ msg: "User deleted successfully." });
    } catch (error) {
      return res
        .status(500)
        .json({ msg: "Error while deleting user. Reason: " + error });
    }
  },
  updateUser: async (req, res) => {
    try {
      const { _id } = req.params;
      const user = await User.findById(_id);

      const { username, avatar, old_password, password } = req.body;

      const regexPassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/g;

      if (password) {
        if (!regexPassword.test(password)) {
          return res.status(400).json({
            msg: "Password must be at least 6 characters long and contain at least one letter and one number.",
            error_code: 2,
          });
        }

        const isMatch = await bycrypt.compare(old_password, user.password);
        if (!isMatch) {
          return res.status(400).json({
            msg: "Old password is incorrect.",
            error_code: 1,
          });
        }

        const salt = await bycrypt.genSalt(10);
        const hashedPassword = await bycrypt.hash(password, salt);

        await User.findByIdAndUpdate(_id, {
          $set: {
            password: hashedPassword,
          },
          $currentDate: {
            updatedAt: true,
          },
        });

        return res.json({ msg: "Password updated successfully." });
      }

      if (!username) {
        return res.status(400).json({ msg: "Username is required." });
      }

      if (username === user.username) {
        return res.status(400).json({ msg: "Still the same username." });
      }

      await User.findByIdAndUpdate(_id, {
        $set: {
          username,
          avatar,
        },
        $currentDate: {
          updatedAt: true,
        },
      });

      const { password: _, ...rest } = user._doc;

      return res.json({
        ...rest,
        username,
        avatar: avatar || null,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ msg: "Error while updating user. Reason: " + error });
    }
  },
};

module.exports = user;
