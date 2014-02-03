'use strict';

function LaskentakaavaMenuController($scope, $routeParams) {
    $scope.menuitems = [
        {url: '#/etusivu', title: 'Valintaryhmät ja hakukohteet'},
        {url: '#/laskentakaava', title: 'Laskentakaavat'}
    ]
    $scope.selected = $scope.menuitems[1];

    if($routeParams.valintaryhmaOid) {
        $scope.menuitems = [
            {url: '#/valintaryhma/' + $routeParams.valintaryhmaOid, title: 'Valintaryhmän perustiedot'},
            {url: '#/valintaryhma/' + $routeParams.valintaryhmaOid + '/laskentakaava', title: 'Laskentakaavat'}
        ]
        $scope.selected = $scope.menuitems[1];
    } else if($routeParams.hakukohdeOid) {
        $scope.menuitems = [
            {url: '#/hakukohde/' + $routeParams.hakukohdeOid, title: 'Hakukohteen perustiedot'},
            {url: '#/hakukohde/' + $routeParams.hakukohdeOid + '/laskentakaava', title: 'Laskentakaavat'}
        ]
        $scope.selected = $scope.menuitems[1];
    }

    $scope.cssClass = function(menuitem) {
        if(angular.equals($scope.selected, menuitem)) {
            return "tab current";
        }
        return "tab";
    }
}