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
      },

      '/v1/medicos/{idMedico}/servicios': {
        get: {
          summary: 'Obtener los servicios médicos que ofrece un médico específico',
          tags: ['Medicos - Servicios'],
          parameters: [
            { name: 'idMedico', in: 'path', required: true, schema: { type: 'string' }, description: 'ID del médico' }
          ],
          responses: {
            200: { description: 'Lista de servicios prestados por el médico obtenidas correctamente' }
          }
        },

        post: {
          summary: 'Dar de alta un servicio médico (Especialidad/Práctica) para un médico',
          tags: ['Medicos - Servicios'],
          parameters: [
            { name: 'idMedico', in: 'path', required: true, schema: { type: 'string' }, description: 'ID del médico' }
          ],
          requestBody: {
            required: true,
            content: {
              'json': {
                schema: {
                  type: 'object',
                  properties: {
                    servicioId: { type: 'string', example: '6a17cd9d1186e98d0058747e', description: 'ID único del servicio médico a asociar' }
                  }
                }
              }
            }
          },
          responses: {
            201: { description: 'Servicio asociado al médico exitosamente' },
            400: { description: 'Error en los datos provistos o servicio ya asociado' }
          }
        }
      },

      '/v1/medicos/{idMedico}/servicios/{idServicio}': {
        get: {
          summary: 'Obtener la información de un servicio específico prestado por el médico',
          tags: ['Medicos - Servicios'],
          parameters: [
            { name: 'idMedico', in: 'path', required: true, schema: { type: 'string' }, description: 'ID del médico' },
            { name: 'idServicio', in: 'path', required: true, schema: { type: 'string' }, description: 'ID del servicio médico' }
          ],
          responses: {
            200: { description: 'Información del servicio obtenida correctamente' },
            404: { description: 'El médico no presta el servicio solicitado' }
          }
        },

        patch: {
          summary: 'Modificar servicio de un médico en especifico',
          tags: ['Medicos - Servicios'],
          parameters: [
            { name: 'idMedico', in: 'path', required: true, schema: { type: 'string' }, description: 'Id del médico' },
            { name: 'idServicio', in: 'path', required: true, schema: { type: 'string' }, description: 'Id del servicio médico' }
          ],
          requestBody: {
            required: true,
            content: {
              'json': {
                schema: {
                  type: 'object',
                  properties: {
                    activo: { type: 'boolean', example: true }
                  }
                }
              }
            }
          },
          responses: {
            200: { description: 'Servicio del médico actualizado correctamente' }
          }
        },

        delete: {
          summary: 'Dar de baja un servicio específico de la lista de un médico',
          tags: ['Medicos - Servicios'],
          parameters: [
            { name: 'idMedico', in: 'path', required: true, schema: { type: 'string' }, description: 'Id del médico' },
            { name: 'idServicio', in: 'path', required: true, schema: { type: 'string' }, description: 'Id del servicio médico' }
          ],
          responses: {
            200: { description: 'Servicio eliminado del médico correctamente' },
            404: { description: 'Médico o servicio no encontrado' }
          }
        }
      },

      '/v1/servicios': {
        get: {
          summary: 'Obtener el catálogo completo de servicios médicos',
          description: 'Devuelve un listado de todas las especialidades y prácticas médicas registradas en el sistema.',
          tags: ['Catálogo Servicios'],
          responses: {
            200: { description: 'Catálogo de servicios obtenido correctamente.' }
          }
        },

        post: {
          summary: 'Crear un nuevo servicio médico en el catálogo',
          description: 'Registra una nueva especialidad o práctica.',
          tags: ['Catálogo Servicios'],
          requestBody: {
            required: true,
            content: {
              'json': {
                schema: {
                  type: 'object',
                  properties: {
                    codigo: { type: 'string', example: 'TRAUMA-01', description: 'Código único de identificación interna' },
                    nombre: { type: 'string', example: 'Traumatología', description: 'Nombre formal del servicio' },
                    duracionTurno: { type: 'number', example: 30, description: 'Duración estándar en minutos para los bloques de turnos' }
                  },
                  required: ['codigo', 'nombre', 'duracionTurno']
                }
              }
            }
          },
          responses: {
            201: { description: 'Servicio creado con éxito en el catálogo general.' },
            400: { description: 'Datos inválidos o el código de servicio ya existe.' }
          }
        }
      },

      '/v1/servicios/seed': {
        post: {
          summary: 'Poblar la base de datos con servicios médicos iniciales',
          description: 'Inserta un lote predefinido de especialidades y prácticas básicas para facilitar las pruebas en desarrollo.',
          tags: ['Catálogo Servicios'],
          responses: {
            201: { description: 'Base de datos poblada de manera exitosa con los servicios iniciales.' }
          }
        }
      },

      '/v1/servicios/categorias': {
        get: {
          summary: 'Obtener las categorías de los servicios médicos',
          description: 'Devuelve las categorías o agrupaciones disponibles para clasificar los servicios.',
          tags: ['Catálogo Servicios'],
          responses: {
            200: { description: 'Categorías obtenidas correctamente.' }
          }
        }
      },

      '/v1/servicios/{id}': {
        get: {
          summary: 'Obtener un servicio médico específico del catálogo',
          tags: ['Catálogo Servicios'],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Id único del documento del servicio en MongoDB' }
          ],
          responses: {
            200: { description: 'Servicio encontrado y retornado de forma correcta.' },
            404: { description: 'El servicio con el Id provisto no existe.' }
          }
        },

        put: {
          summary: 'Actualizar por completo un servicio médico existente',
          description: 'Reemplaza todos los campos del servicio médico seleccionado en base a su Id.',
          tags: ['Catálogo Servicios'],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Id único del servicio médico a modificar' }
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    codigo: { type: 'string', example: 'TRAUMA-01' },
                    nombre: { type: 'string', example: 'Traumatología Avanzada' },
                    duracionTurno: { type: 'number', example: 45 }
                  },
                  required: ['codigo', 'nombre', 'duracionTurno']
                }
              }
            }
          },
          responses: {
            200: { description: 'Servicio médico actualizado exitosamente.' },
            404: { description: 'No se encontró un servicio asociado al Id ingresado.' }
          }
        },

        delete: {
          summary: 'Eliminar un servicio médico del catálogo general',
          description: 'Remueve físicamente el servicio de la base de datos.',
          tags: ['Catálogo Servicios'],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Id único del servicio médico a dar de baja' }
          ],
          responses: {
            200: { description: 'Servicio médico removido del catálogo de forma correcta.' },
            404: { description: 'Servicio no encontrado.' }
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