app.config(function ($translateProvider) {

    $translateProvider.translations('fi', {
        valintaryhmalistaus: {
            add: {
                valintaryhma: "Valintaryhmä",
                hakukohde: "Hakukohde"
            },
            header: "Valintaryhmät ja hakukohteet"
        },
        valintaryhmalomake: {
            valinnanvaihe: "Valinnanvaihe",
            koekutsuvaihe: "Koekutsuvaihe"
        },
        koekutsuvaihe: {
            header: "Koekutsuvaiheen muokkaus"
        },
        jononmuokkaus: {
            header: "jonon muokkaus",
            siirretaan: {
                sijoitteluun: "Siirretään sijoitteluun"
            }
        },
        valintaperusteet: {
            periytyy: {
                false: "ei periydy",
                true: "periytyy"
            },
            tyyppi: {
                TAVALLINEN: "tavallinen",
                VALINTAKOE: "koekutsu"
            }
        }
    });


    $translateProvider.translations('en', {
        valintaryhmalistaus: {
            add: {
                valintaryhma: "Valintaryhmä",
                hakukohde: "Hakukohde"
            },
            header: "Valintaryhmät ja hakukohteet"
        },
        valintaryhmalomake: {
            valinnanvaihe: "Valinnanvaihe",
            koekutsuvaihe: "Koekutsuvaihe"
        },
        koekutsuvaihe: {
            header: "Koekutsuvaiheen muokkaus"
        },
        jononmuokkaus: {
            header: "jonon muokkaus",
            siirretaan: {
                sijoitteluun: "Siirretään sijoitteluun"
            }
        },
        valintaperusteet: {
            periytyy: {
                false: "ei periydy",
                true: "periytyy"
            },
            tyyppi: {
                TAVALLINEN: "tavallinen",
                VALINTAKOE: "koekutsu"
            }
        }
    });

    $translateProvider.preferredLanguage('fi');
});

