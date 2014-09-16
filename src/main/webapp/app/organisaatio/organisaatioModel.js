angular.module('valintaperusteet')
    .factory('OrganisaatioModel', ['$routeParams', '$q', '_', 'ValintaryhmaModel', 'HakukohdeModel', function ($routeParams, $q, _, ValintaryhmaModel, HakukohdeModel) {
        var model = new function () {
            this.valintaryhmaOid = "";
            this.hakukohdeOid = "";
            this.deferred = undefined;
            this.organisaatiot = [];

            this.refresh = function () {
                model.organisaatiot.length = 0;
                var deferred = $q.defer();
                model.deferred = deferred;

                if ($routeParams.id && model.valintaryhmaOid !== $routeParams.id) {
                    model.valintaryhmaOid = $routeParams.id;
                    model.hakukohdeOid = "";

                    ValintaryhmaModel.refreshIfNeeded($routeParams.id);
                    ValintaryhmaModel.loaded.promises.then(function () {
                        if (ValintaryhmaModel.valintaryhma.organisaatiot) {
                            _.forEach(ValintaryhmaModel.valintaryhma.organisaatiot, function (org) {
                                model.organisaatiot.push(org.oid);
                            });
                        }
                        deferred.resolve(model.organisaatiot);

                    }, function () {
                        deferred.reject();
                    });

                } else if ($routeParams.hakukohdeOid && model.hakukohdeOid !== $routeParams.hakukohdeOid) {
                    model.hakukohdeOid = $routeParams.hakukohdeOid;
                    model.valintaryhmaOid = "";

                    HakukohdeModel.refreshIfNeeded($routeParams.hakukohdeOid);
                    HakukohdeModel.loaded.promise.then(function () {
                        model.organisaatiot.push(HakukohdeModel.hakukohde.tarjoajaOid);
                        deferred.resolve(model.organisaatiot);
                    }, function () {
                        deferred.reject();
                    });
                } else {
                    deferred.resolve(model.organisaatiot);
                }

            };


        };

        return model;
    }]);

