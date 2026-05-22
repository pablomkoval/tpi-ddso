# Justificaciones de Diseño - Entrega 1: Implementación de dominio

## Enum y Entidades

* Enum DiaSemana tiene asignado como primer elemento el Domingo para poder coincidir con el formato de enumerado de días de JS.
* Se agregó el atributo `sede` a la clase `DisponibilidadHoraria` para poder asociar cada disponibilidad a una sede específica, lo cual es necesario para cumplir con los requerimientos del proyecto y manejar correctamente las reservas de turnos en distintas sedes. Si esto no estuviera, los pacientes no tendrían forma de saber en que ubicación va a estar el médico el día de su turno.

## Gestión de Errores

* Se implementó una jerarquía de errores con `AppError` como clase base en `shared/errors/`, permitiendo que todas las capas de la aplicación hereden de una clase común. Esto centraliza el manejo de errores y facilita agregar contexto transversal como `statusCode` y `codigo` para respuestas HTTP consistentes.
* Se organizaron los errores de dominio en `domain/errors/`, separados físicamente de la clase base para mantenerlos bien clasificados según la capa. Cada error específico (ej: `SedeNoAutorizadaError`, `HorarioInvalidoError`) hereda de `AppError` y define el `statusCode` y `codigo` apropriados para su caso de uso.
* La validación de que la sede en una disponibilidad corresponde al médico se implementó en `Medico.definirDisponibilidad()`, lanzando `SedeNoAutorizadaError` si la sede no está en `medico.sedes`. Esto garantiza la invariante de dominio en el punto donde la disponibilidad se asigna.

## Validaciones en DisponibilidadHoraria

* Se agregaron validaciones en el constructor de `DisponibilidadHoraria` para:
	- **DiaSemana válido**: verifica que sea uno de los valores del enum `DiaSemana`
	- **Formato de horario**: valida formato HH:MM (00-23 horas, 00-59 minutos) con regex
	- **Rango válido**: asegura que `horaDesde < horaHasta`
* Estas validaciones se ejecutan al construir la instancia, previniendo estados inconsistentes desde el inicio.

## Eliminación de `Agenda` y delegación a `Medico`

Se optó por quitar la clase `Agenda` como componente responsable de generar y mantener turnos y, en su lugar, dejar que la entidad `Medico` gestione internamente sus `turnos[]`. Las razones principales son:

- **Responsabilidad única y claridad de dominio:** un turno pertenece conceptualmente a un médico; mantener la fuente de verdad en `Medico` evita dispersar estado entre objetos y facilita razonar sobre invariantes (p. ej. disponibilidades, sedes autorizadas, conflicto de reservas).
- **Encapsulamiento y operaciones transaccionales:** al tener `turnos` dentro de `Medico` se pueden aplicar operaciones atómicas (generar, reservar, cancelar) con acceso directo a las disponibilidades y reglas específicas del médico sin sincronizaciones externas.
- **Menos duplicación y menos errores de sincronía:** antes, `Agenda` y `Medico` podían tener versiones inconsistentes de los turnos; centralizar reduce bugs donde una actualización en uno no se reflejaba en el otro.
- **Mayor testabilidad y separación de responsabilidades:** la lógica de horarios quedó en `DisponibilidadHoraria` (generación de instantes) y `Medico` orquesta la creación de `Turno`, lo que permite tests unitarios más pequeños y aislados.
- **Facilidad de persistencia y caching:** al almacenar y versionar `turnos` por médico es más sencillo mapearlos a un esquema de base de datos o cache por entidad, optimizando consultas por médico o sede.