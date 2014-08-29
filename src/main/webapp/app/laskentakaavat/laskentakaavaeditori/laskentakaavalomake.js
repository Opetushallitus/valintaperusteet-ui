angular.module('valintaperusteet').
    controller('LaskentakaavaLomakeController', ['$scope', '$routeParams', '$location', '$cookieStore', 'Laskentakaava',
        'KaavaVirheTyypit', function ($scope, $routeParams, $location, $cookieStore, Laskentakaava, KaavaVirheTyypit) {
        'use strict';

        $scope.kaavaVirheTyypit = KaavaVirheTyypit;
        $routeParams.laskentakaavaOid ? $scope.kaavaHasId = true : $scope.kaavaHasId = false;

        if (!$routeParams.laskentakaavaOid) {
            $scope.showNewKaava = true;
            $scope.createNewKaava = true;
        }

        $scope.setLaskentakaava = function (laskentakaava) {
            $scope.newKaavaTemplate = laskentakaava;
            $scope.showNewKaava = false;
            $scope.$broadcast('newkaava');
        };

        $scope.persist = function () {
            $scope.$broadcast('persistKaava');
        };

        $scope.back = function () {
            if ($routeParams.valintaryhmaOid) {
                $location.path("/valintaryhma/" + $routeParams.valintaryhmaOid + "/laskentakaavalista")
            } else if ($routeParams.hakukohdeOid) {
                $location.path("/hakukohde/" + $routeParams.hakukohdeOid + "/laskentakaavalista")
            } else {
                $location.path("/laskentakaava");
            }
        };

            $scope.hasHakijaryhmaCookie = function() {
                return $cookieStore.get('hakijaryhmaSkeleton') ? true : false
            };

    }]);