const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    msg: {
      type: String,
      trim: true,
      required: true,
    },
    sender: {
      type: String,
      required: true,
    },
    room: {
      type: String,
      required: true,
    },
    picture: {
      type: Array,
      default: [],
    },
    // call: {
    //   type: Object,
    //   default: null,
    // },
    // video: {
    //   type: Boolean,
    //   default: false,
    // },
    read: [
      {
        type: String,
        default: null,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Message", messageSchema);
