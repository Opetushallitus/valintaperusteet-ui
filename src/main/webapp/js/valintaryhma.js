
app.factory('ValintaryhmaModel', function(Valintaryhma, ChildValintaryhmas, ValintaryhmaValintakoekoodi, ChildHakukohdes, KoodistoValintakoekoodi, Valinnanvaihe, ValintaryhmaValinnanvaihe, Treemodel, ValinnanvaiheJarjesta, ValintaryhmaHakukohdekoodi, KoodistoHakukohdekoodi/*, KoodistoValintakoekoodi*/) {

    var model = new function() {
        this.valintaryhma = {};
        this.valinnanvaiheet =[];
        this.hakukohdekoodit = [];
        this.valintakoekoodit = [];

        this.refresh = function(oid) {
            if(!oid) {
                model.valintaryhma = {};
                model.valinnanvaiheet = [];
            } else {
                
                Valintaryhma.get({oid: oid}, function(result) {
                    model.valintaryhma = result;

                    //if there are empty arrays present that are attached to view, the view won't update when arrays are modified
                    if(model.valintaryhma.hakukohdekoodit !== undefined && model.valintaryhma.hakukohdekoodit.length === 0) {
                        model.valintaryhma.hakukohdekoodit = undefined;
                    }
                    if(model.valintaryhma.valintakoekoodit !== undefined && model.valintaryhma.valintakoekoodit.length === 0) {
                        model.valintaryhma.valintakoekoodit = undefined;
                    }
                });

                ValintaryhmaValinnanvaihe.get({oid: oid}, function(result) {
                    model.valinnanvaiheet = result;
                });

                KoodistoHakukohdekoodi.get(function(result) {
                    model.hakukohdekoodit = result;
                });

                KoodistoValintakoekoodi.get(function(result) {
                    model.valintakoekoodit = result;
                });
                
            }
        };

        this.refreshIfNeeded = function(oid) {
            if( oid !== model.valintaryhma.oid ) {
                this.refresh(oid);
            }
        };

        this.persistValintaryhma = function(oid) {
            Valintaryhma.post(model.valintaryhma, function(result) {
                model.valintaryhma = result;
                Treemodel.refresh();
            });

            if(model.valinnanvaiheet.length > 0) {
                ValinnanvaiheJarjesta.post(getValinnanvaiheOids(), function(result) {});
                for(var i = 0 ; i < model.valinnanvaiheet.length ; ++i) {
                    Valinnanvaihe.post(model.valinnanvaiheet[i], function(){});
                }
            }
            /*
            if(model.valintaryhma.hakukohdekoodit.length > 0) {
                ValintaryhmaHakukohdekoodi.post({valintaryhmaOid: model.valintaryhma.oid}, model.valintaryhma.hakukohdekoodit, function(result) {
                    console.log(result);
                });
            }
            */
        };

        this.removeValinnanvaihe = function(vaihe) {
            Valinnanvaihe.delete({oid: vaihe.oid}, function(){
                for(i in model.valinnanvaiheet) {
                    if(vaihe.oid === model.valinnanvaiheet[i].oid) {
                        model.valinnanvaiheet.splice(i,1);
                    }
                }
            });
        };
    
        function getValinnanvaiheOids() {
            var oids = [];
            for (var i = 0 ; i < model.valinnanvaiheet.length ; ++i) {
                oids.push(model.valinnanvaiheet[i].oid);
            }
            return oids;
        };

        this.getValinnanvaiheType = function(valinnanvaihe) {
            var type;
            if(valinnanvaihe.valinnanVaiheTyyppi === "TAVALLINEN") {
                type = "valinnanvaihe";
            } else {
                type = "valintakoevalinnanvaihe";
            }
            return type;
        };

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
                    ValintaryhmaHakukohdekoodi.insert({valintaryhmaOid: model.valintaryhma.oid}, hakukohdekoodi, function(result) {
                        if(!model.valintaryhma.hakukohdekoodit) {
                            model.valintaryhma.hakukohdekoodit = [];
                        }
                        model.valintaryhma.hakukohdekoodit.push(result);

                    }, function(error){
                        alert(error.data);
                    });
                    return true;
                }
            });
        };

        this.addValintakoeUri = function(valintakoeKoodiUri) {
            model.valintakoekoodit.some(function (koodi) {
                if(koodi.koodiUri == valintakoeKoodiUri) {
                    var valintakoekoodi = {"uri": koodi.koodiUri,
                                         "arvo":koodi.koodiArvo};

                    koodi.metadata.forEach(function(metadata){
                        if(metadata.kieli == "FI") {
                            valintakoekoodi.nimiFi = metadata.nimi;
                        } else if(metadata.kieli == "SV") {
                            valintakoekoodi.nimiSv = metadata.nimi;
                        } else if(metadata.kieli == "EN") {
                            valintakoekoodi.nimiEn = metadata.nimi;
                        }
                    });

                    //persist valintaryhma with added valintakoekoodiuri
                    ValintaryhmaValintakoekoodi.insert({valintaryhmaOid: model.valintaryhma.oid}, valintakoekoodi, function(result) {
                        if(!model.valintaryhma.valintakoekoodit) {
                            model.valintaryhma.valintakoekoodit = [];
                        }
                        model.valintaryhma.valintakoekoodit.push(result);

                    }, function(error){
                        alert(error.data);
                    });
                    return true;
                }
            });
        };

        this.removeHakukohdeKoodi = function(hakukohdekoodi) {
            var hakukohdekoodit,index;
            
            hakukohdekoodit = model.valintaryhma.hakukohdekoodit; 
            index = hakukohdekoodit.indexOf(hakukohdekoodi);

            if(index !== -1) {
                hakukohdekoodit.splice(index,1);
            }
            
            ValintaryhmaHakukohdekoodi.post({valintaryhmaOid: model.valintaryhma.oid}, hakukohdekoodit, function(result) {
                if(model.valintaryhma.hakukohdekoodit.length === 0) {
                    model.valintaryhma.hakukohdekoodit = undefined;
                }
            });
        }

        this.removeValintakoeKoodi = function(valintakoekoodi) {
            var valintakoekoodit, index;

            valintakoekoodit = model.valintaryhma.valintakoekoodit;
            index = valintakoekoodit.indexOf(valintakoekoodi);

            if(index !== -1) {
                valintakoekoodit.splice(index,1);
            }

            ValintaryhmaValintakoekoodi.post({valintaryhmaOid: model.valintaryhma.oid}, valintakoekoodit, function(result) {
                if(model.valintaryhma.valintakoekoodit.length === 0) {
                    model.valintaryhma.valintakoekoodit = undefined;
                }
            });
        }

    }

    return model;
});

