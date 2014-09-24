angular.module('valintaperusteet')

    .factory('UserModel', ['$q', '$log', '_', 'AuthService', 'OrganizationByOid', function ($q, $log, _, AuthService, OrganizationByOid) {
        var model = new function () {
            this.organizationsDeferred = undefined;

            this.organizationOids = [];
            this.organizations = [];
            this.isKKUser = false;
            this.hasOtherThanKKUserOrgs = false;

            this.refresh = function () {
                model.organizationsDeferred = $q.defer();

                AuthService.getOrganizations('APP_VALINTAPERUSTEET').then(function (oidList) {
                    model.organizationOids = oidList;

                    var organizationPromises = [];
                    _.forEach(oidList, function (oid) {
                        var deferred = $q.defer();
                        organizationPromises.push(deferred.promise);
                        OrganizationByOid.get({oid: oid}, function (organization) {
                            model.organizations.push(organization);
                            deferred.resolve();
                        }, function (error) {
                            $log.error('Organisaation tietojen hakeminen epäonnistui:', error);
                            deferred.reject(error);
                        });
                    });

                    $q.all(organizationPromises).then(function () {
                        model.organizationsDeferred.resolve();
                        model.userHasKKOrganizations();
                        model.userHasOtherThanKKOrganizations();
                    }, function () {
                        model.organizationsDeferred.reject();
                    });

                }, function (error) {
                    $log.error('Käyttäjän organisaatiolistan hakeminen epäonnistui:', error);
                    model.organizationsDeferred.reject(error);
                });

                return model.organizationsDeferred.promise;
            };

            this.refreshIfNeeded = function () {
                if (_.isEmpty(model.organizationsDeferred)) {
                    model.refresh();
                } else {
                    return model.organizationsDeferred.promise;
                }
            };

            this.userHasKKOrganizations = function () {
                var isKKUser = false;
                var korkeakouluTunnisteet = ['_41', '_42', '_43']; // 41 == AMK, 42 = Yliopistot, 43 = Sotilaskorkeakoulut
                _.some(model.organizations, function (organisaatioData) {
                    _.some(korkeakouluTunnisteet, function (item) {
                        if (organisaatioData.oppilaitosTyyppiUri) {
                            if (organisaatioData.oppilaitosTyyppiUri.indexOf(item) !== -1) {
                                isKKUser = true;
                                return true;
                            }
                        }
                    });
                    return isKKUser;
                });

                model.isKKUser = isKKUser;
            };

            this.userHasOtherThanKKOrganizations = function () {
                var isOtherThanKKUser = false;
                var korkeakouluTunnisteet = ['_41', '_42', '_43']; // 41 == AMK, 42 = Yliopistot, 43 = Sotilaskorkeakoulut
                _.some(model.organizations, function (organisaatioData) {
                    _.some(korkeakouluTunnisteet, function (item) {
                        if (organisaatioData.oppilaitosTyyppiUri) {
                            if (organisaatioData.oppilaitosTyyppiUri.indexOf(item) === -1) {
                                isOtherThanKKUser = true;
                                return true;
                            }
                        }
                    });
                    return isOtherThanKKUser;
                });

                model.hasOtherThanKKUserOrgs = isOtherThanKKUser;
            };


        };

        return model;
    }]);
