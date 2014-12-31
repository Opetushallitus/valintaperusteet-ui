angular.module('valintaperusteet').
service('FunktioService', ['FunktioKuvausResource', '$log', '_',
                function (FunktioKuvausResource, $log, _) {
    'use strict';

    var api = this;

    this.funktiokuvaukset = {};
    
    this.refresh = function () {
        if (_.isEmpty(api.funktiokuvaukset) ) {
            FunktioKuvausResource.get({}, function (result) {
                api.funktiokuvaukset = result;
            }, function(error) {
                $log.error('Funktiokuvausten hakeminen epäonnistui', error);
            });
        }
    };

    this.getFunktiokuvaukset = function () {
        return api.funktiokuvaukset;
    };

    this.getFunktiokuvaus = function (funktionimi) {
        var result;
        if (api.funktiokuvaukset) {
            result = _.find(api.funktiokuvaukset, function (funktiokuvaus) {
                return funktiokuvaus.nimi === funktionimi;
            });
        }

        return result;
    };

    this.isNimettyFunktioargumentti = function (parent) {
        if(_.isEmpty(parent)) {return undefined}
        if(!(api.isFunktiokutsu(parent))) {return false;}
        var parentFunktionimi = api.getFunktionimi(parent);
        var funktiokuvaus = api.getFunktiokuvaus(parentFunktionimi);
        return funktiokuvaus.funktioargumentit && (funktiokuvaus.funktioargumentit.length > 1 || funktiokuvaus.funktioargumentit[0].kardinaliteetti !== 'n' && !api.isPainotettukeskiarvoChildByParentNimi(parentFunktionimi) );
    };

    this.isNimettyFunktioargumenttiByFunktionimi = function (parentFunktionimi) {
        var funktiokuvaus = api.getFunktiokuvaus(parentFunktionimi);
        return funktiokuvaus.funktioargumentit !== undefined && funktiokuvaus.funktioargumentit && (funktiokuvaus.funktioargumentit.length > 1 || funktiokuvaus.funktioargumentit[0].kardinaliteetti !== 'n' && !api.isPainotettukeskiarvoChildByParentNimi(parentFunktionimi) );
    };

    this.getNimettyFunktioargumenttiCount = function(parent) {
        if(_.isEmpty(parent)) {return undefined;}
        if(api.isNimettyFunktioargumentti(parent)) {
            var funktiokuvaus = api.getFunktiokuvaus(api.getFunktionimi(parent));
            return funktiokuvaus.funktioargumentit.length;
        } else {
            return 0;
        }
    };

    this.hasNSizeFunktioargumenttiByFunktionimi = function(funktionimi) {
        var funktiokuvaus = api.getFunktiokuvaus(funktionimi);
        if(funktiokuvaus.funktioargumentit) {
            return funktiokuvaus.funktioargumentit[0].kardinaliteetti === 'n';
        } else {
            return false;
        }
    };

    this.isPainotettukeskiarvo = function (funktiokutsu) {
        if (_.isEmpty(funktiokutsu)) {return undefined;}
        if(!(api.isFunktiokutsu(funktiokutsu))) {return false;}
        var funktiokuvaus = api.getFunktiokuvaus(api.getFunktionimi(funktiokutsu));
        return funktiokuvaus.funktioargumentit && funktiokuvaus.funktioargumentit[0].kardinaliteetti === 'lista_pareja';
    };

    this.isPainotettukeskiarvoChildByParentNimi = function (parentFunktionimi) {
        if (_.isEmpty(parentFunktionimi)) {
            return false;
        }
        var funktiokuvaus = api.getFunktiokuvaus(parentFunktionimi);
        return funktiokuvaus.funktioargumentit && funktiokuvaus.funktioargumentit[0].kardinaliteetti === 'lista_pareja';
    };

    this.isEmptyNimettyFunktioargumentti = function (parent, funktioargumenttiIndex) {
        if (parent === undefined || funktioargumenttiIndex === undefined) {
            return undefined;
        }

        if (api.isRootFunktiokutsu(parent)) {
            return api.isNimettyFunktioargumentti(parent) && _.isEmpty(parent.funktioargumentit[funktioargumenttiIndex]) ? true : false;
        } else {
            return api.isNimettyFunktioargumentti(parent) && _.isEmpty(parent.lapsi.funktioargumentit[funktioargumenttiIndex]) ? true : false;
        }
    };

    this.isRootFunktiokutsu = function (funktiokutsu) {
        try {
            if(_.isEmpty(funktiokutsu)) {
                throw new Error('Funktiokutsua ei ole määritelty');
            } else {
                return !_.has(funktiokutsu, 'lapsi');
            }
        } catch(error) {
            $log.error(error);
        }
    };


    this.getFunktionimi = function (funktiokutsu) {
        if (_.isEmpty(funktiokutsu)) {
            return undefined;
        }
        if (api.isRootFunktiokutsu(funktiokutsu)) {
            //laskentakaavan juurifunktiolla ei ole lapsi-objektia
            return funktiokutsu.funktionimi;
        } else {
            //jos funktio-parametri ei ole laskentakaavan ensimmäinen lapsi, niin funktiolla on lapsi-kääre
            return funktiokutsu.lapsi.funktionimi;
        }
    };

    this.isLukuarvoFunktiokutsu = function (funktiokuvaus) {
        return funktiokuvaus.tyyppi === 'LUKUARVOFUNKTIO';
    };


    this.isLukuarvoFunktioSlot = function (parent, funktioargumenttiIndex) {
        var funktiokuvaus, tyyppi;
        var isOnNimettySlot = api.isNimettyFunktioargumentti(parent);
        if (api.isRootFunktiokutsu(parent)) {
            funktiokuvaus = api.getFunktiokuvaus(parent.funktionimi);
            tyyppi = isOnNimettySlot ? funktiokuvaus.funktioargumentit[funktioargumenttiIndex].tyyppi : funktiokuvaus.funktioargumentit[0].tyyppi;
            return tyyppi === 'LUKUARVOFUNKTIO';
        } else {
            funktiokuvaus = api.getFunktiokuvaus(parent.lapsi.funktionimi);
            tyyppi = isOnNimettySlot ? funktiokuvaus.funktioargumentit[funktioargumenttiIndex].tyyppi : funktiokuvaus.funktioargumentit[0].tyyppi;
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
        if (api.isRootFunktiokutsu(funktiokutsu)) {
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
                isRootFunktiokutsu = api.isRootFunktiokutsu(item);
                if (isRootFunktiokutsu === true) {
                    item.funktioargumentit = api.cleanLaskentakaavaPKObjects(item.funktioargumentit);
                } else {
                    if (item && item.lapsi) {
                        item.lapsi.funktioargumentit = api.cleanLaskentakaavaPKObjects(item.lapsi.funktioargumentit);
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
                    api.addPKObjects(item.lapsi.funktioargumentit);
                    if (item.lapsi.funktionimi === 'PAINOTETTUKESKIARVO') {
                        item.lapsi.funktioargumentit = api.addPainotettukeskiarvoParametrit(item.lapsi.funktioargumentit);
                    }
                }
            });
        }
        return funktioargumentit;
    };

    this.addMissingSyoteparametrit = function(funktiokutsu) {
        var funktiokuvaus = api.getFunktiokuvaus(api.getFunktionimi(funktiokutsu));
        api.addSyoteparametrit(funktiokuvaus, funktiokutsu.lapsi.syoteparametrit);
        if(funktiokutsu.lapsi.funktioargumentit) {
            _.forEach(funktiokutsu.funktioargumentit, function(funktioargumentti) {
                if(funktioargumentti.lapsi) {
                    api.addMissingSyoteparametrit(funktioargumentti);
                }
            });
        }
    };

    this.addSyoteparametrit = function(funktiokuvaus, syoteparametrit) {
        if(funktiokuvaus && funktiokuvaus.syoteparametrit && funktiokuvaus.syoteparametrit.length > syoteparametrit.length) {
            _.forEach(funktiokuvaus.syoteparametrit, function(kuvausSyoteparametri) {
                var found = _.some(syoteparametrit, function(funktioSyoteparametri) {
                    return kuvausSyoteparametri.avain === funktioSyoteparametri.avain;
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

    this.hasFunktioargumentit = function (parentFunktiokutsu, childIndex) {
        if(parentFunktiokutsu === undefined || childIndex === undefined) {
            throw new Error('Missing parameter for Funktioservice.hasFunktioargumentit', arguments);
        }

        if(api.isRootFunktiokutsu(parentFunktiokutsu)) {
            return true; // juurifunktiolla (nimetty luku- tai totuusarvo) on aina funktioargumentille paikka
        }

        var funktiokuvaus = api.getFunktiokuvaus(parentFunktiokutsu.lapsi.funktioargumentit[childIndex].lapsi.funktionimi);
        return _.has(funktiokuvaus, 'funktioargumentit');
    };
        
    this.hasFunktioargumentitByFunktionimi = function (funktionimi) {
        var funktiokuvaus = api.getFunktiokuvaus(funktionimi);
        return _.has(funktiokuvaus, 'funktioargumentit');
    };

    this.getCurrentFunktiokutsu = function (parentFunktiokutsu, childIndex) {
        return api.isRootFunktiokutsu(parentFunktiokutsu) ? parentFunktiokutsu.funktioargumentit[childIndex] : parentFunktiokutsu.lapsi.funktioargumentit[childIndex];
    };

    this.getFunktioNimiLista = function () {
        return _.pluck(api.funktiokuvaukset, 'nimi');
    };

}])

.factory('Valintaperusteviitetyypit', [function () {
    'use strict';

    return [
        { key: 'HAETTAVA_ARVO', text: 'Arvo hakemukselta' },
        { key: 'SYOTETTAVA_ARVO', text: 'Syötettävä arvo' },
        { key: 'HAKUKOHTEEN_ARVO', text: 'Hakukohteen arvo' },
        { key: 'HAKUKOHTEEN_SYOTETTAVA_ARVO', text: 'Hakukohteen syötettävä arvo' }
    ];
}])

.factory('Arvokonvertterikuvauskielet', [function () {
   'use strict';

    return [
        { key: 'FI', text: 'Suomi' },
        { key: 'SV', text: 'Ruotsi' },
        { key: 'EN', text: 'Englanti' }
    ];
}]);


