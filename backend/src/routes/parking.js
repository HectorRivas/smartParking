import express from "express";
import { v4 as uuidv4 } from "uuid";
import ParkingSlot from "../models/ParkingSlot.js";
import Reservation from "../models/Reservation.js";

const router = express.Router();

// Obtener todos los cajones
router.get("/", async (req, res) => {
  try {
    const slots = await ParkingSlot.find().sort({ numero: 1 });
    res.json(slots);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener los cajones" });
  }
});

// Obtener solo cajones libres
router.get("/libres", async (req, res) => {
  try {
    const slots = await ParkingSlot.find({ estado: "libre" }).sort({ numero: 1 });
    res.json(slots);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener cajones libres" });
  }
});

// Crear un cajón nuevo (uso interno del admin)
router.post("/", async (req, res) => {
  try {
    const { numero, ubicacion } = req.body;

    if (!numero || !ubicacion) {
      return res.status(400).json({ error: "Debe proporcionar número y ubicación del cajón" });
    }

    const exists = await ParkingSlot.findOne({ numero });
    if (exists) return res.status(400).json({ error: "Ya existe un cajón con ese número" });

    const slot = new ParkingSlot({ numero, ubicacion });
    await slot.save();

    res.json(slot);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al crear el cajón" });
  }
});

// Reservar un cajón y generar QR
router.post("/reservar/:id", async (req, res) => {
  try {
    const { id } = req.params; // ID del cajón
    const { userId, duracionHoras = 1 } = req.body;

    const slot = await ParkingSlot.findById(id);
    if (!slot) return res.status(404).json({ error: "Cajón no encontrado" });
    if (slot.estado !== "libre") return res.status(400).json({ error: "Cajón no disponible" });

    // Cambiar estado a reservado
    slot.estado = "reservado";
    await slot.save();

    // Generar QR único
    const qrCode = uuidv4();

    // Crear reservación
    const fechaInicio = new Date();
    const fechaFin = new Date();
    fechaFin.setHours(fechaFin.getHours() + duracionHoras);

    const reservation = await Reservation.create({
      userId,
      slotId: slot._id,
      qrCode,
      fechaInicio,
      fechaFin,
    });

    res.json({ reservation, slot });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
