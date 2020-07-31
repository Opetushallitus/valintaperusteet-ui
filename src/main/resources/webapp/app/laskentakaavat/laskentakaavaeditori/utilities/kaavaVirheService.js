angular
  .module('valintaperusteet')

  .constant('KaavaVirheTyypit', {
    JUURIPUUTTUVANIMETTYFUNKTIOARGUMENTTI:
      'JUURIPUUTTUVANIMETTYFUNKTIOARGUMENTTI',
    PUUTTUVAPAKOLLINENFUNKTIOARGUMENTTI: 'PUUTTUVAPAKOLLINENFUNKTIOARGUMENTTI',
    PUUTTUVANIMETTYFUNKTIOARGUMENTTI: 'PUUTTUVANIMETTYFUNKTIOARGUMENTTI',
    PUUTTUVATALLENNATULOS: 'PUUTTUVATALLENNATULOS',
    PUUTTUVATULOSTEKSTI: 'PUUTTUVATULOSTEKSTI',
    SYOTEPARAMETRI: 'SYOTEPARAMETRI',
    PUUTTUVAARVOKONVERTTERI: 'PUUTTUVAARVOKONVERTTERI',
    PKPARITONMAARAFUNKIOARGUMENTTEJA: 'PKPARITONMAARAFUNKIOARGUMENTTEJA',
    PKLIIANVAHANFUNKTIOARGUMENTTEJA: 'PKLIIANVAHANFUNKTIOARGUMENTTEJA',
    PKPUUTTUVAFUNKTIOARGUMENTTI: 'PKPUUTTUVAFUNKTIOARGUMENTTI',
    HAETOTUUSARVOJAKONVERTOILUKUARVOKSIPUUTTUVAARVOKONVERTTERI:
      'HAETOTUUSARVOJAKONVERTOILUKUARVOKSIPUUTTUVAARVOKONVERTTERI',
    TAUSTAPALVELU: 'TAUSTAPALVELU',
  })

  .factory('ErrorService', [
    '_',
    function (_) {
      'use strict'
      var model = new (function () {
        this.errors = []

        this.clearErrors = function () {
          model.errors.length = 0
        }

        this.addError = function (virhe) {
          model.errors.push(virhe)
        }

        this.noErrors = function () {
          return _.isEmpty(model.errors)
        }
      })()

      return model
    },
  ])

  .directive('kaavaValidation', [
    'ErrorService',
    function (ErrorService) {
      return {
        restrict: 'E',
        template: '<div class="alert alert-danger" ng-transclude></div>',
        link: function ($scope, element, attrs) {
          $scope.errorService = ErrorService
        },
        transclude: true,
      }
    },
  ])

  .directive('validationError', [
    'KaavaVirheTyypit',
    function (KaavaVirheTyypit) {
      return {
        restrict: 'E',
        templateUrl: 'laskentakaavat/laskentakaavaeditori/puu/errors.html',
      }
    },
  ])
