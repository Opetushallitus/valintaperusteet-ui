// Valintaryhma Järjestyskriteerit
app.factory('HakijaryhmaModel', function($q, Hakijaryhma, LaskentakaavaModel,
                                         ValintaryhmaHakijaryhma, HakukohdeHakijaryhma,
                                         HakijaryhmanValintatapajonot, ValintatapajonoHakijaryhma, HakijaryhmaValintatapajono) {
    "use strict";

    var factory = (function() {
        var instance = {};
        instance.hakijaryhma = {};
        instance.valintatapajonot = [];
        instance.onkoHakijaryhma = true;

        instance.refresh = function(oid, valintaryhmaOid, hakukohdeOid, valintatapajonoOid) {
            instance.hakijaryhma = {};
            instance.hakijaryhma.kaytaKaikki = false;
            instance.hakijaryhma.tarkkaKiintio = false;
            instance.valintatapajonot.length = 0;

            if(oid) {
                if(hakukohdeOid || valintatapajonoOid) {
                    HakijaryhmaValintatapajono.get({oid: oid}, function(result) {
                        instance.hakijaryhma = result;
                        instance.onkoHakijaryhma = false;
                    })
                } else {
                    Hakijaryhma.get({oid: oid}, function(result) {
                        instance.hakijaryhma = result;
                    });
                }

                //instance.valintatapajonot = HakijaryhmanValintatapajonot.get({oid: oid});
            }

            LaskentakaavaModel.refresh(valintaryhmaOid, hakukohdeOid);
            instance.laskentakaavaModel = LaskentakaavaModel;

        };

        

        instance.submit = function(valintaryhmaOid, hakukohdeOid, valintatapajonoOid) {
            var deferred = $q.defer();

            if(instance.hakijaryhma.oid) {
                if(hakukohdeOid || valintatapajonoOid) {
                    HakijaryhmaValintatapajono.update({oid: instance.hakijaryhma.oid}, instance.hakijaryhma, function (result) {
                        instance.hakijaryhma = result;
                        deferred.resolve();
                    }, function(err) {
                        deferred.reject('Hakijaryhmän tallentaminen hakukohteelle tai valintatapajonolle epäonnistui', err);
                    });
                } else {
                    Hakijaryhma.update({oid: instance.hakijaryhma.oid}, instance.hakijaryhma, function (result) {
                        instance.hakijaryhma = result;
                        deferred.resolve();
                    }, function(err) {
                        deferred.reject('Hakijaryhmän tallentaminen valintaryhmään epäonnistui', err);
                    });
                }
            } else if(hakukohdeOid) {
                HakukohdeHakijaryhma.insert({oid: hakukohdeOid}, instance.hakijaryhma, function(result) {
                    instance.hakijaryhma = result;
                    deferred.resolve();
                }, function(err) {
                    deferred.reject('Hakijaryhmän tallentaminen hakukohteeseen epäonnistui', err);
                });
            } else if(valintatapajonoOid) {
                ValintatapajonoHakijaryhma.insert({oid: valintatapajonoOid}, instance.hakijaryhma, function(result) {
                    instance.hakijaryhma = result;
                    deferred.resolve();
                }, function(err) {
                    deferred.reject('Hakijaryhmän tallentaminen valintatapajonoon epäonnistui', err);
                })
            }
            else if(valintaryhmaOid){
                ValintaryhmaHakijaryhma.insert({oid: valintaryhmaOid}, instance.hakijaryhma, function(result) {
                    instance.hakijaryhma = result;
                    deferred.resolve();
                }, function(err) {
                    deferred.reject('Hakijaryhmän tallentaminen valintaryhmään epäonnistui', err);
                });
            } else {
                deferred.reject('Hakukohteen tai valintatapajonon tunnistetta ei löytynyt. Hakijaryhmän tallentaminen epäonnistui');
            }
            /*
             } else if(valintaryhmaOid) {
             ValintaryhmaHakijaryhma.insert({oid: valintaryhmaOid}, instance.hakijaryhma, function(result) {
             instance.hakijaryhma = result;
             deferred.resolve();
             });
             */

            return deferred.promise;
        };

        return instance;
    })();

    return factory;
    
});

angular.module('valintaperusteet').
    controller('HakijaryhmaController', ['$scope', '$location', '$routeParams', 'HakijaryhmaModel',
        'HakukohdeModel', 'ValintaryhmaModel',
        function ($scope, $location, $routeParams, HakijaryhmaModel, HakukohdeModel, ValintaryhmaModel,ValintatapajonoModel) {
    "use strict";

    $scope.valintaryhmaOid = $routeParams.id;
	$scope.hakukohdeOid = $routeParams.hakukohdeOid;
    $scope.model = HakijaryhmaModel;
    $scope.model.refresh($routeParams.hakijaryhmaOid, $routeParams.id, $routeParams.hakukohdeOid, $routeParams.valintatapajonoOid);


    $scope.submit = function() {
        var promise = HakijaryhmaModel.submit($routeParams.id, $routeParams.hakukohdeOid, $routeParams.valintatapajonoOid);
        promise.then(function() {

            if($routeParams.valintatapajonoOid) {
                var isValintaryhmaChild = $routeParams.id ? true : false;
                ValintatapajonoModel.refresh($routeParams.valintatapajonoOid);

                if(isValintaryhmaChild) {
                    $location.path('/valintaryhma/' + $routeParams.id + '/valinnanvaihe/' + $routeParams.valinnanvaiheOid + '/valintatapajono/' + $routeParams.valintatapajonoOid);
                } else {
                    $location.path('/hakukohde/' + $routeParams.hakukohdeOid + '/valinnanvaihe/' + $routeParams.valinnanvaiheOid + '/valintatapajono/' + $routeParams.valintatapajonoOid);
                }
            } else if($routeParams.hakukohdeOid) {
                HakukohdeModel.refresh($routeParams.hakukohdeOid);
                $location.path("/hakukohde/" + $routeParams.hakukohdeOid);
            } else {
                ValintaryhmaModel.refresh($routeParams.id);
                $location.path("/valintaryhma/" + $routeParams.id);
            }
        });

    };

    $scope.cancel = function() {
        var path;

        if($routeParams.hakukohdeOid) {
            path = "/hakukohde/" + $routeParams.hakukohdeOid;
        } else {
            path = "/valintaryhma/" + $routeParams.id;
        }

        $location.path(path);
    };
}]);