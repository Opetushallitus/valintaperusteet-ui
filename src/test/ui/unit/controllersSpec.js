'use strict';

describe('Testing ValintaryhmaHakukohdeTreeController', function(){
    var rootScope,$rootScope, $controller, $httpBackend, $location, location,
        hakuModel, treemodel, hakukohdeSiirra,scope,ctrl, puukaikkijson, hakujson, hakuextrajson;
    var routeParams = {"hakukohdeOid": "oid2", "hakuOid": "oid1"};
    beforeEach(module('valintaperusteet','MockData'));

    beforeEach(inject(function($injector, puuKaikkiJSON, hakuJSON, hakuExtraJSON) {
        $httpBackend = $injector.get('$httpBackend');
        $rootScope = $injector.get('$rootScope');
        $location = $injector.get('$location');
        $controller = $injector.get('$controller');
        hakuModel = $injector.get('HakuModel');
        treemodel = $injector.get('Treemodel');
        hakukohdeSiirra = $injector.get('HakukohdeSiirra');
        puukaikkijson = puuKaikkiJSON;
        hakujson = hakuJSON;
        hakuextrajson = hakuExtraJSON;

        var casString = ["APP_VALINTOJENTOTEUTTAMINEN_CRUD_1.2.246.562.10.00000000001"];
        $httpBackend.expectGET('/cas/myroles').respond(casString);
        $httpBackend.expectGET('buildversion.txt?auth').respond("1.0");

        $httpBackend.expectGET('resources/puu?hakuOid=&kohdejoukko=&tila=VALMIS&tila=JULKAISTU').respond(puukaikkijson);

        $httpBackend.expectGET('/localisation?category=valintaperusteet').respond("");
        $httpBackend.flush();
    }));

    it('should get ValintaryhmaHakukohdeTreeController', function() {
        scope = $rootScope.$new();
        rootScope = $rootScope;
        location = $location;
        $httpBackend.expectGET('resources/puu?hakuOid=&kohdejoukko=&tila=VALMIS&tila=JULKAISTU').respond(puukaikkijson);
//        $httpBackend.expectGET('haku').respond(hakujson);
//        $httpBackend.expectGET('haku/1.2.246.562.29.21702520681').respond(hakuextrajson);
//        $httpBackend.expectGET('haku/1.2.246.562.29.41647728207').respond(hakuextrajson);
//        $httpBackend.expectGET('haku/1.2.246.562.5.2013112910452702965370').respond(hakuextrajson);
//        $httpBackend.expectGET('haku/1.2.246.562.5.2013112910480420004764').respond(hakuextrajson);
//        $httpBackend.expectGET('haku/1.2.246.562.29.87103060197').respond(hakuextrajson);
//        $httpBackend.expectGET('haku/1.2.246.562.29.16836448445').respond(hakuextrajson);
//        $httpBackend.expectGET('haku/1.2.246.562.29.34600360753').respond(hakuextrajson);
        ctrl = $controller('ValintaryhmaHakukohdeTreeController', {'$scope' : scope, 'Treemodel': treemodel,
            'HakukohdeSiirra': hakukohdeSiirra, 'HakuModel': hakuModel});
        $httpBackend.flush();
    });

    it('check initialized variables', function() {
        expect(scope.hakukohteetListingLimit).toBe(100);
        expect(scope.predicate).toBe("nimi");
        expect(scope.hakuModel.hakuOid).toBe("");
        expect(scope.hakuModel.haut.length).toBe(0);
    });

    it('lazyLoading', function() {
        expect(scope.hakukohteetListingLimit).toBe(100);
        scope.lazyLoading();
        expect(scope.hakukohteetListingLimit).toBe(200);
    });

    it('addClass', function() {
        var ehto = null;
        expect(scope.addClass("test",ehto)).toBe("");
        ehto = true;
        expect(scope.addClass("test",ehto)).toBe("test");
    });

    it('expandNode', function() {
        var alanode = {
            alavalintaryhmat: [],
            hakukohdeViitteet: [],
            isVisible: false
        };

        var node = {
            alavalintaryhmat: null,
            hakukohdeViitteet: null,
            isVisible: false
        };
        scope.expandNode(node);
        expect(node.isVisible).toBeFalsy();

        node.alavalintaryhmat = [alanode];
        node.hakukohdeViitteet = [{}];
        scope.expandNode(node);
        expect(node.isVisible).toBeTruthy();
        expect(alanode.isVisible).toBeTruthy();
    });

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });


});


describe('Testing UusiValintaryhmaController', function(){
    var rootScope,$rootScope, $controller, $httpBackend, $location, location, scope,ctrl,valintaryhmaCreatorModel,
        ylavalintaryhma,puukaikkijson,haunkohdejoukkojson;
    var routeParams = {"hakukohdeOid": "oid2", "hakuOid": "oid1"};
    beforeEach(module('valintaperusteet','MockData'));

    beforeEach(inject(function($injector,puuKaikkiJSON, haunkohdejoukkoJSON) {
        $httpBackend = $injector.get('$httpBackend');
        $rootScope = $injector.get('$rootScope');
        $location = $injector.get('$location');
        $controller = $injector.get('$controller');
        valintaryhmaCreatorModel = $injector.get('ValintaryhmaCreatorModel');
        ylavalintaryhma = $injector.get('Ylavalintaryhma');
        puukaikkijson = puuKaikkiJSON;
        haunkohdejoukkojson = haunkohdejoukkoJSON;

        var casString = ["APP_VALINTOJENTOTEUTTAMINEN_CRUD_1.2.246.562.10.00000000001"];
        $httpBackend.expectGET('/cas/myroles').respond(casString);
        $httpBackend.expectGET('buildversion.txt?auth').respond("1.0");
        $httpBackend.expectGET('resources/puu?hakuOid=&kohdejoukko=&tila=VALMIS&tila=JULKAISTU').respond(puukaikkijson);
        $httpBackend.expectGET('resources/puu?hakukohteet=false').respond(puukaikkijson);

        $httpBackend.expectGET('/localisation?category=valintaperusteet').respond("");
        $httpBackend.flush();
    }));

    it('should get UusiValintaryhmaController', function() {
        scope = $rootScope.$new();
        rootScope = $rootScope;
        location = $location;

        $httpBackend.expectGET('json/haunkohdejoukko/koodi').respond(haunkohdejoukkojson);
        $httpBackend.expectGET('resources/puu?hakukohteet=false').respond(puukaikkijson);

        ctrl = $controller('UusiValintaryhmaController', {'$scope' : scope, '$location': location, '$routeParams': routeParams,
            'ValintaryhmaCreatorModel': valintaryhmaCreatorModel, 'Ylavalintaryhma': ylavalintaryhma});
        $httpBackend.flush();
    });

    it('check initialized variables', function() {
        expect(scope.model.kohdejoukot.length).toBe(3);
    });

    it('cancel', function() {
        scope.cancel();
        expect(location.path()).toBe("/");
    });

    it('organisaatioSelector', function() {
        var data = {
            oid: 'oid11'

        };
        scope.model.valintaryhma = {
            organisaatiot: [{oid:'oid11'}]

        };
        expect(scope.model.valintaryhma.organisaatiot.length).toBe(1);
        scope.organisaatioSelector(data);
        expect(scope.model.valintaryhma.organisaatiot.length).toBe(1);

        data.oid = 'oid111';
        scope.organisaatioSelector(data);
        expect(scope.model.valintaryhma.organisaatiot.length).toBe(2);
    });

    it('persistValintaryhma', function() {
        $httpBackend.expectGET('resources/valintaryhma/parents').respond("[]");
        $httpBackend.expectGET('resources/valintaryhma/lapsi').respond("[]");
        $httpBackend.expectPUT('resources/valintaryhma/lapsi').respond("");
        $httpBackend.expectGET('resources/puu?hakuOid=&kohdejoukko=&tila=VALMIS&tila=JULKAISTU').respond(puukaikkijson);
        valintaryhmaCreatorModel.persistValintaryhma();
        $httpBackend.flush();

    });


    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });


});

