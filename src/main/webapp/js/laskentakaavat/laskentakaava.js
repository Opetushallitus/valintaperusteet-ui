


function LaskentakaavaController($scope, $location, $routeParams, Laskentapuu, KaavaValidointi, LaskentakaavaLista) {

    $scope.fetched = $routeParams.laskentakaavaOid;

    if($routeParams.valintaryhmaOid) {
        LaskentakaavaLista.refresh($routeParams.valintaryhmaOid, null, false);
    } else if($routeParams.hakukohdeOid) {
        LaskentakaavaLista.refresh(null, $routeParams.hakukohdeOid, false);
    } else {
        LaskentakaavaLista.refresh(null, null, false);
    }

    $scope.kaavaLista = LaskentakaavaLista;
    $scope.domain = Laskentapuu;

    $scope.showTemplate = false;
    $scope.selected = null;
    
    var promise = Laskentapuu.refresh($routeParams.laskentakaavaOid);
    promise.then(function() {
        $scope.funktio = Laskentapuu.laskentakaavapuu.funktio;
    });

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
        var newFunc = parentFunktio.addNewFunktiokutsu(parentFunktio, funktioNimi, argumenttiNimi);
        $scope.showDetails(newFunc);
    }

    $scope.kaavaDragged = function(funktio, oldParent, newParent, index) {

        var kaavaBeforeDrag = Laskentapuu.laskentakaava().getData();
        var oldIndex = oldParent.funktioargumentit.indexOf(funktio);

        var func = funktio;

        newParent.addChildAt(func, index);
        newParent.init();
        oldParent.init();

        func = oldParent.removeChildFunktio(funktio); 
    }

    //called from kaavaeditor -directive when an item has been moved in kaavaeditor
    $scope.$on('kaavadrag', function(event, paramObject) {
        $scope.kaavaDragged(paramObject.draggedFunktio, paramObject.oldParentFunktio, paramObject.newParentFunktio, paramObject.index);
    });

    
    $scope.validoiKaavaData = function() {
        var kaava = Laskentapuu.laskentakaava().getData();
        var validateKaava = {};
        angular.copy(kaava, validateKaava);
        KaavaValidointi.post({}, validateKaava, function(data) {
            Laskentapuu.setKaavaData(data);
            if(Laskentapuu.laskentakaava().hasErrors()) {
                $scope.errors = Laskentapuu.laskentakaava().getAllErrors()
                Laskentapuu.setKaavaData();
            }   
        });
    }
    
    

    $scope.saveKaavaAsCompleted = function() {
        var kaava = Laskentapuu.laskentakaava().getData();
        var validateKaava = {};
        angular.copy(kaava, validateKaava);
        $scope.test = validateKaava;
        KaavaValidointi.post({}, validateKaava, function(data) {

            Laskentapuu.setKaavaData(data)
            $scope.selected = null
            $scope.showTemplate = false

            if(Laskentapuu.laskentakaava().hasErrors()) {
                $scope.errors = Laskentapuu.laskentakaava().getAllErrors()
                Laskentapuu.setKaavaData(kaava);   
                return             
                
            } 
            
            kaava.onLuonnos = false

            kaava.$save({oid: kaava.id}, function(data) {
                Laskentapuu.setKaavaData(data);
            });

            $scope.errors = []    
            
            
        });

    }
    
    

    $scope.saveKaavaAsDraft = function() {
        var kaava = Laskentapuu.laskentakaava().getData()
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
        } else if($routeParams.hakukohdeOid) {
            $location.path("/hakukohde/" + $routeParams.hakukohdeOid + "/laskentakaava")
        } else {
            $location.path("/laskentakaava")
        }
    }

}




app.factory('Laskentapuu', function($q, Laskentakaava, FunktioKuvaus) {
    
    var LaskentapuuWrapper = new function() {
        this.laskentakaavapuu = {};
        this.kuvaus = {};

        this.laskentakaava = function() {
            return LaskentapuuWrapper.laskentakaavapuu;
        }

        this.setKaavaData = function(data) {
            LaskentapuuWrapper.laskentakaavapuu = new Kaava(LaskentapuuWrapper.kuvaus, data);
        }

        this.refresh = function(id) {
            var deferred = $q.defer();
            FunktioKuvaus.get({}, function(res) {
                LaskentapuuWrapper.kuvaus = res;
                Laskentakaava.get({oid: id}, function(kaava) {
                    LaskentapuuWrapper.laskentakaavapuu = new Kaava(LaskentapuuWrapper.kuvaus,kaava);
                    deferred.resolve();
                });
            });
            return deferred.promise;
        }
    }

    return LaskentapuuWrapper;
});

