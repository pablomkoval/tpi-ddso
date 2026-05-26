import mongoose from 'mongoose';
import { ServicioMedModel } from './servicioMedSchema';

const practicaSchema = new mongoose.Schema({
  codigo: {
    type: String,
    required: true,
    unique: true
  }
});

export const EspecialidadModel = ServicioMedModel.discriminator(
  "practica",
  practicaSchema
);

