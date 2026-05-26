import mongoose from 'mongoose';
import { ServicioMedModel } from './servicioMedSchema';

const especialidadSchema = new mongoose.Schema({});

export const EspecialidadModel = ServicioMedModel.discriminator(
  "especialidad",
  especialidadSchema
);

