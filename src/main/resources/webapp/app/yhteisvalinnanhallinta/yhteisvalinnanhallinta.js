

angular.module('valintaperusteet').
    controller('ImportController',['$scope', '$location', '$q', '$routeParams', '$filter', 'HakuModel', 'TarjontaImport', 'Treemodel', 'UserAccessLevels', 'UserModel', '_',
                          function ($scope, $location, $q, $routeParams, $filter, HakuModel, TarjontaImport, Treemodel, UserAccessLevels, UserModel, _) {
    "use strict";
    $scope.model = HakuModel;
    HakuModel.init();

    $scope.aktivoi = function() {
        TarjontaImport.aktivoi({hakuOid: HakuModel.haku.oid}, function() {
            Treemodel.refresh();
        });
    };
}]);




