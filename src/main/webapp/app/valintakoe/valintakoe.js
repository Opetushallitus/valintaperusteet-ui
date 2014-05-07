app.factory('ValintakoeModel', function($q, Valintakoe, ValinnanvaiheValintakoe, Laskentakaava, LaskentakaavaModel) {

	var model = new function() {
		this.valintakoe = {};
		this.laskentakaavat = [];
        this.laskentakaavaModel = {};

		this.refresh = function(oid, valintaryhmaOid, hakukohdeOid) {
			if(!oid) {
				model.valintakoe = {};
				model.valintakoe.laskentakaavaId = "";
			} else {
				Valintakoe.get({valintakoeOid: oid}, function(result) {
					
					model.valintakoe = result;
					if(result.laskentakaavaId == null) {
						model.valintakoe.laskentakaavaId = "";
					}
				});
			}

			Laskentakaava.list({},function(result) {
				model.laskentakaavat = result;
			});

            LaskentakaavaModel.refresh(valintaryhmaOid, hakukohdeOid);
            model.laskentakaavaModel = LaskentakaavaModel;

		}

		this.refreshIfNeeded = function(oid, valintaryhmaOid, hakukohdeOid) {
			if(model.valintakoe.oid !== oid) {
				model.refresh(oid, valintaryhmaOid, hakukohdeOid);
			}
		}

		this.persistValintakoe = function(parentValintakoeValinnanvaiheOid, valintakokeet) {
			var deferred = $q.defer();
			if(model.valintakoe.oid) {
				model.valintakoe.laskentakaavaId = getlaskentakaavaId();
				Valintakoe.update({valintakoeOid: model.valintakoe.oid}, model.valintakoe, function(result) {
					deferred.resolve();
				});	

				
			} else {
				
				var laskentakaavaId = getlaskentakaavaId();
				var valintakoe = {
					tunniste: model.valintakoe.tunniste,
					nimi: model.valintakoe.nimi,
					kuvaus: model.valintakoe.kuvaus,
					laskentakaavaId: laskentakaavaId,
					aktiivinen: true
				}

				ValinnanvaiheValintakoe.insert({valinnanvaiheOid: parentValintakoeValinnanvaiheOid},valintakoe, function(result) {
					var index;
					for(index in valintakokeet) {
						if(result.oid === valintakokeet[index].oid){
							valintakokeet[index] = result;
						}
					}
					deferred.resolve();
				});
			}
			return deferred.promise;
		}

		this.getParentGroupType = function(path) {
			
			var type;
			var pathArray = path.split("/");
			if(pathArray[1] === "valintaryhma") {
				type = "valintaryhma";
			} else {
				type = "hakukohde";
			}

			return type;
		}

		function getlaskentakaavaId() {
			var laskentakaavaId;
			if(!model.valintakoe.laskentakaavaId || model.valintakoe.laskentakaavaId === "") {
				laskentakaavaId = null;
			} else {
				laskentakaavaId = model.valintakoe.laskentakaavaId;
			}
			return laskentakaavaId;
		}
		
	}	

	return model;

});

function ValintaryhmaValintakoeController($scope, $location, $routeParams, ValintakoeModel, ValintaryhmaValintakoeValinnanvaiheModel, HakukohdeValintakoeValinnanvaiheModel) {
	$scope.valintaryhmaOid = $routeParams.id;
	$scope.valintakoeValinnanvaiheOid = $routeParams.valintakoevalinnanvaiheOid;
	$scope.valintakoeOid = $routeParams.valintakoeOid;
	$scope.model = ValintakoeModel;
	$scope.model.refreshIfNeeded($scope.valintakoeOid, $scope.valintaryhmaOid, undefined);

	$scope.submit = function() {
		var promise = $scope.model.persistValintakoe($scope.valintakoeValinnanvaiheOid, ValintaryhmaValintakoeValinnanvaiheModel.valintakokeet);
		promise.then(function(){
			$location.path("/" + $scope.model.getParentGroupType($location.$$path) + "/" + $scope.valintaryhmaOid + "/valintakoevalinnanvaihe/" + $scope.valintakoeValinnanvaiheOid);
		});
		
	}

	$scope.cancel = function () {
		$location.path("/" + $scope.model.getParentGroupType($location.$$path) + "/" + $scope.valintaryhmaOid + "/valintakoevalinnanvaihe/" + $scope.valintakoeValinnanvaiheOid );
	}
}

function HakukohdeValintakoeController($scope, $location, $routeParams, ValintakoeModel, ValintaryhmaValintakoeValinnanvaiheModel, HakukohdeValintakoeValinnanvaiheModel) {
	$scope.hakukohdeOid = $routeParams.hakukohdeOid;
	$scope.valintakoeValinnanvaiheOid = $routeParams.valintakoevalinnanvaiheOid;
	$scope.valintakoeOid = $routeParams.id;
	$scope.model = ValintakoeModel;
	$scope.model.refreshIfNeeded($scope.valintakoeOid, undefined, $scope.hakukohdeOid);

	$scope.submit = function() {
		var promise = $scope.model.persistValintakoe($scope.valintakoeValinnanvaiheOid, HakukohdeValintakoeValinnanvaiheModel.valintakokeet);
		promise.then(function() {
			$location.path("/" + $scope.model.getParentGroupType($location.$$path) + "/" + $scope.hakukohdeOid + "/valintakoevalinnanvaihe/" + $scope.valintakoeValinnanvaiheOid);
		});
		
	}

	$scope.cancel = function () {
		$location.path("/" + $scope.model.getParentGroupType($location.$$path) + "/" + $scope.hakukohdeOid + "/valintakoevalinnanvaihe/" + $scope.valintakoeValinnanvaiheOid );
	}
}