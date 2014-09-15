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

//        instance.myroles = ["USER_tampere", "VIRKAILIJA", "LANG_fi", "APP_KOODISTO", "APP_KOODISTO_READ", "APP_KOODISTO_READ_1.2.246.562.10.727160772010", "APP_ORGANISAATIOHALLINTA", "APP_ORGANISAATIOHALLINTA_RYHMA", "APP_ORGANISAATIOHALLINTA_RYHMA_1.2.246.562.10.727160772010", "APP_HAKUJENHALLINTA", "APP_HAKUJENHALLINTA_CRUD", "APP_HAKUJENHALLINTA_CRUD_1.2.246.562.10.727160772010", "APP_SIJOITTELU", "APP_SIJOITTELU_READ", "APP_SIJOITTELU_READ_1.2.246.562.10.727160772010", "APP_ORGANISAATIOHALLINTA", "APP_ORGANISAATIOHALLINTA_CRUD", "APP_ORGANISAATIOHALLINTA_CRUD_1.2.246.562.10.727160772010", "APP_HENKILONHALLINTA", "APP_HENKILONHALLINTA_KKVASTUU", "APP_HENKILONHALLINTA_KKVASTUU_1.2.246.562.10.727160772010", "APP_OID", "APP_OID_CRUD", "APP_OID_CRUD_1.2.246.562.10.727160772010", "APP_OMATTIEDOT", "APP_OMATTIEDOT_CRUD", "APP_OMATTIEDOT_CRUD_1.2.246.562.10.727160772010", "APP_VALINTAPERUSTEKUVAUSTENHALLINTA_KK", "APP_VALINTAPERUSTEKUVAUSTENHALLINTA_KK_CRUD", "APP_VALINTAPERUSTEKUVAUSTENHALLINTA_KK_CRUD_1.2.246.562.10.727160772010", "APP_VALINTOJENTOTEUTTAMINEN", "APP_VALINTOJENTOTEUTTAMINEN_READ", "APP_VALINTOJENTOTEUTTAMINEN_READ_1.2.246.562.10.727160772010", "APP_TARJONTA", "APP_TARJONTA_CRUD", "APP_TARJONTA_CRUD_1.2.246.562.10.727160772010", "APP_VALINTAPERUSTEET", "APP_VALINTAPERUSTEET_CRUD", "APP_VALINTAPERUSTEET_CRUD_1.2.246.562.10.727160772010", "APP_HAKEMUS", "APP_HAKEMUS_READ", "APP_HAKEMUS_READ_1.2.246.562.10.727160772010", "APP_TARJONTA_KK", "APP_TARJONTA_KK_CRUD", "APP_TARJONTA_KK_CRUD_1.2.246.562.10.727160772010", "APP_VALINTAPERUSTEKUVAUSTENHALLINTA", "APP_VALINTAPERUSTEKUVAUSTENHALLINTA_CRUD", "APP_VALINTAPERUSTEKUVAUSTENHALLINTA_CRUD_1.2.246.562.10.727160772010"];
//        deferred.resolve(instance);
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
