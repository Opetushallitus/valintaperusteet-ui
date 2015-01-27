angular.module('valintaperusteet').controller('UusiLaskentakaavaController', ['$scope', 'FunktioService', 'FunktiokuvausService',
    '$routeParams', function ($scope, FunktioService, FunktiokuvausService) {
    'use strict';

    $scope.funktioService = FunktioService;

    $scope.kaava = { tyyppi: "NIMETTYLUKUARVO" };
    
        
    $scope.$on('initializeKaava', function () {
        var funktiokuvaus = FunktiokuvausService.getFunktiokuvaus($scope.kaava.tyyppi);
        var laskentakaava = {
            nimi: $scope.kaava.nimi,
            kuvaus: $scope.kaava.kuvaus,
            onLuonnos: false,
            tyyppi: funktiokuvaus.funktioargumentit[0].tyyppi,
            kardinaliteetti: funktiokuvaus.funktioargumentit[0].kardinaliteetti,
            funktiokutsu: {
                funktionimi: $scope.kaava.tyyppi,
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
                        arvo: $scope.kaava.nimi
                    }
                ]
            }
        };

        $scope.setLaskentakaava(laskentakaava);
    });




}]);