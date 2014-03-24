

function ValintakoekoodiController($scope) {
	$scope.toggleValintaryhmaValintakokeet = false;

	$scope.toggleValintakokeet = function () {
		$scope.toggleValintaryhmaValintakokeet = !$scope.toggleValintaryhmaValintakokeet;
	}

	$scope.showValintakoeKoodit = function () {
		var promise = $scope.model.getValintakoeKoodit();
		$scope.toggleValintaryhmaValintakokeet = true;
		promise.finally(function () {
			$scope.show();
		});
	}

	$scope.addValintakoeUri = function (newValintakoeUri) {
		$scope.model.addValintakoeUri(newValintakoeUri);
	}

	$scope.removeValintakoeKoodi = function (valintakoekoodi) {
		$scope.model.removeValintakoeKoodi(valintakoekoodi);
	}
}
