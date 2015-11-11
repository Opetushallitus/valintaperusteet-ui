'use strict';
angular.module('valintaperusteet')
    .factory('UserModel', ['$q', '$log', '_', 'MyRolesModel', 'AuthService', 'OrganizationByOid', 'OPH_ORG_OID', 'OrganizationChildOids', 'OrganizationParentOids',
        function ($q, $log, _, MyRolesModel, AuthService, OrganizationByOid, OPH_ORG_OID, OrganizationChildOids, OrganizationParentOids) {
            var model = new function () {
                this.organizationsDeferred = undefined;

                this.organizationOids = [];
                this.organizations = [];

                this.organizationChildren = []; //array of organizations that are children for users organizations
                this.organizationChildrenOids = [];

                this.organizationParents = [];
                this.organizationParentsOids = [];

                this.isKKUser = false;
                this.hasOtherThanKKUserOrgs = false;
                this.isOphUser = false;

                this.refresh = function () {
                    model.organizationsDeferred = $q.defer();

                    MyRolesModel.then(function (myroles) {
                        AuthService.getOrganizations('APP_VALINTAPERUSTEET').then(function (oidList) {
                            model.organizationOids = oidList;

                            function resolveList(list, fn) {
                                var promises = list.map(function (o) {
                                    var deferred = $q.defer();
                                    fn(o, deferred);
                                    return deferred.promise;
                                });
                                return $q.all(promises)
                            }

                            function transferResolveReject(a, b) {
                                a.then(function () {
                                    b.resolve()
                                }, function (error) {
                                    b.reject(error)
                                })
                            }

                            function fetchOrganization(oid, list) {
                                console.log("fetchOrganization", oid)
                                return OrganizationByOid.get({oid: oid}, function (organization) {
                                    list.push(organization);
                                }, function (error) {
                                    $log.error('Organisaation tietojen hakeminen epäonnistui', error);
                                }).$promise
                            }

                            //child organizations
                            function fetchChildOrganizations(oid) {
                                console.log("fetchChildOrganizations", oid)
                                var d = $q.defer();
                                OrganizationChildOids.get({oid: oid}, function (childOids) {
                                    console.log("fetchChildOrganizations","OrganizationChildOids", childOids.oids)
                                    var childPromises = resolveList(childOids.oids, function (childOid, deferred) {
                                        if (model.organizationChildrenOids.indexOf(childOid) === -1) {
                                            model.organizationChildrenOids.push(childOid);
                                            console.log("fetchChildOrganizations","resolveList", childOid)
                                            transferResolveReject($q.all([fetchOrganization(childOid, model.organizationChildren), fetchChildOrganizations(childOid)]), deferred)
                                        } else {
                                            deferred.resolve()
                                        }
                                    });
                                    transferResolveReject(childPromises, d)
                                }, function (error) {
                                    $log.error('Lapsiorganisaatioiden haku epäonnistui organisaatiolle:', oid, error);
                                    d.reject(error);
                                });
                                return d;
                            }

                            // Parent organizations
                            function parseParentOids(organization) {
                                if (_.has(organization, 'parentOidPath')) {
                                    return organization.parentOidPath.split("|").filter(function (parentOid) {
                                        return parentOid !== OPH_ORG_OID && !_.isEmpty(parentOid);
                                    })
                                } else {
                                    return [];
                                }
                            }

                            function fetchParentOrganizations(parentOids) {
                                console.log("fetchParentOrganizations", parentOids)
                                return resolveList(parentOids, function (parentOid, deferred) {
                                    if (model.organizationParentsOids.indexOf(parentOid) === -1) {
                                        model.organizationParentsOids.push(parentOid);
                                        console.log("fetchParentOrganizations","resolveList", parentOid)
                                        fetchOrganization(parentOid, model.organizationParents).then(function (parentOrganization) {
                                            transferResolveReject(fetchParentOrganizations(parseParentOids(parentOrganization)), deferred)
                                        });
                                    } else {
                                        deferred.resolve();
                                    }
                                })
                            }

                            //Organizations for user
                            resolveList(model.organizationOids, function (oid, deferred) {
                                OrganizationByOid.get({oid: oid}, function (organization) {
                                    model.organizations.push(organization);
                                    deferred.resolve();
                                }, function (error) {
                                    $log.error('Organisaation tietojen hakeminen epäonnistui:', error);
                                    deferred.reject(error);
                                });
                            }).then(function () {
                                model.analyzeOrganizations();

                                //Find child and parent organizations for the users organizations, if user isn't ophuser
                                if (model.isOphUser) {
                                    model.organizationsDeferred.resolve();
                                } else {
                                    var parentResolve = resolveList(model.organizations, function (organization, deferred) {
                                        transferResolveReject(fetchParentOrganizations(parseParentOids(organization)), deferred)
                                    });
                                    var childResolve = model.organizationOids.map(function (oid) {
                                        return fetchChildOrganizations(oid)
                                    });
                                    transferResolveReject($q.all([parentResolve, childResolve]), model.organizationsDeferred)
                                }
                            }, function (error) {
                                model.organizationsDeferred.reject(error);
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
                        if (model.isOphOrganization(organisaatioData)) {
                            model.isOphUser = true;
                        } else if (model.isOtherThanKKOrganization(organisaatioData)) {
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






