import express from "express";
import turnoController from "../../../controllers/turnoController.js";

const turnoRouter = express.Router();

turnoRouter.get("/disponibles", turnoController.getDisponibles);

turnoRouter.get("/:id", turnoController.getById);

export default turnoRouter;
