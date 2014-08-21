angular.module('valintaperusteet').
    controller('LaskentakaavaLomakeController', ['$scope', '$routeParams', '$location', 'Laskentakaava',
        'KaavaVirheTyypit', '$http', function ($scope, $routeParams, $location, Laskentakaava, KaavaVirheTyypit, $http) {
        'use strict';

        $scope.kaavaVirheTyypit = KaavaVirheTyypit;

        if (!$routeParams.laskentakaavaOid) {
            $scope.showNewLaskentakaavaForm = true;
            $scope.createNewKaava = true;
        }

        $scope.setLaskentakaava = function (laskentakaava) {
            $scope.newKaavaTemplate = laskentakaava;
            $scope.showNewLaskentakaavaForm = false;
            $scope.$broadcast('newkaava');
        };

        $scope.persist = function() {
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


    }]);