function valintaryhmaController($scope, $location, $routeParams, ValintaryhmaModel) {
    $scope.valintaryhmaOid = $routeParams.id;
    $scope.model = ValintaryhmaModel;
    $scope.model.refreshIfNeeded($scope.valintaryhmaOid);

    $scope.submit = function() {
        $scope.model.persistValintaryhma($scope.valintaryhmaOid);
    }

    $scope.cancel = function() {
        $location.path("/");
    }

    $scope.lisaaValinnanVaihe = function() {
        $location.path("/valintaryhma/" + $scope.valintaryhmaOid + "/valinnanvaihe/");
    }

    $scope.lisaaValintakoeValinnanVaihe = function() {
        $location.path("/valintaryhma/" + $scope.valintaryhmaOid + "/valintakoevalinnanvaihe/");
    }

    $scope.addHakukohdeUri = function(newHakukohdeUri) {
        $scope.model.addHakukohdeUri(newHakukohdeUri);
    }

    $scope.addValintakoeUri = function(newValintakoeUri) {
        $scope.model.addValintakoeUri(newValintakoeUri);
    }

    $scope.toValintaryhmaForm = function() {
        $location.path("/valintaryhma/" + $scope.valintaryhmaOid);
    }

    $scope.removeHakukohdeKoodi = function(hakukohdekoodi) {
        $scope.model.removeHakukohdeKoodi(hakukohdekoodi);
    }

    $scope.removeValintakoeKoodi = function(valintakoekoodi) {
        $scope.model.removeValintakoeKoodi(valintakoekoodi);
    }

    $scope.setHakukohdeUri = function(newUri) {
        $scope.newHakukohdeUri = newUri;
    }

}


