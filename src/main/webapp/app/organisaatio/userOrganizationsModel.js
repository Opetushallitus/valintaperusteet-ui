
angular.module('valintaperusteet')

    .factory('UserOrganizationsModel', ['$q', '$log', '_', 'AuthService', 'OrganizationByOid', function ($q, $log, _, AuthService, OrganizationByOid) {
        var model = new function() {
            this.promises = [];
            this.organizationOids = [];
            this.organizations = [];

            this.refresh = function () {
                var authServiceDeferred = $q.defer();
                model.promises.push(authServiceDeferred.promise);
                AuthService.getOrganizations('APP_VALINTAPERUSTEET').then(function (oidList) {
                    model.organizationOids = oidList;
                    authServiceDeferred.resolve();
                    _.forEach(oidList, function (oid) {
                        var organizationDeferred = $q.defer();
                        model.promises.push(organizationDeferred.promise);
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
            };

            this.refreshIfNeeded = function () {
                if(_.isEmpty(model.organizations)) {
                    model.refresh();
                }
            };



        };

        return model;
    }]);
