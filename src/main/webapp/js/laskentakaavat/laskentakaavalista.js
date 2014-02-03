'use strict';

laskentakaavaEditor.factory('LaskentakaavaLista', function (Laskentakaava, ParentValintaryhmas, Hakukohde, Valintaryhma) {
    var valintaryhmaList = [];
    var hakukohde = [];
    var valintaryhma = null;

    var findWithValintaryhma = function (valintaryhmaId, myosLuonnos) {
        var list = [];
        ParentValintaryhmas.get({parentOid: valintaryhmaId}, function (data) {
            for (var i in data) {
                var valintaryhma = data[i];
                valintaryhma['laskentakaavat'] = Laskentakaava.list({valintaryhma: valintaryhma.oid, myosLuonnos: myosLuonnos});
            }

            var paataso = findRootLevelLaskentakaavas(myosLuonnos);
            list.push.apply(list, data);
            list.push(paataso);
        });
        return list;
    }

    var findWithHakukohde = function (hakukohdeOid, myosLuonnos) {
        var list = [];

        Hakukohde.get({oid: hakukohdeOid}, function (hakukohdeData) {
            hakukohdeData['laskentakaavat'] = Laskentakaava.list({hakukohde: hakukohdeOid, myosLuonnos: myosLuonnos});
            hakukohde[0] = hakukohdeData;

            if (hakukohdeData.valintaryhma_id) {
                Valintaryhma.get({oid: hakukohdeData.valintaryhma_id}, function (valintaryhmaData) {

                    ParentValintaryhmas.get({parentOid: valintaryhmaData.oid}, function (data) {
                        for (var i in data) {
                            var valintaryhma = data[i];
                            valintaryhma['laskentakaavat'] = Laskentakaava.list({valintaryhma: valintaryhma.oid, myosLuonnos: myosLuonnos});
                        }

                        var paataso = findRootLevelLaskentakaavas(myosLuonnos);
                        list.push.apply(list, data);
                        list.push(paataso);
                    });

                });
            }

        });

        return list;
    }

    var findRootLevelLaskentakaavas = function (myosLuonnos) {
        var paataso = {
            nimi: "Yleiset kaavat",
            laskentakaavat: []
        };
        Laskentakaava.list({myosLuonnos: myosLuonnos}, function (data) {
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
        refresh: function (valintaryhmaId, hakukohdeOid, myosLuonnos) {
            hakukohde = [];
            valintaryhma = null;
            if (valintaryhmaId) {
                valintaryhmaList[0] = findWithValintaryhma(valintaryhmaId, myosLuonnos);
            } else if (hakukohdeOid) {
                valintaryhmaList[0] = findWithHakukohde(hakukohdeOid, myosLuonnos);
            } else {
                valintaryhmaList[0] = findRootLevelLaskentakaavas(myosLuonnos);
            }
        }
    }
});

function LaskentakaavaListController($scope, $location, $routeParams, Laskentakaava, LaskentakaavaLista) {
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

    var queryParams = $.extend({myosLuonnos: true}, params);
    $scope.laskentakaavat = Laskentakaava.list(queryParams);
    $scope.showForm = false;

    $scope.createKaava = function () {
        $scope.kaava = {
            tyyppi: "NIMETTYLUKUARVO"
        };
        $scope.originalKaava = angular.copy($scope.kaava)
        $scope.showForm = true;
    }

    $scope.editKaava = function (kaava) {
        $scope.showForm = true;
        $scope.kaava = kaava;
        $scope.originalKaava = angular.copy(kaava);
    }

    $scope.cancelEdit = function (kaava) {
        $scope.showForm = false;
        // Palauta originaalit arvot
        angular.forEach($scope.originalKaava, function (value, key) {
            $scope.kaava[key] = value;
        });
        $scope.originalKaava = null;
    }

    $scope.saveKaava = function (kaavaData) {
        if (kaavaData.id) {
            Laskentakaava.updateMetadata({oid: kaavaData.id}, kaavaData, function (data) {
                $scope.showForm = false
            });
        } else {
            var kaava = {
                laskentakaava: {
                    onLuonnos: true,
                    nimi: kaavaData.nimi,
                    kuvaus: kaavaData.kuvaus,
                    funktiokutsu: {
                        funktionimi: kaavaData.tyyppi,
                        syoteparametrit: [
                            {
                                avain: "nimi",
                                arvo: kaavaData.nimi
                            }
                        ]
                    }
                }};

            kaava = $.extend(kaava, saveParams);

            Laskentakaava.insert({}, kaava, function (result) {
                $location.path($scope.linkprefix + "/laskentakaava/" + result.id);
            });
        }
    }

    $scope.cancel = function() {
        $location.path("/");
    }
}

