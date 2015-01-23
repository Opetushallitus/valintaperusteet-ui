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

.directive('funktiokutsuCopy', [function() {
        return {
            templateUrl: 'laskentakaavat/laskentakaavaeditori/puu/copytools.html',
            link: function ($scope, element, attrs) {
                $scope.status = {
                    isopen: false
                };
            }

        };
    }])

.directive('copyTools', [function () {
        return {
            restrict: 'A',
            scope: {
                clearClipboard: '=clearClipboard',
                clipboard: '=clipboard',
                funktiokutsu: '=funktiokutsu',
                funktiokutsuParent: '=funktiokutsuParent',
                childIndex: '=childIndex'
            },
            link: function ($scope, element, attrs) {
                
                $scope.status = {
                    isopen: false
                };
                
                $scope.copyAndReplace = function () {
                    $scope.clipboardAction(funktiokutsu, funktiokutsuParent, childIndex);
                };

                $scope.copyAndShift = function () {
                    console.log($scope.funktiokutsu);
                };

                $scope.clipboardAction = function (funktiokutsu, parentFunktiokutsu, childIndex) {
                    if($scope.isFirstChildForRoot(parentFunktiokutsu)) {
                        parentFunktiokutsu.funktioargumentit[childIndex] = $scope.clipboard;
                    } else {
                        parentFunktiokutsu.lapsi.funktioargumentit[childIndex] = $scope.clipboard;
                    }

                    // korjataan kopioinnin yhteydessä sekaisin menneet palvelimella asetetut funktiokutsuargumentti-indeksit
                    FunktioService.checkLaskentakaavaIndexes($scope.model.laskentakaavapuu);
                    $scope.clearClipboard();
                };

            },
            templateUrl: 'laskentakaavat/laskentakaavaeditori/puu/copytools.html'
        };
    }]);
