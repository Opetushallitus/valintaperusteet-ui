'use strict';

angular.module('LaskentakaavaEditor').factory('KaavaValidationService', function (FunktioService, FunktioNimiService) {

    var validationService = new function () {

        this.validateTallennaTulosValues = function (parentFunktio, funktioargumentit, index, errors) {
            if (funktioargumentit) {
                _.forEach(funktioargumentit, function (funktiokutsu, index) {

                    if (!FunktioService.isRootFunktiokutsu(funktiokutsu)) {
                        if (funktiokutsu.lapsi.tallennaTulos === true && _.isEmpty(funktiokutsu.lapsi.tulosTunniste)) {
                            errors.push({
                                nimi: FunktioNimiService.getName(funktiokutsu.lapsi.funktionimi),
                                kuvaus: "tulostunniste täytyy määritellä, jos Tallenna tulos -kenttä on valittu",
                                funktiokutsu: funktiokutsu,
                                parent: parentFunktio,
                                isFunktiokutsu: FunktioService.isFunktiokutsu(funktiokutsu),
                                index: index
                            });
                        }

                        if (funktiokutsu.lapsi.funktioargumentit) {
                            validationService.validateTallennaTulosValues(funktiokutsu.lapsi.funktioargumentit, errors);
                        }

                    } else {

                        if (funktiokutsu.tallennaTulos === true && _.isEmpty(funktiokutsu.lapsi.tulosTunniste)) {
                            errors.push({
                                nimi: FunktioNimiService.getName(funktiokutsu.lapsi.funktionimi),
                                kuvaus: "tulostunniste täytyy määritellä, jos tallennaTulos on asetettu",
                                funktiokutsu: funktiokutsu,
                                parent: parentFunktio,
                                isFunktiokutsu: FunktioService.isFunktiokutsu(funktiokutsu),
                                index: index
                            });
                        }

                        if (funktiokutsu.funktioargumentit) {
                            validationService.validateTallennaTulosValues(funktiokutsu.lapsi.funktioargumentit, errors);
                        }
                    }
                });
            }
        };


        //clear edit-time extra funktioargumenttislots from painotettukeskiarvo -funktiokutsu
        this.cleanExtraPKArgumenttiSlots = function (funktiokutsu) {
            if (funktiokutsu.lapsi && funktiokutsu.lapsi.funktionimi === 'PAINOTETTUKESKIARVO') {
                validationService.cleanExtraArguments(funktiokutsu.lapsi.funktioargumentit);
            }
            return funktiokutsu;
        };

        this.cleanExtraArguments = function (funktioargumentit) {
            if (!(funktioargumentit.length < 4)) {
                var hasExtraPair = _.every(_.last(funktioargumentit, 4), _.isEmpty);
                if (hasExtraPair) {
                    funktioargumentit.length = funktioargumentit.length - 2;
                    validationService.cleanExtraArguments(funktioargumentit);
                }
            }
        };

        this.ValidateEmptyNimetytFunktioargumentit = function (rootFunktiokutsu, errors) {
            validationService.checkFunktioargumentit(undefined, rootFunktiokutsu, rootFunktiokutsu.funktioargumentit, 1, errors);
        };

        this.checkFunktioargumentit = function (parentFunktiokutsu, funktiokutsu, funktioargumentit, index, errors) {
            _.forEach(funktioargumentit, function (funktioargumentti, itemIndx) {
                var realIndex = itemIndx + 1;
                if(FunktioService.isNimettyFunktioargumentti(funktiokutsu) && _.isEmpty(funktioargumentti)) {
                    errors.push({
                        nimi: FunktioNimiService.getName(funktiokutsu.lapsi.funktionimi),
                        kuvaus: "Nimetyt funktioargumentit ovat pakollisia, järjestyksessä " + realIndex + " funktioargumentti puuttuu",
                        funktiokutsu: funktiokutsu,
                        parent: parentFunktiokutsu,
                        isFunktiokutsu: FunktioService.isFunktiokutsu(funktiokutsu),
                        index: index
                    });
                }
                if(!(_.isEmpty(funktioargumentti))) {
                    validationService.checkFunktioargumentit(funktiokutsu, funktioargumentti, funktioargumentti.lapsi.funktioargumentit, itemIndx, errors);
                }
            });

        };

    }

    return validationService;

});