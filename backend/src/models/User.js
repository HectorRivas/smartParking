import mongoose from "mongoose";
//Prueba
const userSchema = new mongoose.Schema({
  nombre: { type: String, required: true, unique: true },
  contraseña: { type: String, required: true },
  correo: { type: String },
  telefono: { type: String },
});

const User = mongoose.model("User", userSchema);

export default User;
