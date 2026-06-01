import mongoose from 'mongoose';
import { ServicioMedModel } from './ServicioMedSchema.js';

const especialidadSchema = new mongoose.Schema({});

export const EspecialidadModel = ServicioMedModel.discriminator(
  "especialidad",
  especialidadSchema
);

