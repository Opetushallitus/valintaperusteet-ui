// Valintaryhma Järjestyskriteerit
app.factory('HakijaryhmaModel', function(Hakijaryhma, LaskentakaavaModel) {
    
    var factory = (function() {
        var instance = {};
        instance.hakijaryhma = [];

        instance.refresh = function(oid, valintaryhmaOid, hakukohdeOid) {

            Hakijaryhma.get({oid: oid}, function(result) {
                instance.valintalaskenta = result;
            });

            LaskentakaavaModel.refresh(valintaryhmaOid, hakukohdeOid);
            instance.laskentakaavaModel = LaskentakaavaModel;

        }

        instance.submit = function() {

        }

        return instance;
    })();

    return factory;
    
});

function HakijaryhmaController($scope, $location, $routeParams, HakijaryhmaModel) {

    $scope.model = HakijaryhmaModel;
    $scope.model.refresh($routeParams.hakijaryhmaOid, $routeParams.id, $routeParams.hakukohdeOid);

    $scope.submit = function() {
        var promise = HakijaryhmaModel.submit();
        promise.then(function() {
            var path;
            if($routeParams.hakukohdeOid) {
                path = "/hakukohde/" + $routeParams.hakukohdeOid;
            } else {
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