


function LaskentakaavaController($scope, $location, $routeParams, Laskentapuu, KaavaValidointi, LaskentakaavaLista, LaskentakaavaService, TemplateService, FunktioService) {


    //servicet laskentakaavapuun piirtämiseen
    $scope.templateService = TemplateService;
    $scope.funktioService = FunktioService;
    $scope.funktioService.refresh();

    //Laskentakaavapuu datan skooppiin
    $scope.laskentakaavaOid = $routeParams.laskentakaavaOid;
    $scope.model = LaskentakaavaService;
    $scope.model.refresh($scope.laskentakaavaOid);


    

    // Tieto laskentakaavan / funktion näyttämisestä ja piilottamisesta täytyy säilyttää tässä (parent) skoopissa
    // objektissa, jotta childskoopeissa tehdyt muutokset heijastuvat parenttiin ja muihin childskooppeihin 
    $scope.funktioasetusTemplatePicker = {
        showFunktioInformation: false,
        showLaskentakaavaInformation: false
    }

    if($routeParams.valintaryhmaOid) {
        LaskentakaavaLista.refresh($routeParams.valintaryhmaOid, null, false);
    } else if($routeParams.hakukohdeOid) {
        LaskentakaavaLista.refresh(null, $routeParams.hakukohdeOid, false);
    } else {
        LaskentakaavaLista.refresh(null, null, false);
    }

    
    
    var promise = Laskentapuu.refresh($routeParams.laskentakaavaOid);
    promise.then(function() {
        $scope.funktio = Laskentapuu.laskentakaavapuu.funktio;
    });



    $scope.kaavaInformationView = function(funktio, isFunktiokutsu) {
        $scope.funktioSelection = funktio;
        
        if(isFunktiokutsu) {
            $scope.funktioasetusTemplatePicker.showFunktioInformation = true;
            $scope.funktioasetusTemplatePicker.showLaskentakaavaInformation = false;
        } else {
            $scope.funktioasetusTemplatePicker.showFunktioInformation = false;
            $scope.funktioasetusTemplatePicker.showLaskentakaavaInformation = true;
        }
    }

    $scope.syoteparametriTemplate = function(syoteparametri, index) {
        return $scope.templateService.getSyoteparametriTemplate(syoteparametri, index);
    }


    $scope.persistLaskentakaava = function() {

        $scope.funktioasetusTemplatePicker.showFunktioInformation = false;
        $scope.funktioasetusTemplatePicker.showLaskentakaavaInformation = false;
        $scope.funktioSelection = undefined;

        KaavaValidointi.post({}, $scope.model.laskentakaavapuu, function(result) {
            
            $scope.model.laskentakaavapuu.$save({oid: $scope.model.laskentakaavapuu.id}, function(result) {
                Laskentapuu.setKaavaData(result);
            });

        }); 
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
        console.log(kaava);
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

app.factory('LaskentakaavaService', function($q, Laskentakaava){
    var model = new function() {
        this.laskentakaavapuu = {};

        this.refresh = function(oid) {
            Laskentakaava.get({oid: oid}, function(result) {
                model.laskentakaavapuu = result
            });
        }
    }   

    return model;
});


app.factory('Laskentapuu', function($q, Laskentakaava, FunktioKuvausResource) {
    
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
            FunktioKuvausResource.get({}, function(res) {
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

