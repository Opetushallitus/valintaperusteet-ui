angular.module('valintaperusteet')

.factory('ValintaryhmaValinnanvaiheModel', ['$q', 'Valinnanvaihe', 'Valintatapajono', 'ValinnanvaiheValintatapajono',
        'NewValintaryhmaValinnanvaihe', 'ValintatapajonoJarjesta', 'Ilmoitus', '$http', '$cookieStore', 'IlmoitusTila',
        'LocalisationService',
        function($q, Valinnanvaihe, Valintatapajono, ValinnanvaiheValintatapajono, NewValintaryhmaValinnanvaihe,
                 ValintatapajonoJarjesta, Ilmoitus, $http, $cookieStore, IlmoitusTila, LocalisationService) {

    "use strict";


    var model = new function() {
        
        this.valinnanvaihe = {};
        this.valintatapajonot = [];

        this.refresh = function (oid) {
            if(!oid) {
                model.valinnanvaihe = {};
                model.valintatapajonot = [];
            } else {

                Valinnanvaihe.get({oid: oid}, function(result) {
                    model.valinnanvaihe = result;
                });

                ValinnanvaiheValintatapajono.get({parentOid: oid}, function(valintatapajonot) {
                    model.valintatapajonot = valintatapajonot;
                    populateSijoitteluUsage(valintatapajonot);
                });
            }
        };

        function populateSijoitteluUsage(valintatapajonot) {
            _.each(valintatapajonot, function(jono) {
                jono.loadingComplete = false;
                fetchValintatapajonoUsageInformation(jono)
                    .success(function(inUse) {
                        jono.isUsedBySijoittelu = inUse;
                        jono.loadingComplete = true;
                    });
            });
        }

        function fetchValintatapajonoUsageInformation(jono) {
            var hakuOid = $cookieStore.get('hakuoid');
            return $http.get(SIJOITTELU_URL_BASE + 'resources/sijoittelu/' + hakuOid + '/valintatapajono-in-use/' + jono.oid, {
                cache: false
            });
        }

        this.refreshIfNeeded = function(oid) {
            if(oid !== model.valinnanvaihe.oid) {
                model.refresh(oid);
            }
        };
        this.persistValintaryhmaValinnanvaihe = function(parentValintaryhmaOid, valinnanvaiheet, afterSuccess, afterFailure) {
            if(model.valinnanvaihe.oid) {
                var promises = [];
                promises.push(Valinnanvaihe.post(model.valinnanvaihe, function(result) {
                    var i;
                    //update valinnanvaihe in ValintaryhmaModel
                    for(i in valinnanvaiheet) {
                        if(result.oid === valinnanvaiheet[i].oid) {
                            valinnanvaiheet[i] = result;
                        }
                    }
                }).$promise);

                promises.push(ValintatapajonoJarjesta.post(getValintatapajonoOids(), function(result) {}).$promise);

                model.valintatapajonot.forEach(function(element, index, array){
                    promises.push(Valintatapajono.post({oid: model.valintatapajonot[index].oid}, element, function(result) {
                    }).$promise);
                });

                $q.all(promises).then(function () {
                    afterSuccess(function() {});
                }, function(err) {
                    afterFailure(function() {});
                });

            } else {
                var valinnanvaihe = {
                    nimi: model.valinnanvaihe.nimi,
                    kuvaus: model.valinnanvaihe.kuvaus,
                    aktiivinen: true,
                    valinnanVaiheTyyppi: "TAVALLINEN"
                };
                NewValintaryhmaValinnanvaihe.put({valintaryhmaOid: parentValintaryhmaOid}, valinnanvaihe, function(result){
                    model.valinnanvaihe = result;
                    valinnanvaiheet.push(result);
                    afterSuccess(function() {});
                }, function(fail) {
                    afterFailure(function() {});
                });
            }
        };
        this.remove = function(jono) {
            if (!window.confirm(LocalisationService.tl('valintatapajono.haluatkoVarmastiPoistaa') ||
                    'Haluatko varmasti poistaa valintatapajonon?')) {
                return;
            }
            fetchValintatapajonoUsageInformation(jono).success(function(inUse) {
                var msg = LocalisationService.tl('valintatapajono.eiVoiPoistaaKoskaSijoittelunKaytossa') ||
                            'Jonoa ei voi poistaa, koska se on sijoittelun käytössä';
                if (inUse) {
                    Ilmoitus.avaa(msg, msg, IlmoitusTila.WARNING);
                } else {
                    Valintatapajono.delete({oid: jono.oid}, function(result) {
                        model.refresh(model.valinnanvaihe.oid);
                    });
                }
            });
        };

        function getValintatapajonoOids() {
            var oids = [];
            for (var i = 0 ; i < model.valintatapajonot.length ; ++i) {
                oids.push(model.valintatapajonot[i].oid);
            }
            return oids;
        }

    }();
    return model;

}])

    .controller('ValintaryhmaValinnanvaiheController', ['$scope', '$location', '$routeParams',
        'ValintaryhmaValinnanvaiheModel', 'ValintaryhmaModel', 'SuoritaToiminto',
    function ($scope, $location, $routeParams, ValintaryhmaValinnanvaiheModel, ValintaryhmaModel, SuoritaToiminto) {
    "use strict";

    $scope.valintaryhmaOid = $routeParams.id;
    $scope.ValintaryhmaValinnanvaiheOid = $routeParams.valinnanvaiheOid;
    $scope.model = ValintaryhmaValinnanvaiheModel;
    $scope.model.refreshIfNeeded($scope.ValintaryhmaValinnanvaiheOid);

    $scope.submit = function() {
        SuoritaToiminto.avaa(function(success, failure) {
            $scope.model.persistValintaryhmaValinnanvaihe($scope.valintaryhmaOid, ValintaryhmaModel.valinnanvaiheet, success, failure);
        });

    };

    $scope.cancel = function() {
        $location.path("/valintaryhma/" + $scope.valintaryhmaOid);
    };

    $scope.addJono = function() {
        $location.path("/valintaryhma/" + $scope.valintaryhmaOid + "/valinnanvaihe/" + $scope.model.valinnanvaihe.oid + "/valintatapajono/");
    };

    $scope.modifyJono = function(oid) {
        $location.path("/valintaryhma/" + $scope.valintaryhmaOid + "/valinnanvaihe/" + $scope.model.valinnanvaihe.oid + "/valintatapajono/" + oid);
    };
}])



