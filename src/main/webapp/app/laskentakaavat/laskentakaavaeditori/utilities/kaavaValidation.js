angular.module('valintaperusteet')

    .service('KaavaValidation', ['_', 'FunktioNimiService', 'FunktioService', 'ErrorService', 'KaavaVirheTyypit',
        function (_, FunktioNimiService, FunktioService, ErrorService, KaavaVirheTyypit) {

            var utility = this;

            this.validateTree = function (rootFunktiokutsu) {

                utility.makeRootValidations(rootFunktiokutsu);

                _.forEach(rootFunktiokutsu.funktioargumentit, function (funktioargumentti, funktioargumenttiIndex) {
                    utility.validateNode(rootFunktiokutsu, funktioargumentti, funktioargumenttiIndex);
                });

            };

            this.validateNode = function (parent, funktiokutsu, funktiokutsuIndex) {
                if (!(_.isEmpty(funktiokutsu))) {
                    utility.makeNodeValidations(parent, funktiokutsu, funktiokutsuIndex);
                    _.forEach(funktiokutsu.lapsi.funktioargumentit, function (funktioargumentti, funktioargumenttiIndex) {
                        utility.validateNode(funktiokutsu, funktioargumentti, funktioargumenttiIndex);
                    });
                }
            };

            this.addValidationError = function (funktionimi, virhetyyppi, parent, funktiokutsu, funktiokutsuIndex) {
                console.log('error arguments', arguments);
                ErrorService.errors.push({
                    nimi: funktionimi,
                    parent: parent,
                    funktiokutsu: funktiokutsu,
                    index: funktiokutsuIndex,
                    isFunktiokutsu: FunktioService.isFunktiokutsu(funktiokutsu),
                    tyyppi: virhetyyppi
                });
            };

            this.makeRootValidations = function (rootFunktiokutsu) {

                // tallennatulos valittu -> tulostunniste täytyy olla määritelty
                // tehdään tarkistus ensin rootille
                if (rootFunktiokutsu.tallennaTulos === true && _.isEmpty(rootFunktiokutsu.tulosTunniste)) {
                    var nimi, kuvaus, parent, funktiokutsu, funktiokutsuIndex, isFunktiokutsu;
                    nimi = FunktioNimiService.getName(rootFunktiokutsu.funktionimi);
                    funktiokutsu = rootFunktiokutsu;
                    parent = undefined;
                    isFunktiokutsu = FunktioService.isFunktiokutsu(rootFunktiokutsu);
                    funktiokutsuIndex = index;
                    utility.addValidationError(nimi, KaavaVirheTyypit.PUUTTUVATALLENNATULOS, parent, funktiokutsu, funktiokutsuIndex);
                }

                // tallennatulos valittu -tarkistus rootin lapsille
                // pakollisten arvokonvertterien puuttumistarkistus rootin lapsille
                _.forEach(rootFunktiokutsu.funktioargumentit, function (funktioargumentti, funktioargumenttiIndex) {
                    //tallennatulosvalidointi tehdään aina funktiokutsun funktioargumenteille, jotta funktioargumentin indeksi saadaan mukaan virheilmoitukseen
                    //tästä syystä validointi tehdään rootissa erikseen juuren funktiokutsulle ja sen funktioargument(e)ille
                    if (funktioargumentti.lapsi.tallennaTulos === true && _.isEmpty(funktioargumentti.lapsi.tulosTunniste)) {
                        utility.addValidationError(
                            FunktioNimiService.getName(funktioargumentti.lapsi.funktionimi),
                            KaavaVirheTyypit.PUUTTUVATALLENNATULOS,
                            rootFunktiokutsu,
                            funktioargumentti,
                            funktioargumenttiIndex
                        );
                    }

                    //Tarkistetaan että hae totuusarvo ja konvertoi lukuarvoksi -funktiokutsulle on määritelty vähintään yksi arvokonvertteri
                    if (funktioargumentti.lapsi.funktionimi === "HAETOTUUSARVOJAKONVERTOILUKUARVOKSI" && (_.isEmpty(funktioargumentti.lapsi.arvokonvertteriparametrit) && _.isEmpty(funktioargumentti.lapsi.arvovalikonvertteriparametrit) )) {
                        utility.addValidationError(
                            FunktioNimiService.getName(funktioargumentti.lapsi.funktionimi),
                            KaavaVirheTyypit.HAETOTUUSARVOJAKONVERTOILUKUARVOKSIPUUTTUVAARVOKONVERTTERI,
                            rootFunktiokutsu,
                            funktioargumentti,
                            funktioargumenttiIndex
                        );
                    }


                });


                // tarkistetaan onko kaikki nimetyt funktioargumentit määritelty
                if (_.isEmpty(rootFunktiokutsu.funktioargumentit[0])) {
                    var nimi, kuvaus, parent, funktiokutsu, funktiokutsuIndex, isFunktiokutsu;
                    nimi = FunktioNimiService.getName(rootFunktiokutsu.funktionimi);
                    funktiokutsu = rootFunktiokutsu;
                    parent = undefined;
                    isFunktiokutsu = FunktioService.isFunktiokutsu(rootFunktiokutsu);
                    funktiokutsuIndex = 0;
                    utility.addValidationError(nimi, KaavaVirheTyypit.JUURIPUUTTUVANIMETTYFUNKTIOARGUMENTTI, parent, funktiokutsu, funktiokutsuIndex);
                }
            };

            //ajaa kaikki validointitestit annetulle funktiokutsulle. Tätä on tarkoitus ajaa kaikille juurifunktiokutsua alemmille funktiokutsuille
            this.makeNodeValidations = function (parent, funktiokutsu, funktiokutsuIndex) {
                var definedFunktioargumenttiCount = 0;

                //käydään tarkasteltavan funktiokutsun funktioargumentit läpi ja tehdään tarvittavat tarkistukset
                _.forEach(funktiokutsu.lapsi.funktioargumentit, function (funktioargumentti, funktioargumenttiIndex) {

                    utility.nodeTallennaTulosValidation(funktiokutsu, funktioargumentti, funktioargumenttiIndex);

                    //definedFunktioargumenttiCount on apumuuttuja, jolla tarkistetaan että nimettyjäfunktioargumentteja on vaadittu määrä tai
                    //että funktioargumentteja on vähintään yksi, jos funktiokutsulla on n-funktioargumenttia
                    if (!(_.isEmpty(funktioargumentti))) {
                        definedFunktioargumenttiCount += 1;
                    }

                });
                utility.atLeastOneArvovalikonvertteriOnHaeTotuusArvoJaKonvertoiLukuarvoksi(parent, funktiokutsu, funktiokutsuIndex);
                utility.atLeastOneFunktioargumenttiDefined(parent, funktiokutsu, funktiokutsuIndex, definedFunktioargumenttiCount);
                utility.allNimettyargumenttiDefined(parent, funktiokutsu, funktiokutsuIndex, definedFunktioargumenttiCount);
                utility.painotettukeskiarvoValidation(parent, funktiokutsu, funktiokutsuIndex);
            };

            this.atLeastOneArvovalikonvertteriOnHaeTotuusArvoJaKonvertoiLukuarvoksi = function (parent, funktiokutsu, funktiokutsuIndex) {

                //Tarkistetaan että hae totuusarvo ja konvertoi lukuarvoksi -funktiokutsulle on määritelty vähintään yksi arvokonvertteri
                if (funktiokutsu.lapsi.funktionimi === "HAETOTUUSARVOJAKONVERTOILUKUARVOKSI" && (_.isEmpty(funktiokutsu.lapsi.arvokonvertteriparametrit) && _.isEmpty(funktiokutsu.lapsi.arvovalikonvertteriparametrit) )) {
                    utility.addValidationError(
                        FunktioNimiService.getName(funktiokutsu.lapsi.funktionimi),
                        KaavaVirheTyypit.HAETOTUUSARVOJAKONVERTOILUKUARVOKSIPUUTTUVAARVOKONVERTTERI,
                        parent,
                        funktiokutsu,
                        funktiokutsuIndex
                    );
                }
            };

            // tallennatulos valittu -> tulostunniste täytyy olla määritelty
            this.nodeTallennaTulosValidation = function (parent, funktiokutsu, funktiokutsuIndex) {
                if (parent.lapsi.funktionimi !== 'PAINOTETTUKESKIARVO' && !_.isEmpty(funktiokutsu) && funktiokutsu.lapsi.tallennaTulos === true && _.isEmpty(funktiokutsu.lapsi.tulosTunniste)) {
                    var nimi, kuvaus, isFunktiokutsu;
                    nimi = FunktioNimiService.getName(funktiokutsu.lapsi.funktionimi);
                    isFunktiokutsu = FunktioService.isFunktiokutsu(funktiokutsu);
                    utility.addValidationError(nimi, KaavaVirheTyypit.PUUTTUVATALLENNATULOS, parent, funktiokutsu, funktiokutsuIndex);
                }
            };

            // Funktiokutsulle voidaan määritellä N määrä funktioargumentteja - vähintään yksi on määriteltävä
            this.atLeastOneFunktioargumenttiDefined = function (parent, funktiokutsu, funktiokutsuIndex, definedFunktioargumenttiCount) {
                if (FunktioService.isFunktiokutsu(funktiokutsu) && FunktioService.hasNSizeFunktioargumenttiByFunktionimi(FunktioService.getFunktionimi(funktiokutsu)) && definedFunktioargumenttiCount === 0) {
                    var nimi, kuvaus, isFunktiokutsu;
                    nimi = FunktioNimiService.getName(funktiokutsu.lapsi.funktionimi);
                    isFunktiokutsu = FunktioService.isFunktiokutsu(funktiokutsu);
                    utility.addValidationError(nimi, KaavaVirheTyypit.PUUTTUVAPAKOLLINENFUNKTIOARGUMENTTI, parent, funktiokutsu, funktiokutsuIndex);
                }
            };

            // Tarkistetaan onko kaikki nimetyt funktioargumentit määritelty
            this.allNimettyargumenttiDefined = function (parent, funktiokutsu, funktiokutsuIndex, definedFunktioargumenttiCount) {
                if (FunktioService.isNimettyFunktioargumentti(funktiokutsu) && definedFunktioargumenttiCount !== FunktioService.getNimettyFunktioargumenttiCount(funktiokutsu)) {
                    var nimi, kuvaus, isFunktiokutsu;
                    nimi = FunktioNimiService.getName(funktiokutsu.lapsi.funktionimi);


                    kuvaus = 'Funktiokutsulle on määritelty ' + definedFunktioargumenttiCount + "/" + FunktioService.getNimettyFunktioargumenttiCount(funktiokutsu) + " pakollista funktioargumenttia";
                    isFunktiokutsu = FunktioService.isFunktiokutsu(funktiokutsu);

                    utility.addValidationError(nimi, KaavaVirheTyypit.PUUTTUVANIMETTYFUNKTIOARGUMENTTI, parent, funktiokutsu, funktiokutsuIndex);
                }
            };

            this.painotettukeskiarvoValidation = function (parent, funktiokutsu, funktiokutsuIndex) {
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

                    var virhetyyppi = undefined;
                    if (definedFunktioargumenttiCount < 2) {
                        virhetyyppi = KaavaVirheTyypit.PKLIIANVAHANFUNKTIOARGUMENTTEJA;
                    } else if (hasUndefinedFunktioargumentti) {
                        virhetyyppi = KaavaVirheTyypit.PKPUUTTUVAFUNKTIOARGUMENTTI;
                    } else if (definedFunktioargumenttiCount % 2 !== 0) {
                        virhetyyppi = KaavaVirheTyypit.PKPARITONMAARAFUNKIOARGUMENTTEJA;
                    }

                    if (definedFunktioargumenttiCount % 2 !== 0 || hasUndefinedFunktioargumentti || definedFunktioargumenttiCount < 2) {
                        var nimi, isFunktiokutsu;
                        nimi = FunktioNimiService.getName(funktiokutsu.lapsi.funktionimi);
                        isFunktiokutsu = FunktioService.isFunktiokutsu(funktiokutsu);

                        utility.addValidationError(nimi, virhetyyppi, parent, funktiokutsu, funktiokutsuIndex);
                    }
                }
            };

            //clear edit-time extra funktioargumenttislots from painotettukeskiarvo -funktiokutsu
            this.cleanExtraPKArgumenttiSlots = function (funktiokutsu) {
                if (funktiokutsu.lapsi && funktiokutsu.lapsi.funktionimi === 'PAINOTETTUKESKIARVO') {
                    utility.cleanExtraArguments(funktiokutsu.lapsi.funktioargumentit);
                }
                return funktiokutsu;
            };

            this.cleanExtraArguments = function (funktioargumentit) {
                if (funktioargumentit.length > 3) {
                    var hasExtraPair = _.every(_.last(funktioargumentit, 4), _.isEmpty);
                    if (hasExtraPair) {
                        funktioargumentit.length = funktioargumentit.length - 2;
                        utility.cleanExtraArguments(funktioargumentit);
                    }
                }
            };
        }]);