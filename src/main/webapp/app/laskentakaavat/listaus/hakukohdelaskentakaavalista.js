'use strict';

function HakukohdeLaskentakaavaListController($scope, $location, $routeParams, Laskentakaava, LaskentakaavaLista, HakukohdeModel, Valintaryhma, Hakukohde) {
    $scope.hakukohdeModel = HakukohdeModel;
    $scope.hakukohdeOid = $routeParams.hakukohdeOid;

    $scope.hakukohdeLaskentakaavaLista = LaskentakaavaLista;
    $scope.hakukohdeLaskentakaavaLista.refresh(null, $scope.hakukohdeOid, true);
    
    $scope.linkprefix = '/hakukohde/' + $scope.hakukohdeOid;

    $scope.showForm = false;
    var saveParams = {}; 
    saveParams.hakukohde = {oid: $routeParams.hakukohdeOid};

    $scope.createKaava = function() {
        $scope.kaava = {
            tyyppi: "NIMETTYLUKUARVO"
        };
        $scope.originalKaava = angular.copy($scope.kaava)
        $scope.showForm = true;
    }

    $scope.editKaava = function(kaava) {
        $scope.showForm = true;
        $scope.kaava = kaava;
        $scope.originalKaava = angular.copy(kaava);
    }

    $scope.cancelEdit = function(kaava) {
        $scope.showForm = false;
        // Palauta originaalit arvot
        angular.forEach($scope.originalKaava, function(value, key) {
            $scope.kaava[key] = value;
        });
        $scope.originalKaava = null;
    }

    $scope.saveKaava = function(kaavaData) {
        if(kaavaData.id) {
            Laskentakaava.updateMetadata({oid: kaavaData.id}, kaavaData, function(data) {
                $scope.showForm = false
            });
        } else {
            var kaava = {
                nimi: kaavaData.nimi,
                kuvaus: kaavaData.kuvaus,
                funktiokutsu: {
                    funktionimi: kaavaData.tyyppi,
                    syoteparametrit: [
                        {
                            avain: "nimi",
                            arvo: kaavaData.nimi
                        }
                    ]
                }
            };

            kaava = $.extend(kaava, saveParams);

            Laskentakaava.insert({}, kaava, function(result) {
                $location.path($scope.linkprefix + "/laskentakaava/" + result.id);
            });
        }
    }

}