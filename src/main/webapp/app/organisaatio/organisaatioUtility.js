

// Organisaatiotiedot erillisessä
angular.module('valintaperusteet')
    .service('OrganisaatioUtility', ['$routeParams', '$q', '_', 'ValintaryhmaModel', 'HakukohdeModel',
        function ($routeParams, $q, _, ValintaryhmaModel, HakukohdeModel) {

            // isOidList === true => return the oids of organizations as array
            // isOidList === false => return organization objects as array
            this.getOrganizations = function (isOidList) {
                var deferred = $q.defer();
                var organizations = [];

                if ($routeParams.id) {
                    ValintaryhmaModel.refreshIfNeeded($routeParams.id);
                    ValintaryhmaModel.loaded.promise.then(function () {
                        if (ValintaryhmaModel.valintaryhma.organisaatiot) {
                            if(isOidList) {
                                _.forEach(ValintaryhmaModel.valintaryhma.organisaatiot, function (org) {
                                    organizations.push(org.oid);
                                });
                            } else {
                                organizations = ValintaryhmaModel.valintaryhma.organisaatiot;
                            }

                        }
                        deferred.resolve(organizations);
                    }, function () {
                        deferred.reject("Valintaryhmän tietojen hakeminen epäonnistui");
                    });
                } else  if ($routeParams.hakukohdeOid) {
                    HakukohdeModel.refreshIfNeeded($routeParams.hakukohdeOid);
                    HakukohdeModel.loaded.promise.then(function () {
                        organizations.push(HakukohdeModel.hakukohde.tarjoajaOid);
                        deferred.resolve(organizations);
                    }, function () {
                        deferred.reject();
                    });
                } else {
                    deferred.resolve(organizations);
                }

                return deferred.promise;
            };

    }]);