app.factory('ValintaryhmaCreatorModel', function($resource, $location, $routeParams, Valintaryhma, ChildValintaryhmas, Treemodel ) {

    var model = new function() {
        this.valintaryhma = {};

        this.refresh = function() {
            model.valintaryhma = {};
        };

        this.refreshIfNeeded = function() {
            this.refresh();
        };

        this.persistValintaryhma = function(oid) {
            
            var newValintaryhma = {
                hakuOid: 1,
                lapsihakukohde: false,
                lapsivalintaryhma: false,
                nimi: model.valintaryhma.nimi
            };

            if(oid === "root"){
                Valintaryhma.insert(newValintaryhma, function(result) {
                    Treemodel.refresh();
                    $location.path("/");
                });
            } else {
                ChildValintaryhmas.insert({"parentOid": oid}, newValintaryhma, function(result){
                    Treemodel.refresh();
                    model.valintaryhma = result;
                    $location.path("/valintaryhma/" + oid);
                });
            }
        };
    }

    return model;
});

function ValintaryhmaCreatorController($scope, $location, $routeParams, ValintaryhmaCreatorModel) {
    $scope.valintaryhmaOid = $routeParams.id;
    $scope.model = ValintaryhmaCreatorModel;
    $scope.model.refreshIfNeeded($scope.valintaryhmaOid);

    $scope.submit = function() {
        $scope.model.persistValintaryhma($scope.valintaryhmaOid);
    }

    $scope.cancel = function() {
        $location.path("/");
    }

}




app.factory('ValintaryhmaChildrenModel', function($resource, $location, $routeParams, Hakukohde, Valintaryhma, ChildValintaryhmas, ChildHakukohdes ) {

    var model = new function() {
        this.valintaryhma = {};
        this.childValintaryhmat = [];
        this.childHakukohteet = [];

        this.refresh = function(oid) {
            if(!oid) {
                model.valintaryhma = {};
                model.childValintaryhmat = [];
                model.childHakukohteet = [];
            } else {

                Valintaryhma.get({oid: oid}, function(result) {
                    model.valintaryhma = result;
                });
               
                ChildValintaryhmas.get({parentOid: oid}, function(result) {
                    model.childValintaryhmat = result;
                });

                ChildHakukohdes.get({oid: oid}, function(result) {
                    model.childHakukohteet = result;
                });

            }
        };

        this.refreshIfNeeded = function(oid) {
            if( oid !== model.valintaryhma.oid ) {
                this.refresh(oid);
            }
        };

        this.persistChildHakukohteet = function() {
            model.childHakukohteet.forEach(function(element, index, array) {
                Hakukohde.post(element, function(result) {
                    model.refresh(model.valintaryhma.oid);
                })
            });
        };

        this.addHakukohde = function(oid) {
            if(!model.valintaryhmaContainsHakukohde(oid)) {

                Hakukohde.get({oid: oid}, function(result) {
                    if(result) {
                        result.valintaryhma = model.valintaryhma;
                        model.childHakukohteet.push(result);
                        model.persistChildHakukohteet();  
                    }
                });
            }
        };

        this.valintaryhmaContainsHakukohde = function(hakukohdeOid) {

            var currentHakukohdeOids = [];
            model.childHakukohteet.forEach(function(element, index, array) {
                currentHakukohdeOids.push(element.oid);
            });

            var hakukohdeExistIndex = currentHakukohdeOids.indexOf(hakukohdeOid);
            if(hakukohdeExistIndex === -1) {
                return false;
            } else {
                return true;
            }
        };
    }

    return model;
});

function ValintaryhmaChildrenController($scope, $location, $routeParams, ValintaryhmaChildrenModel) {
    $scope.valintaryhmaOid = $routeParams.id;
    $scope.model = ValintaryhmaChildrenModel;
    $scope.model.refreshIfNeeded($scope.valintaryhmaOid);

    $scope.toValintaryhmaForm = function() {
        $location.path("/valintaryhma/" + $scope.valintaryhmaOid);
    };
}
