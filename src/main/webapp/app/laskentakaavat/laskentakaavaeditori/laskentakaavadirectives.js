angular.module('valintaperusteet')

.directive('addClassOnMouseover', ['$animate', function ($animate) {
    'use strict';

    return function (scope, element, attrs) {
        element.bind('mouseover', function (hover) {
            if (hover) {
                $animate.addClass(element, attrs.addClassOnMouseover);
            }
        });

        element.bind('mouseout', function (hover) {
            if (hover) {
                $animate.removeClass(element, attrs.addClassOnMouseover);
            }
        });
    };
}])



    .directive('funktiokutsuLabel', [function () {
        return {
            transclude: true,
            templateUrl: 'laskentakaavat/laskentakaavaeditori/puu/tools.html',
            link: function ($scope, element, attrs) {
                $scope.status = {
                    isopen: false
                };
            }
        };
    }]);

