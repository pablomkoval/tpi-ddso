# Sweet Medical - Historias de Usuario

## Introducción

Este documento describe las historias de usuario del sistema Sweet Medical, plataforma orientada a la gestión de turnos médicos.

Las historias de usuario fueron definidas a partir de los requerimientos funcionales y no funcionales del Trabajo Práctico Integrador de Desarrollo de Software UTN.

---

# Convenciones

## Formato

Como [actor]
Quiero [objetivo]
Para [beneficio]

## Prioridades

- Alta
- Media
- Baja

---

# Módulo: Gestión de Turnos

---

## HU-001 - Buscar turnos disponibles

### Descripción
Como paciente  
Quiero buscar turnos disponibles  
Para encontrar atención médica según mis necesidades.

### Criterios de aceptación
- Debe ser posible filtrar por:
  - profesional
  - especialidad
  - práctica
  - sede
  - rango de fechas
- El sistema debe mostrar:
  - profesional
  - servicio
  - fecha y hora
  - sede
  - costo estimado
  - cobertura
- Los resultados deben poder ordenarse:
  - por fecha
  - por costo
- Los resultados deben soportar paginación.

### Prioridad
Alta

---

## HU-002 - Reservar turno

### Descripción
Como paciente  
Quiero reservar un turno disponible  
Para obtener atención médica.

### Criterios de aceptación
- El turno debe encontrarse en estado DISPONIBLE.
- El sistema debe validar cobertura médica.
- El sistema debe calcular el costo final.
- El turno debe pasar a estado RESERVADO.
- El médico debe recibir una notificación.

### Reglas de negocio
- No se puede reservar un turno ya reservado.
- El costo depende de la obra social y plan del paciente.

### Prioridad
Alta

---

## HU-003 - Cancelar turno

### Descripción
Como paciente  
Quiero cancelar un turno reservado  
Para liberar el horario en caso de no poder asistir.

### Criterios de aceptación
- El paciente debe indicar un motivo.
- La cancelación debe realizarse con al menos 1 hora de anticipación.
- El turno debe cambiar su estado.
- El médico debe ser notificado.

### Prioridad
Alta

---

## HU-004 - Consultar historial de turnos

### Descripción
Como paciente  
Quiero consultar mi historial de turnos  
Para visualizar mis atenciones anteriores y futuras.

### Criterios de aceptación
- Deben visualizarse turnos:
  - realizados
  - cancelados
  - reservados
- Debe mostrarse:
  - fecha
  - profesional
  - servicio
  - estado

### Prioridad
Media

---

## HU-005 - Solicitar cambio de fecha de turno

### Descripción
Como paciente  
Quiero solicitar un cambio de fecha de un turno  
Para reprogramar mi atención médica.

### Criterios de aceptación
- El paciente debe seleccionar una nueva fecha disponible.
- El médico debe confirmar el cambio.
- El sistema debe notificar el resultado.

### Prioridad
Media

---

## HU-006 - Marcar turno como realizado

### Descripción
Como médico  
Quiero marcar un turno como realizado  
Para registrar la atención médica realizada.

### Criterios de aceptación
- Solo pueden marcarse turnos reservados.
- El turno debe cambiar al estado REALIZADO.

### Prioridad
Alta

---

## HU-007 - Cancelar turno como médico

### Descripción
Como médico  
Quiero cancelar un turno  
Para informar que no podré atender al paciente.

### Criterios de aceptación
- El médico debe indicar un motivo.
- La cancelación debe realizarse con al menos 1 hora de anticipación.
- El paciente debe ser notificado.

### Prioridad
Alta

---

## HU-008 - Proponer cambio de fecha

### Descripción
Como médico  
Quiero proponer una nueva fecha para un turno  
Para reorganizar mi agenda.

### Criterios de aceptación
- El paciente debe aceptar o rechazar la propuesta.
- El sistema debe registrar el resultado.

### Prioridad
Media

---

# Módulo: Disponibilidad Médica

---

## HU-009 - Definir disponibilidad horaria

### Descripción
Como médico  
Quiero definir mi disponibilidad horaria  
Para habilitar turnos automáticamente.

### Criterios de aceptación
- Debe permitirse configurar:
  - días
  - horarios
  - duración
  - sede
- El sistema debe generar turnos automáticamente.

### Prioridad
Alta

---

## HU-010 - Modificar disponibilidad

### Descripción
Como médico  
Quiero modificar mi disponibilidad  
Para actualizar mis horarios de atención.

### Criterios de aceptación
- Los turnos realizados no deben modificarse.
- Los turnos reservados futuros no deben modificarse.
- Solo deben afectarse turnos DISPONIBLES futuros.

### Prioridad
Alta

---

## HU-011 - Consultar disponibilidad

### Descripción
Como médico  
Quiero consultar mi disponibilidad  
Para verificar mis horarios de atención.

### Prioridad
Media

---

# Módulo: Servicios Médicos

---

## HU-012 - Dar de alta un servicio

### Descripción
Como médico  
Quiero registrar una especialidad o práctica  
Para ofrecerla dentro de la plataforma.

### Prioridad
Alta

---

## HU-013 - Modificar servicio

### Descripción
Como médico  
Quiero modificar un servicio  
Para mantener actualizada su información.

### Prioridad
Media

---

## HU-014 - Dar de baja un servicio

### Descripción
Como médico  
Quiero eliminar un servicio  
Para dejar de ofrecerlo.

### Prioridad
Media

---

# Módulo: Notificaciones

---

## HU-015 - Visualizar notificaciones no leídas

### Descripción
Como usuario  
Quiero visualizar mis notificaciones pendientes  
Para mantenerme informado.

### Prioridad
Media

---

## HU-016 - Visualizar notificaciones leídas

### Descripción
Como usuario  
Quiero consultar mis notificaciones leídas  
Para revisar eventos anteriores.

### Prioridad
Baja

---

## HU-017 - Marcar notificación como leída

### Descripción
Como usuario  
Quiero marcar una notificación como leída  
Para organizar mis notificaciones.

### Prioridad
Media

---

# Módulo: Frontend / Carrito de Turnos

---

## HU-018 - Agregar turno a preselección

### Descripción
Como paciente  
Quiero agregar turnos a una preselección  
Para evaluar varias opciones antes de reservar.

### Criterios de aceptación
- El carrito debe vivir únicamente en frontend.
- Debe permitirse agregar múltiples turnos.

### Prioridad
Media

---

## HU-019 - Visualizar resumen de preselección

### Descripción
Como paciente  
Quiero visualizar los turnos preseleccionados  
Para revisar mis opciones.

### Prioridad
Media

---

## HU-020 - Eliminar turno de preselección

### Descripción
Como paciente  
Quiero eliminar turnos de mi preselección  
Para actualizar mis opciones.

### Prioridad
Media

---

# Módulo: Notificaciones Automáticas

---

## HU-021 - Enviar recordatorios automáticos

### Descripción
Como sistema  
Quiero enviar recordatorios automáticos  
Para reducir ausencias a turnos.

### Criterios de aceptación
- El sistema debe enviar recordatorios el día previo al turno.
- Debe notificarse:
  - paciente
  - médico

### Prioridad
Media

---

## HU-022 - Generar turnos automáticamente

### Descripción
Como sistema  
Quiero generar turnos automáticamente  
Para disponibilizar atención médica según agenda.

### Criterios de aceptación
- La generación debe ejecutarse mediante un proceso batch.
- Los turnos deben generarse en estado DISPONIBLE.

### Prioridad
Alta

---