describe('Testing ValintaryhmaController', function(){
    var rootScope,$rootScope, $controller, $httpBackend, $location, location, scope,ctrl,valintaryhmaModel,
        puukaikkijson,haunkohdejoukkojson;
    var routeParams = {"id": "oid1"};
    beforeEach(module('valintaperusteet','MockData'));

    beforeEach(inject(function($injector,puuKaikkiJSON,haunkohdejoukkoJSON) {
        $httpBackend = $injector.get('$httpBackend');
        $rootScope = $injector.get('$rootScope');
        $location = $injector.get('$location');
        $controller = $injector.get('$controller');
        valintaryhmaModel = $injector.get('ValintaryhmaModel');
        puukaikkijson = puuKaikkiJSON;
        haunkohdejoukkojson = haunkohdejoukkoJSON;

        var casString = ["APP_VALINTOJENTOTEUTTAMINEN_CRUD_1.2.246.562.10.00000000001"];
        $httpBackend.expectGET('/cas/myroles').respond(casString);
        $httpBackend.expectGET('buildversion.txt?auth').respond("1.0");
        $httpBackend.expectGET('resources/puu?hakuOid=&kohdejoukko=&tila=VALMIS&tila=JULKAISTU').respond(puukaikkijson);

        $httpBackend.expectGET('/localisation?category=valintaperusteet').respond("");
        $httpBackend.flush();
    }));

    it('should get ValintaryhmaController', function() {
        scope = $rootScope.$new();
        rootScope = $rootScope;
        location = $location;
        $httpBackend.expectGET('resources/valintaryhma/'+ routeParams.id).respond('{"nimi":"Ammatillinen koulutus","kohdejoukko":null,"organisaatiot":[],"oid":"14030801791808409465510859807597","hakukohdekoodit":[],"valintakoekoodit":[],"lapsivalintaryhma":null,"lapsihakukohde":null}');
        $httpBackend.expectGET('resources/valintaryhma/'+ routeParams.id+'/valinnanvaihe').respond('[{"nimi":"Harkinnanvaraisten kÃ¤sittelyvaihe","kuvaus":"Harkinnanvaraisten kÃ¤sittelyvaihe","aktiivinen":true,"valinnanVaiheTyyppi":"TAVALLINEN","oid":"1403080180051-8402607974762244585","inheritance":false},{"nimi":"Kielikokeen pakollisuus","kuvaus":"Kielikokeen pakollisuus","aktiivinen":true,"valinnanVaiheTyyppi":"VALINTAKOE","oid":"1403080180604-3934748042048289222","inheritance":false}]');
        $httpBackend.expectGET('resources/valintaryhma/'+ routeParams.id+'/hakijaryhma').respond('[]');
        $httpBackend.expectGET('json/haunkohdejoukko/koodi').respond(haunkohdejoukkojson);
        $httpBackend.expectGET('haku?count=500').respond([]);
        $httpBackend.expectGET('resources/valintaryhma/14030801791808409465510859807597/parents').respond('[{"nimi":"Lukiokoulutus","kohdejoukko":null,"oid":"1403079862403-6606759132794079794"}]');

        ctrl = $controller('ValintaryhmaController', {'$scope' : scope, '$location': location, '$routeParams': routeParams,
            'ValintaryhmaModel': valintaryhmaModel});
        $httpBackend.flush();
    });

    it('check initialized variables', function() {
        expect(scope.valintaryhmaOid).toBe(routeParams.id);
    });

    it('cancel', function() {
        scope.cancel();
        expect(location.path()).toBe("/");
    });

    it('lisaaValinnanVaihe', function() {
        scope.lisaaValinnanVaihe();
        expect(location.path()).toBe("/valintaryhma/" + routeParams.id + "/valinnanvaihe/");
    });

    it('lisaaValintakoeValinnanVaihe', function() {
        scope.lisaaValintakoeValinnanVaihe();
        expect(location.path()).toBe("/valintaryhma/" + routeParams.id + "/valintakoevalinnanvaihe/");
    });

    it('toValintaryhmaForm', function() {
        scope.toValintaryhmaForm();
        expect(location.path()).toBe("/valintaryhma/" + routeParams.id);
    });


//    it('lisaaHakijaryhma', function() {
//        scope.lisaaHakijaryhma('oid111');
//        expect(location.path()).toBe("/valintaryhma/" + routeParams.id + "/hakijaryhma/");
//    });

    it('organisaatioSelector', function() {
        var data = {
            oid: 'oid11'

        };
        scope.model.valintaryhma = {
            organisaatiot: [{oid:'oid11'}]

        };
        expect(scope.model.valintaryhma.organisaatiot.length).toBe(1);
        scope.organisaatioSelector(data);
        expect(scope.model.valintaryhma.organisaatiot.length).toBe(1);

        data.oid = 'oid111';
        scope.organisaatioSelector(data);
        expect(scope.model.valintaryhma.organisaatiot.length).toBe(2);
    });

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

});

