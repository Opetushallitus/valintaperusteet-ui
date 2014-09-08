
angular.module('valintaperusteet')

    .factory('UserOrganizationsModel', ['$q', '$log', '_', 'AuthService', 'OrganizationByOid', function ($q, $log, _, AuthService, OrganizationByOid) {
        var model = new function() {

            this.organizations = [];

            this.refresh = function () {
                var promises = [];

                var authServiceDeferred = $q.defer();
                promises.push(authServiceDeferred.promise);
                AuthService.getOrganizations('APP_VALINTAPERUSTEET').then(function (oidList) {
                    authServiceDeferred.resolve();
                    _.forEach(oidList, function (oid) {
                        var organizationDeferred = $q.defer();
                        promises.push(organizationDeferred.promise);
                        OrganizationByOid.get({oid: oid}, function (organization) {
                            model.organizations.push(organization);
                            organizationDeferred.resolve();
                        }, function (error) {
                            $log.error('Organisaation tietojen hakeminen epäonnistui:', error);
                            organizationDeferred.reject(error);
                        });
                    });

                }, function (error) {
                    $log.error('Käyttäjän organisaatiolistan hakeminen epäonnistui:', error);
                    authServiceDeferred.reject(error);
                });

                return promises;
            };
        };

        return model;
    }]);
