const jwt = require("jsonwebtoken");
const Token = require("../models/Token");

let token = null;

const middleware = {
  checkToken: async (req, res, next) => {
    try {
      const { _id } = req?.headers?._id
        ? req.headers
        : req?.params?._id
        ? req.params
        : req?.body?._id
        ? req.body
        : req.query;

      token = await Token.findOne({ _id });

      const accessToken = req.headers["token"].split(" ")[1];
      const refreshToken = token.refreshToken;

      if (!accessToken || !refreshToken) {
        return res.status(400).json({ msg: "Please login first." });
      }

      const decodedAccessToken = await jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET
      );

      const decodedRefreshToken = await jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );

      if (decodedAccessToken.iat !== decodedRefreshToken.iat) {
        return res.status(400).json({ msg: "Please login again." });
      }

      if (_id !== decodedAccessToken._id || _id !== decodedRefreshToken._id) {
        return res.status(400).json({ msg: "You are not allowed to do that." });
      }

      next();
    } catch (error) {
      const refreshToken = token.refreshToken;

      await jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, decoded) => {
          if (err) {
            return res.status(500).json({
              msg: "Please login again.",
              navigate: "/auth",
              error,
            });
          }

          //refresh_token
          if (req.path === "/refresh_token") {
            next();
          } else {
            return res.status(500).json({
              msg: "Token expired",
              navigate: "/auth",
              error,
            });
          }
        }
      );
    }
  },
};

module.exports = middleware;
