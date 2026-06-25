import { parsearId } from "../utils/parsearId.js";
import { BadRequestError } from "../shared/errors/AppError.js";
import { createPrestacionSchema } from "../validators/prestacion.schema.zod.js";
import { createMedicoSchema, patchMedicoSchema } from "../validators/medico.schema.zod.js";

export class MedicoController {
    constructor(medicoService) {
        this.medicoService = medicoService;
    }

    medicoToDTO(medico) {
        return {
            id: medico.id || medico._id,
            usuario: medico.usuario,
            matricula: medico.matricula,
            nombre: medico.nombre,
            especialidades: medico.especialidades,
            practicas: medico.practicas,
            sedes: medico.sedes,
            disponibilidades: medico.disponibilidades.map(d => this.disponibilidadToDTO(d)),
            turnos: medico.turnos
        };
    }

    async create(req, res, next) {
        try {
            const datosMedico = this.extraerYValidarBodyMedico(req.body, createMedicoSchema)
            const medico = await this.medicoService.create(datosMedico);
            res.status(201).json(this.medicoToDTO(medico));
        } catch (error) {
            return next(error);
        }
    }

    async update(req, res, next) {
        try {
            const idMedico = parsearId(req.params.idMedico)
            const dataMedico = this.extraerYValidarBodyMedico(req.body, patchMedicoSchema)
            const medicoActualizado = await this.medicoService.update(idMedico, dataMedico);
            res.status(200).json(this.medicoToDTO(medicoActualizado));
        } catch (error) {
            return next(error);
        }
    }

    async findAll(req, res, next) {
        try {
            const medicos = await this.medicoService.findAll();
            const medicosDTO = medicos.map(medico => this.medicoToDTO(medico));
            res.status(200).json(medicosDTO);
        } catch (error) {
            return next(error);
        }
    }

    async findById(req, res, next) {
        try {
            const idMedico = parsearId(req.params.idMedico)
            const medico = await this.medicoService.findById(idMedico);
            res.status(200).json(this.medicoToDTO(medico));
        } catch (error) {
            return next(error);
        }
    }

    // Disponibilidades ///////////////////////////////////////////////////////////////////

    disponibilidadToDTO(disponibilidad) {
        return {
            id: disponibilidad._id,
            diaSemana: disponibilidad.diaSemana,
            horaDesde: disponibilidad.horaDesde,
            horaHasta: disponibilidad.horaHasta,
            sede: disponibilidad.sede,
            prestacion: disponibilidad.prestacion
        }
    }

    async obtenerDisponibilidades(req, res, next) {
        try {
            const idMedico = parsearId(req.params.idMedico)
            const disponibilidades = await this.medicoService.obtenerDisponibilidades(idMedico);
            const disponibilidadesDTO = disponibilidades.map(d => this.disponibilidadToDTO(d))
            res.status(200).json(disponibilidadesDTO);
        }
        catch (error) {
            return next(error);
        }
    }

    async obtenerDisponibilidadesSegunPrestacion(req, res, next) {
        try {
            const idMedico = parsearId(req.params.idMedico);
            const idPrestacion = parsearId(req.params.idPrestacion);
            const disponibilidades = await this.medicoService.obtenerDisponibilidadesSegunPrestacion(idMedico, idPrestacion);
            const disponibilidadesDTO = disponibilidades.map(d => this.disponibilidadToDTO(d))
            res.status(200).json(disponibilidadesDTO);
        }
        catch (error) {
            return next(error);
        }
    }

    async agregarDisponibilidades(req, res, next) {
        const nuevasDisponibilidades = req.body.disponibilidades;

        try {
            const idMedico = parsearId(req.params.idMedico)
            const medicoActualizado = await this.medicoService.agregarDisponibilidades(idMedico, nuevasDisponibilidades);
            if(!medicoActualizado) {
                throw new BadRequestError("No se pudo agregar las disponibilidades al médico")
            }
            res.status(200).json(this.medicoToDTO(medicoActualizado));
        } catch (error) {
            return next(error);
        }
    }


    async editarDisponibilidad(req, res, next) {
        try {
            const { idMedico, disponibilidadId } = req.params;
            const medicoActualizado = await this.medicoService.editarDisponibilidad(idMedico, disponibilidadId, req.body);
            res.status(200).json(this.medicoToDTO(medicoActualizado));
        } catch (error) {
            next(error);
        }
    }

