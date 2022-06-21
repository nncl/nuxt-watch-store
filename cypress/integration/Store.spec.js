import { makeServer } from '../../miragejs/server';

context('Store', () => {
  let server;
  const g = cy.get;
  const gid = cy.getByTestId;

  beforeEach(() => {
    server = makeServer({ environment: 'test' });
  });

  afterEach(() => {
    server.shutdown();
  });

  it('should display the store', () => {
    cy.visit('/');

    g('body').contains('Brand');
    g('body').contains('Wrist Watch');
  });

  context('Store > Shopping Cart', () => {
    const quantity = 10;

    beforeEach(() => {
      server.createList('product', quantity);
      cy.visit('/');
    });

    it('should not display shopping cart when page first loads', () => {
      gid('shopping-cart').should('have.class', 'hidden');
    });

    it('should not display "Clear cart" button when cart is empty', () => {
      gid('toggle-cart').as('toggleButton');
      g('@toggleButton').click();
      gid('clear-cart-button').should('not.be.visible');
    });

    it('should toggle shopping cart visibility cart when button is clicked', () => {
      gid('toggle-cart').as('toggleButton');
      g('@toggleButton').click();
      gid('shopping-cart').should('not.have.class', 'hidden');
      g('@toggleButton').click({ force: true });
      gid('shopping-cart').should('have.class', 'hidden');
    });

    it('should display "Cart is empty" when there are no products', () => {
      gid('toggle-cart').as('toggleButton');
      g('@toggleButton').click();
      gid('shopping-cart').contains('Cart is empty');
    });

    it('should open shopping cart when product is added', () => {
      gid('card-list').first().find('button').click();
      gid('shopping-cart').should('not.have.class', 'hidden');
    });

    it('should add first product to the cart', () => {
      gid('card-list').first().find('button').click();
      gid('cart-list').should('have.length', 1);
    });

    it('should add 3 products to the cart', () => {
      cy.addToCart({ indexes: [1, 3, 5] });
      gid('cart-list').should('have.length', 3);
    });

    it('should add 1 product to the cart', () => {
      cy.addToCart({ index: 3 });
      gid('cart-list').should('have.length', 1);
    });

    it('should add all products to the cart', () => {
      cy.addToCart({ indexes: 'all' });
      gid('cart-list').should('have.length', quantity);
    });

    it('should remove a product from the cart', () => {
      cy.addToCart({ index: 2 });

      gid('cart-list').as('cardItems');

      g('@cardItems').should('have.length', 1);

      g('@cardItems').first().find('[data-testid="remove-item"]').click();

      g('@cardItems').should('have.length', 0);
    });

    it('should clear cart when "Clear cart" button is pressed', () => {
      cy.addToCart({ indexes: [1, 2, 3] });

      gid('cart-list').as('cardItems');
      g('@cardItems').should('have.length', 3);
      gid('clear-cart-button').click();
      g('@cardItems').should('have.length', 0);
    });
  });

  context('Store  > Product List', () => {
    it('should display "0 Products" when no product is returned', () => {
      cy.visit('/');
      gid('card-list').should('have.length', 0);
      g('body').contains('0 Products');
    });

    it('should display "1 Product" when 1 product is returned', () => {
      server.create('product');

      cy.visit('/');
      gid('card-list').should('have.length', 1);
      g('body').contains('1 Product');
    });

    it('should display "10 Products" when 10 products are returned', () => {
      server.createList('product', 10);

      cy.visit('/');
      gid('card-list').should('have.length', 10);
      g('body').contains('10 Products');
    });
  });

  context('Store > Search for products', () => {
    it('should type in the search field', () => {
      cy.visit('/');

      g('input[type="search"]')
        .type('Hello world')
        .should('have.value', 'Hello world');
    });

    it('should return 1 product when "Awesome watch" is used as search term', () => {
      server.create('product', {
        title: 'Awesome watch',
      });
      server.createList('product', 10);

      cy.visit('/');
      g('input[type="search"]').type('Awesome watch');
      gid('search-form').submit();
      gid('card-list').should('have.length', 1);
    });

    it('should not return any product', () => {
      server.createList('product', 10);

      cy.visit('/');
      g('input[type="search"]').type('Awesome watch');
      gid('search-form').submit();
      gid('card-list').should('have.length', 0);
      g('body').contains('0 Products');
    });
  });
});
