'use strict';

describe('E2E-TESTS', function() {
    describe('valintaperusteet', function() {
        browser.get('index.html');

        it('should redirect to rootpage', function() {
            expect(browser.getLocationAbsUrl()).toMatch("/haku");
        });

        describe('haku', function() {

            it('should render haku when user navigates to /haku', function() {
                expect(element.all(by.css('h1')).first().getText()).
                    toMatch(/Valintojen toteuttaminen/);
            });

            it('should select first item from dropdown', function() {
                element(by.cssContainingText('option', 'MUUTettu')).click();
                expect(browser.getLocationAbsUrl()).toMatch("/hakukohde");
            });

        });

        describe('hakukohde', function() {
            it('should have hakukohteita', function() {
                expect(element.all(by.css('li')).count()).toBeGreaterThan(0);
            });

        });
    });
});




