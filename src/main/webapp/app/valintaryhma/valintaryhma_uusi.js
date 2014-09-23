angular.module('valintaperusteet')
    .factory('ValintaryhmaCreatorModel', ['$q', '$resource', '$location', '$routeParams', 'Valintaryhma', 'KoodistoHaunKohdejoukko', 'ChildValintaryhmas', 'Treemodel',
    'ParentValintaryhmas', 'Utils', 'RootValintaryhmas', 'UserOrganizationsModel',
        function($q, $resource, $location, $routeParams, Valintaryhma, KoodistoHaunKohdejoukko, ChildValintaryhmas, Treemodel,
                ParentValintaryhmas, Utils, RootValintaryhmas, UserOrganizationsModel) {
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

            UserOrganizationsModel.refreshIfNeeded();
            UserOrganizationsModel.deferred.promise.then(function () {
                model.valintaryhma.organisaatiot = UserOrganizationsModel.organizations;
            });

        };

        this.refreshIfNeeded = function() {
            this.refresh();
        };

        this.persistValintaryhma = function(oid) {
            if (model.parentOid) {
                ParentValintaryhmas.get({parentOid: model.parentOid}, function (parents) {
                    ChildValintaryhmas.get({"parentOid": model.parentOid}, function (children) {
                        if (parents && parents.length > 0) {
                            model.valintaryhma.kohdejoukko = parents[parents.length - 1].kohdejoukko;
                        }
                        model.persist(parents, children);
                    });
                });
            } else {
                RootValintaryhmas.get({parentOid: model.parentOid}, function (all) {
                    model.persist(all, all);
                });
            }

        };

        this.persist = function(parents, children) {
            if (!Utils.hasSameName(model, parents, children)) {
                var newValintaryhma = {
                    lapsihakukohde: false,
                    lapsivalintaryhma: false,
                    nimi: model.valintaryhma.nimi,
                    kohdejoukko: model.valintaryhma.kohdejoukko,
                    organisaatiot: model.valintaryhma.organisaatiot
                };
                if (!model.parentOid) {
                    Valintaryhma.insert(newValintaryhma, function (result) {
                        Treemodel.refresh();
                        $location.path("/valintaryhma/" + result.oid);
                    });
                } else {
                    ChildValintaryhmas.insert({"parentOid": model.parentOid}, newValintaryhma, function (result) {
                        Treemodel.refresh();
                        model.valintaryhma = result;
                        $location.path("/valintaryhma/" + result.oid);
                    });
                }
            } else {
                model.nameerror = true;
            }
        };

    }();

    return model;
}])


    .controller('UusiValintaryhmaController', ['$scope', '$location', '$routeParams', 'ValintaryhmaCreatorModel', 'Ylavalintaryhma',
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
        var contains = false;
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