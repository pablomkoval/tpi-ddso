import {Turno} from "./Turno"


export class Agenda{ //turnos posibles?
    //genero todo los turnos o laburo con lista de turnos existentes?
        //atributo turnos[]? una agenda para cada medico sería
    // diferencia entre ambos metodos?
    generarTurnosPara(servicio, medico){ //servicio siendo especialidad ó practica
        const turnos = []
        if (!medico.prestaServicio(servicio)){
            return turnos;
        }
        
        const fecha_inicio = new Date()
        const fecha_final = new Date()
        const dias_de_anticipacion = 7
        fecha_final.setDate(fecha_final.getDate + dias_de_anticipacion)

        

        medico.disponibilidades.forEach(disponibilidad => {
            let fechaActual = fecha_inicio //sumar un dia para empezar a generar turnos?
            // Calcular los turnos del día de semana actual hasta la fecha de fin
            while(fechaActual <= fecha_final){

                if(fechaActual.getDay != disponibilidad.getDiaSemana()){
                    fechaActual.setDate(fechaActual.getDate + 1)
                    continue
                }

                let cantidadTurnosDisponibles = disponibilidad.cantidadTurnosPosiblesSegun(servicio.duracionTurnoEnMins)

                for (let i = 0; i < cantidadTurnosDisponibles; i++) {
                    
                    const fechaHoraTurno = fechaActual.setMinutes(disponibilidad.obtenerHoraDesde() + i * servicio.duracionTurnoEnMins)
                    fechaActual.setHours(1) // por si acaso, evitar caso limite 00:00
                    
                    const turno = new Turno(medico, fechaHoraTurno, servicio)    
                    turnos.push(turno)
                }

                fechaActual.setDate(fechaActual.getDate + 1)
            }

        })
        
        return turnos
    }

    refrescarTurnosSegunDisponibilidadDe(/* medico */){
        // cuales turnos??
        /* posible solucion:
            ir a base de datos con un medico
            preguntar por los turnos que posean a ese medico
            y actualizo en la base de datos esa lista de turnos segun la nueva disponilidad del médico
                nueva disponibilidad que implica?
                    turnos reservados
                    cambio de atributo disponibilidades en médico 
        */
        //const turnos = []
        

    }

}