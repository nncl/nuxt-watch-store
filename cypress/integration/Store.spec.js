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
    cy.visit('http://localhost:3000');

    cy.get('body').contains('Brand');
    cy.get('body').contains('Wrist Watch');
  });

  context('Store > Search for products', () => {
    it('should type in the search field', () => {
      cy.visit('http://localhost:3000');

      cy.get('input[type="search"]')
        .type('Hello world')
        .should('have.value', 'Hello world');
    });

    it('should return 1 product when "Awesome watch" is used as search term', () => {
      server.create('product', {
        title: 'Awesome watch',
      });
      server.createList('product', 10);

      cy.visit('http://localhost:3000');
      cy.get('input[type="search"]').type('Awesome watch');
      cy.get('[data-testid="search-form"]').submit();
      cy.get('[data-testid="card-list"]').should('have.length', 1);
    });

    it('should not return any product', () => {
      server.createList('product', 10);

      cy.visit('http://localhost:3000');
      cy.get('input[type="search"]').type('Awesome watch');
      cy.get('[data-testid="search-form"]').submit();
      cy.get('[data-testid="card-list"]').should('have.length', 0);
      cy.get('body').contains('0 Products');
    });
  });
});
