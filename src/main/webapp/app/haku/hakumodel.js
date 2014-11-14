angular.module('valintaperusteet')

    .factory('HakuModel', ['$q', 'Haku', 'HaunTiedot', '$cookieStore', '_', 'UserModel', function ($q, Haku, HaunTiedot, $cookieStore, _, UserModel) {
        "use strict";

    var model;
    model = new function() {
        this.hakuDeferred = undefined;
        this.hakuOid = "";
        this.haku = {};
        this.haut = [];

        this.init = function(oid) {
            if(model.haut.length < 1 && !model.hakuDeferred) {
                model.hakuDeferred = $q.defer();
                UserModel.refreshIfNeeded();

                    Haku.get({}, function (result) {
                        var HakuOidObjects = result;
                        var promises = [];
                        promises.push(UserModel.organizationsDeferred.promise);

                        //iterate hakuoids and fetch corresponding hakuobjects
                        HakuOidObjects.forEach(function (element, index) {
                            promises[index] = (function () {
                                var deferred = $q.defer();

                                HaunTiedot.get({hakuOid: element.oid}, function (result) {
                                    if (result.tila === "JULKAISTU") {
                                        model.haut.push(result);
                                    }

                                    deferred.resolve();
                                });

                                return deferred.promise;
                            })();
                        });

                        //wait until all hakuobjects have been fetched
                        $q.all(promises).then(function () {
                            model.hakuOid = model.haut[0].oid;

                            //set the previously selected haku or first in list
                            model.haut.forEach(function (haku) {
                                if ($cookieStore.get("hakuoid")) {
                                    var haluttuHaku = _.find(model.haut, function (h) {
                                        return h.oid === $cookieStore.get("hakuoid");
                                    });
                                    if (haluttuHaku) {
                                        model.hakuOid = $cookieStore.get("hakuoid");
                                        model.haku = haluttuHaku;
                                    }

                                }
                            });

                            model.hakuDeferred.resolve();
                        }, function (error) {
                            model.reject();
                        });
                        model.hakuDeferred.resolve();
                    }, function () {
                        model.hakuDeferred.reject();
                    });
                } else {
                    model.hakuDeferred.resolve();
                }

            };

            this.isKKHaku = function (haku) {
                return haku.kohdejoukkoUri.indexOf("_12") > -1;
            };


        }();

        return model;
    }]).

    controller('HakuController', ['$scope', 'HakuModel', '$cookieStore', 'CustomHakuUtil', function ($scope, HakuModel, $cookieStore, CustomHakuUtil) {
        $scope.hakuModel = HakuModel;
        $scope.hakuModel.init();
        $scope.customHakuUtil = CustomHakuUtil;
        CustomHakuUtil.refreshIfNeeded();

        $scope.changeHaku = function () {
            $scope.hakuModel.hakuOid = $scope.hakuModel.haku.oid;
            sessionStorage.setItem('valintaperusteHakuOid', $scope.hakuModel.hakuOid);
            $cookieStore.put('hakuoid', $scope.hakuModel.hakuOid);
            console.log($scope.customHakuUtil);
        };



    }])

    .filter('kkHakuFilter', ['_', function (_) {
        return function (haut) {
            return _.filter(haut, function (haku) {
                if (haku.kohdejoukkoUri) {
                    return haku.kohdejoukkoUri.indexOf('_12') > -1;
                }
            });
        };
    }])


    .filter('CustomHakuFilter', ['CustomHakuUtil', '_',
        function (CustomHakuUtil, _) {
            return function (haut) {
                var result = haut;
                _.each(CustomHakuUtil.hakuKeys, function (key) {
                    if (CustomHakuUtil[key].value !== null && CustomHakuUtil[key].value !== undefined) {
                        result = CustomHakuUtil[key].filter(result);
                    }
                });
                return result;

            };
        }])

    .service('CustomHakuUtil', ['$q', '_', 'HakujenHakutyypit', 'HakujenKohdejoukot', 'HakujenHakutavat', 'HakujenHakukaudet', 'HakuModel',
        function ($q, _, HakujenHakutyypit, HakujenKohdejoukot, HakujenHakutavat, HakujenHakukaudet, HakuModel) {

            var that = this;

            this.hakuKeys = ['hakuvuosi', 'hakukausi', 'kohdejoukko', 'hakutapa', 'hakutyyppi'];

            this.deferred = undefined; // deferred here is meant just to prevent multiple refresh-calls

            this.hakutyyppiOpts = undefined;
            this.kohdejoukkoOpts = undefined;
            this.hakutapaOpts = undefined;
            this.hakukausiOpts = undefined;
            this.hakuvuodetOpts = undefined;

            this.refresh = function () {
                that.deferred = $q.defer();

                HakujenHakutyypit.query(function (result) {
                    that.hakutyyppiOpts = _.map(result, function (hakutyyppi) { //parse hakuoptions
                        return {
                            koodiUri: hakutyyppi.koodiUri,
                            nimi: _.findWhere(hakutyyppi.metadata, {kieli: 'FI'}).nimi
                        };
                    });
                });

                HakujenKohdejoukot.query(function (result) {
                    that.kohdejoukkoOpts = _.map(result, function (kohdejoukko) { //parse hakuoptions
                        return {
                            koodiUri: kohdejoukko.koodiUri,
                            nimi: _.findWhere(kohdejoukko.metadata, {kieli: 'FI'}).nimi
                        };
                    });
                });

                HakujenHakutavat.query(function (result) {
                    that.hakutapaOpts = _.map(result, function (tapa) { //parse hakuoptions
                        return {
                            koodiUri: tapa.koodiUri,
                            nimi: _.findWhere(tapa.metadata, {kieli: 'FI'}).nimi
                        };
                    });
                });

                HakujenHakukaudet.query(function (result) {
                    that.hakukausiOpts = _.map(result, function (kausi) { //parse hakuoptions
                        return {
                            koodiUri: kausi.koodiUri,
                            nimi: _.findWhere(kausi.metadata, {kieli: 'FI'}).nimi
                        };
                    });
                });

                if (_.isEmpty(HakuModel.deferred)) {
                    HakuModel.init();
                }

                HakuModel.hakuDeferred.promise.then(function () {
                    that.hakuvuodetOpts = _.uniq(_.pluck(HakuModel.haut, 'hakukausiVuosi'));
                });

                that.deferred.resolve();
            };

            this.refreshIfNeeded = function () {
                if (_.isEmpty(that.deferred)) {
                    that.refresh();
                }
            };


            this.hakuvuosi = {
                value: undefined,
                filter: function (haut) {
                    return !_.isNumber(that.hakuvuosi.value) ? haut : _.filter(haut, function (haku) {
                        return haku.hakukausiVuosi === that.hakuvuosi.value;
                    });
                }
            };

            this.hakukausi = {
                value: undefined,
                filter: function (haut) {
                    return !_.isString(that.hakukausi.value) ? haut : _.filter(haut, function (haku) {
                        return haku.hakukausiUri.indexOf(that.hakukausi.value) > -1;
                    });
                }
            };

            this.kohdejoukko = {
                value: undefined,
                filter: function (haut) {
                    return !_.isString(that.kohdejoukko.value) ? haut : _.filter(haut, function (haku) {
                        return haku.kohdejoukkoUri.indexOf(that.kohdejoukko.value) > -1;
                    });
                }
            };

            this.hakutapa = {
                value: undefined,
                filter: function (haut) {
                    return !_.isString(that.hakutapa.value) ? haut : _.filter(haut, function (haku) {
                        return haku.hakutapaUri.indexOf(that.hakutapa.value) > -1;
                    });
                }
            };

            this.hakutyyppi = {
                value: undefined,
                filter: function (haut) {
                    return !_.isString(that.hakutyyppi.value) ? haut : _.filter(haut, function (haku) {
                        return haku.hakutyyppiUri.indexOf(that.hakutyyppi.value) > -1;
                    });
                }
            };

        }]);
