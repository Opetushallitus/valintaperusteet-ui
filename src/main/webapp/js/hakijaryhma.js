// Valintaryhma Järjestyskriteerit
app.factory('HakijaryhmaModel', function($q, Hakijaryhma, LaskentakaavaModel,
                                         ValintaryhmaHakijaryhma, HakukohdeHakijaryhma,
                                         HakijaryhmanValintatapajonot) {
    
    var factory = (function() {
        var instance = {};
        instance.hakijaryhma = {};
        instance.valintatapajonot = [];

        instance.refresh = function(oid, valintaryhmaOid, hakukohdeOid) {
            instance.hakijaryhma = {};
            instance.valintatapajonot.length = 0;
            if(oid) {
                Hakijaryhma.get({oid: oid}, function(result) {
                    instance.hakijaryhma = result;
                });

                instance.valintatapajonot = HakijaryhmanValintatapajonot.get({oid: oid});
            }

            LaskentakaavaModel.refresh(valintaryhmaOid, hakukohdeOid);
            instance.laskentakaavaModel = LaskentakaavaModel;

        }

        instance.submit = function(valintaryhmaOid, hakukohdeOid) {
            var deferred = $q.defer();
            console.log(instance.hakijaryhma);
            if(instance.hakijaryhma.oid) {
                Hakijaryhma.update({oid: instance.hakijaryhma.oid}, instance.hakijaryhma, function(result) {
                    instance.hakijaryhma = result;
                    deferred.resolve();
                });
            } else if(valintaryhmaOid) {
                ValintaryhmaHakijaryhma.insert({oid: valintaryhmaOid}, instance.hakijaryhma, function(result) {
                    instance.hakijaryhma = result;
                    deferred.resolve();
                });
            } else if(hakukohdeOid) {
                HakukohdeHakijaryhma.insert({oid: hakukohdeOid}, instance.hakijaryhma, function(result) {
                    instance.hakijaryhma = result;
                    deferred.resolve();
                });
            } else {
                alert("Hakijaryhma-, valintaryhma tai hakukohdeoidia ei löytynyt.");
            }
            return deferred.promise;
        }

        return instance;
    })();

    return factory;
    
});

function HakijaryhmaController($scope, $location, $routeParams, HakijaryhmaModel, HakukohdeModel, ValintaryhmaModel) {

    $scope.model = HakijaryhmaModel;
    $scope.model.refresh($routeParams.hakijaryhmaOid, $routeParams.id, $routeParams.hakukohdeOid);

    $scope.submit = function() {
        var promise = HakijaryhmaModel.submit($routeParams.id, $routeParams.hakukohdeOid);
        promise.then(function() {
            var path;
            if($routeParams.hakukohdeOid) {
                HakukohdeModel.refresh($routeParams.hakukohdeOid);
                path = "/hakukohde/" + $routeParams.hakukohdeOid;
            } else {
                ValintaryhmaModel.refresh($routeParams.id);
                path = "/valintaryhma/" + $routeParams.id;
            }
            $location.path(path);
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

}