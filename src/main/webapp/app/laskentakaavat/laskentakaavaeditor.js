/**
*  Module
*
* Description
*/

angular.module('LaskentakaavaEditor', ['ngResource', 'loading', 'ngRoute', 'localization', 'underscore', 'ng-breadcrumbs']);

angular.module('LaskentakaavaEditor').config(function($routeProvider) {
	//laskentakaava
	$routeProvider.
	when('/laskentakaava', {controller: 'LaskentakaavaListController', templateUrl: TEMPLATE_URL_BASE + 'laskentakaavat/listaus/laskentakaavalista.html', label: 'laskentakaavalista'}).
	when('/laskentakaava/:laskentakaavaOid', {controller: 'LaskentakaavaController', templateUrl:TEMPLATE_URL_BASE + 'laskentakaavat/laskentakaavapuu/laskentakaavalomake.html', label: 'laskentakaava'}).
	when('/valintaryhma/:valintaryhmaOid/laskentakaava', {controller: 'LaskentakaavaListController', templateUrl: TEMPLATE_URL_BASE + 'laskentakaavat/listaus/laskentakaavalista.html', label: 'laskentakaava'}).
    when('/valintaryhma/:valintaryhmaOid/laskentakaava/:laskentakaavaOid', {controller: 'LaskentakaavaController', templateUrl: TEMPLATE_URL_BASE + 'laskentakaavat/laskentakaavapuu/laskentakaavalomake.html', label: 'laskentakaava'}).
    when('/hakukohde/:hakukohdeOid/laskentakaava', {controller: 'HakukohdeLaskentakaavaListController', templateUrl: TEMPLATE_URL_BASE + 'laskentakaavat/listaus/hakukohdelaskentakaavalista.html', label: 'laskentakaava'}).
    when('/hakukohde/:hakukohdeOid/laskentakaava/:laskentakaavaOid', {controller: 'LaskentakaavaController', templateUrl: TEMPLATE_URL_BASE + 'laskentakaavat/laskentakaavapuu/laskentakaavalomake.html', label: 'laskentakaava'})
});

 	