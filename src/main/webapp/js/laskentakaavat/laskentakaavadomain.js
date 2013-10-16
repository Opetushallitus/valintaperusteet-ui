
var Kaava = function(funktiokuvaus, data) {
    this.funktiokuvaus = funktiokuvaus
    this.data = data
    this.funktio = new Funktio(this.funktiokuvaus, this.data.funktiokutsu)
    this.funktio.init()

    /* Structure methods i.e. parses subitems */
    this.funktiopuu = function() {
        return this.funktio
    }

    this.luonnos = function() {
        return this.data.onLuonnos
    }

    /* UI Methods */
    this.getAllErrors = function() {
        return this.funktio.getAllErrors()
    }

    this.hasErrors = function() {
        return this.getAllErrors().length > 0
    }

    this.getData = function() {

        //iterate object recursively and remove all key-value pairs where key is attr
        var removeByAttr = function(arr, attr){
            for(var i in arr) {
                if(arr[i] && arr[i][attr]){
                    delete arr[i][attr]
                } else if(typeof arr[i] === 'object' || typeof arr[i] === 'array') {
                    removeByAttr(arr[i], attr)
                }
            }
            return arr;
        }
        var removeMarkedFunktioargumentit = function(o) {
            for(var i in o) {
                if(o[i] && o[i].funktiokutsuChild && o[i].funktiokutsuChild.deleted) {
                    o.splice(i, 1)
                } else if(o[i] && o[i].laskentakaavaChild && o[i].laskentakaavaChild.deleted) {
                    o.splice(i, 1);
                } else if(typeof o[i] === 'object' || typeof o[i] === 'array') {
                    removeMarkedFunktioargumentit(o[i])
                }
            }
            return o
        }
        return removeMarkedFunktioargumentit(removeByAttr(this.data, 'validointivirheet'));
    }

}

var TyhjaFunktio = function(def) {
    this.template = "tyhja_template.html";

    this.nimi = function() {
        return def.nimi
    }

    this.otsikko = function() {
        return def.otsikko || def.nimi
    }

    this.errors = function() {
        return []
    }

    this.isLukuarvoFunktio = function() {
        return def.tyyppi == "LUKUARVOFUNKTIO"
    }

    this.isTotuusarvoFunktio = function() {
        return def.tyyppi == "TOTUUSARVOFUNKTIO"
    }
}

var LaskentakaavaViite = function(funktiokuvaus, data) {
    this.funktiokuvaus = funktiokuvaus;
    this.data = data;

    this.init = function() {
        this.nimi = this.data.nimi || "Uusi laskentakaavaviite";
        this.hashKey = Math.random().toString(36).substring(7);
    }

    this.template = "subformula_template.html";

    this.funktioCssClass = function(defaultClass, selected) {
        var cssClass = defaultClass
        if(selected != null && this.hashKey == selected.hashKey) {
            cssClass += " active"
        }
        if(this.data.deleted) {
            cssClass += " line-through"
        }
        return cssClass
    }

    this.init();
}

