import express from "express";
import v1Router from "./routers/v1/v1.router.js";

const router = express.Router();

router.use("/v1", v1Router);

export default router;