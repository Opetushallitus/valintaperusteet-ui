angular.module('valintaperusteet')

    .controller('funktiokutsuAsetuksetController', ['$scope', '$log', '$q', '$routeParams', '$location', '$timeout', 'Laskentakaava',
        'FunktioNimiService', 'FunktioFactory', 'KaavaValidation', 'GuidGenerator', 'HakemusavaimetLisakysymykset', 'HakemusavaimetLomake',
        'ValintaryhmaModel', 'Treemodel', 'LaskentakaavaValintaryhma', '$cookieStore', '$window', 'UserModel', 'ErrorService', '_', 'FunktioService',
        'LaskentakaavaModalService', 'NimettyFunktioargumenttiKaareService',
        function ($scope, $log, $q, $routeParams, $location, $timeout, Laskentakaava,
                  FunktioNimiService, FunktioFactory, KaavaValidation, GuidGenerator, HakemusavaimetLisakysymykset, HakemusavaimetLomake,
                  ValintaryhmaModel, Treemodel, LaskentakaavaValintaryhma, $cookieStore, $window, UserModel, ErrorService, _, FunktioService,
                  LaskentakaavaModalService, NimettyFunktioargumenttiKaareService) {

            UserModel.refreshIfNeeded();
            if ($routeParams.valintaryhmaOid !== undefined) {
                $scope.valintaryhmaModel.refreshIfNeeded($routeParams.valintaryhmaOid);
            }


            $scope.valintaryhmaModel = ValintaryhmaModel;
            $scope.treemodel = Treemodel;
            $scope.guidGenerator = GuidGenerator;
            $scope.funktioService = FunktioService;
            $scope.laskentakaavaModalService = LaskentakaavaModalService;

            $scope.$watch('funktioasetukset.parentFunktiokutsu', function () {
                if(!_.isEmpty($scope.funktioasetukset.parentFunktiokutsu)) {
                    $scope.selectedFunktiokutsuIsLukuarvoFunktio = FunktioService.isLukuarvoFunktioSlot($scope.funktioasetukset.parentFunktiokutsu, $scope.funktioasetukset.selectedFunktioIndex);
                    $scope.selectedFunktiokutsunHasFunktioArgumentit = FunktioService.hasFunktioargumentit($scope.funktioasetukset.parentFunktiokutsu, $scope.funktioasetukset.selectedFunktioIndex);
                }
            });

            $scope.valintaryhmaPromise = $scope.valintaryhmaModel.loaded.promise;
            $scope.$on('showFunktiokutsuAsetukset', function () {
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


            $scope.getHakemusAvaimet = function (hakuoid) {


                $scope.valintaryhmaPromise.then(function (result) {
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
                                    if(phase.type == hakutoiveRivi) {
                                        _.forEach(hakutoivePostfixes, function(postfix) {
                                            result.push({type: hakutoiveRivi, id: phase.id+postfix});
                                        })
                                    }
                                    else if(phase.children) {
                                        var current = _.omit(phase, phase.children);
                                        if(tyypit.indexOf(phase.type) != -1) {
                                            result.push(current);
                                        }
                                        result = _.union(result, flattenRecursively(phase.children));
                                    } else {
                                        if(tyypit.indexOf(phase.type) != -1) {
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
                                avaimet.push(obj);
                            });


                            $scope.bigdata = avaimet;
                        }, function (error) {
                            $log.log("hakulomakkeen avaimia ei löytynyt", error);
                        }
                    );
                    
                    UserModel.organizationsDeferred.promise.then(function () {
                        HakemusavaimetLisakysymykset.get({hakuoid: hakuoid, orgId: UserModel.organizationOids[0]},function (haetutAvaimet) {
                                var avaimet = [];
                                _.forEach(haetutAvaimet, function(phase) {

                                    var obj = {};
                                    obj.key = phase._id;
                                    if(phase.messageText) {
                                        obj.value = phase._id + ' - ' + phase.messageText.translations.fi;
                                    } else {
                                        obj.value = phase._id;
                                    }
                                    avaimet.push(obj);

                                });
                                $scope.lisakysymysAvaimet = avaimet;
                            }, function (error) {
                                $log.log("lisakysymyksiä ei löytynyt", error);
                            }
                        );
                    }, function () {
                        HakemusavaimetLisakysymykset.get({hakuoid: hakuoid},function (haetutAvaimet) {
                                var avaimet = [];
                                _.forEach(haetutAvaimet, function(phase) {

                                    var obj = {};
                                    obj.key = phase._id;
                                    if(phase.messageText) {
                                        obj.value = phase._id + ' - ' + phase.messageText.translations.fi;
                                    } else {
                                        obj.value = phase._id;
                                    }
                                    avaimet.push(obj);

                                });
                                $scope.lisakysymysAvaimet = avaimet;
                            }, function (error) {
                                $log.error("lisakysymyksiä ei löytynyt", error);
                            }
                        );
                    });



                }, function(reject) {
                    $log.error('Valintaryhmän lataaminen epäonnistui', reject);
                });
            };

            $scope.kaariFunktiokutsu = function (kaarivaFunktiokutsuNimi) {
                if(FunktioService.hasNSizeFunktioargumenttiByFunktionimi(kaarivaFunktiokutsuNimi)) {
                    $scope.kaariFunktiokutsuNFunktioargumentiksi(kaarivaFunktiokutsuNimi);
                } else {
                    NimettyFunktioargumenttiKaareService.setKaareFunktiokutsuType(kaarivaFunktiokutsuNimi);
                    LaskentakaavaModalService.toggleModalSelection('kaariFunktiokutsuNimettyargumentti');
                }
            };

            //Käärivällä funktiokutsulla voi olla N määrä funktioargumentteja
            $scope.kaariFunktiokutsuNFunktioargumentiksi = function (kaarivaFunktiokutsuNimi) {
                var isRootFunktiokutsu = FunktioService.isRootFunktiokutsu($scope.funktioasetukset.parentFunktiokutsu);
                var kaarittavaFunktiokutsu = FunktioService.getCurrentFunktiokutsu($scope.funktioasetukset.parentFunktiokutsu, $scope.funktioasetukset.selectedFunktioIndex);
                var kaarivaFunktiokutsu  = FunktioFactory.createFunktioInstance($scope.funktioasetukset.parentFunktiokutsu, kaarivaFunktiokutsuNimi, FunktioService.isRootFunktiokutsu($scope.funktioasetukset.parentFunktiokutsu));
                kaarivaFunktiokutsu.open = true;

                if(isRootFunktiokutsu) {
                    kaarivaFunktiokutsu.funktioargumentit[0] = kaarittavaFunktiokutsu;
                    $scope.funktioasetukset.parentFunktiokutsu.funktioargumentit[$scope.funktioasetukset.selectedFunktioIndex] = kaarivaFunktiokutsu;
                } else {
                    kaarivaFunktiokutsu.lapsi.funktioargumentit[0] = kaarittavaFunktiokutsu;
                    $scope.funktioasetukset.parentFunktiokutsu.lapsi.funktioargumentit[$scope.funktioasetukset.selectedFunktioIndex] = kaarivaFunktiokutsu;
                }

                LaskentakaavaModalService.resetModalSelection();
            };

            $scope.kaariNimettyFunktioargumentti = function (kaarivaFunktioNimi) {

            };

            $scope.isYoFunktiokutsu = function (funktio, valintaperuste) {
                var funktionimi = funktio.lapsi.funktionimi;
                return funktionimi === "HAEOSAKOEARVOSANA" || funktionimi === "HAEYOARVOSANA";
            };

            $scope.resolveHaku();

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