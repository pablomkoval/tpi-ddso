import mongoose from 'mongoose';
import { Paciente } from "../domain/models/entities/paciente/Paciente.js";

const pacienteSchema = new mongoose.Schema({



});


pacienteSchema.loadClass(Paciente);

export const PacienteModel = mongoose.model('Paciente', pacienteSchema);