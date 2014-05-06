angular.module('LaskentakaavaEditor')

    .controller('funktiokutsuAsetuksetController', ['$scope', '$routeParams', '$location', '$timeout', 'Laskentakaava', 'FunktioNimiService', 'FunktioFactory', 'KaavaValidationService', function ($scope, $routeParams, $location, $timeout, Laskentakaava, FunktioNimiService, FunktioFactory, KaavaValidationService) {
        $scope.funktioFactory = FunktioFactory;

        $scope.$on('showFunktiokutsuAsetukset', function () {
            $scope.show();
        });

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
            //KaavaValidationService.validateTree(osakaava.funktiokutsu, errors);
            if ($scope.errors.length === 0) {
                Laskentakaava.insert({}, osakaava, function (savedKaava) {
                    closeModal();
                    funktiokutsu = FunktioFactory.getLaskentakaavaviiteFromLaskentakaava(savedKaava);
                }, function (error) {});
            }
        };

        $scope.toggle = false;

    }])

    .controller('laskentakaavaviiteAsetuksetController', ['$scope', function ($scope) {
        $scope.$on('showLaskentakaavaviiteAsetukset', function () {
            $scope.show();
        });
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