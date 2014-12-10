"use strict";

var app = angular.module('valintaperusteet', ['ngResource', 'ngCookies', 'loading', 'ngRoute',
    'ui.bootstrap', 'lodash', 'ng-breadcrumbs', 'oph.localisation', 'oph.utils'])

    .run(function ($http, LocalisationService) {
        $http.get(SERVICE_URL_BASE + "buildversion.txt?auth");
        LocalisationService.getTranslation("");
    })


    .controller('mainCtrl', ['$scope', '$routeParams', 'breadcrumbs', 'UserAccessLevels', 'UserModel',
        function ($scope, $routeParams, breadcrumbs, UserAccessLevels, UserModel) {

            $scope.breadcrumbs = breadcrumbs;
            UserAccessLevels.refreshIfNeeded($routeParams.id, $routeParams.hakukohdeOid);
            UserModel.refreshIfNeeded();

        }])

    .controller('RootCtrl', ['$rootScope', '$scope' ,'LocalisationService', 'breadcrumbs',
        function($rootScope, $scope, LocalisationService, breadcrumbs) {
        $scope.breadcrumbs = breadcrumbs;

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



angular.module('lodash', [])

.factory('_', function () {
    return window._; // assumes lodash has already been loaded on the page
});

var SERVICE_URL_BASE = SERVICE_URL_BASE || "";
var TEMPLATE_URL_BASE = TEMPLATE_URL_BASE || "";
var KOODISTO_URL_BASE = KOODISTO_URL_BASE || "";
var ORGANIZATION_SERVICE_URL_BASE = ORGANIZATION_SERVICE_URL_BASE || "/organisaatio-service/";
var LOKALISOINTIPALVELU_URL_BASE = LOKALISOINTIPALVELU_URL_BASE || "";
var TARJONTA_URL_BASE = TARJONTA_URL_BASE || "";
var VALINTALASKENTAKOOSTE_URL_BASE = VALINTALASKENTAKOOSTE_URL_BASE || "";
var LOCALISATION_URL_BASE = LOCALISATION_URL_BASE || "";
var HAKEMUS_URL_BASE = HAKEMUS_URL_BASE || "";


