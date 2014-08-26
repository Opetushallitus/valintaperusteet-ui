'use strict';

describe('E2E-TESTS', function() {
    describe('valintaperusteet', function() {
        browser.get('index.html');

        it('should redirect to rootpage', function() {
            expect(browser.getLocationAbsUrl()).toMatch("/etusivu");
        });

        describe('etusivu', function() {

            it('should render haku when user navigates to /etusivu', function() {
                expect(element.all(by.css('h1')).first().getText()).
                    toMatch(/Valintaryhmät ja hakukohteet/);
            });

            it('should select Ammatillisen item from dropdown', function() {
                element(by.cssContainingText('option', 'Ammatillisen')).click();
            });


            it('should input text to Hae-field', function() {
                var input = element(by.model('domain.search.q'));
                input.sendKeys('123');
                expect(input.getAttribute('value')).toBe('123');
            });

            it('should click checkboxes', function() {
                var input = element(by.model('domain.search.vainValmiitJaJulkaistut'));
                input.click();
                input = element(by.model('domain.search.vainHakukohteitaSisaltavatRyhmat'));
                input.click();
                input = element(by.model('domain.search.vainHakukohteet'));
                input.click();
            });


        });

        describe('add Valintaryhmä', function() {
            it('should click add Valintaryhmä-button', function() {
                element.all(by.xpath("//a[contains(@class, 'btn')]")).first().click();
            });

            it('should be add Valintaryhmä-page', function() {
                expect(browser.getLocationAbsUrl()).toMatch("/valintaryhma");
            });

            it('should input text to Ylävalintaryhmä-field', function() {
                var input = element(by.model('domain.search.q'));
                input.sendKeys('Ammatillinen');
                expect(input.getAttribute('value')).toBe('Ammatillinen');

                var item = element.all(by.model('model.parentOid')).last();
                item.click();
            });


        });
    });
});




