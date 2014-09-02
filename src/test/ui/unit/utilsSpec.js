describe('Testing Utils', function(){
    var treemodel,model,parentoid, utils, $httpBackend, puukaikkijson;
    'use strict';

    beforeEach(module('valintaperusteet','MockData'));

    beforeEach(inject(function($injector, Utils, puuKaikkiJSON) {
        $httpBackend = $injector.get('$httpBackend');
        treemodel = $injector.get('Treemodel');
        puukaikkijson = puuKaikkiJSON;
        parentoid = '1403080115747611864361004476900';
        model = {
            parentOid: '123213213',
            valintaryhma: {
                oid: '1233333',
                nimi: 'Painotettu keskiarvo, pÃ¤Ã¤sykoe ja lisÃ¤nÃ¤yttÃ¶'
            }
        };
        utils = Utils;
        var casString = ["APP_VALINTOJENTOTEUTTAMINEN_CRUD_1.2.246.562.10.00000000001"];
        $httpBackend.expectGET('/cas/myroles').respond(casString);
        $httpBackend.expectGET('buildversion.txt?auth').respond("1.0");
        $httpBackend.expectGET('resources/puu?hakuOid=&kohdejoukko=&tila=VALMIS&tila=JULKAISTU').respond(puukaikkijson);
        $httpBackend.expectGET('/localisation?category=valintaperusteet').respond("");

        $httpBackend.flush();
    }));

    it('hasSameName no VALINTARYHMA', function() {
        expect(utils.hasSameName(model, parentoid)).toBeFalsy();
    });

    it('hasSameName has VALINTARYHMA', function() {
        treemodel.valintaperusteList[0].oid = parentoid;
        treemodel.valintaperusteList[0].tyyppi = "VALINTARYHMA";
        expect(utils.hasSameName(model, parentoid)).toBeTruthy();
    });

    it('hasSameName has same oid (update)', function() {
        treemodel.valintaperusteList[0].oid = parentoid;
        treemodel.valintaperusteList[0].tyyppi = "VALINTARYHMA";
        treemodel.valintaperusteList[0].alavalintaryhmat[0].oid = '1233333';
        expect(utils.hasSameName(model, parentoid)).toBeFalsy();
    });

    it('hasSameName has same name level 1', function() {
        treemodel.valintaperusteList[0].oid = parentoid;
        treemodel.valintaperusteList[0].tyyppi = "VALINTARYHMA";
        treemodel.valintaperusteList[0].nimi = 'Painotettu keskiarvo, pÃ¤Ã¤sykoe ja lisÃ¤nÃ¤yttÃ¶';
        treemodel.valintaperusteList[0].alavalintaryhmat[0].oid = '1233333';
        treemodel.valintaperusteList[0].alavalintaryhmat[0].nimi = '3';
        expect(utils.hasSameName(model, parentoid)).toBeTruthy();
    });


    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });


});