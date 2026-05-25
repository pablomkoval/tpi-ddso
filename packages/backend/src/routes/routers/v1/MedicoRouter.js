import express from "express";
import MedicoController from "../../../controllers/MedicoController.js";

const router = express.Router();
const medicoController = new MedicoController();

router.route('/')
    .get((req, res, next) => medicoController.findAll(req, res, next))

router.route('/')
    .post((req, res, next) => medicoController.create(req, res, next))

router.route('/:id')
    .get((req, res, next) => medicoController.findById(req, res, next))