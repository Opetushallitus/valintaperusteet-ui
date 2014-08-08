app.factory('ValintaryhmaModel', function ($q, _, Valintaryhma, Hakijaryhma, HakijaryhmaJarjesta, KoodistoHakukohdekoodi,
                                           KoodistoValintakoekoodi, KoodistoHaunKohdejoukko, Laskentakaava, Treemodel,
                                           ValintaryhmaValintakoekoodi, Valinnanvaihe, ValintaryhmaValinnanvaihe,
                                           ValinnanvaiheJarjesta, ValintaryhmaHakukohdekoodi, ValintaryhmaHakijaryhma,
                                           OrganizationByOid, $modal) {
    "use strict";


	var model = new function () {
		this.loaded = $q.defer();
		this.valintaryhma = {};
		this.valinnanvaiheet = [];
		this.hakukohdekoodit = [];
		this.valintakoekoodit = [];
        this.kohdejoukot = [];

		this.refresh = function (oid) {

			if (!oid) {
				model.valintaryhma = {};
				model.valinnanvaiheet = [];
			} else {

				Valintaryhma.get({oid: oid}, function (result) {
					model.valintaryhma = result;

					//if there are empty arrays present that are attached to view, the view won't update when arrays are modified
					if (model.valintaryhma.hakukohdekoodit !== undefined && model.valintaryhma.hakukohdekoodit.length === 0) {
						model.valintaryhma.hakukohdekoodit = undefined;
					}
					if (model.valintaryhma.valintakoekoodit !== undefined && model.valintaryhma.valintakoekoodit.length === 0) {
						model.valintaryhma.valintakoekoodit = undefined;
					}
					model.valintaryhma.organisaatiot.forEach(function (org, index) {
						OrganizationByOid.get(org, function (result) {
							model.valintaryhma.organisaatiot[index] = result;
						});
					});

					model.loaded.resolve();
				}, function () {
                    model.loaded.reject();
				});

				ValintaryhmaValinnanvaihe.get({oid: oid}, function (result) {
					model.valinnanvaiheet = result;
				});

                ValintaryhmaHakijaryhma.get({oid: oid}, function (result) {
                    model.hakijaryhmat = result;
                    model.hakijaryhmat.forEach(function (hr) {
                        Laskentakaava.get({oid: hr.laskentakaavaId}, function (result) {
                            hr.laskentakaava_nimi = result.nimi;
                        });
                    });
                });

                KoodistoHaunKohdejoukko.get(function (result) {
                    model.kohdejoukot = result;
                });
            }
		};

		this.getHakukohdekoodit = function () {
			var deferred = $q.defer();
			KoodistoHakukohdekoodi.get(function (result) {
				model.hakukohdekoodit = result;
				deferred.resolve();
			});
			return deferred.promise;
		};

		this.getValintakoeKoodit = function () {
			var deferred = $q.defer();
			KoodistoValintakoekoodi.get(function (result) {
				model.valintakoekoodit = result;
				deferred.resolve();
			});
			return deferred.promise;
		};


		this.refreshIfNeeded = function (oid) {
			if (oid !== model.valintaryhma.oid) {
				this.refresh(oid);
			}
		};

		this.persistValintaryhma = function (oid) {
			Valintaryhma.post(model.valintaryhma, function (result) {
				model.valintaryhma = result;
				Treemodel.refresh();
			});

			if (model.valinnanvaiheet.length > 0) {
				ValinnanvaiheJarjesta.post(getValinnanvaiheOids(), function (result) {
				});
				for (var i = 0; i < model.valinnanvaiheet.length; ++i) {
					Valinnanvaihe.post(model.valinnanvaiheet[i], function () {
					});
				}
			}


		};

		this.removeValinnanvaihe = function (vaihe) {
            $modal.open({
                backdrop: 'static',
                templateUrl: 'poistavalinnanvaihe.html',
                controller: function($scope, $window, $modalInstance) {
                    $scope.ok = function() {
                        Valinnanvaihe.delete({oid: vaihe.oid}, function () {
                            for (var i in model.valinnanvaiheet) {
                                if (vaihe.oid === model.valinnanvaiheet[i].oid) {
                                    model.valinnanvaiheet.splice(i, 1);
                                }
                            }
                        });
                        $modalInstance.close();
                    };
                    $scope.cancel = function() {
                        $modalInstance.dismiss('cancel');
                    };
                }
            }).result.then(function() {
                }, function() {
                });

		};

		function getValinnanvaiheOids() {
			var oids = [];
			for (var i = 0; i < model.valinnanvaiheet.length; ++i) {
				oids.push(model.valinnanvaiheet[i].oid);
			}
			return oids;
		}

		this.getValinnanvaiheType = function (valinnanvaihe) {
			var type;
			if (valinnanvaihe.valinnanVaiheTyyppi === "TAVALLINEN") {
				type = "valinnanvaihe";
			} else {
				type = "valintakoevalinnanvaihe";
			}
			return type;
		};

		this.addHakukohdeUri = function (hakukohdekoodiUri) {
			model.hakukohdekoodit.some(function (koodi) {
				if (koodi.koodiUri === hakukohdekoodiUri) {
					var hakukohdekoodi = {"uri": koodi.koodiUri,
						"arvo": koodi.koodiArvo};

					koodi.metadata.forEach(function (metadata) {
						if (metadata.kieli === "FI") {
							hakukohdekoodi.nimiFi = metadata.nimi;
						} else if (metadata.kieli === "SV") {
							hakukohdekoodi.nimiSv = metadata.nimi;
						} else if (metadata.kieli === "EN") {
							hakukohdekoodi.nimiEn = metadata.nimi;
						}
					});

					//persist valintaryhma with added hakukohdekoodiuri
					ValintaryhmaHakukohdekoodi.insert({valintaryhmaOid: model.valintaryhma.oid}, hakukohdekoodi, function (result) {
						if (!model.valintaryhma.hakukohdekoodit) {
							model.valintaryhma.hakukohdekoodit = [];
						}
						model.valintaryhma.hakukohdekoodit.push(result);

					}, function (error) {
						alert(error.data);
					});
					return true;
				}
			});
		};

		this.addValintakoeUri = function (valintakoeKoodiUri) {
			model.valintakoekoodit.some(function (koodi) {
				if (koodi.koodiUri === valintakoeKoodiUri) {
					var valintakoekoodi = {"uri": koodi.koodiUri,
						"arvo": koodi.koodiArvo};

					koodi.metadata.forEach(function (metadata) {
						if (metadata.kieli === "FI") {
							valintakoekoodi.nimiFi = metadata.nimi;
						} else if (metadata.kieli === "SV") {
							valintakoekoodi.nimiSv = metadata.nimi;
						} else if (metadata.kieli === "EN") {
							valintakoekoodi.nimiEn = metadata.nimi;
						}
					});

					//persist valintaryhma with added valintakoekoodiuri
					ValintaryhmaValintakoekoodi.insert({valintaryhmaOid: model.valintaryhma.oid}, valintakoekoodi, function (result) {
						if (!model.valintaryhma.valintakoekoodit) {
							model.valintaryhma.valintakoekoodit = [];
						}
						model.valintaryhma.valintakoekoodit.push(result);

					}, function (error) {
						alert(error.data);
					});
					return true;
				}
			});
		};

		this.removeHakukohdeKoodi = function (hakukohdekoodi) {
			var hakukohdekoodit, index;

			hakukohdekoodit = model.valintaryhma.hakukohdekoodit;
			index = hakukohdekoodit.indexOf(hakukohdekoodi);

			if (index !== -1) {
				hakukohdekoodit.splice(index, 1);
			}

			ValintaryhmaHakukohdekoodi.post({valintaryhmaOid: model.valintaryhma.oid}, hakukohdekoodit, function (result) {
				if (model.valintaryhma.hakukohdekoodit.length === 0) {
					model.valintaryhma.hakukohdekoodit = undefined;
				}
			});
		};

		this.removeValintakoeKoodi = function (valintakoekoodi) {
			var valintakoekoodit, index;

			valintakoekoodit = model.valintaryhma.valintakoekoodit;
			index = valintakoekoodit.indexOf(valintakoekoodi);

			if (index !== -1) {
				valintakoekoodit.splice(index, 1);
			}

			ValintaryhmaValintakoekoodi.post({valintaryhmaOid: model.valintaryhma.oid}, valintakoekoodit, function (result) {
				if (model.valintaryhma.valintakoekoodit.length === 0) {
					model.valintaryhma.valintakoekoodit = undefined;
				}
			});
		};

	}

	return model;
});

