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

2. Levantar el proyecto:
   
    2.1 Asegurarse que las variables de entorno en los .env esten bien colocadas
    ```bash
    Backend:
    MONGODB_URI=mongodb://localhost:27017/
    KEYCLOAK_URL=http://localhost:8080/

    Frontend
    REACT_APP_API_BASE_URL=http://localhost:4000/
    REACT_APP_KEYCLOAK_URL=http://localhost:8080/ 
    ```

    2.2 (Opcional) Correr seeder de Base de Datos
    ```bash
    En la carpeta Base del Proyecto:
    npm run "seed-db"
    ```

    2.3 Levantar Back:

    ```bash
    En la carpeta Base del Proyecto:
    npm start
    ```
    2.4 Levantar Front:

    ```bash
    En la carpeta /packages/frontend:
    npm start
    ```

3. Si querés reinicio automático mientras desarrollás, usar:

```bash
npm run dev
```

4. Verificar que esté funcionando abriendo:

```bash
http://localhost:4000/healthcheck
```

Si todo está bien, la respuesta debería indicar que el estado es `ok`.

5. Para correr los tests del proyecto, ejecutar:

```bash
En Windows:
npm test

En Linux:
npm run "test:linux"
```
6. Test E2E

```bash
En la carpeta /packages/frontend:
npm run "cypress:run"
```
Ese es el comando previsto para automatizar y ejecutar la suite de pruebas desde la raíz del repositorio.