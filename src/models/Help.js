const mongoose = require("mongoose");
const helpStatusEnum = require("../utils/enums/helpStatusEnum");

const helpSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      maxlength: 120,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(helpStatusEnum),
      default: helpStatusEnum.WAITING,
    },
    possibleHelpers: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      required: false,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    helperId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    creationDate: {
      type: Date,
      default: Date.now,
    },
    finishedDate: {
      type: Date,
      required: false,
    },
    active: {
      default: true,
      type: Boolean,
    },
  },
  {
    collection: "userHelp",
    toObject: {
      virtuals: true,
    },
    toJSON: {
      virtuals: true,
    },
  }
);

helpSchema.virtual("category", {
  ref: "Category",
  localField: "categoryId",
  foreignField: "_id",
});
helpSchema.virtual("user", {
  ref: "User",
  localField: "ownerId",
  foreignField: "_id",
});

module.exports = mongoose.model("Help", helpSchema);
