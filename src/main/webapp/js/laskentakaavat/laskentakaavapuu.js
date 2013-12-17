

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

function laskentakaavapuuController($scope) {
    
}


app.factory('FunktioTemplates', function() {

	var templates = new function() {
		this.nimettyarvo = ['NIMETTYLUKUARVO', 'NIMETTYTOTUUSARVO'];
		this.leaf = ["LUKUARVO", "TOTUUSARVO",  "HAKUTOIVE", "DEMOGRAFIA", "HAETOTUUSARVO", "HAELUKUARVO", "HAEMERKKIJONOJAKONVERTOILUKUARVOKSI",
        "HAEMERKKIJONOJAVERTAAYHTASUURUUS","HAEMERKKIJONOJAKONVERTOITOTUUSARVOKSI", "VALINTAPERUSTEYHTASUURUUS"]
	}

	return templates;

});

app.factory('TemplateService', function(FunktioService) {
    var templateservice = new function() {

        this.getSyoteparametriTemplate = function(funktio, syoteparametriIndex) {
            var funktioservice = FunktioService;

            var funktiokuvaus = funktioservice.getFunktiokuvaus(funktio.funktionimi);
            var syoteparametrityyppi = "";
            if(funktiokuvaus.syoteparametrit[0].avain === 'n') {
                syoteparametrityyppi = funktiokuvaus.syoteparametrit[0].tyyppi;
            } else {
                syoteparametrityyppi = funktiokuvaus.syoteparametrit[syoteparametriIndex].tyyppi;
            }

            switch(syoteparametrityyppi) {
                case "DESIMAALILUKU":
                    return "desimaaliluku-template";
                case "KOKONAISLUKU":
                    return "kokonaisluku-template";
                case "TOTUUSARVO":
                    return "totuusarvo-template";
                case "MERKKIJONO":
                    return "merkkijono-template";
                default:
                    return ""
            }
            
        }

    }

    return templateservice;
});


app.factory('FunktioService', function(FunktioKuvausResource) {
    var model = new function() {
        this.funktiokuvaukset = {};

        this.getFunktiokuvaukset = function() {
            return model.funktiokuvaukset;
        }

        this.getFunktiokuvaus = function(funktionimi) {
            var result;
            if(model.funktiokuvaukset) {
                model.funktiokuvaukset.forEach(function(funktiokuvaus) {
                    if(funktiokuvaus.nimi === funktionimi) {
                        result = funktiokuvaus;
                    }
                });
            }

            return result;
        }

        this.refresh = function() {
            
            FunktioKuvausResource.get({}, function(result) {
                model.funktiokuvaukset = result;
            });
            
        }
    }

    return model;
});