var Funktio = function(funktiokuvaus, data) {

    var HAETTAVA_TYYPPI = ["HAELUKUARVO", "HAETOTUUSARVO"];
    var NIMETTAVAT_TYYPPI = ["NIMETTYLUKUARVO", "NIMETTYTOTUUSARVO"];

    this.funktiokuvaus = funktiokuvaus;
    this.data = data;
    this.funktionimiService = FunktioNimiService();


    /* Structure methods i.e. parses subitems */
    this.getId = function() {
        return this.data.id
    }

    this.getNimi = function() {
        return this.data.funktionimi
    }
    this.tyyppi = function() {
        return this.findFunctionDefinitionByFunktionimi(this.nimi)
    }

    /**
     * Palauttaa true, jos funktiolla on nimettyjä funktioargumentteja. Esim. osamäärä.
     * @return {boolean}
     */
    this.hasNimetytArgumentit = function() {
        // Tarkista, onko n kardinaliteetti
        var fdef = this.findFunctionDefinitionByFunktionimi(this.nimi);
        if(!fdef.funktioargumentit) {
            return false
        }
        if(fdef.funktioargumentit.length == 1
            && fdef.funktioargumentit[0].kardinaliteetti == "n") {
            return false
        } else {
            return true
        }
    }

    /**
     * Luo funktioargumenttioliot.
     * @return {Array}
     */
    this.getFunktioargumentit = function() {
        if(this.hasNimetytArgumentit()) {
            return this.getFArgsNimetty()
        } else {
            return this.getFunktioargumentitN();
        }
    }

    /**
     * Luo funktioargumenttioliot, jos nimettyjä alifunktioita.
     * @return {Array}
     */
    this.getFArgsNimetty = function () {
        var funcArgs = []
        var fdef = this.findFunctionDefinitionByFunktionimi(this.nimi);
        var argCount = fdef.funktioargumentit.length
        for(var i = 0; i < argCount; i++) {
            var arg = this.data.funktioargumentit.filter(function(arg) {
                // Kallen indeksit alkaa ykkösestä.
                return arg.indeksi == i + 1
            })
            if(arg.length == 0) {
                funcArgs[i] = new TyhjaFunktio(fdef.funktioargumentit[i]);
            } else if (arg.length == 1) {
                funcArgs[i] = this.createSubFunction(arg[0]);
            } else {
                throw new Exception("Found too many objects from indeksi " + (i + 1))
            }
        }
        return funcArgs
    }

    /**
     * Luo funktioargumenttioliot, jos ei ole nimettyjä funktioargumentteja.
     * @return {Array}
     */
    this.getFunktioargumentitN = function() {
        var fdef = this.findFunctionDefinitionByFunktionimi(this.nimi);
        if(!fdef || !fdef.funktioargumentit || fdef.funktioargumentit.length < 1) {
            return
        }
        var funcargs = []
        for(i in this.data.funktioargumentit) {
            var data = this.data.funktioargumentit[i];
            funcargs.push(this.createSubFunction(data));
        }
        funcargs.push(new TyhjaFunktio({
                otsikko: 'Lisää uusi funktio',
                nimi: null,
                tyyppi: fdef.funktioargumentit[0].tyyppi
            })
        )
        return funcargs
    }

    /**
     * Luo alikutsun objektin. Se on datasta riipppuen joko funktiokutsu tai toinen laskentakaava.
     * @param data
     * @return {Funktio|LaskentakaavaViite}
     */
    this.createSubFunction = function(data) {
        if(data.funktiokutsuChild) {
            var f = new Funktio(this.funktiokuvaus, data.funktiokutsuChild)
            f.init()
            return f;
        } else if(data.laskentakaavaChild) {
            var alikaava = new LaskentakaavaViite(this.funktiokuvaus, data.laskentakaavaChild);
            return alikaava;
        } else {
            console.log("Kutsuttiin alikaavaobjektin luontia virheellisellä datalla", data);
        }
    }

    /**
     * Luo Parametri-oliot kaikille syötettäville parametreille.
     * @return {Array}
     */
    this.getSyoteparametrit = function() {
        var funcdef = this.findFunctionDefinitionByFunktionimi(this.nimi);
        var params = [];
        for(var i in funcdef.syoteparametrit) {
            var paramDef = funcdef.syoteparametrit[i];
            var paramData = $.grep(this.data.syoteparametrit, function(param) {
                return param.avain == paramDef.avain
            })[0];
            if(!paramData) {
                this.data.syoteparametrit.push({
                    arvo: undefined,
                    avain: paramDef.avain
                });
                paramData = this.data.syoteparametrit[this.data.syoteparametrit.length - 1];
            }
            params.push(new Parametri(paramDef, paramData));
        }
        return params
    }

    this.isSyoteparametritVisible = function() {
        for(var i in this.syoteparametrit) {
            var param = this.syoteparametrit[i];
            if(param.isVisible()) {
                return true;
            }
        }
        return false
    }

    /* Helper methods */

    /**
     * Hakee funktion määrittelyt funktiokuvaus:stä nimen perusteella.
     * @param {String} nimi
     * @return {object}
     */
    this.findFunctionDefinitionByFunktionimi = function(nimi) {
        return this.findFunctionDefinition(function(fdef) {
            return nimi == fdef.nimi;
        })
    }

    /**
     * Filtteröi funktio funktiokuvaus:stä funktiokuvauksia annetun funktion perusteella.
     * @param func
     * @return {object}
     */
    this.findFunctionDefinition = function(func) {
        var def = this.funktiokuvaus.filter(func)
        if(def) {
            return def[0]
        }
        return null
    }

    this.init = function() {
        if(!this.data.funktioargumentit) {
            this.data.funktioargumentit = [];
        }

        if(!this.data.syoteparametrit) {
            this.data.syoteparametrit = [];
        }

        this.nimi = this.getNimi();
        this.template = this.getTemplate();
        this.funktioargumentit = this.getFunktioargumentit();

        // Used for comparison.
        this.hashKey = Math.random().toString(36).substring(7);
        this.syoteparametrit = this.getSyoteparametrit();
        this.konvertteri = this.getKonvertteri();
        this.naytettavaNimi = this.funktionimiService.nimi(this.data);
    }

    /* UI methods */
    this.getTemplate = function() {
        var labelFunctions = ["NIMETTYLUKUARVO", "NIMETTYTOTUUSARVO"]
        var paramFunctions = ["HAELUKUARVO", "LUKUARVO", "TOTUUSARVO", "HAETOTUUSARVO", "HAKUTOIVE", "DEMOGRAFIA", "HAEMERKKIJONOJAKONVERTOITOTUUSARVOKSI"]
        if(paramFunctions.indexOf(this.nimi) != -1) {
            return "parametri_template.html"
        } else if(labelFunctions.indexOf(this.nimi) != -1) {
            return "frame_template.html"
        } else {
            return "funktio_template.html"
        }
    }

    this.hasErrors = function() {
        return this.errors().length > 0
    }

    this.errors = function() {
        return this.data.validointivirheet || []
    }

    this.funktioCssClass = function(defaultClass, selected) {
        var cssClass = defaultClass
        if(selected != null && this.hashKey == selected.hashKey) {
            cssClass += " active"
        }
        if(this.data.deleted) {
            cssClass += " line-through"
        }
        if(!this.hasNimetytArgumentit()) {
            cssClass += " n-arguments"
        }
        return cssClass
    }

    this.iconCssClass = function() {
        if("SUMMA" == this.nimi) {
            return "icon sum"
        }
        return "icon"
    }

    this.isNimettava = function() {
        return NIMETTAVAT_TYYPPI.indexOf(this.nimi) != -1
    }

    this.getNimiParametri = function() {
        for(var i in this.syoteparametrit) {
            var param = this.syoteparametrit[i]
            if(param.avain == 'nimi') {
                return param;
            }
        }
    }

    this.getKonvertteri = function() {
        var fdef = this.findFunctionDefinitionByFunktionimi(this.nimi);
        if(!fdef.konvertteri) {
            return;
        }
        return new Konvertteri(fdef.konvertteri, this.data);
    }

    /**
     * Luo uuden funktiokutsun tämän objektin alle.
     * @param funktionimi
     * @param argumenttiNimi
     * @return {*}
     */
    this.addNewFunktiokutsu = function(funktionimi, argumenttiNimi) {
        var f = this.findFunctionDefinitionByFunktionimi(funktionimi);
        var newFunction = {
            funktiokutsuChild: {
                funktionimi: f.nimi,
                syoteparametrit: [],
                funktioargumentit: []
            }
        };
        for(var i in f.syoteparametrit) {
            var param = f.syoteparametrit[i];
            var newParam = {
                avain: param.avain,
                arvo: ""
            };
            newFunction.funktiokutsuChild.syoteparametrit.push(newParam);
        }

        // Arvotaan indeksi, johon data laitetaan
        // Case: Nimetty argumentti (jakolasku, suurempitaiyhtasuuri)
        if(argumenttiNimi) {
            var index = this.determineIndexForSubfunction(argumenttiNimi);
            newFunction.indeksi = index + 1;
            this.data.funktioargumentit[index] = newFunction;
            // Case: N argumenttia, lisätään listan loppuun.
        } else {
            newFunction.indeksi = this.data.funktioargumentit.length + 1;
            this.data.funktioargumentit.push(newFunction);
        }

        this.funktioargumentit = this.getFunktioargumentit();
        return this.findFunktioArgumentti(newFunction.funktiokutsuChild);
    }

    /**
     * Hakee indeksin funktiokutsulle argumenttinimen perusteella. Käytettävissä ainoastaan,
     * kun funktiossa on nimetyt argumentit.
     * @param argumenttiNimi
     * @return {int}
     */
    this.determineIndexForSubfunction = function(argumenttiNimi) {
        var curFuncDef = this.findFunctionDefinitionByFunktionimi(this.nimi);
        var argumentti = curFuncDef.funktioargumentit.filter(function(arg) {
            return arg.nimi == argumenttiNimi;
        })[0]
        return curFuncDef.funktioargumentit.indexOf(argumentti);
    }

    this.addNewLaskentakaavaReference = function(argumenttiNimi, valintaryhmaOid) {
        var newReference = {
            laskentakaavaChild: {

            }
        };

        if(valintaryhmaOid) {
            newReference.valintaryhmaOid = valintaryhmaOid;
        }

        // Arvotaan indeksi, johon data laitetaan
        // Case: Nimetty argumentti (jakolasku, suurempitaiyhtasuuri)
        if(argumenttiNimi) {
            var index = this.determineIndexForSubfunction(argumenttiNimi);
            newReference.indeksi = index + 1;
            this.data.funktioargumentit[index] = newReference;
            // Case: N argumenttia, lisätään listan loppuun.
        } else {
            newReference.indeksi = this.data.funktioargumentit.length + 1;
            this.data.funktioargumentit.push(newReference);
        }

        this.funktioargumentit = this.getFunktioargumentit();
        return this.findFunktioArgumentti(newReference.laskentakaavaChild);
    }

    this.addChildAt = function(funktio, index) {
        var data = {};
        if(funktio instanceof Funktio) {
            data.funktiokutsuChild = funktio.data;
        }

        if(funktio instanceof LaskentakaavaViite) {
            data.laskentakaavaChild = funktio.data;
        }

        // Jos ei nimettyjä argumentteja, lisätään haluttuun indeksiin ja tuupataan muita yksi eteenpäin.
        if(!this.hasNimetytArgumentit()) {
            if(this.funktioargumentit.indexOf(funktio) !== -1) {
                return;
            }
            data.indeksi = index + 1;
            this.data.funktioargumentit.splice(index, 0, data);
            this.funktioargumentit = this.getFunktioargumentit();
            return;
        }

        // Uudelleenjärjestäminen
        var oldIndex = this.funktioargumentit.indexOf(funktio)
        if(oldIndex !== -1) {
            this.funktioargumentit.splice(oldIndex, 1)
            if(this.funktioargumentit[index] instanceof TyhjaFunktio) {
                this.funktioargumentit[index] = funktio
            } else {
                this.funktioargumentit.splice(index, 0, funktio)
            }

            var fargs = []
            for(var i in this.funktioargumentit) {
                var f = this.funktioargumentit[i]
                if(f instanceof TyhjaFunktio) {
                    continue
                }
                data = {
                    funktiokutsuChild: f.data,
                    indeksi: parseInt(i) + 1
                }
                fargs.push(data)
            }
            this.data.funktioargumentit = fargs;
            this.funktioargumentit = this.getFunktioargumentit()
            return
        }

        // Etsitään edeltävä tyhjä funktio
        var fs = this.funktioargumentit.slice(0, index)
        var lastOf = -1
        for(var i = fs.length - 1; i >= 0; i--) {
            var f = fs[i]
            if(f instanceof TyhjaFunktio) {
                lastOf = i
                break
            }
        }

        // Korvataan tyhjä funktio, jos löytyi
        if(lastOf > -1) {
            data.indeksi = lastOf + 1
            this.data.funktioargumentit.splice(lastOf, 0, data)
        } else {
            // Tungetaan viimeisenä vaihtoehtona loppuun ja toivotaan toivotaan
            data.indeksi = this.data.funktioargumentit.length + 1
            this.data.funktioargumentit.push(data)
        }

        this.funktioargumentit = this.getFunktioargumentit()
    }

    this.removeChildFunktio = function(funktio) {
        var index = -1;
        var data = null;
        for (var i in this.data.funktioargumentit) {
            var farg = this.data.funktioargumentit[i];
            if(farg.funktiokutsuChild === funktio.data) {
                index = i;
                data = angular.copy(this.data.funktioargumentit[index].funktiokutsuChild);
                this.data.funktioargumentit.splice(index, 1);
                this.funktioargumentit = this.getFunktioargumentit();
                var func = new Funktio(angular.copy(this.funktiokuvaus), data.funktiokutsu);
                func.init();
                return func;
            }
            if(farg.laskentakaavaChild === funktio.data) {
                index = i;
                data = angular.copy(this.data.funktioargumentit[index].laskentakaavaChild);
                this.data.funktioargumentit.splice(index, 1);
                this.funktioargumentit = this.getFunktioargumentit();
                var func = new LaskentakaavaViite(angular.copy(this.funktiokuvaus), data);
                func.init();
                return func;
            }
        }
        if(index == -1) {
            return;
        }
    }

    this.isHaettavaArvoTyyppi = function() {
        return HAETTAVA_TYYPPI.indexOf(this.nimi) !== -1
    }

    this.findFunktioArgumentti = function(data) {
        var args = this.funktioargumentit.filter(function(cur) {
            return angular.equals(cur.data, data)
        })
        return (args.length > 0 ? args[0] : undefined)
    }

    this.getAllErrors = function() {
        var errors = this.errors() || []
        for(var i in this.funktioargumentit) {
            var leafObj = this.funktioargumentit[i]
            if(leafObj instanceof Funktio) {
                var leafErrors = leafObj.getAllErrors()
                errors = errors.concat(leafErrors)
            }
        }
        return errors
    }
}

