describe('LaskentakaavaController', function () {

    var scope, $location, ctrl, createController, _, $routeParams, $httpBackend, $timeout, KaavaValidointi, Laskentakaava, LaskentakaavaLista,
        TemplateService, FunktioService, Valintaperusteviitetyypit, Arvokonvertterikuvauskielet, FunktioNimiService,
        FunktioFactory, KaavaValidationService, KaavaVirheService, funktiokuvaus, laskentakaavaoneJSON;

    beforeEach(function () {
        module('MockData');
        module('LaskentakaavaEditor');
        module('valintaperusteet');
    });

    beforeEach(inject(function ($injector) {
        $rootScope = $injector.get('$rootScope');
        $controller = $injector.get('$controller');
        $httpBackend = $injector.get('$httpBackend');
        $location = $injector.get('$location');
        scope = $rootScope.$new();
        _ = $injector.get('_');
        $routeParams = $injector.get('$routeParams');
        KaavaValidointi = $injector.get('KaavaValidointi');
        Laskentakaava = $injector.get('Laskentakaava');
        LaskentakaavaLista = $injector.get('LaskentakaavaLista');
        TemplateService = $injector.get('TemplateService');
        FunktioService = $injector.get('FunktioService');
        Valintaperusteviitetyypit = $injector.get('Valintaperusteviitetyypit');
        Arvokonvertterikuvauskielet = $injector.get('Arvokonvertterikuvauskielet');
        FunktioNimiService = $injector.get('FunktioNimiService');
        FunktioFactory = $injector.get('FunktioFactory');
        KaavaValidationService = $injector.get('KaavaValidationService');
        KaavaVirheService = $injector.get('KaavaVirheService');

        //Mockdata
        funktiokuvaus = $injector.get('Funktiokuvaukset');
        laskentakaavaoneJSON = $injector.get('laskentakaavaoneJSON');

        createController = function () {
            return $controller('LaskentakaavaController', {
                $scope: scope,
                _: _,
                $location: $location,
                $routeParams: $routeParams,
                $timeout: $timeout,
                TemplateService: TemplateService,
                FunktioService: FunktioService,
                LaskentakaavaLista: LaskentakaavaLista,
                Valintaperusteviitetyypit: Valintaperusteviitetyypit,
                Laskentakaava: Laskentakaava,
                Arvokonvertterikuvauskielet: Arvokonvertterikuvauskielet,
                FunktioNimiService: FunktioNimiService,
                FunktioFactory: FunktioFactory,
                KaavaValidationService:  KaavaValidationService,
                KaavaValidointi: KaavaValidointi,
                KaavaVirheService: KaavaVirheService
            });
        };

        var casString = ["APP_VALINTOJENTOTEUTTAMINEN_CRUD_1.2.246.562.10.00000000001"];
        $httpBackend.expectGET('/cas/myroles').respond(casString);
        $httpBackend.expectGET('buildversion.txt?auth').respond("1.0");

    }));


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

            $httpBackend.expectGET('resources/laskentakaava/funktiokuvaus').respond(funktiokuvaus);
            $httpBackend.expectGET('resources/laskentakaava').respond([]);
            $httpBackend.expectGET('/localisation?category=valintaperusteet').respond("");

//            $httpBackend.expectGET('resources/laskentakaava/' + $routeParams.laskentakaavaOid).respond(laskentakaavaoneJSON);
  //          $httpBackend.expectGET('resources/laskentakaava').respond([]);

            $httpBackend.flush();
        });



//        //valintaperusteet -moduulissa
//        it("XHR-requests done", function () {
//            ctrl = createController();
//            $httpBackend.expectGET('resources/laskentakaava/funktiokuvaus').respond(funktiokuvaus);
//            $httpBackend.expectGET('resources/laskentakaava').respond([]);
//            $httpBackend.expectGET('resources/laskentakaava/' + $routeParams.laskentakaavaOid).respond(laskentakaavaoneJSON);
//            $httpBackend.expectGET('resources/laskentakaava').respond([]);
//            $httpBackend.expectGET('/localisation?category=valintaperusteet').respond("");
//            $httpBackend.flush();
//        });

        it("funktioasetukset initial values", function () {

            expect(scope.funktioasetukset.selectedFunktioIndex).toBe(undefined);
            expect(scope.funktioasetukset.showNewFunktioList).toBeFalsy();
            expect(scope.funktioasetukset.konvertteriType).toBe('');
            expect(scope.funktioasetukset.parentFunktiokutsu).toBeUndefined();
        });

        afterEach(function() {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

    });


});
