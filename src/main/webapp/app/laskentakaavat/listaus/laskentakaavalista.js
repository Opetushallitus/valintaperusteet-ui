angular.module('LaskentakaavaEditor').factory('LaskentakaavaLista', function (Laskentakaava, ParentValintaryhmas,
                                                                              Hakukohde, Valintaryhma, _) {
    'use strict';

    var valintaryhmaList = [];
    var hakukohde = [];
    var valintaryhma = null;

    var findWithValintaryhma = function (valintaryhmaId) {
        var list = [];
        ParentValintaryhmas.get({parentOid: valintaryhmaId}, function (data) {
            _.forEach(data, function(item, index, array) {
                if(item.oid) {
                    item['laskentakaavat'] = Laskentakaava.list({valintaryhma: item.oid});
                }
            });

            var paataso = findRootLevelLaskentakaavas();
            list.push.apply(list, data);
            list.push(paataso);
        });
        return list;
    };

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
    };

    var findRootLevelLaskentakaavas = function () {
        var paataso = {
            nimi: "Yleiset kaavat",
            laskentakaavat: []
        };
        Laskentakaava.list({oid: null}, function (data) {
            paataso.laskentakaavat = data;
        });

        return paataso;
    };

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
    };
});

angular.module('LaskentakaavaEditor').controller('LaskentakaavaListController', function($scope, $location, $routeParams, Laskentakaava, LaskentakaavaLista, FunktioService) {
    'use strict';

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
        $location.path("/valintaryhma/" + $routeParams.valintaryhmaOid + "/laskentakaavalista/laskentakaava");
    };

    $scope.editKaava = function (kaava) {
        console.log(kaava);
        $scope.showForm = true;
        $scope.kaava = kaava;
        $scope.originalKaava = angular.copy(kaava);
    };

    $scope.cancel = function () {
        $location.path("/valintaryhma/" + $routeParams.valintaryhmaOid);
    };

    $scope.kaavaKopiointiModal = function (kaava) {
        $scope.$broadcast('kaavakopiointi', kaava);
    };

});

angular.module('LaskentakaavaEditor').factory('KaavaKopiointiModel', function($log,  Laskentakaava) {
    'use strict';
    var model = new function () {


        this.laskentakaava = {};

        this.refresh = function (kaavaId) {

            Laskentakaava.get({oid: kaavaId}, function(result) {
                model.laskentakaava = result.funktiokutsu;
            }, function(error) {
                $log.error('Laskentakaavan hakeminen epäonnistui', error);
            });


        };

        this.refreshIfNeeded = function(kaavaId) {
            if(model.laskentakaava.id !== kaavaId) {
                model.refresh(kaavaId);
            }
        };

   };

   return model;
});

angular.module('LaskentakaavaEditor').controller('KaavaKopiointiController', function($scope, $log, KaavaKopiointiModel, Ylavalintaryhma, KaavaSiirto, Laskentakaava ) {

    $scope.domain = Ylavalintaryhma;
    $scope.domain.refresh();

    $scope.kopiointiModel = KaavaKopiointiModel;
    //model-object täytyy luoda, koska sen parentOid-muuttujaan asetetaan valitun valintaryhmän oid
    $scope.model = {};

    $scope.kopioiKaava = function() {
        var payload = {
            uusinimi: $scope.model.uusinimi,
            valintaryhmaOid: $scope.model.parentOid,
            funktiokutsu: $scope.kopiointiModel.laskentakaava,
            onLuonnos: $scope.kaavaData.onLuonnos,
            nimi: $scope.kaavaData.nimi,
            kuvaus: $scope.kaavaData.kuvaus
        };
        
        KaavaSiirto.put(payload, function(result) {
            $scope.$broadcast('suljemodal');
        }, function(error) {
            $log.error('Kaavan siirto ei onnistunut', error);
            $scope.$broadcast('suljemodal');
        });
    };

    $scope.cancel = function() {
        $scope.$broadcast('suljemodal');
    }

    $scope.$on('kaavakopiointi', function(event, kaava) {
        if(kaava.id) {
            $scope.kaavaData = kaava;
            $scope.kopiointiModel.refreshIfNeeded(kaava.id);
            $scope.show();
        } else {
            $log.error('Kopioitavan kaavan Id puuttuu');
        }
    });


});