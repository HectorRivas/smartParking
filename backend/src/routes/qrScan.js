import express from "express";
import Reservation from "../models/Reservation.js";
import ParkingSlot from "../models/ParkingSlot.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { qrCode } = req.body;

    const reservation = await Reservation.findOne({ qrCode }).populate("slotId");

    if (!reservation) {
      return res.status(404).json({ error: "QR no válido" });
    }

    const slot = reservation.slotId;

    // 🛑 Reservación ya completada
    if (reservation.estado === "completada") {
      return res.status(400).json({
        error: "Esta reservación ya fue completada.",
      });
    }

    // 🔹 1️⃣ PRIMER ESCANEO → registrar entrada
    if (reservation.estado === "reservado") {
      reservation.estado = "activa";
      reservation.fechaInicio = new Date();

      slot.estado = "ocupado";

      await reservation.save();
      await slot.save();

      return res.json({
        message: "Entrada registrada",
        action: "entrada",
        slot: slot.numero,
      });
    }

    // 🔹 2️⃣ SEGUNDO ESCANEO → registrar salida
    if (reservation.estado === "activa") {
      reservation.estado = "completada";
      reservation.fechaFin = new Date();

      slot.estado = "libre";

      await reservation.save();
      await slot.save();

      return res.json({
        message: "Salida registrada",
        action: "salida",
        slot: slot.numero,
      });
    }

    // ❌ Si cae aquí, los estados no coinciden
    return res.status(400).json({
      error: "El QR no está en un estado válido para procesar.",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al procesar QR" });
  }

  // 🔒 BLOQUEAR ESCANEO POR 3 SEGUNDOS
  setTimeout(() => {
    setScanned(false);
  }, 3000);
});

export default router;
