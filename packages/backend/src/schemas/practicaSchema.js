import mongoose from 'mongoose';
import { ServicioMedModel } from './ServicioMedSchema';

const practicaSchema = new mongoose.Schema({
  codigo: {
    type: String,
    required: true,
    unique: true
  }
}); // código es único de la práctica o cada práctica x médico tendra un código diferente?
    // por ahora son diferentes por cada uno. Caso contrario se pasa la logica al schema de ServicioSchema el código

export const EspecialidadModel = ServicioMedModel.discriminator(
  "practica",
  practicaSchema
);

