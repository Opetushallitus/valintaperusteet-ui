app.factory('HakukohdeModel', function(HakukohdeHakukohdekoodi, KoodistoHakukohdekoodi, Hakukohde, Valintaryhma,
                                        HakukohdeValinnanvaihe, Valinnanvaihe, ValinnanvaiheJarjesta,
                                        HakukohdeKuuluuSijoitteluun, HakukohdeHakijaryhma, Laskentakaava,
                                        HakijaryhmaJarjesta, Hakijaryhma, Haku, TarjontaHaku, HaunTiedot, HakukohdeNimi) {
    var model = new function()  {
        
        this.parentValintaryhma = {};
        this.hakukohde = {};
        this.valinnanvaiheet = [];
        this.hakukohdekoodit = [];
        this.hakijaryhmat = [];

        this.refresh = function(oid) {
            model.parentValintaryhma = {};
            model.hakukohde = {};
            model.valinnanvaiheet = [];
            model.hakukohdekoodit = [];
            model.hakijaryhmat = [];

            Hakukohde.get({oid: oid}, function(result) {
                console.log(result);
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

               kuuluuSijoitteluun(oid);
            });

            KoodistoHakukohdekoodi.get(function(result) {
                model.hakukohdekoodit = result;
            });

            HakukohdeHakijaryhma.get({oid: oid}, function(result) {
                model.hakijaryhmat = result;
                model.hakijaryhmat.forEach(function(hr){
                    Laskentakaava.get({oid: hr.laskentakaava_id}, function(result) {
                        hr.laskentakaava_nimi = result.nimi;
                    });
                });
            });

            model.refreshValinnanvaiheet(oid);
        };
        this.refreshIfNeeded = function(oid) {
            if(oid != model.hakukohde.oid) {

                this.refresh(oid);
            } else {
                kuuluuSijoitteluun(oid);
            }
        };

        this.refreshValinnanvaiheet = function(oid) {
            HakukohdeValinnanvaihe.get({parentOid: oid}, function(result) {
                model.valinnanvaiheet = result;
            });
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
                HakijaryhmaJarjesta.post(getHakijaryhmaOids(), function(result) {
                });
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

    function kuuluuSijoitteluun(oid) {
        if(oid) {
            HakukohdeKuuluuSijoitteluun.get({oid: oid}, function(result) {
                model.kuuluuSijoitteluun = result.sijoitteluun;
            });
        }
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

}