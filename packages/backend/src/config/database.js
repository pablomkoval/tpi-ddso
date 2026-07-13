import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({ path: new URL('../.env', import.meta.url) });

// Registrar todos los schemas explícitamente para evitar problemas de populación asíncrona / orden de imports
import "../schemas/sede.schema.js";
import "../schemas/servicio.schema.js";
import "../schemas/prestacion.schema.js";
import "../schemas/plan.schema.js";
import "../schemas/medico.schema.js";
import "../schemas/paciente.schema.js";
import "../schemas/turno.schema.js";
import "../schemas/usuario.schema.js";
import "../schemas/notificacion.schema.js";
import "../schemas/solicitudCambioTurno.schema.js";

//CONEXION A LA BASE DE DATOS
export class MongoDBClient {
    static async connect() {
        try {
            const connectionString = process.env.MONGODB_URI || "mongodb://localhost:27017/sweetMedical";
            const options = {};
            if (process.env.MONGODB_DB_NAME) {
                options.dbName = process.env.MONGODB_DB_NAME;
            }
            const conn = await mongoose.connect(connectionString, options);
            console.log(`MongoDB is connected: ${conn.connection.host}`);
        } catch (error) {
            console.error(`Error: ${error.message}`);
            process.exit(1);
        }
    }
}