describe('Testing HakijaryhmaController', function(){
    var rootScope,$rootScope, $controller, $httpBackend, $location, location, scope,ctrl,valintaryhmaModel,
        puukaikkijson,hakijaryhmaModel,hakukohdeModel,laskentakaavajson;
    var routeParams = {"id": "oid1","hakukohdeOid": null};
    beforeEach(module('valintaperusteet','MockData'));

    beforeEach(inject(function($injector,puuKaikkiJSON,laskentakaavaJSON) {
        $httpBackend = $injector.get('$httpBackend');
        $rootScope = $injector.get('$rootScope');
        $location = $injector.get('$location');
        $controller = $injector.get('$controller');
        valintaryhmaModel = $injector.get('ValintaryhmaModel');
        hakijaryhmaModel = $injector.get('HakijaryhmaModel');
        hakukohdeModel = $injector.get('HakukohdeModel');
        puukaikkijson = puuKaikkiJSON;
        laskentakaavajson = laskentakaavaJSON;

        var casString = ["APP_VALINTOJENTOTEUTTAMINEN_CRUD_1.2.246.562.10.00000000001"];
        $httpBackend.expectGET('/cas/myroles').respond(casString);
        $httpBackend.expectGET('buildversion.txt?auth').respond("1.0");
        $httpBackend.expectGET('resources/puu?hakuOid=&kohdejoukko=&tila=VALMIS&tila=JULKAISTU').respond(puukaikkijson);

        $httpBackend.expectGET('/localisation?category=valintaperusteet').respond("");
        $httpBackend.flush();
    }));

    it('should get HakijaryhmaController', function() {
        scope = $rootScope.$new();
        rootScope = $rootScope;
        location = $location;

        $httpBackend.expectGET('resources/laskentakaava').respond("[]");
        $httpBackend.expectGET('resources/valintaryhma/'+ routeParams.id+'/parents').respond('[{"nimi":"Lukiokoulutus","kohdejoukko":null,"oid":"1403079862403-6606759132794079794"}]');
        $httpBackend.expectGET('resources/laskentakaava?valintaryhma=1403079862403-6606759132794079794').respond(laskentakaavajson);

        ctrl = $controller('HakijaryhmaController', {'$scope' : scope, '$location': location, '$routeParams': routeParams,
            'HakijaryhmaModel': hakijaryhmaModel, 'HakukohdeModel': hakukohdeModel, 'ValintaryhmaModel': valintaryhmaModel});
        $httpBackend.flush();
    });

    it('check initialized variables', function() {
        expect(scope.model.laskentakaavaModel.laskentakaavat.length).toBe(1);
    });

    it('cancel', function() {
        scope.cancel();
        expect(location.path()).toBe("/valintaryhma/" + routeParams.id);
        routeParams.hakukohdeOid="oid2";
        scope.cancel();
        expect(location.path()).toBe("/hakukohde/" + routeParams.hakukohdeOid);
    });

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });


});

describe('Testing ValintaryhmaValinnanvaiheController', function(){
    var rootScope,$rootScope, $controller, $httpBackend, $location, location, scope,ctrl,valintaryhmaModel,
        puukaikkijson,valintaryhmaValinnanvaiheModel;
    var routeParams = {"id": "oid1","hakukohdeOid": null};
    beforeEach(module('valintaperusteet','MockData'));

    beforeEach(inject(function($injector,puuKaikkiJSON) {
        $httpBackend = $injector.get('$httpBackend');
        $rootScope = $injector.get('$rootScope');
        $location = $injector.get('$location');
        $controller = $injector.get('$controller');
        valintaryhmaModel = $injector.get('ValintaryhmaModel');
        valintaryhmaValinnanvaiheModel = $injector.get('ValintaryhmaValinnanvaiheModel');
        puukaikkijson = puuKaikkiJSON;

        var casString = ["APP_VALINTOJENTOTEUTTAMINEN_CRUD_1.2.246.562.10.00000000001"];
        $httpBackend.expectGET('/cas/myroles').respond(casString);
        $httpBackend.expectGET('buildversion.txt?auth').respond("1.0");
        $httpBackend.expectGET('resources/puu?hakuOid=&kohdejoukko=&tila=VALMIS&tila=JULKAISTU').respond(puukaikkijson);

        $httpBackend.expectGET('/localisation?category=valintaperusteet').respond("");
        $httpBackend.flush();
    }));

    it('should get ValintaryhmaValinnanvaiheController', function() {
        scope = $rootScope.$new();
        rootScope = $rootScope;
        location = $location;

        ctrl = $controller('ValintaryhmaValinnanvaiheController', {'$scope' : scope, '$location': location, '$routeParams': routeParams,
            'ValintaryhmaValinnanvaiheModel': valintaryhmaValinnanvaiheModel, 'ValintaryhmaModel': valintaryhmaModel});
    });

    it('check initialized variables', function() {
        expect(scope.valintaryhmaOid).toBe(routeParams.id);
    });

    it('cancel', function() {
        scope.cancel();
        expect(location.path()).toBe("/valintaryhma/" + scope.valintaryhmaOid);
    });

    it('addJono', function() {
        scope.addJono();
        expect(location.path()).toBe("/valintaryhma/" + scope.valintaryhmaOid + "/valinnanvaihe/" + scope.model.valinnanvaihe.oid + "/valintatapajono/");
    });

    it('modifyJono', function() {
        var oid = '111';
        scope.modifyJono(oid);
        expect(location.path()).toBe("/valintaryhma/" + scope.valintaryhmaOid + "/valinnanvaihe/" + scope.model.valinnanvaihe.oid + "/valintatapajono/" + oid);
    });

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });


});

describe('Testing ValintaryhmaValintatapajonoController', function(){
    var rootScope,$rootScope, $controller, $httpBackend, $location, $timeout, location, scope,ctrl,valintatapajonoModel,
        valintaryhmaValinnanvaiheModel;
    var routeParams = {"id": "oid1","valinnanvaiheOid": "oid2"};
    beforeEach(module('valintaperusteet','MockData'));

    beforeEach(inject(function($injector) {
        $httpBackend = $injector.get('$httpBackend');
        $rootScope = $injector.get('$rootScope');
        $location = $injector.get('$location');
        $controller = $injector.get('$controller');
        $timeout = $injector.get('$timeout');
        valintatapajonoModel = $injector.get('ValintatapajonoModel');
        valintaryhmaValinnanvaiheModel = $injector.get('ValintaryhmaValinnanvaiheModel');

        var casString = ["APP_VALINTOJENTOTEUTTAMINEN_CRUD_1.2.246.562.10.00000000001"];
        $httpBackend.expectGET('/cas/myroles').respond(casString);
        $httpBackend.expectGET('buildversion.txt?auth').respond("1.0");
        $httpBackend.expectGET('/localisation?category=valintaperusteet').respond("");
        $httpBackend.flush();
    }));

    it('should get ValintaryhmaValintatapajonoController', function() {
        scope = $rootScope.$new();
        rootScope = $rootScope;
        location = $location;

        ctrl = $controller('ValintaryhmaValintatapajonoController', {'$scope' : scope, '$location': location, '$routeParams': routeParams,
            '$timeout': $timeout, 'ValintatapajonoModel': valintatapajonoModel, 'ValintaryhmaValinnanvaiheModel': valintaryhmaValinnanvaiheModel});
    });

    it('check initialized variables', function() {
        expect(scope.valintaryhmaOid).toBe(routeParams.id);
        expect(scope.valinnanvaiheOid).toBe(routeParams.valinnanvaiheOid);
    });

    it('cancel', function() {
        scope.cancel();
        expect(location.path()).toBe("/valintaryhma/" + scope.valintaryhmaOid + '/valinnanvaihe/'+ scope.valinnanvaiheOid );
    });

    it('addKriteeri', function() {
        scope.addKriteeri();
        expect(location.path()).toBe("/valintaryhma/" + scope.valintaryhmaOid
            + '/valinnanvaihe/' + scope.valinnanvaiheOid
            + '/valintatapajono/' + scope.model.valintatapajono.oid + '/jarjestyskriteeri/');
    });

    it('addHakijaryhma', function() {
        scope.addHakijaryhma();
        expect(location.path()).toBe("/valintaryhma/" + scope.valintaryhmaOid
            + '/valinnanvaihe/' + scope.valinnanvaiheOid
            + '/valintatapajono/' + scope.model.valintatapajono.oid + '/hakijaryhma');
    });

    it('modifyKriteeri', function() {
        var oid = '111';
        scope.modifyKriteeri(oid);
        expect(location.path()).toBe("/valintaryhma/" + scope.valintaryhmaOid
            + '/valinnanvaihe/' + scope.valinnanvaiheOid
            + '/valintatapajono/' + scope.model.valintatapajono.oid
            + '/jarjestyskriteeri/' + oid);
    });

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

});

