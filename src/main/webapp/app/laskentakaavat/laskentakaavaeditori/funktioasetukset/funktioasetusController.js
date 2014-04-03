angular.module('LaskentakaavaEditor').controller('funktiokutsuAsetuksetController', ['$scope', 'FunktioNimiService', function ($scope, FunktioNimiService) {
	$scope.$on('showFunktiokutsuAsetukset', function () {
		$scope.show();
	});

    $scope.getFunktiokutsuName = function(funktiokutsu) {
        if(funktiokutsu.lapsi) {
            return FunktioNimiService.getName(funktiokutsu.lapsi.funktionimi);
        } else {
            return FunktioNimiService.getName(funktiokutsu.funktionimi);
        }
    }
}]);


angular.module('LaskentakaavaEditor').controller('laskentakaavaviiteAsetuksetController', ['$scope', function ($scope) {
	$scope.$on('showLaskentakaavaviiteAsetukset', function (event) {
		$scope.show();
	});
}]);

angular.module('LaskentakaavaEditor').controller('funktioMenuController', ['$scope', function ($scope) {
	$scope.$on('hideFunktioMenu', function() {
		$scope.showNewFunktioList.visible = false;
	});
}]);
