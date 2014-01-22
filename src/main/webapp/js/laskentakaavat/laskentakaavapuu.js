

app.factory('LaskentakaavaService', function($q, Laskentakaava, FunktioService){
    var model = new function() {
        this.laskentakaavapuu = {};

        this.refresh = function(oid) {
            Laskentakaava.get({oid: oid}, function(result) {
                model.laskentakaavapuu = result;
                //laskentakaavan painotettu keskiarvo -funktiokutsuihin lisätään tyhjät objektit, jotta niihin pystytään lisäämään funktioargumentteja
                FunktioService.addPKObjects(model.laskentakaavapuu.funktiokutsu.funktioargumentit);
            });
        }
    }   

    return model;
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

        this.isNimettyFunktioargumentti = function(parent) {
            var parentFunktionimi = model.getFunktionimi(parent)
            var funktiokuvaus = model.getFunktiokuvaus(parentFunktionimi);
            return funktiokuvaus.funktioargumentit && (funktiokuvaus.funktioargumentit.length > 1 || funktiokuvaus.funktioargumentit[0].kardinaliteetti !== 'n' && !model.isPainotettukeskiarvoChildByParentNimi(parentFunktionimi) );
        }

        this.isNimettyFunktioargumenttiByFunktionimi = function(parentFunktionimi) {
            var funktiokuvaus = model.getFunktiokuvaus(parentFunktionimi);
            return funktiokuvaus.funktioargumentit && (funktiokuvaus.funktioargumentit.length > 1 || funktiokuvaus.funktioargumentit[0].kardinaliteetti !== 'n' && !model.isPainotettukeskiarvoChildByParentNimi(parentFunktionimi) );
        }

        this.isPainotettukeskiarvoChild = function(parent) {
            var funktiokuvaus = model.getFunktiokuvaus(model.getFunktionimi(parent));
            return funktiokuvaus.funktioargumentit && funktiokuvaus.funktioargumentit[0].kardinaliteetti === 'lista_pareja';
        }

        this.isPainotettukeskiarvoChildByParentNimi = function(parentFunktionimi) {
            var funktiokuvaus = model.getFunktiokuvaus(parentFunktionimi);
            return funktiokuvaus.funktioargumentit && funktiokuvaus.funktioargumentit[0].kardinaliteetti === 'lista_pareja';
        }

        this.isEmptyNimettyFunktioargumentti = function(parent, funktioargumenttiIndex) {
            if( model.isNimettyFunktioargumentti(parent) && _.isEmpty(parent.funktioargumentit[funktioargumenttiIndex]) ) {
                return true;
            } else {
                return false;
            }
        }

        this.getFunktionimi = function(funktio) {
            if(funktio.lapsi) {
                //jos funktio-parametri ei ole laskentakaavan ensimmäinen lapsi, niin funktiolla on lapsi-kääre
                return funktio.lapsi.funktionimi;
            } else {
                //laskentakaavan juurifunktiolla ei ole lapsi-objektia
                return funktio.funktionimi;
            }
        }

        this.isLukuarvoFunktioSlot = function(parent, funktioargumenttiIndex) {
            var funktiokuvaus = model.getFunktiokuvaus(parent.funktionimi);
            if(funktiokuvaus.funktioargumentit[funktioargumenttiIndex].tyyppi == 'LUKUARVOFUNKTIO') {
                return true;
            } else {
                return false;
            }
        }

        //Montako funktioargumenttia funktiokutsulle luotu
        this.getDefinedFunktioargumenttiCount = function(funktiokutsu) {
            if(funktiokutsu.lapsi) {
                return _.filter(funktiokutsu.lapsi.funktioargumentit, function(item) {return !_.isEmpty(item)}).length;
            } else {
                return _.filter(funktiokutsu.funktioargumentit, function(item) {return !_.isEmpty(item)}).length;
            }
        }

        this.refresh = function() {
            FunktioKuvausResource.get({}, function(result) {
                model.funktiokuvaukset = result;
            });
        }


        this.cleanLaskentakaavaPKObjects = function(funktioargumentit) {
            if(funktioargumentit) {
                _.forEach(funktioargumentit, function(item) {
                    if(item.lapsi) { item.lapsi.funktioargumentit = model.cleanLaskentakaavaPKObjects(item.lapsi.funktioargumentit); }
                });
            }
            return _.filter(funktioargumentit, function(item) {return !_.isEmpty(item)});
        }

        this.addPKObjects = function(funktioargumentit) {
            if(funktioargumentit) {
                _.forEach(funktioargumentit, function(item) {
                    if(item.lapsi) {
                        model.addPKObjects(item.lapsi.funktioargumentit);
                        if(item.lapsi.funktionimi === 'PAINOTETTUKESKIARVO') {
                            item.lapsi.funktioargumentit = model.addPainotettukeskiarvoParametrit(item.lapsi.funktioargumentit);     
                        }
                    }
                }); 
            }
            return funktioargumentit;
        }

        this.addPainotettukeskiarvoParametrit = function(arr) {
            arr.push({});
            arr.push({});
            return arr;
        }

    }

    return model;
});

