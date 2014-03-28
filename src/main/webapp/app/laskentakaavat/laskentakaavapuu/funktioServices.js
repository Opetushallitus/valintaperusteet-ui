'use strict';

angular.module('LaskentakaavaEditor').factory('FunktioService', function(FunktioKuvausResource) {
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

        this.isNimettyFunktioargumentti = function(parent) {
            var parentFunktionimi = model.getFunktionimi(parent)
            var funktiokuvaus = model.getFunktiokuvaus(parentFunktionimi);
            return funktiokuvaus.funktioargumentit && (funktiokuvaus.funktioargumentit.length > 1 || funktiokuvaus.funktioargumentit[0].kardinaliteetti !== 'n' && !model.isPainotettukeskiarvoChildByParentNimi(parentFunktionimi) );
        }

        this.isNimettyFunktioargumenttiByFunktionimi = function(parentFunktionimi) {
            var funktiokuvaus = model.getFunktiokuvaus(parentFunktionimi);
            return funktiokuvaus.funktioargumentit && (funktiokuvaus.funktioargumentit.length > 1 || funktiokuvaus.funktioargumentit[0].kardinaliteetti !== 'n' && !model.isPainotettukeskiarvoChildByParentNimi(parentFunktionimi) );
        }

        this.isPainotettukeskiarvoChild = function(parent) {
            var funktiokuvaus = model.getFunktiokuvaus(model.getFunktionimi(parent));
            return funktiokuvaus.funktioargumentit && funktiokuvaus.funktioargumentit[0].kardinaliteetti === 'lista_pareja';
        }

        this.isPainotettukeskiarvoChildByParentNimi = function(parentFunktionimi) {
            var funktiokuvaus = model.getFunktiokuvaus(parentFunktionimi);
            return funktiokuvaus.funktioargumentit && funktiokuvaus.funktioargumentit[0].kardinaliteetti === 'lista_pareja';
        }

        this.isEmptyNimettyFunktioargumentti = function(parent, funktioargumenttiIndex) {
            if( model.isNimettyFunktioargumentti(parent) && _.isEmpty(parent.funktioargumentit[funktioargumenttiIndex]) ) {
                return true;
            } else {
                return false;
            }
        }

        this.getFunktionimi = function(funktio) {
            if(funktio.lapsi) {
                //jos funktio-parametri ei ole laskentakaavan ensimmäinen lapsi, niin funktiolla on lapsi-kääre
                return funktio.lapsi.funktionimi;
            } else {
                //laskentakaavan juurifunktiolla ei ole lapsi-objektia
                return funktio.funktionimi;
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

        //Montako funktioargumenttia funktiokutsulle luotu
        this.getDefinedFunktioargumenttiCount = function(funktiokutsu) {
            if(funktiokutsu.lapsi) {
                return _.filter(funktiokutsu.lapsi.funktioargumentit, function(item) {return !_.isEmpty(item)}).length;
            } else {
                return _.filter(funktiokutsu.funktioargumentit, function(item) {return !_.isEmpty(item)}).length;
            }
        }

        this.refresh = function() {
            FunktioKuvausResource.get({}, function(result) {
                model.funktiokuvaukset = result;
            });
        }


        this.cleanLaskentakaavaPKObjects = function(funktioargumentit) {
            if(funktioargumentit) {
                _.forEach(funktioargumentit, function(item) {
                    if(item.lapsi) { item.lapsi.funktioargumentit = model.cleanLaskentakaavaPKObjects(item.lapsi.funktioargumentit); }
                });
            }
            return _.filter(funktioargumentit, function(item) {return !_.isEmpty(item)});
        }

        this.addPKObjects = function(funktioargumentit) {
            if(funktioargumentit) {
                _.forEach(funktioargumentit, function(item) {
                    if(item.lapsi) {
                        model.addPKObjects(item.lapsi.funktioargumentit);
                        if(item.lapsi.funktionimi === 'PAINOTETTUKESKIARVO') {
                            item.lapsi.funktioargumentit = model.addPainotettukeskiarvoParametrit(item.lapsi.funktioargumentit);     
                        }
                    }
                }); 
            }
            return funktioargumentit;
        }

        this.addPainotettukeskiarvoParametrit = function(arr) {
            arr.push({});
            arr.push({});
            return arr;
        }

    }

    return model;
});

angular.module('LaskentakaavaEditor').factory('FunktioNimiService', function() {
    var nameService = new function() {
        this.nameMappings = {
            LUKUARVO: 'Lukuarvo',
            TOTUUSARVO: 'Totuusarvo',
            HAKUTOIVE: 'Hakutoive',
            DEMOGRAFIA: 'Demografia',
            HAETOTUUSARVO: 'Hae totuusarvo',
            HAELUKUARVO: 'Hae lukuarvo',
            HAELUKUARVOEHDOLLA: 'Hae lukuarvo ehdolla',
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
            NIMETTYTOTUUSARVO: 'Nimetty totuusarvo',
            HAEYOARVOSANA: 'YO-arvosana'
            
        }

        this.getName = function(funktionimi) {
            return nameService.nameMappings[funktionimi];
        }
    }

    return nameService;
});




angular.module('LaskentakaavaEditor').factory('Valintaperusteviitetyypit', function() {
    return [
        { key: 'HAETTAVA_ARVO', text: 'Arvo hakemukselta' },
        { key: 'SYOTETTAVA_ARVO', text: 'Syötettävä arvo' },
        { key: 'HAKUKOHTEEN_ARVO', text: 'Hakukohteen arvo' },
        { key: 'HAKUKOHTEEN_SYOTETTAVA_ARVO', text: 'Hakukohteen syötettävä arvo' }
    ];
});

angular.module('LaskentakaavaEditor').factory('Arvokonvertterikuvauskielet', function() {
    return [
        { key: 'FI', text: 'Suomi' },
        { key: 'SV', text: 'Ruotsi' },
        { key: 'EN', text: 'Englanti' }
    ];
});


