


angular.module('valintaperusteet')
    .controller('ValintaryhmaPuuValitsinController', ['$scope', 'Treemodel', function ($scope, Treemodel) {
        $scope.valintaryhmaPuu = Treemodel;
        Treemodel.refresh();
        
        $scope.selection = {}; // input radio needs this empty object when mapping object reference
        $scope.kopioObj = {};
        $scope.changeSelection = function (puuNode) {
            $scope.kopioObj.value = puuNode;
        };
        
    }]);
