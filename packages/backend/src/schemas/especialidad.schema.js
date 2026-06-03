import mongoose from 'mongoose';
import { PrestacionModel } from './prestacion.schema.js';

const especialidadSchema = new mongoose.Schema({});

export const EspecialidadModel = PrestacionModel.discriminator(
  "especialidad",
  especialidadSchema
);

