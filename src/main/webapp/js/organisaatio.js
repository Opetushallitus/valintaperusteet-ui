"use strict";
app.factory('OrganisaatioTreeModel', function(Organizations) {

    return (function() {
        var instance = {};
        instance.model = {};
        instance.searchStr = "";

        instance.refresh = function(searchStr) {
            var params = {"searchStr": searchStr};
            Organizations.get(params, function(result){
                instance.model = result;

                if(instance.model.organisaatiot.length < 4) {
                    instance.model.organisaatiot.forEach(function(data){
                        instance.openChildren(data);
                    });

                }
            });
        }

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
                }

                iter(data.children);
            }
        }

        return instance;
    })();

});

function OrganisaatioTreeController($scope, $timeout, OrganisaatioTreeModel) {
    $scope.orgTree = OrganisaatioTreeModel;
    $scope.orgSelector = false;

    $scope.$watch('orgTree.searchStr', debounce(function() {
        if($scope.orgTree.searchStr.length > 2) {
            OrganisaatioTreeModel.refresh($scope.orgTree.searchStr);
        } else {
            OrganisaatioTreeModel.model = {};
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
    }

    $scope.clear = function(){
        OrganisaatioTreeModel.model = {};
        OrganisaatioTreeModel.searchStr = '';
    }

    $scope.close = function(){
        $scope.orgSelector = false;
    }

    $scope.show = function(){
        $scope.orgSelector = true;
    }
}
