angular.module('valintaperusteet')

    .constant('KaavaVirheTyypit', {
        JUURIPUUTTUVANIMETTYFUNKTIOARGUMENTTI: 'JUURIPUUTTUVANIMETTYFUNKTIOARGUMENTTI',
        PUUTTUVAPAKOLLINENFUNKTIOARGUMENTTI: 'PUUTTUVAPAKOLLINENFUNKTIOARGUMENTTI',
        PUUTTUVANIMETTYFUNKTIOARGUMENTTI: 'PUUTTUVANIMETTYFUNKTIOARGUMENTTI',
        PUUTTUVATALLENNATULOS: 'PUUTTUVATALLENNATULOS',
        SYOTEPARAMETRI: 'SYOTEPARAMETRI',
        PUUTTUVAARVOKONVERTTERI: 'PUUTTUVAARVOKONVERTTERI',
        PKPARITONMAARAFUNKIOARGUMENTTEJA: 'PKPARITONMAARAFUNKIOARGUMENTTEJA',
        PKLIIANVAHANFUNKTIOARGUMENTTEJA: 'PKLIIANVAHANFUNKTIOARGUMENTTEJA',
        PKPUUTTUVAFUNKTIOARGUMENTTI: 'PKPUUTTUVAFUNKTIOARGUMENTTI',
        TAUSTAPALVELU: 'TAUSTAPALVELU'
    })

    .factory('ErrorService', ['_', function(_) {
        'use strict';
        var model = new function () {
            this.errors = [];

            this.clearErrors = function () {
                model.errors.length = 0;
            };

            this.addError = function (virhe) {
                model.errors.push(virhe);
            };

            this.noErrors = function () {
                return _.isEmpty(model.errors);
            };
        };

    return model;

    }])

.directive('kaavaValidation', ['ErrorService', function (ErrorService) {
        return {
            restrict: 'E',
            template: '<div class="alert alert-danger" ng-transclude></div>',
            link: function ($scope, element, attrs) {
                $scope.errors = ErrorService.errors;
            },
            priority:1,
            transclude: true
        }
    }])

.directive('validationError', ['KaavaVirheTyypit', function (KaavaVirheTyypit) {
    return {
        restrict: 'E',
        priority: 0,
        templateUrl: 'laskentakaavat/laskentakaavaeditori/puu/errors.html'
    }
}]);



//<span ng-if="virhe.funktiokutsu"
// ng-click="setFunktioSelection(virhe.funktiokutsu, virhe.isFunktiokutsu, virhe.parent, virhe.index)">Funktiokutsu: {{virhe.kuvaus}}</span>
