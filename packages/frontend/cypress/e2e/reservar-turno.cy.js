describe('Buscar y reservar un turno)', () => {
  before(() => {
    // Deja la base con datos conocidos: paciente@mail.com/1234,
    // servicio "Clinica Medica" y un turno DISPONIBLE para reservar.
    cy.task('seedDb');
  });

  it('permite a un paciente buscar un turno disponible, reservarlo y verlo en Mis Turnos', () => {
    cy.loginComoPaciente();

    cy.visit('/buscar-turnos');

    // Abrir el select de Servicio (es el primer combobox del panel de filtros) y elegir "Clinica Medica"
    cy.contains('Filtros de Búsqueda'); // espera a que el panel de filtros termine de cargar
    cy.get('[role="combobox"]').first().click();
    cy.get('[role="listbox"]').contains('li', 'Clinica Medica').click();

    cy.contains('button', 'Aplicar Filtros').click();

    // Debe encontrar al menos un turno disponible con ese servicio
    cy.contains('Se encontraron', { timeout: 10000 });
    cy.contains('button', 'Ver detalles').first().click();

    cy.url().should('match', /\/turnos\/.+/);
    cy.contains('Disponible');

    cy.contains('button', 'Reservar Turno').click();

    cy.contains('¡Turno reservado con éxito!', { timeout: 10000 });
    cy.contains('Reservado');

    // --- Verificación en Mis Turnos (HU-004) ---
    cy.visit('/mis-turnos');
    cy.contains('Próximos');
    cy.contains('Reservado', { timeout: 10000 });
  });
});