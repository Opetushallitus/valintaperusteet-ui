angular.module('valintaperusteet')

    .controller('funktiokutsuAsetuksetController', ['$scope', '$q', '$routeParams', '$location', '$timeout', 'Laskentakaava',
        'FunktioNimiService', 'FunktioFactory', 'KaavaValidationService', 'GuidGenerator', 'Hakemusavaimet', 'HakemusavaimetLomake', 'ValintaryhmaModel', 'Treemodel',
        function ($scope, $q, $routeParams, $location, $timeout, Laskentakaava, FunktioNimiService, FunktioFactory, KaavaValidationService, GuidGenerator, Hakemusavaimet, HakemusavaimetLomake, ValintaryhmaModel, Treemodel) {

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
                KaavaValidationService.validateTree($scope.model.laskentakaavapuu.funktiokutsu, $scope.errors);
                if ($scope.errors.length === 0) {
                    closeModal();
                    Laskentakaava.insert({}, osakaava, function (savedKaava) {
                        $scope.funktiokutsuSavedAsLaskentakaava(FunktioFactory.getLaskentakaavaviiteFromLaskentakaava(savedKaava));
                    }, function (error) {

                    });
                }
            };

            $scope.toggle = false;


            $scope.getHakemusAvaimet = function () {


                $scope.valintaryhmaPromise.then(function (result) {
//                        HakemusavaimetLomake.get({hakuoid: $scope.treemodel.search.haku.oid}, function (result) {
                    HakemusavaimetLomake.get({hakuoid: "1.2.246.562.5.2013080813081926341927"}, function (result) {
                            //$scope.bigdata = result;
                            var tyypit = ["TextQuestion","DropdownSelect","Radio","DateQuestion","SocialSecurityNumber","PostalCode","GradeGridOptionQuestion"];
                            var avaimet = [];

                            var flattenRecursively = function(array) {
                                var result = [];
                                _.forEach(array, function(phase) {
                                    if(phase.children) {
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

                            var flatten = _.flatten(flattenRecursively(result.children));
                            _.forEach(flatten, function(phase) {

                                var obj = {};
//                                if(phase.expr && phase.expr.left) {
//                                    obj.key = phase.expr.left.value
//                                } else {
//                                    obj.key = phase.id;
//                                }
                                obj.key = phase.id;
                                if(phase.i18nText) {
                                    obj.value = phase.id + ' - ' + phase.i18nText.translations.fi;
                                } else {
                                    obj.value = phase.id;
                                }
                                console.log(obj.key);
                                avaimet.push(obj);
                            });


                            $scope.bigdata = avaimet;
                        }, function (error) {
                        });

                }, function(reject) {
                    console.log('rejected');
                });
            };
            
            $scope.getHakemusAvaimet();


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
    }]);