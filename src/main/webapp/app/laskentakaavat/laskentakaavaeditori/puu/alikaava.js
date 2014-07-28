angular.module('LaskentakaavaEditor').controller('AlikaavaController', ['$scope', 'Laskentakaava', '$q',
    function ($scope, Laskentakaava, $q) {
    "use strict";

    $scope.hasParentAlikaava = false;
    if ($scope.isAlikaava) {
        $scope.hasParentAlikaava = true;
    }

    $scope.isAlikaava = true;
    $scope.showAlikaava = false;
    $scope.alikaava = undefined;

    $scope.toggleAlikaava = function (oid) {
        var promise = $scope.getAlikaava(oid);
        promise.then(function () {
            $scope.openAlikaava();
        });
    };

    $scope.openAlikaava = function () {
        if ($scope.alikaava && $scope.alikaava.id) {
            if (!$scope.showAlikaava) {
                $scope.showAlikaava = true;
            } else {
                $scope.showAlikaava = false;
            }
        } else {
            $scope.showAlikaava = false;
        }
    };

    $scope.getAlikaava = function (oid) {
        var deferred = $q.defer();
        if ($scope.alikaava === undefined || $scope.alikaava && $scope.alikaava.id !== oid) {
            Laskentakaava.get({oid: oid}, function (result) {
                $scope.alikaava = result;
                $scope.alikaava.isAlikaava = false;
                deferred.resolve();
            }, function (err) {
                deferred.resolve();
            });
        } else {
            deferred.resolve();
        }

        return deferred.promise;
    };

    $scope.$on('changeAlikaava', function (event, kaavaId) {
        $scope.alikaava = undefined;
        $scope.getAlikaava(kaavaId);
    });

}]);