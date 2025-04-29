// =============== Create and connect to an account ===============
describe('Create and connect to an account', () => {
  const randomId = Math.floor(Math.random() * 100000);
  const username = `fakeuser${randomId}`;
  const email = `fake${randomId}@email.com`;
  const password = '1hstesh<23456789';

  it('Visits the OC-commerce site and creates an account', () => {
    cy.visit('/home');

    cy.contains('SIGNUP', { timeout: 10000 }).click();
    cy.url({ timeout: 10000 }).should('include', '/user/signup');

    cy.get('[id^=fname]').type('fake');
    cy.get('[id^=lname]').type('user');
    cy.get('[id^=username]').type(username);
    cy.get('[id^=email]').type(email);
    cy.get('[id^=pass]').type(password);
    cy.get('[id^=re_pass]').type(password);
    cy.get('form').contains('Register').click();

    cy.url({ timeout: 10000 }).then((currentUrl) => {
      if (!currentUrl.includes('/user/login')) {
        cy.visit('/user/login');
      }
    });

    cy.get('[id^=your_name]').type(username);
    cy.get('[id^=your_pass]').type(password);
    cy.get('form').contains('Log in').click();

    cy.url({ timeout: 10000 }).should('include', '/home');
    cy.contains('FAVOURITE', { timeout: 10000 }).should('be.visible');

    Cypress.env('username', username);
    Cypress.env('password', password);
  });
});

// =============== Put item in favourite and remove it ===============
describe('Put item in favourite and remove it', () => {
  const password = '1hstesh<23456789';
  let username;

  beforeEach(() => {
    username = Cypress.env('username') || 'fakeuser';
    cy.visit('/user/login');

    cy.get('[id^=your_name]').type(username);
    cy.get('[id^=your_pass]').type(password);
    cy.get('form').contains('Log in').click();
    cy.url({ timeout: 10000 }).should('include', '/home');
  });

  it('Manages favourites', () => {
    cy.contains('FAVOURITE', { timeout: 10000 }).click();
    cy.url({ timeout: 10000 }).should('include', '/favourite');

    cy.get('body').then(($body) => {
      if ($body.find('table.table').length === 0) {
        cy.contains('No Product in your favourite list').should('be.visible');
      } else {
        cy.get('.fa-heart').each(($heart) => {
          cy.wrap($heart).click();
        });
        cy.reload();
        cy.contains('No Product in your favourite list').should('be.visible');
      }
    });

    cy.contains('OC-commerce').click();
    cy.url({ timeout: 10000 }).should('include', '/home');

    cy.get('.col-md-6.col-lg-4').first().trigger('mouseover');
    cy.get('.col-md-6.col-lg-4').first().within(() => {
      cy.get('.fa-heart').click({ force: true });
    });

    cy.contains('FAVOURITE').click();
    cy.url({ timeout: 10000 }).should('include', '/favourite');
    cy.get('table.table tbody tr').should('have.length.at.least', 1);

    cy.get('.fa-heart').first().click();
    cy.contains('No Product in your favourite list').should('be.visible');
  });
});

// =============== Add item to Cart (Forcing modal) ===============
describe('Add item to cart', () => {
  const password = '1hstesh<23456789';
  let username;

  beforeEach(() => {
    username = Cypress.env('username') || 'fakeuser';
    cy.visit('/home');

    cy.get('body').then(($body) => {
      if ($body.find('a:contains("LOGIN")').length) {
        cy.contains('LOGIN', { timeout: 10000 }).click();
        cy.get('[id^=your_name]').type(username);
        cy.get('[id^=your_pass]').type(password);
        cy.get('form').contains('Log in').click();
        cy.url({ timeout: 10000 }).should('include', '/home');
      }
    });
  });

  it('Adds an item to the cart and verifies it', () => {
    // Forcer l'ouverture de la modale directement sans cliquer
    cy.get('#portfolioModal1').invoke('addClass', 'show').invoke('css', 'display', 'block');

    // Cliquer sur "Ajouter au panier"
    cy.contains('Ajouter au panier', { timeout: 10000 }).click();

    // Cliquer sur "Voir le panier"
    cy.contains('Voir le panier', { timeout: 10000 }).click();

    // Vérifier que l'URL est bien le panier
    cy.url({ timeout: 10000 }).should('include', '/cart');

   // ✅ Vérifier qu’un élément .card (produit) est bien présent
   cy.contains('Coca cola', { timeout: 10000 }).should('be.visible');


  });
});
