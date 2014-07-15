'use strict';

angular.module('LaskentakaavaEditor').directive('addClassOnMouseover', function ($animate) {
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
});
