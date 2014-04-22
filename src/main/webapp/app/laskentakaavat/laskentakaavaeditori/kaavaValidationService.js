'use strict';

angular.module('LaskentakaavaEditor').factory('KaavaValidationService', function (FunktioService, FunktioNimiService) {

    var validationService = new function () {

        this.validateTree = function (rootFunktiokutsu, errors) {
            validationService.makeRootValidations(rootFunktiokutsu, errors);

            _.forEach(rootFunktiokutsu.funktioargumentit, function (funktioargumentti, funktioargumenttiIndex) {
                validationService.validateNode(rootFunktiokutsu, funktioargumentti, funktioargumenttiIndex, errors);
            });

        }

        this.validateNode = function (parent, funktiokutsu, funktiokutsuIndex, errors) {
            if (!(_.isEmpty(funktiokutsu))) {
                validationService.makeNodeValidations(parent, funktiokutsu, funktiokutsuIndex, errors);
                _.forEach(funktiokutsu.lapsi.funktioargumentit, function (funktioargumentti, funktioargumenttiIndex) {
                    validationService.validateNode(funktiokutsu, funktioargumentti, funktioargumenttiIndex, errors);
                });
            }
        }

        this.addValidationError = function (errors, funktionimi, kuvaus, parent, funktiokutsu, funktiokutsuIndex, isFunktiokutsu) {
            errors.push({
                nimi: funktionimi,
                kuvaus: kuvaus,
                parent: parent,
                funktiokutsu: funktiokutsu,
                index: funktiokutsuIndex,
                isFunktiokutsu: isFunktiokutsu
            });
        }
        
        this.makeRootValidations = function(rootFunktiokutsu, errors) {

            // tallennatulos valittu -> tulostunniste täytyy olla määritelty
            // tehdään tarkistus ensin rootille
            if (rootFunktiokutsu.tallennaTulos === true && _.isEmpty(rootFunktiokutsu.tulosTunniste)) {
                var nimi, kuvaus, parent, funktiokutsu, funktiokutsuIndex, isFunktiokutsu;
                nimi = FunktioNimiService.getName(rootFunktiokutsu.funktionimi);
                kuvaus = "tulostunniste täytyy määritellä, jos Tallenna tulos -kenttä on valittu";
                funktiokutsu = rootFunktiokutsu;
                parent = undefined;
                isFunktiokutsu = FunktioService.isFunktiokutsu(rootFunktiokutsu);
                funktiokutsuIndex = index;
                validationService.addValidationError(errors, nimi, kuvaus, parent, funktiokutsu, funktiokutsuIndex, isFunktiokutsu);
            }

            //tallennatulos valittu -tarkistus (yllä) rootin lapsille
            //tallennatulosvalidointi tehdään aina funktiokutsun funktioargumenteille, jotta funktioargumentin indeksi saadaan mukaan virheilmoitukseen
            //tästä syystä validointi tehdään rootissa erikseen juuren funktiokutsulle ja sen funktioargument(e)ille
            _.forEach(rootFunktiokutsu.funktioargumentit, function(funktioargumentti, funktioargumenttiIndex) {
                if (funktioargumentti.lapsi.tallennaTulos === true && _.isEmpty(funktioargumentti.lapsi.tulosTunniste)) {
                    var nimi, kuvaus, parent, funktiokutsuIndex, isFunktiokutsu;
                    nimi = FunktioNimiService.getName(funktioargumentti.lapsi.funktionimi);
                    kuvaus = "tulostunniste täytyy määritellä, jos Tallenna tulos -kenttä on valittu";
                    parent = parent;
                    isFunktiokutsu = FunktioService.isFunktiokutsu(funktioargumentti);
                    funktiokutsuIndex = funktioargumenttiIndex;
                    validationService.addValidationError(errors, nimi, kuvaus, parent, funktioargumentti, funktiokutsuIndex, isFunktiokutsu);
                }
            });

            // tarkistetaan onko kaikki nimetyt funktioargumentit määritelty
            if (_.isEmpty(rootFunktiokutsu.funktioargumentit[0])) {
                var nimi, kuvaus, parent, funktiokutsu, funktiokutsuIndex, isFunktiokutsu;
                nimi = FunktioNimiService.getName(rootFunktiokutsu.funktionimi);
                kuvaus = "Nimetyt funktioargumentit ovat pakollisia. Funktiokutsun " + funktiokutsuNimi + " funktioargumenttia ei ole määritelty",
                funktiokutsu = rootFunktiokutsu;
                parent = undefined;
                isFunktiokutsu = FunktioService.isFunktiokutsu(rootFunktiokutsu);
                funktiokutsuIndex = 0;

                validationService.addValidationError(errors, nimi, kuvaus, parent, funktiokutsu, funktiokutsuIndex, isFunktiokutsu);
            }
        }

        this.makeNodeValidations = function(parent, funktiokutsu, funktiokutsuIndex, errors) {
            var definedFunktioargumenttiCount = 0;

            //käydään tarkasteltavan funktiokutsun funktioargumentit läpi ja tehdään tarvittavat tarkistukset
            _.forEach(funktiokutsu.lapsi.funktioargumentit, function (funktioargumentti, funktioargumenttiIndex) {
                validationService.nodeTallennaTulosValidation(funktiokutsu, funktioargumentti, funktioargumenttiIndex, errors);

                if (!(_.isEmpty(funktioargumentti))) {
                    definedFunktioargumenttiCount += 1;
                }

            });

            validationService.atLeastOneFunktioargumenttiDefined(parent, funktiokutsu, funktiokutsuIndex, definedFunktioargumenttiCount, errors);
            validationService.allNimettyargumenttiDefined(parent, funktiokutsu, funktiokutsuIndex, errors);
        };

        // tallennatulos valittu -> tulostunniste täytyy olla määritelty
        this.nodeTallennaTulosValidation = function(parent, funktiokutsu, funktiokutsuIndex, errors) {
            if (funktiokutsu && funktiokutsu.lapsi.tallennaTulos === true && _.isEmpty(funktiokutsu.lapsi.tulosTunniste)) {
                var nimi, kuvaus, parent, funktiokutsuIndex, isFunktiokutsu;
                nimi = FunktioNimiService.getName(funktiokutsu.lapsi.funktionimi);
                kuvaus = "tulostunniste täytyy määritellä, jos Tallenna tulos -kenttä on valittu";
                parent = parent;
                isFunktiokutsu = FunktioService.isFunktiokutsu(funktiokutsu);
                funktiokutsuIndex = funktiokutsuIndex;

                validationService.addValidationError(errors, nimi, kuvaus, parent, funktiokutsu, funktiokutsuIndex, isFunktiokutsu);
            }
        }

        // Funktiokutsulle voidaan määritellä N määrä funktioargumentteja - vähintään yksi on määriteltävä
        this.atLeastOneFunktioargumenttiDefined = function (parent, funktiokutsu, funktiokutsuIndex, definedFunktioargumenttiCount, errors ) {
            console.log(funktiokutsu);
            console.log(FunktioService.isFunktiokutsuWithFunktioargumenttiSizeN(funktiokutsu));
            if (FunktioService.isFunktiokutsuWithFunktioargumenttiSizeN(funktiokutsu) && definedFunktioargumenttiCount === 0) {
                var nimi, kuvaus, isFunktiokutsu;
                nimi = FunktioNimiService.getName(funktiokutsu.lapsi.funktionimi);
                kuvaus = "Funktiokutsulle ei ole määritelty yhtään funktioargumenttia. Tälle funktiokutsulle on määriteltävä vähintään yksi funktioargumentti";
                isFunktiokutsu = FunktioService.isFunktiokutsu(funktiokutsu);
                validationService.addValidationError(errors, nimi, kuvaus, parent, funktiokutsu, funktiokutsuIndex, isFunktiokutsu);
            }
        };

        // tarkistetaan onko kaikki nimetyt funktioargumentit määritelty
        this.allNimettyargumenttiDefined = function(parent, funktiokutsu, funktiokutsuIndex, definedFunktioargumenttiCount, errors) {
            if (FunktioService.isNimettyFunktioargumentti(funktiokutsu) && definedFunktioargumenttiCount !== FunktioService.getNimettyFunktioargumenttiCount(funktiokutsu)) {
                var nimi, kuvaus, isFunktiokutsu;
                nimi = FunktioNimiService.getName(funktiokutsu.lapsi.funktionimi);
                kuvaus = 'Funktiokutsulle on määritelty ' + definedFunktioargumenttiCount + "/" + FunktioService.getNimettyFunktioargumenttiCount(funktiokutsu) + " pakollista funktioargumenttia";
                isFunktiokutsu = FunktioService.isFunktiokutsu(funktiokutsu);

                validationService.addValidationError(errors, nimi, kuvaus, parent, funktiokutsu, funktiokutsuIndex, isFunktiokutsu);
            }
        }

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
    }

    return validationService;
});