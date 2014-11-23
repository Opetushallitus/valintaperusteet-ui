

angular.module('valintaperusteet')

    .directive('ngEnable', ['$log', function ($log) {
        return {
            priority: 100,
            link: function ($scope, element, attrs) {

                if(!attrs.ngDisabled) {
                    $scope.$watch(attrs.ngEnable, function(value) {
                        attrs.$set('disabled', !value);
                    });
                } else {
                    $log.error("ng-enabled and ng-disabled -directibes shouldn't be user in the same element", element);
                }
            }
        };
    }])

    .directive('uiSortable', [function () {
        var options;
        options = {};
        return {
            require: '?ngModel',
            link: function (scope, element, attrs, ngModel) {

                var onStart, onUpdate, opts, _start, _update;
                opts = angular.extend({}, options, scope.$eval(attrs.uiOptions));
                if (ngModel != null) {
                    onStart = function (e, ui) {
                        return ui.item.data('ui-sortable-start', ui.item.index());
                    };
                    onUpdate = function (e, ui) {
                        var end, start;
                        start = ui.item.data('ui-sortable-start');
                        end = ui.item.index();
                        ngModel.$modelValue.splice(end, 0, ngModel.$modelValue.splice(start, 1)[0]);
                        return scope.$apply();
                    };
                    _start = opts.start;
                    opts.start = function (e, ui) {
                        onStart(e, ui);
                        if (typeof _start === "function") {
                            _start(e, ui);
                        }
                        return scope.$apply();
                    };
                    _update = opts.update;
                    opts.update = function (e, ui) {
                        onUpdate(e, ui);
                        if (typeof _update === "function") {
                            _update(e, ui);
                        }
                        return scope.$apply();
                    };
                }
                return element.sortable(opts);
            }
        };
    }])


    .directive('enter', [function () {
        return function (scope, element, attrs) {
            element.bind('mouseover', function () {
                element.addClass(attrs.enter);
            });
        }
    }])

    .directive('leave', [function () {
        return function (scope, element, attrs) {
            element.bind('mouseleave', function () {
                element.removeClass(attrs.leave);
            });
        }
    }])

    .directive('filterableList', [function () {
        return {
            scope: true,
            controller: function ($scope) {
                $scope.selectedId = "";
                var id = "";
                this.setSelectedId = function (newId) {
                    $scope.selectedId = newId;
                    id = newId;
                    $scope.$digest();
                }

                this.removeSelection = function () {
                    $scope.selectedId = "";
                    id = "";
                    $scope.$broadcast('removeSelection');
                    $scope.$digest();
                }

                $scope.$watch('id', function () {
                    $scope.selectedId = id;
                });

            }
        }
    }])

    .directive('flOption', [function () {
        return {
            require: '^filterableList',

            link: function (scope, iElement, iAttrs, ctrl) {
                var isSelected = false;

                scope.$on('removeSelection', function (event, data) {
                    if (isSelected) {
                        iElement.removeClass('selected');
                        isSelected = false;
                    }
                });

                iElement.bind('click', function () {
                    if (isSelected) {
                        ctrl.removeSelection();
                        isSelected = false;
                    } else {
                        ctrl.removeSelection();
                        ctrl.setSelectedId(iAttrs.flOption);
                        iElement.addClass('selected');
                        isSelected = true;
                    }
                });

            }
        }
    }])


    .directive('itemOnScreen', ['$timeout', function ($timeout) {
        return {
            scope: true,
            link: function (scope, element, attrs) {
                var oldBottom = 0;
                var oldDocument = 0;
                var checkHeight = function () {
                    var docViewTop = $(window).scrollTop();
                    var docViewBottom = docViewTop + $(window).height();
                    var elemTop = $(element).offset().top;

                    var elemBottom = elemTop + $(element).height();

                    if (elemBottom < docViewBottom && oldBottom != elemBottom) {
                        scope.$apply(function () {
                            scope.lazyLoading();
                            oldBottom = elemBottom;
                        });

                        $timeout(checkHeight, 10);
                    }
                    else {
                        $(window).scroll(function (e) {
                            var documentHeight = $(document).height();
                            if ($(window).scrollTop() + $(window).height() >= documentHeight * .9 && oldDocument != documentHeight) {
                                scope.$apply(function () {
                                    scope.lazyLoading();
                                    oldDocument = documentHeight;
                                });
                            }
                        });
                    }
                };
                $timeout(checkHeight, 10);
            }
        };
    }])


    .directive('dateInput', ['dateFilter', function (dateFilter) {
        return {
            restrict: 'E',
            require: 'ngModel',
            template: '<input placeholder="yyyy-MM-dd"  type="date"></input>',
            replace: true,
            link: function (scope, elm, attrs, ngModelCtrl) {
                ngModelCtrl.$formatters.unshift(function (modelValue) {
                    return dateFilter(modelValue, 'yyyy-MM-dd');
                });

                ngModelCtrl.$parsers.unshift(function (viewValue) {
                    if (viewValue)
                        return new Date(viewValue);
                    else return "";
                });
            }
        };
    }])


    .directive('breadcrumb', [function () {
        return {
            templateUrl: '../common/partials/breadcrumb.html',
            restrict: 'E'
        };
    }]);

