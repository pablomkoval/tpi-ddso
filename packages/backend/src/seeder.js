import app from "./app.js";
import { MongoDBClient } from "./config/database.js";
import { TipoServicio } from "./domain/enum/TipoServicio.js";
import { ServicioModel } from "./schemas/servicio.schema.js";
import { ObraSocialModel } from "./schemas/obraSocial.schema.js";
import { PlanModel } from "./schemas/plan.schema.js";

const puerto = 4000;

try {

    await MongoDBClient.connect();

    app.listen(puerto, () => {
        console.log("El servidor inicio en el puerto " + puerto);
    });

    await Promise.all([
        ServicioModel.deleteMany({}),
        PlanModel.deleteMany({}),
        ObraSocialModel.deleteMany({})
    ]);

    const serviciosIniciales = [
        { nombre: "Consulta Pediátrica", tipoServicio: TipoServicio.ESPECIALIDAD },
        { nombre: "Control Cardiológico", tipoServicio: TipoServicio.ESPECIALIDAD },
        { nombre: "Consulta Dermatológica", tipoServicio: TipoServicio.ESPECIALIDAD },
        { nombre: "Consulta Endocrinológica", tipoServicio: TipoServicio.ESPECIALIDAD },
        { nombre: "Vacunación", tipoServicio: TipoServicio.PRACTICA },
        { nombre: "Tomografía Computada", tipoServicio: TipoServicio.PRACTICA },
        { nombre: "Resonancia Magnética", tipoServicio: TipoServicio.PRACTICA },
        { nombre: "Consulta Oncológica", tipoServicio: TipoServicio.ESPECIALIDAD }
    ];

    await ServicioModel.insertMany(serviciosIniciales);

    // Crear Planes de Cobertura de Prueba
    const planesCreados = await PlanModel.insertMany([
        { nombre: "OSDE 210", coberturasEspecialidad: [], coberturasPractica: [] },
        { nombre: "OSDE 310", coberturasEspecialidad: [], coberturasPractica: [] },
        { nombre: "Swiss Medical SMG20", coberturasEspecialidad: [], coberturasPractica: [] },
        { nombre: "Swiss Medical SMG30", coberturasEspecialidad: [], coberturasPractica: [] },
        { nombre: "Particular / Sin Cobertura", coberturasEspecialidad: [], coberturasPractica: [] }
    ]);

    // Crear Obras Sociales vinculando sus planes
    await ObraSocialModel.insertMany([
        {
            nombre: "OSDE",
            planes: [planesCreados[0]._id, planesCreados[1]._id]
        },
        {
            nombre: "Swiss Medical",
            planes: [planesCreados[2]._id, planesCreados[3]._id]
        },
        {
            nombre: "Particular (Sin Obra Social)",
            planes: [planesCreados[4]._id]
        }
    ]);

    console.log("Se han creado las seeds")

} catch (error) {
    console.error(error);
}