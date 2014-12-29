// Organisaatiotiedot erillisessä
angular.module('valintaperusteet')
    .service('OrganisaatioUtility', ['$q', '$log', '_', 'Valintaryhma', 'HakukohdeModel', 'OrganizationByOid', 'OrganizationParentOids', 'Hakukohde', 'TarjontaHakukohde', 'OPH_ORG_OID', 'OrganizationChildOids',
        function ($q, $log, _, Valintaryhma, HakukohdeModel, OrganizationByOid, OrganizationParentOids, Hakukohde, TarjontaHakukohde, OPH_ORG_OID, OrganizationChildOids) {


            /**
             *
             * @param {String} valintaryhma oid
             * @returns {Promise object} returning organization objects for this valintaryhma
             */
            this.getValintaryhmaOrganizationsWithChildOrganizations = function (valintaryhmaOid) {
                var deferred = $q.defer();
                var organizations = [];
                console.log('getting organizations', valintaryhmaOid);
                Valintaryhma.get({oid: valintaryhmaOid}, function (result) {
                    var organizationsDeferreds = [];
                    if (result.organisaatiot) {
                        organizations = result.organisaatiot;
                    }

                    deferred.resolve(organizations);
                }, function () {
                    $log.error('valintaryhmän tietojen hakeminen epäonnistui');
                    deferred.reject();
                });

                return deferred.promise;
            };

            /**
             *
             * @param {String} valintaryhma oid
             * @returns {Promise object} returning organization oids and child organization oids for this valintaryhma
             */
            this.getValintaryhmaOrganizationsWithChildOrganizationsOidList = function (valintaryhmaOid) {
                var deferred = $q.defer();
                var organizations = [];

                Valintaryhma.get({oid: valintaryhmaOid}, function (result) {
                    var organizationsDeferreds = [];
                    if (result.organisaatiot) {

                        _.forEach(result.organisaatiot, function (org) {
                            if(org.oid !== OPH_ORG_OID) {
                                var defer = $q.defer();
                                OrganizationChildOids.get({oid: org.oid}, function(childOids) {
                                    _.forEach(childOids.oids, function (oid) {
                                        organizations.push(oid);
                                    });
                                    defer.resolve();
                                }, function (error) {
                                    $log.error('Organisaation: ' + org.oid + ' tietojen hakeminen epäonnistui.', error);
                                    // resolve deferred object anyway so that organization may only miss some childorganizations, not all
                                    defer.resolve();
                                });
                            }
                            organizations.push(org.oid);
                        });

                    }

                    deferred.resolve(organizations);
                }, function () {
                    $log.error('valintaryhmän tietojen hakeminen epäonnistui');
                    deferred.reject();
                });

                return deferred.promise;
            };

            /**
             *
             * @param {String} valintaryhma oid
             * @returns {Promise object} returning organization objects for this valintaryhma
             */
            this.getHakukohdeOrganizationsWithChildOrganizations = function (hakukohdeOid) {
                var deferred = $q.defer();
                var organizations = [];

                TarjontaHakukohde.get({hakukohdeoid: hakukohdeOid}, function (hakukohdeWrapper) {
                    var organizationsPromises = [];

                    _.forEach(hakukohdeWrapper.result.tarjoajaOids, function (tarjoajaOid) {
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


                }, function (error) {
                    $log.error('Hakukohteen tietojen hakeminen epäonnistui');
                    deferred.reject();
                });

                return deferred.promise;
            };

            /**
             *
             * @param {String} valintaryhma oid
             * @returns {Promise object} returning organization objects for this valintaryhma
             */
            this.getHakukohdeOrganizationsWithChildOrganizationsOidList = function (hakukohdeOid) {
                var deferred = $q.defer();
                var organizations = [];

                TarjontaHakukohde.get({hakukohdeoid: hakukohdeOid}, function (hakukohdeWrapper) {
                    var organizationsPromises = [];
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



                }, function (error) {
                    $log.error('Hakukohteen tietojen hakeminen epäonnistui');
                    deferred.reject();
                });

                return deferred.promise;
            };



}])
;

