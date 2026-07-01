import app from "./app.js";
import { MongoDBClient } from "./config/database.js";
import { TipoServicio } from "./domain/enum/TipoServicio.js";
import { ServicioModel } from "./schemas/servicio.schema.js";
import { ObraSocialModel } from "./schemas/obraSocial.schema.js";
import { PlanModel } from "./schemas/plan.schema.js";
import { SedeModel } from "./schemas/sede.schema.js";
import { MedicoModel } from "./schemas/medico.schema.js";
import { PacienteModel } from "./schemas/paciente.schema.js";
import { TurnoModel } from "./schemas/turno.schema.js";
import { PrestacionModel } from "./schemas/prestacion.schema.js";

const puerto = 4000;

try {

    await MongoDBClient.connect();

    app.listen(puerto, () => {
        console.log("El servidor inicio en el puerto " + puerto);
    });

    console.log("Limpiando la base de datos...");
    await Promise.all([
        ServicioModel.deleteMany({}),
        PlanModel.deleteMany({}),
        ObraSocialModel.deleteMany({}),
        SedeModel.deleteMany({}),
        MedicoModel.deleteMany({}),
        PacienteModel.deleteMany({}),
        TurnoModel.deleteMany({}),
        PrestacionModel.deleteMany({})
    ]);
    console.log("Base de datos limpia.");

    const sedesIniciales = [
        { id: "sede-central", nombre: "Sede Central", direccion: "Av. Corrientes 1234, CABA" },
        { id: "sede-norte", nombre: "Sede Norte", direccion: "Av. Cabildo 2500, CABA" },
        { id: "sede-oeste", nombre: "Sede Oeste", direccion: "Av. Rivadavia 6500, CABA" },
        { id: "sede-sur", nombre: "Sede Sur", direccion: "Av. Hipólito Yrigoyen 4000, Lanús" }
    ];
    const sedesCreadas = await SedeModel.insertMany(sedesIniciales);
    console.log(`${sedesCreadas.length} sedes creadas.`);

    const serviciosIniciales = [
        
        { nombre: "Pediatría", tipoServicio: TipoServicio.ESPECIALIDAD },
        { nombre: "Cardiología", tipoServicio: TipoServicio.ESPECIALIDAD },
        { nombre: "Dermatología", tipoServicio: TipoServicio.ESPECIALIDAD },
        { nombre: "Endocrinología", tipoServicio: TipoServicio.ESPECIALIDAD },
        { nombre: "Oncología", tipoServicio: TipoServicio.ESPECIALIDAD },
        { nombre: "Ginecología", tipoServicio: TipoServicio.ESPECIALIDAD },
        { nombre: "Traumatología", tipoServicio: TipoServicio.ESPECIALIDAD },
        { nombre: "Neurología", tipoServicio: TipoServicio.ESPECIALIDAD },
        { nombre: "Oftalmología", tipoServicio: TipoServicio.ESPECIALIDAD },

        { nombre: "Vacunación", tipoServicio: TipoServicio.PRACTICA },
        { nombre: "Tomografía Computada", tipoServicio: TipoServicio.PRACTICA },
        { nombre: "Resonancia Magnética", tipoServicio: TipoServicio.PRACTICA },
        { nombre: "Ecografía Abdominal", tipoServicio: TipoServicio.PRACTICA },
        { nombre: "Electrocardiograma", tipoServicio: TipoServicio.PRACTICA },
        { nombre: "Análisis de Sangre Completo", tipoServicio: TipoServicio.PRACTICA },
        { nombre: "Radiografía de Tórax", tipoServicio: TipoServicio.PRACTICA },
        { nombre: "Endoscopía", tipoServicio: TipoServicio.PRACTICA }
    ];
    const serviciosCreados = await ServicioModel.insertMany(serviciosIniciales);
    console.log(`${serviciosCreados.length} servicios de catálogo creados.`);


    const planesIniciales = [
        
        { nombre: "OSDE 210", coberturasEspecialidad: [], coberturasPractica: [] },
        { nombre: "OSDE 310", coberturasEspecialidad: [], coberturasPractica: [] },
        { nombre: "OSDE 410", coberturasEspecialidad: [], coberturasPractica: [] },
        { nombre: "OSDE 450", coberturasEspecialidad: [], coberturasPractica: [] },
        
        { nombre: "Swiss Medical SMG20", coberturasEspecialidad: [], coberturasPractica: [] },
        { nombre: "Swiss Medical SMG30", coberturasEspecialidad: [], coberturasPractica: [] },
        { nombre: "Swiss Medical SMG40", coberturasEspecialidad: [], coberturasPractica: [] },
        { nombre: "Swiss Medical SMG50", coberturasEspecialidad: [], coberturasPractica: [] },
        
        { nombre: "Galeno Oro", coberturasEspecialidad: [], coberturasPractica: [] },
        { nombre: "Galeno Plata", coberturasEspecialidad: [], coberturasPractica: [] },
        { nombre: "Galeno Azul", coberturasEspecialidad: [], coberturasPractica: [] },
        
        { nombre: "Particular / Sin Cobertura", coberturasEspecialidad: [], coberturasPractica: [] }
    ];
    const planesCreados = await PlanModel.insertMany(planesIniciales);
    console.log(`${planesCreados.length} planes de cobertura creados.`);

    const obrasSocialesIniciales = [
        {
            nombre: "OSDE",
            planes: [planesCreados[0]._id, planesCreados[1]._id, planesCreados[2]._id, planesCreados[3]._id]
        },
        {
            nombre: "Swiss Medical",
            planes: [planesCreados[4]._id, planesCreados[5]._id, planesCreados[6]._id, planesCreados[7]._id]
        },
        {
            nombre: "Galeno",
            planes: [planesCreados[8]._id, planesCreados[9]._id, planesCreados[10]._id]
        },
        {
            nombre: "Particular (Sin Obra Social)",
            planes: [planesCreados[11]._id]
        }
    ];
    const obrasSocialesCreadas = await ObraSocialModel.insertMany(obrasSocialesIniciales);
    console.log(`${obrasSocialesCreadas.length} obras sociales creadas.`);

    console.log("Se han creado las seeds con éxito.");

} catch (error) {
    console.error("Error al ejecutar el seeder:", error);
}