import swaggerJsdoc from 'swagger-jsdoc';

// Configuración básica de Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Gestión de Turnos - TPI DDSO',
      version: '1.0.0',
      description: 'API para la gestión de turnos médicos, pacientes, médicos y obras sociales',
      contact: {
        name: 'Equipo de Desarrollo',
        email: 'soporte@api-turnos.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de desarrollo',
      },
      {
        url: 'https://api.turnos.com',
        description: 'Servidor de producción',
      },
    ],
    components: {
      schemas: {
        Error: {
          type: 'object',
          properties: {
            statusCode: {
              type: 'number',
              example: 400,
            },
            message: {
              type: 'string',
              example: 'Error en la solicitud',
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
      },
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Token JWT para autenticación',
        },
      },
    },
    security: [
      {
        BearerAuth: [],
      },
    ],
  },
  // Especifica dónde buscar los comentarios JSDoc
  apis: [
    './packages/backend/src/routes/routers/**/*.js',
    './packages/backend/src/controllers/*.js',
  ],
};

// Generar especificación de Swagger
const swaggerSpec = swaggerJsdoc(swaggerOptions);
export default swaggerSpec;