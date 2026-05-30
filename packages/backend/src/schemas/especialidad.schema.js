import mongoose from 'mongoose';
import { ServicioMedModel } from './ServicioMedSchema';

const especialidadSchema = new mongoose.Schema({});

export const EspecialidadModel = ServicioMedModel.discriminator(
  "especialidad",
  especialidadSchema
);

