//domain .. this is both, service & domain layer
app.factory('ValintatapajonoModel', function($q, Valintatapajono, ValinnanvaiheValintatapajono,
                                                ValintatapajonoJarjestyskriteeri, Laskentakaava, Jarjestyskriteeri,
                                                JarjestyskriteeriJarjesta, ValintatapajonoHakijaryhma, HakukohdeHakijaryhma,
                                                ValintaryhmaHakijaryhma, HakijaryhmaValintatapajono) {
    var model = new function()  {
        this.valintatapajono = {};
        this.jarjestyskriteerit = [];
        this.hakijaryhmat = [];

        this.refresh = function(oid) {

            Valintatapajono.get({oid: oid}, function(result) {
                model.valintatapajono = result;
                model.valintatapajono.rajattu = model.valintatapajono.varasijat > 0;
                model.valintatapajono.alkaenRajattu = !!model.valintatapajono.varasijojaKaytetaanAlkaen;
                model.valintatapajono.astiRajattu = !!model.valintatapajono.varasijojaTaytetaanAsti;
            });

            ValintatapajonoHakijaryhma.get({oid: oid}, function(result) {
                model.hakijaryhmat = result;
            });

            this.refreshJK(oid);
        };

        this.refreshIfNeeded = function(oid, valintaryhmaOid, hakukohdeOid) {
            if(!oid) {
                model.valintatapajono = {};
                model.jarjestyskriteerit = [];
                model.valintatapajono.tasapistesaanto = "YLITAYTTO";
            } else if (oid != model.valintatapajono.oid) {
                this.refresh(oid, valintaryhmaOid, hakukohdeOid);
            }
        };

        this.refreshJK = function(oid) {
            ValintatapajonoJarjestyskriteeri.get({parentOid: oid}, function(result) {
                model.jarjestyskriteerit = result;
                model.jarjestyskriteerit.forEach(function(jk){
                    Laskentakaava.get({oid: jk.laskentakaava_id}, function(result) {
                        jk.nimi = result.nimi;
                    });
                });
            });
        };

        this.submit = function(valinnanvaiheOid, valintatapajonot) {
            if(!model.valintatapajono.rajattu) {
                model.valintatapajono.varasijat = 0;
            };

            if(!model.valintatapajono.alkaenRajattu) {
                console.log("jee");
                model.valintatapajono.varasijojaKaytetaanAlkaen = null;
                console.log(model.valintatapajono.varasijojaKaytetaanAlkaen);
            };

            if(!model.valintatapajono.astiRajattu) {
                model.valintatapajono.varasijojaTaytetaanAsti = null;
            };

            console.log(model.valintatapajono.varasijojaTaytetaanAsti);

            if(model.valintatapajono.oid == null) {
                model.valintatapajono.aktiivinen = true;
                ValinnanvaiheValintatapajono.insert({parentOid: valinnanvaiheOid}, model.valintatapajono,
                    function(result) {
                        model.valintatapajono = result;
                        model.valintatapajono.rajattu = model.valintatapajono.varasijat > 0;
                        model.valintatapajono.alkaenRajattu = !!model.valintatapajono.varasijojaKaytetaanAlkaen;
                        model.valintatapajono.astiRajattu = !!model.valintatapajono.varasijojaTaytetaanAsti;
                        valintatapajonot.push(result);
                });
            } else {
                console.log(model.valintatapajono);
                Valintatapajono.post(model.valintatapajono, function(result) {
                    var i;
                    for(i in valintatapajonot) {
                        if(result.oid === valintatapajonot[i].oid) {
                            valintatapajonot[i] = result;
                        }
                    }
                    model.valintatapajono = result;
                    model.valintatapajono.rajattu = model.valintatapajono.varasijat > 0;
                    model.valintatapajono.alkaenRajattu = !!model.valintatapajono.varasijojaKaytetaanAlkaen;
                    model.valintatapajono.astiRajattu = !!model.valintatapajono.varasijojaTaytetaanAsti;
                });

                model.hakijaryhmat.forEach(function(hr){
                    HakijaryhmaValintatapajono.update({oid: hr.oid}, hr, function(result){
                        hr = result;
                    });
                });

                var promises = [];
                for(var i = 0 ; i < model.jarjestyskriteerit.length ; ++i) {
                    console.log(model.jarjestyskriteerit[i]);
                    promises[i] = function() {
                        var deferred = $q.defer();
                        Jarjestyskriteeri.post(model.jarjestyskriteerit[i], function(result){
                            deferred.resolve();
                        });
                        return deferred.promise;
                    }();
                }


                $q.all(promises).then(function(){
                    jarjestaJarjestyskriteerit();
                });
            }
        };

        this.remove = function(oid) {
            Jarjestyskriteeri.delete({oid:oid}, function() {
                for(i in model.jarjestyskriteerit) {
                    if(oid === model.jarjestyskriteerit[i].oid) {
                        model.jarjestyskriteerit.splice(i,1);
                    }
                }
            });
        };

        this.removeHakijaryhma = function(oid) {
            HakijaryhmaValintatapajono.delete({oid:oid}, function() {
                for(i in model.hakijaryhmat) {
                    if(oid === model.hakijaryhmat[i].oid) {
                        model.hakijaryhmat.splice(i,1);
                    }
                }
            });
        };

        function jarjestaJarjestyskriteerit() {
            if(model.jarjestyskriteerit.length > 0) {
                JarjestyskriteeriJarjesta.post(getJarjestyskriteeriOids(), function(result) {
                    model.jarjestyskriteerit = result;
                    model.jarjestyskriteerit.forEach(function(jk){
                        Laskentakaava.get({oid: jk.laskentakaava_id}, function(result) {
                            jk.nimi = result.nimi;
                        });
                    });
                });
            }
        };

        function getJarjestyskriteeriOids() {
            var oids = [];
            for (var i = 0 ; i < model.jarjestyskriteerit.length ; ++i) {
                oids.push(model.jarjestyskriteerit[i].oid);
            }
            return oids;
        }
    };


    return model;
});

