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
    cy.visit('/');

    cy.get('body').contains('Brand');
    cy.get('body').contains('Wrist Watch');
  });

  context('Store  > Product List', () => {
    it('should display "0 Products" when no product is returned', () => {
      cy.visit('/');
      cy.get('[data-testid="card-list"]').should('have.length', 0);
      cy.get('body').contains('0 Products');
    });

    it('should display "1 Product" when 1 product is returned', () => {
      server.create('product');

      cy.visit('/');
      cy.get('[data-testid="card-list"]').should('have.length', 1);
      cy.get('body').contains('1 Product');
    });

    it('should display "10 Products" when 10 products are returned', () => {
      server.createList('product', 10);

      cy.visit('/');
      cy.get('[data-testid="card-list"]').should('have.length', 10);
      cy.get('body').contains('10 Products');
    });
  });

  context('Store > Search for products', () => {
    it('should type in the search field', () => {
      cy.visit('/');

      cy.get('input[type="search"]')
        .type('Hello world')
        .should('have.value', 'Hello world');
    });

    it('should return 1 product when "Awesome watch" is used as search term', () => {
      server.create('product', {
        title: 'Awesome watch',
      });
      server.createList('product', 10);

      cy.visit('/');
      cy.get('input[type="search"]').type('Awesome watch');
      cy.get('[data-testid="search-form"]').submit();
      cy.get('[data-testid="card-list"]').should('have.length', 1);
    });

    it('should not return any product', () => {
      server.createList('product', 10);

      cy.visit('/');
      cy.get('input[type="search"]').type('Awesome watch');
      cy.get('[data-testid="search-form"]').submit();
      cy.get('[data-testid="card-list"]').should('have.length', 0);
      cy.get('body').contains('0 Products');
    });
  });
});
