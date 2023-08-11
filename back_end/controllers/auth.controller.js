const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Room = require("../models/Room");

const auth = {
  register: async (req, res) => {
    try {
      const regexEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
      const regexPassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/g;

      const { username, email, password } = req.body;
      if (!username || !email || !password) {
        return res.status(400).json({ msg: "Please fill in all fields." });
      }

      if (!regexEmail.test(email)) {
        return res.status(400).json({ msg: "Invalid email." });
      }

      if (!regexPassword.test(password)) {
        return res.status(400).json({
          msg: "Password must be at least 6 characters long and must contain at least 1 letter and 1 number.",
        });
      }

      const user = await User.findOne({ email });

      if (user) {
        return res.status(400).json({ msg: "Email already exists." });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = new User({
        username,
        email,
        password: hashedPassword,
        keyword:
          (await auth.generateKeywords(username)) +
          (await auth.generateKeywords(email.split("@")[0])),
      });
      await newUser.save();

      await Room.findByIdAndUpdate("64c92c5e5023b05bbc05563e", {
        $push: {
          members: newUser._id,
        },
      });

      return res.status(200).json({ msg: "Register Success!" });
    } catch (error) {
      return res
        .status(500)
        .json({ msg: "Register Failed! Reason: " + error.message });
    }
  },
  generateAccessToken: async (user) => {
    return await jwt.sign(
      {
        _id: user._id,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: 60 * 60,
      }
    );
  },
  generateRefreshToken: async (user) => {
    return await jwt.sign(
      {
        _id: user._id,
      },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: 60 * 15,
      }
    );
  },
  generateKeywords: async (displayName) => {
    const name = displayName.split(" ").filter((word) => word);

    const length = name.length;
    let flagArray = [];
    let result = [];
    let stringArray = [];

    for (let i = 0; i < length; i++) {
      flagArray[i] = false;
    }

    const createKeywords = (name) => {
      const arrName = [];
      let curName = "";
      name.split("").forEach((letter) => {
        curName += letter;
        arrName.push(curName);
      });
      return arrName;
    };

    function findPermutation(k) {
      for (let i = 0; i < length; i++) {
        if (!flagArray[i]) {
          flagArray[i] = true;
          result[k] = name[i];

          if (k === length - 1) {
            stringArray.push(result.join(" "));
          }

          findPermutation(k + 1);
          flagArray[i] = false;
        }
      }
    }

    findPermutation(0);

    const keywords = stringArray.reduce((acc, cur) => {
      const words = createKeywords(cur);
      return [...acc, ...words];
    }, []);

    return keywords;
  },
  login: async (req, res) => {
    try {
      const regexEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
      const regexPassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/g;

      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ msg: "Please fill in all fields." });
      }

      if (!regexEmail.test(email)) {
        return res.status(400).json({ msg: "Invalid email." });
      }

      if (!regexPassword.test(password)) {
        return res.status(400).json({
          msg: "Password must be at least 6 characters long and must contain at least 1 letter and 1 number.",
        });
      }

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ msg: "Email does not exist." });
      }

      const comparePassword = await bcrypt.compare(password, user.password);

      if (!comparePassword) {
        return res.status(400).json({ msg: "Password is incorrect." });
      }

      const accessToken = await auth.generateAccessToken(user);

      const refreshToken = await auth.generateRefreshToken(user);

      console.log(refreshToken);
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        path: "/",
        secure: true,
        sameSite: "strict",
      });

      const { password: hashedPassword, ...others } = user._doc;

      return res.status(200).json({
        ...others,
        accessToken,
      });
    } catch (error) {
      return res.status(500).json({ msg: "Login Failed! Reason: " + error });
    }
  },
  logout: async (req, res) => {
    try {
      res.clearCookie("refreshToken", {
        httpOnly: true,
        path: "/",
        secure: false,
        sameSite: "strict",
      });

      return res.json({
        msg: "Logout Success!",
      });
    } catch (error) {
      return res.status(500).json({ msg: "Logout Failed! Reason: " + error });
    }
  },
  refreshToken: async (req, res) => {
    try {
      const { refreshToken } = req.cookies;

      const decoded = await jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );

      const accessToken = await auth.generateAccessToken(decoded);
      const newRefreshToken = await auth.generateRefreshToken(decoded);

      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        path: "/",
        secure: false,
        sameSite: "strict",
      });

      return res.status(200).json({ accessToken });
    } catch (error) {
      return res
        .status(500)
        .json({ msg: "Refresh Token Failed! Reason: " + error });
    }
  },
};

auth.generateKeywords("Nguyen Van A");

module.exports = auth;
