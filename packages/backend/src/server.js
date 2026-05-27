import app from "./app.js";
import { MongoDBClient } from "./config/database.js";

const puerto =  3000;

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