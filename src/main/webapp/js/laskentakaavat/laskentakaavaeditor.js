/**
*  Module
*
* Description
*/
angular.module('LaskentakaavaEditor', ['ngResource', 'loading', 'ngRoute', 'localization', 'lodash']);

angular.module('LaskentakaavaEditor').config(function($routeProvider) {
	//laskentakaava
	$routeProvider.
	when('/laskentakaava', {controller: LaskentakaavaListController, templateUrl: TEMPLATE_URL_BASE + 'laskentakaava/laskentakaavalista.html'}).
	when('/laskentakaava/:laskentakaavaOid', {controller: 'LaskentakaavaController', templateUrl:TEMPLATE_URL_BASE + 'laskentakaava/laskentakaavalomake.html'}).
	when('/valintaryhma/:valintaryhmaOid/laskentakaava', {controller: LaskentakaavaListController, templateUrl: TEMPLATE_URL_BASE + 'laskentakaava/laskentakaavalista.html'}).
    when('/valintaryhma/:valintaryhmaOid/laskentakaava/:laskentakaavaOid', {controller: 'LaskentakaavaController', templateUrl: TEMPLATE_URL_BASE + 'laskentakaava/laskentakaavalomake.html'}).
    when('/hakukohde/:hakukohdeOid/laskentakaava', {controller: HakukohdeLaskentakaavaListController, templateUrl: TEMPLATE_URL_BASE + 'laskentakaava/hakukohdelaskentakaavalista.html'}).
    when('/hakukohde/:hakukohdeOid/laskentakaava/:laskentakaavaOid', {controller: 'LaskentakaavaController', templateUrl: TEMPLATE_URL_BASE + 'laskentakaava/laskentakaavalomake.html'})
});

 	