function HakukohdeValintatapajonoController($scope, $location, $routeParams, ValintatapajonoModel, HakukohdeValinnanVaiheModel) {

    $scope.hakukohdeOid = $routeParams.hakukohdeOid;
    $scope.valinnanvaiheOid = $routeParams.valinnanvaiheOid;
    //$scope.valintatapajonoOid =  $routeParams.valintatapajonoOid;

    $scope.model = ValintatapajonoModel;
    $scope.model.refreshIfNeeded($routeParams.valintatapajonoOid, $routeParams.id, $routeParams.hakukohdeOid);

    $scope.submit = function() {
        $scope.model.submit($scope.valinnanvaiheOid, HakukohdeValinnanVaiheModel.valintatapajonot);
    }

    $scope.cancel = function() {
        $location.path("/hakukohde/" + $scope.hakukohdeOid + '/valinnanvaihe/'+ $scope.valinnanvaiheOid );
    }

    $scope.addKriteeri = function() {
        $location.path("/hakukohde/" + $scope.hakukohdeOid
            + '/valinnanvaihe/' + $scope.valinnanvaiheOid
            + '/valintatapajono/' + $scope.model.valintatapajono.oid + '/jarjestyskriteeri/');
    }

    $scope.addHakijaryhma = function() {
        $location.path("/hakukohde/" + $scope.hakukohdeOid
            + '/valinnanvaihe/' + $scope.valinnanvaiheOid
            + '/valintatapajono/' + $scope.model.valintatapajono.oid + '/hakijaryhma');
    }

    $scope.modifyKriteeri = function(oid) {
        $location.path("/hakukohde/" + $scope.hakukohdeOid
                    + '/valinnanvaihe/' + $scope.valinnanvaiheOid
                    + '/valintatapajono/' + $scope.model.valintatapajono.oid
                    + '/jarjestyskriteeri/' + oid);
    }

    $scope.remove = function(oid) {
        $scope.model.remove(oid);
    }

    $scope.removeHakjiaryhma = function(oid) {
        $scope.model.removeHakijaryhma(oid);
    }
}



function ValintaryhmaValintatapajonoController($scope, $location, $routeParams, $timeout, ValintatapajonoModel, ValintaryhmaValinnanvaiheModel) {

    $scope.valintaryhmaOid = $routeParams.id;
    $scope.valinnanvaiheOid = $routeParams.valinnanvaiheOid;
    //$scope.valintatapajonoOid =  $routeParams.valintatapajonoOid;

    $scope.model = ValintatapajonoModel;
    $scope.model.refreshIfNeeded($routeParams.valintatapajonoOid, $routeParams.id, $routeParams.hakukohdeOid);

    $scope.submit = function() {
        $scope.model.submit($scope.valinnanvaiheOid, ValintaryhmaValinnanvaiheModel.valintatapajonot);
    }

    $scope.cancel = function() {
        $location.path("/valintaryhma/" + $scope.valintaryhmaOid + '/valinnanvaihe/'+ $scope.valinnanvaiheOid );
    }

    $scope.addKriteeri = function() {
        $location.path("/valintaryhma/" + $scope.valintaryhmaOid
            + '/valinnanvaihe/' + $scope.valinnanvaiheOid
            + '/valintatapajono/' + $scope.model.valintatapajono.oid + '/jarjestyskriteeri/');
    }

    $scope.addHakijaryhma = function() {
        $location.path("/valintaryhma/" + $scope.valintaryhmaOid
            + '/valinnanvaihe/' + $scope.valinnanvaiheOid
            + '/valintatapajono/' + $scope.model.valintatapajono.oid + '/hakijaryhma');
    }

    $scope.modifyKriteeri = function(oid) {
        $location.path("/valintaryhma/" + $scope.valintaryhmaOid
                    + '/valinnanvaihe/' + $scope.valinnanvaiheOid
                    + '/valintatapajono/' + $scope.model.valintatapajono.oid
                    + '/jarjestyskriteeri/' + oid);
    }

    $scope.remove = function(oid) {
        $scope.model.remove(oid);
    }

    $scope.removeHakjiaryhma = function(oid) {
        $scope.model.removeHakijaryhma(oid);
    }
}