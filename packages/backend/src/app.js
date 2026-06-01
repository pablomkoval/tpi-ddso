import express from 'express';
import cors from 'cors';
import router from './routes/router.js';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swagger.js';
import errorHandler from './middlewares/errorHandler.js';
import initNotificaciones from './notificaciones.dependencies.js';

const app = express();


app.use(cors());
app.use(express.json());

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

initNotificaciones();

// Rutas
app.use(router);


// Middleware de manejo de errores (debe ir al final)
app.use(errorHandler);

export default app;
