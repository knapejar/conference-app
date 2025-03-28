describe('Login Flow', () => {
    beforeEach(() => {
        cy.visit('/');
        // Clear any existing device token
        localStorage.removeItem('deviceToken');
    });

    it('should show welcome page when no device token is present', () => {
        cy.url().should('include', '/welcome');
        cy.contains('Prosím, zadejte kód z pozvánky na konferenci');
    });

    it('should show error for invalid invite code', () => {
        cy.visit('/welcome');
        cy.get('ion-input').type('INVALID123');
        cy.get('ion-button').click();
        cy.contains('Neplatný kód pozvánky');
    });

    it('should successfully login with valid invite code', () => {
        cy.visit('/welcome');
        cy.get('ion-input').type('TEST123');
        cy.get('ion-button').click();
        
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
        
        // Refresh page
        cy.reload();
        
        // Should still be on home page
        cy.url().should('include', '/home');
    });
}); 