app.factory('FunktioNimiService', function() {
    var nameService = new function() {
        this.nameMappings = {
            LUKUARVO: 'Lukuarvo',
            TOTUUSARVO: 'Totuusarvo',
            HAKUTOIVE: 'Hakutoive',
            DEMOGRAFIA: 'Demografia',
            HAETOTUUSARVO: 'Hae totuusarvo',
            HAELUKUARVO: 'Hae lukuarvo',
            HAEMERKKIJONOJAKONVERTOILUKUARVOKSI: 'Hae merkkijono ja konvertoi lukuarvoksi',
            HAEMERKKIJONOJAVERTAAYHTASUURUUS: 'Hae merkkijono ja vertaa yhtäsuuruus',
            HAEMERKKIJONOJAKONVERTOITOTUUSARVOKSI: 'Hae merkkijono ja konvertoi totuusarvoksi',
            VALINTAPERUSTEYHTASUURUUS: 'Valintaperusteyhtäsuuruus',
            SUMMA: 'Summa',
            TAI: 'Tai',
            TULO: 'Tulo',
            JOS: 'Jos',
            OSAMAARA: 'Osamäärä',
            SUUREMPI: 'Suurempi',
            YHTASUURI: 'Yhtäsuuri',
            PIENEMPI: 'Pienempi',
            MEDIAANI: 'Mediaani',
            PIENEMPITAIYHTASUURI: 'Pienempi tai yhtäsuuri',
            SUUREMPITAIYHTASUURI: 'Suurempi tai yhtäsuuri',
            EI: 'Ei',
            JA: 'Ja',
            MAKSIMI: 'Maksimi',
            MINIMI: 'Minimi',
            NEGAATIO: 'Negaatio',
            KESKIARVO: 'Keskiarvo',
            PAINOTETTUKESKIARVO: 'Painotettu keskiarvo',
            KONVERTOILUKUARVO: 'Konvertoi lukuarvo',
            HYLKAA: 'Hylkää', 
            PYORISTYS: 'Pyöristys',
            SKAALAUS: 'Skaalaus',
            NMINIMI: 'N huonoin',
            NMAKSIMI: 'N paras',
            KESKIARVONPARASTA: 'N:n suurimman keskiarvo',
            SUMMANPARASTA: 'N:n suurimman summa',
            HYLKAAARVOVALILLA: 'Hylkää arvovälillä',
            NIMETTYLUKUARVO: 'Nimetty lukuarvo',
            NIMETTYTOTUUSARVO: 'Nimetty totuusarvo'
        }

        this.getName = function(funktionimi) {
            return nameService.nameMappings[funktionimi];
        }
    }

    return nameService;
});

