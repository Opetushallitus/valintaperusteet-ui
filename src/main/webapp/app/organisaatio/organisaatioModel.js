

// Organisaatiotiedot valintaryhmälle tai hakukohteelle, jota ollaan tarkastelemassa
angular.module('valintaperusteet')
    .factory('OrganisaatioModel', ['$routeParams', '$q', '_', 'ValintaryhmaModel', 'HakukohdeModel', function ($routeParams, $q, _, ValintaryhmaModel, HakukohdeModel) {
        var model = new function () {
            this.valintaryhmaOid = "";
            this.hakukohdeOid = "";
            this.deferred = undefined;
            this.organisaatiot = [];

            this.refresh = function () {
                model.organisaatiot.length = 0;
                model.deferred = $q.defer();

                if ($routeParams.id && model.valintaryhmaOid !== $routeParams.id) {
                    model.valintaryhmaOid = $routeParams.id;
                    model.hakukohdeOid = "";

                    ValintaryhmaModel.refreshIfNeeded($routeParams.id);
                    ValintaryhmaModel.loaded.promise.then(function () {
                        if (ValintaryhmaModel.valintaryhma.organisaatiot) {
                            _.forEach(ValintaryhmaModel.valintaryhma.organisaatiot, function (org) {
                                model.organisaatiot.push(org.oid);
                            });
                        }
                        model.deferred.resolve(model.organisaatiot);

                    }, function () {
                        model.deferred.reject();
                    });

                } else if ($routeParams.hakukohdeOid && model.hakukohdeOid !== $routeParams.hakukohdeOid) {
                    model.hakukohdeOid = $routeParams.hakukohdeOid;
                    model.valintaryhmaOid = "";

                    HakukohdeModel.refreshIfNeeded($routeParams.hakukohdeOid);
                    HakukohdeModel.loaded.promise.then(function () {
                        model.organisaatiot.push(HakukohdeModel.hakukohde.tarjoajaOid);
                        model.deferred.resolve(model.organisaatiot);
                    }, function () {
                        model.deferred.reject();
                    });
                } else {
                    model.deferred.resolve(model.organisaatiot);
                }

            };

            this.refreshIfNeeded = function () {
                if(_.isEmpty(model.deferred)) {
                    model.refresh();
                } else {
                    return model.deferred.promise;
                }
            };


        };

        return model;
    }]);

