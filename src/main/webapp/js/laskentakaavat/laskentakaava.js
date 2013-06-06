


function LaskentakaavaController($scope, $location, $routeParams, Laskentapuu, KaavaValidointi, LaskentakaavaLista) {
    if($scope.fetched != $routeParams.laskentakaavaOid) {
        Laskentapuu.refresh($routeParams.laskentakaavaOid);
    }
    $scope.fetched = $routeParams.laskentakaavaOid;

    if($routeParams.valintaryhmaOid) {
        LaskentakaavaLista.refresh($routeParams.valintaryhmaOid, false);
    } else {
        LaskentakaavaLista.refresh(null, false);
    }

    $scope.kaavaLista = LaskentakaavaLista;
    $scope.domain = Laskentapuu;
    $scope.showTemplate = false;
    $scope.selected = null;
    $scope.errors = [];

    $scope.showDetails = function(funktio) {
        $scope.f = funktio;
        $scope.showTemplate = true;
        $scope.showKaavaMenu = false;
        $scope.selected = funktio;
    }

    $scope.showKaavaDetails = function(funktio) {
        $scope.f = funktio;
        $scope.showKaavaMenu = true;
        $scope.showTemplate = false;
        $scope.selected = funktio;
    }

    $scope.addChildLaskentakaava = function(parentFunktio, argumenttiNimi) {
        var newKaava = parentFunktio.addNewLaskentakaavaReference(argumenttiNimi, $routeParams.valintaryhmaOid);
        $scope.showKaavaDetails(newKaava);
    }

    $scope.addNewFunktio = function(parentFunktio, funktioNimi, argumenttiNimi) {
        var newFunc = parentFunktio.addNewFunktiokutsu(funktioNimi, argumenttiNimi);
        $scope.showDetails(newFunc);
    }

    $scope.kaavaDragged = function(funktio, oldParent, newParent, index) {
        var oldIndex = oldParent.funktioargumentit.indexOf(funktio)
        var func = funktio

        // Jos pudotetaan eri parenttiin, poistetaan vanhasta paikasta.
        if(oldParent !== newParent) {
            func = oldParent.removeChildFunktio(funktio)
        }
        newParent.addChildAt(func, index)
        newParent.init()
        oldParent.init()
    }

    $scope.saveKaavaAsCompleted = function() {
        var kaava = Laskentapuu.laskentakaava()[0].getData();
        var validateKaava = {};
        angular.copy(kaava, validateKaava);
        KaavaValidointi.post({}, validateKaava, function(data) {
            //Laskentapuu.setKaavaData(data)
            $scope.selected = null
            $scope.showTemplate = false

            if(Laskentapuu.laskentakaava()[0].hasErrors()) {
                $scope.errors = Laskentapuu.laskentakaava()[0].getAllErrors()
                return
            }

            kaava.onLuonnos = false
            kaava.$save({oid: kaava.id}, function(data) {
                Laskentapuu.setKaavaData(data);
            })
            $scope.errors = []
        })

    }

    $scope.saveKaavaAsDraft = function() {
        var kaava = Laskentapuu.laskentakaava()[0].getData()
        kaava.onLuonnos = true
        kaava.$save({oid: kaava.id}, function(data) {
            Laskentapuu.setKaavaData(data)
            $scope.selected = null
            $scope.showTemplate = false
        })
    }

    $scope.goToListing = function() {
        if($routeParams.valintaryhmaOid) {
            $location.path("/valintaryhma/" + $routeParams.valintaryhmaOid + "/laskentakaava")
        } else {
            $location.path("/laskentakaava")
        }
    }
}




app.factory('FunktioDSL', function($resource, FunktioKuvaus) {
    var model = [];
    var funktioLogic = {
        refresh: function() {
            FunktioKuvaus.get({}, function(result) {
                model = result;
            });
        },
        findByFunktionimi: function(funktionimi) {
            for(i in model) {
                var f = model[i];
                if(f.nimi == funktionimi) {
                    return f;
                }
            }
            throw Error("Function " + funktionimi + " not found.");
        }
    }
    return funktioLogic;
});

app.factory('Laskentapuu', function(Laskentakaava, FunktioKuvaus) {

    var model = []
    var kuvaus = {}

    var domainObject = {
        laskentakaava: function() {
            return model;
        },
        setKaavaData: function(data) {
            model[0] = new Kaava(kuvaus, data);
        },
        refresh: function(id) {
            FunktioKuvaus.get({}, function(res) {
                kuvaus = res;
                Laskentakaava.get({oid: id}, function(kaava) {
                    model = new Array(new Kaava(kuvaus, kaava))
                });
            });
        }
    }

    return domainObject;
});