app.factory('FunktioFactory', function(FunktioService){
    var factory = new function() {

        function generateFunktioPrototype() {
            return {
                lapsi: {
                    funktionimi: null,
                    arvokonvertteriparametrit: [],
                    arvovalikonvertteriparametrit: [],
                    syoteparametrit: [],
                    funktioargumentit: [],
                    valintaperusteviitteet: [],
                    validointivirheet: [],
                    onLuonnos: null,
                    nimi: null,
                    kuvaus: null,
                    tyyppi: null,
                    lapsityyppi: null,
                    tulosTunniste: null,
                    tallennaTulos: false,
                    tulosTekstiFi: null,
                    tulosTekstiSv: null,
                    tulosTekstiEn: null
                },
                
                indeksi: 0
            }
        }
        
        function setLapsityyppi(funktioprototype, funktiotyyppi) {
            if(funktiotyyppi === 'LASKENTAKAAVAVIITE') {
                funktioprototype.lapsi.lapsityyppi = "laskentakaava";
            } else {
                funktioprototype.lapsi.lapsityyppi = "funktiokutsu";
            }
        }

        this.createLaskentakaavaviite = function(laskentakaavaviite) {
            
            if(laskentakaavaviite) {
                return {
                    lapsi: {
                        funktionimi: null,
                        arvokonvertteriparametrit: [],
                        arvovalikonvertteriparametrit: [],
                        syoteparametrit: [],
                        funktioargumentit: [],
                        valintaperusteviitteet: [],
                        validointivirheet: [],
                        onLuonnos: laskentakaavaviite.onLuonnos,
                        nimi: laskentakaavaviite.nimi,
                        kuvaus: laskentakaavaviite.kuvaus,
                        tyyppi: laskentakaavaviite.tyyppi,
                        id: laskentakaavaviite.id,
                        lapsityyppi: "laskentakaava",
                        tulosTunniste: null,
                        tulosTekstiFi: null,
                        tulosTekstiSv: null,
                        tulosTekstiEn: null,
                        tallennaTulos: false
                    },
                    indeksi: 0
                }
            } else {
                return {
                    lapsi: {
                        funktionimi: null,
                        arvokonvertteriparametrit: [],
                        arvovalikonvertteriparametrit: [],
                        syoteparametrit: [],
                        funktioargumentit: [],
                        valintaperusteviitteet: [],
                        validointivirheet: [],
                        onLuonnos: false,
                        nimi: 'Valitse laskentakaava',
                        kuvaus: null,
                        tyyppi: null,
                        id: null,
                        lapsityyppi: "laskentakaava",
                        tulosTunniste: null,
                        tulosTekstiFi: null,
                        tulosTekstiSv: null,
                        tulosTekstiEn: null,
                        tallennaTulos: false
                    },
                    indeksi: 0
                }
            } 
        }

        //parentFunktiokutsu -objektista puuttuu lapsi-wrapperi, joten funktiokutsun luominen juureen toteutetaan erikseen
        this.createFirstChildFunktio = function(parentFunktiokutsu, newFunktioType) {
            var parentFunktiokuvaus = FunktioService.getFunktiokuvaus(parentFunktiokutsu.funktionimi);
            var newFunktioFunktiokuvaus = FunktioService.getFunktiokuvaus(newFunktioType);
            var funktioprototype = generateFunktioPrototype();

            //Funktionimi
            funktioprototype.lapsi.funktionimi = newFunktioType;

            //Asetetaan lapsityyppi
            setLapsityyppi(funktioprototype, newFunktioType);

            //Generoidaan syoteparametrit
            if(newFunktioFunktiokuvaus.syoteparametrit) { populateSyoteparametrit(funktioprototype, newFunktioFunktiokuvaus)}

            //Generoidaan funktioargumentit
            if(newFunktioFunktiokuvaus.funktioargumentit) { 
                populateFunktioargumentit(funktioprototype, newFunktioFunktiokuvaus, FunktioService.isNimettyFunktioargumenttiByFunktionimi(newFunktioType), FunktioService.isPainotettukeskiarvoChildByParentNimi(newFunktioType) );
            }

            //Generoidaan valintaperusteviitteet
            if(newFunktioFunktiokuvaus.valintaperuste) { populateValintaperusteviitteet(funktioprototype, newFunktioFunktiokuvaus) }
            
            return funktioprototype;

        }

        //huomioi laskentakaavaviitteet
        this.createFunktioInstance = function(parentFunktiokutsu, newFunktioType) {

            var parentFunktiokuvaus = FunktioService.getFunktiokuvaus(parentFunktiokutsu.lapsi.funktionimi); 
            var newFunktioFunktiokuvaus = FunktioService.getFunktiokuvaus(newFunktioType);            
            var funktioprototype = generateFunktioPrototype();

            //Funktionimi
            funktioprototype.lapsi.funktionimi = newFunktioType;
            
            //Asetetaan lapsityyppi
            setLapsityyppi(funktioprototype, newFunktioType);

            //Generoidaan syoteparametrit
            if(newFunktioFunktiokuvaus.syoteparametrit) { populateSyoteparametrit(funktioprototype, newFunktioFunktiokuvaus) }

            //Generoidaan funktioargumentit
            if(newFunktioFunktiokuvaus.funktioargumentit) { 
                populateFunktioargumentit(funktioprototype, newFunktioFunktiokuvaus, FunktioService.isNimettyFunktioargumenttiByFunktionimi(newFunktioType), FunktioService.isPainotettukeskiarvoChildByParentNimi(newFunktioType) );
            }

            //Generoidaan valintaperusteviitteet
            if(newFunktioFunktiokuvaus.valintaperuste) { populateValintaperusteviitteet(funktioprototype, newFunktioFunktiokuvaus);}
            
            return funktioprototype;
        }

        //Lisätään funktioprototypeen funktiokuvauksen mukaiset syoteparametrit
        function populateSyoteparametrit(funktioprototype, funktiokuvaus) {
            funktiokuvaus.syoteparametrit.forEach(function(item) {
                funktioprototype.lapsi.syoteparametrit.push({});
                //täytyy käyttää angular.copya, tai syoteparametrit luoduissa eri funktiokutsuissa viittaavat samoihin syoteparametriobjekteihin
                angular.copy(item, funktioprototype.lapsi.syoteparametrit[funktioprototype.lapsi.syoteparametrit.length - 1]);
            });
        }

        // Lisätään funktioprototypeen tarvittava määrä null objekteja funktioargumenteiksi
        // funktioparentin ja funktioargumentin mukaiset tekstit muodostetaan templateissa
        function populateFunktioargumentit(funktioprototype, funktiokuvaus, hasNimetytFunktioargumentit, isPainotettukeskiarvoChild) {

            if(hasNimetytFunktioargumentit) {

                //Lisätään yhtä monta null objektia, kuin nimettyjä funktioargumentteja. 
                funktiokuvaus.funktioargumentit.forEach(function() {
                    funktioprototype.lapsi.funktioargumentit.push(null) 
                });
            } else if(isPainotettukeskiarvoChild) {
                funktioprototype.lapsi.funktioargumentit.push({});
                funktioprototype.lapsi.funktioargumentit.push({});

            } else {
                //jos funktiolla on nimeämätön määrä funktioargumentteja, lisätään listaan yksi null
                funktioprototype.lapsi.funktioargumentit.push(null);
            }
        }

        // Lisätään funktioprototypeen funktiokuvauksen valintaperusteiden mukainen määrä tyhjiä objekteja
        function populateValintaperusteviitteet(funktioprototype, funktiokuvaus) {
            funktiokuvaus.valintaperuste.forEach(function(item) {
                funktioprototype.lapsi.valintaperusteviitteet.push({});
            });
        } 

        function arrayWithSingleNull(arr) {
            if(arr.length === 1 && arr[0] === null) { return true; } 
            else { return false; }
        }

        

    }

    return factory;
});

app.factory('TemplateService', function(FunktioService) {
    var templateservice = new function() {

        

        this.getSyoteparametriTemplate = function(funktio, syoteparametriIndex) {

            var funktiokuvaus = FunktioService.getFunktiokuvaus(FunktioService.getFunktionimi(funktio));
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


