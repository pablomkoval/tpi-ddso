import express from "express";
import MedicoController from "../../../controllers/MedicoController.js";

const router = express.Router();
const medicoController = new MedicoController();

router.route('/')
    .get((req,res) => medicoController.findAll(req,res))

router.route('/')
    .post((req,res) => medicoController.create(req,res))

router.route('/:id')
    .get((req,res) => medicoController.findById(req,res))