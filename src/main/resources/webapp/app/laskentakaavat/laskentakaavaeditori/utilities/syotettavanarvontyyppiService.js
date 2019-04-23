angular.module('valintaperusteet')

    .service('SyotettavanarvontyyppiService', ['$log', '$q', 'KoodistoSyotettavanarvonkoodi', '_',
        function ($log, $q, KoodistoSyotettavanarvonkoodi, _) {
            syotettavanarvontyypit = [];

            // Keep Syotettavanarvonkoodit usage internal for this service
            function fetchSyotettavanarvontyypit(){
                var deferred = $q.defer();
                KoodistoSyotettavanarvonkoodi.get({}, function (result) {
                    deferred.resolve(result);
                }, function(error) {
                    $log.error('Syotettavien arvojen tyyppien hakeminen epäonnistui', error);
                    deferred.reject();
                });
                return deferred.promise;
            }


            function setSyotettavanarvontyypit() {
                fetchSyotettavanarvontyypit().then(function(data){
                    syotettavanarvontyypit = data;
                }, function (data){ console.log(data);}, function (data){ console.log(data);});
            };

            this.getSyotettavanarvontyypit = function () {
                return syotettavanarvontyypit;
            };

            //IIFE: run fetchFunktiokuvaukset immediately when this service is initiated
            (function () {
                setSyotettavanarvontyypit();
            })();


        }]);