angular.module('valintaperusteet').
    controller('ValintaryhmaController', ['$scope', '$location', '$routeParams', 'ValintaryhmaModel',
        function ($scope, $location, $routeParams, ValintaryhmaModel) {
    "use strict";

	$scope.valintaryhmaOid = $routeParams.id;
	$scope.model = ValintaryhmaModel;
	$scope.model.refreshIfNeeded($scope.valintaryhmaOid);

	$scope.submit = function () {
		$scope.model.persistValintaryhma($scope.valintaryhmaOid);
	};

	$scope.cancel = function () {
		$location.path("/");
	};

	$scope.lisaaValinnanVaihe = function () {
		$location.path("/valintaryhma/" + $scope.valintaryhmaOid + "/valinnanvaihe/");
	};

	$scope.lisaaValintakoeValinnanVaihe = function () {
		$location.path("/valintaryhma/" + $scope.valintaryhmaOid + "/valintakoevalinnanvaihe/");
	};

    $scope.lisaaHakijaryhma = function() {
        $location.path("/valintaryhma/" + $scope.valintaryhmaOid + "/hakijaryhma/");
    };

	$scope.toValintaryhmaForm = function () {
		$location.path("/valintaryhma/" + $scope.valintaryhmaOid);
	};

	$scope.organisaatioSelector = function (data) {

		if (!$scope.model.valintaryhma.organisaatiot) {
			$scope.model.valintaryhma.organisaatiot = [];
		}
		var contains = false;
		$scope.model.valintaryhma.organisaatiot.forEach(function (org) {
			if (data.oid === org.oid) {
				contains = true;
			}
		});

		if (!contains) {
			$scope.model.valintaryhma.organisaatiot.push(data);
		}
	};
}]);



