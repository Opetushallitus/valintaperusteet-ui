// Organisaatiotiedot erillisessä
angular.module('valintaperusteet')
    .service('OrganisaatioUtility', ['$q', '$log', '_', 'Valintaryhma', 'HakukohdeModel', 'OrganizationByOid', 'OrganizationParentOids', 'Hakukohde', 'TarjontaHakukohde', 'OPH_ORG_OID',
        function ($q, $log, _, Valintaryhma, HakukohdeModel, OrganizationByOid, OrganizationParentOids, Hakukohde, TarjontaHakukohde, OPH_ORG_OID) {

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
                    TarjontaHakukohde.get({hakukohdeoid: hakukohdeOid}, function (hakukohdeWrapper) {
                        var organizationsPromises = [];
                        if (returnAsOidList) {
                            _.forEach(hakukohdeWrapper.result.tarjoajaOids, function (tarjoajaOid) {
                                var organizationDefer = $q.defer();
                                organizationsPromises.push(organizationDefer.promise);

                                OrganizationParentOids.get({oid: tarjoajaOid}, function (oidstring) {

                                    //join strings in array until resource is fixed
                                    var help = "";
                                    oidstring = _.map(oidstring, function (item) {
                                        if(typeof item === 'string') {
                                            help = help + item;
                                        }
                                    }, "");
                                    oidstring = help;
        
                                    var oidlist = oidstring.split("/");
                                    // remove ophoid
                                    oidlist = _.filter(oidlist, function (oid) {
                                        return oid !== OPH_ORG_OID;
                                    });

                                    organizations  = _.union(organizations, oidlist);
                                    organizationDefer.resolve();
                                }, function (error) {
                                    $log.error('Organisaation ' + tarjoajaOid + ' parentoidien hakeminen epäonnistui', error);
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

                        } else {

                            _.forEach(hakukohde.result.tarjoajaOids, function (tarjoajaOid) {
                                var tarjoajaDefer = $q.defer();
                                organizationsPromises.push(tarjoajaDefer.promise);

                                OrganizationParentOids.get({oid: tarjoajaOid}, function (oidstring) {

                                    //join strings in array until resource is fixed
                                    var help = "";
                                    oidstring = _.map(oidstring, function (item) {
                                        if(typeof item === 'string') {
                                            help = help + item;
                                        }
                                    }, "");
                                    oidstring = help;

                                    var oidlist = oidstring.split("/");
                                    oidlist = _.filter(oidlist, function (oid) {
                                        return oid !== OPH_ORG_OID;
                                    });
                                    var orgpromises = [];
                                    _.forEach(oidlist, function(orgoid) {
                                        var organizationDefer = $q.defer();
                                        orgpromises.push(organizationDefer.promise);
                                        OrganizationByOid.get({oid: orgoid}, function (organisaatio) {
                                            organizations.push(organisaatio);
                                            organizationDefer.resolve();
                                        }, function (error) {
                                            $log.error('Organisaation ' + tarjoajaOid + ' hakeminen epäonnistui', error);
                                            organizationDefer.reject();
                                        });
                                    });
                                    
                                    $q.all(orgpromises).then(function () {
                                        tarjoajaDefer.resolve();
                                    }, function () {
                                        //resolve even on fail, there might be organizations that have been fetched
                                        tarjoajaDefer.resolve();
                                    });

                                    //tarjoajaDefer must be resolved after organizationDefers are pushed to promises array

                                }, function (error) {
                                    $log.info('Organisaation ' + tarjoajaOid + ' parentoidien haku epäonnistui', error);
                                    tarjoajaDefer.reject();
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
                    deferred.reject();
                }


            return deferred.promise;
        };

}])
;

