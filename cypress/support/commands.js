Cypress.Commands.add('getByTestId', (selector) => {
  cy.get(`[data-testid="${selector}"]`);
});

Cypress.Commands.add('addToCart', (mode) => {
  cy.getByTestId('card-list').as('productCards');

  const addByIndex = () => {
    click(mode);
  };

  const click = (index) =>
    cy.get('@productCards').eq(index).find('button').click({ force: true });

  const addByIndexes = () => {
    for (const index of mode) {
      click(index);
    }
  };

  const addAll = () => {
    cy.get('@productCards').then(($elements) => {
      let i = 0;

      while (i < $elements.length) {
        click(i);
        i++;
      }
    });
  };

  if (Array.isArray(mode)) {
    addByIndexes();
  } else if (typeof mode === 'number') {
    addByIndex();
  } else if (typeof mode === 'string' && mode === 'all') {
    addAll();
  } else {
    throw new Error(
      'Please provide a valid input for cy.addToCart().\r\nPossible values are array, number and "all"'
    );
  }
});
