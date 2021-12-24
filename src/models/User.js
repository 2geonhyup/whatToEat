import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  like: { type: String, trim: true},
  friends: [{ type: String, trim: true}],
});

const User = mongoose.model("User", userSchema);
export default User;