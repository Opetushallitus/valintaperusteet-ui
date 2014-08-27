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
                element.all(by.cssContainingText('option', 'Ammatillisen')).first().click();
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
                input = element(by.model('domain.search.vainHakukohteet'));
                input.click();
            });


        });

        describe('add Valintaryhmä', function() {
            var item = by.xpath("//a[contains(@class, 'margin-right-1')]");
            browser.wait(function() {
                return browser.driver.isElementPresent(item);
            }, 8000);

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

                element.all(by.model('model.parentOid')).first().click();
            });

            it('should input text to Nimi-field', function() {
                var input = element(by.model('model.valintaryhma.nimi'));
                input.sendKeys('TestiValintaryhma');
                expect(input.getAttribute('value')).toBe('TestiValintaryhma');

            });

            it('should click Tallenna-button', function() {
                element(by.buttonText('Tallenna')).click();

            });

            it('should click Takaisin-button', function() {
                element(by.buttonText('Takaisin')).click();

            });
        });

        describe('edit Valintaryhmä', function() {
            var input = element(by.model('domain.search.q'));
            input.clear();

            it('should select new Valintaryhmä', function() {
                element.all(by.xpath("//a[contains(text(),'TestiValintaryhma')]")).first().click();
            });

            it('should be add Valintaryhmä-page', function() {
                expect(browser.getLocationAbsUrl()).toMatch("/valintaryhma");
            });

            it('should input text to Nimi-field', function() {
                var input = element(by.model('model.valintaryhma.nimi'));
                input.sendKeys('2');
                expect(input.getAttribute('value')).toBe('TestiValintaryhma2');

            });
            it('should select item from Haku dropdown', function() {
                element.all(by.model('model.valintaryhma.hakuoid')).first().click();
            });
            it('should select item from Kohdejoukko dropdown', function() {
                element.all(by.model('model.valintaryhma.kohdejoukko')).last().click();
            });

            it('should click Organisaatio-button', function() {
                element(by.buttonText('Organisaatio')).click();

            });

            it('should input text to search-field', function() {
                var input = element(by.model('orgTree.searchStr'));
                input.sendKeys('akaa');
                expect(input.getAttribute('value')).toBe('akaa');

            });

            it('should be select Akaan opisto', function() {
                var item = by.xpath("//a[contains(text(),'Akaan Opisto')]");
                browser.wait(function() {
                    return browser.driver.isElementPresent(item);
                }, 8000);
                element.all(item).first().click();
                element.all(by.xpath("//a[contains(text(),'Sulje')]")).first().click();

            });


        });


         describe('organisaation poistaminen Valintaryhmästä', function() {

             it('should be add Valintaryhmä-page', function () {
             expect(browser.getLocationAbsUrl()).toMatch("/valintaryhma");
             });

             it('should delete organisation', function() {
             element(by.xpath("//i[contains(@class, 'fa-trash-o')]")).click();
             });

             it('should click Tallenna-button', function() {
                 var item = by.xpath("//button[contains(text(),'Tallenna')]");
                 browser.wait(function() {
                     return browser.driver.isElementPresent(item);
                 }, 8000);
                 element(by.buttonText('Tallenna')).click();

             });

             it('should click Takaisin-button', function() {
               element(by.buttonText('Takaisin')).click();

             });
         });

        describe('add Hakukohde', function() {
            var item = by.xpath("//a[contains(@class, 'margin-right-1')]");
            browser.wait(function() {
                return browser.driver.isElementPresent(item);
            }, 8000);

            it('should click add Hakukohde-button', function() {
                element.all(by.xpath("//a[contains(@class, 'margin-right-1')]")).last().click();
            });

            it('should be add hakukohde-page', function() {
                expect(browser.getLocationAbsUrl()).toMatch("/hakukohde");
            });

            it('should input text to Ylävalintaryhmä-field', function() {
                var input = element(by.model('domain.search.q'));
                input.clear();
                input.sendKeys('Ammatillinen');
                expect(input.getAttribute('value')).toBe('Ammatillinen');

                var item = element.all(by.model('model.parentOid')).last();
                item.click();

                element.all(by.model('model.parentOid')).first().click();
            });

            it('should input text to Haun tunniste-field', function() {
                var input = element(by.model('model.haku'));
                input.sendKeys('a');
                expect(input.getAttribute('value')).toBe('a');
                element.all(by.xpath("//a[contains(@tabindex, '-1')]")).first().click();
            });

            it('should input text to Hakukohteen tunniste-field', function() {
                var input = element(by.model('model.selectedHakukohde'));
                input.sendKeys('s');
                expect(input.getAttribute('value')).toBe('s');
                element.all(by.xpath("//a[contains(@tabindex, '-1')]")).last().click();
            });


            it('should click Takaisin-button', function() {
                element(by.buttonText('Takaisin')).click();

            });
        });
