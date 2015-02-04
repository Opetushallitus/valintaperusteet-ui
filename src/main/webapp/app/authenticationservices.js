angular.module('valintaperusteet')



.factory('AuthenticationServices', ['$http','$q', function ($http, $q) {
        var deferred = $q.defer();
        $http.get(AUTHENTICATION_URL_BASE + "resources/palvelu").success(function (result) {
            deferred.resolve(result);
        });
    
    return deferred.promise;
}]);
