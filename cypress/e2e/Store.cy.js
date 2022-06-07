import { makeServer } from '../../miragejs/server';

context('Store', () => {
  let server;

  beforeEach(() => {
    server = makeServer({ environment: 'test' });
  });

  afterEach(() => {
    server.shutdown();
  });

  it('should display the store', () => {
    server.createList('product', 10);

    cy.visit('http://localhost:3000');

    // cy.get('body').contains('Brand');
    // cy.get('body').contains('Wrist Watch');
  });
});
