
angular.module('valintaperusteet')
    .directive('funktiokutsuLabel', [function () {
        return {
            restrict: 'E',
            transclude: true,
            templateUrl: 'laskentakaavat/laskentakaavaeditori/puu/funktiokutsuLabel.html',
            link: function ($scope, elem, attrs) {
                $scope.toggled = function (open) {
                    console.log(open);
                };
            }
        };
    }])

    .directive('laskentakaavaToolsDropdown', [function () {
        return {
            restrict: 'A',
            require: "funktiokutsuLabel",
            templateUrl: function (elem, attrs) {
                return attrs.laskentakaavaToolsDropdown === 'funktiokutsu' ? 'laskentakaavat/laskentakaavaeditori/puu/funktiokutsuToolsDropdown.html' : 'laskentakaavat/laskentakaavaeditori/puu/laskentakaavaviiteToolsDropdown.html';
            }
        };
    }]);


