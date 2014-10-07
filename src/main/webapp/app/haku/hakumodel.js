angular.module('valintaperusteet')

    .factory('HakuModel', ['$q', 'Haku', 'HaunTiedot', '$cookieStore', '_', 'UserModel', function($q, Haku, HaunTiedot, $cookieStore, _, UserModel) {
    "use strict";

    var model;
    model = new function() {
        this.hakuOid = "";
        this.haku = {};
        this.haut = [];

        this.init = function(oid) {
            if(model.haut.length <= 0) {

                UserModel.refreshIfNeeded();

                Haku.get({}, function(result) {
                    var HakuOidObjects = result;
                    var promises = [];
                    promises.push(UserModel.organizationsDeferred.promise);

                    //iterate hakuoids and fetch corresponding hakuobjects
                    HakuOidObjects.forEach(function(element, index){
                        promises[index] = (function() {
                            var deferred = $q.defer();

                            HaunTiedot.get({hakuOid: element.oid}, function(result) {
                                if (result.tila === "JULKAISTU") {
                                    model.haut.push(result);
                                }

                                deferred.resolve();
                            });

                            return deferred.promise;
                        })();
                    });

                    //wait until all hakuobjects have been fetched
                    $q.all(promises).then(function() {
                        model.hakuOid = model.haut[0].oid;

                        //set the previously selected haku or first in list
                        model.haut.forEach(function(haku){
                            if($cookieStore.get("hakuoid")) {
                                var haluttuHaku = _.find(model.haut, function(h) {return h.oid === $cookieStore.get("hakuoid")});
                                if(haluttuHaku) {
                                    model.hakuOid = $cookieStore.get("hakuoid");
                                    model.haku = haluttuHaku;
                                }

                            }
                        });
                    });
                });
            }
        };
        
        this.isKKHaku = function (haku) {
            return haku.kohdejoukkoUri.indexOf("_12") > -1;
        };


    }();

    return model;
}]).

    controller('HakuController', ['$scope', 'HakuModel', '$cookieStore', function ($scope, HakuModel, $cookieStore) {
        $scope.hakuModel = HakuModel;
        $scope.hakuModel.init();
        
        $scope.changeHaku = function () {
            $scope.hakuModel.hakuOid = $scope.hakuModel.haku.oid;
            sessionStorage.setItem('valintaperusteHakuOid', $scope.hakuModel.hakuOid);
            $cookieStore.put('hakuoid',$scope.hakuModel.hakuOid);
        };

    }])

.filter('kkHakuFilter', ['_', function (_) {
    return function (haut) {
        return _.filter(haut, function (haku) {
            if(haku.hakukohdeJoukkoUri) {
                return haku.kohdejoukkoUri.indexOf('_12') > -1;
            }
        });
    };
}]);


