// Valintaryhma Järjestyskriteerit
app.factory('HakijaryhmaValintatapajonoModel', function($q, ValintatapajonoModel, ValintaryhmaHakijaryhma,
                                                    HakukohdeHakijaryhma, ValintatapajonoHakijaryhma,
                                                    Laskentakaava) {
    
    var factory = (function() {
        var instance = {};

        instance.hakijaryhma = {};
        instance.hakijaryhmat = [];

        instance.refresh = function(valintaryhmaOid, hakukohdeOid) {
            instance.hakijaryhma = {};
            instance.hakijaryhmat = [];

            var temp;
            var deferred = $q.defer();
            if(hakukohdeOid) {
                HakukohdeHakijaryhma.get({oid: hakukohdeOid}, function(result) {
                    temp = result;
                    deferred.resolve();
                });
            } else if(valintaryhmaOid) {
                ValintaryhmaHakijaryhma.get({oid: valintaryhmaOid}, function(result) {
                    temp = result;
                    deferred.resolve();
                });
            }

            deferred.promise.then(function(){
                temp.forEach(function(hr){
                    var found = false;
                    ValintatapajonoModel.hakijaryhmat.forEach(function(lisattyHr) {
                        if(hr.oid == lisattyHr.hakijaryhma.oid) {
                            found = true;
                        }
                    });
                    if(!found) {
                        instance.hakijaryhmat.push(hr);
                        Laskentakaava.get({oid: hr.laskentakaavaId}, function(result) {
                            hr.laskentakaava_nimi = result.nimi;
                        });
                    }
                });
            });
        }

        instance.submit = function(valintatapajonoOid) {
            var deferred = $q.defer();

            if(instance.hakijaryhma.oid) {
                ValintatapajonoHakijaryhma.insert({oid: valintatapajonoOid, hakijaryhmaOid: instance.hakijaryhma.oid}, function(result) {
                    deferred.resolve();
                });
            } else {
                alert("Hakijaryhma.oid ei löytynyt.");
            }
            return deferred.promise;
        }

        return instance;
    })();

    return factory;
    
});

function HakijaryhmaValintatapajonoController($scope, $location, $routeParams, HakijaryhmaValintatapajonoModel, ValintatapajonoModel) {
	$scope.valintaryhmaOid = $routeParams.id;
	$scope.hakukohdeOid = $routeParams.hakukohdeOid;
    ValintatapajonoModel.refreshIfNeeded($routeParams.valintatapajonoOid, $routeParams.id, $routeParams.hakukohdeOid);
    $scope.model = HakijaryhmaValintatapajonoModel;
    $scope.model.refresh($routeParams.id, $routeParams.hakukohdeOid);

    $scope.submit = function() {
        var promise = HakijaryhmaValintatapajonoModel.submit($routeParams.valintatapajonoOid);
        promise.then(function(greeting) {
               ValintatapajonoModel.refresh($routeParams.valintatapajonoOid, $routeParams.id, $routeParams.hakukohdeOid);
               var path;
               if($routeParams.hakukohdeOid) {
                   path = "/hakukohde/" + $routeParams.hakukohdeOid;
               } else {
                   path = "/valintaryhma/" + $routeParams.id;
               }
               $location.path(path + '/valinnanvaihe/'+ $routeParams.valinnanvaiheOid +
                                       '/valintatapajono/' + $routeParams.valintatapajonoOid);
        });

    };

    $scope.cancel = function() {

       var path;
       if($routeParams.hakukohdeOid) {
           path = "/hakukohde/" + $routeParams.hakukohdeOid;
       } else {
           path = "/valintaryhma/" + $routeParams.id;
       }
       $location.path(path + '/valinnanvaihe/'+ $routeParams.valinnanvaiheOid +
                               '/valintatapajono/' + $routeParams.valintatapajonoOid);

    };

}