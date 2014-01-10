

app.factory('LaskentakaavaService', function($q, Laskentakaava){
    var model = new function() {
        this.laskentakaavapuu = {};

        this.refresh = function(oid) {
            Laskentakaava.get({oid: oid}, function(result) {
                model.laskentakaavapuu = result
            });
        }
    }   

    return model;
});

app.factory('FunktioService', function(FunktioKuvausResource) {
    var model = new function() {
        this.funktiokuvaukset = {};

        this.getFunktiokuvaukset = function() {
            return model.funktiokuvaukset;
        }

        this.getFunktiokuvaus = function(funktionimi) {
            var result;
            if(model.funktiokuvaukset) {
                model.funktiokuvaukset.forEach(function(funktiokuvaus) {
                    if(funktiokuvaus.nimi === funktionimi) {
                        result = funktiokuvaus;
                    }
                });
            }

            return result;
        }

        this.isNimettyFunktioargumentti = function(parentfunktioNimi) {
            var funktiokuvaus = model.getFunktiokuvaus(parentfunktioNimi);
            return funktiokuvaus.funktioargumentit && (funktiokuvaus.funktioargumentit.length > 1 || funktiokuvaus.funktioargumentit[0].kardinaliteetti != 'n');
        }

        this.isEmptyNimettyFunktioargumentti = function(parent, funktioargumenttiIndex) {
            if( model.isNimettyFunktioargumentti(parent) && _.isEmpty(parent.funktioargumentit[funktioargumenttiIndex]) ) {
                return true;
            } else {
                return false;
            }
        }

        this.isLukuarvoFunktioSlot = function(parent, funktioargumenttiIndex) {
            var funktiokuvaus = model.getFunktiokuvaus(parent.funktionimi);
            if(funktiokuvaus.funktioargumentit[funktioargumenttiIndex].tyyppi == 'LUKUARVOFUNKTIO') {
                return true;
            } else {
                return false;
            }
        }

        this.refresh = function() {
            FunktioKuvausResource.get({}, function(result) {
                model.funktiokuvaukset = result;
            });
        }

        this.addFunktio = function(parent, funktionimi, index) {

        }
    }

    return model;
});

app.factory('FunktioNimiService', function() {
    var nameService = new function() {
        this.nameMappings = {
            LUKUARVO: 'Lukuarvo',
            TOTUUSARVO: 'Totuusarvo',
            HAKUTOIVE: 'Hakutoive',
            DEMOGRAFIA: 'Demografia',
            HAETOTUUSARVO: 'Hae totuusarvo',
            HAELUKUARVO: 'Hae lukuarvo',
            HAEMERKKIJONOJAKONVERTOILUKUARVOKSI: 'Hae merkkijono ja konvertoi lukuarvoksi',
            HAEMERKKIJONOJAVERTAAYHTASUURUUS: 'Hae merkkijono ja vertaa yhtäsuuruus',
            HAEMERKKIJONOJAKONVERTOITOTUUSARVOKSI: 'Hae merkkijono ja konvertoi totuusarvoksi',
            VALINTAPERUSTEYHTASUURUUS: 'Valintaperusteyhtäsuuruus',
            SUMMA: 'Summa',
            TAI: 'Tai',
            TULO: 'Tulo',
            JOS: 'Jos',
            OSAMAARA: 'Osamäärä',
            SUUREMPI: 'Suurempi',
            YHTASUURI: 'Yhtäsuuri',
            PIENEMPI: 'Pienempi',
            MEDIAANI: 'Mediaani',
            PIENEMPITAIYHTASUURI: 'Pienempi tai yhtäsuuri',
            SUUREMPITAIYHTASUURI: 'Suurempi tai yhtäsuuri',
            EI: 'Ei',
            JA: 'Ja',
            MAKSIMI: 'Maksimi',
            MINIMI: 'Minimi',
            NEGAATIO: 'Negaatio',
            KESKIARVO: 'Keskiarvo',
            PAINOTETTUKESKIARVO: 'Painotettu keskiarvo',
            KONVERTOILUKUARVO: 'Konvertoi lukuarvo',
            HYLKAA: 'Hylkää', 
            PYORISTYS: 'Pyöristys',
            SKAALAUS: 'Skaalaus',
            NMINIMI: 'N huonoin',
            NMAKSIMI: 'N paras',
            KESKIARVONPARASTA: 'N:n suurimman keskiarvo',
            SUMMANPARASTA: 'N:n suurimman summa',
            HYLKAAARVOVALILLA: 'Hylkää arvovälillä',
            NIMETTYLUKUARVO: 'Nimetty lukuarvo',
            NIMETTYTOTUUSARVO: 'Nimetty totuusarvo'
        }

        this.getName = function(funktionimi) {
            return nameService.nameMappings[funktionimi];
        }
    }

    return nameService;
});

