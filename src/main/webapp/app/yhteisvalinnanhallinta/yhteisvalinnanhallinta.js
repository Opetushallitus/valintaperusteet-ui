

angular.module('valintaperusteet').
    controller('ImportController',['$scope', '$location', '$routeParams', 'HakuModel', 'TarjontaImport', 'Treemodel',
        function ($scope, $location, $routeParams, HakuModel, TarjontaImport, Treemodel) {
    "use strict";

    $scope.model = HakuModel;
    HakuModel.init($routeParams.hakuOid);

    $scope.aktivoi = function() {
        TarjontaImport.aktivoi({hakuOid: $scope.model.hakuOid.oid}, function() {  
            Treemodel.refresh();
        });
    };
}]);

