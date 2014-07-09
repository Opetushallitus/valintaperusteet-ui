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

        $httpBackend.expectGET('resources/puu?kohdejoukko=&tila=VALMIS&tila=JULKAISTU').respond(puukaikkijson);

        $httpBackend.expectGET('https://itest-virkailija.oph.ware.fi/lokalisointi/cxf/rest/v1/localisation?category=valintaperusteet').respond("");
        $httpBackend.flush();
    }));

    it('should get ValintaryhmaHakukohdeTreeController', function() {
        scope = $rootScope.$new();
        rootScope = $rootScope;
        location = $location;

        $httpBackend.expectGET('haku').respond(hakujson);
        $httpBackend.expectGET('haku/1.2.246.562.29.21702520681').respond(hakuextrajson);
        $httpBackend.expectGET('haku/1.2.246.562.29.41647728207').respond(hakuextrajson);
        $httpBackend.expectGET('haku/1.2.246.562.5.2013112910452702965370').respond(hakuextrajson);
        $httpBackend.expectGET('haku/1.2.246.562.5.2013112910480420004764').respond(hakuextrajson);
        $httpBackend.expectGET('haku/1.2.246.562.29.87103060197').respond(hakuextrajson);
        $httpBackend.expectGET('haku/1.2.246.562.29.16836448445').respond(hakuextrajson);
        $httpBackend.expectGET('haku/1.2.246.562.29.34600360753').respond(hakuextrajson);
        ctrl = $controller('ValintaryhmaHakukohdeTreeController', {'$scope' : scope, 'Treemodel': treemodel,
            'HakukohdeSiirra': hakukohdeSiirra, 'HakuModel': hakuModel});
        $httpBackend.flush();
    });

    it('check initialized variables', function() {
        expect(scope.hakukohteetListingLimit).toBe(100);
        expect(scope.predicate).toBe("nimi");
        expect(scope.hakuModel.hakuOid).toBe("1.2.246.562.29.21702520681");
        expect(scope.hakuModel.haut.length).toBe(7);
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
        $httpBackend.expectGET('resources/puu?kohdejoukko=&tila=VALMIS&tila=JULKAISTU').respond(puukaikkijson);
        $httpBackend.expectGET('resources/puu?hakukohteet=false').respond(puukaikkijson);

        $httpBackend.expectGET('https://itest-virkailija.oph.ware.fi/lokalisointi/cxf/rest/v1/localisation?category=valintaperusteet').respond("");
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
        $httpBackend.expectGET('resources/puu?kohdejoukko=&tila=VALMIS&tila=JULKAISTU').respond(puukaikkijson);

        $httpBackend.expectGET('https://itest-virkailija.oph.ware.fi/lokalisointi/cxf/rest/v1/localisation?category=valintaperusteet').respond("");
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


    it('lisaaHakijaryhma', function() {
        scope.lisaaHakijaryhma('oid111');
        expect(location.path()).toBe("/valintaryhma/" + routeParams.id + "/hakijaryhma/");
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
        $httpBackend.expectGET('resources/puu?kohdejoukko=&tila=VALMIS&tila=JULKAISTU').respond(puukaikkijson);

        $httpBackend.expectGET('https://itest-virkailija.oph.ware.fi/lokalisointi/cxf/rest/v1/localisation?category=valintaperusteet').respond("");
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
        expect(scope.valintaryhmaOid).toBe(routeParams.id);
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
        $httpBackend.expectGET('resources/puu?kohdejoukko=&tila=VALMIS&tila=JULKAISTU').respond(puukaikkijson);

        $httpBackend.expectGET('https://itest-virkailija.oph.ware.fi/lokalisointi/cxf/rest/v1/localisation?category=valintaperusteet').respond("");
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