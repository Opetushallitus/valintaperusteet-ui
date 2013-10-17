app.factory('HakuModel', function($q, Haku, HaunTiedot) {
    var model;

    model = new function() {
        this.hakuOid;
        this.haut = [];
        this.lisahaku = false;

        this.init = function(oid) {

            console.debug("init!");

            if(model.haut.length <= 0) {
                Haku.get({}, function(result) {
                    var HakuOidObjects = result;

                    var promises = [];

                    //iterate hakuoids and fetch corresponding hakuobjects
                    HakuOidObjects.forEach(function(element, index){
                        promises[index] = (function() {
                            var deferred = $q.defer();
                            HaunTiedot.get({hakuOid: element.oid}, function(result) {
                            	if(result.tila=="JULKAISTU") {
                            		model.haut.push(result);
                            	}
                                deferred.resolve();
                            },function() {
                                deferred.resolve();
                            });
                            return deferred.promise;
                        })();
                    });

                    //wait until all hakuobjects have been fetched
                    $q.all(promises).then(function() {
                        //set the previously selected haku or first in list
                        model.hakuOid = model.haut[0].oid;
                        model.haut.forEach(function(haku){
                            if(haku.oid == oid) {
                                model.hakuOid = haku;
                            }
                        });
                    });
                });
            }
        };
    };


    return model;
});