describe('Testing JarjestyskriteeriController', function(){
    var rootScope,$rootScope, $controller, $httpBackend, $location, location, scope,ctrl,valintatapajonoModel,valinnanvaiheValintatapajonoModel,
        jarjestyskriteeriModel,hakukohdejson, valintatapajonojson,laskentakaavajson,laskentakaavaonejson;
    var routeParams = {"id": "oid1","valinnanvaiheOid": "oid2","hakukohdeOid": "oid3","valintatapajonoOid": "oid4"};
    beforeEach(module('valintaperusteet','MockData'));

    beforeEach(inject(function($injector,hakukohdeJSON,valintatapajonoJSON,laskentakaavaJSON,laskentakaavaoneJSON) {
        $httpBackend = $injector.get('$httpBackend');
        $rootScope = $injector.get('$rootScope');
        $location = $injector.get('$location');
        $controller = $injector.get('$controller');
        valintatapajonoModel = $injector.get('ValintatapajonoModel');
        jarjestyskriteeriModel = $injector.get('JarjestyskriteeriModel');
        valinnanvaiheValintatapajonoModel = $injector.get('ValinnanvaiheValintatapajono');
        hakukohdejson = hakukohdeJSON;
        valintatapajonojson = valintatapajonoJSON;
        laskentakaavajson = laskentakaavaJSON;
        laskentakaavaonejson = laskentakaavaoneJSON;

        var casString = ["APP_VALINTOJENTOTEUTTAMINEN_CRUD_1.2.246.562.10.00000000001"];
        $httpBackend.expectGET('/cas/myroles').respond(casString);
        $httpBackend.expectGET('buildversion.txt?auth').respond("1.0");
        $httpBackend.expectGET('/localisation?category=valintaperusteet').respond("");
        $httpBackend.flush();
    }));

    it('should get JarjestyskriteeriController', function() {
        scope = $rootScope.$new();
        rootScope = $rootScope;
        location = $location;

        $httpBackend.expectGET('resources/laskentakaava').respond("[]");
        $httpBackend.expectGET('resources/laskentakaava?hakukohde='+routeParams.hakukohdeOid).respond("[]");
        $httpBackend.expectGET('resources/hakukohde/'+routeParams.hakukohdeOid).respond(hakukohdejson);
        $httpBackend.expectGET('resources/valintaryhma/'+ routeParams.id+'/parents').respond('[{"nimi":"Lukiokoulutus","kohdejoukko":null,"oid":"1403079862403-6606759132794079794"}]');

        // KORJAA
        $httpBackend.expectGET('resources/valinnanvaihe/'+routeParams.valinnanvaiheOid+'/valintatapajono').respond([valintatapajonojson]);
        $httpBackend.expectGET('resources/valintatapajono/'+routeParams.valintatapajonoOid).respond(valintatapajonojson);
        $httpBackend.expectGET('resources/valintatapajono/'+routeParams.valintatapajonoOid+"/hakijaryhma").respond("[]");
        $httpBackend.expectGET('resources/valintatapajono/'+routeParams.valintatapajonoOid+"/jarjestyskriteeri").respond('[{"metatiedot":"Ulkomailla suoritettu koulutus tai oppivelvollisuuden suorittaminen keskeytynyt","aktiivinen":true,"oid":"1403080024594-3389074374885820341","valintatapajonoOid":"14030800242802764498205598029585","inheritance":false,"laskentakaavaId":4140}]');
        $httpBackend.expectGET('resources/valintaryhma/parents').respond("[]");
        $httpBackend.expectGET('resources/laskentakaava?valintaryhma=1403079862403-6606759132794079794').respond(laskentakaavajson);
        $httpBackend.expectGET('resources/laskentakaava/4140?funktiopuu=false').respond(laskentakaavaonejson);

        ctrl = $controller('JarjestyskriteeriController', {'$scope' : scope, '$location': location, '$routeParams': routeParams,
            'jarjestyskriteeriModel': jarjestyskriteeriModel, 'ValintatapajonoModel': valintatapajonoModel});

        $httpBackend.flush();
    });

    it('check initialized variables', function() {
        expect(scope.valintaryhmaOid).toBe(routeParams.id);
        expect(scope.valinnanvaiheOid).toBe(routeParams.valinnanvaiheOid);
        expect(scope.hakukohdeOid).toBe(routeParams.hakukohdeOid);
        expect(scope.valintatapajonoOid).toBe(routeParams.valintatapajonoOid);
    });

    it('cancel', function() {
        scope.cancel();
        expect(location.path()).toBe("/hakukohde/" + routeParams.hakukohdeOid + '/valinnanvaihe/' + routeParams.valinnanvaiheOid +
            '/valintatapajono/' + routeParams.valintatapajonoOid);
        routeParams.hakukohdeOid=null;
        scope.cancel();
        expect(location.path()).toBe("/valintaryhma/" + routeParams.id + '/valinnanvaihe/' + routeParams.valinnanvaiheOid +
            '/valintatapajono/' + routeParams.valintatapajonoOid);
    });

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });


});


