
angular.module('User', [])

.factory('User', ['$q', '_', 'RoleParser', 'palvelutHARDCODE', function ($q, _, RoleParser, palvelutHARDCODE) {
    var deferred = undefined;

    var User = new function () {

        this.organizations = [];
        
        this.refreshIfNeeded = function () {
            if(_.isEmpty(deferred)) {
                deferred = $q.defer();
                User.refresh();
            }
            return deferred.promise;

        };
        
        this.refresh = function () {
            User.organizations = RoleParser.getOrganizations(palvelutHARDCODE);
            console.log(User.organizations);
        };
    };

    return User;
}]);

