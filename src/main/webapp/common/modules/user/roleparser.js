

angular.module('User')

    .service('RoleParser', ['_', function (_) {
        this.parseMyRoles = function (myroles) {

        };

        this.parseServices = function (myroles) {

        };

        this.parseOrganizations = function (services) {
            return _.pluck(services, 'name');
        };
    }])

.value('palvelutHARDCODE', [
        {
            name: "HAKEMUS",
            palveluTyyppi: "YKSITTAINEN",
            description: {
                texts: [
                    {
                        text: "Hakemusten kÃ¤sittely",
                        lang: "EN"
                    },
                    {
                        text: "Hakemusten kÃ¤sittely",
                        lang: "SV"
                    },
                    {
                        text: "Hakemusten kÃ¤sittely",
                        lang: "FI"
                    }
                ]
            },
            kokoelma: null
        },
        {
            name: "KOOSTEROOLIENHALLINTA",
            palveluTyyppi: "YKSITTAINEN",
            description: {
                texts: [
                    {
                        text: "KÃ¤yttÃ¶oikeusryhmien yllÃ¤pito",
                        lang: "SV"
                    },
                    {
                        text: "KÃ¤yttÃ¶oikeusryhmien yllÃ¤pito",
                        lang: "FI"
                    },
                    {
                        text: "KÃ¤yttÃ¶oikeusryhmien yllÃ¤pito",
                        lang: "EN"
                    }
                ]
            },
            kokoelma: null
        },
        {
            name: "RAPORTOINTI",
            palveluTyyppi: "YKSITTAINEN",
            description: {
                texts: [
                    {
                        text: "Raportointi",
                        lang: "FI"
                    },
                    {
                        text: "Raportointi",
                        lang: "SV"
                    },
                    {
                        text: "Raportointi",
                        lang: "EN"
                    }
                ]
            },
            kokoelma: null
        },
        {
            name: "TIEDONSIIRTO",
            palveluTyyppi: "YKSITTAINEN",
            description: {
                texts: [
                    {
                        text: "Tiedonsiirto",
                        lang: "EN"
                    },
                    {
                        text: "Tiedonsiirto",
                        lang: "SV"
                    },
                    {
                        text: "Tiedonsiirto",
                        lang: "FI"
                    }
                ]
            },
            kokoelma: null
        },
        {
            name: "AITU",
            palveluTyyppi: "YKSITTAINEN",
            description: {
                texts: [
                    {
                        text: "Aitu",
                        lang: "FI"
                    },
                    {
                        text: "Aitu",
                        lang: "EN"
                    },
                    {
                        text: "Aitu",
                        lang: "SV"
                    }
                ]
            },
            kokoelma: null
        },
        {
            name: "IPOSTI",
            palveluTyyppi: "YKSITTAINEN",
            description: {
                texts: [
                    {
                        text: "IPosti",
                        lang: "SV"
                    },
                    {
                        text: "IPosti",
                        lang: "FI"
                    },
                    {
                        text: "IPosti",
                        lang: "EN"
                    }
                ]
            },
            kokoelma: null
        },
        {
            name: "EPERUSTEET",
            palveluTyyppi: "YKSITTAINEN",
            description: {
                texts: [
                    {
                        text: "ePerusteet",
                        lang: "SV"
                    },
                    {
                        text: "ePerusteet",
                        lang: "FI"
                    },
                    {
                        text: "ePerusteet",
                        lang: "EN"
                    }
                ]
            },
            kokoelma: null
        },
        {
            name: "VALINTOJENTOTEUTTAMINEN",
            palveluTyyppi: "YKSITTAINEN",
            description: {
                texts: [
                    {
                        text: "Valintojen toteuttaminen",
                        lang: "EN"
                    },
                    {
                        text: "Valintojen toteuttaminen",
                        lang: "SV"
                    },
                    {
                        text: "Valintojen toteuttaminen",
                        lang: "FI"
                    }
                ]
            },
            kokoelma: null
        },
        {
            name: "ASIAKIRJAPALVELU",
            palveluTyyppi: "YKSITTAINEN",
            description: {
                texts: [
                    {
                        text: "Document service",
                        lang: "EN"
                    },
                    {
                        text: "Dokumentservice",
                        lang: "SV"
                    },
                    {
                        text: "ViestintÃ¤palvelu",
                        lang: "FI"
                    }
                ]
            },
            kokoelma: null
        },
        {
            name: "RYHMASAHKOPOSTI",
            palveluTyyppi: "YKSITTAINEN",
            description: {
                texts: [
                    {
                        text: "Ryhmasahkoposti",
                        lang: "EN"
                    },
                    {
                        text: "Ryhmasahkoposti",
                        lang: "SV"
                    },
                    {
                        text: "Ryhmasahkoposti",
                        lang: "FI"
                    }
                ]
            },
            kokoelma: null
        },
        {
            name: "OHJAUSPARAMETRIT",
            palveluTyyppi: "YKSITTAINEN",
            description: {
                texts: [
                    {
                        text: "Ohjausparametrit",
                        lang: "FI"
                    },
                    {
                        text: "Ohjausparametrit",
                        lang: "EN"
                    },
                    {
                        text: "Ohjausparametrit",
                        lang: "SV"
                    }
                ]
            },
            kokoelma: null
        },
        {
            name: "VALINTAPERUSTEET",
            palveluTyyppi: "YKSITTAINEN",
            description: {
                texts: [
                    {
                        text: "Valintaperusteet",
                        lang: "SV"
                    },
                    {
                        text: "Valintaperusteet",
                        lang: "EN"
                    },
                    {
                        text: "Valintaperusteet",
                        lang: "FI"
                    }
                ]
            },
            kokoelma: null
        },
        {
            name: "LOKALISOINTI",
            palveluTyyppi: "YKSITTAINEN",
            description: {
                texts: [
                    {
                        text: "KÃ¤Ã¤nnÃ¶sten hallinta",
                        lang: "SV"
                    },
                    {
                        text: "KÃ¤Ã¤nnÃ¶sten hallinta",
                        lang: "FI"
                    },
                    {
                        text: "KÃ¤Ã¤nnÃ¶sten hallinta",
                        lang: "EN"
                    }
                ]
            },
            kokoelma: null
        },
        {
            name: "KKHAKUVIRKAILIJA",
            palveluTyyppi: "YKSITTAINEN",
            description: {
                texts: [
                    {
                        text: "KK-hakuvirkailija",
                        lang: "SV"
                    },
                    {
                        text: "KK-hakuvirkailija",
                        lang: "FI"
                    },
                    {
                        text: "KK-hakuvirkailija",
                        lang: "EN"
                    }
                ]
            },
            kokoelma: null
        },
        {
            name: "ANOMUSTENHALLINTA",
            palveluTyyppi: "YKSITTAINEN",
            description: {
                texts: [
                    {
                        text: "KÃ¤yttÃ¶oikeusanomukset",
                        lang: "FI"
                    },
                    {
                        text: "KÃ¤yttÃ¶oikeusanomukset",
                        lang: "EN"
                    },
                    {
                        text: "KÃ¤yttÃ¶oikeusanomukset",
                        lang: "SV"
                    }
                ]
            },
            kokoelma: null
        },
        {
            name: "VALINTAPERUSTEETKK",
            palveluTyyppi: "YKSITTAINEN",
            description: {
                texts: [
                    {
                        text: "Valintaperusteet KK",
                        lang: "EN"
                    },
                    {
                        text: "Valintaperusteet KK",
                        lang: "SV"
                    },
                    {
                        text: "Valintaperusteet KK",
                        lang: "FI"
                    }
                ]
            },
            kokoelma: null
        },
        {
            name: "YHTEYSTIETOTYYPPIENHALLINTA",
            palveluTyyppi: "YKSITTAINEN",
            description: {
                texts: [
                    {
                        text: "Yhteystietotyypit",
                        lang: "SV"
                    },
                    {
                        text: "Yhteystietotyypit",
                        lang: "FI"
                    },
                    {
                        text: "Yhteystietotyypit",
                        lang: "EN"
                    }
                ]
            },
            kokoelma: null
        },
        {
            name: "VALINTAPERUSTEKUVAUSTENHALLINTA",
            palveluTyyppi: "YKSITTAINEN",
            description: {
                texts: [
                    {
                        text: "Valintaperustekuvausten yllÃ¤pito",
                        lang: "EN"
                    },
                    {
                        text: "Valintaperustekuvausten yllÃ¤pito",
                        lang: "FI"
                    },
                    {
                        text: "Valintaperustekuvausten yllÃ¤pito",
                        lang: "SV"
                    }
                ]
            },
            kokoelma: null
        },
        {
            name: "HAKULOMAKKEENHALLINTA",
            palveluTyyppi: "YKSITTAINEN",
            description: {
                texts: [
                    {
                        text: "Hakulomakkeen hallinta",
                        lang: "FI"
                    },
                    {
                        text: "Hakulomakkeen hallinta",
                        lang: "SV"
                    },
                    {
                        text: "Hakulomakkeen hallinta",
                        lang: "EN"
                    }
                ]
            },
            kokoelma: null
        },
        {
            name: "SUORITUSREKISTERI",
            palveluTyyppi: "YKSITTAINEN",
            description: {
                texts: [
                    {
                        text: "Suoritusrekisteri",
                        lang: "FI"
                    },
                    {
                        text: "Suoritusrekisteri",
                        lang: "SV"
                    },
                    {
                        text: "Suoritusrekisteri",
                        lang: "EN"
                    }
                ]
            },
            kokoelma: null
        },
        {
            name: "OMATTIEDOT",
            palveluTyyppi: "YKSITTAINEN",
            description: {
                texts: [
                    {
                        text: "Omat tiedot",
                        lang: "FI"
                    },
                    {
                        text: "Omat tiedot",
                        lang: "EN"
                    },
                    {
                        text: "Omat tiedot",
                        lang: "SV"
                    }
                ]
            },
            kokoelma: null
        },
        {
            name: "TARJONTA",
            palveluTyyppi: "YKSITTAINEN",
            description: {
                texts: [
                    {
                        text: "Koulutusten ja hakukohteiden yllÃ¤pito",
                        lang: "SV"
                    },
                    {
                        text: "Koulutusten ja hakukohteiden yllÃ¤pito",
                        lang: "EN"
                    },
                    {
                        text: "Koulutusten ja hakukohteiden yllÃ¤pito",
                        lang: "FI"
                    }
                ]
            },
            kokoelma: null
        },
        {
            name: "OSOITE",
            palveluTyyppi: "YKSITTAINEN",
            description: {
                texts: [
                    {
                        text: "Osoitepalvelu",
                        lang: "SV"
                    },
                    {
                        text: "Address service",
                        lang: "EN"
                    },
                    {
                        text: "Osoitepalvelu",
                        lang: "FI"
                    }
                ]
            },
            kokoelma: null
        },
        {
            name: "YTLMATERIAALITILAUS",
            palveluTyyppi: "YKSITTAINEN",
            description: {
                texts: [
                    {
                        text: "YTL-materiaalitilaus",
                        lang: "SV"
                    },
                    {
                        text: "YTL-materiaalitilaus",
                        lang: "EN"
                    },
                    {
                        text: "YTL-materiaalitilaus",
                        lang: "FI"
                    }
                ]
            },
            kokoelma: null
        },
        {
            name: "ORGANISAATIOHALLINTA",
            palveluTyyppi: "YKSITTAINEN",
            description: {
                texts: [
                    {
                        text: "Organisaatiotietojen yllÃ¤pito",
                        lang: "FI"
                    },
                    {
                        text: "Organisaatiotietojen yllÃ¤pito",
                        lang: "SV"
                    },
                    {
                        text: "Organisaatiotietojen yllÃ¤pito",
                        lang: "EN"
                    }
                ]
            },
            kokoelma: null
        },
        {
            name: "SISALLONHALLINTA",
            palveluTyyppi: "YKSITTAINEN",
            description: {
                texts: [
                    {
                        text: "SisÃ¤llÃ¶nhallinta",
                        lang: "EN"
                    },
                    {
                        text: "SisÃ¤llÃ¶nhallinta",
                        lang: "SV"
                    },
                    {
                        text: "SisÃ¤llÃ¶nhallinta",
                        lang: "FI"
                    }
                ]
            },
            kokoelma: null
        },
        {
            name: "TARJONTA_KK",
            palveluTyyppi: "YKSITTAINEN",
            description: {
                texts: [
                    {
                        text: "Tarjonta kk",
                        lang: "EN"
                    },
                    {
                        text: "Tarjonta kk",
                        lang: "SV"
                    },
                    {
                        text: "Tarjonta kk",
                        lang: "FI"
                    }
                ]
            },
            kokoelma: null
        },
        {
            name: "VALINTAPERUSTEKUVAUSTENHALLINTA_KK",
            palveluTyyppi: "YKSITTAINEN",
            description: {
                texts: [
                    {
                        text: "Valintaperustekuvausten yllÃ¤pito KK",
                        lang: "FI"
                    },
                    {
                        text: "Valintaperustekuvausten yllÃ¤pito KK",
                        lang: "EN"
                    },
                    {
                        text: "Valintaperustekuvausten yllÃ¤pito KK",
                        lang: "SV"
                    }
                ]
            },
            kokoelma: null
        },
        {
            name: "VALINTATULOSSERVICE",
            palveluTyyppi: "YKSITTAINEN",
            description: {
                texts: [
                    {
                        text: "Valintatulospalvelu",
                        lang: "EN"
                    },
                    {
                        text: "Valintatulospalvelu",
                        lang: "SV"
                    },
                    {
                        text: "Valintatulospalvelu",
                        lang: "FI"
                    }
                ]
            },
            kokoelma: null
        },
        {
            name: "HENKILONHALLINTA",
            palveluTyyppi: "YKSITTAINEN",
            description: {
                texts: [
                    {
                        text: "HenkilÃ¶tietojen kÃ¤sittely",
                        lang: "SV"
                    },
                    {
                        text: "HenkilÃ¶tietojen kÃ¤sittely",
                        lang: "FI"
                    },
                    {
                        text: "HenkilÃ¶tietojen kÃ¤sittely",
                        lang: "EN"
                    }
                ]
            },
            kokoelma: null
        },
        {
            name: "OID",
            palveluTyyppi: "YKSITTAINEN",
            description: {
                texts: [
                    {
                        text: "OID service",
                        lang: "SV"
                    },
                    {
                        text: "OID-palvelu",
                        lang: "FI"
                    },
                    {
                        text: "OID service",
                        lang: "EN"
                    }
                ]
            },
            kokoelma: null
        },
        {
            name: "KOUTE",
            palveluTyyppi: "YKSITTAINEN",
            description: {
                texts: [
                    {
                        text: "OKM:n jÃ¤rjestÃ¤mislupapalvelu",
                        lang: "EN"
                    },
                    {
                        text: "OKM:n jÃ¤rjestÃ¤mislupapalvelu",
                        lang: "FI"
                    },
                    {
                        text: "OKM:n jÃ¤rjestÃ¤mislupapalvelu",
                        lang: "SV"
                    }
                ]
            },
            kokoelma: null
        },
        {
            name: "AIPAL",
            palveluTyyppi: "YKSITTAINEN",
            description: {
                texts: [
                    {
                        text: "Aikuiskoulutuksen palautejÃ¤rjestelmÃ¤",
                        lang: "FI"
                    },
                    {
                        text: "Aikuiskoulutuksen palautejÃ¤rjestelmÃ¤",
                        lang: "SV"
                    },
                    {
                        text: "Aikuiskoulutuksen palautejÃ¤rjestelmÃ¤",
                        lang: "EN"
                    }
                ]
            },
            kokoelma: null
        },
        {
            name: "YTLTULOSLUETTELO",
            palveluTyyppi: "YKSITTAINEN",
            description: {
                texts: [
                    {
                        text: "YTL-tulosluettelo",
                        lang: "FI"
                    },
                    {
                        text: "YTL-tulosluettelo",
                        lang: "SV"
                    },
                    {
                        text: "YTL-tulosluettelo",
                        lang: "EN"
                    }
                ]
            },
            kokoelma: null
        },
        {
            name: "SIJOITTELU",
            palveluTyyppi: "YKSITTAINEN",
            description: {
                texts: [
                    {
                        text: "Sijoittelu",
                        lang: "EN"
                    },
                    {
                        text: "Sijoittelu",
                        lang: "SV"
                    },
                    {
                        text: "Sijoittelu",
                        lang: "FI"
                    }
                ]
            },
            kokoelma: null
        },
        {
            name: "VALINTOJENTOTEUTTAMINENKK",
            palveluTyyppi: "YKSITTAINEN",
            description: {
                texts: [
                    {
                        text: "Valintojen toteuttaminen KK",
                        lang: "SV"
                    },
                    {
                        text: "Valintojen toteuttaminen KK",
                        lang: "FI"
                    },
                    {
                        text: "Valintojen toteuttaminen KK",
                        lang: "EN"
                    }
                ]
            },
            kokoelma: null
        },
        {
            name: "HAKUJENHALLINTA",
            palveluTyyppi: "YKSITTAINEN",
            description: {
                texts: [
                    {
                        text: "Haun yllÃ¤pito",
                        lang: "FI"
                    },
                    {
                        text: "Haun yllÃ¤pito",
                        lang: "SV"
                    },
                    {
                        text: "Haun yllÃ¤pito",
                        lang: "EN"
                    }
                ]
            },
            kokoelma: null
        },
        {
            name: "KOODISTO",
            palveluTyyppi: "YKSITTAINEN",
            description: {
                texts: [
                    {
                        text: "Koodistojen yllÃ¤pito",
                        lang: "FI"
                    },
                    {
                        text: "Koodistojen yllÃ¤pito",
                        lang: "SV"
                    },
                    {
                        text: "Koodistojen yllÃ¤pito",
                        lang: "EN"
                    }
                ]
            },
            kokoelma: null
        }
    ]);




