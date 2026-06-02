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
                    servicioMedico: toObjectId(d.servicioMedico)
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

    async obtenerServicioMeds(idMedico) {
        try {
            const medico = await this.medicoRepository.findById(idMedico);
            if (!medico) {
                throw new NotFoundError("Médico con Id " + idMedico + " no encontrado", "MEDICO_NO_ENCONTRADO");
            }
            const servicioMeds = medico.serviciosMedTotales();
            return servicioMeds
            /* return servicioMeds.map(s => this.servicioMedToDTO(s)); */
        } catch (error) {
            throw new Error(`Error al obtener servicios de medico: ${error.message}`, { cause: error });
        }
    }

    async obtenerServicioMedPorId(idMedico, idServicioMed) {
        try {
            const medico = await this.medicoRepository.findById(idMedico);

            if (!medico) {
                throw new NotFoundError("Médico con Id " + idMedico + " no encontrado", "MEDICO_NO_ENCONTRADO");
            }

            const servicioMed = await this.servicioService.findServicioMedById(idServicioMed)

            if (!servicioMed) {
                throw new NotFoundError("ServicioMed con Id " + idServicioMed + " de Medico con Id " + idMedico + " no encontrado", "SERVICIOMED_NO_ENCONTRADO");
            }

            if (!medico.prestaServicioPorId(servicioMed)) {
                throw new BadRequestError("El Médico de id " + idMedico + " no presta el servicioMed de id " + idServicioMed, "MEDICO_NO_PRESTASERVICIO")
            }

            return /* this.servicioMedToDTO( */servicioMed/* ) */;
        } catch (error) {
            throw new Error(`Error al obtener servicio medico por id: ${error.message}`, { cause: error });
        }
    }

    async altaServicioMed(idMedico, datosServicioMed) {
        //const session = await mongoose.startSession()

        //session.startTransaction()
        try {
            const medico = await this.medicoRepository.findById(idMedico/* , session */);

            if (!medico) {
                throw new NotFoundError("Médico con Id " + idMedico + " no encontrado", "MEDICO_NO_ENCONTRADO");
            }
            const servicioMed = await this.servicioService.createServicioMed(datosServicioMed/* , session */)

            medico.agregarServicio(servicioMed)


            await this.medicoRepository.guardar(medico)


            return/*  this.servicioMedToDTO( */servicioMed/* ); */
        } catch (error) {

            //await session.abortTransaction()

            throw new Error(`Error al dar de alta un servicioMed ${error.message}`, { cause: error });
        }
        finally {

            //session.endSession()
        }
    }

    async bajaServicioMed(idMedico, idServicioMed) {

        //const session = await mongoose.startSession()

        //session.startTransaction()

        try {
            const medico = await this.medicoRepository.findById(idMedico/* , session */);
            if (!medico) {
                throw new NotFoundError("Médico con Id " + idMedico + " no encontrado", "MEDICO_NO_ENCONTRADO");
            }

            const servicioMedABorrar = await this.servicioService.findServicioMedById(idServicioMed/* , session */)
            if (!servicioMedABorrar) {
                throw new NotFoundError("ServicioMed con Id " + idServicioMed + " de Medico con Id " + idMedico + " no encontrado", "SERVICIOMED_NO_ENCONTRADO");
            }
            if (!medico.prestaServicioPorId(servicioMedABorrar)) {
                throw new BadRequestError("El Médico de id " + idMedico + " no presta el servicioMed de id " + idServicioMed, "MEDICO_NO_PRESTASERVICIO")
            }


            medico.quitarServicio(servicioMedABorrar)
            await this.servicioService.deleteServicioMed(servicioMedABorrar/* , session */)

            await this.medicoRepository.guardar(medico/* , session */)


            //await session.commitTransaction()

            return /* this.servicioMedToDTO */(servicioMedABorrar);

        } catch (error) {

            //await session.abortTransaction()

            throw new Error(`Error al dar de baja un servicioMed: ${error.message}`, { cause: error });
        }
        finally {

            //session.endSession()
        }
    }


    async actualizarServicioMed(idMedico, idServicioMed, datosServicioMed) {
        //const session = await mongoose.startSession()

        //session.startTransaction()

        try {
            const medico = await this.medicoRepository.findById(idMedico/* , session */);
            if (!medico) {
                throw new NotFoundError("Médico con Id " + idMedico + " no encontrado", "MEDICO_NO_ENCONTRADO");
            }
            const servicioMedAActualizar = await this.servicioService.findServicioMedById(idServicioMed/* , session */)

            if (!servicioMedAActualizar) {
                throw new NotFoundError("ServicioMed con Id " + idServicioMed + " de Medico con Id " + idMedico + " no encontrado", "SERVICIOMED_NO_ENCONTRADO");
            }

            if (!medico.prestaServicioPorId(servicioMedAActualizar)) {
                throw new BadRequestError("El Médico de id " + idMedico + " no presta el servicioMed de id " + idServicioMed, "MEDICO_NO_PRESTASERVICIO")
            }


            const servicioMedActualizado = await this.servicioService.updateServicioMed(idServicioMed, datosServicioMed/* , session */)

            //await session.commitTransaction()

            return /* this.servicioMedToDTO( */servicioMedActualizado/* ); */
        } catch (error) {

            //await session.abortTransaction()

            throw new Error(`Error al actualizar un servicioMed ${error.message}`, { cause: error });
        }
        finally {

            //session.endSession()
        }
    }


}