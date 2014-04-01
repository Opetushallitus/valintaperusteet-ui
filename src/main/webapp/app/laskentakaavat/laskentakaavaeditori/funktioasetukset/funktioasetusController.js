angular.module('LaskentakaavaEditor').controller('funktiokutsuAsetuksetController', ['$scope', function ($scope) {
	$scope.$on('showFunktiokutsuAsetukset', function () {
		$scope.show();
	});
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
