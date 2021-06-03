const { Schema, model } = require("mongoose");

const UserSchema = new Schema(
  {
    name: {
      type: String,
        required: true
    },
    email: {
      type: String,
      required: true
    },
    role: {
      type: String,
      default: "user",
      enum: ["user", "admin", "teacher","student"]
    },
    password: {
      type: String,
      required: true
    },
    courses:[{
      type:Schema.Types.ObjectId,ref:"courses"
    }],
    attendances:[{type:Schema.Types.ObjectId,ref:"Attendance"}]
  },
  { timestamps: true }
);

module.exports = model("users", UserSchema);