describe('Testing ValintaryhmaValintakoeValinnanvaiheController', function(){
    var rootScope,$rootScope, $controller, $httpBackend, $location, location, scope,ctrl,
        valintaryhmaValintakoeValinnanvaiheModel,valintaryhmaModel,puukaikkijson;
    var routeParams = {"id": "oid1","valinnanvaiheOid": "oid2","hakukohdeOid": "oid3","valintatapajonoOid": "oid4"};
    beforeEach(module('valintaperusteet','MockData'));

    beforeEach(inject(function($injector,puuKaikkiJSON) {
        $httpBackend = $injector.get('$httpBackend');
        $rootScope = $injector.get('$rootScope');
        $location = $injector.get('$location');
        $controller = $injector.get('$controller');
        valintaryhmaValintakoeValinnanvaiheModel = $injector.get('ValintaryhmaValintakoeValinnanvaiheModel');
        valintaryhmaModel = $injector.get('ValintaryhmaModel');
        puukaikkijson = puuKaikkiJSON;

        var casString = ["APP_VALINTOJENTOTEUTTAMINEN_CRUD_1.2.246.562.10.00000000001"];
        $httpBackend.expectGET('/cas/myroles').respond(casString);
        $httpBackend.expectGET('buildversion.txt?auth').respond("1.0");
        $httpBackend.expectGET('resources/puu?hakuOid=&kohdejoukko=&tila=VALMIS&tila=JULKAISTU').respond(puukaikkijson);
        $httpBackend.expectGET('/localisation?category=valintaperusteet').respond("");
        $httpBackend.flush();
    }));

    it('should get ValintaryhmaValintakoeValinnanvaiheController', function() {
        scope = $rootScope.$new();
        rootScope = $rootScope;
        location = $location;

        ctrl = $controller('ValintaryhmaValintakoeValinnanvaiheController', {'$scope' : scope, '$location': location, '$routeParams': routeParams,
            'ValintaryhmaValintakoeValinnanvaiheModel': valintaryhmaValintakoeValinnanvaiheModel, 'ValintaryhmaModel': valintaryhmaModel});

    });

    it('check initialized variables', function() {
        expect(scope.valintaryhmaOid).toBe(routeParams.id);
    });

    it('modifyvalintakoe', function() {
        var valintakoeOid = '121212';
        scope.modifyvalintakoe(valintakoeOid);
        expect(location.path()).toBe("/valintaryhma/" + scope.valintaryhmaOid + "/valintakoevalinnanvaihe/" + scope.model.valintakoevalinnanvaihe.oid + "/valintakoe/" + valintakoeOid);
    });

    it('addValintakoe', function() {
        scope.addValintakoe();
        expect(location.path()).toBe("/valintaryhma/" + scope.valintaryhmaOid + "/valintakoevalinnanvaihe/" + scope.model.valintakoevalinnanvaihe.oid + "/valintakoe/");
    });

    it('cancel', function() {
        scope.cancel();
        expect(location.path()).toBe("/valintaryhma/" + scope.valintaryhmaOid);
    });

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });
});

describe('Testing ValintaryhmaValintakoeController', function(){
    var rootScope,$rootScope, $controller, $httpBackend, $location, location, scope,ctrl,
        valintaryhmaValintakoeValinnanvaiheModel,valintakoeModel,laskentakaavajson;
    var routeParams = {"id": "oid1","valinnanvaiheOid": "oid2","hakukohdeOid": "oid3","valintatapajonoOid": "oid4"};
    beforeEach(module('valintaperusteet','MockData'));

    beforeEach(inject(function($injector,laskentakaavaJSON) {
        $httpBackend = $injector.get('$httpBackend');
        $rootScope = $injector.get('$rootScope');
        $location = $injector.get('$location');
        $controller = $injector.get('$controller');
        valintaryhmaValintakoeValinnanvaiheModel = $injector.get('ValintaryhmaValintakoeValinnanvaiheModel');
        valintakoeModel = $injector.get('ValintakoeModel');
        laskentakaavajson = laskentakaavaJSON;

        var casString = ["APP_VALINTOJENTOTEUTTAMINEN_CRUD_1.2.246.562.10.00000000001"];
        $httpBackend.expectGET('/cas/myroles').respond(casString);
        $httpBackend.expectGET('buildversion.txt?auth').respond("1.0");
        $httpBackend.expectGET('/localisation?category=valintaperusteet').respond("");
        $httpBackend.flush();
    }));

    it('should get ValintaryhmaValintakoeController', function() {
        scope = $rootScope.$new();
        rootScope = $rootScope;
        location = $location;

        $httpBackend.expectGET('resources/laskentakaava').respond("[]");
        $httpBackend.expectGET('resources/valintaryhma/'+ routeParams.id+'/parents').respond('[{"nimi":"Lukiokoulutus","kohdejoukko":null,"oid":"1403079862403-6606759132794079794"}]');
        $httpBackend.expectGET('resources/laskentakaava?valintaryhma=1403079862403-6606759132794079794').respond(laskentakaavajson);

        ctrl = $controller('ValintaryhmaValintakoeController', {'$scope' : scope, '$location': location, '$routeParams': routeParams,
            'ValintakoeModel': valintakoeModel, 'ValintaryhmaValintakoeValinnanvaiheModel': valintaryhmaValintakoeValinnanvaiheModel});
        $httpBackend.flush();
    });

    it('check initialized variables', function() {
        expect(scope.valintaryhmaOid).toBe(routeParams.id);
    });

    it('cancel', function() {
        scope.cancel();
        expect(location.path()).toBe("/" + scope.model.getParentGroupType($location.$$path) + "/" + scope.valintaryhmaOid + "/valintakoevalinnanvaihe/" + scope.valintakoeValinnanvaiheOid);
    });

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });
});

