angular.module('LaskentakaavaEditor')

    .controller('funktiokutsuAsetuksetController', ['$scope', '$routeParams', 'FunktioNimiService', 'FunktioFactory',  function ($scope, $routeParams, FunktioNimiService, FunktioFactory) {
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
        }

        $scope.saveAsNewLaskentakaava = function (parent, funktiokutsu, newKaavaNimi, newKaavaKuvaus) {
            console.log('Nykyinen laskentakaavamodel', $scope.model.laskentakaavapuu);
            var kaava = $scope.funktioFactory.createEmptyLaskentakaava($scope.funktioSelection, $routeParams, newKaavaNimi, newKaavaKuvaus);
            console.log('tallennettava laskentakaava:', kaava);
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