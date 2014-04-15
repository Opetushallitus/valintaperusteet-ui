'use strict';

angular.module('LaskentakaavaEditor').factory('KaavaValidationService', function (FunktioKuvausResource, FunktioNimiService, FunktioService) {
    var validationService = new function() {


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


    }

    return validationService;

});