

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

    	if(FunktioTemplates.kaavatyyppi.indexOf(funktio.nimi) != -1) {
    		return "node_template.html";
    	} else if(FunktioTemplates.lapseton.indexOf(funktio.nimi) != -1) {
    		return "leaf_template.html";
    	} else {
    		return "node_template.html";
    	}
    }

}

function konvertteriController($scope) {



    var TEMPLATE_MAP = {
        "ARVOKONVERTTERI": "arvokonvertteri-template",
        "ARVOVALIKONVERTTERI": "arvovalikonvertteri-template"
    }
}

app.factory('FunktioTemplates', function() {

	var templates = new function() {
		this.kaavatyyppi = ['NIMETTYLUKUARVO', 'NIMETTYTOTUUSARVO'];
		this.lapseton = ["LUKUARVO", "TOTUUSARVO",  "HAKUTOIVE", "DEMOGRAFIA", "HAETOTUUSARVO", "HAELUKUARVO", "HAEMERKKIJONOJAKONVERTOILUKUARVOKSI",
        "HAEMERKKIJONOJAVERTAAYHTASUURUUS","HAEMERKKIJONOJAKONVERTOITOTUUSARVOKSI", "VALINTAPERUSTEYHTASUURUUS"]
	}

	return templates;

});


app.factory('FunktiokuvausService', function(FunktioKuvaus) {
    var model = new function() {
        this.funktiokuvaukset = {}

        this.getFunktiokuvaukset = function() {
            return model.funktiokuvaukset;
        }

        this.getFunktiokuvaus = function() {

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