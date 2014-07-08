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

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });


});