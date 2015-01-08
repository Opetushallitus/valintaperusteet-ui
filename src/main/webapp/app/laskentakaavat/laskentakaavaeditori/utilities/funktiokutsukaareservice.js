
angular.module('valintaperusteet')

    .service('FunktiokutsuKaareService', ['_', 'FunktioService', 'FunktiokuvausService',
        function (_, FunktioService, FunktiokuvausService) {

        var api = this;

        this.funktioKaare = {
            funktioKaareLista: undefined,
            funktiokutsuNimi: undefined,
            argumenttiOptions: undefined
        };


        this.setFunktioKaareLista = function () {
            FunktiokuvausService.refresh().then(function () {
                api.funktioKaare.funktioKaareLista = FunktiokuvausService.getFunktioNimiListaWithFunktioargumentit();
            });
            
        };

        this.setKaareFunktiokutsuType = function (funktiokutsuNimi) {
            api.funktioKaare.funktiokutsuNimi = funktiokutsuNimi;
            var funktiokuvaus = FunktiokuvausService.getFunktiokuvaus(funktiokutsuNimi);
            if(funktiokutsuNimi === 'PAINOTETTUKESKIARVO') {
                api.funktioKaare.argumenttiOptions = api.getPainotettukeskiarvoOptions();
            } else if (funktiokutsuNimi === 'JOS') {
                api.funktioKaare.argumenttiOptions = api.getJosFunktiokutsuOptions(funktiokuvaus);
            } else {
                api.funktioKaare.argumenttiOptions = api.getArgumentsNimettyFunktioargumenttiType(funktiokuvaus);
            }
        };
        
        this.setArgumenttiOptions = function (options) {
            api.argumenttiOptions = options;
        };

        this.getPainotettukeskiarvoOptions = function () {
            return [{
                label: 'Painotuskerroin',
                index: 0
            }, {
                label: 'Lukuarvo',
                index: 1
            }];
        };

        this.getJosFunktiokutsuOptions = function (funktiokuvaus) {
            var options = undefined;
            if(FunktioService.isLukuarvoFunktiokutsu(funktiokuvaus)) {
                options = [ { label: 'Sitten', index: 1 },
                            { label: 'Muuten', index: 2} ];
            } else {
                options = [ { label: 'Ehto', index: 0 } ];
            }
            return options;
        };

        this.getArgumentsNimettyFunktioargumenttiType = function (funktiokuvaus) {
            var result = [];
            _.pluck(funktiokuvaus.funktioargumentit, 'nimi').forEach(function (nimi, index) {
                result.push({
                    label: nimi,
                    index: index
                });
            });
            return result;
        };

    }]);