angular.module('valintaperusteet')

    .service('AuthService', ['$q', '$http', '$timeout', 'MyRolesModel', 'READ', 'UPDATE', 'CRUD', 'OPH_ORG_OID', 'RoleParser', 'ValintaperusteApps',
        function ($q, $http, $timeout, MyRolesModel, READ, UPDATE, CRUD, OPH_ORG_OID, RoleParser, ValintaperusteApps) {

            var api = this;

            // organisation check
            var readAccess = function (service, org, model) {

                if (model.myroles.indexOf(service + READ + (org ? "_" + org : "")) > -1 ||
                    model.myroles.indexOf(service + UPDATE + (org ? "_" + org : "")) > -1 ||
                    model.myroles.indexOf(service + CRUD + (org ? "_" + org : "")) > -1) {
                    return true;
                }
            };

            var updateAccess = function (service, org, model) {
                if (model.myroles.indexOf(service + UPDATE + (org ? "_" + org : "")) > -1 ||
                    model.myroles.indexOf(service + CRUD + (org ? "_" + org : "")) > -1) {
                    return true;
                }
            };

            var crudAccess = function (service, org, model) {
                if (model.myroles.indexOf(service + CRUD + (org ? "_" + org : "")) > -1) {
                    return true;
                }
            };

            var accessCheck = function (service, orgs, accessFunction) {
                var deferred = $q.defer();
                MyRolesModel.then(function (model) {
                    if (orgs && orgs.length > 0) {
                        orgs.forEach(function (orgOid) {
                            $http.get(ORGANISAATIO_URL_BASE + "organisaatio/" + orgOid + "/parentoids", { cache: true}).success(function (result) {
                                var found = false;
                                result.split("/").forEach(function (org) {
                                    if (accessFunction(service, org, model)) {
                                        found = true;
                                    }
                                });
                                if (found) {
                                    deferred.resolve();
                                } else {
                                    deferred.reject();
                                }
                            });
                        });
                    } else {
                        if (accessFunction(service, "", model)) {
                            deferred.resolve();
                        } else {
                            deferred.reject();
                        }
                    }
                });

                return deferred.promise;
            };

            // OPH check -- voidaan ohittaa organisaatioiden haku
            var ophRead = function (service, model) {
                return (model.myroles.indexOf(service + READ + "_" + OPH_ORG_OID) > -1
                || model.myroles.indexOf(service + UPDATE + "_" + OPH_ORG_OID) > -1
                || model.myroles.indexOf(service + CRUD + "_" + OPH_ORG_OID) > -1);

            };

            var ophUpdate = function (service, model) {
                return (model.myroles.indexOf(service + UPDATE + "_" + OPH_ORG_OID) > -1
                || model.myroles.indexOf(service + CRUD + "_" + OPH_ORG_OID) > -1);
            };

            var ophCrud = function (service, model) {
                return (model.myroles.indexOf(service + CRUD + "_" + OPH_ORG_OID) > -1);
            };

            var ophAccessCheck = function (service, accessFunction) {
                var deferred = $q.defer();

                MyRolesModel.then(function (model) {
                    if (accessFunction(service, model)) {
                        deferred.resolve();
                    } else {
                        deferred.reject();
                    }
                });

                return deferred.promise;
            };


            this.organisaatiot = {};

            this.readOrg = function (service, orgs) {
                return accessCheck(service, orgs, readAccess);
            };

            this.updateOrg = function (service, orgs) {
                return accessCheck(service, orgs, updateAccess);
            };

            this.crudOrg = function (service, orgs) {
                return accessCheck(service, orgs, crudAccess);
            };

            this.readOph = function (service) {
                return ophAccessCheck(service, ophRead);
            };

            this.updateOph = function (service) {
                return ophAccessCheck(service, ophUpdate);
            };

            this.crudOph = function (service) {
                return ophAccessCheck(service, ophCrud);
            };

            this.organizationsPromise = undefined;

            this.getOrganizations = function (service) {
                if (!api.organizationsPromise) {
                    var deferred = $q.defer();
                    api.organizationsPromise = deferred.promise;

                    api.organisaatiot[service] = [];
                    MyRolesModel.then(function (model) {
                        model.myroles.forEach(function (role) {
                            // TODO: refaktor
                            var org;
                            if (role.indexOf(service + "_CRUD_") > -1) {
                                org = role.replace(service + "_CRUD_", '');
                            } else if (role.indexOf(service + "_READ_UPDATE_") > -1) {
                                org = role.replace(service + "_READ_UPDATE_", '');
                            } else if (role.indexOf(service + "_READ_UPDATE") === -1 && role.indexOf(service + "_READ_") > -1) {
                                org = role.replace(service + "_READ_", '');
                            }

                            if (org && api.organisaatiot[service].indexOf(org) === -1) {

                                api.organisaatiot[service].push(org);
                            }
                        });

                        deferred.resolve(api.organisaatiot[service]);
                    });
                }

                return api.organizationsPromise;
            };

        }]);