    async eliminarDisponibilidad(req, res, next) {
        try {
            const { idMedico, disponibilidadId } = req.params;
            const medicoActualizado = await this.medicoService.eliminarDisponibilidad(idMedico, disponibilidadId);
            res.status(200).json(this.medicoToDTO(medicoActualizado));
        } catch (error) {
            next(error);
        }
    }

    // Servicio Por Medico ///////////////////////////////////////////////////////////////////

    prestacionToDTO(prestacion) {
        const servMedDto = {
            id: prestacion._id,
            nombre: prestacion.servicioUnico.nombre,
            duracionTurnoEnMins: prestacion.duracionTurnoEnMins,
            costo: prestacion.costo,
            tipoServicio: prestacion.tipoServicio,
            codigo: prestacion.tipoServicio === "practica" ? prestacion.codigo : undefined,
        }
        return servMedDto
    }


    obtenerPrestaciones = async (req, res, next) => {
        try {
            const idMedico = parsearId(req.params.idMedico)
            const prestaciones = await this.medicoService.obtenerPrestaciones(idMedico)
            res.json(prestaciones.map(s => this.prestacionToDTO(s)))
        } catch (error) {
            return next(error)
        }

    }

    obtenerPrestacionPorId = async (req, res, next) => {
        try {
            const idMedico = parsearId(req.params.idMedico)
            const idPrestacion = parsearId(req.params.idPrestacion)
            const prestacion = await this.medicoService.obtenerPrestacionPorId(idMedico, idPrestacion)
            res.status(201).json({ status: "success", data: this.prestacionToDTO(prestacion) })
        } catch (error) {
            return next(error)
        }
    }


    altaPrestacion = async (req, res, next) => {
        try {
            const idMedico = parsearId(req.params.idMedico)
            const prestacion = this.extraerYValidarBodyPrestacion(req.body)
            const prestacionCreado = await this.medicoService.altaPrestacion(idMedico, prestacion);
            
            return res.status(201).json({ status: "success", data: this.prestacionToDTO(prestacionCreado) })
        } catch (error) {
            return next(error)
        }

    }

    bajaPrestacion = async (req, res, next) => {
        try {
            const idMedico = parsearId(req.params.idMedico)
            const idPrestacion = parsearId(req.params.idPrestacion)

            const prestacionEliminado = await this.medicoService.bajaPrestacion(idMedico, idPrestacion);
            return res.status(201).json({ status: "success", data: this.prestacionToDTO(prestacionEliminado) })
        } catch (error) {
            return next(error)
        }
    }

    editarPrestacion = async (req, res, next) => {
        try {
            const idMedico = parsearId(req.params.idMedico)
            const idPrestacion = parsearId(req.params.idPrestacion)
            const datosPrestacion = this.extraerYValidarBodyPrestacion(req.body)
            const prestacionActualizado = await this.medicoService.actualizarPrestacion(idMedico, idPrestacion, datosPrestacion);
            return res.status(200).json({ status: "success", data: this.prestacionToDTO(prestacionActualizado) })
        } catch (error) {
            return next(error)
        }

    }

    extraerYValidarBodyPrestacion(body) {
        const resultado = createPrestacionSchema.safeParse(body)
        if (!resultado.success) {
            throw new BadRequestError(
                resultado.error.issues.map(i => i.message).join(", ")
            )
        }
        return resultado.data
    }

    extraerYValidarBodyMedico(body, schema) {
        const resultado = schema.safeParse(body)
        if (!resultado.success) {
            throw new BadRequestError(
                resultado.error.issues.map(i => i.message).join(", ")
            )
        }
        return resultado.data
    }

    async consultarHistorialPaciente(req, res, next) {
        try {
            const idPaciente = parsearId(req.params.idPaciente);
            const historial = await this.medicoService.consultarHistorialPaciente(idPaciente);
            res.status(200).json(historial);
        } catch (error) {
            return next(error);
        }
    }

    async realizarTurno(req, res, next) {
        try {
            const idMedico = parsearId(req.params.idMedico);
            const turnoId = parsearId(req.params.turnoId);
            const turnoRealizado = await this.medicoService.realizarTurno(idMedico, turnoId);
            res.status(200).json(turnoRealizado);
        } catch (error) {
            return next(error);
        }
    }

    async cancelarTurno(req, res, next) {
        try {
            const idMedico = parsearId(req.params.idMedico);
            const turnoId = parsearId(req.params.turnoId);
            const { motivo } = req.body;
            const turnoCancelado = await this.medicoService.cancelarTurno(idMedico, turnoId, motivo);
            res.status(200).json(turnoCancelado);
        } catch (error) {
            return next(error);
        }
    }
}
