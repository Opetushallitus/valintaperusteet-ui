

// Organisaatiotiedot erillisessä
angular.module('valintaperusteet')
    .service('OrganisaatioUtility', ['$q', '$log', '_', 'ValintaryhmaModel', 'HakukohdeModel', 'OrganizationByOid', 'Hakukohde',
        function ($q, $log, _, ValintaryhmaModel, HakukohdeModel, OrganizationByOid, Hakukohde) {

            // isOidList === true => return the oids of organizations as array
            // isOidList === false => return organization objects as array
            this.getOrganizations = function (isOidList, valintaryhmaId, hakukohdeOid) {
                var deferred = $q.defer();
                var organizations = [];
                if (valintaryhmaId) {
                    ValintaryhmaModel.refreshIfNeeded(valintaryhmaId);
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

                    Hakukohde.get({oid: hakukohdeOid}, function (hakukohde) {
                        if(isOidList) {
                            organizations.push(hakukohde.tarjoajaOid);
                            deferred.resolve(organizations);
                        } else {
                            var hakukohdeOrgDeferred = $q.defer();
                            OrganizationByOid.get({oid: hakukohde.tarjoajaOid}, function (result) {
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
                    }, function (error) {
                        $log.error('Hakukohteen hakeminen epäonnistui', error);
                        deferred.reject();
                    });


                } else {
                    deferred.resolve(organizations);
                }

                return deferred.promise;
            };

    }]);

