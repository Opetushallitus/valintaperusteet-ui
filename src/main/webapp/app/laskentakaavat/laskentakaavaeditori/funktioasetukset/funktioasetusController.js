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

.controller('alikaavaLaskentakaavaviiteAsetuksetController', ['$scope', function ($scope) {
    $scope.$on('showAlikaavaLaskentakaavaviiteAsetukset', function () {
        $scope.show();
    });
}])

.controller('alikaavaFunktiokutsuAsetuksetController', ['$scope', function ($scope) {
    $scope.$on('showAlikaavaFunktiokutsuAsetukset', function () {
        $scope.show();
    });
}]);
