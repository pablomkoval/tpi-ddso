import app from "./app.js";
import { MongoDBClient } from "./config/database.js";
import { TipoServicio } from "./domain/enum/TipoServicio.js";
import { NivelCobertura } from "./domain/enum/NivelCobertura.js";
import { ServicioModel } from "./schemas/servicio.schema.js";
import { ObraSocialModel } from "./schemas/obraSocial.schema.js";
import { PlanModel } from "./schemas/plan.schema.js";
import { SedeModel } from "./schemas/sede.schema.js";
import { MedicoModel } from "./schemas/medico.schema.js";
import { PacienteModel } from "./schemas/paciente.schema.js";
import { TurnoModel } from "./schemas/turno.schema.js";
import { PrestacionModel } from "./schemas/prestacion.schema.js";
import { EspecialidadModel } from "./schemas/especialidad.schema.js";
import { PracticaModel } from "./schemas/practica.schema.js";
import { UsuarioModel } from "./schemas/usuario.schema.js";

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
        PrestacionModel.deleteMany({}),
        UsuarioModel.deleteMany({})
    ]);
    console.log("Base de datos limpia.");

    // 1. Crear Sedes
    const sedesIniciales = [
        { id: "sede-central", nombre: "Sede Central", direccion: "Av. Corrientes 1234, CABA" },
        { id: "sede-norte", nombre: "Sede Norte", direccion: "Av. Cabildo 2500, CABA" },
        { id: "sede-oeste", nombre: "Sede Oeste", direccion: "Av. Rivadavia 6500, CABA" },
        { id: "sede-sur", nombre: "Sede Sur", direccion: "Av. Hipólito Yrigoyen 4000, Lanús" }
    ];
    const sedesCreadas = await SedeModel.insertMany(sedesIniciales);
    console.log(`${sedesCreadas.length} sedes creadas.`);

    // 2. Crear Servicios Catálogo
    const serviciosIniciales = [
        { nombre: "Pediatría", tipoServicio: TipoServicio.ESPECIALIDAD },
        { nombre: "Cardiología", tipoServicio: TipoServicio.ESPECIALIDAD },
        { nombre: "Dermatología", tipoServicio: TipoServicio.ESPECIALIDAD },
        { nombre: "Endocrinología", tipoServicio: TipoServicio.ESPECIALIDAD },
        { nombre: "Ginecología", tipoServicio: TipoServicio.ESPECIALIDAD },
        
        { nombre: "Vacunación", tipoServicio: TipoServicio.PRACTICA },
        { nombre: "Tomografía Computada", tipoServicio: TipoServicio.PRACTICA },
        { nombre: "Resonancia Magnética", tipoServicio: TipoServicio.PRACTICA },
        { nombre: "Ecografía Abdominal", tipoServicio: TipoServicio.PRACTICA }
    ];
    const serviciosCreados = await ServicioModel.insertMany(serviciosIniciales);
    console.log(`${serviciosCreados.length} servicios de catálogo creados.`);

    // 3. Crear Prestaciones Médicas (Instancias de los servicios con costo/duración)
    const prestacionesCreadas = [];
    
    // Especialidades
    const pediatriaServ = serviciosCreados.find(s => s.nombre === "Pediatría");
    const cardiologiaServ = serviciosCreados.find(s => s.nombre === "Cardiología");
    const dermatologiaServ = serviciosCreados.find(s => s.nombre === "Dermatología");
    const endocrinologiaServ = serviciosCreados.find(s => s.nombre === "Endocrinología");
    const ginecologiaServ = serviciosCreados.find(s => s.nombre === "Ginecología");

    const pediatriaPreston = await EspecialidadModel.create({
        servicioUnico: pediatriaServ._id,
        duracionTurnoEnMins: 20,
        costo: 3000
    });
    const cardiologiaPreston = await EspecialidadModel.create({
        servicioUnico: cardiologiaServ._id,
        duracionTurnoEnMins: 30,
        costo: 4500
    });
    const dermatologiaPreston = await EspecialidadModel.create({
        servicioUnico: dermatologiaServ._id,
        duracionTurnoEnMins: 20,
        costo: 4000
    });
    const endocrinologiaPreston = await EspecialidadModel.create({
        servicioUnico: endocrinologiaServ._id,
        duracionTurnoEnMins: 30,
        costo: 3500
    });
    const ginecologiaPreston = await EspecialidadModel.create({
        servicioUnico: ginecologiaServ._id,
        duracionTurnoEnMins: 30,
        costo: 5000
    });

    // Prácticas
    const vacunacionServ = serviciosCreados.find(s => s.nombre === "Vacunación");
    const tomografiaServ = serviciosCreados.find(s => s.nombre === "Tomografía Computada");
    const resonanciaServ = serviciosCreados.find(s => s.nombre === "Resonancia Magnética");
    const ecografiaServ = serviciosCreados.find(s => s.nombre === "Ecografía Abdominal");

    const vacunacionPreston = await PracticaModel.create({
        servicioUnico: vacunacionServ._id,
        duracionTurnoEnMins: 15,
        costo: 1500,
        codigo: "PRACT-VAC-01"
    });
    const tomografiaPreston = await PracticaModel.create({
        servicioUnico: tomografiaServ._id,
        duracionTurnoEnMins: 45,
        costo: 8000,
        codigo: "PRACT-TOM-02"
    });
    const resonanciaPreston = await PracticaModel.create({
        servicioUnico: resonanciaServ._id,
        duracionTurnoEnMins: 60,
        costo: 12000,
        codigo: "PRACT-RES-03"
    });
    const ecografiaPreston = await PracticaModel.create({
        servicioUnico: ecografiaServ._id,
        duracionTurnoEnMins: 30,
        costo: 3500,
        codigo: "PRACT-ECO-04"
    });

    console.log("Prestaciones de especialidades y prácticas creadas.");

    // 4. Crear Planes de Cobertura vinculados a las prestaciones creadas
    const planesIniciales = [
        {
            nombre: "OSDE 210",
            coberturasEspecialidad: [
                { prestacion: pediatriaPreston._id, nivel: NivelCobertura.TOTAL },
                { prestacion: cardiologiaPreston._id, nivel: NivelCobertura.PARCIAL },
                { prestacion: dermatologiaPreston._id, nivel: NivelCobertura.NO_CUBIERTA },
                { prestacion: endocrinologiaPreston._id, nivel: NivelCobertura.PARCIAL },
                { prestacion: ginecologiaPreston._id, nivel: NivelCobertura.TOTAL }
            ],
            coberturasPractica: [
                { practica: vacunacionPreston._id, nivel: NivelCobertura.TOTAL },
                { practica: ecografiaPreston._id, nivel: NivelCobertura.PARCIAL },
                { practica: tomografiaPreston._id, nivel: NivelCobertura.NO_CUBIERTA },
                { practica: resonanciaPreston._id, nivel: NivelCobertura.NO_CUBIERTA }
            ]
        },
        {
            nombre: "OSDE 310",
            coberturasEspecialidad: [
                { prestacion: pediatriaPreston._id, nivel: NivelCobertura.TOTAL },
                { prestacion: cardiologiaPreston._id, nivel: NivelCobertura.TOTAL },
                { prestacion: dermatologiaPreston._id, nivel: NivelCobertura.PARCIAL },
                { prestacion: endocrinologiaPreston._id, nivel: NivelCobertura.TOTAL },
                { prestacion: ginecologiaPreston._id, nivel: NivelCobertura.TOTAL }
            ],
            coberturasPractica: [
                { practica: vacunacionPreston._id, nivel: NivelCobertura.TOTAL },
                { practica: ecografiaPreston._id, nivel: NivelCobertura.TOTAL },
                { practica: tomografiaPreston._id, nivel: NivelCobertura.PARCIAL },
                { practica: resonanciaPreston._id, nivel: NivelCobertura.PARCIAL }
            ]
        },
        {
            nombre: "OSDE 410",
            coberturasEspecialidad: [
                { prestacion: pediatriaPreston._id, nivel: NivelCobertura.TOTAL },
                { prestacion: cardiologiaPreston._id, nivel: NivelCobertura.TOTAL },
                { prestacion: dermatologiaPreston._id, nivel: NivelCobertura.TOTAL },
                { prestacion: endocrinologiaPreston._id, nivel: NivelCobertura.TOTAL },
                { prestacion: ginecologiaPreston._id, nivel: NivelCobertura.TOTAL }
            ],
            coberturasPractica: [
                { practica: vacunacionPreston._id, nivel: NivelCobertura.TOTAL },
                { practica: ecografiaPreston._id, nivel: NivelCobertura.TOTAL },
                { practica: tomografiaPreston._id, nivel: NivelCobertura.TOTAL },
                { practica: resonanciaPreston._id, nivel: NivelCobertura.TOTAL }
            ]
        },
        {
            nombre: "Swiss Medical SMG30",
            coberturasEspecialidad: [
                { prestacion: pediatriaPreston._id, nivel: NivelCobertura.TOTAL },
                { prestacion: cardiologiaPreston._id, nivel: NivelCobertura.PARCIAL },
                { prestacion: dermatologiaPreston._id, nivel: NivelCobertura.PARCIAL },
                { prestacion: endocrinologiaPreston._id, nivel: NivelCobertura.NO_CUBIERTA },
                { prestacion: ginecologiaPreston._id, nivel: NivelCobertura.TOTAL }
            ],
            coberturasPractica: [
                { practica: vacunacionPreston._id, nivel: NivelCobertura.TOTAL },
                { practica: ecografiaPreston._id, nivel: NivelCobertura.PARCIAL },
                { practica: tomografiaPreston._id, nivel: NivelCobertura.NO_CUBIERTA },
                { practica: resonanciaPreston._id, nivel: NivelCobertura.NO_CUBIERTA }
            ]
        },
        {
            nombre: "Swiss Medical SMG50",
            coberturasEspecialidad: [
                { prestacion: pediatriaPreston._id, nivel: NivelCobertura.TOTAL },
                { prestacion: cardiologiaPreston._id, nivel: NivelCobertura.TOTAL },
                { prestacion: dermatologiaPreston._id, nivel: NivelCobertura.TOTAL },
                { prestacion: endocrinologiaPreston._id, nivel: NivelCobertura.TOTAL },
                { prestacion: ginecologiaPreston._id, nivel: NivelCobertura.TOTAL }
            ],
            coberturasPractica: [
                { practica: vacunacionPreston._id, nivel: NivelCobertura.TOTAL },
                { practica: ecografiaPreston._id, nivel: NivelCobertura.TOTAL },
                { practica: tomografiaPreston._id, nivel: NivelCobertura.TOTAL },
                { practica: resonanciaPreston._id, nivel: NivelCobertura.TOTAL }
            ]
        },
        {
            nombre: "Galeno Plata",
            coberturasEspecialidad: [
                { prestacion: pediatriaPreston._id, nivel: NivelCobertura.TOTAL },
                { prestacion: ginecologiaPreston._id, nivel: NivelCobertura.TOTAL },
                { prestacion: cardiologiaPreston._id, nivel: NivelCobertura.PARCIAL }
            ],
            coberturasPractica: [
                { practica: vacunacionPreston._id, nivel: NivelCobertura.TOTAL },
                { practica: ecografiaPreston._id, nivel: NivelCobertura.PARCIAL }
            ]
        },
        {
            nombre: "Particular / Sin Cobertura",
            coberturasEspecialidad: [],
            coberturasPractica: []
        }
    ];

    const planesCreados = await PlanModel.insertMany(planesIniciales);
    console.log(`${planesCreados.length} planes de cobertura creados con sus prestaciones asociadas.`);

    // 5. Crear Obras Sociales agrupando los planes
    const obrasSocialesIniciales = [
        {
            nombre: "OSDE",
            planes: [planesCreados[0]._id, planesCreados[1]._id, planesCreados[2]._id]
        },
        {
            nombre: "Swiss Medical",
            planes: [planesCreados[3]._id, planesCreados[4]._id]
        },
        {
            nombre: "Galeno",
            planes: [planesCreados[5]._id]
        },
        {
            nombre: "Particular (Sin Obra Social)",
            planes: [planesCreados[6]._id]
        }
    ];
    const obrasSocialesCreadas = await ObraSocialModel.insertMany(obrasSocialesIniciales);
    console.log(`${obrasSocialesCreadas.length} obras sociales creadas.`);

    console.log("Se han creado las seeds con éxito.");

} catch (error) {
    console.error("Error al ejecutar el seeder:", error);
}