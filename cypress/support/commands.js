Cypress.Commands.add('getByTestId', (selector) => {
  cy.get(`[data-testid="${selector}"]`);
});
