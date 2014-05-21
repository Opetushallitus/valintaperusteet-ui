angular.module('LaskentakaavaEditor')

    .controller('funktiokutsuAsetuksetController', ['$scope', '$routeParams', '$location', '$timeout', 'Laskentakaava', 'FunktioNimiService', 'FunktioFactory', 'KaavaValidationService', 'GuidGenerator', function ($scope, $routeParams, $location, $timeout, Laskentakaava, FunktioNimiService, FunktioFactory, KaavaValidationService, GuidGenerator) {
        $scope.funktioFactory = FunktioFactory;

        $scope.$on('showFunktiokutsuAsetukset', function () {
            $scope.show();
        });

        $scope.guidGenerator = GuidGenerator;

        $scope.generateSyoteId = function(valintaperuste) {
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

    }])

    .controller('laskentakaavaviiteAsetuksetController', ['$scope', 'FunktioService', function ($scope, FunktioService) {
        $scope.$on('showLaskentakaavaviiteAsetukset', function () {
            $scope.show();
        });

        $scope.getFunktioargumenttiSlotTyyppi = function(parent, funktioargumenttiSlotIndex) {
            return FunktioService.isLukuarvoFunktioSlot(parent, funktioargumenttiSlotIndex) === true ? "LUKUARVOFUNKTIO" : "TOTUUSARVOFUNKTIO";
        };


    }])

    .controller('funktioMenuController', ['$scope', function ($scope) {
        $scope.$on('hideFunktioMenu', function () {
            $scope.showNewFunktioList.visible = false;
        });
    }])

    .controller('funktiokutsunTallentaminenLaskentakaavanaController', ['$scope', function ($scope) {
        $scope.$on('showTallennaFunktiokutsuLaskentakaavanaModal', function () {
            $scope.show();
        });
    }]);