
describe('Valintakokeen muokkaus', function() {
    var VALINTAKOE1 = "VALINTAKOE1";
    var page = valintakokeen_muokkausPage();

    beforeEach(function(done) {

        addTestHook(
            valintaryhmatFixtures(
                [
                    {
                        nimi: "Tekniikka, pÃ¤ivÃ¤toteutus, yhteistyÃ¶ssÃ¤",
                        kohdejoukko: "haunkohdejoukko_12",
                        hakuoid: null,
                        hakuvuosi: null,
                        oid: "1421223668659-3190521886537508608"
                    },
                    {
                        nimi: "Tekniikka",
                        kohdejoukko: "haunkohdejoukko_12",
                        hakuoid: null,
                        hakuvuosi: null,
                        oid: "1421223667930-7827999178972907888"
                    },
                    {
                        nimi: "Ammattikorkeakoulut yhteishaku kevÃ¤t 2015",
                        kohdejoukko: "haunkohdejoukko_12",
                        hakuoid: null,
                        hakuvuosi: null,
                        oid: "1421223662475-6481841043755242754"
                    },
                    {
                        nimi: "Korkeakoulujen yhteishaku kevÃ¤t 2015",
                        kohdejoukko: "haunkohdejoukko_12",
                        hakuoid: "1.2.246.562.29.95390561488",
                        hakuvuosi: null,
                        oid: "14183733107665513215039540638407"
                    }
                ]
            )
        )();
        addTestHook(laskentakaavatFixtures([]))();
        addTestHook(valintakoeFixtures(
            {
                tunniste: "38ac0bb0-6b34-4400-b041-afd683bcae33",
                laskentakaavaId: null,
                nimi: "Tekniikan valtakunnallinen valintakoe",
                kuvaus: "Tekniikan valtakunnallinen valintakoe max. 40p. väh. 10p.",
                aktiivinen: true,
                lahetetaankoKoekutsut: true,
                kutsutaankoKaikki: false,
                kutsuttavienMaara: null,
                kutsunKohde: "YLIN_TOIVE",
                kutsunKohdeAvain: null,
                oid: "1427794846091-1171334193663544470",
                funktiokutsu: null
            }))();
        page.openPage(done)
    });

    afterEach(function() {
        if (this.currentTest.state == 'failed') {
            takeScreenshot()
        }
    });

    describe('Hakijan valitsema hakukohde', function() {
        it('Vastausvaihtoehdot näkyy oikein', seqDone(
            wait.forAngular,
            select(page.kutsunKohde, "HAKIJAN_VALINTA"),
            function() {
                console.log("adf");
                //expect(page).to.contain('Ilman');
                /*
                expect(page.nthNameInTable(1)).to.contain('Ilman');
                expect(page.nthNameInTable(2)).to.contain('Yksikkötestihenkilö');
                expect(page.allStudentsTable().length).to.equal(1)
                */
            }
        ))
    })
});