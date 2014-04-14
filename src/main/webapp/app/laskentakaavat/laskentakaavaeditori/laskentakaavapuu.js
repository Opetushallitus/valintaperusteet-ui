'use strict';

angular.module('LaskentakaavaEditor').controller('LaskentakaavaController',
    ['$scope', '_', '$location', '$routeParams', 'KaavaValidointi', 'Laskentakaava', 'LaskentakaavaLista',
        'TemplateService', 'FunktioService', 'Valintaperusteviitetyypit', 'Arvokonvertterikuvauskielet', 'FunktioNimiService', 'FunktioFactory',
        function ($scope, _, $location, $routeParams, KaavaValidointi, Laskentakaava, LaskentakaavaLista, TemplateService, FunktioService, Valintaperusteviitetyypit, Arvokonvertterikuvauskielet, FunktioNimiService, FunktioFactory) {

            //servicet laskentakaavapuun piirtämiseen
            $scope.templateService = TemplateService;
            $scope.funktioService = FunktioService;
            $scope.funktioService.refresh();
            $scope.funktionimiService = FunktioNimiService;
            $scope.funktioFactory = FunktioFactory;
            $scope.createNewLaskentakaava = false;
            $scope.valintaperusteviitetyypit = Valintaperusteviitetyypit;
            $scope.arvokonvertterikuvauskielet = Arvokonvertterikuvauskielet;
            $scope.errors = [];
            $scope.model = {};


            //Pidetään laskentakaaviitevalinta objektissa. Laskentakaavaviitettä kaavaan liitettäessä radio-inputit iteroidaan ng-repeatissa,
            //joka luo uuden skoopin joka itemille, jolloin laskentakaavaviitteen tallentaminen  suoraan skoopissa olevaan muuttujaan ei toimi oikein
            $scope.laskentakaavaviite = { selection: null }

            //Haetaan laskentakaavan data
            if ($routeParams.laskentakaavaOid) {
                $scope.laskentakaavaOid = $routeParams.laskentakaavaOid;
                Laskentakaava.get({oid: $scope.laskentakaavaOid}, function (result) {
                    $scope.model.laskentakaavapuu = result;
                    //laskentakaavan painotettu keskiarvo -funktiokutsuihin lisätään tyhjät objektit, jotta niihin pystytään lisäämään funktioargumentteja
                    FunktioService.addPKObjects($scope.model.laskentakaavapuu.funktiokutsu.funktioargumentit);
                });
            }

            $scope.$on('newkaava', function () {
                $scope.model.laskentakaavapuu = $scope.$parent.$parent.newKaavaTemplate;
            });

            if ($routeParams.valintaryhmaOid) {
                LaskentakaavaLista.refresh($routeParams.valintaryhmaOid, null, false);
            } else if ($routeParams.hakukohdeOid) {
                LaskentakaavaLista.refresh(null, $routeParams.hakukohdeOid, false);
            } else {
                LaskentakaavaLista.refresh(null, null, false);
            }

            $scope.laskentakaavalista = LaskentakaavaLista;

            // Valitun funktio/laskentakaavaviitteen tietoja
            $scope.funktioasetukset = {
                selectedFunktioIndex: undefined,
                konvertteriType: '', //mikä konvertterityyppi on valittuna
                parentFunktiokutsu: undefined,
                showNewFunktioList: false
            }

            $scope.setRootSelection = function (funktiokutsu) {
                $scope.isRootSelected = true;
                $scope.funktioSelection = funktiokutsu;
            }

            /*
             funktio = valittu funktiokutsu tai laskentakaavaviite
             isFunktiokutsu = onko funktio-parametri funktiokutsu vai laskentakavaaviite
             parentFunktiokutsu = parentFunktiokutsu tai laskentakaavan juuri
             index = monesko funktio-parametri on funktioargumenttilistassa, juurifunktiokutsulla ei ole indeksiä
             */
            $scope.setFunktioSelection = function (funktio, isFunktiokutsu, parentFunktiokutsu, index) {
                $scope.funktioasetukset.parentFunktiokutsu = parentFunktiokutsu;

                $scope.funktioasetukset.selectedFunktioIndex = index;
                $scope.funktioSelection = funktio;
                if (isFunktiokutsu) {
                    $scope.funktiokuvausForSelection = $scope.funktioService.getFunktiokuvaus(funktio.lapsi.funktionimi);
                }

                //päätellään funktiolle esivalittu konvertteriparametrityyppi, jos funktiolla on konvertteriparametreja
                $scope.setKonvertteriType($scope.funktioSelection);

                // päätellään kumpi muokkausnäkymä tuodaan näkyviin, funktiokutsuille ja laskentakaavaviitteille on omat näkymänsä
                // jos kyseessä on funktiokutsu, jolle ei ole muokattavia asetuksia, niin ei avata muokkausnäkymää
                if (isFunktiokutsu) {
                    $scope.$broadcast('showFunktiokutsuAsetukset')
                } else {
                    $scope.$broadcast('showLaskentakaavaviiteAsetukset');
                }


                $scope.laskentakaavaviite.selection = funktio || null;
                $scope.isRootSelected = false;
                $scope.errors.length = 0;
                $scope.saved = false;
            }

            $scope.setLaskentakaavaviite = function (kaava) {
                $scope.funktioasetukset.parentFunktiokutsu.lapsi.funktioargumentit[$scope.funktioasetukset.selectedFunktioIndex] = $scope.funktioFactory.createLaskentakaavaviite(kaava);
            }

            $scope.addLaskentakaavaviite = function (parent, index) {
                var firstChildForRoot = $scope.isFirstChildForRoot(parent);

                $scope.funktioasetukset.parentFunktiokutsu = parent;
                $scope.funktioasetukset.selectedFunktioIndex = index;

                $scope.funktioasetukset.parentFunktiokutsu.lapsi.funktioargumentit[$scope.funktioasetukset.selectedFunktioIndex] = $scope.funktioFactory.createLaskentakaavaviite();
                $scope.laskentakaavaviite.selection = '-';
            }

            $scope.addFunktio = function (parent, funktionimi, index) {
                var isDirectChildForRoot = $scope.isFirstChildForRoot(parent);
                var createdFunktio = $scope.funktioFactory.createFunktioInstance(parent, funktionimi, isDirectChildForRoot);

                if (isDirectChildForRoot) {
                    parent.funktioargumentit[index] = createdFunktio;
                } else {
                    parent.lapsi.funktioargumentit[index] = createdFunktio;
                }

                $scope.setFunktioSelection(createdFunktio, true, parent, index);

                //lisätään uusi pari funktioargumentteja, kun edelliset on täytetty
                if ($scope.getFunktionimi(parent) === 'PAINOTETTUKESKIARVO') {
                    var argCount = $scope.getDefinedFunktioargumenttiCount(parent);
                    if (argCount % 2 == 0) {
                        parent.lapsi.funktioargumentit.push({});
                        parent.lapsi.funktioargumentit.push({});
                    }
                }
            }

            // index on indeksi nyt käsiteltävälle funktioargumentille (vain nimetyille funktioargumenteille)
            $scope.findFunktioSlotIndex = function (parent, index) {
                var isNimetty = $scope.isNimettyFunktioargumentti(parent);
                var resultIndex = undefined;
                var isPainotettukeskiarvoChild = $scope.funktioService.isPainotettukeskiarvoChild(parent);
                if (isNimetty || isPainotettukeskiarvoChild) {
                    resultIndex = index;
                } else {
                    if ($scope.isFirstChildForRoot(parent)) {
                        resultIndex = $scope.noFunktioarguments(parent.funktioargumentit) ? 0 : parent.lapsi.funktioargumentit.length;
                    } else {
                        resultIndex = $scope.noFunktioarguments(parent.lapsi.funktioargumentit) ? 0 : parent.lapsi.funktioargumentit.length;
                    }
                }
                return resultIndex;
            }


            $scope.noFunktioarguments = function (funktioargumentit) {
                return funktioargumentit.length == 1 && _.isEmpty(funktioargumentit[0]);
            }

            // Kaikissa tapauksissa funktiokutsuilla ja laskentakaavaviitteillä on parent, mutta juuresta seuraavalla tasolla ei ole parent.lapsi -muuttujaa,
            // jolloin sama, tarvittava tieto saadaan suoraan parent-muuttujasta
            $scope.getParent = function (parent) {
                return parent.lapsi || parent;
            }

            $scope.setKonvertteriType = function (funktio) {
                if ($scope.funktioSelection.lapsi.arvokonvertteriparametrit && $scope.funktioSelection.lapsi.arvovalikonvertteriparametrit.length == 0) {
                    $scope.funktioasetukset.konvertteriType = 'ARVOKONVERTTERI';
                } else if ($scope.funktioSelection.lapsi.arvovalikonvertteriparametrit && $scope.funktioSelection.lapsi.arvokonvertteriparametrit.length == 0) {
                    $scope.funktioasetukset.konvertteriType = 'ARVOVALIKONVERTTERI';
                }
            }

            $scope.addFunktiokonvertteriparametri = function (konvertteriparametriSelection) {

                var emptyArvokonvertteriparametri = {paluuarvo: '', hylkaysperuste: false, arvo: ''}
                var emptyArvovalikonvertteriparametri = {paluuarvo: '', palautaHaettuArvo: false, minValue: '', maxValue: ''}

                if ($scope.funktioasetukset.konvertteriType == "ARVOKONVERTTERI") {
                    $scope.funktioSelection.lapsi.arvokonvertteriparametrit.push(emptyArvokonvertteriparametri);
                } else {
                    $scope.funktioSelection.lapsi.arvovalikonvertteriparametrit.push(emptyArvovalikonvertteriparametri);
                }
            }

            $scope.addArvokonvertterikuvaus = function (konvertterikuvausSelection) {

                if (konvertterikuvausSelection.kuvaukset == null) {
                    konvertterikuvausSelection.kuvaukset = {tekstit: []};
                }
                var emptyKuvaus = {kieli: 'FI', teksti: ''}

                konvertterikuvausSelection.kuvaukset.tekstit.push(emptyKuvaus);

            }

            $scope.getSyoteparametriArvo = function (syoteparametrit, key) {
                var result;
                _.some(syoteparametrit, function (syoteparametri) {
                    if (syoteparametri.avain === key) {
                        result = syoteparametri.arvo;
                        return true;
                    }
                });
                return result;
            }

            $scope.getSyoteparametri = function (syoteparametrit, funktiokuvausSyoteparametri) {
                var result = _.find(syoteparametrit, function (syoteparametri) {
                    return syoteparametri.avain == funktiokuvausSyoteparametri.avain;
                });
                if (result === undefined) {
                    result = {avain: funktiokuvausSyoteparametri.avain, arvo: "", tyyppi: funktiokuvausSyoteparametri.tyyppi};
                }
                return result;
            }

            $scope.getValintaperuste = function (viitteet, indeksi) {
                var result = viitteet[indeksi];
                if (result === undefined) {
                    result = {tunniste: "", kuvaus: "", lahde: "", onPakollinen: false};
                }
                return result;
            }


            $scope.getSyoteparametriTemplate = function (syoteparametrityyppi) {
                return $scope.templateService.getSyoteparametriTemplate(syoteparametrityyppi);
            }

            $scope.konvertteriTemplate = function (konvertteriparametriSelection) {
                return $scope.templateService.getKonvertteriparametriTemplate(konvertteriparametriSelection);
            }

            $scope.removeKonvertteriParametri = function (index, konvertteriparametriSelection) {
                if (konvertteriparametriSelection == "ARVOKONVERTTERI") {
                    $scope.funktioSelection.lapsi.arvokonvertteriparametrit.splice(index, 1);
                } else {
                    $scope.funktioSelection.lapsi.arvovalikonvertteriparametrit.splice(index, 1);
                }

            }

            $scope.removeKonvertteriParametriKuvaus = function (index, konvertteriparametriSelection) {
                konvertteriparametriSelection.kuvaukset.tekstit.splice(index, 1);

            }

            $scope.getDefinedFunktioargumenttiCount = function (parent) {
                return $scope.funktioService.getDefinedFunktioargumenttiCount(parent);
            }

            $scope.changeKonvertteriparametriTypeSelection = function (konvertteriparametriSelection) {

                //tyhjennetään toinen konvertteriparametrilista tyyppiä vaihdettaessa
                if (konvertteriparametriSelection == "ARVOKONVERTTERI") {
                    $scope.funktioSelection.lapsi.arvovalikonvertteriparametrit.length = 0;
                } else {
                    $scope.funktioSelection.lapsi.arvokonvertteriparametrit.length = 0;
                }

            }

            $scope.removeFunktiokutsu = function () {
                var isNimettyFunktio = $scope.isNimettyFunktioargumentti($scope.funktioasetukset.parentFunktiokutsu);
                var isPainotettukeskiarvoChild = undefined;
                if ($scope.funktioasetukset.parentFunktiokutsu.lapsi) {
                    isPainotettukeskiarvoChild = $scope.funktioasetukset.parentFunktiokutsu.lapsi.funktionimi === 'PAINOTETTUKESKIARVO';
                } else {
                    isPainotettukeskiarvoChild = $scope.funktioasetukset.parentFunktiokutsu.funktionimi === 'PAINOTETTUKESKIARVO';
                }

                $scope.funktioasetukset.funktioSelection = undefined;
                if ($scope.isFirstChildForRoot($scope.funktioasetukset.parentFunktiokutsu)) {
                    //jos ollaan heti laskentakaavan juuren alla (laskentakaavan 'ensimmäisellä kerroksella' ei ole lapsi-wrapperia)
                    //sama myös nimetyille funktioargumenteille tai funktioargumenttitaulukkoon jää yksi null-objekti
                    $scope.funktioasetukset.parentFunktiokutsu.funktioargumentit.splice($scope.funktioasetukset.selectedFunktioIndex, 1);
                } else if (isNimettyFunktio || isPainotettukeskiarvoChild) {
                    //jos funktio on nimetty funktioargumentti, niin merkitään se undefineksi, jolloin funktioargumenttitaulukkoon jää null
                    $scope.funktioasetukset.parentFunktiokutsu.lapsi.funktioargumentit[$scope.funktioasetukset.selectedFunktioIndex] = undefined;
                } else {
                    //jos ei olla heti laskentakaavan juuren alla, niin koko slotti voidaan poistaa funktioargumenttitaulukosta
                    $scope.funktioasetukset.parentFunktiokutsu.lapsi.funktioargumentit.splice($scope.funktioasetukset.selectedFunktioIndex, 1);
                }

                $scope.funktioasetukset.parentFunktiokutsu = undefined;

            }

            $scope.removeLaskentakaavaviite = function () {
                //jos ei olla heti laskentakaavan juuren alla
                if ($scope.isFirstChildForRoot($scope.funktioasetukset.parentFunktiokutsu)) {
                    $scope.funktioasetukset.parentFunktiokutsu.funktioargumentit.splice($scope.funktioasetukset.selectedFunktioIndex, 1)
                }
                //jos ollaan heti laskentakaavan juuren alla (laskentakaavan 'ensimmäisellä kerroksella' ei ole lapsi-wrapperia)
                else {
                    $scope.funktioasetukset.parentFunktiokutsu.lapsi.funktioargumentit.splice($scope.funktioasetukset.selectedFunktioIndex, 1)
                }
                $scope.funktioSelection = undefined;
            }

            $scope.isFirstChildForRoot = function (parent) {
                return parent.lapsi ? false : true;
            }

            $scope.isFunktiokutsu = function (funktiokutsu) {
                return funktiokutsu.lapsi.tyyppi === 'LUKUARVOFUNKTIO' || funktiokutsu.lapsi.tyyppi === 'TOTUUSARVOFUNKTIO';
            }

            $scope.getFunktionimi = function (funktiokutsu) {
                return $scope.funktioService.getFunktionimi(funktiokutsu);
            }

            //onko käsiteltävä funktiokutsun lapset nimettyjä funktioargumentteja
            $scope.isNimettyFunktioargumentti = function (funktiokutsu) {
                return $scope.funktioService.isNimettyFunktioargumentti(funktiokutsu);
            }

            $scope.isPainotettukeskiarvoChild = function (funktiokutsu) {
                if (funktiokutsu) {
                    return $scope.funktioService.isPainotettukeskiarvoChild(funktiokutsu);
                } else {
                    return false;
                }
            }

            //Onko käsiteltävä parentin funktioargumentin paikka tarkoitettu nimettömälle funktiokutsulle/laskentakaavalle ja onko funktioargumentti vielä asettamatta
            $scope.isEmptyNimettyFunktioargumentti = function (parent, funktioargumenttiIndex) {
                return $scope.funktioService.isEmptyNimettyFunktioargumentti(parent, funktioargumenttiIndex);
            }

            $scope.isLukuarvoFunktioSlot = function (parent, funktioargumenttiIndex) {

                var isNimetty = $scope.isNimettyFunktioargumentti(parent);
                var funktiokuvaus = $scope.funktioService.getFunktiokuvaus(parent.lapsi.funktionimi);
                var tyyppi = isNimetty ? funktiokuvaus.funktioargumentit[funktioargumenttiIndex].tyyppi : funktiokuvaus.funktioargumentit[0].tyyppi;
                var result = tyyppi == 'LUKUARVOFUNKTIO' ? true : false;
                return result;
            }

            $scope.kaavaDragged = function (funktio, oldParent, newParent, index) {

                var kaavaBeforeDrag = Laskentapuu.laskentakaava().getData();
                var oldIndex = oldParent.funktioargumentit.indexOf(funktio);

                var func = funktio;

                newParent.addChildAt(func, index);
                newParent.init();
                oldParent.init();

                func = oldParent.removeChildFunktio(funktio);
            }

            $scope.hideFunktioMenu = function () {
                $scope.$broadcast('hideFunktioMenu');
            }

            /* called from kaavaeditor -directive when an item has been moved in kaavaeditor
             $scope.$on('kaavadrag', function (event, paramObject) {
             $scope.kaavaDragged(paramObject.draggedFunktio, paramObject.oldParentFunktio, paramObject.newParentFunktio, paramObject.index);
             });
             */

            $scope.$on('persistKaava', function () {
                
                var kaava = {
                    valintaryhmaOid: $routeParams.valintaryhmaOid,
                    hakukohdeOid: $routeParams.hakukohdeOid,
                    laskentakaava: $scope.model.laskentakaavapuu
                }

                if (!$scope.createNewKaava) {
                    $scope.funktioSelection = undefined;
                    FunktioService.validateTallennaTulosValues($scope.model.laskentakaavapuu.funktiokutsu, $scope.model.laskentakaavapuu.funktiokutsu.funktioargumentit, 0, $scope.errors);

                    if ($scope.errors.length === 0) {
                        //poistetaan laskentakaavassa olevista painotettu keskiarvo -funktiokutsuista tyhjät objektit
                        $scope.model.laskentakaavapuu.funktiokutsu.funktioargumentit = FunktioService.cleanLaskentakaavaPKObjects($scope.model.laskentakaavapuu.funktiokutsu.funktioargumentit);
                        KaavaValidointi.post({}, $scope.model.laskentakaavapuu, function (result) {
                            $scope.model.laskentakaavapuu.$save({oid: $scope.model.laskentakaavapuu.id}, function (result) {
                                $scope.model.laskentakaavapuu.funktiokutsu.funktioargumentit = FunktioService.addPKObjects($scope.model.laskentakaavapuu.funktiokutsu.funktioargumentit);
                                $scope.saved = true;
                            }, function (error) {
                                $scope.errors.push(error);
                            });
                        });
                    }
                } else {
                    FunktioService.validateTallennaTulosValues(kaava.laskentakaava.funktioargumentit, $scope.errors);
                    if ($scope.errors.length === 0) {
                        Laskentakaava.insert({}, kaava, function (result) {
                            $scope.createNewKaava = false;
                            $scope.saved = true;
                        });
                    }
                }
            });
        }]);






