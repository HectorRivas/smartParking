import mongoose from "mongoose";

const spotSchema = new mongoose.Schema({
  number: { type: Number, required: true, unique: true }, // Número del cajón
  status: { 
    type: String, 
    enum: ["libre", "ocupado", "reservado"], 
    default: "libre" 
  },
  location: { type: String, default: "" }, // opcional (Zona A, B, etc.)
});

export default mongoose.model("Spot", spotSchema);
