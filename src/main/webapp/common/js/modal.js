'use strict';

angular.module('valintaperusteet')

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