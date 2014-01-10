


function LaskentakaavaController($scope, _, $location, $routeParams, KaavaValidointi, LaskentakaavaLista, LaskentakaavaService, TemplateService, FunktioService, Valintaperusteviitetyypit, FunktioNimiService, FunktioFactory) {

    //servicet laskentakaavapuun piirtämiseen
    $scope.templateService = TemplateService;
    $scope.funktioService = FunktioService;
    $scope.funktioService.refresh();
    $scope.funktionimiService = FunktioNimiService;
    $scope.funktioFactory = FunktioFactory;

    //Laskentakaavapuu datan skooppiin
    $scope.laskentakaavaOid = $routeParams.laskentakaavaOid;
    $scope.model = LaskentakaavaService;
    $scope.model.refresh($scope.laskentakaavaOid);

    $scope.valintaperusteviitetyypit = Valintaperusteviitetyypit;
    

    if($routeParams.valintaryhmaOid) {
        LaskentakaavaLista.refresh($routeParams.valintaryhmaOid, null, false);
    } else if($routeParams.hakukohdeOid) {
        LaskentakaavaLista.refresh(null, $routeParams.hakukohdeOid, false);
    } else {
        LaskentakaavaLista.refresh(null, null, false);
    }

    // Tieto laskentakaavan / funktion näyttämisestä ja piilottamisesta täytyy säilyttää tässä (parent) skoopissa
    // objektissa, jotta childskoopeissa tehdyt muutokset heijastuvat parenttiin ja muihin childskooppeihin 
    $scope.funktioasetukset = {
        showFunktioInformation: false, //näytetäänkö funktiokutsuasetus-näkymä
        showLaskentakaavaInformation: false, //näytetäänkö laskentakaavaviite-näkymä
        konvertteriType: '', //mikä konvertterityyppi on valittuna
        parentFunktiokutsu: undefined
    }

    $scope.setFunktioasetusView = function(funktiokutsuVisible, laskentakaavaviiteVisible) {
        $scope.funktioasetukset.showFunktioInformation = funktiokutsuVisible;
        $scope.funktioasetukset.showLaskentakaavaInformation = laskentakaavaviiteVisible;
    }

    $scope.kaavaInformationView = function(funktio, isFunktiokutsu, parentFunktiokutsu) {
        $scope.funktioasetukset.parentFunktiokutsu = parentFunktiokutsu;
        $scope.funktioSelection = funktio;
        $scope.funktiokuvausForSelection = $scope.funktioService.getFunktiokuvaus(funktio.funktionimi);

        //päätellään funktiolle esivalittu konvertteriparametrityyppi, jos funktiolla on konvertteriparametreja
        if($scope.funktioSelection.arvokonvertteriparametrit && $scope.funktioSelection.arvovalikonvertteriparametrit.length == 0) {
            $scope.funktioasetukset.konvertteriType = 'ARVOKONVERTTERI';
        } else if ($scope.funktioSelection.arvovalikonvertteriparametrit && $scope.funktioSelection.arvokonvertteriparametrit.length == 0) {
            $scope.funktioasetukset.konvertteriType = 'ARVOVALIKONVERTTERI';
        }   

        // päätellään kumpi funktioasetusnäkymä tuodaan näkyviin, funktiokutsuille ja laskentakaavaviitteille on omat näkymänsä
        if(isFunktiokutsu) {    
            $scope.setFunktioasetusView(true, false);
        } else {
            $scope.setFunktioasetusView(false, true);
        }
        
    }

    $scope.addFunktiokonvertteriparametri = function(konvertteriparametriSelection) {

        var emptyArvokonvertteriparametri = {paluuarvo: '', hylkaysperuste: false, arvo: ''}
        var emptyArvovalikonvertteriparametri = {paluuarvo: '', palautaHaettuArvo: false, minValue: '',maxValue: ''}

        if($scope.funktioasetukset.konvertteriType == "ARVOKONVERTTERI") {
            $scope.funktioSelection.arvokonvertteriparametrit.push(emptyArvokonvertteriparametri);
        } else {
            $scope.funktioSelection.arvovalikonvertteriparametrit.push(emptyArvovalikonvertteriparametri);
        }
    }

    $scope.syoteparametriTemplate = function(syoteparametri, index) {
        return $scope.templateService.getSyoteparametriTemplate(syoteparametri, index);
    }

    $scope.konvertteriTemplate = function(konvertteriparametriSelection) {
        return $scope.templateService.getKonvertteriparametriTemplate(konvertteriparametriSelection);
    }

    $scope.removeKonvertteriParametri = function(index, konvertteriparametriSelection) {
        if(konvertteriparametriSelection == "ARVOKONVERTTERI") {
            $scope.funktioSelection.arvokonvertteriparametrit.splice(index, 1);
        } else {
            $scope.funktioSelection.arvovalikonvertteriparametrit.splice(index, 1);
        }

    }

    $scope.changeKonvertteriparametriTypeSelection = function(konvertteriparametriSelection) {
        
        //tyhjennetään toinen konvertteriparametrilista tyyppiä vaihdettaessa
        if(konvertteriparametriSelection == "ARVOKONVERTTERI") {
            $scope.funktioSelection.arvovalikonvertteriparametrit.length = 0;
        } else {
            $scope.funktioSelection.arvokonvertteriparametrit.length = 0;
        }

    }

    $scope.removeFunktiokutsu = function(funktiokutsu){

        var funktiokutsuId = funktiokutsu.id;
        var funktiokutsuParent = undefined;
        $scope.funktioSelection = undefined;
        $scope.funktiokuvausForSelection = undefined;
        $scope.setFunktioasetusView(false, false);

        var isNimettyFunktio = $scope.isNimettyFunktioargumentti($scope.funktioasetukset.parentFunktiokutsu);
        
        searchAndRemove($scope.model.laskentakaavapuu.funktiokutsu.funktioargumentit);
        $scope.funktioasetukset.parentFunktiokutsu = undefined;

        //etsitään haluttu funktiokutsu laskentakaavasta ja poistetaan se
        function searchAndRemove(funktioargumentit) { // TODO huomioi nimetyt funktioargumentit & laskentakaavaviitteet
            var searchedNode = undefined;

            //haetaan searhedNode-muuttujaan objekti jota etsitään, jos sellainen löytyy
            searchedNode = findMatchingFunktioargumentti(funktioargumentit);
            
            //jatketaan etsimistä puun alemmilta tasoilta, jos haettua objektia ei löytynyt
            if(_.isEmpty(searchedNode)) {
                _.forEach(funktioargumentit, function(funktioargumentti) {
                    searchAndRemove(funktioargumentti.lapsi.funktioargumentit);
                });
            //poistetaan löydetty objekti
            } else {
                var indexInFunktioargumentit = funktioargumentit.indexOf(searchedNode);

                // jos funktio on nimetty, niin asetetaan se vain undefined:ksi
                if(isNimettyFunktio) {  
                    funktioargumentit[indexInFunktioargumentit] = undefined;
                } else {
                    //muussa tapauksessa poistetaan koko elementti taulukosta
                    funktioargumentit.splice(indexInFunktioargumentit, 1);
                }
                
            }
        }

        function findMatchingFunktioargumentti(funktioargumentit) {
            var result = _.find(funktioargumentit, function(funktioargumentti) {
                if(funktioargumentti != undefined && (funktioargumentti.lapsi.id === funktiokutsuId || funktioargumentti.id === funktiokutsuId) ) {
                    return true;
                } else {
                    return false;
                }
            });
            return result;
        }

    }

    //onko käsiteltävä funktioargumentti nimetty
    $scope.isNimettyFunktioargumentti = function(parent) {
        return $scope.funktioService.isNimettyFunktioargumentti(parent.funktionimi);
    }

    //Onko käsiteltävä parentin funktioargumentin paikka tarkoitettu nimettömälle funktiokutsulle/laskentakaavalle ja onko funktioargumentti vielä asettamatta 
    $scope.isEmptyNimettyFunktioargumentti = function(parent, funktioargumenttiIndex) {
        return $scope.funktioService.isEmptyNimettyFunktioargumentti(parent, funktioargumenttiIndex);
    }

    $scope.isLukuarvoFunktioSlot = function(parent, funktioargumenttiIndex) {
        return $scope.funktioService.isLukuarvoFunktioSlot(parent, funktioargumenttiIndex);
    }

    $scope.persistLaskentakaava = function() {

        $scope.setFunktioasetusView(false, false);
        $scope.funktioSelection = undefined;
        $scope.funktiokuvausForSelection = undefined;

        KaavaValidointi.post({}, $scope.model.laskentakaavapuu, function(result) {
            
            $scope.model.laskentakaavapuu.$save({oid: $scope.model.laskentakaavapuu.id}, function(result) {}, function(error) {
                $scope.errors.push(error);
            });

        }); 
    }

    $scope.addFunktio = function(parent, funktionimi, index) {
        $scope.funktioFactory.createFunktioInstance(parent, funktionimi, index);
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

