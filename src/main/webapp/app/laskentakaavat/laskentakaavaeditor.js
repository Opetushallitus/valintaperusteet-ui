/**
 *  Module
 *
 * Description
 */

angular.module('LaskentakaavaEditor', ['ngResource', 'loading', 'ngRoute', 'localization', 'underscore', 'ng-breadcrumbs']);

angular.module('LaskentakaavaEditor').config(function ($routeProvider) {
	//laskentakaava
	$routeProvider.
		when('/laskentakaava', {controller: 'LaskentakaavaListController', templateUrl: TEMPLATE_URL_BASE + 'laskentakaavat/listaus/laskentakaavalista.html', label: 'laskentakaavalista'}).
		when('/laskentakaava/:laskentakaavaOid', {controller: 'LaskentakaavaController', templateUrl: TEMPLATE_URL_BASE + 'laskentakaavat/laskentakaavaeditori/laskentakaavalomake.html', label: 'laskentakaava'}).
		when('/valintaryhma/:valintaryhmaOid/laskentakaavalista', {controller: 'LaskentakaavaListController', templateUrl: TEMPLATE_URL_BASE + 'laskentakaavat/listaus/laskentakaavalista.html', label: 'laskentakaavalista'}).
		when('/valintaryhma/:valintaryhmaOid/laskentakaavalista/laskentakaava/', {controller: 'LaskentakaavaLomakeController', templateUrl: TEMPLATE_URL_BASE + 'laskentakaavat/laskentakaavaeditori/laskentakaavalomake.html', label: 'laskentakaava'}).
		when('/valintaryhma/:valintaryhmaOid/laskentakaavalista/laskentakaava/:laskentakaavaOid', {controller: 'LaskentakaavaLomakeController', templateUrl: TEMPLATE_URL_BASE + 'laskentakaavat/laskentakaavaeditori/laskentakaavalomake.html', label: 'laskentakaava'}).
		when('/hakukohde/:hakukohdeOid/laskentakaavalista', {controller: 'HakukohdeLaskentakaavaListController', templateUrl: TEMPLATE_URL_BASE + 'laskentakaavat/listaus/hakukohdelaskentakaavalista.html', label: 'laskentakaavalista'}).
		when('/hakukohde/:hakukohdeOid/laskentakaavalista/laskentakaava/', {controller: 'LaskentakaavaLomakeController', templateUrl: TEMPLATE_URL_BASE + 'laskentakaavat/laskentakaavaeditori/laskentakaavalomake.html', label: 'laskentakaava'}).
		when('/hakukohde/:hakukohdeOid/laskentakaavalista/laskentakaava/:laskentakaavaOid', {controller: 'LaskentakaavaLomakeController', templateUrl: TEMPLATE_URL_BASE + 'laskentakaavat/laskentakaavaeditori/laskentakaavalomake.html', label: 'laskentakaava'})
});

