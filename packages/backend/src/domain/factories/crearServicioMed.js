//POR AHORA, DEPRECADA

import { Practica } from "../models/entities/medico/Practica";
import { Especialidad } from "../models/entities/medico/Especialidad";
import { TipoDeServicioInvalido } from "../errors/TipoDeServicioInvalido";

export function crearPrestacion(datosPrestacion) {
  if (datosPrestacion.tipoServicio === "especialidad") {
    return new Especialidad(
      datosPrestacion.nombre,
      datosPrestacion.duracionTurnoEnMins,
      datosPrestacion.costo
    );
  }

  if (datosPrestacion.tipoServicio === "practica") {
    return new Practica(
      datosPrestacion.codigo,
      datosPrestacion.nombre,
      datosPrestacion.duracionTurnoEnMins,
      datosPrestacion.costo
    );
  }

  throw new TipoDeServicioInvalido();
}