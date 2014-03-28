angular.module('LaskentakaavaEditor').controller('funktiokutsuAsetuksetController', ['$scope', function ($scope) {
	$scope.$on('showFunktiokutsuAsetukset', function () {
		$scope.show();
	});
}]);


angular.module('LaskentakaavaEditor').controller('laskentakaavaviiteAsetuksetController', ['$scope', function ($scope) {
	$scope.$on('showLaskentakaavaviiteAsetukset', function () {
		$scope.show();
	});
}]);
