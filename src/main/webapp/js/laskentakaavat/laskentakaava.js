


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
    $scope.errors = [];

    if($routeParams.valintaryhmaOid) {
        LaskentakaavaLista.refresh($routeParams.valintaryhmaOid, null, false);
    } else if($routeParams.hakukohdeOid) {
        LaskentakaavaLista.refresh(null, $routeParams.hakukohdeOid, false);
    } else {
        LaskentakaavaLista.refresh(null, null, false);
    }

    // Tieto laskentakaavan / funktion näyttämisestä ja piilottamisesta täytyy säilyttää tässä (parent) skoopissa
    // objektissa, jotta eri childskoopeissa tehdyt muutokset heijastuvat takaisin parenttiin ja muihin childskooppeihin 
    $scope.funktioasetukset = {
        showFunktioInformation: false, //näytetäänkö funktiokutsuasetus-näkymä
        selectedFunktioIndex: undefined,
        showLaskentakaavaInformation: false, //näytetäänkö laskentakaavaviite-näkymä
        konvertteriType: '', //mikä konvertterityyppi on valittuna
        parentFunktiokutsu: undefined,
        showNewFunktioList: false
    }

    $scope.setFunktioasetusView = function(funktiokutsuVisible, laskentakaavaviiteVisible) {
        $scope.funktioasetukset.showFunktioInformation = funktiokutsuVisible;
        $scope.funktioasetukset.showLaskentakaavaInformation = laskentakaavaviiteVisible;
    }

    $scope.setRootSelection = function(funktiokutsu) {
        $scope.isRootSelected = true;
        $scope.funktioSelection = funktiokutsu;
    }


    /*
        funktio = valittu funktiokutsu tai laskentakaavaviite
        isFunktiokutsu = onko funktio-parametri funktiokutsu vai laskentakavaaviite
        parentFunktiokutsu = parentFunktiokutsu tai laskentakaavan juuri
        index = monesko funktio-parametri on funktioargumenttilistassa, juurifunktiokutsulla ei ole indeksiä
    */
    $scope.setFunktioSelection = function(funktio, isFunktiokutsu, parentFunktiokutsu, index) {
        $scope.funktioasetukset.parentFunktiokutsu = parentFunktiokutsu;
        $scope.funktioasetukset.selectedFunktioIndex = index;
        $scope.funktioSelection = funktio;
        $scope.funktiokuvausForSelection = $scope.funktioService.getFunktiokuvaus(funktio.funktionimi);

        //päätellään funktiolle esivalittu konvertteriparametrityyppi, jos funktiolla on konvertteriparametreja
        $scope.setKonvertteriType($scope.funktioSelection);

        // päätellään kumpi funktioasetusnäkymä tuodaan näkyviin, funktiokutsuille ja laskentakaavaviitteille on omat näkymänsä
        isFunktiokutsu ? $scope.setFunktioasetusView(true, false) : $scope.setFunktioasetusView(false, true);

        $scope.isRootSelected = false;
    }

    // Kaikissa tapauksissa funktiokutsuilla ja laskentakaavaviitteillä on parent, mutta juuresta seuraavalla tasolla ei ole parent.lapsi -muuttujaa, 
    // jolloin sama, tarvittava tieto saadaan suoraan parent-muuttujasta
    $scope.getParent = function(parent) {
        return parent.lapsi || parent;
    }

    $scope.setKonvertteriType = function(funktio) {
        if($scope.funktioSelection.lapsi.arvokonvertteriparametrit && $scope.funktioSelection.lapsi.arvovalikonvertteriparametrit.length == 0) {
            $scope.funktioasetukset.konvertteriType = 'ARVOKONVERTTERI';
        } else if ($scope.funktioSelection.lapsi.arvovalikonvertteriparametrit && $scope.funktioSelection.lapsi.arvokonvertteriparametrit.length == 0) {
            $scope.funktioasetukset.konvertteriType = 'ARVOVALIKONVERTTERI';
        }
    }

    $scope.addFunktiokonvertteriparametri = function(konvertteriparametriSelection) {

        var emptyArvokonvertteriparametri = {paluuarvo: '', hylkaysperuste: false, arvo: ''}
        var emptyArvovalikonvertteriparametri = {paluuarvo: '', palautaHaettuArvo: false, minValue: '',maxValue: ''}

        if($scope.funktioasetukset.konvertteriType == "ARVOKONVERTTERI") {
            $scope.funktioSelection.lapsi.arvokonvertteriparametrit.push(emptyArvokonvertteriparametri);
        } else {
            $scope.funktioSelection.lapsi.arvovalikonvertteriparametrit.push(emptyArvovalikonvertteriparametri);
        }
    }

    $scope.syoteparametriTemplate = function(funktiokutsu, index) {
        return $scope.templateService.getSyoteparametriTemplate(funktiokutsu, index);
    }

    $scope.konvertteriTemplate = function(konvertteriparametriSelection) {
        return $scope.templateService.getKonvertteriparametriTemplate(konvertteriparametriSelection);
    }

    $scope.removeKonvertteriParametri = function(index, konvertteriparametriSelection) {
        if(konvertteriparametriSelection == "ARVOKONVERTTERI") {
            $scope.funktioSelection.lapsi.arvokonvertteriparametrit.splice(index, 1);
        } else {
            $scope.funktioSelection.lapsi.arvovalikonvertteriparametrit.splice(index, 1);
        }

    }

    $scope.changeKonvertteriparametriTypeSelection = function(konvertteriparametriSelection) {
        
        //tyhjennetään toinen konvertteriparametrilista tyyppiä vaihdettaessa
        if(konvertteriparametriSelection == "ARVOKONVERTTERI") {
            $scope.funktioSelection.lapsi.arvovalikonvertteriparametrit.length = 0;
        } else {
            $scope.funktioSelection.lapsi.arvokonvertteriparametrit.length = 0;
        }

    }

    // TODO huomioi laskentakaavaviitteet
    $scope.removeFunktiokutsu = function(){


        var isNimettyFunktio = $scope.isNimettyFunktioargumentti($scope.funktioSelection);
        $scope.funktioSelection = undefined;

        // jos funktio on nimetty, niin asetetaan se vain undefined:ksi
        if(isNimettyFunktio) {  
            $scope.funktioasetukset.parentFunktiokutsu.funktioargumentit[$scope.funktioasetukset.selectedFunktioIndex] = undefined;
        } else {
            //muussa tapauksessa poistetaan koko elementti taulukosta
            if($scope.isFirstChildForRoot($scope.funktioasetukset.parentFunktiokutsu)) {
                //jos ei olla heti laskentakaavan juuren alla  
                $scope.funktioasetukset.parentFunktiokutsu.lapsi.funktioargumentit.splice($scope.funktioasetukset.selectedFunktioIndex, 1);
            } else {
                //jos ollaan heti laskentakaavan juuren alla (laskentakaavan 'ensimmäisellä kerroksella' ei ole lapsi-wrapperia)
                $scope.funktioasetukset.parentFunktiokutsu.funktioargumentit.splice($scope.funktioasetukset.selectedFunktioIndex, 1);
            }
        }

        $scope.funktioasetukset.parentFunktiokutsu = undefined;
        $scope.setFunktioasetusView(false, false);
    }

    $scope.removeLaskentakaavaviite = function() {
        //jos ei olla heti laskentakaavan juuren alla  
        if($scope.isFirstChildForRoot($scope.funktioasetukset.parentFunktiokutsu)) {
            $scope.funktioasetukset.parentFunktiokutsu.lapsi.funktioargumentit.splice($scope.funktioasetukset.selectedFunktioIndex,1)}
        //jos ollaan heti laskentakaavan juuren alla (laskentakaavan 'ensimmäisellä kerroksella' ei ole lapsi-wrapperia)
        else {$scope.funktioasetukset.parentFunktiokutsu.funktioargumentit.splice($scope.funktioasetukset.selectedFunktioIndex,1)}
        $scope.funktioSelection = undefined; 
        $scope.funktioasetukset.showLaskentakaavaInformation = false;
    }

    $scope.isFirstChildForRoot = function(parent) {
        return parent.lapsi ? true : false;
    }

    $scope.isFunktiokutsu = function(funktiokutsu) {
        return funktiokutsu.lapsi.tyyppi === 'LUKUARVOFUNKTIO' || funktiokutsu.lapsi.tyyppi === 'TOTUUSARVOFUNKTIO';
    }

    //onko käsiteltävä funktiokutsun lapset nimettyjä funktioargumentteja
    $scope.isNimettyFunktioargumentti = function(funktiokutsu) {
        return $scope.funktioService.isNimettyFunktioargumentti(funktiokutsu.lapsi.funktionimi);
    }

    //Onko käsiteltävä parentin funktioargumentin paikka tarkoitettu nimettömälle funktiokutsulle/laskentakaavalle ja onko funktioargumentti vielä asettamatta 
    $scope.isEmptyNimettyFunktioargumentti = function(parent, funktioargumenttiIndex) {
        return $scope.funktioService.isEmptyNimettyFunktioargumentti(parent, funktioargumenttiIndex);
    }

    $scope.isLukuarvoFunktioSlot = function(parent, funktioargumenttiIndex) {
        var isNimetty = $scope.isNimettyFunktioargumentti(parent);
        var funktiokuvaus = $scope.funktioService.getFunktiokuvaus(parent.lapsi.funktionimi);
        var tyyppi = isNimetty ? funktiokuvaus.funktioargumentit[funktioargumenttiIndex].tyyppi : funktiokuvaus.funktioargumentit[0].tyyppi;
        var result = tyyppi == 'LUKUARVOFUNKTIO' ? true : false;
        return result;
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


    // index on indeksi nyt käsiteltävälle funktioargumentille (nimetyille funktioargumenteille)
    $scope.findFunktioSlotIndex = function(parent, index) {
        var isNimetty = $scope.isNimettyFunktioargumentti(parent);
        result = isNimetty ? index : parent.lapsi.funktioargumentit.length;
        return result;
    }

    $scope.addFunktio = function(parent, funktionimi, index) {
        var createdFunktio = $scope.funktioFactory.createFunktioInstance(parent, funktionimi, index);
        $scope.setFunktioSelection(createdFunktio, true, parent, index);
    }
    
    $scope.addChildLaskentakaava = function(parentFunktio, argumenttiNimi) {
        var newKaava = parentFunktio.addNewLaskentakaavaReference(argumenttiNimi, $routeParams.valintaryhmaOid);
        $scope.showKaavaDetails(newKaava);
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
        console.log(kaava);
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

