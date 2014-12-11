angular.module('valintaperusteet')

    .constant('READ', "_READ")
    .constant('UPDATE', "_READ_UPDATE")
    .constant('CRUD', "_CRUD")
    .constant('OPH_ORG_OID', "1.2.246.562.10.00000000001")

    .constant('ORGANISAATIO_URL_BASE', ORGANIZATION_SERVICE_URL_BASE + "rest/")





    .directive('auth', ['$routeParams', '$q', '$animate', '$timeout', '$log', 'AuthService', 'UserAccessLevels', 'UserModel',
        function ($routeParams, $q, $animate, $timeout, $log, AuthService, UserAccessLevels, UserModel) {
            return {
                priority: 1000,
                link: function ($scope, element, attrs) {
                    UserModel.refreshIfNeeded();
                    UserAccessLevels.refreshIfNeeded($routeParams.id, $routeParams.hakukohdeOid);

                    $scope.userAccess = UserAccessLevels;
                    $scope.userModel = UserModel;

                    $animate.addClass(element, 'ng-hide');

                    var promises = [];

                    promises.push(UserModel.organizationsDeferred.promise);
                    promises.push(UserAccessLevels.deferred.promise);

                    // Reveal element for oph-users and KK-users by default
                    $q.all(promises).then(function () {
                        if( UserAccessLevels.isOphUser() || (UserModel.isKKUser && UserAccessLevels.readApp) ) {
                            $animate.removeClass(element, 'ng-hide');
                        }

                    }, function (error) {
                        $log.error('Error revealing element:', error);
                    });
                }
            };
        }])

    .factory('AuthService', ['$q', '$http', '$timeout', 'MyRolesModel', 'READ', 'UPDATE', 'CRUD', 'OPH_ORG_OID',
        function ($q, $http, $timeout, MyRolesModel, READ, UPDATE, CRUD, OPH_ORG_OID) {
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

            var auth = (function () {
                "use strict";

                var instance = {};

                instance.organisaatiot = {};

                instance.readOrg = function (service, orgs) {
                    return accessCheck(service, orgs, readAccess);
                };

                instance.updateOrg = function (service, orgs) {
                    return accessCheck(service, orgs, updateAccess);
                };

                instance.crudOrg = function (service, orgs) {
                    return accessCheck(service, orgs, crudAccess);
                };

                instance.readOph = function (service) {
                    return ophAccessCheck(service, ophRead);
                };

                instance.updateOph = function (service) {
                    return ophAccessCheck(service, ophUpdate);
                };

                instance.crudOph = function (service) {
                    return ophAccessCheck(service, ophCrud);
                };

                instance.organizationsPromise = undefined;

                instance.getOrganizations = function (service) {
                    if (!instance.organizationsPromise) {
                        var deferred = $q.defer();
                        instance.organizationsPromise = deferred.promise;

                        instance.organisaatiot[service] = [];
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

                                if (org && instance.organisaatiot[service].indexOf(org) === -1) {

                                    instance.organisaatiot[service].push(org);
                                }
                            });

                            deferred.resolve(instance.organisaatiot[service]);
                        });
                    }

                    return instance.organizationsPromise;
                };
                return instance;
            })();

            return auth;
        }]);

