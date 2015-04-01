"use strict";

var app = angular.module('valintaperusteet', ['ngResource', 'ngCookies', 'loading', 'ngRoute',
    'ui.bootstrap', 'lodash', 'ng-breadcrumbs', 'oph-roles', 'oph.localisation', 'oph.utils', 'angular-cache'])

    .run(function ($http, LocalisationService, CacheFactory) {
        $http.get(SERVICE_URL_BASE + "buildversion.txt?auth");
        LocalisationService.getTranslation("");

        $http.defaults.cache = CacheFactory('defaultCache', {
            maxAge: 30 * 60 * 1000, // 30 minuutin kakku
            cacheFlushInterval: 60 * 60 * 1000, // Tunnin välein flush
            deleteOnExpire: 'aggressive'
        });
    })

    .constant('CAS_URL', CAS_URL || "/cas/myroles")

    // Applications in myroles this module uses
    .constant('ValintaperusteApps', ['APP_VALINTAPERUSTEET', 'APP_VALINTAPERUSTEETKK'])

    .controller('mainCtrl', ['$scope', '$routeParams', '$log', 'breadcrumbs', 'UserAccessLevels', 'UserModel', 'AuthenticationServices', 'MyRolesModel',
        function ($scope, $routeParams, $log, breadcrumbs, UserAccessLevels, UserModel, AuthenticationServices, MyRolesModel) {



        }])

    .controller('RootCtrl', ['$rootScope', '$scope', '$routeParams','LocalisationService', 'breadcrumbs', 'MyRolesModel', 'UserAccessLevels', 'UserModel', 'RoleService', 'ValintaperusteApps',
        function($rootScope, $scope, $routeParams, LocalisationService, breadcrumbs, MyRolesModel, UserAccessLevels, UserModel, RoleService, ValintaperusteApps) {
        $scope.breadcrumbs = breadcrumbs;

            MyRolesModel.then(function (roles) {
                RoleService.parseRoles(roles, ValintaperusteApps);
                UserAccessLevels.refreshIfNeeded($routeParams.id, $routeParams.hakukohdeOid);
                UserModel.refreshIfNeeded();
            }, function (error) {
                $log.error('Fetching Myroles from cas failed:', error);
            });

        /**
         * katsotaan käyttäjän käyttöprofiilista cas/myroles tiedostosta
         * hänen palveluun määrittämä käyttökieli
         */
        LocalisationService.getUserLang().then(function(data){
            $scope.userLang = data;
        });
        /**
         * Astetaan käännösteksti valitulla avaimelle
         * @param key
         * @returns {*}
         */
        $scope.t = function(key) {
            return LocalisationService.tl(key);
        };
    }]);



angular.module('valintaperusteet')
    .controller('mainCtrl', ['$scope', '$routeParams', 'breadcrumbs', 'UserAccessLevels', 'UserModel',
        function ($scope, $routeParams, breadcrumbs, UserAccessLevels, UserModel) {

            $scope.breadcrumbs = breadcrumbs;
            UserAccessLevels.refreshIfNeeded($routeParams.id, $routeParams.hakukohdeOid);
            UserModel.refreshIfNeeded();

        }]);



var SERVICE_URL_BASE = SERVICE_URL_BASE || "";
var TEMPLATE_URL_BASE = TEMPLATE_URL_BASE || "";
var KOODISTO_URL_BASE = KOODISTO_URL_BASE || "";
var ORGANIZATION_SERVICE_URL_BASE = ORGANIZATION_SERVICE_URL_BASE || "/organisaatio-service/";
var LOKALISOINTIPALVELU_URL_BASE = LOKALISOINTIPALVELU_URL_BASE || "";
var TARJONTA_URL_BASE = TARJONTA_URL_BASE || "";
var VALINTALASKENTAKOOSTE_URL_BASE = VALINTALASKENTAKOOSTE_URL_BASE || "";
var VALINTALASKENTA_URL_BASE = VALINTALASKENTA_URL_BASE || "";
var LOCALISATION_URL_BASE = LOCALISATION_URL_BASE || "";
var HAKEMUS_URL_BASE = HAKEMUS_URL_BASE || "";
var CAS_URL = CAS_URL || "/cas/myroles";
var AUTHENTICATION_URL_BASE = AUTHENTICATION_URL_BASE;
var ORGANISAATIO_URL_BASE = ORGANIZATION_SERVICE_URL_BASE + "rest/";

