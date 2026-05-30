import mongoose from 'mongoose';
import { Paciente } from "../domain/models/entities/paciente/Paciente.js";

const pacienteSchema = new mongoose.Schema({});

export const PacienteModel = new.mongoose.schema(

);

pacienteSchema.loadClass(Paciente);

export const PacienteModel = mongoose.model('Paciente', pacienteSchema);