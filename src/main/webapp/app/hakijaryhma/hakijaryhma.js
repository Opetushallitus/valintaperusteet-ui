// Valintaryhma Järjestyskriteerit
angular.module('valintaperusteet')

    .factory('HakijaryhmaModel', function ($q, Hakijaryhma, LaskentakaavaModel, ValintaryhmaHakijaryhma,
                                           HakukohdeHakijaryhma, HakijaryhmanValintatapajonot, ValintatapajonoHakijaryhma,
                                           HakijaryhmaValintatapajono, Ilmoitus, IlmoitusTila, KoodistoHakijaryhmatyyppikoodi) {
        "use strict";

        var model = new function()  {
            this.hakijaryhma = {};
            this.hakijaryhma.hakijaryhmatyyppikoodi = {};
            this.hakijaryhmatyyppikoodit = [];
            this.valintatapajonot = [];
            this.onkoHakijaryhma = true;

            this.setHakijaryhmatyyppikoodiUri = function(hakijaryhmatyyppikoodiUri) {
                model.hakijaryhmatyyppikoodit.some(function (koodi) {
                    if(koodi.koodiUri === hakijaryhmatyyppikoodiUri) {
                        var hakijaryhmatyyppikoodi = {"uri": koodi.koodiUri,
                            "arvo":koodi.koodiArvo};

                        koodi.metadata.forEach(function(metadata){
                            if(metadata.kieli === "FI") {
                                hakijaryhmatyyppikoodi.nimiFi = metadata.nimi;
                            } else if(metadata.kieli === "SV") {
                                hakijaryhmatyyppikoodi.nimiSv = metadata.nimi;
                            } else if(metadata.kieli === "EN") {
                                hakijaryhmatyyppikoodi.nimiEn = metadata.nimi;
                            }
                        });
                        model.hakijaryhma.hakijaryhmatyyppikoodi =  hakijaryhmatyyppikoodi;
                        return true;
                    }
                });
                return false;
            };

            this.refresh = function (oid, valintaryhmaOid, hakukohdeOid, valintatapajonoOid) {
                model.hakijaryhma = {};
                model.hakijaryhma.kaytaKaikki = false;
                model.hakijaryhma.tarkkaKiintio = false;
                model.hakijaryhma.kaytetaanRyhmaanKuuluvia = true;
                model.valintatapajonot.length = 0;
                model.hakijaryhmatyyppikoodit = [];
                if (oid) {
                    if (hakukohdeOid || valintatapajonoOid) {
                        HakijaryhmaValintatapajono.get({oid: oid}, function (result) {
                            model.hakijaryhma = result;
                            model.onkoHakijaryhma = false;
                        });
                    } else {
                        Hakijaryhma.get({oid: oid}, function (result) {
                            model.hakijaryhma = result;
                            model.onkoHakijaryhma = true;
                        });
                    }
                }

                LaskentakaavaModel.refresh(valintaryhmaOid, hakukohdeOid);
                model.laskentakaavaModel = LaskentakaavaModel;

                KoodistoHakijaryhmatyyppikoodi.get(function(result) {
                    model.hakijaryhmatyyppikoodit = result;
                    if(!model.hakijaryhma.hakijaryhmatyyppikoodi) {
                        model.hakijaryhma.hakijaryhmatyyppikoodi = {'uri': 'hakijaryhmantyypit_muu'};
                    }
                    model.setHakijaryhmatyyppikoodiUri(model.hakijaryhma.hakijaryhmatyyppikoodi.uri);
                });

            };

            this.submit = function (valintaryhmaOid, hakukohdeOid, valintatapajonoOid) {
                var deferred = $q.defer();
                if (model.hakijaryhma.oid) {
                    if (model.onkoHakijaryhma) {
                        Hakijaryhma.update({oid: model.hakijaryhma.oid}, model.hakijaryhma, function (result) {
                            model.hakijaryhma = result;
                            Ilmoitus.avaa("Tallennus onnistui", "Tallennus onnistui.");
                            deferred.resolve();
                        }, function (err) {
                            Ilmoitus.avaa("Tallennus epäonnistui", "Hakijaryhmän tallentaminen valintaryhmään epäonnistui", IlmoitusTila.ERROR);
                            deferred.reject('Hakijaryhmän tallentaminen valintaryhmään epäonnistui', err);
                        });
                    } else {
                        HakijaryhmaValintatapajono.update({oid: model.hakijaryhma.oid}, model.hakijaryhma, function (result) {
                            model.hakijaryhma = result;
                            Ilmoitus.avaa("Tallennus onnistui", "Tallennus onnistui.");
                            deferred.resolve();
                        }, function (err) {
                            Ilmoitus.avaa("Tallennus epäonnistui", "Hakijaryhmän tallentaminen hakukohteelle tai valintatapajonolle epäonnistui", IlmoitusTila.ERROR);
                            deferred.reject('Hakijaryhmän tallentaminen hakukohteelle tai valintatapajonolle epäonnistui', err);
                        });
                    }
                } else if (hakukohdeOid && valintatapajonoOid) {
                    ValintatapajonoHakijaryhma.insert({oid: valintatapajonoOid}, model.hakijaryhma, function (result) {
                        model.hakijaryhma = result;
                        Ilmoitus.avaa("Tallennus onnistui", "Tallennus onnistui.");
                        deferred.resolve();
                    }, function (err) {
                        Ilmoitus.avaa("Tallennus epäonnistui", "Hakijaryhmän tallentaminen valintatapajonoon epäonnistui", IlmoitusTila.ERROR);
                        deferred.reject('Hakijaryhmän tallentaminen valintatapajonoon epäonnistui', err);
                    });

                } else if (hakukohdeOid) {
                    HakukohdeHakijaryhma.insert({oid: hakukohdeOid}, model.hakijaryhma, function (result) {
                        model.hakijaryhma = result;
                        Ilmoitus.avaa("Tallennus onnistui", "Tallennus onnistui.");
                        deferred.resolve();
                    }, function (err) {
                        Ilmoitus.avaa("Tallennus epäonnistui", "Hakijaryhmän tallentaminen hakukohteeseen epäonnistui", IlmoitusTila.ERROR);
                        deferred.reject('Hakijaryhmän tallentaminen hakukohteeseen epäonnistui', err);
                    });
                }
                else if (valintaryhmaOid) {
                    ValintaryhmaHakijaryhma.insert({oid: valintaryhmaOid}, model.hakijaryhma, function (result) {
                        Ilmoitus.avaa("Tallennus onnistui", "Tallennus onnistui.");
                        model.hakijaryhma = result;
                        deferred.resolve();
                    }, function (err) {
                        Ilmoitus.avaa("Tallennus epäonnistui", "Hakijaryhmän tallentaminen valintaryhmään epäonnistui", IlmoitusTila.ERROR);
                        deferred.reject('Hakijaryhmän tallentaminen valintaryhmään epäonnistui', err);
                    });
                } else {
                    deferred.reject('Hakukohteen tai valintatapajonon tunnistetta ei löytynyt. Hakijaryhmän tallentaminen epäonnistui');
                }

                return deferred.promise;
            };

        }();

        return model;
    })

    .controller('HakijaryhmaController', ['$scope', '$location', '$routeParams', 'HakijaryhmaModel',
        'HakukohdeModel', 'ValintaryhmaModel', 'ValintatapajonoModel',
        function ($scope, $location, $routeParams, HakijaryhmaModel, HakukohdeModel, ValintaryhmaModel, ValintatapajonoModel) {
            "use strict";
    
            $scope.model = HakijaryhmaModel;
            $scope.model.refresh($routeParams.hakijaryhmaOid, $routeParams.id, $routeParams.hakukohdeOid, $routeParams.valintatapajonoOid);
            $scope.working = false;

            if(!$routeParams.hakijaryhmaOid && sessionStorage.getItem('hakijaryhmaSkeleton')) {
                var storage = JSON.parse(sessionStorage.getItem('hakijaryhmaSkeleton'));
                $scope.model.hakijaryhma = storage.skeleton;
            } else {
                ValintatapajonoModel.refreshIfNeeded($routeParams.valintatapajonoOid, $routeParams.id, $routeParams.hakukohdeOid, $routeParams.valinnanvaiheOid);
            }

            if(sessionStorage.getItem('hakijaryhmaSkeleton')) {
                sessionStorage.removeItem('hakijaryhmaSkeleton');
            }

            $scope.submit = function () {
                $scope.working = true;
                var promise = HakijaryhmaModel.submit($routeParams.id, $routeParams.hakukohdeOid, $routeParams.valintatapajonoOid);

                promise.then(function () {
                    $scope.working = false;
                    if ($routeParams.valintatapajonoOid) {
                        var isValintaryhmaChild = $routeParams.id ? true : false;
                        ValintatapajonoModel.refresh($routeParams.valintatapajonoOid, $routeParams.valinnanvaiheOid);

                        if (isValintaryhmaChild) {
                            $location.path('/valintaryhma/' + $routeParams.id + '/valinnanvaihe/' + $routeParams.valinnanvaiheOid + '/valintatapajono/' + $routeParams.valintatapajonoOid);
                        } else {
                            $location.path('/hakukohde/' + $routeParams.hakukohdeOid + '/valinnanvaihe/' + $routeParams.valinnanvaiheOid + '/valintatapajono/' + $routeParams.valintatapajonoOid);
                        }
                    } else if ($routeParams.hakukohdeOid) {
                        HakukohdeModel.refresh($routeParams.hakukohdeOid);
                        $location.path("/hakukohde/" + $routeParams.hakukohdeOid);
                    } else {
                        ValintaryhmaModel.refresh($routeParams.id);
                        $location.path("/valintaryhma/" + $routeParams.id);
                    }
                }, function(error) {
                    $scope.working = false;
                });

            };

            $scope.cancel = function () {
                var path;

                if ($routeParams.valintatapajonoOid) {
                    if ($routeParams.id) {
                        $location.path('/valintaryhma/' + $routeParams.id + '/valinnanvaihe/' + $routeParams.valinnanvaiheOid + '/valintatapajono/' + $routeParams.valintatapajonoOid);
                    } else {
                        $location.path('/hakukohde/' + $routeParams.hakukohdeOid + '/valinnanvaihe/' + $routeParams.valinnanvaiheOid + '/valintatapajono/' + $routeParams.valintatapajonoOid);
                    }
                } else if ($routeParams.hakukohdeOid) {
                    path = "/hakukohde/" + $routeParams.hakukohdeOid;
                } else {
                    path = "/valintaryhma/" + $routeParams.id;
                }

                $location.path(path);
            };

            $scope.createNewLaskentakaava = function () {
                var hakijaryhmaSkeleton = {
                    skeleton: $scope.model.hakijaryhma,
                    url: $location.path()
                };

                sessionStorage.setItem('hakijaryhmaSkeleton', JSON.stringify(hakijaryhmaSkeleton));
                
                if ($routeParams.id) {
                    $location.path('/valintaryhma/' + $routeParams.id + '/laskentakaavalista/laskentakaava/');
                } else {
                    $location.path('/hakukohde/' + $routeParams.hakukohdeOid + '/laskentakaavalista/laskentakaava/');
                }
            };


        }]);
    
