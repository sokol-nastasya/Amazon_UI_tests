describe('Amazon home page', () => {
  const baseUrl = 'https://www.amazon.com/';

  it('open Amazon page and search item', () => {
    const searchWord = 'apple';
    cy.visit(baseUrl);
    cy.get('#nav-logo').click();
    cy.get('#twotabsearchtextbox').type(searchWord);
    cy.get('#nav-search-submit-button').click();
    cy.url().should('include', `/s?k=${searchWord}`);
    cy.get('.sg-col-inner').should('contain', searchWord);
    cy.get('.a-color-base').should('be.visible');
    cy.get('#nav-logo').click();
  });


  it('check filters all', () => {
    cy.visit(baseUrl);
    cy.get('#nav-logo').click();
    cy.get('#nav-search-bar-form > .nav-left > #nav-search-dropdown-card > .nav-search-scope > #searchDropdownBox')
      .select('search-alias=aps', { force: true });
    cy.get('#nav-search-bar-form > .nav-left > #nav-search-dropdown-card > .nav-search-scope > #searchDropdownBox')
      .select('search-alias=fashion-girls-intl-ship', { force: true});
    cy.get('#nav-search-submit-button').click();
  })


  it('open navbar menu and check categories for Digital Content & Devices -> Amazon Music', () => {
    cy.visit(baseUrl);
    cy.get('#nav-hamburger-menu').click();
    cy.get('#hmenu-content').should('be.visible');
    const expectedCategories = [
      'Digital Content & Devices', 'Amazon Music', 'Kindle E-readers & Books'
    ];
    cy.get('.hmenu-item').then($items => {
      cy.log('All items:', $items.length);
      $items.each((index, item) => {
        cy.log(`Item ${index}:`, item.innerText.trim());
      });

      const filteredItems = Array.from($items).filter( item => {
        const text = item.innerText.trim();
        return expectedCategories.includes(text);
      })

      cy.log('Filtered items:', filteredItems.length);
      filteredItems.forEach((item, index) => {
        cy.log(`Filtered item ${index}: `, item.innerText.trim());
      });
      
      expect(filteredItems.length).to.be.at.least(3);

      filteredItems.slice(0, 3).forEach((item, index) => {
        expect(item.innerText.trim()).to.eq(expectedCategories[index]);
      });
    });

    cy.wait(1000);
    cy.get('.hmenu-item').contains('Amazon Music').should('be.visible');

    cy.get('.hmenu-item').contains('Amazon Music').click();
    
    
    const expectedStreamMusic = [
      'Amazon Music Unlimited', 'Free Streaming Music', 
      'Podcasts', 'Open Web Player', 'Open Web Player', 'Download the app'
    ];

    cy.get('#hmenu-content').should('be.visible').within(() => {
      expectedStreamMusic.forEach(filter => {
        cy.contains('#hmenu-content', filter).scrollIntoView().should('be.visible');
      });
    });
  });

  it('sign in', () => {
    cy.visit(baseUrl);
    cy.get('.nav-line-1-container').click();
    cy.get('#ap_email').should('be.visible')
      .type('anastasiias798@gmail.com');
    cy.get('#continue').should('be.visible')
      .click();
    cy.get('#ap_password').should('be.visible');
    cy.get('.a-link-nav-icon').click();

  });

  it('add smth from search to cart', () => {
    const searchWord = 'shampoo';
    cy.visit(baseUrl);
    cy.get('#nav-logo').click();
    cy.get('#twotabsearchtextbox').type(searchWord);
    cy.get('#nav-search-submit-button').click();
    cy.url().should('include', `/s?k=${searchWord}`);
    cy.get('.sg-col-inner').should('contain', searchWord);
    cy.get('#a-autoid-1-announce').click();
    cy.wait(1000);
    cy.get('#nav-cart-count-container').click();
    cy.url().should('include', 'nav_cart');
    cy.get('#sc-subtotal-label-activecart').should('contain', 'Subtotal (1 item):');
  });



});