describe('Testing HakukohdeValintakoeValinnanvaiheController', function(){
    var rootScope,$rootScope, $controller, $httpBackend, $location, location, scope,ctrl,
        hakukohdeValintakoeValinnanvaiheModel,hakukohdeModel;
    var routeParams = {"id": "oid1","valinnanvaiheOid": "oid2","hakukohdeOid": "oid3","valintatapajonoOid": "oid4"};
    beforeEach(module('valintaperusteet','MockData'));

    beforeEach(inject(function($injector) {
        $httpBackend = $injector.get('$httpBackend');
        $rootScope = $injector.get('$rootScope');
        $location = $injector.get('$location');
        $controller = $injector.get('$controller');
        hakukohdeValintakoeValinnanvaiheModel = $injector.get('HakukohdeValintakoeValinnanvaiheModel');
        hakukohdeModel = $injector.get('HakukohdeModel');

        var casString = ["APP_VALINTOJENTOTEUTTAMINEN_CRUD_1.2.246.562.10.00000000001"];
        $httpBackend.expectGET('/cas/myroles').respond(casString);
        $httpBackend.expectGET('buildversion.txt?auth').respond("1.0");
        $httpBackend.expectGET('/localisation?category=valintaperusteet').respond("");
        $httpBackend.flush();
    }));

    it('should get HakukohdeValintakoeValinnanvaiheController', function() {
        scope = $rootScope.$new();
        rootScope = $rootScope;
        location = $location;

        ctrl = $controller('HakukohdeValintakoeValinnanvaiheController', {'$scope' : scope, '$location': location, '$routeParams': routeParams,
            'HakukohdeValintakoeValinnanvaiheModel': hakukohdeValintakoeValinnanvaiheModel, 'HakukohdeModel': hakukohdeModel});
    });

    it('check initialized variables', function() {
        expect(scope.hakukohdeOid).toBe(routeParams.hakukohdeOid);
    });

    it('cancel', function() {
        scope.cancel();
        expect(location.path()).toBe("/hakukohde/" + scope.hakukohdeOid);
    });

    it('modifyvalintakoe', function() {
        var valintakoeOid = '111';
        scope.modifyvalintakoe(valintakoeOid);
        expect(location.path()).toBe("/hakukohde/" + scope.hakukohdeOid + "/valintakoevalinnanvaihe/" + scope.model.valintakoevalinnanvaihe.oid + "/valintakoe/" + valintakoeOid);
    });

    it('addValintakoe', function() {
        scope.addValintakoe();
        expect(location.path()).toBe("/hakukohde/" + scope.hakukohdeOid + "/valintakoevalinnanvaihe/" + scope.model.valintakoevalinnanvaihe.oid + "/valintakoe/");
    });

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });
});

describe('Testing HakukohdeValintakoeController', function(){
    var rootScope,$rootScope, $controller, $httpBackend, $location, location, scope,ctrl,
        hakukohdeValintakoeValinnanvaiheModel,valintakoeModel,valintaryhmaValintakoeValinnanvaiheModel,
        valintakoejson,hakukohdejson;
    var routeParams = {"id": "oid1","valinnanvaiheOid": "oid2","hakukohdeOid": "oid3","valintatapajonoOid": "oid4"};
    beforeEach(module('valintaperusteet','MockData'));

    beforeEach(inject(function($injector,valintakoeJSON,hakukohdeJSON) {
        $httpBackend = $injector.get('$httpBackend');
        $rootScope = $injector.get('$rootScope');
        $location = $injector.get('$location');
        $controller = $injector.get('$controller');
        hakukohdeValintakoeValinnanvaiheModel = $injector.get('HakukohdeValintakoeValinnanvaiheModel');
        valintakoeModel = $injector.get('ValintakoeModel');
        valintaryhmaValintakoeValinnanvaiheModel = $injector.get('ValintaryhmaValintakoeValinnanvaiheModel');
        valintakoejson = valintakoeJSON;
        hakukohdejson = hakukohdeJSON;

        var casString = ["APP_VALINTOJENTOTEUTTAMINEN_CRUD_1.2.246.562.10.00000000001"];
        $httpBackend.expectGET('/cas/myroles').respond(casString);
        $httpBackend.expectGET('buildversion.txt?auth').respond("1.0");
        $httpBackend.expectGET('/localisation?category=valintaperusteet').respond("");
        $httpBackend.flush();
    }));

    it('should get HakukohdeValintakoeController', function() {
        scope = $rootScope.$new();
        rootScope = $rootScope;
        location = $location;

        $httpBackend.expectGET('resources/valintakoe/'+routeParams.id).respond(valintakoejson);
        $httpBackend.expectGET('resources/laskentakaava').respond("[]");
        $httpBackend.expectGET('resources/laskentakaava?hakukohde='+routeParams.hakukohdeOid).respond("[]");
        $httpBackend.expectGET('resources/hakukohde/'+routeParams.hakukohdeOid).respond(hakukohdejson);
        $httpBackend.expectGET('resources/valintaryhma/parents').respond("[]");

        ctrl = $controller('HakukohdeValintakoeController', {'$scope' : scope, '$location': location, '$routeParams': routeParams,
            'ValintakoeModel':valintakoeModel,
            'ValintaryhmaValintakoeValinnanvaiheModel':valintaryhmaValintakoeValinnanvaiheModel,
            'HakukohdeValintakoeValinnanvaiheModel': hakukohdeValintakoeValinnanvaiheModel});
        $httpBackend.flush();
    });

    it('check initialized variables', function() {
        expect(scope.hakukohdeOid).toBe(routeParams.hakukohdeOid);
        expect(scope.valintakoeOid).toBe(routeParams.id);
    });

    it('cancel', function() {
        scope.cancel();
        expect(location.path()).toBe("/" + scope.model.getParentGroupType($location.$$path) + "/" + scope.hakukohdeOid + "/valintakoevalinnanvaihe/" + scope.valintakoeValinnanvaiheOid);
    });

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });
});

