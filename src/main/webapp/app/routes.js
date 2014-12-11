//Route configuration
app.config(function($routeProvider) {
    'use strict';


    $routeProvider.

		//front page
		when('/etusivu', {controller:'ValintaryhmaHakukohdeTreeController', templateUrl:TEMPLATE_URL_BASE + 'valintaryhmalistaus/valintaryhmatlistaus.html'}).

		//edit valintaryhma
		when('/valintaryhma/', {controller:'UusiValintaryhmaController', templateUrl:TEMPLATE_URL_BASE + 'valintaryhma/valintaryhmalomake_uusi.html', label: 'valintaryhmä'}).
		when('/valintaryhma/:id', {controller:'ValintaryhmaController', templateUrl:TEMPLATE_URL_BASE + 'valintaryhma/valintaryhmalomake.html', label: 'valintaryhmä'}).
        when('/valintaryhma/:id/userpage', {controller: 'UserPageController', templateUrl:TEMPLATE_URL_BASE + '../common/components/user/user.html', label:'user'}).
        when('/valintaryhma/:id/hakijaryhma/', {controller:'HakijaryhmaController', templateUrl:TEMPLATE_URL_BASE + 'hakijaryhma/hakijaryhma.html', label: 'hakijaryhmä'}).
		when('/valintaryhma/:id/hakijaryhma/:hakijaryhmaOid', {controller:'HakijaryhmaController', templateUrl:TEMPLATE_URL_BASE + 'hakijaryhma/hakijaryhma.html', label: 'hakijaryhmä'}).
		when('/valintaryhma/:id/valinnanvaihe/', {controller: 'ValintaryhmaValinnanvaiheController', templateUrl: TEMPLATE_URL_BASE + 'valinnanvaihe/valinnanvaihelomake.html'}).
		when('/valintaryhma/:id/valinnanvaihe/:valinnanvaiheOid', {controller: 'ValintaryhmaValinnanvaiheController', templateUrl: TEMPLATE_URL_BASE + 'valinnanvaihe/valinnanvaihelomake.html', label: 'valinnanvaihe'}).
		when('/valintaryhma/:id/valinnanvaihe/:valinnanvaiheOid/valintatapajono/', {controller: 'ValintaryhmaValintatapajonoController', templateUrl:TEMPLATE_URL_BASE + 'valintatapajono/valintatapajono.html', label: 'valintatapajono'}).
		when('/valintaryhma/:id/valinnanvaihe/:valinnanvaiheOid/valintatapajono/:valintatapajonoOid', {controller: 'ValintaryhmaValintatapajonoController', templateUrl:TEMPLATE_URL_BASE + 'valintatapajono/valintatapajono.html', label: 'valintatapajono'}).
		when('/valintaryhma/:id/valinnanvaihe/:valinnanvaiheOid/valintatapajono/:valintatapajonoOid/jarjestyskriteeri/', {controller:'JarjestyskriteeriController', templateUrl:TEMPLATE_URL_BASE + 'jarjestyskriteeri/jarjestyskriteeri.html', label: 'järjestyskriteeri'}).
		when('/valintaryhma/:id/valinnanvaihe/:valinnanvaiheOid/valintatapajono/:valintatapajonoOid/jarjestyskriteeri/:jarjestyskriteeriOid', {controller:'JarjestyskriteeriController', templateUrl:TEMPLATE_URL_BASE + 'jarjestyskriteeri/jarjestyskriteeri.html', label: 'järjestyskriteeri'}).
		when('/valintaryhma/:id/valinnanvaihe/:valinnanvaiheOid/valintatapajono/:valintatapajonoOid/hakijaryhma', {controller:'HakijaryhmaController', templateUrl:TEMPLATE_URL_BASE + 'hakijaryhma/hakijaryhma.html', label: 'hakijaryhmä'}).
        when('/valintaryhma/:id/valinnanvaihe/:valinnanvaiheOid/valintatapajono/:valintatapajonoOid/hakijaryhma/:hakijaryhmaOid', {controller:'HakijaryhmaController', templateUrl:TEMPLATE_URL_BASE + 'hakijaryhma/hakijaryhma.html', label: 'hakijaryhmä'}).

		//valintakoevalinnanvaihe
		when('/valintaryhma/:id/valintakoevalinnanvaihe/', {controller: 'ValintaryhmaValintakoeValinnanvaiheController', templateUrl:TEMPLATE_URL_BASE + 'valinnanvaihe/valintakoevalinnanvaihelomake.html', label: 'valintakoevalinnanvaihe'}).
		when('/valintaryhma/:id/valintakoevalinnanvaihe/:valintakoevalinnanvaiheOid', {controller: 'ValintaryhmaValintakoeValinnanvaiheController', templateUrl:TEMPLATE_URL_BASE + 'valinnanvaihe/valintakoevalinnanvaihelomake.html', label: 'valintakoevalinnanvaihe'}).
		when('/valintaryhma/:id/valintakoevalinnanvaihe/:valintakoevalinnanvaiheOid/valintakoe/', {controller: 'ValintaryhmaValintakoeController', templateUrl:TEMPLATE_URL_BASE + 'valintakoe/valintakoelomake.html', label: 'valintakoe'}).
		when('/valintaryhma/:id/valintakoevalinnanvaihe/:valintakoevalinnanvaiheOid/valintakoe/:valintakoeOid', {controller: 'ValintaryhmaValintakoeController', templateUrl:TEMPLATE_URL_BASE + 'valintakoe/valintakoelomake.html', label: 'valintakoe'}).
		when('/hakukohde/:hakukohdeOid/valintakoevalinnanvaihe/', {controller: 'HakukohdeValintakoeValinnanvaiheController', templateUrl:TEMPLATE_URL_BASE + 'valinnanvaihe/valintakoevalinnanvaihelomake.html', label: 'valintakoevalinnanvaihe'}).
		when('/hakukohde/:hakukohdeOid/valintakoevalinnanvaihe/:valintakoevalinnanvaiheOid', {controller: 'HakukohdeValintakoeValinnanvaiheController', templateUrl:TEMPLATE_URL_BASE + 'valinnanvaihe/valintakoevalinnanvaihelomake.html', label: 'valintakoevalinnanvaihe'}).
		when('/hakukohde/:hakukohdeOid/valintakoevalinnanvaihe/:valintakoevalinnanvaiheOid/valintakoe/', {controller: 'HakukohdeValintakoeController', templateUrl:TEMPLATE_URL_BASE + 'valintakoe/valintakoelomake.html', label: 'valintakoe'}).
		when('/hakukohde/:hakukohdeOid/valintakoevalinnanvaihe/:valintakoevalinnanvaiheOid/valintakoe/:id', {controller: 'HakukohdeValintakoeController', templateUrl:TEMPLATE_URL_BASE + 'valintakoe/valintakoelomake.html', label: 'valintakoe'}).

		// edit hakukohde
		when('/hakukohde/', {controller: 'UusiHakukohdeController', templateUrl:TEMPLATE_URL_BASE + 'hakukohde/hakukohde_uusi.html', label: 'hakukohde'}).
        when('/hakukohde/:hakukohdeOid', {controller:'HakukohdeController', templateUrl:TEMPLATE_URL_BASE + 'hakukohde/hakukohdelomake.html', label: 'hakukohde'}).
        when('/hakukohde/:hakukohdeOid/userpage', {controller: 'UserPageController', templateUrl:TEMPLATE_URL_BASE + '../common/components/user/user.html', label:'user'}).
		when('/hakukohde/:hakukohdeOid/hakijaryhma/', {controller:'HakijaryhmaController', templateUrl:TEMPLATE_URL_BASE + 'hakijaryhma/hakijaryhma.html', label: 'hakijaryhmä'}).
		when('/hakukohde/:hakukohdeOid/hakijaryhma/:hakijaryhmaOid', {controller:'HakijaryhmaController', templateUrl:TEMPLATE_URL_BASE + 'hakijaryhma/hakijaryhma.html', label: 'hakijaryhmä'}).
		when('/hakukohde/:hakukohdeOid/valinnanvaihe/', {controller:'ValinnanVaiheController', templateUrl:TEMPLATE_URL_BASE + 'valinnanvaihe/valinnanvaihelomake.html', label: 'valinnanvaihe'}).
		when('/hakukohde/:hakukohdeOid/valinnanvaihe/:valinnanvaiheOid', {controller:'ValinnanVaiheController', templateUrl:TEMPLATE_URL_BASE + 'valinnanvaihe/valinnanvaihelomake.html', label: 'valinnanvaihe'}).
		when('/hakukohde/:hakukohdeOid/valinnanvaihe/:valinnanvaiheOid/valintatapajono/', {controller: 'HakukohdeValintatapajonoController', templateUrl:TEMPLATE_URL_BASE + 'valintatapajono/valintatapajono.html', label: 'valintatapajono'}).
		when('/hakukohde/:hakukohdeOid/valinnanvaihe/:valinnanvaiheOid/valintatapajono/:valintatapajonoOid', {controller: 'HakukohdeValintatapajonoController', templateUrl:TEMPLATE_URL_BASE + 'valintatapajono/valintatapajono.html', label: 'valintatapajono'}).
		when('/hakukohde/:hakukohdeOid/valinnanvaihe/:valinnanvaiheOid/valintatapajono/:valintatapajonoOid/jarjestyskriteeri/', {controller:'JarjestyskriteeriController', templateUrl:TEMPLATE_URL_BASE + 'jarjestyskriteeri/jarjestyskriteeri.html', label: 'järjestyskriteeri'}).
		when('/hakukohde/:hakukohdeOid/valinnanvaihe/:valinnanvaiheOid/valintatapajono/:valintatapajonoOid/jarjestyskriteeri/:jarjestyskriteeriOid', {controller:'JarjestyskriteeriController', templateUrl:TEMPLATE_URL_BASE + 'jarjestyskriteeri/jarjestyskriteeri.html', label: 'järjestyskriteeri'}).
		when('/hakukohde/:hakukohdeOid/valinnanvaihe/:valinnanvaiheOid/valintatapajono/:valintatapajonoOid/hakijaryhma', {controller:'HakijaryhmaController', templateUrl:TEMPLATE_URL_BASE + 'hakijaryhma/hakijaryhma.html', label: 'hakijaryhmä'}).
        when('/hakukohde/:hakukohdeOid/valinnanvaihe/:valinnanvaiheOid/valintatapajono/:valintatapajonoOid/hakijaryhma/:hakijaryhmaOid', {controller:'HakijaryhmaController', templateUrl:TEMPLATE_URL_BASE + 'hakijaryhma/hakijaryhma.html', label: 'hakijaryhmä'}).

        //Laskentakaavaeditori
        when('/laskentakaava', {controller: 'LaskentakaavaListController', templateUrl: TEMPLATE_URL_BASE + 'laskentakaavat/listaus/laskentakaavalista.html', label: 'laskentakaavalista'}).
        when('/laskentakaava/:laskentakaavaOid', {controller: 'LaskentakaavaController', templateUrl: TEMPLATE_URL_BASE + 'laskentakaavat/laskentakaavaeditori/laskentakaavalomake.html', label: 'laskentakaava'}).
        when('/valintaryhma/:valintaryhmaOid/laskentakaavalista', {controller: 'LaskentakaavaListController', templateUrl: TEMPLATE_URL_BASE + 'laskentakaavat/listaus/laskentakaavalista.html', label: 'laskentakaavalista'}).
        when('/valintaryhma/:valintaryhmaOid/laskentakaavalista/laskentakaava/', {controller: 'LaskentakaavaLomakeController', templateUrl: TEMPLATE_URL_BASE + 'laskentakaavat/laskentakaavaeditori/laskentakaavalomake.html', label: 'laskentakaava'}).
        when('/valintaryhma/:valintaryhmaOid/laskentakaavalista/laskentakaava/:laskentakaavaOid', {controller: 'LaskentakaavaLomakeController', templateUrl: TEMPLATE_URL_BASE + 'laskentakaavat/laskentakaavaeditori/laskentakaavalomake.html', label: 'laskentakaava'}).
        when('/hakukohde/:hakukohdeOid/laskentakaavalista', {controller: 'HakukohdeLaskentakaavaListController', templateUrl: TEMPLATE_URL_BASE + 'laskentakaavat/listaus/hakukohdelaskentakaavalista.html', label: 'laskentakaavalista'}).
        when('/hakukohde/:hakukohdeOid/laskentakaavalista/laskentakaava/', {controller: 'LaskentakaavaLomakeController', templateUrl: TEMPLATE_URL_BASE + 'laskentakaavat/laskentakaavaeditori/laskentakaavalomake.html', label: 'laskentakaava'}).
        when('/hakukohde/:hakukohdeOid/laskentakaavalista/laskentakaava/:laskentakaavaOid', {controller: 'LaskentakaavaLomakeController', templateUrl: TEMPLATE_URL_BASE + 'laskentakaavat/laskentakaavaeditori/laskentakaavalomake.html', label: 'laskentakaava'}).

		//Tarjonta import
		when('/import', {controller: 'ImportController', templateUrl:TEMPLATE_URL_BASE + 'yhteisvalinnanhallinta/yhteisvalinnanhallinta.html', label: 'Yhteisvalinnahallinta'}).

		//else
		otherwise({redirectTo:'/etusivu'});
});
