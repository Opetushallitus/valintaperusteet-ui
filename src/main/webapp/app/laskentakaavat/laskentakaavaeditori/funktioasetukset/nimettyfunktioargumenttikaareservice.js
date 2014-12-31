
angular.module('valintaperusteet')

    .service('NimettyFunktioargumenttiKaareService', ['_', 'FunktioService', function (_, FunktioService) {

        var api = this;

        this.kaareFunktiokutsuAsetukset = {
            funktiokutsuNimi: undefined,
            argumenttiOptions: undefined
        };
        
        this.setKaareFunktiokutsuType = function (funktiokutsuNimi) {
            api.kaareFunktiokutsuAsetukset.funktiokutsuNimi = funktiokutsuNimi;
            var funktiokuvaus = FunktioService.getFunktiokuvaus(funktiokutsuNimi);
            if(funktiokutsuNimi === 'PAINOTETTUKESKIARVO') {
                api.kaareFunktiokutsuAsetukset.argumenttiOptions = api.getPainotettukeskiarvoOptions();
            } else if (funktiokutsuNimi === 'JOS') {
                api.kaareFunktiokutsuAsetukset.argumenttiOptions = api.getJosFunktiokutsuOptions(funktiokuvaus);
            } else {
                api.kaareFunktiokutsuAsetukset.argumenttiOptions = api.getArgumentsNimettyFunktioargumenttiType(funktiokuvaus);
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
            if(funktiokuvaus.tyyppi === 'LUKUARVOFUNKTIO') {
                options = [ { label: 'Sitten', index: 1 },
                            { label: 'Muuten', index: 2} ];
            } else {
                options = [ { label: 'Ehto', index: 0 } ];
            }
            return options;
        };

        this.getArgumentsNimettyFunktioargumenttiType = function (funktiokuvaus) {

            var result = [];
            var index = 0;
            _.pluck(funktiokuvaus.funktioargumentit, 'nimi').forEach(function (nimi) {
                result.push({
                    label: nimi,
                    index: index
                });

                index += 1;
            });
            return result;
        };

    }]);