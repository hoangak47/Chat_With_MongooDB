const router = require("express").Router();
const {
  register,
  login,
  logout,
  refreshToken,
} = require("../controllers/auth.controller");
const middleware = require("../controllers/middleware");

router.post("/register", register);
router.post("/login", login);
router.get("/logout", middleware.checkToken, logout);
router.get("/refresh_token", middleware.checkToken, refreshToken);

module.exports = router;
