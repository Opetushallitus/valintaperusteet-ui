angular.module('valintaperusteet').
factory('FunktioService', function (FunktioKuvausResource, $log) {
    'use strict';

    var model = new function () {
        this.funktiokuvaukset = {};

        this.refresh = function () {
            if (_.isEmpty(model.funktiokuvaukset) ) {
                FunktioKuvausResource.get({}, function (result) {
                    model.funktiokuvaukset = result;
                }, function(error) {
                    $log.error('Funktiokuvausten hakeminen epäonnistui', error);
                });
            }
        };

        this.getFunktiokuvaukset = function () {
            return model.funktiokuvaukset;
        };

        this.getFunktiokuvaus = function (funktionimi) {
            var result;
            if (model.funktiokuvaukset) {
                model.funktiokuvaukset.forEach(function (funktiokuvaus) {
                    if (funktiokuvaus.nimi === funktionimi) {
                        result = funktiokuvaus;
                    }
                });
            }

            return result;
        };

        this.isNimettyFunktioargumentti = function (parent) {
            if(_.isEmpty(parent)) {return undefined}
            if(!(model.isFunktiokutsu(parent))) {return false;}
            var parentFunktionimi = model.getFunktionimi(parent);
            var funktiokuvaus = model.getFunktiokuvaus(parentFunktionimi);
            return funktiokuvaus.funktioargumentit && (funktiokuvaus.funktioargumentit.length > 1 || funktiokuvaus.funktioargumentit[0].kardinaliteetti !== 'n' && !model.isPainotettukeskiarvoChildByParentNimi(parentFunktionimi) );
        };
        
        this.isNimettyFunktioargumenttiByFunktionimi = function (parentFunktionimi) {
            var funktiokuvaus = model.getFunktiokuvaus(parentFunktionimi);
            return funktiokuvaus.funktioargumentit !== undefined && funktiokuvaus.funktioargumentit && (funktiokuvaus.funktioargumentit.length > 1 || funktiokuvaus.funktioargumentit[0].kardinaliteetti !== 'n' && !model.isPainotettukeskiarvoChildByParentNimi(parentFunktionimi) );
        };

        this.getNimettyFunktioargumenttiCount = function(parent) {
            if(_.isEmpty(parent)) {return undefined;}
            if(model.isNimettyFunktioargumentti(parent)) {
                var funktiokuvaus = model.getFunktiokuvaus(model.getFunktionimi(parent));
                return funktiokuvaus.funktioargumentit.length;
            } else {
                return 0;
            }
        };

        this.isFunktiokutsuWithFunktioargumenttiSizeN = function(parent) {
            if(_.isEmpty(parent)) {return undefined;}
            if(model.isFunktiokutsu(parent) && !(_.isEmpty(model.getFunktiokuvaus(model.getFunktionimi(parent)).funktioargumentit)) ) {

                var funktiokuvaus = model.getFunktiokuvaus(model.getFunktionimi(parent));
                if(funktiokuvaus.funktioargumentit) {
                    return funktiokuvaus.funktioargumentit[0].kardinaliteetti === 'n';
                } else {
                    return false;
                }
            } else {
                return false;
            }
        };

        this.isPainotettukeskiarvoChild = function (parent) {
            if (_.isEmpty(parent)) {return undefined;}
            if(!(model.isFunktiokutsu(parent))) {return false;}
            var funktiokuvaus = model.getFunktiokuvaus(model.getFunktionimi(parent));
            return funktiokuvaus.funktioargumentit && funktiokuvaus.funktioargumentit[0].kardinaliteetti === 'lista_pareja';
        };

        this.isPainotettukeskiarvoChildByParentNimi = function (parentFunktionimi) {
            if (_.isEmpty(parentFunktionimi)) {
                return false;
            }
            var funktiokuvaus = model.getFunktiokuvaus(parentFunktionimi);
            return funktiokuvaus.funktioargumentit && funktiokuvaus.funktioargumentit[0].kardinaliteetti === 'lista_pareja';
        };

        this.isEmptyNimettyFunktioargumentti = function (parent, funktioargumenttiIndex) {
            if (parent === undefined || funktioargumenttiIndex === undefined) {
                return undefined;
            }

            if (model.isRootFunktiokutsu(parent)) {
                return model.isNimettyFunktioargumentti(parent) && _.isEmpty(parent.funktioargumentit[funktioargumenttiIndex]) ? true : false;
            } else {
                return model.isNimettyFunktioargumentti(parent) && _.isEmpty(parent.lapsi.funktioargumentit[funktioargumenttiIndex]) ? true : false;
            }
        };

        this.isRootFunktiokutsu = function (funktiokutsu) {
            if (_.isEmpty(funktiokutsu)) {
                return undefined;
            }
            return _.isEmpty(funktiokutsu.lapsi) ? true : false;
        };


        this.getFunktionimi = function (funktiokutsu) {
            if (_.isEmpty(funktiokutsu)) {
                return undefined;
            }
            if (model.isRootFunktiokutsu(funktiokutsu)) {
                //laskentakaavan juurifunktiolla ei ole lapsi-objektia
                return funktiokutsu.funktionimi;
            } else {
                //jos funktio-parametri ei ole laskentakaavan ensimmäinen lapsi, niin funktiolla on lapsi-kääre
                return funktiokutsu.lapsi.funktionimi;
            }
        };


        this.isLukuarvoFunktioSlot = function (parent, funktioargumenttiIndex) {
            var isOnNimettySlot = model.isNimettyFunktioargumentti(parent);
            if (model.isRootFunktiokutsu(parent)) {
                var funktiokuvaus = model.getFunktiokuvaus(parent.funktionimi);
                var tyyppi = isOnNimettySlot ? funktiokuvaus.funktioargumentit[funktioargumenttiIndex].tyyppi : funktiokuvaus.funktioargumentit[0].tyyppi;
                return tyyppi === 'LUKUARVOFUNKTIO';
            } else {
                var funktiokuvaus = model.getFunktiokuvaus(parent.lapsi.funktionimi);
                var tyyppi = isOnNimettySlot ? funktiokuvaus.funktioargumentit[funktioargumenttiIndex].tyyppi : funktiokuvaus.funktioargumentit[0].tyyppi;
                return tyyppi === 'LUKUARVOFUNKTIO';
            }
        };


        //Montako funktioargumenttia funktiokutsulle luotu
        this.getDefinedFunktioargumenttiCount = function (funktiokutsu) {
            if (funktiokutsu.lapsi) {
                return _.filter(funktiokutsu.lapsi.funktioargumentit, function (item) {
                    return !_.isEmpty(item);
                }).length;
            } else {
                return _.filter(funktiokutsu.funktioargumentit, function (item) {
                    return !_.isEmpty(item);
                }).length;
            }
        };

        this.isFunktiokutsu = function (funktiokutsu) {
            if (funktiokutsu === undefined) {
                return undefined;
            }
            if (model.isRootFunktiokutsu(funktiokutsu)) {
                return funktiokutsu.lapsityyppi === 'funktiokutsu';
            } else {
                return funktiokutsu.lapsi.lapsityyppi === 'funktiokutsu';
            }
        };

        this.isLaskentakaavaviite = function(param) {
            if(_.isEmpty(param)) {return undefined;}
            return param.lapsi.lapsityyppi === 'laskentakaava' ? true : false;
        };

        this.cleanLaskentakaavaPKObjects = function (funktioargumentit) {
            if (funktioargumentit) {
                var isRootFunktiokutsu;
                _.forEach(funktioargumentit, function (item) {
                    isRootFunktiokutsu = model.isRootFunktiokutsu(item);
                    if (isRootFunktiokutsu === true) {
                        item.funktioargumentit = model.cleanLaskentakaavaPKObjects(item.funktioargumentit);
                    } else {
                        if (item && item.lapsi) {
                            item.lapsi.funktioargumentit = model.cleanLaskentakaavaPKObjects(item.lapsi.funktioargumentit);
                        }
                    }
                });
            }
            return _.filter(funktioargumentit, function (item) {
                return !_.isEmpty(item);
            });
        };

        this.addPKObjects = function (funktioargumentit) {
            if (funktioargumentit) {
                _.forEach(funktioargumentit, function (item) {
                    if (item.lapsi) {
                        model.addPKObjects(item.lapsi.funktioargumentit);
                        if (item.lapsi.funktionimi === 'PAINOTETTUKESKIARVO') {
                            item.lapsi.funktioargumentit = model.addPainotettukeskiarvoParametrit(item.lapsi.funktioargumentit);
                        }
                    }
                });
            }
            return funktioargumentit;
        };

        this.addMissingSyoteparametrit = function(funktiokutsu) {
            var funktiokuvaus = model.getFunktiokuvaus(model.getFunktionimi(funktiokutsu));
            model.addSyoteparametrit(funktiokuvaus, funktiokutsu.lapsi.syoteparametrit);
            if(funktiokutsu.lapsi.funktioargumentit) {
                _.forEach(funktiokutsu.funktioargumentit, function(funktioargumentti) {
                    if(funktioargumentti.lapsi) {
                        model.addMissingSyoteparametrit(funktioargumentti);
                    }
                });
            }
        };
        
        this.addSyoteparametrit = function(funktiokuvaus, syoteparametrit) {
            if(funktiokuvaus && funktiokuvaus.syoteparametrit && funktiokuvaus.syoteparametrit.length > syoteparametrit.length) {
                _.forEach(funktiokuvaus.syoteparametrit, function(kuvausSyoteparametri) {
                    var found = false;
                    _.forEach(syoteparametrit, function(funktioSyoteparametri) {
                        if(kuvausSyoteparametri.avain === funktioSyoteparametri.avain) {
                            found = true;
                        }
                    });
                    if(!found) {
                        syoteparametrit.push({avain: kuvausSyoteparametri.avain, arvo: ""});
                    }
                });
            }
        };

        this.addPainotettukeskiarvoParametrit = function (arr) {
            arr.push(null);
            arr.push(null);
            return arr;
        };

    }();

    return model;
}).

factory('Valintaperusteviitetyypit', function () {
    'use strict';

    return [
        { key: 'HAETTAVA_ARVO', text: 'Arvo hakemukselta' },
        { key: 'SYOTETTAVA_ARVO', text: 'Syötettävä arvo' },
        { key: 'HAKUKOHTEEN_ARVO', text: 'Hakukohteen arvo' },
        { key: 'HAKUKOHTEEN_SYOTETTAVA_ARVO', text: 'Hakukohteen syötettävä arvo' }
    ];
}).

factory('Arvokonvertterikuvauskielet', function () {
   'use strict';

    return [
        { key: 'FI', text: 'Suomi' },
        { key: 'SV', text: 'Ruotsi' },
        { key: 'EN', text: 'Englanti' }
    ];
});


