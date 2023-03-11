const mongoose = require("../db/conn");
const { Schema } = mongoose;

const Task = mongoose.model(
  "Task",
  new Schema(
    {
      description: {
        type: String,
        required: true,
      },
      status: {
        type: String,
      },
      user: Object,
    },
    { timestamps: true }
  )
);

module.exports = Task;
