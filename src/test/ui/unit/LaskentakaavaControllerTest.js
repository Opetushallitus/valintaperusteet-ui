
describe('LaskentakaavaController', function () {

    var $scope, $location, createController, _,  $routeParams, KaavaValidointi, Laskentakaava, LaskentakaavaLista,
        TemplateService, FunktioService, Valintaperusteviitetyypit, Arvokonvertterikuvauskielet, FunktioNimiService,
        FunktioFactory, KaavaValidationService;
    
    beforeEach(function() {
        module('LaskentakaavaEditor')
        module('valintaperusteet');
    });

    beforeEach(inject(function ($injector) {
        $rootScope = $injector.get('$rootScope');
        $controller = $injector.get('$controller');
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

        createController = function() {
            return $controller('LaskentakaavaController', {$scope: scope});
        }

    }));

    it('laskentakaavaController', function () {
        var controller = createController();
    });


});
