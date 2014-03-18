app.factory('ValintaryhmaCreatorModel', function($resource, $location, $routeParams, Valintaryhma, ChildValintaryhmas, Treemodel ) {

    var model = new function() {
        this.valintaryhma = {};

        this.refresh = function() {
            model.valintaryhma = {};
            model.parentOid  = "";

        };

        this.refreshIfNeeded = function() {
            this.refresh();
        };

        this.persistValintaryhma = function() {

            var newValintaryhma = {
                lapsihakukohde: false,
                lapsivalintaryhma: false,
                nimi: model.valintaryhma.nimi,
                organisaatiot: model.valintaryhma.organisaatiot
            };

            if(!model.parentOid){
                Valintaryhma.insert(newValintaryhma, function(result) {
                    Treemodel.refresh();
                    $location.path("/valintaryhma/" + result.oid);
                });
            } else {
                ChildValintaryhmas.insert({"parentOid": model.parentOid}, newValintaryhma, function(result){
                    Treemodel.refresh();
                    model.valintaryhma = result;
                    $location.path("/valintaryhma/" + result.oid);
                });
            }
        };
    }

    return model;
});

function UusiValintaryhmaController($scope, $location, $routeParams, ValintaryhmaCreatorModel, Ylavalintaryhma) {
    $scope.valintaryhmaOid = $routeParams.id;
    $scope.model = ValintaryhmaCreatorModel;
    $scope.model.refreshIfNeeded($scope.valintaryhmaOid);

    $scope.domain = Ylavalintaryhma;
    Ylavalintaryhma.refresh();

    $scope.submit = function() {
        $scope.model.persistValintaryhma($scope.valintaryhmaOid);
    }

    $scope.cancel = function() {
        $location.path("/");
    }

    $scope.organisaatioSelector = function(data) {
        "use strict";
        if(!$scope.model.valintaryhma.organisaatiot) {
            $scope.model.valintaryhma.organisaatiot = [];
        }
        var contains = false
        $scope.model.valintaryhma.organisaatiot.forEach(function(org){
            if(data.oid === org.oid) {
                contains = true;
            }
        });

        if(!contains) {
            $scope.model.valintaryhma.organisaatiot.push(data);
        }
    }

}