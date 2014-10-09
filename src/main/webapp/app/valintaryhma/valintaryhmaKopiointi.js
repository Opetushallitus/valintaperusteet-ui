
angular.module('valintaperusteet')

    .controller('ValintaryhmaKopiointiController', ['$scope', 'ValintaryhmaModel', function ($scope, ValintaryhmaModel) {

        $scope.kopioObj = {};

        $scope.$on('showValintaryhmaKopiointi', function () {
            $scope.show();
        });

        $scope.kopioiValintaryhma = function () {
            console.log($scope.kopioObj);
        };

    }]);