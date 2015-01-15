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
        $httpBackend.expectGET('buildversion.txt?auth').respond("1.0");
        //$httpBackend.expectGET('/cas/myroles').respond(casString);

        $httpBackend.expectGET('resources/puu?hakuOid=&kohdejoukko=&tila=VALMIS&tila=JULKAISTU').respond(puukaikkijson);
        $httpBackend.expectGET('/localisation?category=valintaperusteet').respond("");

        $httpBackend.flush();
    }));

    it('hasSameName no VALINTARYHMA', function() {
        var parents;
        var children;
        expect(utils.hasSameName(model, parents, children)).toBeFalsy();
    });

    it('hasSameName has VALINTARYHMA', function() {
        var parents = [];
        var children = [];

        expect(utils.hasSameName(model, parents, children)).toBeFalsy();
    });

    it('hasSameName has same oid (update)', function() {
        var parents = [];
        var children = [];

        var parent = {};
        parent.oid = parentoid;
        parent.tyyppi = "VALINTARYHMA";
        parent.oid = '1233333';
        parents.push(parent);
        expect(utils.hasSameName(model, parents, children)).toBeFalsy();
    });

    it('hasSameName has same name level 1', function() {
        var parents = [];
        var children = [];

        var child = {};
        child.oid = parentoid;
        child.tyyppi = "VALINTARYHMA";
        child.nimi = 'Painotettu keskiarvo, pÃ¤Ã¤sykoe ja lisÃ¤nÃ¤yttÃ¶';
        child.alavalintaryhmat = [];
        var child2 = {};
        child2.oid = '1233333';
        child2.nimi = '3';
        child.alavalintaryhmat.push(child2);

        children.push(child);

        expect(utils.hasSameName(model, parents, children)).toBeTruthy();
    });


    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });


});