


//Route configuration
app.config(function($routeProvider) {
	$routeProvider.

		//front page
		when('/etusivu', {controller:ValintaryhmaHakukohdeTreeController, templateUrl:TEMPLATE_URL_BASE + 'valintaryhmalistaus/valintaryhmatlistaus.html'}).

		//edit valintaryhma
		when('/valintaryhma/', {controller:UusiValintaryhmaController, templateUrl:TEMPLATE_URL_BASE + 'valintaryhma/valintaryhmalomake_uusi.html'}).
		when('/valintaryhma/:id', {controller:ValintaryhmaController, templateUrl:TEMPLATE_URL_BASE + 'valintaryhma/valintaryhmalomake.html'}).
		when('/valintaryhma/:id/hakijaryhma/', {controller:HakijaryhmaController, templateUrl:TEMPLATE_URL_BASE + 'hakijaryhma/hakijaryhma.html'}).
		when('/valintaryhma/:id/hakijaryhma/:hakijaryhmaOid', {controller:HakijaryhmaController, templateUrl:TEMPLATE_URL_BASE + 'hakijaryhma/hakijaryhma.html'}).
		when('/valintaryhma/:id/valinnanvaihe/', {controller: valintaryhmaValinnanvaiheController, templateUrl: TEMPLATE_URL_BASE + 'valinnanvaihe/valinnanvaihelomake.html'}).
		when('/valintaryhma/:id/valinnanvaihe/:valinnanvaiheOid', {controller: valintaryhmaValinnanvaiheController, templateUrl: TEMPLATE_URL_BASE + 'valinnanvaihe/valinnanvaihelomake.html'}).
		when('/valintaryhma/:id/valinnanvaihe/:valinnanvaiheOid/valintatapajono/', {controller: ValintaryhmaValintatapajonoController, templateUrl:TEMPLATE_URL_BASE + 'valintatapajono/valintatapajono.html'}).
		when('/valintaryhma/:id/valinnanvaihe/:valinnanvaiheOid/valintatapajono/:valintatapajonoOid', {controller: ValintaryhmaValintatapajonoController, templateUrl:TEMPLATE_URL_BASE + 'valintatapajono/valintatapajono.html'}).
		when('/valintaryhma/:id/valinnanvaihe/:valinnanvaiheOid/valintatapajono/:valintatapajonoOid/jarjestyskriteeri/', {controller:JarjestyskriteeriController, templateUrl:TEMPLATE_URL_BASE + 'jarjestyskriteeri/jarjestyskriteeri.html'}).
		when('/valintaryhma/:id/valinnanvaihe/:valinnanvaiheOid/valintatapajono/:valintatapajonoOid/jarjestyskriteeri/:jarjestyskriteeriOid', {controller:JarjestyskriteeriController, templateUrl:TEMPLATE_URL_BASE + 'jarjestyskriteeri/jarjestyskriteeri.html'}).
		when('/valintaryhma/:id/valinnanvaihe/:valinnanvaiheOid/valintatapajono/:valintatapajonoOid/hakijaryhma', {controller:HakijaryhmaValintatapajonoController, templateUrl:TEMPLATE_URL_BASE + 'valintatapajono/hakijaryhmaValintatapajono.html'}).

		//valintakoevalinnanvaihe
		when('/valintaryhma/:id/valintakoevalinnanvaihe/', {controller: ValintaryhmaValintakoeValinnanvaiheController, templateUrl:TEMPLATE_URL_BASE + 'valinnanvaihe/valintakoevalinnanvaihelomake.html'}).
		when('/valintaryhma/:id/valintakoevalinnanvaihe/:valintakoevalinnanvaiheOid', {controller: ValintaryhmaValintakoeValinnanvaiheController, templateUrl:TEMPLATE_URL_BASE + 'valinnanvaihe/valintakoevalinnanvaihelomake.html'}).
		when('/valintaryhma/:id/valintakoevalinnanvaihe/:valintakoevalinnanvaiheOid/valintakoe/', {controller: ValintaryhmaValintakoeController, templateUrl:TEMPLATE_URL_BASE + 'valintakoe/valintakoelomake.html'}).
		when('/valintaryhma/:id/valintakoevalinnanvaihe/:valintakoevalinnanvaiheOid/valintakoe/:valintakoeOid', {controller: ValintaryhmaValintakoeController, templateUrl:TEMPLATE_URL_BASE + 'valintakoe/valintakoelomake.html'}).
		when('/hakukohde/:hakukohdeOid/valintakoevalinnanvaihe/', {controller: HakukohdeValintakoeValinnanvaiheController, templateUrl:TEMPLATE_URL_BASE + 'valinnanvaihe/valintakoevalinnanvaihelomake.html'}).
		when('/hakukohde/:hakukohdeOid/valintakoevalinnanvaihe/:valintakoevalinnanvaiheOid', {controller: HakukohdeValintakoeValinnanvaiheController, templateUrl:TEMPLATE_URL_BASE + 'valinnanvaihe/valintakoevalinnanvaihelomake.html'}).
		when('/hakukohde/:hakukohdeOid/valintakoevalinnanvaihe/:valintakoevalinnanvaiheOid/valintakoe/', {controller: HakukohdeValintakoeController, templateUrl:TEMPLATE_URL_BASE + 'valintakoe/valintakoelomake.html'}).
		when('/hakukohde/:hakukohdeOid/valintakoevalinnanvaihe/:valintakoevalinnanvaiheOid/valintakoe/:id', {controller: HakukohdeValintakoeController, templateUrl:TEMPLATE_URL_BASE + 'valintakoe/valintakoelomake.html'}).

		// edit hakukohde
		when('/hakukohde/', {controller: UusiHakukohdeController, templateUrl:TEMPLATE_URL_BASE + 'hakukohde/hakukohde_uusi.html'}).
		when('/hakukohde/:hakukohdeOid', {controller:HakukohdeController, templateUrl:TEMPLATE_URL_BASE + 'hakukohde/hakukohdelomake.html'}).
		when('/hakukohde/:hakukohdeOid/hakijaryhma/', {controller:HakijaryhmaController, templateUrl:TEMPLATE_URL_BASE + 'hakijaryhma/hakijaryhma.html'}).
		when('/hakukohde/:hakukohdeOid/hakijaryhma/:hakijaryhmaOid', {controller:HakijaryhmaController, templateUrl:TEMPLATE_URL_BASE + 'hakijaryhma/hakijaryhma.html'}).
		when('/hakukohde/:hakukohdeOid/valinnanvaihe/', {controller:ValinnanVaiheController, templateUrl:TEMPLATE_URL_BASE + 'valinnanvaihe/valinnanvaihelomake.html'}).
		when('/hakukohde/:hakukohdeOid/valinnanvaihe/:valinnanvaiheOid', {controller:ValinnanVaiheController, templateUrl:TEMPLATE_URL_BASE + 'valinnanvaihe/valinnanvaihelomake.html'}).
		when('/hakukohde/:hakukohdeOid/valinnanvaihe/:valinnanvaiheOid/valintatapajono/', {controller: HakukohdeValintatapajonoController, templateUrl:TEMPLATE_URL_BASE + 'valintatapajono/valintatapajono.html'}).
		when('/hakukohde/:hakukohdeOid/valinnanvaihe/:valinnanvaiheOid/valintatapajono/:valintatapajonoOid', {controller: HakukohdeValintatapajonoController, templateUrl:TEMPLATE_URL_BASE + 'valintatapajono/valintatapajono.html'}).
		when('/hakukohde/:hakukohdeOid/valinnanvaihe/:valinnanvaiheOid/valintatapajono/:valintatapajonoOid/jarjestyskriteeri/', {controller:JarjestyskriteeriController, templateUrl:TEMPLATE_URL_BASE + 'jarjestyskriteeri/jarjestyskriteeri.html'}).
		when('/hakukohde/:hakukohdeOid/valinnanvaihe/:valinnanvaiheOid/valintatapajono/:valintatapajonoOid/jarjestyskriteeri/:jarjestyskriteeriOid', {controller:JarjestyskriteeriController, templateUrl:TEMPLATE_URL_BASE + 'jarjestyskriteeri/jarjestyskriteeri.html'}).
		when('/hakukohde/:hakukohdeOid/valinnanvaihe/:valinnanvaiheOid/valintatapajono/:valintatapajonoOid/hakijaryhma', {controller:HakijaryhmaValintatapajonoController, templateUrl:TEMPLATE_URL_BASE + 'valintatapajono/hakijaryhmaValintatapajono.html'}).



		//Tarjonta import
		when('/import', {controller: ImportController, templateUrl:TEMPLATE_URL_BASE + 'yhteisvalinnanhallinta/yhteisvalinnanhallinta.html'}).

		//else
		otherwise({redirectTo:'/etusivu'});
});
