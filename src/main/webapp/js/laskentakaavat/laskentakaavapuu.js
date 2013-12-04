

/*
	Käytetään laskentakaavapuun piirtämisessä.
	Tallennetaan nykyinen funktio ja sen parentti jokaiseen skooppiin, 
	kun puu rakennetaan rekursiivisesti
*/ 
function treeNodeController($scope, FunktioTemplates) {
    
    $scope.funktio = $scope.$parent.farg;
    $scope.parent = $scope.$parent.funktio;

    $scope.template = "";

    $scope.getFunktioTemplate = function(funktio) {
    	if(funktio instanceof TyhjaFunktio) {
    		return "tyhja_template.html"
    	}

        if(funktio instanceof LaskentakaavaViite) {
            return "subformula_template.html";
        }

    	if(FunktioTemplates.nimettyarvo.indexOf(funktio.nimi) != -1) {
    		return "node_template.html";
    	} else if(FunktioTemplates.leaf.indexOf(funktio.nimi) != -1) {
    		return "leaf_template.html";
    	} else {
    		return "node_template.html";
    	}
    }

}


app.factory('FunktioTemplates', function() {

	var templates = new function() {
		this.nimettyarvo = ['NIMETTYLUKUARVO', 'NIMETTYTOTUUSARVO'];
		this.leaf = ["LUKUARVO", "TOTUUSARVO",  "HAKUTOIVE", "DEMOGRAFIA", "HAETOTUUSARVO", "HAELUKUARVO", "HAEMERKKIJONOJAKONVERTOILUKUARVOKSI",
        "HAEMERKKIJONOJAVERTAAYHTASUURUUS","HAEMERKKIJONOJAKONVERTOITOTUUSARVOKSI", "VALINTAPERUSTEYHTASUURUUS"]
	}

	return templates;

});

/*
app.factory('FunktioService', function(FunktioKuvaus) {
    var model = new function() {
        this.funktiokuvaukset = {};

        this.getFunktiokuvaukset = function() {
            return model.funktiokuvaukset;
        }

        this.getFunktiokuvaus = function(funktionimi) {
            if(model.funktiokuvaukset) {
                model.funktiokuvaukset.forEach(function(funktiokuvaus) {
                    if(funktiokuvaus.nimi === funktionimi) {
                        //return funktiokuvaus;
                    }
                });
            }
        }

        this.refresh = function() {
            if(!this.funktiokuvaukset) {
                FunktioKuvaus.get({}, function(result) {
                    this.funktiokuvaukset = result;
                });
            }
        }
    }

    return model;
});
*/