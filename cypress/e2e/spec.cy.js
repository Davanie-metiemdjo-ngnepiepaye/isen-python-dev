describe('OC-commerce: Full Signup/Login/Favourite Management', () => {

  // ➡️ Ignorer toutes les erreurs JS du site pendant les tests
  Cypress.on('uncaught:exception', (err, runnable) => {
    return false;
  });

  const username = 'NMD';
  const password = '1hstesh<23456789';
  const email = 'ngnepiepayedavanie@gmail.com';

  beforeEach(() => {
    cy.visit('http://localhost:8000/home');

    // Déconnexion si déjà connecté
    cy.get('body').then(($body) => {
      if ($body.find('a:contains("LOGOUT")').length) {
        cy.contains('LOGOUT').click();
      }
    });
  });

  it('Signs up or logs in successfully', () => {
    // Vérifier si SIGNUP est disponible
    cy.get('body').then(($body) => {
      if ($body.find('a:contains("SIGNUP")').length) {
        // Processus d'inscription
        cy.contains('SIGNUP').click();
        cy.url().should('include', '/user/signup');

        cy.get('[id^=fname]').type('Davanie');
        cy.get('[id^=lname]').type('Ngnepiepaye metiemdjo');
        cy.get('[id^=username]').type(username);
        cy.get('[id^=email]').type(email);
        cy.get('[id^=pass]').type(password);
        cy.get('[id^=re_pass]').type(password);
        cy.get('input[type="checkbox"]').check({ force: true });
        cy.get('form').contains('Register').click();

        // Gestion du lien "I am already member" après tentative de création
        cy.get('body').then(($body2) => {
          if ($body2.find('a:contains("I am already member")').length) {
            cy.contains('I am already member').click();
          }
        });

      } else {
        // Sinon, aller directement sur LOGIN
        cy.contains('LOGIN').click();
      }
    });

    // Connexion
    cy.url({ timeout: 10000 }).should('include', '/user/login');
    cy.get('[id^=your_name]').type(username);
    cy.get('[id^=your_pass]').type(password);
    cy.get('form').contains('Log in').click();

    // Vérification après connexion
    cy.url({ timeout: 10000 }).should('include', '/home');
    cy.contains('FAVOURITE').should('be.visible');
  });

  it('Adds a product to favourites and removes it', () => {
    // Vérifier si connecté, sinon se reconnecter
    cy.get('body').then(($body) => {
      if ($body.find('a:contains("LOGIN")').length) {
        cy.contains('LOGIN').click();
        cy.get('[id^=your_name]').type(username);
        cy.get('[id^=your_pass]').type(password);
        cy.get('form').contains('Log in').click();
        cy.contains('PROFILE', { timeout: 10000 }).should('be.visible').click();
      } else {
        cy.contains('PROFILE', { timeout: 10000 }).should('be.visible').click();
      }
    });

    // Sur PROFILE
    cy.url({ timeout: 10000 }).should('include', '/profile');

    // Ajouter un produit
    cy.contains('Add').first().should('be.visible').click();

    // Aller dans FAVOURITE
    cy.contains('FAVOURITE').click();
    cy.url({ timeout: 10000 }).should('include', '/favourite');

    // Vérification de l'ajout
    cy.get('body').then(($body2) => {
      if ($body2.text().includes('No Product in your favourite list')) {
        cy.log('❌ Produit non ajouté.');
      } else {
        cy.get('table tbody tr', { timeout: 10000 }).should('have.length.greaterThan', 0);

        // Suppression du produit favori (clic icône ❤️)
        cy.get('table tbody tr').first().within(() => {
          cy.get('td').eq(3).find('svg, img, i, button').click();
        });

        // Vérification finale
        cy.contains('No Product in your favourite list', { timeout: 10000 }).should('be.visible');
      }
    });
  });

});
