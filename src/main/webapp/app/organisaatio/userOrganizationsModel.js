
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
                        authServiceDeferred.resolve();
                    }, function () {
                        authServiceDeferred.reject();
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
            
            this.userHasKKOrganizations = function () {
                $q.all(model.promises).then(function () {
                    var hasKK = false;
                    var korkeakouluTunnisteet = ['_41', '_42', '_43']; // 41 == AMK, 42 = Yliopistot, 43 = Sotilaskorkeakoulut
                    _.some(model.organizations, function (organisaatioData) {
                        _.some(korkeakouluTunnisteet, function (item) {
                            if(organisaatioData.oppilaitosTyyppiUri) {
                                if (organisaatioData.oppilaitosTyyppiUri.indexOf(item) !== -1) {
                                    hasKK = true;
                                    return true;
                                }
                            }
                        });
                        return hasKK;
                    });

                    return hasKK;
                });
            };

            this.userHasOtherThanKKOrganizations = function () {
                $q.all(model.promises).then(function () {
                    var otherThanKKOrganizations = false;
                    var korkeakouluTunnisteet = ['_41', '_42', '_43']; // 41 == AMK, 42 = Yliopistot, 43 = Sotilaskorkeakoulut
                    _.some(model.organizations, function (organisaatioData) {
                        _.some(korkeakouluTunnisteet, function (item) {
                            if(organisaatioData.oppilaitosTyyppiUri) {
                                if (organisaatioData.oppilaitosTyyppiUri.indexOf(item) === -1) {
                                    otherThanKKOrganizations = true;
                                    return true;
                                }
                            }
                        });
                        return otherThanKKOrganizations;
                    });

                    return otherThanKKOrganizations;
                });
            }


        };

        return model;
    }]);
