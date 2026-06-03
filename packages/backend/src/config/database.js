import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({ path: new URL('../.env', import.meta.url) });

//CONEXION A LA BASE DE DATOS
export class MongoDBClient {
    static async connect() {
        try {
            console.log(process.env.MONGODB_URI);
            //const conn = await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.MONGODB_DB_NAME}`);
            const conn = await mongoose.connect("mongodb://localhost:27017/sweetMedical");
            console.log(`MongoDB is connected: ${conn.connection.host}`);
        } catch (error) {
            console.error(`Error: ${error.message}`);
            process.exit(1);
        }
    }
}