import express from "express";
import Reservation from "../models/Reservation.js";
import ParkingSlot from "../models/ParkingSlot.js";

const router = express.Router();

// Crear una reservación
router.post("/", async (req, res) => {
  try {
    const { userId, slotId } = req.body;

    // Verificar si el usuario ya tiene una reservación activa o reservada
    const reservacionActiva = await Reservation.findOne({
      userId,
      estado: { $in: ["reservado", "activa"] },   // ✅ CORRECTO
    });

    if (reservacionActiva) {
      return res.status(400).json({
        error:
          "Ya tienes una reservación activa. Debes concluirla antes de reservar otro cajón.",
      });
    }

    // Validar cajón
    const slot = await ParkingSlot.findById(slotId);
    if (!slot) return res.status(404).json({ error: "Cajón no encontrado" });

    if (slot.estado !== "libre") {
      return res.status(400).json({ error: "El cajón no está disponible" });
    }

    // Crear reservación
    const reservation = new Reservation({
      userId,
      slotId,
      fechaInicio: null,
      fechaFin: null,
      estado: "reservado",
    });

    await reservation.save();

    // Cambiar estado del slot
    slot.estado = "reservado";
    await slot.save();

    // Asignar QR (id simple)
    const qrValue = reservation._id.toString();
    reservation.qrCode = qrValue;
    await reservation.save();

    res.json({
      message: "Reservación creada",
      reservation,
      qrValue,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al crear la reservación" });
  }
});

// Obtener todas las reservaciones (Historial)
router.get("/usuario/:userId", async (req, res) => {
  try {
    const reservations = await Reservation.find({
      userId: req.params.userId,
    })
      .populate("slotId")
      .sort({ fechaInicio: -1 });

    res.json(reservations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener las reservaciones" });
  }
});

// Obtener solo las activas
router.get("/usuario/:userId/activas", async (req, res) => {
  try {
    const reservations = await Reservation.find({
      userId: req.params.userId,
      estado: { $in: ["reservado", "activa"] },   // 🔥 CORREGIDO
    }).populate("slotId");

    res.json(reservations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener reservaciones activas" });
  }
});

export default router;
