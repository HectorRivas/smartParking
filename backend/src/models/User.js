import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  nombre: { type: String, required: true, unique: true },
  contraseña: { type: String, required: true },
  correo: { type: String },
  telefono: { type: String },
  isAdmin: { type: Boolean, default: false },
});

const User = mongoose.model("User", userSchema);

export default User;
