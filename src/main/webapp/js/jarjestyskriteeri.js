

// Valintaryhma Järjestyskriteerit
app.factory('ValintaryhmaJarjestyskriteeriModel', function($q, Laskentakaava, Jarjestyskriteeri, ValintatapajonoJarjestyskriteeri, ValintaryhmaLaskentakaava) {
    
    var model;

    model = new function() {

        this.jarjestyskriteeri = {};
        this.laskentakaavat = [];
        this.valintaryhmaLaskentakaavat = [];


        this.refresh = function(oid) {
            if(oid) {
                Jarjestyskriteeri.get({oid: oid}, function(result) {
                    model.jarjestyskriteeri = result;
                });

            }
        };

        this.refreshIfNeeded = function(oid, valintaryhmaOid) {

            if(!oid) {
                model.jarjestyskriteeri = {};
                model.laskentakaavat = [];
                model.valintaryhmaLaskentakaavat = [];

            } else if (oid !== model.jarjestyskriteeri.oid) {
                this.refresh(oid);
            }

            Laskentakaava.list(function(result) {
                model.laskentakaavat = result;
                if(!model.jarjestyskriteeri.laskentakaava_id) {
                    model.jarjestyskriteeri.laskentakaava_id = model.laskentakaavat[0].id;
                }
            });

             ValintaryhmaLaskentakaava.get({valintaryhmaOid: valintaryhmaOid}, function(result) {
                model.valintaryhmaLaskentakaavat = result;
            });
        };

        this.submit = function(valintatapajonoOid, jarjestyskriteerit) {
            var deferred = $q.defer();
            if(model.jarjestyskriteeri.oid == null) {
                model.jarjestyskriteeri.aktiivinen = "true";
                ValintatapajonoJarjestyskriteeri.insert({parentOid: valintatapajonoOid}, model.jarjestyskriteeri,
                    function(jk) {
                        Laskentakaava.get({oid: jk.laskentakaava_id}, function(result) {
                            jk.nimi = result.nimi;
                        });
                        jarjestyskriteerit.push(jk);
                        deferred.resolve();
                });
            } else {
                Jarjestyskriteeri.post(model.jarjestyskriteeri, function(jk) {
                    var i;

                    for(i in jarjestyskriteerit) {
                        if(jk.oid === jarjestyskriteerit[i].oid) {

                            Laskentakaava.get({oid: jk.laskentakaava_id}, function(result) {
                                jk.nimi = result.nimi;
                            });

                            jarjestyskriteerit[i] = jk;
                            deferred.resolve();
                        }
                    }
                });
            }

            return deferred.promise;
        };

    };

    return model;
    
});

function ValintaryhmaJarjestyskriteeriController($log, $scope, $location, $routeParams, ValintaryhmaJarjestyskriteeriModel, ValintatapajonoModel) {

    $scope.valinnanvaiheOid = $routeParams.valinnanvaiheOid;
    $scope.valintatapajonoOid =  $routeParams.valintatapajonoOid;
    $scope.model = ValintaryhmaJarjestyskriteeriModel;
    $scope.model.refreshIfNeeded($routeParams.jarjestyskriteeriOid, $routeParams.id);

    
    $scope.submit = function() {
        var promise = ValintaryhmaJarjestyskriteeriModel.submit($scope.valintatapajonoOid, ValintatapajonoModel.jarjestyskriteerit);
        promise.then(function(greeting) {
            var path;
            path = "/valintaryhma/" + $routeParams.id;
            $location.path(path + '/valinnanvaihe/'+ $routeParams.valinnanvaiheOid +
                                    '/valintatapajono/' + $routeParams.valintatapajonoOid);
        });

    };

    $scope.cancel = function() {
        var path;
        path = "/valintaryhma/" + $routeParams.id;
        $location.path(path + '/valinnanvaihe/'+ $routeParams.valinnanvaiheOid +
                                '/valintatapajono/' + $routeParams.valintatapajonoOid);
    };
    

}








//hakukohde Järjestyskriteerit
app.factory('HakukohdeJarjestyskriteeriModel', function($q, Laskentakaava, Jarjestyskriteeri, ValintatapajonoJarjestyskriteeri) {
    var model;

    model = new function() {
        this.jarjestyskriteeri = {};
        this.laskentakaavat = [];

        this.refresh = function(oid) {
            if(oid) {
                Jarjestyskriteeri.get({oid: oid}, function(result) {
                    model.jarjestyskriteeri = result;
                });
            }
        };

        this.refreshIfNeeded = function(oid) {
            if(!oid) {
                model.jarjestyskriteeri = {};
                model.laskentakaavat = [];
            } else if (oid !== model.jarjestyskriteeri.oid) {
                this.refresh(oid);
            }

            Laskentakaava.list(function(result) {
                model.laskentakaavat = result;
                if(!model.jarjestyskriteeri.laskentakaava_id) {
                    model.jarjestyskriteeri.laskentakaava_id = model.laskentakaavat[0].id;
                }
            });
        };

        this.submit = function(valintatapajonoOid, jarjestyskriteerit) {
            var deferred = $q.defer();
            if(model.jarjestyskriteeri.oid == null) {
                model.jarjestyskriteeri.aktiivinen = "true";
                ValintatapajonoJarjestyskriteeri.insert({parentOid: valintatapajonoOid}, model.jarjestyskriteeri,
                    function(jk) {
                        Laskentakaava.get({oid: jk.laskentakaava_id}, function(result) {
                            jk.nimi = result.nimi;
                        });
                        jarjestyskriteerit.push(jk);
                        deferred.resolve();
                });
            } else {
                Jarjestyskriteeri.post(model.jarjestyskriteeri, function(jk) {
                    var i;

                    for(i in jarjestyskriteerit) {
                        if(jk.oid === jarjestyskriteerit[i].oid) {

                            Laskentakaava.get({oid: jk.laskentakaava_id}, function(result) {
                                jk.nimi = result.nimi;
                            });

                            jarjestyskriteerit[i] = jk;
                            deferred.resolve();
                        }
                    }
                });
            }

            return deferred.promise;
        };
    };

    return model;
});

function HakukohdeJarjestyskriteeriController($scope, $location, $routeParams, HakukohdeJarjestyskriteeriModel, ValintatapajonoModel) {

    $scope.valinnanvaiheOid = $routeParams.valinnanvaiheOid;
    $scope.valintatapajonoOid =  $routeParams.valintatapajonoOid;

    $scope.model = HakukohdeJarjestyskriteeriModel;
    $scope.model.refreshIfNeeded($routeParams.jarjestyskriteeriOid);

    $scope.submit = function() {
        var promise = HakukohdeJarjestyskriteeriModel.submit($scope.valintatapajonoOid, ValintatapajonoModel.jarjestyskriteerit);
        promise.then(function() {
            var path;
            path = "/hakukohde/" + $routeParams.hakukohdeOid;
            $location.path(path + '/valinnanvaihe/'+ $routeParams.valinnanvaiheOid +
                                    '/valintatapajono/' + $routeParams.valintatapajonoOid);
        });

    };

    $scope.cancel = function() {
        var path;
        path = "/hakukohde/" + $routeParams.hakukohdeOid;
        $location.path(path + '/valinnanvaihe/'+ $routeParams.valinnanvaiheOid +
                                '/valintatapajono/' + $routeParams.valintatapajonoOid);
    };

}