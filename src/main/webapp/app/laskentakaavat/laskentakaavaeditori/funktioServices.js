'use strict';

angular.module('LaskentakaavaEditor').factory('FunktioService', function (FunktioKuvausResource, FunktioNimiService) {
    var model = new function () {
        this.funktiokuvaukset = {};

        this.refresh = function () {
            if (_.isEmpty(model.funktiokuvaukset)) {
                FunktioKuvausResource.get({}, function (result) {
                    model.funktiokuvaukset = result;
                });
            }
        };

        this.getFunktiokuvaukset = function () {
            return model.funktiokuvaukset;
        };

        this.getFunktiokuvaus = function (funktionimi) {
            var result;
            if (model.funktiokuvaukset) {
                model.funktiokuvaukset.forEach(function (funktiokuvaus) {
                    if (funktiokuvaus.nimi === funktionimi) {
                        result = funktiokuvaus;
                    }
                });
            }

            return result;
        };

        this.isNimettyFunktioargumentti = function (parent) {
            var parentFunktionimi = model.getFunktionimi(parent);
            var funktiokuvaus = model.getFunktiokuvaus(parentFunktionimi);
            return funktiokuvaus.funktioargumentit && (funktiokuvaus.funktioargumentit.length > 1 || funktiokuvaus.funktioargumentit[0].kardinaliteetti !== 'n' && !model.isPainotettukeskiarvoChildByParentNimi(parentFunktionimi) );
        };

        this.isNimettyFunktioargumenttiByFunktionimi = function (parentFunktionimi) {
            var funktiokuvaus = model.getFunktiokuvaus(parentFunktionimi);
            return funktiokuvaus.funktioargumentit !== undefined && funktiokuvaus.funktioargumentit && (funktiokuvaus.funktioargumentit.length > 1 || funktiokuvaus.funktioargumentit[0].kardinaliteetti !== 'n' && !model.isPainotettukeskiarvoChildByParentNimi(parentFunktionimi) );
        };

        this.isPainotettukeskiarvoChild = function (parent) {
            if(_.isEmpty(parent)) {return undefined}
            var funktiokuvaus = model.getFunktiokuvaus(model.getFunktionimi(parent));
            return funktiokuvaus.funktioargumentit && funktiokuvaus.funktioargumentit[0].kardinaliteetti === 'lista_pareja';
        };

        this.isPainotettukeskiarvoChildByParentNimi = function (parentFunktionimi) {
            var funktiokuvaus = model.getFunktiokuvaus(parentFunktionimi);
            return funktiokuvaus.funktioargumentit && funktiokuvaus.funktioargumentit[0].kardinaliteetti === 'lista_pareja';
        };

        this.isEmptyNimettyFunktioargumentti = function (parent, funktioargumenttiIndex) {
            if (model.isNimettyFunktioargumentti(parent) && _.isEmpty(parent.funktioargumentit[funktioargumenttiIndex])) {
                return true;
            } else {
                return false;
            }
        };

        this.getFunktionimi = function (funktiokutsu) {
            if(_.isEmpty(funktiokutsu)) {return undefined}
            if(model.isRootFunktiokutsu(funktiokutsu)) {
                //laskentakaavan juurifunktiolla ei ole lapsi-objektia
                return funktiokutsu.funktionimi;
            } else {
                //jos funktio-parametri ei ole laskentakaavan ensimmäinen lapsi, niin funktiolla on lapsi-kääre
                return funktiokutsu.lapsi.funktionimi;
            }
        };

        this.isLukuarvoFunktioSlot = function (parent, funktioargumenttiIndex) {
            var funktiokuvaus = model.getFunktiokuvaus(parent.funktionimi);
            if (funktiokuvaus.funktioargumentit[funktioargumenttiIndex].tyyppi == 'LUKUARVOFUNKTIO') {
                return true;
            } else {
                return false;
            }
        };

        //Montako funktioargumenttia funktiokutsulle luotu
        this.getDefinedFunktioargumenttiCount = function (funktiokutsu) {
            if (funktiokutsu.lapsi) {
                return _.filter(funktiokutsu.lapsi.funktioargumentit, function (item) {
                    return !_.isEmpty(item)
                }).length;
            } else {
                return _.filter(funktiokutsu.funktioargumentit, function (item) {
                    return !_.isEmpty(item)
                }).length;
            }
        };

        this.isRootFunktiokutsu = function(funktiokutsu) {
            if(_.isEmpty(funktiokutsu)) {return undefined}
            return _.isEmpty(funktiokutsu.lapsi) ? true : false;
        };

        this.validateTallennaTulosValues = function(parentFunktio, funktioargumentit, index, errors) {
            if(funktioargumentit) {
                _.forEach(funktioargumentit, function(funktiokutsu, index) {

                    if(!model.isRootFunktiokutsu(funktiokutsu)) {
                        if(funktiokutsu.lapsi.tallennaTulos === true && _.isEmpty(funktiokutsu.lapsi.tulosTunniste)) {
                            errors.push({
                                nimi: FunktioNimiService.getName(funktiokutsu.lapsi.funktionimi),
                                kuvaus: "tulostunniste täytyy määritellä, jos Tallenna tulos -kenttä on valittu",
                                funktiokutsu: funktiokutsu,
                                parent: parentFunktio,
                                isFunktiokutsu: model.isFunktiokutsu(funktiokutsu),
                                index: index
                            });
                        }

                        if(funktiokutsu.lapsi.funktioargumentit) {
                            model.validateTallennaTulosValues(funktiokutsu.lapsi.funktioargumentit, errors);
                        }

                    } else {

                        if(funktiokutsu.tallennaTulos === true && _.isEmpty(funktiokutsu.lapsi.tulosTunniste)) {
                            errors.push({
                                nimi: FunktioNimiService.getName(funktiokutsu.lapsi.funktionimi),
                                kuvaus: "tulostunniste täytyy määritellä, jos tallennaTulos on asetettu",
                                funktiokutsu: funktiokutsu,
                                parent: parentFunktio,
                                isFunktiokutsu: model.isFunktiokutsu(funktiokutsu),
                                index: index
                            });
                        }

                        if(funktiokutsu.funktioargumentit) {
                            model.validateTallennaTulosValues(funktiokutsu.lapsi.funktioargumentit, errors);
                        }
                    }
                });
            }
        };

        this.isFunktiokutsu =  function(funktiokutsu) {
            if(!funktiokutsu.lapsi) {
                return FunktioNimiService.getName(funktiokutsu.funktionimi) !== undefined;
            } else {
                return FunktioNimiService.getName(funktiokutsu.lapsi.funktionimi) !== undefined;
            }
        };

        this.cleanLaskentakaavaPKObjects = function (funktioargumentit) {
            if (funktioargumentit) {
                _.forEach(funktioargumentit, function (item) {
                    if (item.lapsi) {
                        item.lapsi.funktioargumentit = model.cleanLaskentakaavaPKObjects(item.lapsi.funktioargumentit);
                    }
                });
            }
            return _.filter(funktioargumentit, function (item) {
                return !_.isEmpty(item)
            });
        };

        this.addPKObjects = function (funktioargumentit) {
            if (funktioargumentit) {
                _.forEach(funktioargumentit, function (item) {
                    if (item.lapsi) {
                        model.addPKObjects(item.lapsi.funktioargumentit);
                        if (item.lapsi.funktionimi === 'PAINOTETTUKESKIARVO') {
                            item.lapsi.funktioargumentit = model.addPainotettukeskiarvoParametrit(item.lapsi.funktioargumentit);
                        }
                    }
                });
            }
            return funktioargumentit;
        };

        this.addPainotettukeskiarvoParametrit = function (arr) {
            arr.push({});
            arr.push({});
            return arr;
        };


    }

    return model;
});


angular.module('LaskentakaavaEditor').factory('Valintaperusteviitetyypit', function () {
    return [
        { key: 'HAETTAVA_ARVO', text: 'Arvo hakemukselta' },
        { key: 'SYOTETTAVA_ARVO', text: 'Syötettävä arvo' },
        { key: 'HAKUKOHTEEN_ARVO', text: 'Hakukohteen arvo' },
        { key: 'HAKUKOHTEEN_SYOTETTAVA_ARVO', text: 'Hakukohteen syötettävä arvo' }
    ];
});

angular.module('LaskentakaavaEditor').factory('Arvokonvertterikuvauskielet', function () {
    return [
        { key: 'FI', text: 'Suomi' },
        { key: 'SV', text: 'Ruotsi' },
        { key: 'EN', text: 'Englanti' }
    ];
});


