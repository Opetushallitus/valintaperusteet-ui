


app.factory('LaskentakaavaLista', function(Laskentakaava, ParentValintaryhmas) {
    
    var model = new function() {
        this.valintaryhmaList = [];

        this.refresh = function(valintaryhmaId, myosLuonnos) {
            if(valintaryhmaId) {
                model.valintaryhmaList[0] = model.findWithValintaryhma(valintaryhmaId, myosLuonnos);
            } else {
                model.valintaryhmaList[0] = model.findRootLevelLaskentakaavas(myosLuonnos);
            }
        }
        
        this.findWithValintaryhma = function(valintaryhmaId, myosLuonnos) {
            var list = [];
            ParentValintaryhmas.get({parentOid: valintaryhmaId}, function(data) {
                for(var i in data) {
                    var valintaryhma = data[i];
                    valintaryhma['laskentakaavat'] = Laskentakaava.list({valintaryhma: valintaryhma.oid, myosLuonnos: myosLuonnos});
                }

                var paataso = model.findRootLevelLaskentakaavas(myosLuonnos);
                list.push.apply(list, data);
                list.push(paataso);
            });
            return list;
        }

        this.findRootLevelLaskentakaavas = function(myosLuonnos) {
            var paataso = {
                nimi: "Yleiset kaavat",
                laskentakaavat: []
            };
            Laskentakaava.list({myosLuonnos: myosLuonnos}, function(data) {
                paataso.laskentakaavat = data;
            });

            return paataso;
        }

        
        this.valintaryhmaList = function() {
            return model.valintaryhmaList;
        }

        
    }

    return model;
    
});









function LaskentakaavaListController($scope, $location, $routeParams, Laskentakaava, LaskentakaavaLista) {
    $scope.linkprefix = '';
    var params = {};
    var saveParams = {};

    if($routeParams.valintaryhmaOid) {
        LaskentakaavaLista.refresh($routeParams.valintaryhmaOid, true);
        saveParams.valintaryhma =  {oid: $routeParams.valintaryhmaOid};
        params.valintaryhma = $routeParams.valintaryhmaOid;
        $scope.valintaryhmaOid = $routeParams.valintaryhmaOid;
        $scope.linkprefix = '/valintaryhma/' + $scope.valintaryhmaOid;
        $scope.valintaryhmat = LaskentakaavaLista;
    }

    var queryParams = $.extend({myosLuonnos: true}, params);
    $scope.laskentakaavat = Laskentakaava.list(queryParams);
    $scope.showForm = false;

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

