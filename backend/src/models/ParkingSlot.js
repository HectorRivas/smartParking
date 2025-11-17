import mongoose from "mongoose";

const parkingSlotSchema = new mongoose.Schema({
  numero: { type: Number, required: true, unique: true },
  ubicacion: { type: String, required: true },
  estado: {
    type: String,
    enum: ["libre", "reservado", "ocupado"],
    default: "libre",
  },
});

const ParkingSlot = mongoose.model("ParkingSlot", parkingSlotSchema);

export default ParkingSlot;