var Konvertteri = function(konvDef, data) {
    this.konvDef = konvDef
    // this.data.arvovalikonvertteriparametrit || this.data.arvokonvertteriparametrit
    this.data = data
    this.oldData = []

    var TEMPLATE_MAP = {
        "ARVOKONVERTTERI": "arvokonvertteri-template",
        "ARVOVALIKONVERTTERI": "arvovalikonvertteri-template"
    }

    this.init = function() {
        this.tyyppi = this.getTyyppi()
        this.sallitut = this.getSallitut()
        this.parametrit = this.getParametrit()
        this.uusityyppi = this.tyyppi
        this.template = this.getTemplate()
    }

    this.getSallitut = function() {
            var sallitut = []
        for(var i in this.konvDef.konvertteriTyypit) {
            var konvTyyppi = this.konvDef.konvertteriTyypit[i]
            sallitut.push(konvTyyppi.tyyppi)
        }
        return sallitut
    }

    this.isSallittu = function(tyyppi) {
        return this.sallitut.indexOf(tyyppi) !== 1
    }

    this.getTyyppi = function() {
        if(this.konvDef.konvertteriTyypit.length == 1) {
            return this.konvDef.konvertteriTyypit[0]
        }

        if(!this.data.arvokonvertteriparametrit && !this.data.arvovalikonvertteriparametrit) {
            return null;
        }

        if(this.data.arvokonvertteriparametrit.length > 0) {
            return "ARVOKONVERTTERI";
        } else if(this.data.arvovalikonvertteriparametrit.length > 0) {
            return "ARVOVALIKONVERTTERI";
        }
    }

    this.getTemplate = function() {
        if(this.tyyppi) {
            return TEMPLATE_MAP[this.tyyppi]
        }
    }

    this.getParamIndex = function() {
        if(!this.tyyppi) {
            throw new Exception("Konvertterillä ei ole tyyppiä")
        }
        return this.tyyppi == 'ARVOKONVERTTERI' ? 'arvokonvertteriparametrit' : 'arvovalikonvertteriparametrit'
    }

    this.setTyyppi = function(tyyppi) {
        if(this.tyyppi) {
            var oldIdx = this.getParamIndex()
            this.oldData[this.tyyppi] = this.data[oldIdx].slice()
            this.data[oldIdx] = []
        }

        this.tyyppi = tyyppi
        this.template = TEMPLATE_MAP[tyyppi]

        var idx = this.getParamIndex()
        if(this.data[idx]) {
            this.data[idx].splice(0, this.data[idx].length)
        }
        if(this.oldData[this.tyyppi]) {
            for(var i = 0; i < this.oldData[this.tyyppi].length; i++) {
                this.data[idx].push(this.oldData[this.tyyppi][i])
            }
        }
        this.parametrit = this.getParametrit()
    }

    this.getDefinition = function() {
        var tyyppi = this.tyyppi
        return this.konvDef.konvertteriTyypit.filter(function(cur) {
            return cur.tyyppi === tyyppi
        })[0]
    }

    this.getParametrit = function() {
        var konvparams = []
        if(!this.tyyppi) {
            return konvparams
        }
        var konv = this.getDefinition()
        var idx = this.getParamIndex()
        for(var i in this.data[idx]) {
            var konvparam = this.data[idx][i]
            konvparams.push(new KonvertteriParametri(konv.arvotyyppi, konvparam))
        }
        /*this.data.konvertteriparametrit = this.data || []
        if(this.data.konvertteriparametrit.length == 0) {
            var data = {}
            this.data.konvertteriparametrit.push(data)
            konvparams.push(new KonvertteriParametri(konvertteri.arvotyyppi, data))
        }*/
        return konvparams
    }

    this.addParametri = function() {
        var konvertteri = this.getDefinition()
        if(!konvertteri) {
            return
        }
        var data = {}
        var idx = this.getParamIndex()
        if(!this.data[idx]) {
            this.data[idx] = []
        }
        this.data[idx].push(data)
        this.parametrit.push(new KonvertteriParametri(konvertteri.arvotyyppi, data))
    }

    this.removeParametri = function(konvparam) {
        var idx = this.getParamIndex()
        var index = this.data[idx].indexOf(konvparam)
        if(index == -1) return
        this.data[idx].splice(index, 1)
        this.parametrit.splice(index, 1)
    }


    this.init()
}

