describe('Public Watchlists Page', () => {
    beforeEach(() => {
        // Set mock token and user in localStorage
        const mockToken = 'mock.jwt.token';
        localStorage.setItem('token', mockToken);

        // Mock decoded user for simplicity
        cy.intercept('GET', '**/watchlist/public', {
            statusCode: 200,
            body: [
                {
                    listId: '1',
                    listName: 'Cool Movies',
                    userId: 'u123',
                    username: 'otherUser',
                    titles: ['t1'],
                    likes: [],
                    comments: [],
                    collaborators: [],
                },
            ],
        });

        cy.intercept('GET', '**/users/friends', {
            statusCode: 200,
            body: [
                // No friends returned, so "otherUser" isn't a friend
            ],
        });

        cy.intercept('GET', '**/watchmode/title/*', {
            statusCode: 200,
            body: {
                title: 'Test Movie',
                poster: '/test-poster.jpg',
            },
        });

        // Intercept add friend API
        cy.intercept('PATCH', '**/users/friends', {
            statusCode: 200,
            body: { message: 'Friend added' },
        }).as('addFriend');

        cy.visit('/watchlists');
    });

    it('should display ➕ Add Friend button for public watchlists of non-friends', () => {
        // Wait for data to load
        cy.contains('Cool Movies').should('be.visible');
        cy.contains('otherUser').should('be.visible');

        // Assert that the Add Friend button appears
        cy.contains('➕ Add Friend').should('be.visible');
    });

    it('should allow adding a friend and update the UI', () => {
        // Make sure the watchlist is visible
        cy.contains('Cool Movies').should('be.visible');
        cy.contains('otherUser').should('be.visible');

        // Ensure Add Friend button is visible
        cy.contains('➕ Add Friend').should('be.visible');

        // Click Add Friend button
        cy.contains('➕ Add Friend').click();

        // Wait for the network request to complete
        cy.wait('@addFriend');

        // Verify button is no longer visible or disabled
        cy.contains('➕ Add Friend').should('not.exist');

        // Optionally, check for alert (if it’s a toast or browser alert)
        cy.on('window:alert', (txt) => {
            expect(txt).to.contains('Friend request sent');
        });

        // Now intercept GET /friends to include the new friend
        cy.intercept('GET', '**/users/friends', {
            statusCode: 200,
            body: [
                {
                    username: 'otherUser',
                    userId: 'u123',
                    email: 'other@example.com',
                },
            ],
        });

        // Navigate to /friends page
        cy.visit('/friends');

        // Assert friend is listed
        cy.contains('otherUser').should('be.visible');
    });
});
