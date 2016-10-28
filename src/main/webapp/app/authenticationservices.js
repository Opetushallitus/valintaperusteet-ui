angular.module('valintaperusteet')



.factory('AuthenticationServices', ['$http','$q', function ($http, $q) {
        var deferred = $q.defer();
        $http.get(window.url("authentication-service.palvelu")).success(function (result) {
            deferred.resolve(result);
        });
    
    return deferred.promise;
}]);
