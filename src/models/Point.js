const mongoose = require("mongoose");
const Point = new mongoose.Schema({
  type: {
    type: String,
    enum: ["Point"],
    required: true,
    default: "Point"
  },
  coordinates: {
    type: [Number],
    required: true
  }
});

module.exports = Point;
