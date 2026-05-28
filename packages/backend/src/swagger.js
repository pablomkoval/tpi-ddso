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
    
    paths: {
      '/v1/medicos': {
        get: {
          summary: 'Obtener la lista de todos los médicos',
          tags: ['Medicos'],
          responses: {
            200: {description: 'Lista de médicos obtenida correctamente'}
          }
        },

        post: {
          summary: 'Crear un nuevo médico',
          tags: ['Medicos'],
          requestBody: {
            required: true,
            content: {
              'json': {
                schema: {
                  type: 'object',
                  properties: {
                    usuario: { type: 'string', example: 'joseDeodo123'},
                    matricula: { type: 'string', example: 'AAAA'},
                    nombre: { type: 'string', example: 'Jose Deodo'}
                  }
                }
              }
            }
          },
          responses: {
            201: { description: 'Médico creado exitosamente' }
          }
        }
      },

      '/v1/medicos/{id}': {
        get: {
          summary: 'Obtener un médico por id',
          tags: ['Medicos'],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'id del médico'}
          ],
          responses: {
            200: { description: 'Médico encontrado de forma correcta'},
            404: { description: 'Médico no encontrado'}
          }
        }
      },

      '/v1/medicos/{id}/disponibilidad': {
        get: {
          summary: 'Obtener disponibilidades horarias de un médico',
          tags: ['Disponibilidades'],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string'}}
          ],
          responses: {
            200: { description: 'Lista de disponibilidades horarias' }
          }
        },

        post: {
          summary: 'Agregar nuevas disponibilidades horarias a un médico',
          tags: ['Disponibilidades'],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
          ],
          requestBody: {
            required: true,
            content: {
              'json': {
                schema: {
                  type: 'object',
                  properties: {
                    disponibilidades: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          diaSemana: { type: 'string', example: 'LUNES' },
                          horaDesde: { type: 'string', example: '08:00' },
                          horaHasta: { type: 'string', example: '09:00' },
                          sede: {
                            type: 'object',
                            properties: {
                              id: { type: 'string', example: '123' },
                              nombre: { type: 'string', example: 'Sweet Medical Medrano' },
                              direccion: { type: 'string', example: 'Medrano 951' }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          responses: {
            200: { description: 'Disponibilidades agregadas con exito' },
            400: { description: 'Error por solapamiento de disponibilidad o sede invalida' }
          }
        }
      },

      '/v1/medicos/{id}/disponibilidad/{disponibilidadId}': {
        patch: {
          summary: 'Editar una disponibilidad horaria especfiica de un médico',
          tags: ['Disponibilidades'],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
            { name: 'disponibilidadId', in: 'path', required: true, schema: { type: 'string' } }
          ],
          requestBody: {
            required: true,
            content: {
              'json': {
                schema: {
                  type: 'object',
                  properties: {
                    horaDesde: { type: 'string', example: '10:00' },
                    horaHasta: { type: 'string', example: '11:00' }
                  }
                }
              }
            }
          },
          responses: {
            200: { description: 'Disponibilidad modificada exitosamente' }
          }
        },

        delete: {
          summary: 'Eliminar una disponibilidad horaria por id',
          tags: ['Disponibilidades'],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
            { name: 'disponibilidadId', in: 'path', required: true, schema: { type: 'string' } }
          ],
          responses: {
            200: { description: 'Disponibilidad eliminada correctamente' }
          }
        }
      }
    }
  },

  // Especifica dónde buscar los comentarios JSDoc
  apis: [
    './packages/backend/src/routes/routers/**/*.js',
    './packages/backend/src/controllers/**/*.js',
  ],
};

// Generar especificación de Swagger
const swaggerSpec = swaggerJsdoc(swaggerOptions);
export default swaggerSpec;