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
                    deferred.resolve();
                }, function(error) {
                    $log.error('Funktiokuvausten hakeminen epäonnistui', error);
                    deferred.reject();
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
            try {
                if(_.isEmpty(funktionimi)) {
                    throw Error('Funktionimi -parametri on tyhjä');
                }
            } catch(error) {
                $log.error(error);
            }
            var result;
            if (api.funktiokuvaukset) {
                result = _.find(api.funktiokuvaukset, function (funktiokuvaus) {
                    return funktiokuvaus.nimi === funktionimi;
                });
            }
            return result;
        };

        this.refresh = function () {
            return fetchFunktiokuvaukset(); //returns promise
        };

        this.hasFunktioargumentitByFunktionimi = function (funktionimi) {
            var funktiokuvaus = api.getFunktiokuvaus(funktionimi);
            return _.has(funktiokuvaus, 'funktioargumentit');
        };

        this.hasMoreThanOneFunktioargumentti = function (funktionimi) {
            var funktiokuvaus = api.getFunktiokuvaus(funktionimi);
            return api.hasFunktioargumentitByFunktionimi(funktionimi) && funktiokuvaus.funktioargumentit.length > 1;
        };

        this.getFunktioNimiLista = function () {
            return _.pluck(api.funktiokuvaukset, 'nimi');
        };

        this.getFunktioNimiListaObjects = function () {
            var funktionimet = api.getFunktioNimiLista();
            return _.map(funktionimet, function (funktionimi) {
                return {funktionimi: funktionimi, UIName: FunktioNimiService.getName(funktionimi)};
            });
        };

        this.hasNSizeFunktioargumenttiByFunktionimi = function(funktionimi) {
            var funktiokuvaus = api.getFunktiokuvaus(funktionimi);
            if(funktiokuvaus.funktioargumentit) {
                return funktiokuvaus.funktioargumentit[0].kardinaliteetti === 'n';
            } else {
                return false;
            }
        };

        this.hasNimettyFunktioargumenttiByFunktioNimi = function (funktionimi) {
            var funktiokuvaus = api.getFunktiokuvaus(funktionimi);
            return funktiokuvaus.funktioargumentit !== undefined && funktiokuvaus.funktioargumentit && (funktiokuvaus.funktioargumentit.length > 1 || funktiokuvaus.funktioargumentit[0].kardinaliteetti !== 'n' && !api.isPainotettukeskiarvoByFunktioNimi(funktionimi) );
        };

        this.isPainotettukeskiarvoByFunktioNimi = function (parentFunktionimi) {
            if (_.isEmpty(parentFunktionimi)) {
                return false;
            }
            var funktiokuvaus = api.getFunktiokuvaus(parentFunktionimi);
            return funktiokuvaus.funktioargumentit && funktiokuvaus.funktioargumentit[0].kardinaliteetti === 'lista_pareja';
        };

        /**
         * This should only be used for 'funktiokutsu' that has 'nimetyt funktioargumentti'
         *
         * @param {String} funktionimi
         * @returns {Number} return the length of funktioargumentit for this funktiotype
         */
        this.getFunktioargumenttiCountByFunktionimi = function (funktionimi) {
            var funktiokuvaus = api.getFunktiokuvaus(funktionimi);
            return funktiokuvaus.funktioargumentit.length;
        };

        /**
         *
         * @returns {array} returns array of objects that contain funktionimi and corresponding readable name
         * for all funktiokuvaukset that contain 'funktioargumentit'
         */
        this.getFunktioNimiListaWithFunktioargumentit = function () {
            var funktioNimiLista = api.getFunktioNimiListaObjects();
            return _.filter(funktioNimiLista, function (item) {
                return api.hasFunktioargumentitByFunktionimi(item.funktionimi);
            });
        };

}]);