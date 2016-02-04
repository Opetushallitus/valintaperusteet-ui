


angular.module('valintaperusteet')
    .controller('ValintaryhmaPuuValitsinController', ['$scope', 'Treemodel', 'HakuModel', 'CustomHakuUtil', function ($scope, Treemodel, HakuModel, CustomHakuUtil) {
        // Deep copy for non-persisting changes
        $scope.hakuModel = angular.copy(HakuModel);
        $scope.hakuModel.init();
        $scope.hakuModel.hakuDeferred.promise.then(function(){
            $scope.valintaryhmaPuu = Treemodel;
            Treemodel.refreshHaku($scope.hakuModel.haku);
        });

        // Deep copy for non-persisting changes
        $scope.customHakuUtil = angular.copy(CustomHakuUtil);
        $scope.customHakuUtil.hakutyyppi.value = undefined;
        $scope.customHakuUtil.kohdejoukko.value = undefined;
        $scope.customHakuUtil.hakutapa.value = undefined;
        $scope.customHakuUtil.hakukausi.value = undefined;
        $scope.customHakuUtil.hakuvuosi.value = undefined;
        $scope.customHakuUtil.refresh();

        $scope.selection = {}; // input radio needs this empty object when mapping object reference
        $scope.changeSelection = function (puuNode) {
            $scope.kopioObj.value = puuNode; //kopioObj must be set in parent scope
        };
        $scope.changeHaku = function () {
            if($scope.hakuModel && $scope.hakuModel.haku) {
                // Bypass HakuModel used in Treemodel
                Treemodel.refreshHaku($scope.hakuModel.haku);
            }
        };
    }]);
