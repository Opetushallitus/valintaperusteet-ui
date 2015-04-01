angular.module('valintaperusteet').controller('LaskentakaavaController',
    ['$scope', '_', '$location', '$routeParams', '$timeout', 'KaavaValidointi', 'Laskentakaava', 'LaskentakaavaLista',
        'TemplateService', 'FunktioService', 'Valintaperusteviitetyypit', 'Arvokonvertterikuvauskielet',
        'FunktioNimiService', 'FunktioFactory', 'KaavaValidation', 'KaavaVirheTyypit', 'ErrorService', 'FunktiokuvausService', 'FunktiokutsuKaareService', '$modal',
        function ($scope, _, $location, $routeParams, $timeout, KaavaValidointi, Laskentakaava, LaskentakaavaLista,
                  TemplateService, FunktioService, Valintaperusteviitetyypit, Arvokonvertterikuvauskielet, FunktioNimiService,
                  FunktioFactory, KaavaValidation, KaavaVirheTyypit, ErrorService, FunktiokuvausService, FunktiokutsuKaareService, $modal) {
            'use strict';
            //servicet laskentakaavapuun piirtämiseen
            $scope.templateService = TemplateService;
            $scope.funktioService = FunktioService;
            $scope.funktionimiService = FunktioNimiService;
            $scope.funktioFactory = FunktioFactory;
            $scope.valintaperusteviitetyypit = Valintaperusteviitetyypit;
            $scope.arvokonvertterikuvauskielet = Arvokonvertterikuvauskielet;

            $scope.model = {};
            $scope.openAll = false;
            $scope.hideKaavaBasics = true;

            //Pidetään laskentakaaviitevalinta objektissa. Laskentakaavaviitettä kaavaan liitettäessä radio-inputit iteroidaan ng-repeatissa,
            //joka luo uuden skoopin joka itemille, jolloin laskentakaavaviitteen tallentaminen  suoraan skoopissa olevaan muuttujaan ei toimi oikein
            $scope.laskentakaavaviite = { selection: null };

            //Haetaan laskentakaavan data
            if ($routeParams.laskentakaavaOid) {
                $scope.laskentakaavaOid = $routeParams.laskentakaavaOid;
                Laskentakaava.get({oid: $scope.laskentakaavaOid}, function (result) {
                    $scope.model.laskentakaavapuu = result;

                    //laskentakaavan painotettu keskiarvo -funktiokutsuihin lisätään tyhjät objektit, jotta niihin pystytään lisäämään funktioargumentteja
                    FunktioService.addPKObjects($scope.model.laskentakaavapuu.funktiokutsu.funktioargumentit);

                    //käydään rekursiivisesti laskentakaavapuu läpi ja lisätään puuttuvat syöteparametriobjektit
                    FunktioService.addMissingSyoteparametrit($scope.model.laskentakaavapuu.funktiokutsu.funktioargumentit[0]);

                });
            }

            $scope.reloadLaskentakaavaLista = function () {
                if ($routeParams.id) {
                    LaskentakaavaLista.refresh($routeParams.id, null);
                } else if ($routeParams.hakukohdeOid) {
                    LaskentakaavaLista.refresh(null, $routeParams.hakukohdeOid);
                } else {
                    LaskentakaavaLista.refresh(null, null);
                }
            };

            $scope.laskentakaavalista = LaskentakaavaLista;
            $scope.reloadLaskentakaavaLista();

            // leikepöytä funktiokutsujen kopioimiseen ja siirtämiseen
            $scope.clipboard = undefined;

            // Valitun funktio/laskentakaavaviitteen tietoja
            $scope.funktioasetukset = {
                selectedFunktioIndex: undefined,
                konvertteriType: '', //mikä konvertterityyppi on valittuna
                parentFunktiokutsu: undefined,
                showNewFunktioList: false
            };

            $scope.setRootSelection = function (funktiokutsu) {
                $scope.funktioSelection = funktiokutsu;
                $scope.hideKaavaBasics = !$scope.hideKaavaBasics;
                $scope.$broadcast('editKaavaMetadata');
            };

            $scope.showFunktiokutsuEdit = function (parent, childIndex, isAlikaava, hasParentAlikaava) {
                var funktioargumentit = FunktioService.getFunktioargumentit(parent);
                var funktiokutsu = funktioargumentit[childIndex];
                var isFunktiokutsu = FunktioService.isFunktiokutsu(funktiokutsu);
                $scope.setFunktioSelection(funktiokutsu, isFunktiokutsu, parent, childIndex, isAlikaava, hasParentAlikaava);
                $scope.showFunktiokutsuAsetukset(isFunktiokutsu);
            };

            $scope.showFunktiokutsuAsetukset = function (isFunktiokutsu) {
                if (isFunktiokutsu) {
                    $scope.$broadcast('showFunktiokutsuAsetukset');
                } else {
                    $scope.$broadcast('showLaskentakaavaviiteAsetukset');
                }
            };

            // funktio = valittu funktiokutsu tai laskentakaavaviite
            // isFunktiokutsu = onko funktio-parametri funktiokutsu vai laskentakavaaviite
            // parentFunktiokutsu = parentFunktiokutsu tai laskentakaavan juuri
            // index = monesko funktio-parametri on funktioargumenttilistassa, juurifunktiokutsulla ei ole indeksiä
            $scope.setFunktioSelection = function (funktio, isFunktiokutsu, parentFunktiokutsu, index, isAlikaava, hasParentAlikaava) {
                $scope.funktioasetukset.parentFunktiokutsu = parentFunktiokutsu;

                $scope.funktioasetukset.selectedFunktioIndex = index;
                $scope.funktioSelection = funktio;
                $scope.alikaavaValues = {};
                $scope.alikaavaValues.isAlikaava = isAlikaava;
                $scope.alikaavaValues.hasParentAlikaava = hasParentAlikaava;

                if (isFunktiokutsu) {
                    $scope.funktiokuvausForSelection = FunktiokuvausService.getFunktiokuvaus(funktio.lapsi.funktionimi);
                }

                //päätellään funktiolle esivalittu konvertteriparametrityyppi, jos funktiolla on konvertteriparametreja
                $scope.setKonvertteriType();

                $scope.laskentakaavaviite.selection = funktio || undefined;
                $scope.saved = false;
                $scope.hideKaavaBasics = true;
            };

            $scope.removeFunktioSelection = function () {
                $scope.funktioasetukset.konvertteriType = '';
                $scope.saved = false;
                $scope.alikaavaValues = {};
                $scope.funktioSelection = undefined;
            };

            $scope.setLaskentakaavaviite = function (kaava) {
                //lähetetään skooppihierarkiassa alaspäin viesti, jossa kulkee uuden kaavan id ja vanhan kaavan id.
                $scope.$broadcast('changeAlikaava', kaava.id, $scope.funktioasetukset.parentFunktiokutsu.lapsi.funktioargumentit[$scope.funktioasetukset.selectedFunktioIndex].id);
                $scope.funktioasetukset.parentFunktiokutsu.lapsi.funktioargumentit[$scope.funktioasetukset.selectedFunktioIndex] = $scope.funktioFactory.createLaskentakaavaviite(kaava);
            };

            $scope.toggleAll = function () {
                $scope.openAll = !$scope.openAll;
                $scope.model.laskentakaavapuu.funktiokutsu.funktioargumentit.forEach(function (item) {
                    item.open = $scope.openAll;
                    toggleAllLower(item.lapsi);
                });

                function toggleAllLower(item) {
                    item.funktioargumentit.forEach(function (item) {
                        item.open = $scope.openAll;
                        toggleAllLower(item.lapsi);
                    });
                }
            };

            $scope.addLaskentakaavaviite = function (parent, index) {
                $scope.funktioasetukset.parentFunktiokutsu = parent;
                $scope.funktioasetukset.selectedFunktioIndex = index;

                $scope.funktioasetukset.parentFunktiokutsu.lapsi.funktioargumentit[$scope.funktioasetukset.selectedFunktioIndex] = $scope.funktioFactory.createLaskentakaavaviite();
                $scope.laskentakaavaviite.selection = undefined;

                $scope.alikaavaValues = {};
            };

            $scope.addFunktio = function (parent, funktionimi, index) {
                var isDirectChildForRoot = $scope.isFirstChildForRoot(parent);
                var createdFunktio = $scope.funktioFactory.createFunktioInstance(parent, funktionimi, isDirectChildForRoot);

                if (isDirectChildForRoot) {
                    parent.funktioargumentit[index] = createdFunktio;
                } else {
                    parent.lapsi.funktioargumentit[index] = createdFunktio;
                }

                $scope.setFunktioSelection(createdFunktio, true, parent, index, undefined, undefined);
                $scope.showFunktiokutsuAsetukset(true);
                //lisätään uusi pari funktioargumentteja, kun edelliset on täytetty
                if ($scope.getFunktionimi(parent) === 'PAINOTETTUKESKIARVO') {
                    var argCount = $scope.getDefinedFunktioargumenttiCount(parent);
                    var argListLength = parent.lapsi.funktioargumentit.length;

                    //tarkistetaan, että funktioargumentteja on parillinen määrä ja että kaksi viimeistä funktioargumenttislottia on täytetty, jottei lisätä ylimääräisiä slotteja
                    if (argCount % 2 === 0 && !(_.isEmpty(parent.lapsi.funktioargumentit[argListLength - 1])) && !(_.isEmpty(parent.lapsi.funktioargumentit[argCount - 2]))) {
                        parent.lapsi.funktioargumentit.push({});
                        parent.lapsi.funktioargumentit.push({});
                    }
                }
            };

            // index on indeksi nyt käsiteltävälle funktioargumentille (vain nimetyille funktioargumenteille)
            $scope.findFunktioSlotIndex = function (parent, index) {
                var isNimetty = $scope.isNimettyFunktioargumentti(parent);
                var resultIndex = undefined;
                var isPainotettukeskiarvoChild = FunktioService.isPainotettukeskiarvo(parent);
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
            };

            $scope.noFunktioarguments = function (funktioargumentit) {
                return funktioargumentit.length === 1 && _.isEmpty(funktioargumentit[0]);
            };

            // Kaikissa tapauksissa funktiokutsuilla ja laskentakaavaviitteillä on parent, mutta juuresta seuraavalla tasolla ei ole parent.lapsi -muuttujaa,
            // jolloin sama, tarvittava tieto saadaan suoraan parent-muuttujasta
            $scope.getParent = function (parent) {
                return parent.lapsi || parent;
            };

            $scope.setKonvertteriType = function () {
                if ($scope.funktioSelection.lapsi.arvokonvertteriparametrit && $scope.funktioSelection.lapsi.arvovalikonvertteriparametrit.length === 0) {
                    $scope.funktioasetukset.konvertteriType = 'ARVOKONVERTTERI';
                } else if ($scope.funktioSelection.lapsi.arvovalikonvertteriparametrit && $scope.funktioSelection.lapsi.arvokonvertteriparametrit.length === 0) {
                    $scope.funktioasetukset.konvertteriType = 'ARVOVALIKONVERTTERI';
                }
            };

            $scope.addFunktiokonvertteriparametri = function () {

                var emptyArvokonvertteriparametri = {paluuarvo: '', hylkaysperuste: false, arvo: ''};
                var emptyArvovalikonvertteriparametri = {paluuarvo: '', palautaHaettuArvo: false, minValue: '', maxValue: '', hylkaysperuste: false};

                if ($scope.funktioasetukset.konvertteriType === "ARVOKONVERTTERI") {
                    $scope.funktioSelection.lapsi.arvokonvertteriparametrit.push(emptyArvokonvertteriparametri);
                } else {
                    $scope.funktioSelection.lapsi.arvovalikonvertteriparametrit.push(emptyArvovalikonvertteriparametri);
                }
            };

            $scope.addArvokonvertterikuvaus = function (konvertterikuvausSelection) {

                if (!konvertterikuvausSelection.kuvaukset) {
                    konvertterikuvausSelection.kuvaukset = {tekstit: []};
                }
                var emptyKuvaus = {kieli: 'FI', teksti: ''};

                konvertterikuvausSelection.kuvaukset.tekstit.push(emptyKuvaus);

            };

            $scope.addValintaperusteviitekuvaus = function (viiteselection) {

                if (!viiteselection.kuvaukset) {
                    viiteselection.kuvaukset = {tekstit: []};
                }

                var emptyKuvaus = {kieli: 'FI', teksti: ''};

                viiteselection.kuvaukset.tekstit.push(emptyKuvaus);

            };

            $scope.getSyoteparametriArvo = function (syoteparametrit, key) {
                var result;
                _.some(syoteparametrit, function (syoteparametri) {
                    if (syoteparametri.avain === key) {
                        result = syoteparametri.arvo;
                        return true;
                    }
                });
                return result;
            };

            $scope.getSyoteparametri = function (syoteparametrit, funktiokuvausSyoteparametri) {
                var result = _.find(syoteparametrit, function (syoteparametri) {
                    return syoteparametri.avain === funktiokuvausSyoteparametri.avain;
                });
                if (result === undefined) {
                    result = {avain: funktiokuvausSyoteparametri.avain, arvo: "", tyyppi: funktiokuvausSyoteparametri.tyyppi};
                }
                return result;
            };

            $scope.getValintaperuste = function (viitteet, indeksi) {
                var result = viitteet[indeksi];
                if (result === undefined) {
                    result = {tunniste: "", kuvaus: "", lahde: "", onPakollinen: false, kuvaukset: {tekstit: []}, vaatiiOsallistumisen: true, syotettavissaKaikille: true};
                } else if (_.size(result) == 1 || _.isEmpty(result)) {
                    result.tunniste = "";
                    result.kuvaus = "";
                    result.lahde = "";
                    result.onPakollinen = false;
                    result.kuvaukset = {tekstit: []};
                    result.vaatiiOsallistumisen = true;
                    result.syotettavissaKaikille = true;
                }

                return result;
            };

            $scope.getSyoteparametriTemplate = function (syoteparametrityyppi) {
                return TemplateService.getSyoteparametriTemplate(syoteparametrityyppi);
            };

            $scope.konvertteriTemplate = function (konvertteriparametriSelection) {
                return TemplateService.getKonvertteriparametriTemplate(konvertteriparametriSelection);
            };

            $scope.removeKonvertteriParametri = function (index, konvertteriparametriSelection) {
                if (konvertteriparametriSelection === "ARVOKONVERTTERI") {
                    $scope.funktioSelection.lapsi.arvokonvertteriparametrit.splice(index, 1);
                } else {
                    $scope.funktioSelection.lapsi.arvovalikonvertteriparametrit.splice(index, 1);
                }

            };

            $scope.removeKonvertteriParametriKuvaus = function (index, konvertteriparametriSelection) {
                konvertteriparametriSelection.kuvaukset.tekstit.splice(index, 1);
            };

            $scope.removeValintaperusteviiteKuvaus = function (index, selection) {
                selection.kuvaukset.tekstit.splice(index, 1);
            };

            $scope.getDefinedFunktioargumenttiCount = function (parent) {
                return FunktioService.getDefinedFunktioargumenttiCount(parent);
            };

            $scope.changeKonvertteriparametriTypeSelection = function (konvertteriparametriSelection) {

                //tyhjennetään toinen konvertteriparametrilista tyyppiä vaihdettaessa
                if (konvertteriparametriSelection === "ARVOKONVERTTERI") {
                    $scope.funktioSelection.lapsi.arvovalikonvertteriparametrit.length = 0;
                } else {
                    $scope.funktioSelection.lapsi.arvokonvertteriparametrit.length = 0;
                }

            };

            $scope.removeFunktiokutsu = function (funktiokutsu, isFunktiokutsu, parent, childIndex, isAlikaava, hasParentAlikaava) {
                $scope.setFunktioSelection(funktiokutsu, isFunktiokutsu, parent, childIndex, isAlikaava, hasParentAlikaava);
                var isNimettyFunktio = $scope.isNimettyFunktioargumentti($scope.funktioasetukset.parentFunktiokutsu);
                var isPainotettukeskiarvoChild = undefined;
                if ($scope.funktioasetukset.parentFunktiokutsu.lapsi) {
                    isPainotettukeskiarvoChild = $scope.funktioasetukset.parentFunktiokutsu.lapsi.funktionimi === 'PAINOTETTUKESKIARVO';
                } else {
                    isPainotettukeskiarvoChild = $scope.funktioasetukset.parentFunktiokutsu.funktionimi === 'PAINOTETTUKESKIARVO';
                }

                $scope.alikaavaValues = {};
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
                KaavaValidation.cleanExtraPKArgumenttiSlots($scope.funktioasetukset.parentFunktiokutsu);
                $scope.funktioasetukset.parentFunktiokutsu = undefined;

            };

            $scope.removeLaskentakaavaviite = function (funktiokutsu, isFunktiokutsu, parent, childIndex, isAlikaava, hasParentAlikaava) {

                //jos ei olla heti laskentakaavan juuren alla
                if ($scope.isFirstChildForRoot(parent)) {
                    parent.funktioargumentit.splice(childIndex, 1);
                }
                //jos ollaan heti laskentakaavan juuren alla (laskentakaavan 'ensimmäisellä kerroksella' ei ole lapsi-wrapperia)
                else {
                    parent.lapsi.funktioargumentit.splice(childIndex, 1);
                }
                $scope.funktioSelection = undefined;
                $scope.alikaavaValues = {};
            };

            $scope.isFirstChildForRoot = function (funktiokutsu) {
                return FunktioService.isRootFunktiokutsu(funktiokutsu);
            };
            
            $scope.setClipboard = function (funktiokutsu) {
                $scope.clipboard = funktiokutsu;
            };
            
            $scope.copyToClipboard = function (funktiokutsu) {
                $scope.setClipboard(_.cloneDeep(funktiokutsu));
            };

            $scope.cutToClipboard = function (funktiokutsu, isFunktiokutsu, parent, childIndex, isAlikaava, hasParentAlikaava) {
                $scope.setFunktioSelection(funktiokutsu, isFunktiokutsu, parent, childIndex, isAlikaava, hasParentAlikaava);
                $scope.setClipboard(funktiokutsu);
                FunktioService.isFunktiokutsu(funktiokutsu) ? $scope.removeFunktiokutsu(funktiokutsu, isFunktiokutsu, parent, childIndex, isAlikaava, hasParentAlikaava) : $scope.removeLaskentakaavaviite(funktiokutsu, isFunktiokutsu, parent, childIndex, isAlikaava, hasParentAlikaava);
            };

            $scope.clearClipboard = function () {
                $scope.clipboard = undefined;
            };

            $scope.pasteFunktiokutsu = function (parent, childIndex) {
                parent.lapsi.funktioargumentit[childIndex] = $scope.clipboard;
                $scope.clearClipboard();
            };

            $scope.getValintaperusteviitetyyppiText = function (valintaperusteviite) {
                var text = "";
                _.some($scope.valintaperusteviitetyypit, function (item) {
                    if (item.key === valintaperusteviite.lahde) {
                        text = item.text;
                        return true;
                    }
                });
                return text;
            };

            $scope.hasFunktioargumentit = function (parent, childIndex) {
                return FunktioService.hasFunktioargumentit(parent, childIndex);
            };

            $scope.showFunktiokutsunKaarintaModal = function (funktiokutsu, isFunktiokutsu, parent, childIndex, isAlikaava, hasParentAlikaava) {
                $scope.setFunktioSelection(funktiokutsu, isFunktiokutsu, parent, childIndex, isAlikaava, hasParentAlikaava);
                FunktiokutsuKaareService.setFunktioKaareLista(FunktioService.getFunktiokutsuTyyppi($scope.funktioSelection));
                var modalInstance = $modal.open({
                    templateUrl: 'laskentakaavat/laskentakaavaeditori/kaariminen/funktiokutsunkaariminen.html',
                    controller: 'FunktiokutsunKaariminenController',
                    resolve: {
                        funktioasetukset: function() { return $scope.funktioasetukset; }
                    }
                });
            };

            $scope.valintaperusteviiteDefined = function (valintaperusteviite) {
                return valintaperusteviite.tunniste || valintaperusteviite.kuvaus || !(_.isEmpty($scope.getValintaperusteviitetyyppiText(valintaperusteviite)));
            };

            $scope.isFunktiokutsu = function (funktiokutsu) {
                return funktiokutsu.lapsi.tyyppi === 'LUKUARVOFUNKTIO' || funktiokutsu.lapsi.tyyppi === 'TOTUUSARVOFUNKTIO';
            };

            $scope.getFunktionimi = function (funktiokutsu) {
                return $scope.funktioService.getFunktionimi(funktiokutsu);
            };

            //onko käsiteltävä funktiokutsun lapset nimettyjä funktioargumentteja
            $scope.isNimettyFunktioargumentti = function (funktiokutsu) {
                return $scope.funktioService.isNimettyFunktioargumentti(funktiokutsu);
            };

            $scope.isPainotettukeskiarvoChild = function (funktiokutsu) {
                if (funktiokutsu) {
                    return FunktioService.isPainotettukeskiarvo(funktiokutsu);
                } else {
                    return false;
                }
            };

            //Onko käsiteltävä parentin funktioargumentin paikka tarkoitettu nimettömälle funktiokutsulle/laskentakaavalle ja onko funktioargumentti vielä asettamatta
            $scope.isEmptyNimettyFunktioargumentti = function (parent, funktioargumenttiIndex) {
                return $scope.funktioService.isEmptyNimettyFunktioargumentti(parent, funktioargumenttiIndex);
            };

            $scope.isLukuarvoFunktioSlot = function (parent, funktioargumenttiIndex) {
                return $scope.funktioService.isLukuarvoFunktioSlot(parent, funktioargumenttiIndex);
            };


            $scope.hideFunktioMenu = function () {
                $scope.$broadcast('hideFunktioMenu');
            };

            $scope.editLaskentakaavaviite = function (valintaryhmaOid, laskentakaavaOid) {
                $location.path('/valintaryhma' + valintaryhmaOid + '/laskentakaavalista/laskentakaava/' + laskentakaavaOid);
            };

            $scope.editLaskentakaava = function () {
                $scope.$broadcast('showLaskentakaavaAsetukset')
            };

            $scope.persistNewKaava = function () {
                var kaava = {
                    valintaryhmaOid: $routeParams.id,
                    hakukohdeOid: $routeParams.hakukohdeOid,
                    laskentakaava: $scope.model.laskentakaavapuu
                };

                ErrorService.clearErrors();

                KaavaValidation.validateTree($scope.model.laskentakaavapuu.funktiokutsu);
                kaava.laskentakaava.funktiokutsu.funktioargumentit = FunktioService.cleanLaskentakaavaPKObjects(kaava.laskentakaava.funktiokutsu.funktioargumentit);

                if (ErrorService.noErrors()) {
                    Laskentakaava.insert({}, kaava, function (result) {
                        $scope.createNewKaava = false;
                        $scope.saved = true;

                        if (!$routeParams.laskentakaavaOid) {
                            $location.path($location.path() + result.id);
                        }

                    }, function (error) {
                        ErrorService.addError({
                            tyyppi: KaavaVirheTyypit.TAUSTAPALVELU
                        });
                    });
                }
            };

            $scope.persist = function () {

                var urlEnd = _.reduce(_.last($location.path(), 14), function (result, current) {
                    return result + current;
                }, "");

                ErrorService.clearErrors();
                $scope.funktioSelection = undefined;
                $scope.alikaavaValues = {};

                KaavaValidation.validateTree($scope.model.laskentakaavapuu.funktiokutsu);
                if (ErrorService.noErrors()) {
                    //poistetaan laskentakaavassa olevista painotettu keskiarvo -funktiokutsuista tyhjät objektit
                    $scope.model.laskentakaavapuu.funktiokutsu.funktioargumentit = FunktioService.cleanLaskentakaavaPKObjects($scope.model.laskentakaavapuu.funktiokutsu.funktioargumentit);

                    $scope.model.laskentakaavapuu.$save({oid: $scope.model.laskentakaavapuu.id}, function (result) {
                            $scope.model.laskentakaavapuu.funktiokutsu.funktioargumentit = FunktioService.addPKObjects($scope.model.laskentakaavapuu.funktiokutsu.funktioargumentit);
                            $scope.saved = true;

                            if (urlEnd === 'laskentakaava/') {
                                $location.path($location.path() + result.id);
                            }

                        },
                        function (error) {

                            ErrorService.addError({
                                tyyppi: KaavaVirheTyypit.TAUSTAPALVELU
                            });
                        });
                }
            };

            $scope.$on('newkaava', function () {
                $scope.model.laskentakaavapuu = $scope.$parent.$parent.newKaavaTemplate;
            });


            $scope.funktiokutsuSavedAsLaskentakaava = function (savedKaava) {
                $scope.removeFunktioSelection();
                $scope.reloadLaskentakaavaLista();
                $scope.funktioasetukset.parentFunktiokutsu.lapsi.funktioargumentit[$scope.funktioasetukset.selectedFunktioIndex] = savedKaava;
                $scope.persist();
            };

            $scope.$on('persistKaava', function () {
                $scope.persist();
            });

            $scope.$on('persistNewKaava', function () {
                $scope.persistNewKaava();
            });

        }]);