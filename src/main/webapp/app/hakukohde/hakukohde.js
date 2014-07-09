app.factory('HakukohdeModel', function($q, HakukohdeHakukohdekoodi, KoodistoHakukohdekoodi, Hakukohde, Valintaryhma,
                                        HakukohdeValinnanvaihe, Valinnanvaihe, ValinnanvaiheJarjesta,
                                        HakukohdeKuuluuSijoitteluun, HakukohdeHakijaryhma, Laskentakaava,
                                        HakijaryhmaJarjesta, Hakijaryhma, Haku, TarjontaHaku, HaunTiedot, HakukohdeNimi,
                                        HakijaryhmanValintatapajonot) {
    var model = new function()  {
        this.hakukohdeOid = "";
        this.loaded = $q.defer();
        this.parentValintaryhma = {};
        this.hakukohde = {};
        this.valinnanvaiheet = [];
        this.hakukohdekoodit = [];
        this.hakijaryhmat = [];
        this.kuuluuSijoitteluun = {};

        this.refresh = function(oid) {
            model.hakukohdeOid = oid;
            model.parentValintaryhma = {};
            model.hakukohde = {};
            model.valinnanvaiheet = [];
            model.hakukohdekoodit = [];
            model.hakijaryhmat = [];

            Hakukohde.get({oid: oid}, function(result) {
                model.hakukohde = result;
                if(model.hakukohde.valintaryhma_id) {
                    Valintaryhma.get({oid: model.hakukohde.valintaryhma_id}, function(result) {
                        model.parentValintaryhma = result;
                    });
                }

               HaunTiedot.get({hakuOid: result.hakuoid}, function(tiedot) {
                   model.haku = tiedot;
               });

               HakukohdeNimi.get({hakukohdeoid: oid}, function(result){
                   model.hakukohdeNimi = result;
               });

                HakukohdeKuuluuSijoitteluun.get({oid: oid}, function(result) {
                    model.kuuluuSijoitteluun = result.sijoitteluun;
                });

                model.loaded.resolve();
            }, function(){
                "use strict";
                loaded.reject();
            });

            KoodistoHakukohdekoodi.get(function(result) {
                model.hakukohdekoodit = result;
            });

            HakukohdeHakijaryhma.get({oid: oid}, function(result) {
                model.hakijaryhmat = result;
                model.hakijaryhmat.forEach(function(hr){
                    Laskentakaava.get({oid: hr.laskentakaavaId}, function(result) {
                        hr.laskentakaava_nimi = result.nimi;
                    });
                    hr.valintatapajonot = HakijaryhmanValintatapajonot.get({oid: hr.oid});
                });
            });

            HakukohdeValinnanvaihe.get({parentOid: oid}, function(result) {
                model.valinnanvaiheet = result;
            });
        };

        this.refreshIfNeeded = function(oid) {
            if(oid !== model.hakukohdeOid) { //use hakukohdeOid -variable to prevent multiple refresh calls
                this.refresh(oid);
            }
        };

        this.persistHakukohde = function() {
            Hakukohde.post(model.hakukohde, function(result) {

            });
            if(model.valinnanvaiheet.length > 0) {
                ValinnanvaiheJarjesta.post(getValinnanvaiheOids(), function(result) {
                    for(var i = 0 ; i < model.valinnanvaiheet.length ; ++i) {
                        Valinnanvaihe.post(model.valinnanvaiheet[i], function(){

                        });
                    }
                });
            }

            if(model.hakijaryhmat.length > 0) {
                HakijaryhmaJarjesta.post(model.hakijaryhmat, function(result) {});
            }
        };

        this.remove = function(vaihe) {
            Valinnanvaihe.delete({oid: vaihe.oid} ,function(result) {
                for(i in model.valinnanvaiheet) {
                    if(vaihe.oid === model.valinnanvaiheet[i].oid) {
                        model.valinnanvaiheet.splice(i,1);
                    }
                }
            });
        };

        this.getValinnanvaiheType = function(valinnanvaihe) {
            var type;
            if(valinnanvaihe.valinnanVaiheTyyppi === "TAVALLINEN") {
                type = "valinnanvaihe";
            } else {
                type = "valintakoevalinnanvaihe";
            }
            return type;
        }

        this.addHakukohdeUri = function(hakukohdekoodiUri) {
            model.hakukohdekoodit.some(function (koodi) {
                if(koodi.koodiUri == hakukohdekoodiUri) {
                    var hakukohdekoodi = {"uri": koodi.koodiUri,
                                         "arvo":koodi.koodiArvo};

                    koodi.metadata.forEach(function(metadata){
                        if(metadata.kieli == "FI") {
                            hakukohdekoodi.nimiFi = metadata.nimi;
                        } else if(metadata.kieli == "SV") {
                            hakukohdekoodi.nimiSv = metadata.nimi;
                        } else if(metadata.kieli == "EN") {
                            hakukohdekoodi.nimiEn = metadata.nimi;
                        }
                    });
                    HakukohdeHakukohdekoodi.post({hakukohdeOid: model.hakukohde.oid}, hakukohdekoodi, function(result) {
                        model.hakukohde.hakukohdekoodi = result;
                    }, function(error){
                        alert(error.data);
                    });
                    return true;
                }
            });


        };



        this.removeHakijaryhma = function(hakijaryhmaOid) {
            Hakijaryhma.delete({oid: hakijaryhmaOid}, function(){
                for(i in model.hakijaryhmat) {
                    if(hakijaryhmaOid === model.hakijaryhmat[i].oid) {
                        model.hakijaryhmat.splice(i,1);
                    }
                }
            });
        }

    };

    function getValinnanvaiheOids() {
        var oids = [];
        for (var i = 0 ; i < model.valinnanvaiheet.length ; ++i) {
            oids.push(model.valinnanvaiheet[i].oid);
        }
        return oids;
    }

    function getHakijaryhmaOids() {
        var oids = [];
        for (var i = 0 ; i < model.hakijaryhmat.length ; ++i) {
            oids.push(model.hakijaryhmat[i].oid);
        }
        return oids;
    }

    return model;
});

