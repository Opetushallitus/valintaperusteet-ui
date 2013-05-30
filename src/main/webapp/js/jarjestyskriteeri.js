

// Valintaryhma Järjestyskriteerit
app.factory('JarjestyskriteeriModel', function($q, Laskentakaava, Jarjestyskriteeri, ValintatapajonoJarjestyskriteeri, ParentValintaryhmas, Hakukohde) {
    
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

        this.refreshIfNeeded = function(oid, valintaryhmaOid, hakukohdeOid) {

            if(!oid) {
                model.jarjestyskriteeri = {};
                model.laskentakaavat = [];
                model.valintaryhmaLaskentakaavat = [];

            } else if (oid !== model.jarjestyskriteeri.oid) {
                this.refresh(oid);
            }


            //root kaavat
            Laskentakaava.list(function(result) {
                if(result.length > 0) {
                    var obj = {
                        name: 'root',
                        result: result
                    }
                    model.laskentakaavat.push(obj);
                }
            });

            // hakukohteelta tulevat
            if(hakukohdeOid) {
                Laskentakaava.list({hakukohde: hakukohdeOid}, function(result) {
                    if(result.length > 0) {
                        var obj = {
                            name: 'current',
                            result: result
                        }
                        model.laskentakaavat.push(obj);
                    }
                });
                Hakukohde.get({oid: hakukohdeOid}, function(result) {
                    Valintaryhmas(result.valintaryhma_id);
                });
            }

            // valintaryhmiltä tulevata
            if(valintaryhmaOid) {
                // Parent palauttaa itsensä?
//                Laskentakaava.list({valintaryhma: valintaryhmaOid}, function(result) {
//                    if(result.length > 0) {
//                        var obj = {
//                            name: 'current',
//                            result: result
//                        }
//                        model.laskentakaavat.push(obj);
//                    }
//                });
                  Valintaryhmas(valintaryhmaOid);
            }

            // valitaan ensimmäinen
//            if(!model.jarjestyskriteeri.laskentakaava_id) {
//                                model.jarjestyskriteeri.laskentakaava_id = model.laskentakaavat[0].id;
//                            }
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

        function Valintaryhmas(valintaryhmaOid) {
            ParentValintaryhmas.get({parentOid: valintaryhmaOid}, function(data) {
                data.forEach(function(temp) {
                    Laskentakaava.list({valintaryhma: temp.oid}, function(result) {
                        if(result.length > 0) {
                            var obj = {
                                name: temp.nimi,
                                result: result
                            }
                            model.laskentakaavat.push(obj);
                        }
                    });

                });
            });
        }

    };

    return model;
    
});

function JarjestyskriteeriController($scope, $location, $routeParams, JarjestyskriteeriModel, ValintatapajonoModel) {

    $scope.valinnanvaiheOid = $routeParams.valinnanvaiheOid;
    $scope.valintatapajonoOid =  $routeParams.valintatapajonoOid;

    $scope.model = JarjestyskriteeriModel;
    $scope.model.refreshIfNeeded($routeParams.jarjestyskriteeriOid, $routeParams.id, $routeParams.hakukohdeOid);

    $scope.submit = function() {
        var promise = JarjestyskriteeriModel.submit($scope.valintatapajonoOid, ValintatapajonoModel.jarjestyskriteerit);
        promise.then(function(greeting) {
            var path;
            if($routeParams.hakukohdeOid) {
                path = "/hakukohde/" + $routeParams.hakukohdeOid;
            } else {
                path = "/valintaryhma/" + $routeParams.id;
            }
            $location.path(path + '/valinnanvaihe/'+ $routeParams.valinnanvaiheOid +
                                    '/valintatapajono/' + $routeParams.valintatapajonoOid);
        });

    };

    $scope.cancel = function() {
        var path;
        if($routeParams.hakukohdeOid) {
            path = "/hakukohde/" + $routeParams.hakukohdeOid;
        } else {
            path = "/valintaryhma/" + $routeParams.id;
        }
        $location.path(path + '/valinnanvaihe/'+ $routeParams.valinnanvaiheOid +
                                '/valintatapajono/' + $routeParams.valintatapajonoOid);
    };

}