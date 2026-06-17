import app from "./app.js";
import { MongoDBClient } from "./config/database.js";
import { TipoServicio } from "./domain/enum/TipoServicio.js";
import { ServicioModel } from "./schemas/servicio.schema.js";

const puerto = 4000;

try {

    await MongoDBClient.connect();

    app.listen(puerto, () => {
        console.log("El servidor inicio en el puerto " + puerto);
    });

    const serviciosIniciales = [
        { nombre: "Consulta Pediátrica", tipoServicio: TipoServicio.ESPECIALIDAD },
        { nombre: "Control Cardiológico", tipoServicio: TipoServicio.ESPECIALIDAD },
        { nombre: "Consulta Dermatológica", tipoServicio: TipoServicio.ESPECIALIDAD },
        { nombre: "Consulta Endocrinológica", tipoServicio: TipoServicio.ESPECIALIDAD },
        { nombre: "Vacunación", tipoServicio: TipoServicio.PRACTICA },
        { nombre: "Tomografía Computada", tipoServicio: TipoServicio.PRACTICA },
        { nombre: "Resonancia Magnética", tipoServicio: TipoServicio.PRACTICA },
        { nombre: "Consulta Oncológica", tipoServicio: TipoServicio.ESPECIALIDAD }
    ]

    ServicioModel.insertMany(serviciosIniciales)

    console.log("Se han creado las seeds")

} catch (error) {
    console.error(error);
}