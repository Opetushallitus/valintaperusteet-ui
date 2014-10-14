

// Organisaatiotiedot erillisessä
angular.module('valintaperusteet')
    .service('OrganisaatioUtility', ['$routeParams', '$q', '$log', '_', 'ValintaryhmaModel', 'HakukohdeModel', 'OrganizationByOid',
        function ($routeParams, $q, $log, _, ValintaryhmaModel, HakukohdeModel, OrganizationByOid) {

            // isOidList === true => return the oids of organizations as array
            // isOidList === false => return organization objects as array
            this.getOrganizations = function (isOidList, valintaryhmaId, hakukohdeOid) {
                var deferred = $q.defer();
                var organizations = [];
                if (valintaryhmaId) {
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
                } else  if (hakukohdeOid) {
                    HakukohdeModel.refreshIfNeeded($routeParams.hakukohdeOid);
                    HakukohdeModel.loaded.promise.then(function () {
                        if(isOidList) {
                            organizations.push(HakukohdeModel.hakukohde.tarjoajaOid);
                            deferred.resolve(organizations);
                        } else {
                            var hakukohdeOrgDeferred = $q.defer();
                            OrganizationByOid({oid: HakukohdeModel.hakukohde.tarjoajaOid}, function (result) {
                                organizations.push(result);
                                hakukohdeOrgDeferred.resolve();
                            }, function (error) {
                                hakukohdeOrgDeferred.reject('Hakukohteen organisaation hakeminen epäonnistui', error);
                            });
                            
                            hakukohdeOrgDeferred.promise.then(function (result) {
                                deferred.resolve(organizations);
                            }, function (error) {
                                deferred.reject('Hakukohteen organisaation hakeminen epäonnistui', error);
                            });
                        }



                    }, function () {
                        deferred.reject();
                    });
                } else {
                    deferred.resolve(organizations);
                }

                return deferred.promise;
            };

    }]);

