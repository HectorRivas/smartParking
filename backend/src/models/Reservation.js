import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  slotId: { type: mongoose.Schema.Types.ObjectId, ref: "ParkingSlot", required: true },
  fechaInicio: { type: Date, required: true },
  fechaFin: { type: Date, required: true },
  estado: {
    type: String,
    enum: ["reservado", "activa", "completada", "cancelada"],
    default: "reservado",
  },
  qrCode: { type: String, unique: true }, // nuevo campo para generar QR
});

const Reservation = mongoose.model("Reservation", reservationSchema);

export default Reservation;
