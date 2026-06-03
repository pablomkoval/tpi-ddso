import AppError, { BadRequestError } from "../shared/errors/AppError.js";
import Medico from '../domain/models/entities/medico/Medico.js';
import { DisponibilidadHoraria } from "../domain/models/entities/medico/DisponibilidadHoraria.js";
import { NotFoundError } from "../shared/errors/AppError.js"
import mongoose from 'mongoose'




const toObjectId = (value) =>
    value ? new mongoose.Types.ObjectId(value) : value;

export class MedicoService {
    constructor(medicoRepository, servicioService, usuarioRepository) {
        this.medicoRepository = medicoRepository;
        this.servicioService = servicioService;
        this.usuarioRepository = usuarioRepository; // definir si es necesario
    }

    // toDTO(medico) {
    //     return {
    //         id: medico.id || medico._id,
    //         usuario: medico.usuario,
    //         matricula: medico.matricula,
    //         nombre: medico.nombre,
    //         especialidades: medico.especialidades,
    //         practicas: medico.practicas,
    //         sedes: medico.sedes,
    //         disponibilidades: medico.disponibilidades,
    //         turnos: medico.turnos
    //     };
    // }

    async create(data) {
        const { usuario, matricula, nombre, especialidades, practicas, sedes } = data;

        /* const usuarioEncontrado = await this.usuarioRepository.findOne(usuario);
        if (!usuarioEncontrado) {
            throw new AppError("El usuario de login no existe", 404, "USUARIO_NO_ENCONTRADO");
        }

        const usuarioId = usuarioEncontrado._id;

        const disponibilidadesInstanciadas = disponibilidades.map(d => new DisponibilidadHoraria(
            {
                diaSemana: d.diaSemana,
                horaDesde: d.horaDesde,
                horaHasta: d.horaHasta,
                sede: d.sede
            }
        ));

        const nuevoMedico = new Medico(usuarioId, matricula, nombre, especialidades, practicas, sedes, disponibilidadesInstanciadas);
        } */

        const nuevoMedico = new Medico(usuario, matricula, nombre, especialidades, practicas, sedes);
        const medicoGuardado = await this.medicoRepository.save(nuevoMedico);
        return medicoGuardado;
    }

    async update(idMedico, data) {
        const medicoExistente = await this.medicoRepository.findById(idMedico);

        if (!medicoExistente) {
            throw new NotFoundError("No se puede actualizar, médico con Id " + idMedico + " no encontrado", "MEDICO_UPDATE_FAIL");
        }

        const actualizado = await this.medicoRepository.update(idMedico, data);
        if(!actualizado) {
            throw new AppError("No se pudo actualizar el médico", 500, "MEDICO_UPDATE_FAIL");
        }

        return actualizado;
    }

    async findAll() {
        console.log("Entre al findAll de MedicoService")
        const medicos = await this.medicoRepository.findAll();
        return medicos;
    }

    async findById(idMedico) {
        const medico = await this.medicoRepository.findById(idMedico);

        if (!medico) {
            throw new NotFoundError("Médico con Id " + idMedico + " no encontrado", "MEDICO_NO_ENCONTRADO");
        }

        return medico;
    }

    async obtenerDisponibilidades(idMedico) {
        try {
            const medico = await this.medicoRepository.findById(idMedico);
            if (!medico) {
                throw new NotFoundError("Médico con Id " + idMedico + " no encontrado", "MEDICO_NO_ENCONTRADO");
            }
            return medico.disponibilidades;
        } catch (error) {
            throw new AppError(`Error al obtener disponibilidades: ${error.message}`, 500, "DISPONIBILIDADES_OBTENER_FAIL");
        }
    }

