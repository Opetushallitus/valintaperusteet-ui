

app.factory('HakukohdeModel', function(HakukohdeHakukohdekoodi, KoodistoHakukohdekoodi, Hakukohde, Valintaryhma, HakukohdeValinnanvaihe, Valinnanvaihe, ValinnanvaiheJarjesta, HakukohdeKuuluuSijoitteluun) {
    var model = new function()  {
        
        this.parentValintaryhma = {};
        this.hakukohde = {};
        this.valinnanvaiheet = [];
        this.hakukohdekoodit = [];
        this.refresh = function(oid) {
            Hakukohde.get({oid: oid}, function(result) {
                model.hakukohde = result;
                Valintaryhma.get({oid: model.hakukohde.valintaryhma_id}, function(result) {
                    model.parentValintaryhma = result;
                });

                kuuluuSijoitteluun(oid);
            });

            KoodistoHakukohdekoodi.get(function(result) {
                model.hakukohdekoodit = result;
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
            Hakukohde.post(model.hakukohde, function(result) {});
            if(model.valinnanvaiheet.length > 0) {
                ValinnanvaiheJarjesta.post(getValinnanvaiheOids(), function(result) {});
                for(var i = 0 ; i < model.valinnanvaiheet.length ; ++i) {
                    Valinnanvaihe.post(model.valinnanvaiheet[i], function(){

                    });
                }
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

                    //persist valintaryhma with added hakukohdekoodiuri
                    HakukohdeHakukohdekoodi.post({hakukohdeOid: model.hakukohde.oid}, hakukohdekoodi, function(result) {
                        model.hakukohde.hakukohdekoodi = result;
                    }, function(error){
                        alert(error.data);
                    });
                    return true;
                }
            });


        };

    };

    function getValinnanvaiheOids() {
        var oids = [];
        for (var i = 0 ; i < model.valinnanvaiheet.length ; ++i) {
            oids.push(model.valinnanvaiheet[i].oid);
        }
        return oids;
    }

    function kuuluuSijoitteluun(oid) {
        HakukohdeKuuluuSijoitteluun.get({oid: oid}, function(result) {
            model.hakukohde.kuuluuSijoitteluun = result.sijoitteluun;
        });
    }

    return model;
});



function HakukohdeController($scope, $location, $routeParams, HakukohdeModel) {
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
            $scope.model.addHakukohdeUri($scope.uusiHakukohdeUri);
            $scope.uusiHakukohdeUri = "";
    }

}

function HakukohdeLaskentakaavaController($scope, $location, $routeParams, Laskentakaava) {
     $scope.hakukohdeOid = $routeParams.hakukohdeOid;
}








app.factory('HakukohdeCreatorModel', function($location, NewHakukohde, Treemodel) {
    var model = new function()  {
        this.hakukohde = {};

        this.refresh = function() {
            model.hakukohde = {};
        }

        this.persistHakukohde = function() {
            NewHakukohde.insert(model.hakukohde, function(result) {
                Treemodel.refresh();
                $location.path("/");
            }, function(error){

            });
        }

    }

    return model;
});

function HakukohdeCreatorController($scope, $location, $routeParams, HakukohdeCreatorModel) {
    //$scope.valintaryhmaOid = $routeParams.valintaryhmaOid;
    $scope.model = HakukohdeCreatorModel;
    $scope.model.refresh();
    $scope.showOidInputs = true;

    $scope.cancel = function() {
        $location.path("/");
    };

    $scope.submit = function() {
        $scope.model.persistHakukohde();
    }
}