angular.module('valintaperusteet')

    .factory('UserModel', ['$q', '$log', '_', 'MyRolesModel', 'AuthService', 'OrganizationByOid', 'OPH_ORG_OID', function ($q, $log, _, MyRolesModel, AuthService, OrganizationByOid, OPH_ORG_OID) {
        var model = new function () {
            this.organizationsDeferred = undefined;

            this.organizationOids = [];
            this.organizations = [];
            this.isKKUser = false;
            this.hasOtherThanKKUserOrgs = false;
            this.isOphUser = false;

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
                        model.analyzeOrganizations();
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

            this.analyzeOrganizations = function () {
                model.isKKOrganization();
                _.some(model.organizations, function (organisaatioData) {
                    if(model.isOphOrganization(organisaatioData)) {
                        model.isOphUser = true;
                    } else if(model.isOtherThanKKOrganization(organisaatioData)) {
                        model.hasOtherThanKKUserOrgs = true;
                    }
                });
            };

            this.isKKOrganization = function () {
                MyRolesModel.then(function (myrolesModel) {
                    model.isKKUser = _.some(myrolesModel.myroles, function (role) {
                        return role.indexOf("APP_VALINTAPERUSTEETKK") > -1;
                    });
                }, function (error) {
                    $log.error('Käyttäjän roolien hakeminen korkeakoulukäyttöoikeuksien tarkistuksessa epäonnistui');
                });
            };

            this.isOphOrganization = function (organization) {
                return organization.oid === OPH_ORG_OID;
            };

            this.isOtherThanKKOrganization = function (organization) {
                return !(!organization.oppilaitosTyyppiUri ||
                    organization.oppilaitosTyyppiUri.indexOf('_41') > -1 ||
                    organization.oppilaitosTyyppiUri.indexOf('_42') > -1 ||
                    organization.oppilaitosTyyppiUri.indexOf('_43') > -1 );
            };


        };

        return model;
    }])


.controller('UserPageController', ['$scope', '$routeParams', '$log', 'UserAccessLevels', 'UserModel', 'OrganisaatioUtility',
        function ($scope, $routeParams, $log, UserAccessLevels, UserModel, OrganisaatioUtility) {
        $scope.userAccess = UserAccessLevels;
        UserAccessLevels.refreshIfNeeded($routeParams.id, $routeParams.hakukohdeOid);

        $scope.userModel = UserModel;
        UserModel.refreshIfNeeded();

        $scope.organisaatioUtility = OrganisaatioUtility;
        if($routeParams.id) {
            $scope.isValintaryhma = true;
        } else if($routeParams.hakukohdeOid) {
            $scope.isHakukohde = true;
        }
        
        OrganisaatioUtility.getOrganizations(false, $routeParams.id, $routeParams.hakukohdeOid).then(function (result) {
            $scope.vrhkOrgs = result;
        }, function (error) {
            $log.error('valintaryhmän/hakukohteen organisaatioiden haku epäonnistui', error);
        });

    }]);




