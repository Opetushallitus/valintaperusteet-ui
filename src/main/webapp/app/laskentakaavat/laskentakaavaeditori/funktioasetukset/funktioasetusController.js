angular.module('valintaperusteet')

    .controller('funktiokutsuAsetuksetController', ['$scope', '$q', '$routeParams', '$location', '$timeout', 'Laskentakaava',
        'FunktioNimiService', 'FunktioFactory', 'KaavaValidation', 'GuidGenerator', 'HakemusavaimetLisakysymykset', 'HakemusavaimetLomake', 'ValintaryhmaModel', 'Treemodel', 'LaskentakaavaValintaryhma', '$cookieStore', '$window', 'UserModel',
        function ($scope, $q, $routeParams, $location, $timeout, Laskentakaava, FunktioNimiService, FunktioFactory, KaavaValidation, GuidGenerator, HakemusavaimetLisakysymykset, HakemusavaimetLomake, ValintaryhmaModel, Treemodel, LaskentakaavaValintaryhma, $cookieStore, $window, UserModel) {
            UserModel.refreshIfNeeded();
            $scope.toggle = false;
            $scope.funktioFactory = FunktioFactory;
            $scope.valintaryhmaModel = ValintaryhmaModel;
            $scope.treemodel = Treemodel;
            
            if ($routeParams.valintaryhmaOid !== undefined) {
                $scope.valintaryhmaModel.refreshIfNeeded($routeParams.valintaryhmaOid);
            }

            $scope.valintaryhmaPromise = $scope.valintaryhmaModel.loaded.promise;
            $scope.$on('showFunktiokutsuAsetukset', function () {
                $scope.show();
            });

            $scope.guidGenerator = GuidGenerator;

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

            $scope.toggle = false;

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
                            console.log("hakuoidia ei löydy");
                        }
                    });
                } else {
                    console.log("hakuoidia ei löydy");
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
                            console.log("hakulomakkeen avaimia ei löytynyt");
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
                                console.log("lisakysymyksiä ei löytynyt");
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
                                console.log("lisakysymyksiä ei löytynyt");
                            }
                        );
                    });



                }, function(reject) {
                    console.log('rejected');
                });
            };



            $scope.isYoFunktiokutsu = function (funktio, valintaperuste) {
                var funktionimi = funktio.lapsi.funktionimi;
                return funktionimi === "HAEOSAKOEARVOSANA" || funktionimi === "HAEYOARVOSANA";
            };

            $scope.resolveHaku();

            /*
             var def2 = $q.defer();
             promises.push(def2.promise);
             Hakemusavaimet.query({hakuoid: "1.2.246.562.29.173465377510"}, function(result) {
             def2.resolve();
             }, function(error) {
             def2.reject('Avaimien haku epäonnistui: ', error);
             });
             */

        }])

            
    .
    controller('laskentakaavaviiteAsetuksetController', ['$scope', 'FunktioService', function ($scope, FunktioService) {
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