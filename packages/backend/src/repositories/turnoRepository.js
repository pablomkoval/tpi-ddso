import TurnoModel from '../persistence/schemas/TurnoSchema.js';

class TurnoRepository {

    /**
     * Busca turnos disponibles con filtros dinámicos, paginación y ordenamiento.
     * @param {Object} filtros - Filtros de búsqueda
     * @param {Object} opciones - Opciones de paginación y ordenamiento
     * @returns {{ turnos: Array, total: number }}
     */
    async buscarDisponibles(filtros, opciones) {
        const { especialidad, practica, medico, sede, fechaDesde, fechaHasta } = filtros;
        const { skip, limit, sort } = opciones;

        // Construir query dinámico
        const query = {
            estado: 'DISPONIBLE',
            fechaHora: { $gte: new Date() } // Solo turnos futuros
        };

        if (especialidad) {
            query.especialidad = especialidad;
        }

        if (practica) {
            query.practica = practica;
        }

        if (medico) {
            query.medico = medico;
        }

        if (sede) {
            query.sede = sede;
        }

        // Rango de fechas
        if (fechaDesde || fechaHasta) {
            if (fechaDesde) {
                const desde = new Date(fechaDesde);
                // Usar la fecha mayor entre "ahora" y "fechaDesde"
                query.fechaHora.$gte = desde > new Date() ? desde : new Date();
            }
            if (fechaHasta) {
                const hasta = new Date(fechaHasta);
                hasta.setHours(23, 59, 59, 999); // Incluir todo el día
                query.fechaHora.$lte = hasta;
            }
        }

        // Ejecutar consulta y conteo en paralelo
        const [turnos, total] = await Promise.all([
            TurnoModel.find(query)
                .populate('medico', 'nombre matricula')
                .populate('especialidad', 'nombre costoConsulta duracionTurnoEnMins')
                .populate('practica', 'nombre codigo costo duracionTurnoEnMins')
                .populate('sede', 'nombre direccion')
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .lean(),
            TurnoModel.countDocuments(query)
        ]);

        return { turnos, total };
    }

    /**
     * Busca un turno por su ID
     */
    async findById(id) {
        return await TurnoModel.findById(id)
            .populate('medico', 'nombre matricula')
            .populate('especialidad', 'nombre costoConsulta')
            .populate('practica', 'nombre codigo costo')
            .populate('sede', 'nombre direccion')
            .populate('paciente', 'nombre dni')
            .lean();
    }

    /**
     * Crea un nuevo turno
     */
    async create(data) {
        const turno = new TurnoModel(data);
        return await turno.save();
    }

    /**
     * Actualiza un turno por ID
     */
    async update(id, data) {
        return await TurnoModel.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true
        });
    }
}

export default new TurnoRepository();
