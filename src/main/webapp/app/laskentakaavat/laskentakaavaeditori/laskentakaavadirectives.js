angular.module('valintaperusteet').directive('addClassOnMouseover', function ($animate) {
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
});
