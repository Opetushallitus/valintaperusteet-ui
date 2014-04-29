angular.module('LaskentakaavaEditor')

.controller('funktiokutsuAsetuksetController', ['$scope', 'FunktioNimiService', function ($scope, FunktioNimiService) {
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

        $scope.settings = {toggle: false}

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

.controller('funktiokutsunTallentaminenLaskentakaavanaController', ['$scope', function($scope) {
    $scope.$on('showTallennaFunktiokutsuLaskentakaavanaModal', function() {
        $scope.show();
    });
}]);