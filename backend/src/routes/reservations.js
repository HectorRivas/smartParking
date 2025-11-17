import express from "express";
import Reservation from "../models/Reservation.js";
import ParkingSlot from "../models/ParkingSlot.js";

const router = express.Router();

// Crear una reservación
router.post("/", async (req, res) => {
  try {
    const { userId, slotId, fechaInicio, fechaFin } = req.body;

    // Validar si el cajón existe y está libre
    const slot = await ParkingSlot.findById(slotId);
    if (!slot) return res.status(404).json({ error: "Cajón no encontrado" });
    if (slot.estado !== "libre") {
      return res.status(400).json({ error: "El cajón no está disponible" });
    }

    // Crear reservación
    const reservation = new Reservation({
      userId,
      slotId,
      fechaInicio,
      fechaFin,
    });
    await reservation.save();

    // Marcar cajón como reservado
    slot.estado = "reservado";
    await slot.save();

    // Generar QR (simple ejemplo, usar ID de la reservación como valor)
    const qrValue = reservation._id.toString();

    res.json({ message: "Reservación creada", reservation, qrValue });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al crear la reservación" });
  }
});

// Obtener todas las reservaciones de un usuario (historial completo)
router.get("/usuario/:userId", async (req, res) => {
  try {
    const reservations = await Reservation.find({ userId: req.params.userId })
      .populate("slotId") // para mostrar info del cajón
      .sort({ fechaInicio: -1 });

    res.json(reservations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener las reservaciones" });
  }
});

// Obtener solo reservaciones activas de un usuario
router.get("/usuario/:userId/activas", async (req, res) => {
  try {
    const reservations = await Reservation.find({
      userId: req.params.userId,
      estado: "activa",
    }).populate("slotId");

    res.json(reservations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener reservaciones activas" });
  }
});

export default router;
