import express from "express";
import { createSpot, getSpots } from "../controllers/spotController.js";

const router = express.Router();

router.post("/", createSpot);
router.get("/", getSpots);


export default router;
