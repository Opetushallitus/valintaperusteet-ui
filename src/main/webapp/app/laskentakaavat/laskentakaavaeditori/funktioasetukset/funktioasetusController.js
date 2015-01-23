angular.module('valintaperusteet')

    .controller('funktiokutsuAsetuksetController', ['$scope', '$log', '$q', '$routeParams', '$location', '$timeout', 'Laskentakaava',
        'FunktioNimiService', 'FunktioFactory', 'KaavaValidation', 'GuidGenerator', 'HakemusavaimetLisakysymykset', 'HakemusavaimetLomake',
        'ValintaryhmaModel', 'Treemodel', 'LaskentakaavaValintaryhma', '$cookieStore', '$window', 'UserModel', 'ErrorService', '_', 'FunktioService',
        'LaskentakaavaModalService', 'FunktiokutsuKaareService', 'FunktiokuvausService', 'HakukohdeModel',
        function ($scope, $log, $q, $routeParams, $location, $timeout, Laskentakaava,
                  FunktioNimiService, FunktioFactory, KaavaValidation, GuidGenerator, HakemusavaimetLisakysymykset, HakemusavaimetLomake,
                  ValintaryhmaModel, Treemodel, LaskentakaavaValintaryhma, $cookieStore, $window, UserModel, ErrorService, _, FunktioService,
                  LaskentakaavaModalService, FunktiokutsuKaareService, FunktiokuvausService, HakukohdeModel) {

            UserModel.refreshIfNeeded();

            $scope.valintaryhmaModel = ValintaryhmaModel;
            $scope.treemodel = Treemodel;
            $scope.guidGenerator = GuidGenerator;
            $scope.funktioService = FunktioService;
            $scope.laskentakaavaModalService = LaskentakaavaModalService;
            $scope.kaareService = FunktiokutsuKaareService;
            $scope.valintaryhmaPromise = $scope.valintaryhmaModel.loaded.promise;

            $scope.lisakysymysAvaimet = [];
            $scope.bigdata = [];

            if ($routeParams.valintaryhmaOid !== undefined) { //if laskentakaava belongs to a valintaryhma
                $scope.valintaryhmaModel.refreshIfNeeded($routeParams.valintaryhmaOid);
                $scope.valintaryhmaPromise.then(function (result) {
                    $scope.resolveHaku();
                }, function(reject) {
                    $log.error('Valintaryhmän lataaminen epäonnistui', reject);
                });
            } else if($routeParams.hakukohdeOid !== undefined) { //if laskentakaava belongs to a hakukohde
                HakukohdeModel.refreshIfNeeded($routeParams.hakukohdeOid);
                HakukohdeModel.loaded.promise.then(function () {
                    $scope.resolveHaku();
                }, function (error) {
                    $log.error('Hakukohteen lataaminen epäonnistui', error);
                });
            }

            $scope.$watch('funktioasetukset.parentFunktiokutsu', function () {
                if(!_.isEmpty($scope.funktioasetukset.parentFunktiokutsu)) {
                    $scope.selectedFunktiokutsuIsLukuarvoFunktio = FunktioService.isLukuarvoFunktioSlot($scope.funktioasetukset.parentFunktiokutsu, $scope.funktioasetukset.selectedFunktioIndex);
                    $scope.selectedFunktiokutsunHasFunktioArgumentit = FunktioService.hasFunktioargumentit($scope.funktioasetukset.parentFunktiokutsu, $scope.funktioasetukset.selectedFunktioIndex);
                }
            });
            
            $scope.$on('showFunktiokutsuAsetukset', function () {
                if($scope.funktioSelection.lapsi && $scope.funktioSelection.lapsi.valintaperusteviitteet.length > 0) {
                    _.forEach($scope.funktioSelection.lapsi.valintaperusteviitteet, function(valintaperuste) {
                        $scope.changeAvainOptions(valintaperuste);
                    });
                }
                $scope.show();
            });

            $scope.generateSyoteId = function (valintaperuste) {
                valintaperuste.tunniste = $scope.guidGenerator();
            };

            $scope.getFunktiokutsuName = function (funktiokutsu) {
                if (funktiokutsu.lapsi) {
                    return FunktioNimiService.getName(funktiokutsu.lapsi.funktionimi);
                } else {
                    return FunktioNimiService.getName(funktiokutsu.funktionimi);
                }
            };

            $scope.saveAsNewLaskentakaava = function (parent, funktiokutsu, newKaavaNimi, newKaavaKuvaus, closeModal) {
                var osakaava = FunktioFactory.createEmptyLaskentakaava($scope.funktioSelection, $routeParams, newKaavaNimi, newKaavaKuvaus);
                $scope.persistOsakaava(osakaava, funktiokutsu, closeModal);
            };

            $scope.persistOsakaava = function (osakaava, funktiokutsu, closeModal) {
                KaavaValidation.validateTree($scope.model.laskentakaavapuu.funktiokutsu);
                if (ErrorService.noErrors()) {
                    closeModal();
                    Laskentakaava.insert({}, osakaava, function (savedKaava) {
                        $scope.funktiokutsuSavedAsLaskentakaava(FunktioFactory.getLaskentakaavaviiteFromLaskentakaava(savedKaava));
                    }, function (error) {

                    });
                }
            };

            $scope.resolveHaku = function() {

                var hakuoid = $cookieStore.get('hakuoid');
                if(hakuoid) {
                    $scope.getHakemusAvaimet(hakuoid);
                }
                else if(!hakuoid && $scope.treemodel.search.haku) {
                    $scope.getHakemusAvaimet($scope.treemodel.search.haku.oid);

                } else if(!hakuoid && $routeParams.laskentakaavaOid) {
                    LaskentakaavaValintaryhma.get({oid: $routeParams.laskentakaavaOid}, function(valintaryhma) {
                        if(!_.isEmpty(valintaryhma.hakuoid)) {
                            $scope.getHakemusAvaimet(valintaryhma.hakuoid);
                        } else {
                            $log.log("hakuoidia ei löydy");
                        }
                    });
                } else {
                    $log.log("hakuoidia ei löydy");
                }
            };

            $scope.parseOptions = function(options, lomake) {
                return _.map(options, function(option) {
                    var opt = {};
                    if(lomake) {
                        opt.id = option.value;
                        opt.text = option.i18nText.translations.fi;
                    } else {
                        opt.id = option.id;
                        opt.text = option.optionText.translations.fi;
                    }
                    return opt;
                });
            };

            $scope.parseLisakysymysAvaimet = function(haetutAvaimet) {
                var avaimet = [];
                _.forEach(haetutAvaimet, function(phase) {

                    var obj = {};
                    obj.key = phase._id;
                    if(phase.messageText) {
                        obj.value = phase._id + ' - ' + phase.messageText.translations.fi;
                    } else {
                        obj.value = phase._id;
                    }
                    if(phase.options) {
                        obj.options = $scope.parseOptions(phase.options, false);
                    }

                    avaimet.push(obj);

                });
                return avaimet;
            };



            $scope.getHakemusAvaimet = function (hakuoid) {

                    HakemusavaimetLomake.get({hakuoid: hakuoid}, function (haetutAvaimet) {
                            var tyypit = ["TextQuestion","DropdownSelect","Radio","DateQuestion","SocialSecurityNumber","PostalCode","GradeGridOptionQuestion"];
                            var avaimet = [];
                            var hakutoiveRivi = "PreferenceRow";
                            var hakutoivePostfixes = ["-Koulutus",
                                "-Koulutus-educationDegree",
                                "-Koulutus-id",
                                "-Koulutus-id-aoIdentifier",
                                "-Koulutus-id-athlete",
                                "-Koulutus-id-educationcode",
                                "-Koulutus-id-kaksoistutkinto",
                                "-Koulutus-id-lang",
                                "-Koulutus-id-sora",
                                "-Koulutus-id-vocational",
                                "-Opetuspiste",
                                "-Opetuspiste-id"];

                            var flattenRecursively = function(array) {
                                var result = [];
                                _.forEach(array, function(phase) {
                                    if(phase.type === hakutoiveRivi) {
                                        _.forEach(hakutoivePostfixes, function(postfix) {
                                            result.push({type: hakutoiveRivi, id: phase.id+postfix});
                                        });
                                    }
                                    else if(phase.children) {
                                        var current = _.omit(phase, phase.children);
                                        if(tyypit.indexOf(phase.type) !== -1) {
                                            result.push(current);
                                        }
                                        result = _.union(result, flattenRecursively(phase.children));
                                    } else {
                                        if(tyypit.indexOf(phase.type) !== -1) {
                                            result.push(phase);
                                        }
                                    }
                                });
                                return result;
                            };

                            var flatten = _.flatten(flattenRecursively(haetutAvaimet.children));
                            _.forEach(flatten, function(phase) {

                                var obj = {};
                                obj.key = phase.id;
                                if(phase.i18nText) {
                                    obj.value = phase.id + ' - ' + phase.i18nText.translations.fi;
                                } else {
                                    obj.value = phase.id;
                                }
                                if(phase.options) {
                                    obj.options = $scope.parseOptions(phase.options, true);
                                }
                                avaimet.push(obj);
                            });


                            $scope.bigdata = avaimet;
                        }, function (error) {
                            $log.log("hakulomakkeen avaimia ei löytynyt", error);
                        }
                    );
                    
                    UserModel.organizationsDeferred.promise.then(function () {
                        HakemusavaimetLisakysymykset.get({hakuoid: hakuoid, orgId: UserModel.organizationOids[0]},function (haetutAvaimet) {
                                $scope.lisakysymysAvaimet = $scope.parseLisakysymysAvaimet(haetutAvaimet);
                            }, function (error) {
                                $log.log("lisakysymyksiä ei löytynyt", error);
                            }
                        );
                    }, function () {
                        HakemusavaimetLisakysymykset.get({hakuoid: hakuoid},function (haetutAvaimet) {
                               $scope.lisakysymysAvaimet = $scope.parseLisakysymysAvaimet(haetutAvaimet);
                            }, function (error) {
                                $log.error("lisakysymyksiä ei löytynyt", error);

                            }
                        );
                    });


            };

            $scope.changeAvainOptions = function(valintaperuste) {
                valintaperuste.avainOptions = _.flatten(_.pluck(_.filter($scope.lisakysymysAvaimet, function(avain) {return avain.key == valintaperuste.tunniste}), 'options'));
                if(!valintaperuste.avainOptions || valintaperuste.avainOptions.length == 0) {
                    valintaperuste.avainOptions = _.flatten(_.pluck(_.filter($scope.bigdata, function(avain) {return avain.key == valintaperuste.tunniste}), 'options'));
                }
            };


            $scope.showFunktiokutsunKaarintaModal = function () {
                FunktiokutsuKaareService.setFunktioKaareLista(FunktioService.getFunktiokutsuTyyppi($scope.funktioSelection));
                LaskentakaavaModalService.toggleModalSelection('kaare');
            };

            $scope.kaariFunktiokutsu = function (kaarivaFunktiokutsuNimi, childFunktiokutsuIndex) {

                if(FunktioService.isRootFunktiokutsu($scope.funktioasetukset.parentFunktiokutsu) && FunktiokuvausService.kaarittavaFunktiokutsuCanBeSetToFirstChildByFunktionimi(kaarivaFunktiokutsuNimi)) {
                    $scope.kaariFunktiokutsuFirstFunktioargumentti(kaarivaFunktiokutsuNimi);
                } else {
                    $scope.kaariFunktiokutsuFunktioargumentiksiIndeksilla(kaarivaFunktiokutsuNimi, childFunktiokutsuIndex);
                }
                LaskentakaavaModalService.resetModalSelection();
            };

            //Käärivällä funktiokutsulla voi olla N määrä funktioargumentteja
            $scope.kaariFunktiokutsuFirstFunktioargumentti = function (kaarivaFunktiokutsuNimi) {
                var isRootFunktiokutsu = FunktioService.isRootFunktiokutsu($scope.funktioasetukset.parentFunktiokutsu);
                var kaarittavaFunktiokutsu = FunktioService.getCurrentFunktiokutsu($scope.funktioasetukset.parentFunktiokutsu, $scope.funktioasetukset.selectedFunktioIndex);
                var kaarivaFunktiokutsu  = FunktioFactory.createFunktioInstance($scope.funktioasetukset.parentFunktiokutsu, kaarivaFunktiokutsuNimi, isRootFunktiokutsu);
                kaarivaFunktiokutsu.open = true;

                if(isRootFunktiokutsu) {
                    kaarivaFunktiokutsu.lapsi.funktioargumentit[0] = kaarittavaFunktiokutsu;
                    $scope.funktioasetukset.parentFunktiokutsu.funktioargumentit[$scope.funktioasetukset.selectedFunktioIndex] = kaarivaFunktiokutsu;
                } else {
                    kaarivaFunktiokutsu.lapsi.funktioargumentit[0] = kaarittavaFunktiokutsu;
                    $scope.funktioasetukset.parentFunktiokutsu.lapsi.funktioargumentit[$scope.funktioasetukset.selectedFunktioIndex] = kaarivaFunktiokutsu;
                }

                LaskentakaavaModalService.resetModalSelection();
            };

            $scope.kaariFunktiokutsuFunktioargumentiksiIndeksilla = function (kaarivaFunktiokutsuNimi, childFunktiokutsuIndex) {
                var isRootFunktiokutsu = FunktioService.isRootFunktiokutsu($scope.funktioasetukset.parentFunktiokutsu);
                var kaarittavaFunktiokutsu = FunktioService.getCurrentFunktiokutsu($scope.funktioasetukset.parentFunktiokutsu, $scope.funktioasetukset.selectedFunktioIndex);
                var kaarivaFunktiokutsu  = FunktioFactory.createFunktioInstance($scope.funktioasetukset.parentFunktiokutsu, kaarivaFunktiokutsuNimi, isRootFunktiokutsu);
                kaarivaFunktiokutsu.open = true;
                if(isRootFunktiokutsu) {
                    kaarivaFunktiokutsu.lapsi.funktioargumentit[childFunktiokutsuIndex] = kaarittavaFunktiokutsu;
                    $scope.funktioasetukset.parentFunktiokutsu.funktioargumentit[$scope.funktioasetukset.selectedFunktioIndex] = kaarivaFunktiokutsu;
                } else {
                    kaarivaFunktiokutsu.lapsi.funktioargumentit[childFunktiokutsuIndex] = kaarittavaFunktiokutsu;
                    $scope.funktioasetukset.parentFunktiokutsu.lapsi.funktioargumentit[$scope.funktioasetukset.selectedFunktioIndex] = kaarivaFunktiokutsu;
                }

                LaskentakaavaModalService.resetModalSelection();
            };

            $scope.selectedKaarivaFunktionimiChanged = function (selectedKaarivaFunktionimi) {
                var hasNimettyFunktioargumentti = FunktiokuvausService.hasNimettyFunktioargumenttiByFunktioNimi(selectedKaarivaFunktionimi);
                var isPainotettuKeskiarvo = FunktiokuvausService.isPainotettukeskiarvoByFunktioNimi(selectedKaarivaFunktionimi);
                $scope.showFunktioargumenttiSelection = isPainotettuKeskiarvo || (hasNimettyFunktioargumentti && FunktiokuvausService.hasMoreThanOneFunktioargumentti(selectedKaarivaFunktionimi));
                if($scope.showFunktioargumenttiSelection) {
                    FunktiokutsuKaareService.setKaareFunktiokutsuType(selectedKaarivaFunktionimi);
                }
            };

            $scope.kopioiFunktiokutsu = function () {
                $scope.toggleAll();
                $scope.setClipboard($scope.funktioSelection);
            };

            $scope.siirraFunktiokutsu = function () {
                $scope.toggleAll();
                $scope.setClipboard($scope.funktioSelection);
            };

            $scope.isYoFunktiokutsu = function (funktio, valintaperuste) {
                var funktionimi = funktio.lapsi.funktionimi;
                return funktionimi === "HAEOSAKOEARVOSANA" || funktionimi === "HAEYOARVOSANA";
            };

            $scope.resetModalSelection = function () {
                //choose modal for funktiokutsuasetukset & set flag for showing funktioargumenttiindexselection to false
                LaskentakaavaModalService.resetModalSelection();
                $scope.showFunktioargumenttiSelection = false;
            };

        }])

            
    .controller('laskentakaavaviiteAsetuksetController', ['$scope', 'FunktioService', function ($scope, FunktioService) {
        "use strict";

        $scope.$on('showLaskentakaavaviiteAsetukset', function () {
            $scope.show();
        });

        $scope.getFunktioargumenttiSlotTyyppi = function (parent, funktioargumenttiSlotIndex) {
            return FunktioService.isLukuarvoFunktioSlot(parent, funktioargumenttiSlotIndex) === true ? "LUKUARVOFUNKTIO" : "TOTUUSARVOFUNKTIO";
        };


    }])

    .controller('funktioMenuController', ['$scope', function ($scope) {
        "use strict";

        $scope.$on('hideFunktioMenu', function () {
            $scope.showNewFunktioList.visible = false;
        });
    }])

    .controller('funktiokutsunTallentaminenLaskentakaavanaController', ['$scope', function ($scope) {
        "use strict";
        $scope.$on('showTallennaFunktiokutsuLaskentakaavanaModal', function () {
            $scope.show();
        });
    }])

    .controller('laskentakaavaAsetuksetController', ['$scope', function ($scope) {
        $scope.$on('editKaavaMetadata', function () {
            $scope.show();
        });
    }]);