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


}