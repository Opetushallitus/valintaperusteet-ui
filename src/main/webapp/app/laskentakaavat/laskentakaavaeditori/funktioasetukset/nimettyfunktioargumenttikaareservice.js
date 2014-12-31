
angular.module('valintaperusteet')

    .service('NimettyFunktioargumenttiKaareService', ['_', 'FunktioService', function (_, FunktioService) {

        var api = this;

        this.kaareFunktioConfig = {
            childFunktiokutsuIndex: undefined,
            funktiokutsuNimi: undefined,
            childFunktiokutsuOptions: undefined
        };
        
        this.setKaareFunktiokutsuType = function (funktiokutsuNimi) {
            api.kaareFunktioConfig.funktiokutsuNimi = funktiokutsuNimi;
            var funktiokuvaus = FunktioService.getFunktiokuvaus(funktiokutsuNimi);
            var isPainotettuKeskiarvo = FunktioService


        };


    }]);