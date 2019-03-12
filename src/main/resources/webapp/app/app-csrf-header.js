'use strict';

var modules = ['valintaperusteet'];

modules.forEach(function(module) {
   angular.module(module)
       .factory('csrfHeaderInterceptor', ['$cookies', function ($cookies) {
           return {
               request: function (config) {
                   config.headers['clientSubSystemCode'] = "valintaperusteet.valintaperusteet-ui.frontend";

                   var csrfToken = $cookies['CSRF'];
                   if (csrfToken) {
                       config.headers['CSRF'] = csrfToken;
                       console.debug("CSRF header '%s' set", csrfToken);
                   }

                   return config;
               }
           }
       }])
       .config(['$httpProvider', function ($httpProvider) {
           $httpProvider.interceptors.push('csrfHeaderInterceptor');
       }])
});