describe('Testing UusiHakukohdeController', function(){
    var rootScope,$rootScope, $controller, $httpBackend, $location, location, scope,ctrl,
        uusiHakukohdeModel,ylavalintaryhma,haku,tarjontaHaku,haunTiedot,hakukohde,puukaikkijson,hakujson,
        hakuextrajson;
    var routeParams = {"id": "oid1","valinnanvaiheOid": "oid2","hakukohdeOid": "oid3","valintatapajonoOid": "oid4"};
    beforeEach(module('valintaperusteet','MockData'));

    beforeEach(inject(function($injector,puuKaikkiJSON,hakuJSON,hakuExtraJSON) {
        $httpBackend = $injector.get('$httpBackend');
        $rootScope = $injector.get('$rootScope');
        $location = $injector.get('$location');
        $controller = $injector.get('$controller');
        uusiHakukohdeModel = $injector.get('UusiHakukohdeModel');
        ylavalintaryhma = $injector.get('Ylavalintaryhma');
        haku = $injector.get('Haku');
        puukaikkijson = puuKaikkiJSON;
        hakujson = hakuJSON;
        hakuextrajson = hakuExtraJSON;

        tarjontaHaku = $injector.get('TarjontaHaku');
        haunTiedot = $injector.get('HaunTiedot');
        hakukohde = $injector.get('Hakukohde');

        var casString = ["APP_VALINTOJENTOTEUTTAMINEN_CRUD_1.2.246.562.10.00000000001"];
        $httpBackend.expectGET('/cas/myroles').respond(casString);
        $httpBackend.expectGET('buildversion.txt?auth').respond("1.0");
        $httpBackend.expectGET('resources/puu?hakukohteet=false').respond(puukaikkijson);
        $httpBackend.expectGET('/localisation?category=valintaperusteet').respond("");
        $httpBackend.flush();
    }));

    it('should get UusiHakukohdeController', function() {
        scope = $rootScope.$new();
        rootScope = $rootScope;
        location = $location;
        $httpBackend.expectGET('resources/puu?hakukohteet=false').respond(puukaikkijson);
        $httpBackend.expectGET('haku?count=500').respond(hakujson);
        $httpBackend.expectGET('haku/1.2.246.562.29.21702520681').respond(hakuextrajson);
        $httpBackend.expectGET('haku/1.2.246.562.29.41647728207').respond(hakuextrajson);
        $httpBackend.expectGET('haku/1.2.246.562.5.2013112910452702965370').respond(hakuextrajson);
        $httpBackend.expectGET('haku/1.2.246.562.5.2013112910480420004764').respond(hakuextrajson);
        $httpBackend.expectGET('haku/1.2.246.562.29.87103060197').respond(hakuextrajson);
        $httpBackend.expectGET('haku/1.2.246.562.29.16836448445').respond(hakuextrajson);
        $httpBackend.expectGET('haku/1.2.246.562.29.34600360753').respond(hakuextrajson);
        ctrl = $controller('UusiHakukohdeController', {'$scope' : scope, '$location': location,
            'UusiHakukohdeModel':uusiHakukohdeModel,'Ylavalintaryhma':ylavalintaryhma,
            'Haku':haku,'TarjontaHaku': tarjontaHaku,'HaunTiedot':haunTiedot,'Hakukohde':hakukohde});
        $httpBackend.flush();
    });

    it('check initialized variables', function() {
        expect(scope.predicate).toBe("nimi");
        expect(scope.haut.length).toBe(7);
        expect(scope.model.tilat.length).toBe(5);
    });

    it('cancel', function() {
        scope.cancel();
        expect(location.path()).toBe("/");
    });

    it('setHakuoid', function() {
        var item = {
            oid: '111'
        };
        scope.setHakuoid(item);
        expect(scope.model.hakukohde.hakuoid).toBe(item.oid);
        expect(scope.model.hakukohde.oid).toBeUndefined();
    });

    it('setHakukohdeoid', function() {
        var item = {
            hakukohdeOid: '111',
            hakukohdeTila: 'tila',
            tarjoajaNimi: {fi:'tfi'},
            hakukohdeNimi: {fi:'hfi'},
            tarjoajaOid: 'oid111'
        };
        scope.setHakukohdeoid(item);
        expect(scope.model.hakukohde.oid).toBe(item.hakukohdeOid);
        expect(scope.model.hakukohde.tila).toBe(item.hakukohdeTila);
        expect(scope.model.hakukohde.nimi).toBe(item.tarjoajaNimi.fi + ', ' + item.hakukohdeNimi.fi);
        expect(scope.model.hakukohde.tarjoajaOid).toBe(item.tarjoajaOid);
    });


    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });
});

describe('Testing ValinnanVaiheController', function(){
    var rootScope,$rootScope, $controller, $httpBackend, $location, location, scope,ctrl,
        hakukohdeValinnanVaiheModel,hakukohdeModel,valintatapajonoalljson;
    var routeParams = {"id": "oid1","valinnanvaiheOid": "oid2","hakukohdeOid": "oid3","valintatapajonoOid": "oid4"};
    beforeEach(module('valintaperusteet','MockData'));

    beforeEach(inject(function($injector,valintatapajonoallJSON) {
        $httpBackend = $injector.get('$httpBackend');
        $rootScope = $injector.get('$rootScope');
        $location = $injector.get('$location');
        $controller = $injector.get('$controller');
        hakukohdeValinnanVaiheModel = $injector.get('HakukohdeValinnanVaiheModel');
        hakukohdeModel = $injector.get('HakukohdeModel');
        valintatapajonoalljson = valintatapajonoallJSON;

        var casString = ["APP_VALINTOJENTOTEUTTAMINEN_CRUD_1.2.246.562.10.00000000001"];
        $httpBackend.expectGET('/cas/myroles').respond(casString);
        $httpBackend.expectGET('buildversion.txt?auth').respond("1.0");
        $httpBackend.expectGET('/localisation?category=valintaperusteet').respond("");
        $httpBackend.flush();
    }));

    it('should get ValinnanVaiheController', function() {
        scope = $rootScope.$new();
        rootScope = $rootScope;
        location = $location;
        $httpBackend.expectGET('resources/valinnanvaihe/'+routeParams.valinnanvaiheOid).respond("{}");
        $httpBackend.expectGET('resources/valinnanvaihe/'+routeParams.valinnanvaiheOid+"/valintatapajono").respond(valintatapajonoalljson);
        $httpBackend.expectGET('resources/valinnanvaihe/'+routeParams.valinnanvaiheOid+"/kuuluuSijoitteluun").respond('{"sijoitteluun":false}');

        ctrl = $controller('ValinnanVaiheController', {'$scope' : scope, '$location': location, '$routeParams': routeParams,
            'HakukohdeValinnanVaiheModel': hakukohdeValinnanVaiheModel, 'HakukohdeModel': hakukohdeModel});
        $httpBackend.flush();
    });

    it('check initialized variables', function() {
        expect(scope.hakukohdeOid).toBe(routeParams.hakukohdeOid);
        expect(scope.valinnanvaiheOid).toBe(routeParams.valinnanvaiheOid);
        expect(scope.model.valintatapajonot.length).toBe(1);
    });

    it('cancel', function() {
        scope.cancel();
        expect(location.path()).toBe("/hakukohde/" + scope.hakukohdeOid);
    });

    it('addJono', function() {
        scope.addJono();
        expect(location.path()).toBe("/hakukohde/" + scope.hakukohdeOid + "/valinnanvaihe/" + scope.model.valinnanvaihe.oid + "/valintatapajono/");
    });

    it('addJono', function() {
        var oid = '222';
        scope.modifyJono(oid);
        expect(location.path()).toBe("/hakukohde/" + scope.hakukohdeOid + "/valinnanvaihe/" + scope.model.valinnanvaihe.oid + "/valintatapajono/" + oid);
    });

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });
});


