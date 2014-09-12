//var VALINTAPERUSTEET = "APP_VALINTAPERUSTEET";
//var VALINTOJENTOTEUTTAMIEN = "APP_VALINTOJENTOTEUTTAMINEN";
//var SIJOITTELU = "APP_SIJOITTELU";

var READ = "_READ";
var UPDATE = "_READ_UPDATE";
var CRUD = "_CRUD";
var OPH_ORG = "1.2.246.562.10.00000000001";
var ORGANISAATIO_URL_BASE = ORGANIZATION_SERVICE_URL_BASE + "rest/";
var CAS_URL = CAS_URL || "/cas/myroles";

app.factory('MyRolesModel', function ($q, $http) {
    var deferred = $q.defer();

    var factory = (function () {
        var instance = {};
        instance.myroles = [];

        $http.get(CAS_URL).success(function (result) {
            instance.myroles = result;
            deferred.resolve(instance);
        });

        return instance;
    })();


    return deferred.promise;

});


app.factory('AuthService', function ($q, $http, $timeout, MyRolesModel) {
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
                    orgs.forEach(function(orgOid) {
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
    }

    // OPH check -- voidaan ohittaa organisaatioiden haku
    var ophRead = function (service, model) {
        return (model.myroles.indexOf(service + READ + "_" + OPH_ORG) > -1
            || model.myroles.indexOf(service + UPDATE + "_" + OPH_ORG) > -1
            || model.myroles.indexOf(service + CRUD + "_" + OPH_ORG) > -1);

    }

    var ophUpdate = function (service, model) {
        return (model.myroles.indexOf(service + UPDATE + "_" + OPH_ORG) > -1
            || model.myroles.indexOf(service + CRUD + "_" + OPH_ORG) > -1);
    }

    var ophCrud = function (service, model) {
        return (model.myroles.indexOf(service + CRUD + "_" + OPH_ORG) > -1);
    }

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
    }

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

        instance.getOrganizations = function (service) {
            var deferred = $q.defer();
            instance.organisaatiot[service] = [];
            MyRolesModel.then(function (model) {
                model.myroles.forEach(function (role) {
                    // TODO: refaktor
                    var org;
                    if (role.indexOf(service + "_CRUD_") > -1) {
                        org = role.replace(service + "_CRUD_", '');
                    } else if (role.indexOf(service + "_READ_UPDATE_") > -1) {
                        org = role.replace(service + "_READ_UPDATE_", '');
                    } else if (role.indexOf(service + "_READ_UPDATE") == -1 && role.indexOf(service + "_READ_") > -1) {
                        org = role.replace(service + "_READ_", '');
                    }

                    if (org && instance.organisaatiot[service].indexOf(org) == -1) {

                        instance.organisaatiot[service].push(org);
                    }
                });

                deferred.resolve(instance.organisaatiot[service]);
            });
            return deferred.promise;
        };
        return instance;
    })();

    return auth;
});

app.directive('accessLevel', ['$q', '$timeout', '$log', 'UserAccessLevels', 'UserOrganizationsModel', 'ValintaryhmaModel', function ($q, $timeout, $log, UserAccessLevels, UserOrganizationsModel, ValintaryhmaModel) {
    return {
        priority: -1000,
        link: function ($scope, element, attrs) {

            element.attr('disabled', 'true');

            UserOrganizationsModel.refreshIfNeeded();
            var userOrganizationPromises = UserOrganizationsModel.promises;

            UserAccessLevels.deferred.promise.then(function () {
                var accessLevel = attrs.accessLevel;
                if(UserAccessLevels.isOphUser()) {

                    if (accessLevel === 'crud' && UserAccessLevels.hasCrudRights()) {
                        element.removeAttr('disabled');
                    }

                    if (accessLevel === 'update' && UserAccessLevels.hasUpdateRights()) {
                        element.removeAttr('disabled');
                    }

                } else {


                    /*
                     $q.all(UserOrganizationsModel.promises).then(function () {
                         ValintaryhmaModel.loaded.promise.then(function () {
                             $scope.disableChanges = false;
                             var valintaryhmaOrganisaatioOids = $scope.model.getValintaryhmaOrganisaatioOids();
                             var disable = _.every(UserOrganizationsModel.organizationOids, function (item) {
        
                             });
        
        
        
                             _.forEach(UserOrganizationsModel.organizationOids, function (item) {
                             if(_.contains(valintaryhmaOrganisaatioOids, item)) {
        
                             }
                             });
    
                         });
                     });


                     $q.all(userOrganizationPromises).then(function () {
                     var userOrganizationOids = UserOrganizationsModel.organizationOids;
                     ValintaryhmaModel.loaded.promise.then(function () {
                     var valintaryhmaOrganizations = ValintaryhmaModel.valintaryhma;
                     console.log(UserOrganizationsModel.organizations);
                     console.log('userOrganizationoids', userOrganizationOids);
                     console.log('valintaryhmaOrganizations', valintaryhmaOrganizations);
                     });
                     });
                     */
                }






            }, function (error) {
                $log.error("Käyttäjän oikeustasojen selvittäminen ei onnistu", error);
            });
        }
    };
}]);

app.directive('auth', function ($q, $animate, $routeParams, $timeout, AuthService, ValintaryhmaModel, HakukohdeModel) {
    return {
        priority: -1000,
        link: function ($scope, element, attrs) {

            $animate.addClass(element, 'ng-hide');

            var success = function () {
                $animate.removeClass(element, 'ng-hide');
            }

            $timeout(function () {
                $animate.addClass(element, 'ng-hide');
                var defer = $q.defer();
                var orgs = [];
                if ($routeParams.id) {
                    ValintaryhmaModel.refreshIfNeeded($routeParams.id);
                    ValintaryhmaModel.loaded.promise.then(function () {
                        "use strict";
                        if (ValintaryhmaModel.valintaryhma.organisaatiot) {
                            ValintaryhmaModel.valintaryhma.organisaatiot.forEach(function (org) {
                                orgs.push(org.oid);
                            });
                        }

                        defer.resolve(orgs);
                    });

                } else if ($routeParams.hakukohdeOid) {
                    HakukohdeModel.refreshIfNeeded($routeParams.hakukohdeOid);
                    HakukohdeModel.loaded.promise.then(function () {
                        "use strict";
                        orgs.push(HakukohdeModel.hakukohde.tarjoajaOid);

                        defer.resolve(orgs);
                    });
                } else {
                    defer.resolve(orgs);
                }

                defer.promise.then(function (orgs) {
                    switch (attrs.auth) {

                        case "crudOph":
                            AuthService.crudOph("APP_VALINTAPERUSTEET").then(success);
                            break;

                        case "updateOph":
                            AuthService.updateOph("APP_VALINTAPERUSTEET").then(success);
                            break;

                        case "readOph":
                            AuthService.readOph("APP_VALINTAPERUSTEET").then(success);
                            break;

                        case "crud":
                            AuthService.crudOrg("APP_VALINTAPERUSTEET", orgs).then(success);
                            break;

                        case "update":
                            AuthService.updateOrg("APP_VALINTAPERUSTEET", orgs).then(success);
                            break;

                        case "read":
                            AuthService.readOrg("APP_VALINTAPERUSTEET", orgs).then(success);
                            break;

                    }
                });
            }, 0);

        }
    };
});
