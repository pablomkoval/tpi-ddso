## Despliegue de la aplicación

La aplicación está organizada en cuatro piezas principales: el frontend, el backend, el servicio de autenticación y la base de datos. Cada una cumple una función a la hora del despliegue.

## Tecnologías usadas

### Frontend

Se despliega en **Netlify** y utiliza una aplicación SPA para mostrar las pantallas y consumir la API del backend mediante peticiones HTTP. Desde ahí se maneja toda la experiencia visual de la aplicación, incluyendo el inicio de sesión, la navegación entre pantallas y la consulta de datos protegidos.

En el despliegue del frontend también se cargan las variables de entorno necesarias para apuntar al backend y a Keycloak. Eso permite que la misma aplicación funcione correctamente en un entorno local o en producción sin cambiar el código.

### Backend

El backend está desplegado en **Render** y concentra la lógica de negocio de la aplicación. Expone una API REST que se encarga de manejar reservas, cancelaciones, notificaciones, solicitudes de cambio de turno y validaciones de dominio.

Además, es el punto donde se centralizan las credenciales de acceso a la base de datos, la configuración de autenticación y cualquier otro dato sensible que no debe quedar expuesto en el frontend. También se encarga de validar los tokens emitidos por Keycloak antes de permitir el acceso a los recursos protegidos.

### Base de datos

La persistencia de la información se hace con **MongoDB Atlas**. Allí se almacenan los usuarios, turnos, notificaciones y solicitudes de cambio, manteniendo los datos disponibles entre sesiones.

La conexión desde el backend se configura mediante una cadena de conexión donde van definidos el usuario, la contraseña y el resto de los datos necesarios para acceder a la base. Además, en Atlas se registra la IP pública del backend para permitir únicamente accesos autorizados y evitar problemas de seguridad.

### Autenticación

La autenticación se resuelve con **Keycloak**, desplegado en **Railway** dentro de un contenedor **Docker**. La configuración inicial se importa desde un export del realm, lo que permite recuperar usuarios, clientes, roles y reglas de acceso sin configurarlo todo manualmente.

Para que el frontend pueda autenticarse sin problemas desde un servidor externo, el cliente de Keycloak se configura con las URLs de redirección autorizadas y con la lista de orígenes permitidos. De esa forma, cuando la aplicación web envía al usuario a iniciar sesión, Keycloak sabe a qué dirección debe devolverlo después de validar sus credenciales y solo acepta solicitudes desde los dominios registrados.

## Flujo de la aplicación

El recorrido típico es sencillo: el usuario entra al frontend, se autentica a través de Keycloak y luego la interfaz se comunica con el backend mediante una API REST. Si todo está correcto, el backend responde con los datos necesarios y, cuando hace falta, persiste los cambios en MongoDB Atlas.

En resumen, el flujo queda así:

1. El usuario accede a la aplicación desde el navegador.
2. El frontend carga la interfaz y redirige el proceso de autenticación a Keycloak.
3. Keycloak valida las credenciales y devuelve un token de acceso.
4. El frontend usa ese token para comunicarse con el backend.
5. El backend procesa la solicitud, aplica las reglas de negocio y consulta o actualiza MongoDB Atlas.
6. Finalmente, el backend devuelve la respuesta al frontend para que la interfaz se actualice.

Además de las operaciones visibles para el usuario, también existen procesos automáticos que complementan el despliegue. Uno de ellos genera turnos disponibles a partir de la disponibilidad cargada por los médicos. Otro se encarga de enviar recordatorios diarios para los turnos próximos. Estos procesos trabajan junto con el backend y comparten la misma base de datos.

Por último, la aplicación expone un endpoint de health check que sirve para verificar rápidamente que el servicio sigue activo y que la conexión con MongoDB funciona como corresponde. Eso ayuda a monitorear el estado general del sistema sin tener que entrar manualmente a revisar cada componente.


