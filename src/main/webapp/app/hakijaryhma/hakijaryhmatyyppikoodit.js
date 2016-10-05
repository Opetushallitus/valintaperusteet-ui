angular.module('valintaperusteet')

    .controller('HakijaryhmatyyppikooditController', ['$scope', function($scope) {
        "use strict";

        $scope.showHakijaryhmatyyppikoodit = function () {
            var promise = $scope.model.getHakijaryhmatyyppikoodit();
            promise.finally(function () {
                $scope.show();
            });
        };

        $scope.setHakijaryhmatyyppikoodiUri = function (newUri) {
            $scope.newHakijaryhmatyyppikoodiUri = newUri;
        };

        $scope.addHakijaryhmatyyppikoodiUri = function (newHakijaryhmatyyppikoodiUri) {
            $scope.model.addHakijaryhmatyyppikoodiUri(newHakijaryhmatyyppikoodiUri);
        };

        $scope.removeHakijaryhmatyyppikoodi = function (hakijaryhmatyyppikoodi) {
            $scope.model.removeHakijaryhmatyyppikoodi(hakijaryhmatyyppikoodi);
        };

    }]);

