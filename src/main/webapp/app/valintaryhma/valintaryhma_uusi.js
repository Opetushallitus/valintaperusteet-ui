app.factory('ValintaryhmaCreatorModel', function($resource, $location, $routeParams, Valintaryhma,
                                                 KoodistoHaunKohdejoukko, ChildValintaryhmas, Treemodel,
                                                 ParentValintaryhmas, Utils) {
    "use strict";

    var model = new function() {
        this.valintaryhma = {};
        this.kohdejoukot = [];
        this.nameerror = false;

        this.refresh = function() {
            model.valintaryhma = {};
            model.parentOid  = "";
            model.nameerror = false;


            KoodistoHaunKohdejoukko.get(function (result) {
                model.kohdejoukot = result;
            });

        };

        this.refreshIfNeeded = function() {
            this.refresh();
        };

        this.persistValintaryhma = function() {

            var newValintaryhma = {
                lapsihakukohde: false,
                lapsivalintaryhma: false,
                nimi: model.valintaryhma.nimi,
                kohdejoukko: model.valintaryhma.kohdejoukko,
                organisaatiot: model.valintaryhma.organisaatiot
            };

            if (!model.parentOid) {
                if (!Utils.hasSameName(model)) {
                    Valintaryhma.insert(newValintaryhma, function (result) {
                        Treemodel.refresh();
                        $location.path("/valintaryhma/" + result.oid);
                    });
                } else {
                    model.nameerror = true;
                }
            } else {
                ParentValintaryhmas.get({parentOid: model.parentOid}, function (data) {
                    var parentoid = model.parentOid;
                    if (data && data.length > 0) {
                        parentoid = data[data.length-1].oid;
                        model.valintaryhma.kohdejoukko = data[data.length-1].kohdejoukko;
                    }
                    if (!Utils.hasSameName(model,parentoid)) {
                        ChildValintaryhmas.insert({"parentOid": model.parentOid}, newValintaryhma, function (result) {
                            Treemodel.refresh();
                            model.valintaryhma = result;
                            $location.path("/valintaryhma/" + result.oid);
                        });
                    } else {
                        model.nameerror = true;
                    }
                });

            }
        };


    }();

    return model;
});

angular.module('valintaperusteet').
    controller('UusiValintaryhmaController', ['$scope', '$location', '$routeParams', 'ValintaryhmaCreatorModel', 'Ylavalintaryhma',
        function ($scope, $location, $routeParams, ValintaryhmaCreatorModel, Ylavalintaryhma) {
    "use strict";

    $scope.valintaryhmaOid = $routeParams.id;
    $scope.model = ValintaryhmaCreatorModel;
    $scope.model.refreshIfNeeded($scope.valintaryhmaOid);

    $scope.domain = Ylavalintaryhma;
    Ylavalintaryhma.refresh();

    $scope.submit = function() {
        $scope.model.persistValintaryhma($scope.valintaryhmaOid);
    };

    $scope.cancel = function() {
        $location.path("/");
    };

    $scope.organisaatioSelector = function(data) {
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
    };

}]);