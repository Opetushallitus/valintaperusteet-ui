

angular.module('valintaperusteet')

    .factory('ValintatapajonoModel', ['$q', 'Valintatapajono', 'ValinnanvaiheValintatapajono', 'ValintatapajonoJarjestyskriteeri',
        'Laskentakaava', 'Jarjestyskriteeri', 'JarjestyskriteeriJarjesta', 'ValintatapajonoHakijaryhma', 'HakukohdeHakijaryhma',
        'ValintaryhmaHakijaryhma', 'HakijaryhmaValintatapajono', 'ValintatapajonoValmisSijoiteltavaksi', '$modal', 'Ilmoitus',
    function ($q, Valintatapajono, ValinnanvaiheValintatapajono, ValintatapajonoJarjestyskriteeri, Laskentakaava,
              Jarjestyskriteeri, JarjestyskriteeriJarjesta, ValintatapajonoHakijaryhma, HakukohdeHakijaryhma,
              ValintaryhmaHakijaryhma, HakijaryhmaValintatapajono, ValintatapajonoValmisSijoiteltavaksi, $modal, Ilmoitus) {
    "use strict";

    var model = new function () {
        this.valintatapajono = {};
        this.jarjestyskriteerit = [];
        this.hakijaryhmat = [];
        this.jonot = [];

        this.refresh = function (oid, valinnanVaiheOid) {

            ValinnanvaiheValintatapajono.get({parentOid: valinnanVaiheOid},
                function (result) {
                    model.jonot = _.filter(result, function (jono) {
                        return (jono.oid != oid && jono.siirretaanSijoitteluun)
                    });
                }
            );

            ValintatapajonoValmisSijoiteltavaksi.get({oid: oid}, function(result) {
               model.valmisSijoiteltavaksi = !!result.value;
            });

            Valintatapajono.get({oid: oid}, function (result) {
                model.valintatapajono = result;
                model.valintatapajono.rajattu = model.valintatapajono.varasijat > 0;
                model.valintatapajono.alkaenRajattu = !!model.valintatapajono.varasijojaKaytetaanAlkaen;
                model.valintatapajono.astiRajattu = !!model.valintatapajono.varasijojaTaytetaanAsti;
                if(model.valintatapajono.varasijojaTaytetaanAsti) {
                    model.valintatapajono.varasijojaTaytetaanAsti = new Date(model.valintatapajono.varasijojaTaytetaanAsti);
                } 

                if(model.valintatapajono.varasijojaKaytetaanAlkaen) {
                    model.valintatapajono.varasijojaKaytetaanAlkaen = new Date(model.valintatapajono.varasijojaKaytetaanAlkaen);
                }
                model.valintatapajono.siirretaanSijoitteluun = !!model.valintatapajono.siirretaanSijoitteluun;
                model.valintatapajono.kaytetaanValintalaskentaa = !!model.valintatapajono.kaytetaanValintalaskentaa;
                model.valintatapajono.kaikkiEhdonTayttavatHyvaksytaan = !!model.valintatapajono.kaikkiEhdonTayttavatHyvaksytaan;
                model.valintatapajono.poistetaankoHylatyt = !!model.valintatapajono.poistetaankoHylatyt;
                model.valintatapajono.valisijoittelu = !!model.valintatapajono.valisijoittelu;
                model.valintatapajono.automaattinenLaskentaanSiirto = !!model.valintatapajono.automaattinenLaskentaanSiirto;
            });

            ValintatapajonoHakijaryhma.get({oid: oid}, function (result) {
                model.hakijaryhmat = result;
            });

            this.refreshJK(oid);
        };

        this.refreshIfNeeded = function (oid, valintaryhmaOid, hakukohdeOid, valinnanVaiheOid) {
            if (!oid) {
                model.valintatapajono = {};
                model.jarjestyskriteerit = [];
                model.hakijaryhmat = [];
                model.valintatapajono.tasapistesaanto = "YLITAYTTO";
                model.valintatapajono.siirretaanSijoitteluun = !!model.valintatapajono.siirretaanSijoitteluun;
                model.valintatapajono.kaytetaanValintalaskentaa = !!model.valintatapajono.kaytetaanValintalaskentaa;
                model.valintatapajono.kaikkiEhdonTayttavatHyvaksytaan = !!model.valintatapajono.kaikkiEhdonTayttavatHyvaksytaan;
                model.valintatapajono.poistetaankoHylatyt = !!model.valintatapajono.poistetaankoHylatyt;
                model.valintatapajono.valisijoittelu = !!model.valintatapajono.valisijoittelu;
                model.valintatapajono.automaattinenLaskentaanSiirto = !!model.valintatapajono.automaattinenLaskentaanSiirto;
                model.valintatapajono.automaattinenLaskentaanSiirtoMuokattavissa = !!model.valintatapajono.automaattinenLaskentaanSiirtoMuokattavissa;

            } else if (oid !== model.valintatapajono.oid) {
                this.refresh(oid, valinnanVaiheOid);
            }
        };

        this.refreshJK = function (oid) {
            ValintatapajonoJarjestyskriteeri.get({parentOid: oid}, function (result) {
                model.jarjestyskriteerit = result;
                model.jarjestyskriteerit.forEach(function (jk) {
                    Laskentakaava.get({oid: jk.laskentakaavaId, funktiopuu: false}, function (result) {
                        jk.nimi = result.nimi;
                    });
                });
            });
        };

        this.submit = function (valinnanvaiheOid, valintatapajonot) {
            if (!model.valintatapajono.rajattu) {
                model.valintatapajono.varasijat = 0;
            }

            if (!model.valintatapajono.alkaenRajattu) {
                model.valintatapajono.varasijojaKaytetaanAlkaen = null;
            }

            if (!model.valintatapajono.astiRajattu) {
                model.valintatapajono.varasijojaTaytetaanAsti = null;
            }

            if (!model.valintatapajono.aloituspaikat && model.valintatapajono.kaikkiEhdonTayttavatHyvaksytaan) {
                model.valintatapajono.aloituspaikat = 0;
            }

            // Ei mitään null checkiä tähän!!!!
            if (!model.valintatapajono.oid) {
                model.valintatapajono.aktiivinen = true;
                ValinnanvaiheValintatapajono.insert({parentOid: valinnanvaiheOid}, model.valintatapajono,
                    function (result) {
                        model.valintatapajono = result;
                        model.valintatapajono.rajattu = model.valintatapajono.varasijat > 0;
                        model.valintatapajono.alkaenRajattu = !!model.valintatapajono.varasijojaKaytetaanAlkaen;
                        model.valintatapajono.astiRajattu = !!model.valintatapajono.varasijojaTaytetaanAsti;
                        if(model.valintatapajono.varasijojaKaytetaanAlkaen) {
                            model.valintatapajono.varasijojaKaytetaanAlkaen = new Date(model.valintatapajono.varasijojaKaytetaanAlkaen);
                        }

                        if(model.valintatapajono.varasijojaTaytetaanAsti) {
                            model.valintatapajono.varasijojaTaytetaanAsti = new Date(model.valintatapajono.varasijojaTaytetaanAsti);
                        }
                        valintatapajonot.push(result);
                        Ilmoitus.avaa("Tallennus onnistui", "Tallennus onnistui.");
                    });
            } else {

                Valintatapajono.post(model.valintatapajono, function (result) {
                    var i;
                    for (i in valintatapajonot) {
                        if (result.oid === valintatapajonot[i].oid) {
                            valintatapajonot[i] = result;
                        }
                    }
                    model.valintatapajono = result;
                    model.valintatapajono.rajattu = model.valintatapajono.varasijat > 0;
                    model.valintatapajono.alkaenRajattu = !!model.valintatapajono.varasijojaKaytetaanAlkaen;
                    model.valintatapajono.astiRajattu = !!model.valintatapajono.varasijojaTaytetaanAsti;
                    if(model.valintatapajono.varasijojaKaytetaanAlkaen) {
                        model.valintatapajono.varasijojaKaytetaanAlkaen = new Date(model.valintatapajono.varasijojaKaytetaanAlkaen);
                    }

                    if(model.valintatapajono.varasijojaTaytetaanAsti) {
                        model.valintatapajono.varasijojaTaytetaanAsti = new Date(model.valintatapajono.varasijojaTaytetaanAsti);
                    }

                    Ilmoitus.avaa("Tallennus onnistui", "Tallennus onnistui.");
                });

                model.hakijaryhmat.forEach(function (hr) {
                    HakijaryhmaValintatapajono.update({oid: hr.oid}, hr, function (result) {
                        hr = result;
                    });
                });

                var promises = [];
                for (var i = 0; i < model.jarjestyskriteerit.length; ++i) {

                    promises[i] = function () {
                        var deferred = $q.defer();

                        var update = {
                            oid: model.jarjestyskriteerit[i].oid,
                            jarjestyskriteeri: model.jarjestyskriteerit[i],
                            laskentakaavaId: model.jarjestyskriteerit[i].laskentakaavaId
                        };

                        Jarjestyskriteeri.post(update, function (result) {
                            deferred.resolve();
                        });
                        return deferred.promise;
                    }();
                }


                $q.all(promises).then(function () {
                    jarjestaJarjestyskriteerit();
                });
            }
        };

        this.remove = function (oid) {
            $modal.open({
                backdrop: 'static',
                templateUrl: 'poistajononmuodostumiskriteeri.html',
                controller: function ($scope, $window, $modalInstance) {
                    $scope.ok = function () {
                        Jarjestyskriteeri.delete({oid: oid}, function () {
                            for (var i in model.jarjestyskriteerit) {
                                if (oid === model.jarjestyskriteerit[i].oid) {
                                    model.jarjestyskriteerit.splice(i, 1);
                                }
                            }
                        });
                        $modalInstance.close();
                    };
                    $scope.cancel = function () {
                        $modalInstance.dismiss('cancel');
                    };
                }
            }).result.then(function () {
                }, function () {
                });

        };

        this.removeHakijaryhma = function (oid) {
            $modal.open({
                backdrop: 'static',
                templateUrl: 'poistahakijaryhma.html',
                controller: function ($scope, $window, $modalInstance) {
                    $scope.ok = function () {
                        HakijaryhmaValintatapajono.delete({oid: oid}, function () {
                            for (var i in model.hakijaryhmat) {
                                if (oid === model.hakijaryhmat[i].oid) {
                                    model.hakijaryhmat.splice(i, 1);
                                }
                            }
                        });
                        $modalInstance.close();
                    };
                    $scope.cancel = function () {
                        $modalInstance.dismiss('cancel');
                    };
                }
            }).result.then(function () {
                }, function () {
                });

        };

        function jarjestaJarjestyskriteerit() {
            if (model.jarjestyskriteerit.length > 0) {
                JarjestyskriteeriJarjesta.post(getJarjestyskriteeriOids(), function (result) {
                    model.jarjestyskriteerit = result;
                    model.jarjestyskriteerit.forEach(function (jk) {
                        Laskentakaava.get({oid: jk.laskentakaavaId, funktiopuu: false}, function (result) {
                            jk.nimi = result.nimi;
                        });
                    });
                });
            }
        }

        function getJarjestyskriteeriOids() {
            var oids = [];
            for (var i = 0; i < model.jarjestyskriteerit.length; ++i) {
                oids.push(model.jarjestyskriteerit[i].oid);
            }
            return oids;
        }
    }();


    return model;
}])

    .controller('HakukohdeValintatapajonoController', ['$scope', '$location', '$routeParams', 'ValintatapajonoModel',
        'HakukohdeValinnanVaiheModel',
        function ($scope, $location, $routeParams, ValintatapajonoModel, HakukohdeValinnanVaiheModel) {
            "use strict";
            $scope.hakukohdeOid = $routeParams.hakukohdeOid;
            $scope.valinnanvaiheOid = $routeParams.valinnanvaiheOid;

            $scope.model = ValintatapajonoModel;

            $scope.model.refreshIfNeeded($routeParams.valintatapajonoOid, $routeParams.id, $routeParams.hakukohdeOid, $routeParams.valinnanvaiheOid);

            $scope.submit = function () {
                $scope.model.submit($scope.valinnanvaiheOid, HakukohdeValinnanVaiheModel.valintatapajonot);
            };

            $scope.cancel = function () {
                $location.path("/hakukohde/" + $scope.hakukohdeOid + '/valinnanvaihe/' + $scope.valinnanvaiheOid);
            };

            $scope.addKriteeri = function () {
                $location.path("/hakukohde/" + $scope.hakukohdeOid +
                    '/valinnanvaihe/' + $scope.valinnanvaiheOid +
                    '/valintatapajono/' + $scope.model.valintatapajono.oid + '/jarjestyskriteeri/');
            };

            $scope.addHakijaryhma = function () {
                $location.path("/hakukohde/" + $scope.hakukohdeOid +
                    '/valinnanvaihe/' + $scope.valinnanvaiheOid +
                    '/valintatapajono/' + $scope.model.valintatapajono.oid + '/hakijaryhma');

            };

            $scope.modifyHakijaryhma = function (oid) {

                $location.path("/hakukohde/" + $scope.hakukohdeOid +
                    '/valinnanvaihe/' + $scope.valinnanvaiheOid +
                    '/valintatapajono/' + $scope.model.valintatapajono.oid +
                    '/hakijaryhma/' + oid);
            };

            $scope.modifyKriteeri = function (oid) {


                $location.path("/hakukohde/" + $scope.hakukohdeOid +
                    '/valinnanvaihe/' + $scope.valinnanvaiheOid +
                    '/valintatapajono/' + $scope.model.valintatapajono.oid +
                    '/jarjestyskriteeri/' + oid);
            };

            $scope.remove = function (oid) {
                $scope.model.remove(oid);
            };

            $scope.removeHakjiaryhma = function (oid) {
                $scope.model.removeHakijaryhma(oid);
            };

            $scope.$on('hakijaryhmaliita', function () {
                $scope.model.refresh($routeParams.valintatapajonoOid, $routeParams.valinnanvaiheOid);
            });

            $scope.today = new Date();

            $scope.openAlkaenRajattu = function($event) {
                $event.preventDefault();
                $event.stopPropagation();
                $scope.alkaenRajattuOpen = true;
            };

            $scope.openAstiRajattu = function($event) {
                $event.preventDefault();
                $event.stopPropagation();
                $scope.astiRajattuOpen = true;
            };
        }])



    .controller('ValintaryhmaValintatapajonoController', ['$scope', '$location', '$routeParams', '$timeout',
        'ValintatapajonoModel', 'ValintaryhmaValinnanvaiheModel',
        function ($scope, $location, $routeParams, $timeout, ValintatapajonoModel, ValintaryhmaValinnanvaiheModel) {
            "use strict";

            $scope.valintaryhmaOid = $routeParams.id;
            $scope.valinnanvaiheOid = $routeParams.valinnanvaiheOid;

            $scope.model = ValintatapajonoModel;
            $scope.model.refreshIfNeeded($routeParams.valintatapajonoOid, $routeParams.id, $routeParams.hakukohdeOid, $routeParams.valinnanvaiheOid);

            $scope.submit = function () {
                $scope.model.submit($scope.valinnanvaiheOid, ValintaryhmaValinnanvaiheModel.valintatapajonot);
            };

            $scope.cancel = function () {
                $location.path("/valintaryhma/" + $scope.valintaryhmaOid + '/valinnanvaihe/' + $scope.valinnanvaiheOid);
            };

            $scope.addKriteeri = function () {
                $location.path("/valintaryhma/" + $scope.valintaryhmaOid +
                    '/valinnanvaihe/' + $scope.valinnanvaiheOid +
                    '/valintatapajono/' + $scope.model.valintatapajono.oid + '/jarjestyskriteeri/');
            };

            $scope.addHakijaryhma = function () {
                $location.path("/valintaryhma/" + $scope.valintaryhmaOid +
                    '/valinnanvaihe/' + $scope.valinnanvaiheOid +
                    '/valintatapajono/' + $scope.model.valintatapajono.oid + '/hakijaryhma');
            };

            $scope.modifyKriteeri = function (oid) {
                $location.path("/valintaryhma/" + $scope.valintaryhmaOid +
                    '/valinnanvaihe/' + $scope.valinnanvaiheOid +
                    '/valintatapajono/' + $scope.model.valintatapajono.oid +
                    '/jarjestyskriteeri/' + oid);
            };
            $scope.modifyHakijaryhma = function (oid) {

                $location.path("/valintaryhma/" + $scope.valintaryhmaOid +
                    '/valinnanvaihe/' + $scope.valinnanvaiheOid +
                    '/valintatapajono/' + $scope.model.valintatapajono.oid +
                    '/hakijaryhma/' + oid);
            };

            $scope.remove = function (oid) {
                $scope.model.remove(oid);
            };

            $scope.removeHakjiaryhma = function (oid) {
                $scope.model.removeHakijaryhma(oid);
            };

            $scope.$on('hakijaryhmaliita', function () {
                $scope.model.refresh($routeParams.valintatapajonoOid, $routeParams.valinnanvaiheOid);
            });

            $scope.today = new Date();

            $scope.openAlkaenRajattu = function($event) {
                $event.preventDefault();
                $event.stopPropagation();
                $scope.alkaenRajattuOpen = true;
            };

            $scope.openAstiRajattu = function($event) {
                $event.preventDefault();
                $event.stopPropagation();
                $scope.astiRajattuOpen = true;
            };

        }])


