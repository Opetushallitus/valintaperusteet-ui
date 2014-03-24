app.factory('ValintaryhmaModel', function ($q, _, Valintaryhma, Hakijaryhma, HakijaryhmaJarjesta, KoodistoHakukohdekoodi, KoodistoValintakoekoodi, Laskentakaava, Treemodel, ValintaryhmaValintakoekoodi, Valinnanvaihe, ValintaryhmaValinnanvaihe, ValinnanvaiheJarjesta, ValintaryhmaHakukohdekoodi, ValintaryhmaHakijaryhma, OrganizationByOid) {

	var model = new function () {
		this.loaded = $q.defer();
		this.valintaryhma = {};
		this.valinnanvaiheet = [];
		this.hakukohdekoodit = [];
		this.valintakoekoodit = [];
		this.hakijaryhmat = [];

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
						"use strict";
						OrganizationByOid.get(org, function (result) {
							model.valintaryhma.organisaatiot[index] = result;
						});
					});

					model.loaded.resolve();
				}, function () {
					"use strict";
					loaded.reject();
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
			}
		};

		this.getHakukohdekoodit = function () {
			var deferred = $q.defer();
			KoodistoHakukohdekoodi.get(function (result) {
				model.hakukohdekoodit = result;
				deferred.resolve();
			});
			return deferred.promise;
		}

		this.getValintakoeKoodit = function () {
			var deferred = $q.defer();
			KoodistoValintakoekoodi.get(function (result) {
				model.valintakoekoodit = result;
				deferred.resolve();
			});
			return deferred.promise;
		}


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

			if (model.hakijaryhmat.length > 0) {
				HakijaryhmaJarjesta.post(getHakijaryhmaOids(), function (result) {
				});
			}


		};

		this.removeValinnanvaihe = function (vaihe) {
			Valinnanvaihe.delete({oid: vaihe.oid}, function () {
				for (i in model.valinnanvaiheet) {
					if (vaihe.oid === model.valinnanvaiheet[i].oid) {
						model.valinnanvaiheet.splice(i, 1);
					}
				}
			});
		};

		function getHakijaryhmaOids() {
			var oids = [];
			for (var i = 0; i < model.hakijaryhmat.length; ++i) {
				oids.push(model.hakijaryhmat[i].oid);
			}
			return oids;
		}

		function getValinnanvaiheOids() {
			var oids = [];
			for (var i = 0; i < model.valinnanvaiheet.length; ++i) {
				oids.push(model.valinnanvaiheet[i].oid);
			}
			return oids;
		};

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
				if (koodi.koodiUri == hakukohdekoodiUri) {
					var hakukohdekoodi = {"uri": koodi.koodiUri,
						"arvo": koodi.koodiArvo};

					koodi.metadata.forEach(function (metadata) {
						if (metadata.kieli == "FI") {
							hakukohdekoodi.nimiFi = metadata.nimi;
						} else if (metadata.kieli == "SV") {
							hakukohdekoodi.nimiSv = metadata.nimi;
						} else if (metadata.kieli == "EN") {
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
				if (koodi.koodiUri == valintakoeKoodiUri) {
					var valintakoekoodi = {"uri": koodi.koodiUri,
						"arvo": koodi.koodiArvo};

					koodi.metadata.forEach(function (metadata) {
						if (metadata.kieli == "FI") {
							valintakoekoodi.nimiFi = metadata.nimi;
						} else if (metadata.kieli == "SV") {
							valintakoekoodi.nimiSv = metadata.nimi;
						} else if (metadata.kieli == "EN") {
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
		}

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
		}

		this.removeHakijaryhma = function (hakijaryhmaOid) {
			Hakijaryhma.delete({oid: hakijaryhmaOid}, function () {
				for (i in model.hakijaryhmat) {
					if (hakijaryhmaOid === model.hakijaryhmat[i].oid) {
						model.hakijaryhmat.splice(i, 1);
					}
				}
			});
		}

	}

	return model;
});

function ValintaryhmaController($scope, $location, $routeParams, ValintaryhmaModel) {

	$scope.valintaryhmaOid = $routeParams.id;
	$scope.model = ValintaryhmaModel;
	$scope.model.refreshIfNeeded($scope.valintaryhmaOid);


	$scope.submit = function () {
		$scope.model.persistValintaryhma($scope.valintaryhmaOid);
	}

	$scope.cancel = function () {
		$location.path("/");
	}

	$scope.lisaaValinnanVaihe = function () {
		$location.path("/valintaryhma/" + $scope.valintaryhmaOid + "/valinnanvaihe/");
	}

	$scope.lisaaValintakoeValinnanVaihe = function () {
		$location.path("/valintaryhma/" + $scope.valintaryhmaOid + "/valintakoevalinnanvaihe/");
	}

	$scope.toValintaryhmaForm = function () {
		$location.path("/valintaryhma/" + $scope.valintaryhmaOid);
	}


	$scope.lisaaHakijaryhma = function () {
		$location.path("/valintaryhma/" + $routeParams.id + "/hakijaryhma/");
	}

	$scope.removeHakijaryhma = function (hakijaryhmaOid) {
		$scope.model.removeHakijaryhma(hakijaryhmaOid);
	}

	$scope.organisaatioSelector = function (data) {
		"use strict";
		if (!$scope.model.valintaryhma.organisaatiot) {
			$scope.model.valintaryhma.organisaatiot = [];
		}
		var contains = false
		$scope.model.valintaryhma.organisaatiot.forEach(function (org) {
			if (data.oid === org.oid) {
				contains = true;
			}
		});

		if (!contains) {
			$scope.model.valintaryhma.organisaatiot.push(data);
		}
	}
}

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




function HakukohdekoodiController($scope) {
	$scope.toggleValintaryhmaHakukohdekoodit = false;

	$scope.toggleHakukohdekoodit = function () {
		$scope.toggleValintaryhmaHakukohdekoodit = !$scope.toggleValintaryhmaHakukohdekoodit;
	}

	$scope.showHakukohdeKoodit = function () {
		var promise = $scope.model.getHakukohdekoodit();
		$scope.toggleValintaryhmaHakukohdekoodit = true;
		promise.finally(function () {
			$scope.show();
		});
	}

	$scope.setHakukohdeUri = function (newUri) {
		$scope.newHakukohdeUri = newUri;
	}

	$scope.addHakukohdeUri = function (newHakukohdeUri) {
		$scope.model.addHakukohdeUri(newHakukohdeUri);
	}

	$scope.removeHakukohdeKoodi = function (hakukohdekoodi) {
		$scope.model.removeHakukohdeKoodi(hakukohdekoodi);
	}

}

