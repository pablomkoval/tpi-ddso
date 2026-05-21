# Trabajo Práctico Desarrollo de Software


## Integrantes

| Apellido | Nombre | Legajo |
| --- | --- | --- |
| Aroa | Jhon | 175.520-1 |
| Cantero | Leonel | 211.467-7 |
| Koval | Pablo | 222.437-9 |
| Letizia | Joaquín | 222.458-6 |
| Tolentino | Gabriel | 222.745-9 |


## Flujo de Trabajo elegido: GitHub Flow

![alt text](/assets/workflow.png)

Elegimos GitHub Flow porque permite trabajar en ramas cortas y mantener el desarrollo integrado de forma continua, lo que facilita que cada integrante avance en paralelo sin bloquear al resto. Además, obliga a revisar y fusionar los cambios mediante pull requests, ayudando a detectar errores antes de incorporar código a la rama principal y dejando un historial claro de las decisiones del equipo.

## Ejecución del proyecto

1. Instalar las dependencias:

```bash
npm install
```

2. Levantar el servidor en modo normal:

```bash
npm start
```

3. Si querés reinicio automático mientras desarrollás, usar:

```bash
npm run dev
```

4. Verificar que esté funcionando abriendo:

```bash
http://localhost:3000/v1/healthcheck
```

Si todo está bien, la respuesta debería indicar que el estado es `ok`.


## Justificaciones de Diseño / Implementación de dominio
* Enum DiaSemana tiene asignado como primer elemento el Domingo para poder coincidir con el formato de enumerado de días de JS.