    async agregarDisponibilidades(idMedico, nuevasDisponibilidades) {
        try {
            const medico = await this.medicoRepository.findById(idMedico);
            if (!medico) {
                throw new NotFoundError("Médico con Id " + idMedico + " no encontrado", "MEDICO_NO_ENCONTRADO");
            }

            const nuevasDisponibilidadesInstanciadas = nuevasDisponibilidades.map(d => 
                new DisponibilidadHoraria({
                    diaSemana: d.diaSemana,  // ← Llega como string, el constructor lo convierte
                    horaDesde: d.horaDesde,
                    horaHasta: d.horaHasta,
                    sede: d.sede,
                    prestacion: toObjectId(d.prestacion)
                })
            );

            medico.agregarDisponibilidades(nuevasDisponibilidadesInstanciadas);
            const medicoActualizado = await medico.save();
            return medicoActualizado;
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(`Error al agregar disponibilidades: ${error.message}`, 500, "DISPONIBILIDADES_AGREGAR_FAIL");
        }
    }

    async editarDisponibilidad(idMedico, disponibilidadId, cambios) {
        const medico = await this.medicoRepository.findById(idMedico);
        if (!medico) throw new NotFoundError("Médico con Id " + idMedico + " no encontrado", "MEDICO_NO_ENCONTRADO");

        const cambiosConvertidos = {
            ...cambios,
            diaSemana: cambios.diaSemana ? Number(cambios.diaSemana) : undefined
        };

        medico.editarDisponibilidad(disponibilidadId, cambiosConvertidos);
        
        const medicoGuardado = await medico.save();
        if(!medicoGuardado) {
            throw new AppError("No se pudo editar la disponibilidad", 500, "DISPONIBILIDAD_EDITAR_FAIL");
        }

        return medico;
    }

    async eliminarDisponibilidad(idMedico, disponibilidadId) {
        const medico = await this.medicoRepository.findById(idMedico);
        if (!medico) throw new AppError("Médico no encontrado", 404, "MEDICO_NO_ENCONTRADO");

        medico.disponibilidades = medico.disponibilidades.filter(
            d => String(d._id) !== String(disponibilidadId)
        );

        await medico.save();
        return medico;
    }

    async obtenerPrestaciones(idMedico) {
        try {
            const medico = await this.medicoRepository.findById(idMedico);
            if (!medico) {
                throw new NotFoundError("Médico con Id " + idMedico + " no encontrado", "MEDICO_NO_ENCONTRADO");
            }
            const prestaciones = medico.serviciosMedTotales();
            return prestaciones
            /* return prestaciones.map(s => this.prestacionToDTO(s)); */
        } catch (error) {
            throw new Error(`Error al obtener servicios de medico: ${error.message}`, { cause: error });
        }
    }

    async obtenerPrestacionPorId(idMedico, idPrestacion) {
        try {
            const medico = await this.medicoRepository.findById(idMedico);

            if (!medico) {
                throw new NotFoundError("Médico con Id " + idMedico + " no encontrado", "MEDICO_NO_ENCONTRADO");
            }

            const prestacion = await this.servicioService.findPrestacionById(idPrestacion)

            if (!prestacion) {
                throw new NotFoundError("Prestacion con Id " + idPrestacion + " de Medico con Id " + idMedico + " no encontrado", "PRESTACION_NO_ENCONTRADA");
            }

            if (!medico.prestaServicioPorId(prestacion)) {
                throw new BadRequestError("El Médico de id " + idMedico + " no presta el prestacion de id " + idPrestacion, "MEDICO_NO_PRESTASERVICIO")
            }

            return /* this.prestacionToDTO( */prestacion/* ) */;
        } catch (error) {
            throw new Error(`Error al obtener servicio medico por id: ${error.message}`, { cause: error });
        }
    }

    async altaPrestacion(idMedico, datosPrestacion) {
        //const session = await mongoose.startSession()

        //session.startTransaction()
        try {
            const medico = await this.medicoRepository.findById(idMedico/* , session */);

            if (!medico) {
                throw new NotFoundError("Médico con Id " + idMedico + " no encontrado", "MEDICO_NO_ENCONTRADO");
            }
            const prestacion = await this.servicioService.createPrestacion(datosPrestacion/* , session */)
            
            medico.agregarServicio(prestacion)


            await this.medicoRepository.guardar(medico)


            return/*  this.prestacionToDTO( */prestacion/* ); */
        } catch (error) {

            //await session.abortTransaction()

            throw new Error(`Error al dar de alta un prestacion ${error.message}`, { cause: error });
        }
        finally {

            //session.endSession()
        }
    }

