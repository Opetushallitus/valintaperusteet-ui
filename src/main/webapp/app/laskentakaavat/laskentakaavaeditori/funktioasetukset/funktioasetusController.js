angular.module('valintaperusteet')

    .controller('funktiokutsuAsetuksetController', ['$scope', '$q', '$routeParams', '$location', '$timeout', 'Laskentakaava',
        'FunktioNimiService', 'FunktioFactory', 'KaavaValidationService', 'GuidGenerator', 'Hakemusavaimet', 'HakemusavaimetLomake', 'ValintaryhmaModel', 'ParentValintaryhmas',
        function ($scope, $q, $routeParams, $location, $timeout, Laskentakaava, FunktioNimiService, FunktioFactory, KaavaValidationService, GuidGenerator, Hakemusavaimet, HakemusavaimetLomake, ValintaryhmaModel, ParentValintaryhmas) {

            $scope.funktioFactory = FunktioFactory;
            $scope.valintaryhmaModel = ValintaryhmaModel;

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
                $scope.valintaryhmaPromise.then(function () {
                    ParentValintaryhmas.get({parentOid: "14083437371152263513669352542794"}, function(result) {
                        console.log('got it', result);
                    });
//                        HakemusavaimetLomake.get({hakuOid: ""}, function (result) {
//                            def1.resolve();
//                            $scope.bigdata = result;
//                        }, function (error) {
//                            def1.reject('Avaimien haku epäonnistui: ', error);
//                        });


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