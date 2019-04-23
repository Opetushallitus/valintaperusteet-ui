angular.module('valintaperusteet')

    .factory('LaskentakaavaLista', ['Laskentakaava', 'ParentValintaryhmas', 'Hakukohde', 'Valintaryhma',
        function (Laskentakaava, ParentValintaryhmas, Hakukohde, Valintaryhma) {
            'use strict';

            var valintaryhmaList = [];
            var hakukohde = [];
            var valintaryhma = null;

            var findWithValintaryhma = function (valintaryhmaId) {
                var list = [];
                ParentValintaryhmas.get({parentOid: valintaryhmaId}, function (data) {
                    for (var i = 0; i < data.length; ++i) {
                        var valintaryhma = data[i];
                        valintaryhma['laskentakaavat'] = Laskentakaava.list({valintaryhma: valintaryhma.oid});
                    }

                    var paataso = findRootLevelLaskentakaavas();
                    list.push.apply(list, data);
                    list.push(paataso);
                });
                return list;
            };

            var findWithHakukohde = function (hakukohdeOid) {
                var list = [];

                Hakukohde.get({oid: hakukohdeOid}, function (hakukohdeData) {
                    hakukohdeData['laskentakaavat'] = Laskentakaava.list({hakukohde: hakukohdeOid});
                    hakukohde[0] = hakukohdeData;

                    if (hakukohdeData.valintaryhmaOid) {
                        Valintaryhma.get({oid: hakukohdeData.valintaryhmaOid}, function (valintaryhmaData) {

                            ParentValintaryhmas.get({parentOid: valintaryhmaData.oid}, function (data) {
                                for (var i = 0; i < data.length; ++i) {
                                    var valintaryhma = data[i];
                                    valintaryhma['laskentakaavat'] = Laskentakaava.list({valintaryhma: valintaryhma.oid});
                                }

                                var paataso = findRootLevelLaskentakaavas();
                                list.push.apply(list, data);
                                list.push(paataso);
                            });

                        });
                    }

                });

                return list;
            };

            var findRootLevelLaskentakaavas = function () {
                var paataso = {
                    nimi: "Yleiset kaavat",
                    laskentakaavat: []
                };
                Laskentakaava.list({oid: null}, function (data) {
                    paataso.laskentakaavat = data;
                });

                return paataso;
            };

            return {
                valintaryhmaList: function () {
                    return valintaryhmaList;
                },
                hakukohdeList: function () {
                    return hakukohde;
                },
                refresh: function (valintaryhmaId, hakukohdeOid) {
                    hakukohde = [];
                    valintaryhma = null;
                    if (valintaryhmaId) {
                        valintaryhmaList[0] = findWithValintaryhma(valintaryhmaId);
                    } else if (hakukohdeOid) {
                        valintaryhmaList[0] = findWithHakukohde(hakukohdeOid);
                    } else {
                        valintaryhmaList[0] = findRootLevelLaskentakaavas();
                    }
                }
            };
        }])

    .controller('LaskentakaavaListController', [
        '$scope', '$location', '$log', '$routeParams', 'Laskentakaava', 'LaskentakaavaLista', 'FunktioService', '_', '$modal', '$timeout',
        function ($scope, $location, $log, $routeParams, Laskentakaava, LaskentakaavaLista, FunktioService, _, $modal, $timeout) {
            'use strict';

            $scope.funktioService = FunktioService;
            $scope.valintaryhmaOid = $routeParams.id;
            $scope.linkprefix = '';
            var params = {};
            var saveParams = {};

            if ($routeParams.id) {
                LaskentakaavaLista.refresh($routeParams.id, null, true);
                saveParams.valintaryhmaOid = $routeParams.id;
                params.valintaryhma = $routeParams.id;
                $scope.valintaryhmaOid = $routeParams.id;
                $scope.linkprefix = '/valintaryhma/' + $scope.id;
                $scope.valintaryhmat = LaskentakaavaLista;
            }


            $scope.laskentakaavat = Laskentakaava.list(params);
            $scope.showForm = false;

            $scope.createKaava = function () {
                $location.path("/valintaryhma/" + $routeParams.id + "/laskentakaavalista/laskentakaava");
            };

            $scope.editKaava = function (kaava) {
                $scope.showForm = true;
                $scope.kaava = kaava;
                $scope.originalKaava = angular.copy(kaava);
            };

            $scope.cancel = function () {
                $location.path("/valintaryhma/" + $routeParams.id);
            };

            $scope.kaavaKopiointiModal = function (kaava) {
                $scope.$broadcast('kaavakopiointi', kaava);
            };

            $scope.kaavaPoisto = function (kaava) {
                Laskentakaava.delete({oid: kaava.id}, function () {
                    LaskentakaavaLista.refresh($routeParams.id, null, true);
                    $scope.kaavaPoistoEpaonnistui = false;
                }, function (error) {
                    $scope.kaavaPoistoEpaonnistui = true;
                    $timeout(function () {
                        $scope.kaavaPoistoEpaonnistui = false;
                    }, 5000);
                });
            };

            $scope.kaavaPoistoModal = function (kaava) {
                var kaavapoistoModalInstance = $modal.open({
                    templateUrl: 'laskentakaavat/listaus/kaavapoistokuittausModal.html',
                    controller: 'KaavaPoistoController',
                    size: 'sm',
                    resolve: {
                        kaava: function() { return kaava; }
                    }
                });

                kaavapoistoModalInstance.result.then(function (kaava) {
                    if(kaava) {
                        $scope.kaavaPoisto(kaava);
                    }
                });

            };


        }])

    .controller('KaavaPoistoController', ['$scope', '$modalInstance', 'kaava', function ($scope, $modalInstance, kaava) {

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };


        
        $scope.ok = function () {
            $modalInstance.close(kaava);
        };
    }]);
