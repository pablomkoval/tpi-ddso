const { defineConfig } = require('cypress');
const path = require('path');
const { execSync } = require('child_process');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    setupNodeEvents(on, config) {
      on('task', {
        // Re-siembra la base de datos con datos conocidos (paciente, medico,
        // servicio "Clinica Medica" y un turno DISPONIBLE) antes de cada corrida,
        // para que reservar un turno no rompa la repetibilidad del test.
        seedDb() {
          execSync('npm run seed-db', {
            cwd: path.resolve(__dirname, '../..'),
            stdio: 'inherit',
          });
          return null;
        },
      });
    },
  },
});
