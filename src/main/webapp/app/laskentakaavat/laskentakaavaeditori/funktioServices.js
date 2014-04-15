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
            if (_.isEmpty(parent)) {
                return undefined
            }

            var funktiokuvaus = model.getFunktiokuvaus(model.getFunktionimi(parent));
            return funktiokuvaus.funktioargumentit && funktiokuvaus.funktioargumentit[0].kardinaliteetti === 'lista_pareja';
        };

        this.isPainotettukeskiarvoChildByParentNimi = function (parentFunktionimi) {
            if (_.isEmpty(parentFunktionimi)) {
                return false
            }
            var funktiokuvaus = model.getFunktiokuvaus(parentFunktionimi);
            return funktiokuvaus.funktioargumentit && funktiokuvaus.funktioargumentit[0].kardinaliteetti === 'lista_pareja';
        };

        this.isEmptyNimettyFunktioargumentti = function (parent, funktioargumenttiIndex) {
            if (parent === undefined || funktioargumenttiIndex === undefined) {
                return undefined;
            }

            if (model.isRootFunktiokutsu(parent)) {
                return model.isNimettyFunktioargumentti(parent) && _.isEmpty(parent.funktioargumentit[funktioargumenttiIndex]) ? true : false;
            } else {
                return model.isNimettyFunktioargumentti(parent) && _.isEmpty(parent.lapsi.funktioargumentit[funktioargumenttiIndex]) ? true : false;
            }
        };

        this.isRootFunktiokutsu = function (funktiokutsu) {
            if (_.isEmpty(funktiokutsu)) {
                return undefined;
            }
            return _.isEmpty(funktiokutsu.lapsi) ? true : false;
        };


        this.getFunktionimi = function (funktiokutsu) {
            if (_.isEmpty(funktiokutsu)) {
                return undefined
            }
            if (model.isRootFunktiokutsu(funktiokutsu)) {
                //laskentakaavan juurifunktiolla ei ole lapsi-objektia
                return funktiokutsu.funktionimi;
            } else {
                //jos funktio-parametri ei ole laskentakaavan ensimmäinen lapsi, niin funktiolla on lapsi-kääre
                return funktiokutsu.lapsi.funktionimi;
            }
        };


        this.isLukuarvoFunktioSlot = function (parent, funktioargumenttiIndex) {
            var isOnNimettySlot = model.isNimettyFunktioargumentti(parent);
            if (model.isRootFunktiokutsu(parent)) {
                var funktiokuvaus = model.getFunktiokuvaus(parent.funktionimi);
                var tyyppi = isOnNimettySlot ? funktiokuvaus.funktioargumentit[funktioargumenttiIndex].tyyppi : funktiokuvaus.funktioargumentit[0].tyyppi;
                return tyyppi === 'LUKUARVOFUNKTIO' ? true : false;
            } else {
                var funktiokuvaus = model.getFunktiokuvaus(parent.lapsi.funktionimi);
                var tyyppi = isOnNimettySlot ? funktiokuvaus.funktioargumentit[funktioargumenttiIndex].tyyppi : funktiokuvaus.funktioargumentit[0].tyyppi;
                return tyyppi === 'LUKUARVOFUNKTIO' ? true : false;
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




        this.isFunktiokutsu = function (funktiokutsu) {
            if (funktiokutsu === undefined) {
                return undefined
            }
            if (model.isRootFunktiokutsu(funktiokutsu)) {
                return FunktioNimiService.getName(funktiokutsu.funktionimi) !== undefined;
            } else {
                return FunktioNimiService.getName(funktiokutsu.lapsi.funktionimi) !== undefined;
            }
        };

        this.cleanLaskentakaavaPKObjects = function (funktioargumentit) {
            if (funktioargumentit) {
                var isRootFunktiokutsu;
                _.forEach(funktioargumentit, function (item) {
                    isRootFunktiokutsu = model.isRootFunktiokutsu(item);
                    if (isRootFunktiokutsu === true) {
                        item.funktioargumentit = model.cleanLaskentakaavaPKObjects(item.funktioargumentit);
                    } else {
                        if (item && item.lapsi) {
                            item.lapsi.funktioargumentit = model.cleanLaskentakaavaPKObjects(item.lapsi.funktioargumentit);
                        }
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
            arr.push(null);
            arr.push(null);
            return arr;
        };


        this.cleanExtraPKArgumenttiSlots = function (funktiokutsu) {
            if (funktiokutsu.lapsi && funktiokutsu.lapsi.funktionimi === 'PAINOTETTUKESKIARVO') {
                model.cleanExtraArguments(funktiokutsu.lapsi.funktioargumentit);
            }
            return funktiokutsu;
        };

        this.cleanExtraArguments = function (funktioargumentit) {
            if (!(funktioargumentit.length < 4)) {
                var hasExtraPair = _.every(_.last(funktioargumentit, 4), _.isEmpty);
                if (hasExtraPair) {
                    funktioargumentit.length = funktioargumentit.length - 2;
                    model.cleanExtraArguments(funktioargumentit);
                }
            }
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


