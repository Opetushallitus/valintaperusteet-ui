angular.module('valintaperusteet')

    .service('FunktiokuvausService', ['$log', '$q', 'FunktioKuvausResource', '_', 'FunktioNimiService',
        function ($log, $q, FunktioKuvausResource, _, FunktioNimiService) {
        var api = this;

        this.funktiokuvaukset = undefined;

        //IIFE: run fetchFunktiokuvaukset immediately when this service is initiated
        (function () {
            fetchFunktiokuvaukset();
        })();

        // Keep FunktiokuvausResource usage internal for this service
        function fetchFunktiokuvaukset() {
            var deferred = $q.defer();
            if (_.isEmpty(api.funktiokuvaukset) ) {
                FunktioKuvausResource.get({}, function (result) {
                    api.funktiokuvaukset = result;
                }, function(error) {
                    $log.error('Funktiokuvausten hakeminen epäonnistui', error);
                });
            } else {
                deferred.resolve();
            }
            return deferred.promise;
        }

        this.getFunktiokuvaukset = function () {
            return api.funktiokuvaukset;
        };

        this.getFunktiokuvaus = function (funktionimi) {
            var result;
            if (api.funktiokuvaukset) {
                result = _.find(api.funktiokuvaukset, function (funktiokuvaus) {
                    return funktiokuvaus.nimi === funktionimi;
                });
            }
            return result;
        };

        this.refresh = function () {
            return fetchFunktiokuvaukset();
        };

        this.hasFunktioargumentitByFunktionimi = function (funktionimi) {
            var funktiokuvaus = FunktiokuvausService.getFunktiokuvaus(funktionimi);
            return _.has(funktiokuvaus, 'funktioargumentit');
        };

        this.getFunktioNimiLista = function () {
            return _.pluck(api.funktiokuvaukset, 'nimi');
        };

        this.getFunktioNimiListaObjects = function () {
            var funktionimet = api.getFunktioNimiLista();
            return _.map(funktionimet, function (funktionimi) {
                return {funktionimi: funktionimi, UINimi: FunktioNimiService.getName(funktionimi)
            };
        });

        /**
         *
         * @returns {array} returns array of objects that contain funktionimi and corresponding readable name
         * for all funktiokuvaukset that contain 'funktioargumentit'
         */
        this.getFunktioNimiListaWithFunktioargumentit = function () {
            var funktioNimiLista = api.getFunktioNimiListaObjects();
            return _.filter(funktioNimiLista, function (item) {
                return FunktioService.hasFunktioargumentitByFunktionimi(item.funktionimi);
            });
        };
    };

}]);