describe('Testing HakukohdeValintatapajonoController', function(){
    var rootScope,$rootScope, $controller, $httpBackend, $location, location, scope,ctrl,
        hakukohdeValinnanVaiheModel,valintatapajonoModel,valintatapajonojson,laskentakaavaonejson;
    var routeParams = {"id": "oid1","valinnanvaiheOid": "oid2","hakukohdeOid": "oid3","valintatapajonoOid": "oid4"};
    beforeEach(module('valintaperusteet','MockData'));

    beforeEach(inject(function($injector,valintatapajonoJSON,laskentakaavaoneJSON) {
        $httpBackend = $injector.get('$httpBackend');
        $rootScope = $injector.get('$rootScope');
        $location = $injector.get('$location');
        $controller = $injector.get('$controller');
        hakukohdeValinnanVaiheModel = $injector.get('HakukohdeValinnanVaiheModel');
        valintatapajonoModel = $injector.get('ValintatapajonoModel');
        valintatapajonojson = valintatapajonoJSON;
        laskentakaavaonejson = laskentakaavaoneJSON;

        var casString = ["APP_VALINTOJENTOTEUTTAMINEN_CRUD_1.2.246.562.10.00000000001"];
        $httpBackend.expectGET('/cas/myroles').respond(casString);
        $httpBackend.expectGET('buildversion.txt?auth').respond("1.0");
        $httpBackend.expectGET('/localisation?category=valintaperusteet').respond("");
        $httpBackend.flush();
    }));

    it('should get HakukohdeValintatapajonoController', function() {
        scope = $rootScope.$new();
        rootScope = $rootScope;
        location = $location;

        $httpBackend.expectGET('resources/valinnanvaihe/'+routeParams.valinnanvaiheOid+'/valintatapajono').respond([valintatapajonojson]);
        $httpBackend.expectGET('resources/valintatapajono/'+routeParams.valintatapajonoOid).respond(valintatapajonojson);
        $httpBackend.expectGET('resources/valintatapajono/'+routeParams.valintatapajonoOid+"/hakijaryhma").respond("[]");
        $httpBackend.expectGET('resources/valintatapajono/'+routeParams.valintatapajonoOid+"/jarjestyskriteeri").respond('[{"metatiedot":"Ulkomailla suoritettu koulutus tai oppivelvollisuuden suorittaminen keskeytynyt","aktiivinen":true,"oid":"1403080024594-3389074374885820341","valintatapajonoOid":"14030800242802764498205598029585","inheritance":false,"laskentakaavaId":4140}]');
        $httpBackend.expectGET('resources/laskentakaava/4140?funktiopuu=false').respond(laskentakaavaonejson);

        ctrl = $controller('HakukohdeValintatapajonoController', {'$scope' : scope, '$location': location, '$routeParams': routeParams,
            'ValintatapajonoModel':valintatapajonoModel, 'HakukohdeValinnanVaiheModel': hakukohdeValinnanVaiheModel});
        $httpBackend.flush();
    });

    it('check initialized variables', function() {
        expect(scope.hakukohdeOid).toBe(routeParams.hakukohdeOid);
        expect(scope.valinnanvaiheOid).toBe(routeParams.valinnanvaiheOid);
        expect(scope.model.hakijaryhmat.length).toBe(0);
        expect(scope.model.jarjestyskriteerit.length).toBe(1);
    });

    it('cancel', function() {
        scope.cancel();
        expect(location.path()).toBe("/hakukohde/" + scope.hakukohdeOid + '/valinnanvaihe/'+ scope.valinnanvaiheOid);
    });


    it('addKriteeri', function() {
        scope.addKriteeri();
        expect(location.path()).toBe("/hakukohde/" + scope.hakukohdeOid
            + '/valinnanvaihe/' + scope.valinnanvaiheOid
            + '/valintatapajono/' + scope.model.valintatapajono.oid + '/jarjestyskriteeri/');
    });

    it('addHakijaryhma', function() {
        scope.addHakijaryhma();
        expect(location.path()).toBe("/hakukohde/" + scope.hakukohdeOid
            + '/valinnanvaihe/' + scope.valinnanvaiheOid
            + '/valintatapajono/' + scope.model.valintatapajono.oid + '/hakijaryhma');
    });

    it('modifyKriteeri', function() {
        var oid = '2222';
        scope.modifyKriteeri(oid);
        expect("/hakukohde/" + scope.hakukohdeOid
            + '/valinnanvaihe/' + scope.valinnanvaiheOid
            + '/valintatapajono/' + scope.model.valintatapajono.oid
            + '/jarjestyskriteeri/' + oid);
    });



    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });
});


describe('Testing ImportController', function(){
    var rootScope,$rootScope, $controller, $httpBackend, $location, location, scope,ctrl,
        hakuModel, tarjontaImport, treemodel,puukaikkijson,hakujson,hakuextrajson;
    var routeParams = {"id": "oid1","valinnanvaiheOid": "oid2","hakukohdeOid": "oid3","valintatapajonoOid": "oid4"};
    beforeEach(module('valintaperusteet','MockData'));

    beforeEach(inject(function($injector,puuKaikkiJSON,hakuJSON,hakuExtraJSON) {
        $httpBackend = $injector.get('$httpBackend');
        $rootScope = $injector.get('$rootScope');
        $location = $injector.get('$location');
        $controller = $injector.get('$controller');
        hakuModel = $injector.get('HakuModel');
        tarjontaImport = $injector.get('TarjontaImport');
        treemodel = $injector.get('Treemodel');
        puukaikkijson = puuKaikkiJSON;
        hakujson = hakuJSON;
        hakuextrajson = hakuExtraJSON;

        var casString = ["APP_VALINTOJENTOTEUTTAMINEN_CRUD_1.2.246.562.10.00000000001"];
        $httpBackend.expectGET('/cas/myroles').respond(casString);
        $httpBackend.expectGET('buildversion.txt?auth').respond("1.0");
        $httpBackend.expectGET('resources/puu?hakuOid=&kohdejoukko=&tila=VALMIS&tila=JULKAISTU').respond(puukaikkijson);
        $httpBackend.expectGET('/localisation?category=valintaperusteet').respond("");
        $httpBackend.flush();
    }));

    it('should get ImportController', function() {
        scope = $rootScope.$new();
        rootScope = $rootScope;
        location = $location;

        $httpBackend.expectGET('haku?count=500').respond(hakujson);
        $httpBackend.expectGET('haku/1.2.246.562.29.21702520681').respond(hakuextrajson);
        $httpBackend.expectGET('haku/1.2.246.562.29.41647728207').respond(hakuextrajson);
        $httpBackend.expectGET('haku/1.2.246.562.5.2013112910452702965370').respond(hakuextrajson);
        $httpBackend.expectGET('haku/1.2.246.562.5.2013112910480420004764').respond(hakuextrajson);
        $httpBackend.expectGET('haku/1.2.246.562.29.87103060197').respond(hakuextrajson);
        $httpBackend.expectGET('haku/1.2.246.562.29.16836448445').respond(hakuextrajson);
        $httpBackend.expectGET('haku/1.2.246.562.29.34600360753').respond(hakuextrajson);
        ctrl = $controller('ImportController', {'$scope' : scope, '$location': location, '$routeParams': routeParams,
            'HakuModel':hakuModel, 'TarjontaImport': tarjontaImport, 'Treemodel': treemodel});
        $httpBackend.flush();
    });

    it('check initialized variables', function() {
        expect(scope.model.hakuOid).toBe('1.2.246.562.29.21702520681');
        expect(scope.model.haut.length).toBe(7);
    });

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });
});