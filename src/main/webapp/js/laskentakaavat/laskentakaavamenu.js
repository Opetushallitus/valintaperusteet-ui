
function LaskentakaavaMenuController($scope, $routeParams) {
    $scope.menuitems = [
        {url: '#/etusivu', title: 'Valintaryhmät ja hakukohteet'},
        {url: '#/laskentakaava', title: 'Laskentakaavat'}
    ]
    $scope.selected = $scope.menuitems[1];

    if($routeParams.valintaryhmaOid) {
        $scope.menuitems = [
            {url: '#/valintaryhma/' + $routeParams.valintaryhmaOid, title: 'Valintaryhmän perustiedot'},
            {url: '#/valintaryhma/' + $routeParams.valintaryhmaOid + '/sisaltyvat', title: 'Sisältyvät hakukohteet'},
            {url: '#/valintaryhma/' + $routeParams.valintaryhmaOid + '/laskentakaava', title: 'Laskentakaavat'}
        ]
        $scope.selected = $scope.menuitems[2];
    }

    $scope.cssClass = function(menuitem) {
        if(angular.equals($scope.selected, menuitem)) {
            return "tab current";
        }
        return "tab";
    }
}