import Spot from "../models/Spot.js";

export const createSpot = async (req, res) => {
  try {
    const { number, location } = req.body;

    const exists = await Spot.findOne({ number });
    if (exists) return res.status(400).json({ msg: "Ese cajón ya existe" });

    const spot = await Spot.create({ number, location });

    res.json(spot);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getSpots = async (req, res) => {
  try {
    const spots = await Spot.find().sort({ number: 1 });
    res.json(spots);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};