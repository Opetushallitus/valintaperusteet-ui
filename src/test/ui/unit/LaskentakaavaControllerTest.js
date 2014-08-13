/*
xdescribe('LaskentakaavaController', function () {

    var $scope, $location, createController, _, $routeParams, $httpBackend, KaavaValidointi, Laskentakaava, LaskentakaavaLista,
        TemplateService, FunktioService, Valintaperusteviitetyypit, Arvokonvertterikuvauskielet, FunktioNimiService,
        FunktioFactory, KaavaValidationService;

    beforeEach(function () {
        module('LaskentakaavaEditor');
        module('valintaperusteet');
    });

    beforeEach(inject(function ($injector) {
        $rootScope = $injector.get('$rootScope');
        $controller = $injector.get('$controller');
        $httpBackend = $injector.get('$httpBackend');
        scope = $rootScope.$new();
        _ = $injector.get('_');
        $routeParams = $injector.get('$routeParams');
        KaavaValidointi = $injector.get('KaavaValidointi');
        Laskentakaava = $injector.get('Laskentakaava');
        //LaskentakaavaLista = $injector.get('LaskentakaavaLista');
        TemplateService = $injector.get('TemplateService');
        FunktioService = $injector.get('FunktioService');
        Valintaperusteviitetyypit = $injector.get('Valintaperusteviitetyypit');
        Arvokonvertterikuvauskielet = $injector.get('Arvokonvertterikuvauskielet');
        FunktioNimiService = $injector.get('FunktioNimiService');
        FunktioFactory = $injector.get('FunktioFactory');
        KaavaValidationService = $injector.get('KaavaValidationService');

        createController = function () {
            return $controller('LaskentakaavaController', {$scope: scope});
        }
    }));
    /*
     afterEach(function() {
     $httpBackend.verifyNoOutstandingExpectation();
     $httpBackend.verifyNoOutstandingRequest();
     });
     */
/*
    describe('laskentakaavaController', function () {

        beforeEach(function () {
            var funktiokutsu = {"lapsi": {"funktionimi": "KESKIARVO", "arvokonvertteriparametrit": [], "arvovalikonvertteriparametrit": [], "syoteparametrit": [], "funktioargumentit": [
                {"lapsi": {"funktionimi": "HAELUKUARVO", "arvokonvertteriparametrit": [], "arvovalikonvertteriparametrit": [], "syoteparametrit": [], "funktioargumentit": [], "valintaperusteviitteet": [
                    {"tunniste": "PK_A1", "kuvaus": "", "lahde": "HAETTAVA_ARVO", "onPakollinen": false, "epasuoraViittaus": false, "indeksi": 2}
                ], "validointivirheet": [], "onLuonnos": null, "nimi": null, "kuvaus": null, "tyyppi": null, "id": 819222, "lapsityyppi": "funktiokutsu", "tulosTunniste": null, "tulosTekstiFi": null, "tulosTekstiSv": null, "tulosTekstiEn": null, "tallennaTulos": false}, "indeksi": 1},
                {"lapsi": {"funktionimi": "KESKIARVO", "arvokonvertteriparametrit": [], "arvovalikonvertteriparametrit": [], "syoteparametrit": [], "funktioargumentit": [
                    {"lapsi": {"funktionimi": "HAELUKUARVO", "arvokonvertteriparametrit": [], "arvovalikonvertteriparametrit": [], "syoteparametrit": [], "funktioargumentit": [], "valintaperusteviitteet": [
                        {"tunniste": "PK_A1_VAL1", "kuvaus": "", "lahde": "HAETTAVA_ARVO", "onPakollinen": false, "epasuoraViittaus": false, "indeksi": 2}
                    ], "validointivirheet": [], "onLuonnos": null, "nimi": null, "kuvaus": null, "tyyppi": null, "id": 819224, "lapsityyppi": "funktiokutsu", "tulosTunniste": null, "tulosTekstiFi": null, "tulosTekstiSv": null, "tulosTekstiEn": null, "tallennaTulos": false}, "indeksi": 1},
                    {"lapsi": {"funktionimi": "HAELUKUARVO", "arvokonvertteriparametrit": [], "arvovalikonvertteriparametrit": [], "syoteparametrit": [], "funktioargumentit": [], "valintaperusteviitteet": [
                        {"tunniste": "PK_A1_VAL2", "kuvaus": "", "lahde": "HAETTAVA_ARVO", "onPakollinen": false, "epasuoraViittaus": false, "indeksi": 2}
                    ], "validointivirheet": [], "onLuonnos": null, "nimi": null, "kuvaus": null, "tyyppi": null, "id": 819226, "lapsityyppi": "funktiokutsu", "tulosTunniste": null, "tulosTekstiFi": null, "tulosTekstiSv": null, "tulosTekstiEn": null, "tallennaTulos": false}, "indeksi": 2}
                ], "valintaperusteviitteet": [], "validointivirheet": [], "onLuonnos": null, "nimi": null, "kuvaus": null, "tyyppi": null, "id": 819228, "lapsityyppi": "funktiokutsu", "tulosTunniste": null, "tulosTekstiFi": null, "tulosTekstiSv": null, "tulosTekstiEn": null, "tallennaTulos": false}, "indeksi": 2}
            ], "valintaperusteviitteet": [], "validointivirheet": [], "onLuonnos": null, "nimi": null, "kuvaus": null, "tyyppi": null, "id": 819231, "lapsityyppi": "funktiokutsu", "tulosTunniste": null, "tulosTekstiFi": null, "tulosTekstiSv": null, "tulosTekstiEn": null, "tallennaTulos": false}, "indeksi": 1};
            var controller = createController();
            $routeParams.laskentakaavaOid = 12345;
        });
    /*
        afterEach(function() {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });
*/

        /*
//valintaperusteet -moduulissa
        it("buildversion is fetched", function () {
            $httpBackend.expectGET('buildversion.txt?auth');
            $httpBackend.flush();
        });


        it("Funktiokuvaukset are fetched", function () {
            $httpBackend.expectGET('resources/laskentakaava/funktiokuvaus');
            $httpBackend.flush();
        });





        it("Laskentakaava is fetched", function () {
            $httpBackend.expectGET('resources/laskentakaava/:oid');
            $httpBackend.flush();
        });
        it("funktioasetukset initial values", function () {
            expect(scope.funktioasetukset.selectedFunktioIndex).toBe(undefined);
            expect(scope.funktioasetukset.showNewFunktioList).toBeFalsy();
            expect(scope.funktioasetukset.konvertteriType).toBe('');
            expect(scope.funktioasetukset.parentFunktiokutsu).toBeUndefined();
        });






    });


});
*/