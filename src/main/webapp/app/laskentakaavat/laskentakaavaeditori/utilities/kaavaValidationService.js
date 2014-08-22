angular.module('valintaperusteet').factory('KaavaValidationService', ['FunktioService', 'FunktioNimiService',
    function (FunktioService, FunktioNimiService) {
    'use strict';

    var validationService = new function () {

        this.validateTree = function (rootFunktiokutsu, errors) {
            validationService.makeRootValidations(rootFunktiokutsu, errors);

            _.forEach(rootFunktiokutsu.funktioargumentit, function (funktioargumentti, funktioargumenttiIndex) {
                validationService.validateNode(rootFunktiokutsu, funktioargumentti, funktioargumenttiIndex, errors);
            });

        };

        this.validateNode = function (parent, funktiokutsu, funktiokutsuIndex, errors) {
            if (!(_.isEmpty(funktiokutsu))) {
                validationService.makeNodeValidations(parent, funktiokutsu, funktiokutsuIndex, errors);
                _.forEach(funktiokutsu.lapsi.funktioargumentit, function (funktioargumentti, funktioargumenttiIndex) {
                    validationService.validateNode(funktiokutsu, funktioargumentti, funktioargumenttiIndex, errors);
                });
            }
        };

        this.addValidationError = function (errors, funktionimi, kuvaus, parent, funktiokutsu, funktiokutsuIndex, isFunktiokutsu) {
            errors.push({
                nimi: funktionimi,
                kuvaus: kuvaus,
                parent: parent,
                funktiokutsu: funktiokutsu,
                index: funktiokutsuIndex,
                isFunktiokutsu: isFunktiokutsu
            });
        };

        this.makeRootValidations = function (rootFunktiokutsu, errors) {

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
            _.forEach(rootFunktiokutsu.funktioargumentit, function (funktioargumentti, funktioargumenttiIndex) {
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
        };

        //ajaa kaikki validointitestit annetulle funktiokutsulle. Tätä on tarkoitus ajaa kaikille juurifunktiokutsua alemmille funktiokutsuille
        this.makeNodeValidations = function (parent, funktiokutsu, funktiokutsuIndex, errors) {
            var definedFunktioargumenttiCount = 0;

            //käydään tarkasteltavan funktiokutsun funktioargumentit läpi ja tehdään tarvittavat tarkistukset
            _.forEach(funktiokutsu.lapsi.funktioargumentit, function (funktioargumentti, funktioargumenttiIndex) {

                validationService.nodeTallennaTulosValidation(funktiokutsu, funktioargumentti, funktioargumenttiIndex, errors);

                //definedFunktioargumenttiCount on apumuuttuja, jolla tarkistetaan että nimettyjäfunktioargumentteja on vaadittu määrä tai
                //että funktioargumentteja on vähintään yksi, jos funktiokutsulla on n-funktioargumenttia
                if (!(_.isEmpty(funktioargumentti))) {
                    definedFunktioargumenttiCount += 1;
                }

            });
            validationService.atLeastOneFunktioargumenttiDefined(parent, funktiokutsu, funktiokutsuIndex, definedFunktioargumenttiCount, errors);
            validationService.allNimettyargumenttiDefined(parent, funktiokutsu, funktiokutsuIndex, definedFunktioargumenttiCount, errors);
            validationService.painotettukeskiarvoValidation(parent, funktiokutsu, funktiokutsuIndex, errors);
        };

        // tallennatulos valittu -> tulostunniste täytyy olla määritelty
        this.nodeTallennaTulosValidation = function (parent, funktiokutsu, funktiokutsuIndex, errors) {
            if (parent.lapsi.funktionimi !== 'PAINOTETTUKESKIARVO' && !_.isEmpty(funktiokutsu) && funktiokutsu.lapsi.tallennaTulos === true && _.isEmpty(funktiokutsu.lapsi.tulosTunniste)) {
                var nimi, kuvaus, parent, funktiokutsuIndex, isFunktiokutsu;
                nimi = FunktioNimiService.getName(funktiokutsu.lapsi.funktionimi);
                kuvaus = "tulostunniste täytyy määritellä, jos Tallenna tulos -kenttä on valittu";
                parent = parent;
                isFunktiokutsu = FunktioService.isFunktiokutsu(funktiokutsu);
                funktiokutsuIndex = funktiokutsuIndex;

                validationService.addValidationError(errors, nimi, kuvaus, parent, funktiokutsu, funktiokutsuIndex, isFunktiokutsu);
            }
        };

        // Funktiokutsulle voidaan määritellä N määrä funktioargumentteja - vähintään yksi on määriteltävä
        this.atLeastOneFunktioargumenttiDefined = function (parent, funktiokutsu, funktiokutsuIndex, definedFunktioargumenttiCount, errors) {
            if (FunktioService.isFunktiokutsuWithFunktioargumenttiSizeN(funktiokutsu) && definedFunktioargumenttiCount === 0) {
                var nimi, kuvaus, isFunktiokutsu;
                nimi = FunktioNimiService.getName(funktiokutsu.lapsi.funktionimi);
                kuvaus = "Funktiokutsulle ei ole määritelty yhtään funktioargumenttia. Tälle funktiokutsulle on määriteltävä vähintään yksi funktioargumentti";
                isFunktiokutsu = FunktioService.isFunktiokutsu(funktiokutsu);
                validationService.addValidationError(errors, nimi, kuvaus, parent, funktiokutsu, funktiokutsuIndex, isFunktiokutsu);
            }
        };

        // Tarkistetaan onko kaikki nimetyt funktioargumentit määritelty
        this.allNimettyargumenttiDefined = function (parent, funktiokutsu, funktiokutsuIndex, definedFunktioargumenttiCount, errors) {
            if (FunktioService.isNimettyFunktioargumentti(funktiokutsu) && definedFunktioargumenttiCount !== FunktioService.getNimettyFunktioargumenttiCount(funktiokutsu)) {
                var nimi, kuvaus, isFunktiokutsu;
                nimi = FunktioNimiService.getName(funktiokutsu.lapsi.funktionimi);
                kuvaus = 'Funktiokutsulle on määritelty ' + definedFunktioargumenttiCount + "/" + FunktioService.getNimettyFunktioargumenttiCount(funktiokutsu) + " pakollista funktioargumenttia";
                isFunktiokutsu = FunktioService.isFunktiokutsu(funktiokutsu);

                validationService.addValidationError(errors, nimi, kuvaus, parent, funktiokutsu, funktiokutsuIndex, isFunktiokutsu);
            }
        };

        this.painotettukeskiarvoValidation = function (parent, funktiokutsu, funktiokutsuIndex, errors) {
            if (funktiokutsu.lapsi.funktionimi === 'PAINOTETTUKESKIARVO') {
                var definedFunktioargumenttiCount = 0;
                var hasUndefinedFunktioargumentti = false;
                _.forEach(funktiokutsu.lapsi.funktioargumentit, function (funktioargumentti, funktioargumenttiIndex, funktioargumentit) {
                    if (!(_.isEmpty(funktioargumentti))) {
                        definedFunktioargumenttiCount += 1;
                    } else if (_.isEmpty(funktioargumentti) && funktioargumenttiIndex < funktioargumentit.length - 2) {
                        hasUndefinedFunktioargumentti = true;
                    }
                });

                var kuvaus = undefined;
                if (definedFunktioargumenttiCount < 2 ) {
                    kuvaus = "Painotetulle keskiarvolle täytyy määritellä vähintään kaksi funktioargumenttia";
                } else if (hasUndefinedFunktioargumentti) {
                    kuvaus = "Painotetun keskiarvon funktioargumenttilistan keskellä ei voi olla määrittelemättömiä funktioargumentteja";
                } else if (definedFunktioargumenttiCount % 2 !== 0) {
                    kuvaus = "Painotetulla keskiarvolla täytyy olla parillinen määrä funktioargumentteja";
                }

                if (definedFunktioargumenttiCount % 2 !== 0 || hasUndefinedFunktioargumentti || definedFunktioargumenttiCount < 2) {
                    var nimi, isFunktiokutsu;
                    nimi = FunktioNimiService.getName(funktiokutsu.lapsi.funktionimi);
                    isFunktiokutsu = FunktioService.isFunktiokutsu(funktiokutsu);

                    validationService.addValidationError(errors, nimi, kuvaus, parent, funktiokutsu, funktiokutsuIndex, isFunktiokutsu);
                }
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
            if (funktioargumentit.length > 3) {
                var hasExtraPair = _.every(_.last(funktioargumentit, 4), _.isEmpty);
                if (hasExtraPair) {
                    funktioargumentit.length = funktioargumentit.length - 2;
                    validationService.cleanExtraArguments(funktioargumentit);
                }
            }
        };
    }();

    return validationService;
}]);