var KonvertteriParametri = function(tietotyyppi, data) {
    this.tietotyyppi = tietotyyppi
    this.data = data

    this.init = function() {

    }

    this.init()
}

var Parametri = function(definition, data) {
    this.definition = definition;
    this.data = data;
    var that = this;
    var HIDDEN_PARAMS = ["nimi"];

    /* Structure methods */
    this.avain = this.definition.avain;
    //this.arvo = this.data ? this.data.arvo : null
    this.tyyppi = this.definition.tyyppi;

    this.template = (function() {
        switch(that.tyyppi) {
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
    })();

    this.init = function() {
        this.hashKey = Math.random().toString(36).substring(7);
    }

    this.isVisible = function() {
        return HIDDEN_PARAMS.indexOf(this.avain)
    }

    this.init()
}

var FunktioNimiService = function() {

    var funktioNimiMap = {
        "SUMMA": "Summa",
        "KESKIARVO": "Keskiarvo",
        "OSAMAARA": "Osamäärä",
        "TAI": "Tai",
        "TULO": "Tulo",
        "SUMMA": "Summa",
        "JOS": "Jos",
        "SUUREMPI": "Suurempi",
        "YHTASUURI": "Yhtä suuri kuin",
        "PIENEMPI": "Pienempi",
        "MEDIAANI": "Mediaani",
        "PIENEMPITAIYHTASUURI": "Pienempi tai yhtä suuri",
        "SUUREMPITAIYHTASUURI": "Suurempi tai yhtä suuri",
        "EI": "Ei",
        "JA": "Ja",
        "MAKSIMI": "Maksimi",
        "MINIMI": "Pienin",
        "NEGAATIO": "Negaatio",
        "KESKIARVO": "Keskiarvo",
        "DEMOGRAFIA": "Demografia",
        "KONVERTOILUKUARVO": "Konvertoi",
        "HAEMERKKIJONOJAKONVERTOITOTUUSARVOKSI": "Konvertoi",
        "HYLKAA": "Hylkää",
        "PYORISTYS": "Pyöristys",
        "HAEMERKKIJONOJAKONVERTOITOTUUSARVOKSI": "Hae merkkijono ja konvertoi totuusarvoksi",
        "HAEMERKKIJONOJAKONVERTOILUKUARVOKSI": "Hae merkkijono ja konvertoi lukuarvoksi",
        "NIMETTYLUKUARVO": "Nimetty lukuarvo",
        "NIMETTYTOTUUSARVO": "Nimetty totuusarvo",
        "HAEMERKKIJONOJAVERTAAYHTASUURUUS": "Hae merkkijono ja vertaa yhtäsuuruus",
        "SKAALAUS": "Skaalaus",
        "PAINOTETTUKESKIARVO": "Painotettu keskiarvo"
    };

    /*
     "NMINIMI": "N:ksi pienin", "NMAKSIMI"
     "KESKIARVONPARASTA": "Keskiarvo N parasta",
     "SUMMANPARASTA": "Summa N parasta",
     TOTUUSARVO,
     */
    var kustomit = {
        "NIMETTYLUKUARVO": function(data) {
            var nimi = $.grep(data.syoteparametrit, function(param) {
                return param.avain == "nimi";
            });
            return nimi[0] && nimi[0].arvo ? nimi[0].arvo : "Nimetty lukuarvo";
        },
        "NIMETTYTOTUUSARVO": function(data) {
            var nimi = $.grep(data.syoteparametrit, function(param) {
                return param.avain == "nimi";
            });
            return nimi[0] && nimi[0].arvo ? nimi[0].arvo : "Nimetty totuusarvo";
        },
        "HAELUKUARVO": function(data) {
            if(!data.valintaperuste || !data.valintaperuste.lahde) {
                return "Haettava arvo";
            }
            switch (data.valintaperuste.lahde) {
                case "HAETTAVA_ARVO":
                    return "Arvo hakemukselta";
                case "SYOTETTAVA_ARVO":
                    return "Syötettävä arvo";
                case "HAKUKOHTEEN_ARVO":
                    return "Hakukohteen arvo";
            }
        },
        "HAETOTUUSARVO": function(data) {
            if(!data.valintaperuste || !data.valintaperuste.lahde) {
                return "Haettava arvo";
            }
            switch (data.valintaperuste.lahde) {
                case "HAETTAVA_ARVO":
                    return "Arvo hakemukselta";
                case "SYOTETTAVA_ARVO":
                    return "Syötettävä arvo";
                case "HAKUKOHTEEN_ARVO":
                    return "Hakukohteen arvo";
            }
        },
        "NMINIMI": function(data) {
            var format = " pienintä";
            var n = $.grep(data.syoteparametrit, function(param) {
                return param.avain == "n";
            })
            return n[0] && n[0].arvo ? n[0].arvo + format : "N" + format;
        },
        "NMAKSIMI": function(data) {
            var format = " suurinta";
            var n = $.grep(data.syoteparametrit, function(param) {
                return param.avain == "n";
            })
            return n[0] && n[0].arvo ? n[0].arvo + format : "N" + format;
        },
        "KESKIARVONPARASTA": function(data) {
            var format = " parasta keskiarvo";
            var n = $.grep(data.syoteparametrit, function(param) {
                return param.avain == "n";
            })
            return n[0] && n[0].arvo ? n[0].arvo + format : "N" + format;
        },
        "SUMMANPARASTA": function(data) {
            var format = " parasta summa";
            var n = $.grep(data.syoteparametrit, function(param) {
                return param.avain == "n";
            })
            return n[0] && n[0].arvo ? n[0].arvo + format : "N" + format;
        },
        "TOTUUSARVO": function(data) {
            var totuusarvo = $.grep(data.syoteparametrit, function(param) {
                return param.avain == "totuusarvo";
            });
            return totuusarvo[0] && totuusarvo[0].arvo ? totuusarvo[0].arvo : "Totuusarvo";
        },
        "LUKUARVO": function(data) {
            var luku = $.grep(data.syoteparametrit, function(param) {
                return param.avain == "luku";
            });
            return luku[0] && luku[0].arvo ? luku[0].arvo : "Vakio";
        },
        "HAKUTOIVE": function(data) {
            var n = $.grep(data.syoteparametrit, function(param) {
                return param.avain == "n";
            })
            return n[0] && n[0].arvo ? n[0].arvo + ". hakutoive" : "Hakutoive";
        }
    }

    return {
        nimi : function(data) {
            if(funktioNimiMap[data.funktionimi]) {
                return funktioNimiMap[data.funktionimi];
            } else if(kustomit[data.funktionimi]) {
                return kustomit[data.funktionimi](data);
            }
            throw "Funktiolle " + data.funktionimi + " ei löytynyt nimeä.";
        }
    }
};






