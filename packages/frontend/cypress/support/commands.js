Cypress.Commands.add('loginComoPaciente', () => {
  cy.visit('/login');
  cy.get('input[type="email"]').type('paciente@mail.com');
  cy.get('input[type="password"]').type('1234');
  cy.contains('button', 'Ingresar a Sweet Medical').click();
  cy.location('pathname', { timeout: 10000 }).should('eq', '/home');
});