'use strict';

angular.module('LaskentakaavaEditor').factory('LaskentakaavaLista', function (Laskentakaava, ParentValintaryhmas, Hakukohde, Valintaryhma) {
    var valintaryhmaList = [];
    var hakukohde = [];
    var valintaryhma = null;

    var findWithValintaryhma = function (valintaryhmaId) {
        var list = [];
        ParentValintaryhmas.get({parentOid: valintaryhmaId}, function (data) {
            for (var i in data) {
                var valintaryhma = data[i];
                valintaryhma['laskentakaavat'] = Laskentakaava.list({valintaryhma: valintaryhma.oid});
            }

            var paataso = findRootLevelLaskentakaavas();
            list.push.apply(list, data);
            list.push(paataso);
        });
        return list;
    }

    var findWithHakukohde = function (hakukohdeOid) {
        var list = [];

        Hakukohde.get({oid: hakukohdeOid}, function (hakukohdeData) {
            hakukohdeData['laskentakaavat'] = Laskentakaava.list({hakukohde: hakukohdeOid});
            hakukohde[0] = hakukohdeData;

            if (hakukohdeData.valintaryhma_id) {
                Valintaryhma.get({oid: hakukohdeData.valintaryhma_id}, function (valintaryhmaData) {

                    ParentValintaryhmas.get({parentOid: valintaryhmaData.oid}, function (data) {
                        for (var i in data) {
                            var valintaryhma = data[i];
                            valintaryhma['laskentakaavat'] = Laskentakaava.list({valintaryhma: valintaryhma.oid});
                        }

                        var paataso = findRootLevelLaskentakaavas( );
                        list.push.apply(list, data);
                        list.push(paataso);
                    });

                });
            }

        });

        return list;
    }

    var findRootLevelLaskentakaavas = function () {
        var paataso = {
            nimi: "Yleiset kaavat",
            laskentakaavat: []
        };
        Laskentakaava.list({}, function (data) {
            paataso.laskentakaavat = data;
        });

        return paataso;
    }

    return {
        valintaryhmaList: function () {
            return valintaryhmaList;
        },
        hakukohdeList: function () {
            return hakukohde;
        },
        refresh: function (valintaryhmaId, hakukohdeOid) {
            hakukohde = [];
            valintaryhma = null;
            if (valintaryhmaId) {
                valintaryhmaList[0] = findWithValintaryhma(valintaryhmaId);
            } else if (hakukohdeOid) {
                valintaryhmaList[0] = findWithHakukohde(hakukohdeOid);
            } else {
                valintaryhmaList[0] = findRootLevelLaskentakaavas();
            }
        }
    }
});

function LaskentakaavaListController($scope, $location, $routeParams, Laskentakaava, LaskentakaavaLista, FunktioService) {
	$scope.funktioService = FunktioService;
	$scope.funktioService.refresh();
	$scope.valintaryhmaOid = $routeParams.valintaryhmaOid;
    $scope.linkprefix = '';
    var params = {};
    var saveParams = {};



    if ($routeParams.valintaryhmaOid) {
        LaskentakaavaLista.refresh($routeParams.valintaryhmaOid, null, true);
        saveParams.valintaryhmaOid = $routeParams.valintaryhmaOid;
        params.valintaryhma = $routeParams.valintaryhmaOid;
        $scope.valintaryhmaOid = $routeParams.valintaryhmaOid;
        $scope.linkprefix = '/valintaryhma/' + $scope.valintaryhmaOid;
        $scope.valintaryhmat = LaskentakaavaLista;
    }


    $scope.laskentakaavat = Laskentakaava.list(params);
    $scope.showForm = false;

    $scope.createKaava = function () {
		$location.path("/valintaryhma/" + $routeParams.valintaryhmaOid + "/laskentakaavalista/laskentakaava")
    }

    $scope.editKaava = function (kaava) {
        $scope.showForm = true;
        $scope.kaava = kaava;
        $scope.originalKaava = angular.copy(kaava);
    }


    $scope.cancel = function() {
        $location.path("/valintaryhma/" + $routeParams.valintaryhmaOid);
    }
}

