angular.module('LaskentakaavaEditor').controller('AlikaavaController', ['$scope', 'Laskentakaava', '$q', function ($scope, Laskentakaava, $q) {
    $scope.isAlikaava = true;
    $scope.showAlikaava = false;
    $scope.alikaava = undefined;

    $scope.toggleAlikaava = function (oid) {
        var promise = $scope.getAlikaava(oid);
        promise.then(function() {
            $scope.openAlikaava();
        });
    };

    $scope.openAlikaava = function() {
        if ($scope.alikaava && $scope.alikaava.id) {
            if (!$scope.showAlikaava) {
                $scope.showAlikaava = true;
            } else {
                $scope.showAlikaava = false;
            }
        } else {
            $scope.showAlikaava = false;
        }
    }

    $scope.getAlikaava = function (oid) {
        var deferred = $q.defer();
        if ($scope.alikaava === undefined || $scope.alikaava && $scope.alikaava.id !== oid) {
            Laskentakaava.get({oid: oid}, function (result) {
                $scope.alikaava = result;
                $scope.alikaava.isAlikaava = false;
                deferred.resolve();
            }, function(err) {
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

    //ilmoitetaan mahdollisille alikaavan alikaavoille ja alikaavan funktiokutsuille, että ollaan alikaavassa, eikä alkuperäisessä laskentakaavassa
    $scope.$on('doIHaveParentAlikaava', function () {
        $scope.$broadcast('parentAlikaavaFound', $scope.$id);
    });

    $scope.$on('parentAlikaavaFound', function (event, parentScopeId) {
        if ($scope.$id !== parentScopeId) {
            $scope.alikaava.isAlikaava = true;
        }
    });

}]);