    async bajaPrestacion(idMedico, idPrestacion) {

        //const session = await mongoose.startSession()

        //session.startTransaction()

        try {
            const medico = await this.medicoRepository.findById(idMedico/* , session */);
            if (!medico) {
                throw new NotFoundError("Médico con Id " + idMedico + " no encontrado", "MEDICO_NO_ENCONTRADO");
            }

            const prestacionABorrar = await this.servicioService.findPrestacionById(idPrestacion/* , session */)
            if (!prestacionABorrar) {
                throw new NotFoundError("Prestacion con Id " + idPrestacion + " de Medico con Id " + idMedico + " no encontrado", "PRESTACION_NO_ENCONTRADA");
            }
            if (!medico.prestaServicioPorId(prestacionABorrar)) {
                throw new BadRequestError("El Médico de id " + idMedico + " no presta el prestacion de id " + idPrestacion, "MEDICO_NO_PRESTASERVICIO")
            }


            medico.quitarServicio(prestacionABorrar)
            await this.servicioService.deletePrestacion(prestacionABorrar/* , session */)

            await this.medicoRepository.guardar(medico/* , session */)


            //await session.commitTransaction()

            return /* this.prestacionToDTO */(prestacionABorrar);

        } catch (error) {

            //await session.abortTransaction()

            throw new Error(`Error al dar de baja un prestacion: ${error.message}`, { cause: error });
        }
        finally {

            //session.endSession()
        }
    }


    async actualizarPrestacion(idMedico, idPrestacion, datosPrestacion) {
        //const session = await mongoose.startSession()

        //session.startTransaction()

        try {
            const medico = await this.medicoRepository.findById(idMedico/* , session */);
            if (!medico) {
                throw new NotFoundError("Médico con Id " + idMedico + " no encontrado", "MEDICO_NO_ENCONTRADO");
            }
            const prestacionAActualizar = await this.servicioService.findPrestacionById(idPrestacion/* , session */)

            if (!prestacionAActualizar) {
                throw new NotFoundError("Prestacion con Id " + idPrestacion + " de Medico con Id " + idMedico + " no encontrado", "PRESTACION_NO_ENCONTRADA");
            }

            if (!medico.prestaServicioPorId(prestacionAActualizar)) {
                throw new BadRequestError("El Médico de id " + idMedico + " no presta el prestacion de id " + idPrestacion, "MEDICO_NO_PRESTASERVICIO")
            }


            const prestacionActualizado = await this.servicioService.updatePrestacion(idPrestacion, datosPrestacion/* , session */)

            //await session.commitTransaction()

            return /* this.prestacionToDTO( */prestacionActualizado/* ); */
        } catch (error) {

            //await session.abortTransaction()

            throw new Error(`Error al actualizar un prestacion ${error.message}`, { cause: error });
        }
        finally {

            //session.endSession()
        }
    }

    async actualizarTurnos(medicoId, turnos) {
        try {
            const medico = await this.medicoRepository.findById(medicoId);
            if (!medico) {
                throw new AppError("Médico no encontrado");
            }

            turnos.forEach(turno => medico.agregarTurno(turno));

            await this.medicoRepository.guardar(medico);
        } catch (error) {
            throw new AppError("Error al actualizar turnos del médico: " + error.message, 500, "MEDICO_ACTUALIZAR_TURNOS_FAIL", { cause: error });
        }
    }

    async agregarTurno(medicoId, turno) {
        try {
            const medico = await this.medicoRepository.findById(medicoId);
            if (!medico) {
                throw new AppError("Médico no encontrado");
            }
            medico.agregarTurno(turno);
            await this.medicoRepository.guardar(medico);
        } catch (error) {
            throw new AppError("Error al agregar turno del médico: " + error.message, 500, "MEDICO_AGREGAR_TURNO_FAIL", { cause: error });
        }
    }

    async guardar(medico) {
        try {
            const medicoGuardado = await this.medicoRepository.guardar(medico);
            return medicoGuardado;
        } catch (error) {
            throw new AppError("Error al guardar el médico: " + error.message, 500, "MEDICO_GUARDAR_FAIL", { cause: error });
        }
    }

}