function HakukohdeController($q, $timeout, $scope, $location, $routeParams, HakukohdeModel) {

    $scope.hakukohdeOid = $routeParams.hakukohdeOid;
    $scope.model = HakukohdeModel;
    $scope.model.refreshIfNeeded($scope.hakukohdeOid);

    $scope.submit = function() {
        $scope.model.persistHakukohde();
    }
    $scope.cancel = function() {
        $location.path("/");
    }
    $scope.lisaaValinnanVaihe = function() {
        $location.path("/hakukohde/" + $scope.hakukohdeOid + "/valinnanvaihe/");
    }
    $scope.lisaaValintakoeValinnanVaihe = function() {
        $location.path("/hakukohde/" + $scope.hakukohdeOid + "/valintakoevalinnanvaihe/");
    }

    $scope.addHakukohdeUri = function() {
            $scope.model.addHakukohdeUri($scope.uusiHakukohdeUri.koodiUri);
            $scope.uusiHakukohdeUri = "";
    }

    $scope.lisaaHakijaryhma = function() {
        $location.path("/hakukohde/" + $scope.hakukohdeOid + "/hakijaryhma/");
    }

    $scope.removeHakijaryhma = function(hakijaryhmaOid) {
        $scope.model.removeHakijaryhma(hakijaryhmaOid);
    }

    $scope.$on('valintaryhmansiirto', function(){
        $scope.model.refresh($scope.hakukohdeOid);
    });

}

app.factory('ValintaryhmaSiirtoModel', function($resource, $location, $routeParams, Valintaryhma, ChildValintaryhmas, Treemodel, HakukohdeSiirra) {

    var model = new function() {
        this.valintaryhma = {};

        this.refresh = function() {
            model.valintaryhma = {};
            model.parentOid  = "";

        };

        this.refreshIfNeeded = function() {
            this.refresh();
        };

        this.move = function() {

            if(!model.parentOid) {
                console.log("Valintaryhmää ei ole valittu.");
            } else {
                HakukohdeSiirra.siirra({hakukohdeOid: $routeParams.hakukohdeOid}, model.parentOid, function(result) {

                });
            }

        };
    }

    return model;
});

function ValintaryhmanSiirtoController($scope, $resource, $routeParams, ValintaryhmaSiirtoModel, Ylavalintaryhma, HakukohdeSiirra) {
    $scope.valintaryhmaOid = $routeParams.id;
    $scope.model = ValintaryhmaSiirtoModel;
    $scope.model.refreshIfNeeded($scope.valintaryhmaOid);

    $scope.domain = Ylavalintaryhma;
    Ylavalintaryhma.refresh();


    $scope.siirra = function() {
        if(!$scope.model.parentOid) {
            console.log("Valintaryhmää ei ole valittu.");
        } else {
            HakukohdeSiirra.siirra({hakukohdeOid: $routeParams.hakukohdeOid}, $scope.model.parentOid, function(result) {
                $scope.$emit('valintaryhmansiirto');
                $scope.$broadcast('suljemodal');
            });
        }
    };

    $scope.openValintaryhmaModal = function () {
        $scope.show();
    };
}