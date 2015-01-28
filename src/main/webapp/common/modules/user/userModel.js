angular.module('valintaperusteet')

    .factory('UserModel', ['$q', '$log', '_', 'MyRolesModel', 'AuthService', 'OrganizationByOid', 'OPH_ORG_OID', 'OrganizationChildOids', 'OrganizationParentOids', 'ValintaperusteRoles', 'RoleParser',
        function ($q, $log, _, MyRolesModel, AuthService, OrganizationByOid, OPH_ORG_OID, OrganizationChildOids, OrganizationParentOids, ValintaperusteRoles, RoleParser) {
        var model = new function () {
            this.organizationsDeferred = undefined;
            this.organizationChildrenDeferred = undefined;
            this.organizationParentDeferred = undefined;

            this.organizationOids = [];
            this.organizations = [];

            this.organizationChildren = []; //array of organizations that are children for users organizations
            this.organizationChildrenOids = [];

            this.organizationParents = [];
            this.organizationParentsOids = [];

            this.isKKUser = false;
            this.hasOtherThanKKUserOrgs = false;
            this.isOphUser = false;

            this.parsedRoles = [];

            this.refresh = function () {
                model.organizationsDeferred = $q.defer();
                model.organizationChildrenDeferred = $q.defer();
                model.organizationParentDeferred = $q.defer();

                MyRolesModel.then(function (myroles) {

                    model.parsedRoles = RoleParser.getParsedRoles(myroles, ValintaperusteRoles);


                    AuthService.getOrganizations('APP_VALINTAPERUSTEET').then(function (oidList) {
                        model.organizationOids = oidList;
                        var organizationPromises = [];

                        //Organizations for user
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

                            //Find child and parent organizations for the users organizations, if user isn't ophuser
                            if(!model.isOphUser) {


                                _.forEach(model.organizationOids, function (oid) {
                                    var childOidsDefer = $q.defer();

                                    //child organizations
                                    OrganizationChildOids.get({oid: oid}, function (childOids) {
                                        var childOidPromises = [];
                                        model.organizationChildrenOids = childOids.oids;
                                        _.forEach(childOids.oids, function (childOid) {
                                            var childOidDefer = $q.defer();
                                            childOidPromises.push(childOidDefer.promise);
                                            OrganizationByOid.get({oid: childOid}, function (childOrganization) {
                                                model.organizationChildren.push(childOrganization);
                                                childOidDefer.resolve();
                                            }, function (error) {
                                                $log.error('Organisaation tietojen hakeminen epäonnistui', error);
                                                parentOidDeferred.resolve();
                                                childOidDefer.resolve();
                                            });
                                        });

                                        $q.all(childOidPromises).then(function () {
                                            model.organizationChildrenDeferred.resolve();
                                        }, function (error) {
                                            $log.error('Lapsiorganisaatioiden tietojen hakeminen epäonnistui', error);
                                            model.organizationChildrenDeferred.reject();
                                        });

                                    }, function (error) {
                                        $log.error('Lapsiorganisaatioiden haku epäonnistui organisaatiolle:', oid, error);
                                        childOidsDefer.reject();
                                    });

                                    //Parent organizations
                                    var parentOids = _.uniq(_.flatten(_.map(model.organizations, function (organization) {
                                        if (_.has(organization, 'parentOidPath')) {
                                            return _.filter(organization.parentOidPath.split("|"), function (parentOid) {
                                                return parentOid !== OPH_ORG_OID && !_.isEmpty(parentOid);
                                            });
                                        } else {
                                            return [];
                                        }
                                    })));

                                    model.organizationParentsOids = parentOids;
                                    var parentOidsPromises = [];

                                    _.forEach(parentOids, function (parentOid) {
                                        var parentOidDefer = $q.defer();
                                        parentOidsPromises.push(parentOidDefer.promise);
                                        OrganizationByOid.get({oid: parentOid}, function (parentOrganization) {
                                            model.organizationParents.push(parentOrganization);

                                            parentOidDefer.resolve();
                                        }, function (error) {
                                            $log.error('Organisaation tietojen hakeminen epäonnistui', error);
                                            parentOidDeferred.resolve();
                                            parentOidDefer.resolve();
                                        });
                                    });

                                    $q.all(parentOidsPromises).then(function () {
                                        model.organizationParentDeferred.resolve();
                                    }, function (error) {
                                        $log.error(error);
                                        model.organizationParentDeferred.reject();
                                    });
                                });
                            }

                        }, function () {
                            model.organizationsDeferred.reject();
                        });

                    }, function (error) {
                        $log.error('Käyttäjän organisaatiolistan hakeminen epäonnistui:', error);
                        model.organizationsDeferred.reject(error);
                    });
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


        if($routeParams.id) {
            OrganisaatioUtility.getChildOrganizationsForValintaryhma($routeParams.id).then(function setValintaryhmaOrganizations(result) {
                $scope.valitunOrganisaationLapset = result;
            }, function (error) {
                $log.error('valintaryhmän/hakukohteen organisaatioiden haku epäonnistui', error);
            });
        } else if($routeParams.hakukohdeOid) {
            OrganisaatioUtility.getChildOrganizationsforHakukohde($routeParams.hakukohdeOid).then(function setHakukohdeOrganizations(result) {
                $scope.valitunOrganisaationLapset = result;
            }, function (error) {
                $log.error('valintaryhmän/hakukohteen organisaatioiden haku epäonnistui', error);
            });
        }

    }]);




