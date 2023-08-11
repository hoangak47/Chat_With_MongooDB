const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const connectDB = require("./utils/connectDB");
const http = require("http");
const socket_ = require("./utils/socket.io");

const app = express();

const server = http.createServer(app);

const { Server } = require("socket.io");

const io = new Server(server, {
  cors: {
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    origin: true,
    exposedHeaders: ["set-cookie"],
  },
});

app.use(express.json());

app.use(
  cors({
    origin: ["https://www.thecaovn.space", "http://localhost:3000"],
    credentials: true,
    exposedHeaders: ["set-cookie"],
  })
);

app.use(cookieParser());
dotenv.config();

connectDB();

app.use(function (req, res, next) {
  res.header("Content-Type", "application/json;charset=UTF-8");
  res.header("Access-Control-Allow-Credentials", true);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use("/api/auth", require("./routers/auth.router"));
app.use("/api/user", require("./routers/user.router.js"));
app.use("/api/room", require("./routers/room.router.js"));
app.use("/api/message", require("./routers/message.router.js"));
app.use("/api/search", require("./routers/search.router.js"));

socket_(io);

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500).send({
    message: error.message,
  });
});

server.listen(5000, () => {
  console.log("Server is running on port 5000");
});
