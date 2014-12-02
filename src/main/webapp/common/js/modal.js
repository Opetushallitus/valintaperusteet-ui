'use strict';

angular.module('valintaperusteet')
    .constant('IlmoitusTila', {
        INFO: 'success',
        WARNING: 'warning',
        ERROR: 'danger'
    })
//MODAALISET IKKUNAT
    .factory('Ilmoitus', ['$modal', 'IlmoitusTila', function($modal, IlmoitusTila) {
        return {
            avaa: function(otsikko, ilmoitus, tila) {
                $modal.open({
                    backdrop: 'static',
                    templateUrl: '../common/modaalinen/ilmoitus.html',
                    controller: function($scope, $window, $modalInstance) {
                        $scope.ilmoitus = ilmoitus;
                        $scope.otsikko = otsikko;
                        if(!tila) {
                            tila = IlmoitusTila.INFO;
                        }
                        $scope.tila = tila;
                        $scope.sulje = function() {
                            $modalInstance.dismiss('cancel');
                        };
                    },
                    resolve: {

                    }
                }).result.then(function() {
                    }, function() {
                    });

            }
        };
    }])
    .directive('modal', ['$modal', function ($modal) {

        return {
            restrict: 'E',
            transclude: true,
            replace: false,
            template: '<div ng-transclude></div>',
            link: function ($scope, $elems, $attrs) {
                var template = $attrs.modalTemplate;
                var windowClass = $attrs.windowClass;
                var size = $attrs.size;
                $scope.show = function () {
                    $modal.open({
                        scope: $scope,
                        size: size,
                        templateUrl: template,
                        windowClass: windowClass,
                        controller: function ($scope, $modalInstance) {
                            $scope.sulje = function () {
                                $modalInstance.dismiss('cancel');
                            };
                            $scope.$on('suljemodal', function () {
                                $modalInstance.dismiss('cancel');
                            });
                        },
                        resolve: {}
                    }).result.then(function () {
                        }, function () {
                        });
                };
            }
        };
    }])

    .directive('modalOpen', [function () {
        return {
            require: '^modal', // We need this directive to be inside an accordion
            restrict: 'E',
            transclude: true, // It transcludes the contents of the directive into the template
            replace: true, // The element containing the directive will be replaced with the template
            template: '<a href="" ng-click="show()" ng-transclude></a>'
        };
    }]);