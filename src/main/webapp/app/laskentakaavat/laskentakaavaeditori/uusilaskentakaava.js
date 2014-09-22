angular.module('valintaperusteet').controller('UusiLaskentakaavaController', ['$scope', 'FunktioService',
    '$routeParams', function ($scope, FunktioService) {
    'use strict';

    $scope.funktioService = FunktioService;
    $scope.funktioService.refresh();

    $scope.kaava = { tyyppi: "NIMETTYLUKUARVO" };
    
        
    $scope.$on('initializeKaava', function () {
        var funktiokuvaus = $scope.funktioService.getFunktiokuvaus($scope.kaava.tyyppi);
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