describe('Login Flow', () => {
    beforeEach(() => {
        cy.mockApi();
        cy.visit('/');
        // Clear any existing device token
        localStorage.removeItem('deviceToken');
    });

    it('should show welcome page when no device token is present', () => {
        cy.url().should('include', '/welcome');
        cy.contains('Prosím, zadejte kód z pozvánky na konferenci');
    });

    it('should show error for invalid invite code', () => {
        // Override the mock for invalid code
        cy.intercept('POST', 'http://localhost:3000/validate-invite', {
            statusCode: 200,
            body: { isValid: false }
        }).as('validateInvite');

        cy.visit('/welcome');
        cy.get('ion-input').type('INVALID123');
        cy.get('ion-button').click();
        cy.contains('Neplatný kód pozvánky');
    });

    it('should successfully login with valid invite code', () => {
        cy.visit('/welcome');
        cy.get('ion-input').type('TEST123');
        cy.get('ion-button').click();
        
        // Wait for API calls to complete
        cy.wait(['@validateInvite', '@createUser', '@initialUpdate']);
        
        // Should redirect to home page
        cy.url().should('include', '/home');
        
        // Should have device token in localStorage
        cy.window().then((win) => {
            cy.wrap(win.localStorage.getItem('deviceToken')).should('not.be.null');
        });
    });

    it('should maintain login state after page refresh', () => {
        // First login
        cy.visit('/welcome');
        cy.get('ion-input').type('TEST123');
        cy.get('ion-button').click();
        
        // Wait for API calls to complete
        cy.wait(['@validateInvite', '@createUser', '@initialUpdate']);
        
        // Refresh page
        cy.reload();
        
        // Should still be on home page
        cy.url().should('include', '/home');
    });
}); 