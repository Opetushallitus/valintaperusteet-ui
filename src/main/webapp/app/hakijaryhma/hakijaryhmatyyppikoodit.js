angular.module('valintaperusteet')

    .controller('HakijaryhmatyyppikooditController', ['$scope', function($scope) {
        "use strict";

        $scope.showHakijaryhmatyyppikoodit = function () {
            var promise = $scope.model.getHakijaryhmatyyppikoodit();
            promise.finally(function () {
                $scope.show();
            });
        };

        $scope.saveHakijaryhmatyyppikoodiUri = function (newHakijaryhmatyyppikoodiUri) {
            $scope.model.setHakijaryhmatyyppikoodiUri(newHakijaryhmatyyppikoodiUri);
        };

        $scope.removeHakijaryhmatyyppikoodi = function () {
            $scope.model.removeHakijaryhmatyyppikoodi();
        };

    }]);

