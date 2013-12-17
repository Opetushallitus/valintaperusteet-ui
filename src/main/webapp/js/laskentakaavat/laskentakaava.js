


function LaskentakaavaController($scope, _, $location, $routeParams, KaavaValidointi, LaskentakaavaLista, LaskentakaavaService, TemplateService, FunktioService) {

    //servicet laskentakaavapuun piirtämiseen
    $scope.templateService = TemplateService;
    $scope.funktioService = FunktioService;
    $scope.funktioService.refresh();

    //Laskentakaavapuu datan skooppiin
    $scope.laskentakaavaOid = $routeParams.laskentakaavaOid;
    $scope.model = LaskentakaavaService;
    $scope.model.refresh($scope.laskentakaavaOid);


    

    if($routeParams.valintaryhmaOid) {
        LaskentakaavaLista.refresh($routeParams.valintaryhmaOid, null, false);
    } else if($routeParams.hakukohdeOid) {
        LaskentakaavaLista.refresh(null, $routeParams.hakukohdeOid, false);
    } else {
        LaskentakaavaLista.refresh(null, null, false);
    }

    // Tieto laskentakaavan / funktion näyttämisestä ja piilottamisesta täytyy säilyttää tässä (parent) skoopissa
    // objektissa, jotta childskoopeissa tehdyt muutokset heijastuvat parenttiin ja muihin childskooppeihin 
    $scope.funktioasetusTemplatePicker = {
        showFunktioInformation: false,
        showLaskentakaavaInformation: false
    }

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

    $scope.removeFunktiokutsu = function(funktiokutsu){
        var funktiokutsuId = funktiokutsu.id;

        $scope.funktioSelection = undefined;
        $scope.funktioasetusTemplatePicker.showFunktioInformation = false
        
        searchTree($scope.model.laskentakaavapuu.funktiokutsu.funktioargumentit);

        //etsitään haluttu funktiokutsu laskentakaavasta ja poistetaan se
        function searchTree(funktioargumentit) {
            var searchedNode = undefined;

            //asetetaan haetaan searhedNode-muuttujaan objekti jota etsitään
            searchedNode = _.find(funktioargumentit, function(funktioargumentti) {
                if(funktioargumentti.lapsi.id === funktiokutsuId) {
                    return true;
                } else {
                    return false;
                }
            });
            
            //jatketaan etsimistä puun alemmilta tasoilta, jos haettua objektia ei löytynyt
            if(_.isEmpty(searchedNode)) {
                _.forEach(funktioargumentit, function(funktioargumentti) {
                    searchTree(funktioargumentti.lapsi.funktioargumentit);
                });
            //poistetaan löydetty objekti
            } else {
                var indexInFunktioargumentit = funktioargumentit.indexOf(searchedNode);
                funktioargumentit.splice(indexInFunktioargumentit, 1);
            }


        }
        

       
    }

    $scope.persistLaskentakaava = function() {

        $scope.funktioasetusTemplatePicker.showFunktioInformation = false;
        $scope.funktioasetusTemplatePicker.showLaskentakaavaInformation = false;
        $scope.funktioSelection = undefined;

        KaavaValidointi.post({}, $scope.model.laskentakaavapuu, function(result) {
            
            $scope.model.laskentakaavapuu.$save({oid: $scope.model.laskentakaavapuu.id}, function(result) {}, function(error) {
                $scope.errors.push(error);
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
