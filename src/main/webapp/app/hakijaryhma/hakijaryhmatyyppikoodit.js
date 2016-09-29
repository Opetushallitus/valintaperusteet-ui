angular.module('valintaperusteet')

    .controller('HakijaryhmatyyppikooditController', ['$scope', function($scope) {
        "use strict";

        $scope.toggleHakijaryhmatyyppikoodit = false;

        $scope.toggleTyyppikoodit = function () {
            $scope.toggleHakijaryhmatyyppikoodit = !$scope.toggleHakijaryhmatyyppikoodit;
        };

        $scope.showHakijaryhmatyyppikoodit = function () {
            var promise = $scope.model.getHakijaryhmatyyppikoodit();
            $scope.toggleHakijaryhmatyyppikoodit = true;
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

