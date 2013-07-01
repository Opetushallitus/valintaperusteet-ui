
app.factory('HakukohdeLaskentakaavaLista', function(Laskentakaava, ParentValintaryhmas, Hakukohde, Valintaryhma) {
    
    var model = new function() {

        this.valintaryhmaList = [];
        this.hakukohde = {};
        this.parentValintaryhma = {};
        this.laskentakaavat = [];

        this.refreshIfNeeded = function(hakukohdeOid, myosLuonnos) {
            if(hakukohdeOid && hakukohdeOid !== model.hakukohde.oid) {
                model.valintaryhmaList[0] = model.refresh(hakukohdeOid, myosLuonnos);
            } 
        };

        this.refresh = function(hakukohdeOid, myosLuonnos) {
            var list = [];

            Hakukohde.get({oid: hakukohdeOid}, function(result) {
                model.hakukohde = result;
                  
                Valintaryhma.get({oid: model.hakukohde.valintaryhma_id}, function(result) {
                    model.parentValintaryhma = result;
                    

                    ParentValintaryhmas.get({parentOid: model.parentValintaryhma.oid}, function(data) {
                        for(var i in data) {
                            var valintaryhma = data[i];
                            valintaryhma['laskentakaavat'] = Laskentakaava.list({valintaryhma: valintaryhma.oid, myosLuonnos: myosLuonnos});
                        }
                        
                        var paataso = model.findRootLevelLaskentakaavas(myosLuonnos);
                        list.push.apply(list, data);
                        list.push(paataso);
                    });

                    var laskentakaavaQueryParams = {};

                    laskentakaavaQueryParams.hakukohde = hakukohdeOid;

                    var queryParams = $.extend({myosLuonnos: true}, laskentakaavaQueryParams);
                    model.laskentakaavat = Laskentakaava.list(queryParams);

                });
            });

            return list;
        };

        this.findRootLevelLaskentakaavas = function(myosLuonnos) {
            var paataso = {
                nimi: "Yleiset kaavat",
                laskentakaavat: []
            };
            Laskentakaava.list({myosLuonnos: myosLuonnos}, function(data) {
                paataso.laskentakaavat = data;
            });

            return paataso;
        };

        this.valintaryhmaList = function() {
            return model.valintaryhmaList;
        };
        
    }

    return model;
});


function HakukohdeLaskentakaavaListController($scope, $location, $routeParams, Laskentakaava, HakukohdeLaskentakaavaLista, HakukohdeModel, Valintaryhma, Hakukohde) {
    $scope.hakukohdeModel = HakukohdeModel;
    $scope.hakukohdeOid = $routeParams.hakukohdeOid;

    $scope.hakukohdeLaskentakaavaLista = HakukohdeLaskentakaavaLista;
    $scope.hakukohdeLaskentakaavaLista.refreshIfNeeded($scope.hakukohdeOid, true);
    
    $scope.linkprefix = '/hakukohde/' + $scope.hakukohdeOid;

    $scope.showForm = false;
    var saveParams = {}; 
    saveParams.hakukohde = {oid: $routeParams.hakukohdeOid};

    $scope.createKaava = function() {
        $scope.kaava = {
            tyyppi: "NIMETTYLUKUARVO"
        };
        $scope.originalKaava = angular.copy($scope.kaava)
        $scope.showForm = true;
    }

    $scope.editKaava = function(kaava) {
        $scope.showForm = true;
        $scope.kaava = kaava;
        $scope.originalKaava = angular.copy(kaava);
    }

    $scope.cancelEdit = function(kaava) {
        $scope.showForm = false;
        // Palauta originaalit arvot
        angular.forEach($scope.originalKaava, function(value, key) {
            $scope.kaava[key] = value;
        });
        $scope.originalKaava = null;
    }

    $scope.saveKaava = function(kaavaData) {
        if(kaavaData.id) {
            Laskentakaava.updateMetadata({oid: kaavaData.id}, kaavaData, function(data) {
                $scope.showForm = false
            });
        } else {
            var kaava = {
                onLuonnos: true,
                nimi: kaavaData.nimi,
                kuvaus: kaavaData.kuvaus,
                funktiokutsu: {
                    funktionimi: kaavaData.tyyppi,
                    syoteparametrit: [
                        {
                            avain: "nimi",
                            arvo: kaavaData.nimi
                        }
                    ]
                }
            };

            kaava = $.extend(kaava, saveParams);

            Laskentakaava.insert({}, kaava, function(result) {
                $location.path($scope.linkprefix + "/laskentakaava/" + result.id);
            });
        }
    }

}