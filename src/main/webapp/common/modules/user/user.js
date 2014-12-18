
angular.module('user', ['lodash'])

    .factory('User', ['$q', '_', 'RoleParser', function ($q, _, RoleParser) {
        var deferred = undefined;

        var User = new function () {

            this.deferred = undefined;
            this.myRoles = [];
            this.organizations = [];

            this.refreshIfNeeded = function (myRoles, appRoles) {
                if(_.isEmpty(deferred)) {
                    User.deferred = $q.defer();
                    User.refresh(myRoles, appRoles);
                }
                return User.deferred.promise;
            };

            this.refresh = function (myRoles, appRoles) {
                User.myRoles = myRoles;
                User.organizations = RoleParser.getParsedRoles(myRoles, appRoles);
                User.deferred.resolve();
            };
        };

        return User;
    }]);