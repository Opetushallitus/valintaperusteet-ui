/**
*  Module
*
* Description
*/

angular.module('LaskentakaavaEditor', ['ngResource', 'loading', 'ngRoute', 'localization', 'underscore']);

angular.module('LaskentakaavaEditor').config(function($routeProvider) {
	//laskentakaava
	$routeProvider.
	when('/laskentakaava', {controller: 'LaskentakaavaListController', templateUrl: TEMPLATE_URL_BASE + 'laskentakaavat/listaus/laskentakaavalista.html'}).
	when('/laskentakaava/:laskentakaavaOid', {controller: 'LaskentakaavaController', templateUrl:TEMPLATE_URL_BASE + 'laskentakaavat/laskentakaavapuu/laskentakaavalomake.html'}).
	when('/valintaryhma/:valintaryhmaOid/laskentakaava', {controller: 'LaskentakaavaListController', templateUrl: TEMPLATE_URL_BASE + 'laskentakaavat/listaus/laskentakaavalista.html'}).
    when('/valintaryhma/:valintaryhmaOid/laskentakaava/:laskentakaavaOid', {controller: 'LaskentakaavaController', templateUrl: TEMPLATE_URL_BASE + 'laskentakaavat/laskentakaavapuu/laskentakaavalomake.html'}).
    when('/hakukohde/:hakukohdeOid/laskentakaava', {controller: 'HakukohdeLaskentakaavaListController', templateUrl: TEMPLATE_URL_BASE + 'laskentakaavat/listaus/hakukohdelaskentakaavalista.html'}).
    when('/hakukohde/:hakukohdeOid/laskentakaava/:laskentakaavaOid', {controller: 'LaskentakaavaController', templateUrl: TEMPLATE_URL_BASE + 'laskentakaavat/laskentakaavapuu/laskentakaavalomake.html'})
});

 	