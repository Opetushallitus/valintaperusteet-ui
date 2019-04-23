
angular.module('valintaperusteet')

    .factory('OrganisaatioTreeModel', ['Organizations', 'AuthService', 'OrganizationByOid',
        function(Organizations, AuthService, OrganizationByOid) {
    "use strict";

    return (function() {
        var instance = {};
        instance.model = {};
        instance.searchStr = "";

        var oph = {
            "oid" : "1.2.246.562.10.00000000001",
            "parentOidPath" : "1.2.246.562.10.00000000001",
            "nimi" : {
                "fi" : "OPH",
                "sv" : "OPH",
                "en" : "OPH"
            },
            "children": []
        };

        instance.search = function(searchStr) {
            var params = {"searchStr": searchStr};
            Organizations.get(params, function(result){
                instance.model = result;

                if(instance.model.organisaatiot.length < 4) {
                    instance.model.organisaatiot.forEach(function(data){
                        instance.openChildren(data);
                    });
                }
            });
        };

        instance.openChildren = function(data) {
            data.open = !data.open;
            if(data.open) {

                var iter = function(children){
                    if(children) {
                        children.forEach(function(child){
                            child.open = true;
                            iter(child.children);
                        });
                    }
                };

                iter(data.children);
            }
        };

        instance.init = function() {
            instance.model = {};
            // oph ei palaudu hausta
            AuthService.crudOph("APP_VALINTAPERUSTEET").then(function(){
                OrganizationByOid.get({oid:"1.2.246.562.10.00000000001"}, function(result){
                    if(!instance.model.organisaatiot) {
                        instance.model.organisaatiot = [];
                        instance.model.numHits = 0;
                    }
                    if(!result.parentOidPath) {
                        result.parentOidPath = result.oid;
                    }
                    if(!result.children) {
                        result.children = [];
                    }
                    instance.model.organisaatiot.unshift(result);
                    instance.model.numHits+=1;
                });

            });
        };

        return instance;
    })();

}])

.controller('OrganisaatioTreeController', ['$scope', 'OrganisaatioTreeModel',
        function($scope, OrganisaatioTreeModel) {
    "use strict";

    $scope.orgTree = OrganisaatioTreeModel;


    $scope.$watch('orgTree.searchStr', debounce(function() {
        if($scope.orgTree.searchStr.length > 2) {
            OrganisaatioTreeModel.search($scope.orgTree.searchStr);
        } else {
            OrganisaatioTreeModel.init();
        }
    }, 500));

    function debounce(fn, delay) {
        var timer = null;
        return function () {
            var context = this, args = arguments;
            clearTimeout(timer);
            timer = setTimeout(function () {
                fn.apply(context, args);
            }, delay);
        };
    }
    
    $scope.openChildren = function(data) {
        OrganisaatioTreeModel.openChildren(data);
    };

    $scope.clear = function(){
        OrganisaatioTreeModel.model = {};
        OrganisaatioTreeModel.searchStr = '';
    };
}]);
