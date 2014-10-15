// Organisaatiotiedot erillisessä
angular.module('valintaperusteet')
    .service('OrganisaatioUtility', ['$q', '$log', '_', 'Valintaryhma', 'HakukohdeModel', 'OrganizationByOid', 'Hakukohde', 'TarjontaHakukohde',
        function ($q, $log, _, Valintaryhma, HakukohdeModel, OrganizationByOid, Hakukohde, TarjontaHakukohde) {

            // isOidList === true => return the oids of organizations as array
            // isOidList === false => return organization objects as array
            this.getOrganizations = function (returnAsOidList, valintaryhmaId, hakukohdeOid) {
                var deferred = $q.defer();
                var organizations = [];
                if (valintaryhmaId) {
                    Valintaryhma.get({oid: valintaryhmaId}, function (result) {
                        if (result.organisaatiot) {

                            if (returnAsOidList) {
                                _.forEach(result.organisaatiot, function (org) {
                                    organizations.push(org.oid);
                                });
                            } else {
                                organizations = result.organisaatiot;
                            }

                        }

                        deferred.resolve(organizations);
                    }, function () {
                        $log.error('valintaryhmän tietojen hakeminen epäonnistui');
                        deferred.reject();
                    });
                } else if (hakukohdeOid) {
                    TarjontaHakukohde.get({hakukohdeoid: hakukohdeOid}, function (result) {
                        if (returnAsOidList) {
                            deferred.resolve(result.tarjoajaOids);
                        } else {
                            var organizationsPromises = [];

                            _.forEach(result.tarjoajaOids, function (tarjoajaOid) {
                                var organizationDefer = $q.organizationDefer();
                                organizationsPromises.push(organizationDefer.promise);
                                OrganizationByOid.get({oid: tarjoajaOid}, function (result) {
                                    organizations.push(result);
                                    organizationDefer.resolve();
                                }, function (error) {
                                    $log.error('Organisaation ' + tarjoajaOid + ' hakeminen epäonnistui', error);
                                    organizationDefer.reject();
                                });
                            });

                            $q.all(organizationsPromises).then(function () {
                                deferred.resolve(organizations);
                            }, function () {
                                if (!_.isEmpty(organizations)) {
                                    $log.info('Hakukohteen ' + hakukohdeOid + ' kaikkien organisaatioiden tietoja ei saatu haettua');
                                    deferred.resolve(organizations);
                                } else {
                                    deferred.reject();
                                }
                            });
                        }

                    }, function (error) {
                        $log.error('Hakukohteen tietojen hakeminen epäonnistui');
                        deferred.reject();
                    });

            } else {
                deferred.resolve(organizations);
            }

            return deferred.promise;
        };

}])
;