.factory('ValintaryhmaValintakoeValinnanvaiheModel', ['$q', 'Valinnanvaihe', 'ValinnanvaiheValintakoe', 'NewValintaryhmaValinnanvaihe', 'Valintakoe', 'SuoritaToiminto',
        function($q, Valinnanvaihe, ValinnanvaiheValintakoe, NewValintaryhmaValinnanvaihe, Valintakoe, SuoritaToiminto) {
    "use strict";

    var model = new function() {
        
        this.valintakoevalinnanvaihe = {};
        this.valintakokeet = [];

        this.refresh = function(oid) {
            if(!oid) {
                model.valintakoevalinnanvaihe = {};
                model.valintakokeet = [];
            } else {
                Valinnanvaihe.get({oid: oid}, function(result) {
                    model.valintakoevalinnanvaihe = result;
                });

                ValinnanvaiheValintakoe.get({valinnanvaiheOid: oid}, {}, function(result) {
                    model.valintakokeet = result;
                });

            }
        };

        this.persist = function(parentValintaryhmaOid, valinnanvaiheet, afterSuccess, afterFailure) {
            if(model.valintakoevalinnanvaihe.oid) {

                //päivitä valintaryhmän valintakoevalinnanvaiheen tiedot
                var promises = [];
                promises.push(Valinnanvaihe.post(model.valintakoevalinnanvaihe, function(result) {
                    var i;
                    for(i in valinnanvaiheet) {
                        if(result.oid === valinnanvaiheet[i].oid) {
                            valinnanvaiheet[i] = result;
                        }
                    }
                }).$promise);

                //päivitä valintaryhmän valintakoevalinnanvaiheen valintakokeet
                for (var i = 0 ; i < model.valintakokeet.length ; i++) {
                    promises.push(Valintakoe.update({valintakoeOid: model.valintakokeet[i].oid}, model.valintakokeet[i], function(result) {}).$promise);
                }

                $q.all(promises).then(function () {
                    afterSuccess(function() {});
                }, function(err) {
                    afterFailure(function() {});
                });

            } else {
                
                var valintakoevalinnanvaihe = {
                    nimi: model.valintakoevalinnanvaihe.nimi,
                    kuvaus: model.valintakoevalinnanvaihe.kuvaus,
                    aktiivinen: true,
                    valinnanVaiheTyyppi: "VALINTAKOE"
                }

                NewValintaryhmaValinnanvaihe.put({valintaryhmaOid: parentValintaryhmaOid}, valintakoevalinnanvaihe, function(result){
                    model.valintakoevalinnanvaihe = result;
                    valinnanvaiheet.push(result);
                    afterSuccess(function() {});
                }, function(error){
                    afterFailure(function() {});
                });
            }
        };

        this.removeValintakoe = function(valintakoe) {
            Valintakoe.remove({valintakoeOid: valintakoe.oid}, function(result){
                for(var i in model.valintakokeet) {
                    if(valintakoe.oid === model.valintakokeet[i].oid) {
                        model.valintakokeet.splice(i,1);
                    }
                }
            });
        };

    }();

    return model;
}])


    .controller('ValintaryhmaValintakoeValinnanvaiheController', ['$scope', '$location', '$routeParams', 'ValintaryhmaValintakoeValinnanvaiheModel', 'ValintaryhmaModel', 'SuoritaToiminto',
        function ($scope, $location, $routeParams, ValintaryhmaValintakoeValinnanvaiheModel, ValintaryhmaModel, SuoritaToiminto) {
    "use strict";

    $scope.valintaryhmaOid = $routeParams.id;
    $scope.ValintaryhmaValintakoeValinnanvaiheOid = $routeParams.valintakoevalinnanvaiheOid;
    $scope.model = ValintaryhmaValintakoeValinnanvaiheModel;
    $scope.model.refresh($scope.ValintaryhmaValintakoeValinnanvaiheOid);
    

    $scope.submit = function() {
        SuoritaToiminto.avaa(function(success, failure) {
            ValintaryhmaValintakoeValinnanvaiheModel.persist($scope.valintaryhmaOid, ValintaryhmaModel.valinnanvaiheet, success, failure);
        });
    };

    $scope.modifyvalintakoe = function(valintakoeOid) {
        $location.path("/valintaryhma/" + $scope.valintaryhmaOid + "/valintakoevalinnanvaihe/" + $scope.model.valintakoevalinnanvaihe.oid + "/valintakoe/" + valintakoeOid);
    };

    $scope.addValintakoe = function() {
        $location.path("/valintaryhma/" + $scope.valintaryhmaOid + "/valintakoevalinnanvaihe/" + $scope.model.valintakoevalinnanvaihe.oid + "/valintakoe/");
    };

    $scope.cancel = function() {
        $location.path("/valintaryhma/" + $scope.valintaryhmaOid);
    };

}]);