app.factory('FunktioFactory', function(FunktioService){
    var factory = new function() {
        var funktioprototype = {
            lapsi: {
                funktionimi: undefined,
                arvokonvertteriparametrit: [],
                arvovalikonvertteriparametrit: [],
                syoteparametrit: [],
                funktioargumentit: [],
                valintaperusteviitteet: [],
                validointivirheet: [],
                onLuonnos: false,
                nimi: undefined,
                kuvaus: undefined,
                tyyppi: undefined,
                lapsityyppi: undefined
            },
            indeksi: 0
        }
        /*
        function setLapsityyppi = function(funktiokuvaus, funktiotyyppi, index) {
            if(funktiotyyppi === 'LASKENTAKAAVAVIITE') {
                funktioprototype.lapsi.lapsityyppi = "laskentakaava"
            } else {
                funktioprototype.lapsi.lapsityyppi = "funktiokutsu"
            }
        }

        this.createFunktioInstance = function(parentFunktiokutsu, newFunktioType, index) {
            var funktiokuvaus = FunktioService.getFunktiokuvaus(parentFunktiokutsu.funktionimi);
            funktioprototype.lapsi.tyyppi = newFunktioType;

            setLapsityyppi(funktiokuvaus, newFunktioType, index);

        }
        */
    }

    return factory;
});

app.factory('TemplateService', function(FunktioService) {
    var templateservice = new function() {

        

        this.getSyoteparametriTemplate = function(funktio, syoteparametriIndex) {
            var funktioservice = FunktioService;

            var funktiokuvaus = funktioservice.getFunktiokuvaus(funktio.funktionimi);
            var syoteparametrityyppi = "";
            if(funktiokuvaus.syoteparametrit[0].avain === 'n') {
                syoteparametrityyppi = funktiokuvaus.syoteparametrit[0].tyyppi;
            } else {
                syoteparametrityyppi = funktiokuvaus.syoteparametrit[syoteparametriIndex].tyyppi;
            }

            switch(syoteparametrityyppi) {
                case "DESIMAALILUKU":
                    return "desimaaliluku-template";
                case "KOKONAISLUKU":
                    return "kokonaisluku-template";
                case "TOTUUSARVO":
                    return "totuusarvo-template";
                case "MERKKIJONO":
                    return "merkkijono-template";
                default:
                    return ""
            }
        }

        this.getKonvertteriparametriTemplate = function(konvertteriparametriSelection) {
            switch(konvertteriparametriSelection) {
                case "ARVOKONVERTTERI":
                    return "arvokonvertteri-template";
                case "ARVOVALIKONVERTTERI":
                    return "arvovalikonvertteri-template";
                default: 
                    return "";
            }
        }

    }

    return templateservice;
});


app.factory('Valintaperusteviitetyypit', function() {
    return [
        { key: 'HAETTAVA_ARVO', text: 'Arvo hakemukselta' },
        { key: 'SYOTETTAVA_ARVO', text: 'Syötettävä arvo' },
        { key: 'HAKUKOHTEEN_ARVO', text: 'Hakukohteen arvo' }
    ];
});


