app.factory('HakuModel', function($q, Haku, HaunTiedot) {
    "use strict";

    var model;
    model = new function() {
        this.hakuOid = "";
        this.haut = [];

        this.init = function(oid) {
            
            if(model.haut.length <= 0) {
                Haku.get({}, function(result) {
                    var HakuOidObjects = result;
                    
                    var promises = [];

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
                            if(haku.oid === oid) {
                                model.hakuOid = haku;
                            }
                        });
                    }); 
                });
            }
        };
    }();

    return model;
});

angular.module('valintaperusteet').
    controller('ImportController',['$scope', '$location', '$routeParams', 'HakuModel', 'TarjontaImport', 'Treemodel',
        function ($scope, $location, $routeParams, HakuModel, TarjontaImport, Treemodel) {
    "use strict";

    $scope.model = HakuModel;
    HakuModel.init($routeParams.hakuOid);

    $scope.aktivoi = function() {
        TarjontaImport.aktivoi({hakuOid: $scope.model.hakuOid.oid}, function() {  
            Treemodel.refresh();
        });
    };
}]);

