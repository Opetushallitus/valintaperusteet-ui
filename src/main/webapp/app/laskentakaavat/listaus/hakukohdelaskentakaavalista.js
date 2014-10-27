angular.module('valintaperusteet')

    .controller('HakukohdeLaskentakaavaListController', ['$scope', '$log', '$location', '$routeParams', 'Laskentakaava', 'LaskentakaavaLista',
        'HakukohdeModel', 'Valintaryhma', 'Hakukohde',
        function($scope, $log, $location, $routeParams, Laskentakaava, LaskentakaavaLista, HakukohdeModel, Valintaryhma, Hakukohde) {
    'use strict';

    $scope.hakukohdeModel = HakukohdeModel;
    $scope.hakukohdeOid = $routeParams.hakukohdeOid;

    $scope.hakukohdeLaskentakaavaLista = LaskentakaavaLista;
    $scope.hakukohdeLaskentakaavaLista.refresh(null, $scope.hakukohdeOid, true);
    
    $scope.linkprefix = '/hakukohde/' + $scope.hakukohdeOid;

    $scope.showForm = false;
    var saveParams = {}; 
    saveParams.hakukohde = {oid: $routeParams.hakukohdeOid};

    $scope.createKaava = function () {
        $location.path("/hakukohde/" + $routeParams.hakukohdeOid + "/laskentakaavalista/laskentakaava");
    };

    $scope.cancel = function() {
        $location.path("/hakukohde/" + $routeParams.hakukohdeOid);
    };

    $scope.kaavaKopiointiModal = function (kaava) {
        $scope.$broadcast('kaavakopiointi', kaava);
    };

    $scope.kaavaPoisto = function (kaava) {
        Laskentakaava.delete({oid: kaava.id}, function () {
            LaskentakaavaLista.refresh(null, $scope.hakukohdeOid, true);
        }, function (error) {
            $log.error('Laskentakaavan poistaminen epäonnistui', error);
        });
    };

}]);