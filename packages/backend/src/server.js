import app from "./app.js";
import "./jobs/GeneracionTurnosJob.js"; //mover a otro
import { MongoDBClient } from "./config/database.js";

const puerto = process.env.PORT || 4000;



const start = async () => {
    try {

        await MongoDBClient.connect();

        app.listen(puerto, () => {
            console.log("El servidor inicio en el puerto " + puerto);
        });

    } catch (error) {
        console.error(error);
    }
}

start();