/*
        describe('edit Hakukohde', function() {
            var input = element(by.model('domain.search.q'));
            input.clear();
            it('should select new Hakukohde', function() {
                element.all(by.xpath("//a[contains(text(),'Tampereen seudun')]")).first().click();
            });
            it('should be add hakukohde-page', function() {
                expect(browser.getLocationAbsUrl()).toMatch("/hakukohde");
            });

            it('should click Siirrä-button', function() {
                element(by.buttonText('Siirrä')).click();

            });

            it('should input text to Ylävalintaryhmä-field', function() {
                var input = element(by.model('domain.search.q'));
                input.sendKeys('TestiValintaryhma2');
                expect(input.getAttribute('value')).toBe('TestiValintaryhma2');

                var item = element.all(by.model('model.parentOid')).last();
                item.click();
                element.all(by.xpath("//a[contains(text(),'Siirrä')]")).first().click();
            });


        });
*/

        describe('Valintakoekoodin lisääminen Valintaryhmään', function() {
            it('should select new Valintaryhmä', function () {
                element.all(by.xpath("//a[contains(text(),'TestiValintaryhma2')]")).first().click();
            });

            it('should be add Valintaryhmä-page', function () {
                expect(browser.getLocationAbsUrl()).toMatch("/valintaryhma");
            });

            it('should click uusi valintakoekoodi-button', function() {
                element(by.buttonText('Uusi valintakoekoodi')).click();
            });

            it('should input text to Hae-field', function() {
                var input = element(by.model('valintakoekoodifilter'));
                input.sendKeys('haas');
                expect(input.getAttribute('value')).toBe('haas');

                element.all(by.xpath("//span[contains(text(), 'Haastattelu')]")).first().click();

                element(by.buttonText('Valintakoekoodi')).click();

                element.all(by.xpath("//a[contains(text(),'Sulje')]")).first().click();
            });

        });

        describe('Valintakoekoodin poistaminen Valintaryhmästä', function() {

            it('should be add Valintaryhmä-page', function () {
                expect(browser.getLocationAbsUrl()).toMatch("/valintaryhma");
            });

            it('should delete valintakoekoodi', function() {
                element.all(by.xpath("//i[contains(@class, 'fa-trash-o')]")).first().click();
            });
        });

        describe('Hakukohdekoodin lisääminen Valintaryhmään', function() {

            it('should be add Valintaryhmä-page', function () {
                expect(browser.getLocationAbsUrl()).toMatch("/valintaryhma");
            });

            it('should click uusi Hakukohdekoodi-button', function() {
                element(by.buttonText('Uusi hakukohdekoodi')).click();
            });

            it('should input text to Hae-field', function() {
                var input = element(by.model('hakukohdekoodifilter'));
                input.sendKeys('hotell');
                expect(input.getAttribute('value')).toBe('hotell');

                element.all(by.xpath("//span[contains(text(), 'Hotell-')]")).first().click();

                element(by.buttonText('Hakukohdekoodi')).click();

                element.all(by.xpath("//a[contains(text(),'Sulje')]")).first().click();
            });

        });

        describe('Hakukohdekoodin poistaminen Valintaryhmästä', function() {


            it('should be add Valintaryhmä-page', function () {
                expect(browser.getLocationAbsUrl()).toMatch("/valintaryhma");
            });

            it('should delete Hakukohdekoodi', function() {
                element.all(by.xpath("//i[contains(@class, 'fa-trash-o')]")).first().click();
            });
        });


        describe('Valinnanvaiheen lisääminen Valintaryhmään', function() {

            it('should be add Valintaryhmä-page', function () {
                expect(browser.getLocationAbsUrl()).toMatch("/valintaryhma");
            });

            it('should click uusi Valinnanvaihe-button', function() {
                element.all(by.xpath("//span[contains(text(), 'Valinnan vaihe')]")).first().click();
            });

            it('should input text to Hae-field', function() {
                var input = element(by.model('model.valinnanvaihe.nimi'));
                input.sendKeys('testinimi');
                expect(input.getAttribute('value')).toBe('testinimi');

                input = element(by.model('model.valinnanvaihe.kuvaus'));
                input.sendKeys('testikuvaus');
                expect(input.getAttribute('value')).toBe('testikuvaus');

                element(by.buttonText('Tallenna')).click();
                element(by.buttonText('Takaisin')).click();
            });

        });

        describe('Hakukohdekoodin poistaminen Valintaryhmästä', function() {
            it('should be add Valintaryhmä-page', function () {
                expect(browser.getLocationAbsUrl()).toMatch("/valintaryhma");
            });

            it('should delete Hakukohdekoodi', function() {

                element.all(by.xpath("//i[contains(@class, 'fa-trash-o')]")).first().click();

                element(by.buttonText('Kyllä')).click();
                element(by.buttonText('Takaisin')).click();
            });

        });

        describe('delete Valintaryhmä', function() {

            it('should be select new Valintaryhmä', function() {
                element.all(by.xpath("//a[contains(text(),'TestiValintaryhma2')]")).first().click();
            });

            it('should be add Valintaryhmä-page', function() {
                expect(browser.getLocationAbsUrl()).toMatch("/valintaryhma");
            });
            it('should click Poista-button', function() {
                element(by.buttonText('Poista')).click();

            });
            it('should click Kyllä-button', function() {
                element(by.buttonText('Kyllä')).click();

            });
        });

    });
});