.factory('HakijaryhmaLiitaModel', ['$resource', '$location', '$routeParams', 'Hakijaryhma', 'HakijaryhmaLiita',
    function ($resource, $location, $routeParams, Hakijaryhma, HakijaryhmaLiita) {
    "use strict";

    var model = new function () {
        this.hakijaryhma = {};

        this.refresh = function () {
            model.hakijaryhmaOid = {};
            this.parentOid = "";
        };

        this.move = function () {

            if (model.parentOid) {
                HakijaryhmaLiita.liita({valintatapajonoOid: $routeParams.valintatapajonoOid}, model.parentOid, function (result) {
                    $scope.$emit('hakijaryhmaliita');
                    $scope.$broadcast('suljemodal');
                });
            }

        };
    }();

    return model;
}])

.controller('HakijaryhmaValintaController', ['$scope', '$routeParams', 'HakijaryhmaLiitaModel', 'HakukohdeModel', 'Hakukohde', 'ValintaryhmaModel', 'HakijaryhmaLiita',
        function($scope, $routeParams, HakijaryhmaLiitaModel, HakukohdeModel, Hakukohde, ValintaryhmaModel, HakijaryhmaLiita) {
    "use strict";
    $scope.model = HakijaryhmaLiitaModel;
    $scope.model.refresh();
    $scope.hakukohdeModel = HakukohdeModel;
    $scope.domain = ValintaryhmaModel;
        
    if($routeParams.id) {
        ValintaryhmaModel.refresh($routeParams.id);
    } else if($routeParams.hakukohdeOid) {

        Hakukohde.get({oid: $routeParams.hakukohdeOid}, function(result) {
            if (result.valintaryhmaOid) {
                ValintaryhmaModel.refresh(result.valintaryhmaOid);
            }
        });

    }



    $scope.liita = function () {
        if ($scope.model.parentOid) {
            HakijaryhmaLiita.liita({valintatapajonoOid: $routeParams.valintatapajonoOid, hakijaryhmaOid: $scope.model.parentOid}, function (result) {
                $scope.$emit('hakijaryhmaliita');
                $scope.$broadcast('suljemodal');
            });
        }
    };

    $scope.openHakijaryhmaModal = function () {
        $scope.show();
    };
}]);