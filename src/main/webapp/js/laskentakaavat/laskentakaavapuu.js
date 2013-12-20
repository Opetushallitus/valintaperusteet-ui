

/*
	Käytetään laskentakaavapuun piirtämisessä.
	Tallennetaan nykyinen funktio ja sen parentti jokaiseen skooppiin, 
	kun puu rakennetaan rekursiivisesti
*/ 
function treeNodeController($scope) {
    
    $scope.funktio = $scope.$parent.farg;
    $scope.parent = $scope.$parent.funktio;
    $scope.template = "";

}


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

        this.getKonvertteriparametriTemplate = function(konvertteriparametriSelection) {
            switch(konvertteriparametriSelection) {
                case "ARVOKONVERTTERI":
                    return "arvokonvertteri-template";
                case "ARVOVALIKONVERTTERI":
                    return "arvovalikonvertteri-template";
                default: 
                    return "";
            }
        }

    }

    return templateservice;
});


app.factory('Valintaperusteviitetyypit', function() {
    return [
        { key: 'HAETTAVA_ARVO', text: 'Arvo hakemukselta' },
        { key: 'SYOTETTAVA_ARVO', text: 'Syötettävä arvo' },
        { key: 'HAKUKOHTEEN_ARVO', text: 'Hakukohteen arvo' }
    ];
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
