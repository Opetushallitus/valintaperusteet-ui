
angular.module('valintaperusteet')

    .factory('Treemodel', ['$resource', 'ValintaperusteetPuu', 'AuthService', 'HakuModel',
        function ($resource, ValintaperusteetPuu, AuthService, HakuModel) {
    "use strict";

    //and return interface for manipulating the model
    var modelInterface = {
        //models
        valintaperusteList: [],
        hakukohteet: [],
        search: {   q: null,
            haku: null,
            vainValmiitJaJulkaistut: true,
            vainHakukohteitaSisaltavatRyhmat: true,
            vainHakukohteet: null,
            valintaryhmatAuki: null
        },
        tilasto: {
            valintaryhmia: 0,
            hakukohteita: 0,
            valintaryhmiaNakyvissa: 0,
            hakukohteitaNakyvissa: 0
        },
        //methods
        isFile: function (data) {
            return data.hakukohdeViitteet === 0 && data.alavalintaryhmat === 0;
        },
        isHakukohde: function (data) {
            return data.tyyppi === 'HAKUKOHDE';
        },
        noNesting: function (data) {
            if (this.isHakukohde(data)) {
                return "noNesting";
            } else {
                return "";
            }
        },
        isExpanded: function (data) {
            if (this.isFile(data)) { // force file always open!
                return true;
            }
            return data.isVisible;
        },
        isCollapsed: function (data) {
            return !this.isExpanded(data);
        },
        getTemplate: function (data) {
            if (data) {
                if (data.tyyppi === 'VALINTARYHMA') {
                    return "valintaryhma_node.html";
                } else {
                    return "hakukohde_leaf.html";
                }
            }
            return "";
        },
        refresh: function () {
            return this.refreshHaku(HakuModel.haku);
        },
        refreshHaku: function (haku) {
            var kohdejoukko, tila;

            if (haku.kohdejoukkoUri) {
                kohdejoukko = haku.kohdejoukkoUri.split("#")[0];
            }
            if (this.search.vainValmiitJaJulkaistut) {
                tila = ["VALMIS", "JULKAISTU"];
            }

            ValintaperusteetPuu.get({
                q: this.search.q,
                hakuOid: haku.oid,
                tila: tila,
                kohdejoukko: kohdejoukko
            }, function (result) {
                modelInterface.valintaperusteList = result;
                modelInterface.update();
            });
        },
        expandTree: function () {
            modelInterface.forEachValintaryhma(function (item) {
                item.isVisible = true;
            });
        },
        forEachValintaryhma: function (f) {
            var recursion = function (item, f) {
                f(item);
                if (item.alavalintaryhmat) {
                    for (var i = 0; i < item.alavalintaryhmat.length; i++) {
                        recursion(item.alavalintaryhmat[i], f);
                    }
                }
            };
            for (var i = 0; i < modelInterface.valintaperusteList.length; i++) {
                recursion(modelInterface.valintaperusteList[i], f);
            }
        },
        getHakukohde: function (oid) {
            for (var i = 0; i < modelInterface.hakukohteet.length; i++) {
                if (oid === modelInterface.hakukohteet[i].oid) {
                    return modelInterface.hakukohteet[i];
                }
            }
        },
        getValintaryhma: function (oid) {
            var valintaryhma = null;
            modelInterface.forEachValintaryhma(function (item) {
                if (item.oid === oid) {
                    valintaryhma = item;
                }
            });
            return valintaryhma;
        },
        expandNode: function (node) {
            if ((node.alavalintaryhmat && node.alavalintaryhmat.length > 0) ||
                (node.hakukohdeViitteet && node.hakukohdeViitteet.length > 0 )) {
                if (node.isVisible != true) {
                    node.isVisible = true;

                    // aukaisee alitason, jos ei ole liikaa tavaraa
                    var iter = function (ala) {
                        ala.forEach(function (ala) {
                            if (!ala.alavalintaryhmat || ala.alavalintaryhmat.length < 4) {
                                ala.isVisible = true;
                                iter(ala.alavalintaryhmat);
                            }
                        });
                    };
                    if (node.alavalintaryhmat.length < 4) {
                        iter(node.alavalintaryhmat);
                    }


                } else {
                    node.isVisible = false;
                }
            }
        },
        update: function () {
            var list = modelInterface.valintaperusteList;
            modelInterface.valintaperusteList = [];
            modelInterface.hakukohteet = [];
            modelInterface.tilasto.valintaryhmia = 0;
            modelInterface.tilasto.hakukohteita = 0;
            modelInterface.tilasto.valintaryhmiaNakyvissa = 0;
            modelInterface.tilasto.hakukohteitaNakyvissa = 0;


            var recursion = function (item, previousItem) {
                if (previousItem !== null) {
                    item.ylavalintaryhma = previousItem;
                }
                item.getParents = function () {
                    i = this.ylavalintaryhma;
                    var arr = [];
                    while (i !== null) {
                        arr.unshift(i);
                        i = i.ylavalintaryhma;
                    }
                    return arr;
                };

                if (item.tyyppi === 'VALINTARYHMA') {
                    modelInterface.tilasto.valintaryhmia++;
                    AuthService.getOrganizations("APP_VALINTAPERUSTEET").then(function (organisations) {
                        item.access = false;
                        organisations.forEach(function (org) {
                            if (item.organisaatiot.length > 0) {
                                item.organisaatiot.forEach(function (org2) {

                                    if (org2.parentOidPath !== null && org2.parentOidPath.indexOf(org) > -1) {
                                        item.access = true;
                                    }
                                });
                            } else {
                                item.access = true;
                            }
                        });
                    });
                }
                if (item.tyyppi === 'HAKUKOHDE') {
                    modelInterface.tilasto.hakukohteita++;
                    modelInterface.hakukohteet.push(item);
                }
                if (item.alavalintaryhmat) {
                    for (var i = 0; i < item.alavalintaryhmat.length; i++) {
                        recursion(item.alavalintaryhmat[i], item);
                    }
                }
                if (item.hakukohdeViitteet) {
                    for (var i = 0; i < item.hakukohdeViitteet.length; i++) {
                        recursion(item.hakukohdeViitteet[i], item);
                    }
                }
            };

            for (var i = 0; i < list.length; i++) {
                recursion(list[i]);
            }

            modelInterface.hakukohteet.forEach(function (hakukohde) {
                hakukohde.sisaltaaHakukohteita = true;
                var parent = hakukohde.ylavalintaryhma;
                while (typeof parent !== 'undefined' && parent !== null) {
                    parent.sisaltaaHakukohteita = true;
                    parent = parent.ylavalintaryhma;
                }
            });

            modelInterface.valintaperusteList = list;
        }

    };
    modelInterface.refresh();
    return modelInterface;
}])



    .controller('ValintaryhmaHakukohdeTreeController', ['$scope', '$q', '_', 'Treemodel', 'HakukohdeSiirra', 'HakuModel', 'UserModel',
        function ($scope, $q, _, Treemodel, HakukohdeSiirra, HakuModel, UserModel) {
            "use strict";

            $scope.predicate = 'nimi';
            $scope.domain = Treemodel;

            $scope.hakuModel = HakuModel;
            $scope.$watch('hakuModel.hakuOid', function () {
                $scope.domain.refresh();
            });

            $scope.userModel = UserModel;
            $scope.userModel.refreshIfNeeded();

            $scope.hakukohteetListingLimit = 100;
            $scope.lazyLoading = function () {
                $scope.hakukohteetListingLimit += 100;
            };

            $scope.move = function (index, hakukohdeOid, valintaryhmaOid) {
                HakukohdeSiirra.siirra({hakukohdeOid: hakukohdeOid}, valintaryhmaOid, function (result) {
                }, function () {
                    // show error
                });
            };

            $scope.addClass = function (cssClass, ehto) {
                if (ehto) {
                    return cssClass;
                } else {
                    return "";
                }
            };
                
            $scope.showNode = function (node) {
                if(node.tyyppi === 'VALINTARYHMA') {
                    return !(!node.sisaltaaHakukohteita && $scope.domain.search.vainHakukohteitaSisaltavatRyhmat); // && $scope.userOrganizationsModel.isKKUser;
                } else {
                    return !(!node.sisaltaaHakukohteita && $scope.domain.search.vainHakukohteitaSisaltavatRyhmat);
                }


                //var kkNode = $scope.hasKorkeakouluOrganization(node.organisaatiot);

            };

            $scope.expandNode = function (node) {
                $scope.domain.expandNode(node);

            };
            
            $scope.updateDomain = function () {
                Treemodel.refresh();
            };

            $scope.expandTree = function () {
                Treemodel.expandTree();
            };

            $scope.hasKorkeakouluOrganization = function (organisaatioArray) {
                var korkeakouluTunnisteet = ['_41', '_42', '_43']; // 41 == AMK, 42 = Yliopistot, 43 = Sotilaskorkeakoulut
                _.forEach(organisaatioArray, function (organisaatioData) {
                    _.forEach(korkeakouluTunnisteet, function (item) {
                        if (organisaatioData.oppilaitosTyyppiUri.indexOf(item) !== -1) {
                            $scope.hasKorkeakouluOrganization = true;
                        } else {
                            $scope.hasOtherThanKKOrganization = true;
                        }
                    });
                });
            };

        }]);