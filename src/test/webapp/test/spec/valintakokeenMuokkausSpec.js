
describe('Valintakokeen muokkaus', function() {
    var VALINTAKOE1 = "VALINTAKOE1";
    var page = valintakokeen_muokkausPage();

    beforeEach(function(done) {
        addTestHook(
            lisakysymyksetFixtures([
                {
                    type: "RadioButton",
                    applicationSystemId: "1.2.246.562.29.95390561488",
                    theme: "hakutoiveet_teema",
                    learningOpportunityId: "1.2.246.562.20.71268712453",
                    targetIsGroup: false,
                    ordinal: 3,
                    state: "ACTIVE",
                    creatorPersonOid: "1.2.246.562.24.41575394116",
                    ownerOrganizationOids: [
                        "1.2.246.562.10.46932738936",
                        "1.2.246.562.10.00000000001",
                        "1.2.246.562.10.78522729439",
                        "1.2.246.562.10.97096148164"
                    ],
                    messageText: {
                        translations: {
                            fi: "Millä kielellä osallistut valintakokeisiin?",
                            sv: "På vilket språk ska du delta i urvalsprovet?",
                            en: "Which language would you like to use in the entrance examinations?"
                        }
                    },
                    helpText: {
                        translations: { }
                    },
                    verboseHelpText: {
                        translations: { }
                    },
                    requiredFieldValidator: false,
                    onCompletedPage: false,
                    options: [
                        {
                            id: "option_0",
                            optionText: {
                                translations: {
                                    fi: "suomeksi",
                                    sv: "på finska",
                                    en: "Finnish"
                                }
                            }
                        },
                        {
                            id: "option_1",
                            optionText: {
                                translations: {
                                    fi: "ruotsiksi",
                                    sv: "på svenska",
                                    en: "Swedish"
                                }
                            }
                        },
                        {
                            id: "option_2",
                            optionText: {
                                translations: {
                                    fi: "englanniksi",
                                    sv: "på engelska",
                                    en: "English"
                                }
                            }
                        }
                    ],
                    _id: "547733b7e4b0c2bb60201419"
                }
            ]))();
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
        it('Vastausvaihtoehtoja ei näy kun lisäkysymyksen tunniste on valitsematta', seqDone(
            wait.forAngular,
            select(page.kutsunKohde, "HAKIJAN_VALINTA"),
            function() {
                expect(page.vastausVaihtoehdot().length).to.equal(0);
            }
        ))
        it('Vastausvaihtoehdot tulee näkyviin kun tunniste valitaan', seqDone(
            wait.forAngular,
            select(page.kutsunKohde, "HAKIJAN_VALINTA"),
            select(page.lisakysymyksenTunniste, "0"),
            function() {
                expect(page.vastausVaihtoehdot().length).to.equal(3);
            }
        ))
    })
});