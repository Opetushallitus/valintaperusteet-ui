angular.module('LaskentakaavaEditor').controller('UusiLaskentakaavaController', ['$scope', 'FunktioService',
    '$routeParams', function ($scope, FunktioService, $routeParams) {
    'use strict';

    $scope.funktioService = FunktioService;
    $scope.funktioService.refresh();

    $scope.kaava = { tyyppi: "NIMETTYLUKUARVO" };

    $scope.createKaava = function (kaavaData) {

        var funktiokuvaus = $scope.funktioService.getFunktiokuvaus(kaavaData.tyyppi);
        var laskentakaava = {
            nimi: kaavaData.nimi,
            kuvaus: kaavaData.kuvaus,
            onLuonnos: false,
            tyyppi: funktiokuvaus.funktioargumentit[0].tyyppi,
            kardinaliteetti: funktiokuvaus.funktioargumentit[0].kardinaliteetti,
            funktiokutsu: {
                funktionimi: kaavaData.tyyppi,
                tallennaTulos: false,
                tulosTunniste: null,
                tulosTekstiFi: null,
                tulosTekstiSv: null,
                tulosTekstiEn: null,
                funktioargumentit: [],
                valintaperusteviitteet: [],
                arvokonvertteriparametrit: [],
                arvovalikonvertteriparametrit: [],
                validointivirheet: [],
                syoteparametrit: [
                    {
                        avain: "nimi",
                        arvo: kaavaData.nimi
                    }
                ]
            }
        };

        $scope.setLaskentakaava(laskentakaava);
    };

}]);