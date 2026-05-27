//POR AHORA, DEPRECADA

import { Practica } from "../models/entities/medico/Practica";
import { Especialidad } from "../models/entities/medico/Especialidad";
import { TipoDeServicioInvalido } from "../errors/TipoDeServicioInvalido";

export function crearServicioMed(datosServicioMed) {
  if (datosServicioMed.tipoServicio === "especialidad") {
    return new Especialidad(
      datosServicioMed.nombre,
      datosServicioMed.duracionTurnoEnMins,
      datosServicioMed.costo
    );
  }

  if (datosServicioMed.tipoServicio === "practica") {
    return new Practica(
      datosServicioMed.codigo,
      datosServicioMed.nombre,
      datosServicioMed.duracionTurnoEnMins,
      datosServicioMed.costo
    );
  }

  throw new TipoDeServicioInvalido();
}