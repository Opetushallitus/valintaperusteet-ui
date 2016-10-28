"use strict";

var app = angular.module('valintaperusteet', ['ngResource', 'ngCookies', 'loading', 'ngRoute',
    'ui.bootstrap', 'lodash', 'ng-breadcrumbs', 'oph-roles', 'oph.localisation', 'oph.utils', 'angular-cache'])

    .run(function ($http, LocalisationService, CacheFactory) {
        $http.get(window.url("valintaperusteet-service.buildversion"));
        LocalisationService.getTranslation("");

        $http.defaults.cache = CacheFactory('defaultCache', {
            maxAge: 30 * 60 * 1000, // 30 minuutin kakku
            cacheFlushInterval: 60 * 60 * 1000, // Tunnin välein flush
            deleteOnExpire: 'aggressive'
        });
    })

    .run(function($http, $cookies) {
        $http.defaults.headers.common['clientSubSystemCode'] = "valintaperusteet.valintaperusteet-ui.frontend";
        if($cookies['CSRF']) {
            $http.defaults.headers.common['CSRF'] = $cookies['CSRF'];
        }
    })

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

if (window.mocksOn) {
    angular.module('valintaperusteet').requires.push('e2e-mocks');
}


angular.module('valintaperusteet')
    .controller('mainCtrl', ['$scope', '$routeParams', 'breadcrumbs', 'UserAccessLevels', 'UserModel',
        function ($scope, $routeParams, breadcrumbs, UserAccessLevels, UserModel) {

            $scope.breadcrumbs = breadcrumbs;
            UserAccessLevels.refreshIfNeeded($routeParams.id, $routeParams.hakukohdeOid);
            UserModel.refreshIfNeeded();

        }]);

var TEMPLATE_URL_BASE = TEMPLATE_URL_BASE || "";

