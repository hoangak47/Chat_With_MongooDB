const router = require("express").Router();

const middleware = require("../controllers/middleware");
const { searchUser } = require("../controllers/search.controller");

router.get("/", middleware.checkToken, searchUser);

module.exports = router;
