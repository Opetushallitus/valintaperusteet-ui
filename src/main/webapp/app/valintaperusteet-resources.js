angular.module('valintaperusteet')




    // HAKU-APP
    .factory('HakemusAvaimet', ['$resource', function ($resource) {
        return $resource(HAKEMUS_URL_BASE + "application-system-form-editor/application-system-form/:asId", {asId: "@asId"}, {
            get: {method: "GET", isArray: false, cache: true}
        });
    }])

    .factory('HakemusLisakysymykset', ['$resource', function ($resource) {
        return $resource(HAKEMUS_URL_BASE + "application-system-form-editor/theme-question/list/:asId", {asId: "@asId"}, {
            get: {method: "GET", isArray: false, cache: true}
        });
    }])

    //Valintaryhma
    .factory('ValintaperusteetPuu', ['$resource', function ($resource) {
        return $resource(SERVICE_URL_BASE + "resources/puu", {
            q: "@q",
            hakuOid: "@hakuOid",
            tila: "@tila",
            kohdejoukko: "@kohdejoukko"
        }, {
            get: {method: "GET", isArray: true, cache: false}
        });
    }])


    .factory('RootValintaryhmas', ['$resource', function ($resource) {
        return $resource(SERVICE_URL_BASE + "resources/valintaryhma", {}, {
            get: {
                method: "GET", isArray: true, cache: false,
                params: {
                    paataso: true
                }
            }
        });
    }])

    .factory('ChildValintaryhmas', ['$resource', function ($resource) {
        return $resource(SERVICE_URL_BASE + "resources/valintaryhma/:parentOid/lapsi", {parentOid: "@parentOid"}, {
            get: {method: "GET", isArray: true, cache: false},
            insert: {method: "PUT", cache: false}
        });
    }])

    .factory('ChildHakukohdes', ['$resource', function ($resource) {
        return $resource(SERVICE_URL_BASE + "resources/valintaryhma/:oid/hakukohde", {}, {
            get: {method: "GET", isArray: true, cache: false}
        });
    }])

    //Sama kuin Hakukohderyhma mutta odottaa yksittaista tulosta!
    .factory('Valintaryhma', ['$resource', function ($resource) {
        return $resource(SERVICE_URL_BASE + "resources/valintaryhma/:oid", {oid: "@oid"}, {
            get: {method: "GET", cache: false},
            post: {method: "POST"},
            insert: {method: "PUT"},
            query: {method: "GET", isArray: true, cache: false},
            delete: {method: "DELETE"}
        });
    }])

    .factory('ValintaryhmaKopiointi', ['$resource', function ($resource) {
        return $resource(SERVICE_URL_BASE + "resources/valintaryhma/:parentOid/kopioiLapseksi", {parentOid: "@parentOid", lahdeOid: "@kopioitavaOid", nimi: "@nimi"},
            {
            put: {method: "PUT"}
        });
    }])

    .factory('ParentValintaryhmas', ['$resource', function ($resource) {
        return $resource(SERVICE_URL_BASE + "resources/valintaryhma/:parentOid/parents", {parentOid: "@parentOid"}, {
            get: {method: "GET", isArray: true, cache: false}
        });
    }])

    .factory('ValintaryhmaValinnanvaihe', ['$resource', function ($resource) {
        return $resource(SERVICE_URL_BASE + "resources/valintaryhma/:oid/valinnanvaihe", {oid: "@oid"}, {
            get: {method: "GET", isArray: true, cache: false}
        });
    }])

    .factory('NewValintaryhmaValinnanvaihe', ['$resource', function ($resource) {
        return $resource(SERVICE_URL_BASE + "resources/valintaryhma/:valintaryhmaOid/valinnanvaihe", {valintaryhmaOid: "@valintaryhmaOid"}, {
            put: {method: "PUT", cache: false}
        });
    }])

    .factory('ValintaryhmaHakukohdekoodi', ['$resource', function ($resource) {
        return $resource(SERVICE_URL_BASE + "resources/valintaryhma/:valintaryhmaOid/hakukohdekoodi", {valintaryhmaOid: "@valintaryhmaOid"}, {
            insert: {method: "PUT"}, //one
            post: {method: "POST", isArray: true} //array
        });
    }])

    .factory('ValintaryhmaValintakoekoodi', ['$resource', function ($resource) {
        return $resource(SERVICE_URL_BASE + "resources/valintaryhma/:valintaryhmaOid/valintakoekoodi", {valintaryhmaOid: "@valintaryhmaOid"}, {
            insert: {method: "PUT"}, //one
            post: {method: "POST", isArray: true} //array
        });
    }])

    .factory('KoodistoHakukohdekoodi', ['$resource', function ($resource) {
        return $resource(KOODISTO_URL_BASE + "json/hakukohteet/koodi", {}, {
            get: {method: "GET", isArray: true, cache: true}
        });
    }])

    .factory('KoodistoValintakoekoodi', ['$resource', function ($resource) {
        return $resource(KOODISTO_URL_BASE + "json/valintakokeentyyppi/koodi", {}, {
            get: {method: "get", isArray: true, cache: true}
        });
    }])

    .factory('KoodistoHaunKohdejoukko', ['$resource', function ($resource) {
        return $resource(KOODISTO_URL_BASE + "json/haunkohdejoukko/koodi", {}, {
            //return $resource(KOODISTO_URL_BASE + "codeelement/codes/haunkohdejoukko/0", {}, {
            get: {method: "get", isArray: true, cache: true}
        });
    }])


    //Hakukohde
    .factory('RootHakukohde', ['$resource', function ($resource) {
        return $resource(SERVICE_URL_BASE + "resources/hakukohde", {paataso: true}, {
            get: {method: "GET", isArray: true, cache: false}
        });
    }])

    .factory('ChildHakukohdes', ['$resource', function ($resource) {
        return $resource(SERVICE_URL_BASE + "resources/valintaryhma/:oid/hakukohde", {}, {
            get: {method: "GET", isArray: true, cache: false}
        });
    }])

    .factory('HakukohdeKuuluuSijoitteluun', ['$resource', function ($resource) {
        return $resource(SERVICE_URL_BASE + "resources/hakukohde/:oid/kuuluuSijoitteluun", {}, {
            get: {method: "GET", cache: false}
        });
    }])

    .factory('NewHakukohde', ['$resource', function ($resource) {
        return $resource(SERVICE_URL_BASE + "resources/hakukohde", {}, {
            insert: {method: "PUT", cache: false}
        });
    }])

    .factory('HakukohdeValinnanvaihe', ['$resource', function ($resource) {
        return $resource(SERVICE_URL_BASE + "resources/hakukohde/:parentOid/valinnanvaihe", {parentOid: "@parentOid"}, {
            get: {method: "GET", isArray: true, cache: false},
            post: {method: "POST"},
            insert: {method: "PUT"}
        });
    }])

    .factory('Hakukohde', ['$resource', function ($resource) {
        return $resource(SERVICE_URL_BASE + "resources/hakukohde/:oid", {oid: "@oid"}, {
            get: {method: "GET", cache: false},
            post: {method: "POST"}
        });
    }])
    .factory('HakukohdeHakukohdekoodi', ['$resource', function ($resource) {
        return $resource(SERVICE_URL_BASE + "resources/hakukohde/:hakukohdeOid/hakukohdekoodi", {hakukohdeOid: "@hakukohdeOid"}, {
            post: {method: "POST"}
        });
    }])

    .factory('HakukohdeSiirra', ['$resource', function ($resource) {
        return $resource(SERVICE_URL_BASE + "resources/hakukohde/:hakukohdeOid/siirra", {hakukohdeOid: "@hakukohdeOid"}, {
            siirra: {method: "POST"}
        });
    }])

    //Valinnanvaihe
    .factory('Valinnanvaihe', ['$resource', function ($resource) {
        return $resource(SERVICE_URL_BASE + "resources/valinnanvaihe/:oid", {oid: "@oid"}, {
            get: {method: "GET", cache: false},
            post: {method: "POST"},
            delete: {method: "DELETE"}
        });
    }])

    .factory('ValinnanvaiheValintatapajono', ['$resource', '$q', 'Valintatapajono',
        function ($resource, $q, Valintatapajono) {
            var resource = $resource(SERVICE_URL_BASE + "resources/valinnanvaihe/:parentOid/valintatapajono",
                {parentOid: "@parentOid"}, {
                get: {method: "GET", isArray: true, cache: false},
                insert: {method: "PUT"}
            });

            function populateSijoitteluUsage(valintatapajonot) {
                return $q.all(valintatapajonot.map(Valintatapajono.fetchSijoitteluUsage))
                        .then(function(sijoitteluUsage) {
                            return _.map(valintatapajonot, function(jono, index) {
                                jono.usedBySijoittelu = sijoitteluUsage[index];
                                return jono;
                            });
                        });
            }

            resource.fetchWithSijoitteluUsage = function(parentOid) {
                var deferred = $q.defer();
                resource.get({parentOid: parentOid}, function(valintatapajonot) {
                    populateSijoitteluUsage(valintatapajonot).then(function() {
                        deferred.resolve(valintatapajonot);
                    });
                });
                return deferred.promise;
            };

            return resource;
        }
    ])
    .factory('ValinnanvaiheJarjesta', ['$resource', function ($resource) {
        return $resource(SERVICE_URL_BASE + "resources/valinnanvaihe/jarjesta", {}, {
            post: {method: "POST", isArray: true}
        });
    }])
    .factory('ValinnanvaiheKuuluuSijoitteluun', ['$resource', function ($resource) {
        return $resource(SERVICE_URL_BASE + "resources/valinnanvaihe/:oid/kuuluuSijoitteluun", {}, {
            get: {method: "GET", cache: false}
        });
    }])

    .factory('ValinnanvaiheValintakoe', ['$resource', function ($resource) {
        return $resource(SERVICE_URL_BASE + "resources/valinnanvaihe/:valinnanvaiheOid/valintakoe", {valinnanvaiheOid: "@valinnanvaiheOid"}, {
            insert: {method: "PUT"},
            get: {method: "GET", isArray: true, cache: false},
            remove: {method: "REMOVE"}
        });
    }])


    //Valintakoe
    .factory('Valintakoe', ['$resource', function ($resource) {
        return $resource(SERVICE_URL_BASE + "resources/valintakoe/:valintakoeOid", {valintakoeOid: "@valintakoeOid"}, {
            get: {method: "GET", cache: false},
            update: {method: "POST"},
            delete: {method: "DELETE"}
        });
    }])


    //Valintatapajono
    .factory('Valintatapajono', ['$resource', 'LocalisationService', 'Ilmoitus', '$location', '$http', '$q',
        'IlmoitusTila', 'TarjontaHakukohde',
        function ($resource, LocalisationService, Ilmoitus, $location, $http, $q, IlmoitusTila, TarjontaHakukohde) {
            var resource = $resource(SERVICE_URL_BASE + "resources/valintatapajono/:oid", {oid: "@oid"}, {
                get: {method: "GET", cache: false},
                post: {method: "POST"},
                delete: {method: "DELETE"}
            });

            resource.fetchSijoitteluUsage = function(jono) {
                var deferred = $q.defer();
                var hakukohdeOid = $location.url().match(/hakukohde\/([^\/]+)/)[1];

                TarjontaHakukohde.get({hakukohdeoid: hakukohdeOid}, function(hakukohde) {
                    var hakuOid = hakukohde.result.hakuOid;

                    $http.get(SIJOITTELU_URL_BASE + 'resources/sijoittelu/' +
                        hakuOid + '/valintatapajono-in-use/' + jono.oid, {
                        cache: false
                    }).success(deferred.resolve);
                });

                return deferred.promise;
            };

            resource.deleteWithDialog = function(jono, checkSijoitteluUsage) {
                var deferred = $q.defer();
                var fetchSijoitteluUsage = checkSijoitteluUsage
                                            ? resource.fetchSijoitteluUsage(jono)
                                            : $q.when(false);

                if (!window.confirm(LocalisationService.tl('valintatapajono.haluatkoVarmastiPoistaa') ||
                        'Haluatko varmasti poistaa valintatapajonon?')) {
                    deferred.reject();
                } else {
                    fetchSijoitteluUsage.then(function(inUse) {
                        var msg = LocalisationService.tl('valintatapajono.eiVoiPoistaaKoskaSijoittelunKaytossa') ||
                            'Jonoa ei voi poistaa, koska se on sijoittelun käytössä';
                        if (inUse) {
                            Ilmoitus.avaa(msg, msg, IlmoitusTila.WARNING);
                            deferred.reject();
                        } else {
                            resource.delete({oid: jono.oid}, function() {
                                deferred.resolve();
                            });
                        }
                    });
                }
                return deferred.promise;
            };

            return resource
        }
    ])
    .factory('ValintatapajonoValmisSijoiteltavaksi', ['$resource', function ($resource) {
        return $resource(VALINTALASKENTA_URL_BASE + "resources/valintatapajono/:oid/valmissijoiteltavaksi", {valintatapajonoOid: "@valintatapajonoOid"}, {
            get: {method: "GET", cache: false}
        });
    }])
    .factory('ValintatapajonoJarjestyskriteeri', ['$resource', function ($resource) {
        return $resource(SERVICE_URL_BASE + "resources/valintatapajono/:parentOid/jarjestyskriteeri", {parentOid: "@parentOid"}, {
            get: {method: "GET", isArray: true, cache: false},
            insert: {method: "PUT"}
        });
    }])
    .factory('ValintatapajonoJarjesta', ['$resource', function ($resource) {
        return $resource(SERVICE_URL_BASE + "resources/valintatapajono/jarjesta", {}, {
            post: {method: "POST", isArray: true}
        });
    }])

    // Hakijaryhma
    .factory('Hakijaryhma', ['$resource', function ($resource) {
        return $resource(SERVICE_URL_BASE + "resources/hakijaryhma/:oid", {oid: "@oid"}, {
            get: {method: "GET", cache: false},
            update: {method: "POST"},
            delete: {method: "DELETE"}
        });
    }])

    .factory('ValintaryhmaHakijaryhma', ['$resource', function ($resource) {
        return $resource(SERVICE_URL_BASE + "resources/valintaryhma/:oid/hakijaryhma", {oid: "@oid"}, {
            get: {method: "GET", isArray: true, cache: false},
            insert: {method: "PUT"}
        });
    }])

    .factory('HakukohdeHakijaryhma', ['$resource', function ($resource) {
        return $resource(SERVICE_URL_BASE + "resources/hakukohde/:oid/hakijaryhma", {oid: "@oid"}, {
            get: {method: "GET", isArray: true, cache: false},
            insert: {method: "PUT"}
        });
    }])

    .factory('ValintatapajonoHakijaryhma', ['$resource', function ($resource) {
        return $resource(SERVICE_URL_BASE + "resources/valintatapajono/:oid/hakijaryhma/:hakijaryhmaOid", {
            oid: "@oid",
            hakijaryhmaOid: "@hakijaryhmaOid"
        }, {
            get: {method: "GET", isArray: true, cache: false},
            insert: {method: "PUT"}
        });
    }])

    .factory('HakijaryhmanValintatapajonot', ['$resource', function ($resource) {
        return $resource(SERVICE_URL_BASE + "resources/hakijaryhma/:oid/valintatapajono", {
            oid: "@oid",
            hakijaryhmaOid: "@hakijaryhmaOid"
        }, {
            get: {method: "GET", isArray: true, cache: false}
        });
    }])

    .factory('HakijaryhmaValintatapajono', ['$resource', function ($resource) {
        return $resource(SERVICE_URL_BASE + "resources/hakijaryhma_valintatapajono/:oid", {oid: "@oid"}, {
            get: {method: "GET", cache: false},
            delete: {method: "DELETE"},
            update: {method: "POST"}
        });
    }])

    .factory('HakijaryhmaJarjesta', ['$resource', function ($resource) {
        return $resource(SERVICE_URL_BASE + "resources/hakijaryhma/jarjesta", {}, {
            post: {method: "POST", isArray: true}
        });
    }])

    .factory('HakijaryhmaLiita', ['$resource', function ($resource) {
        return $resource(SERVICE_URL_BASE + "resources/valintatapajono/:valintatapajonoOid/hakijaryhma/:hakijaryhmaOid", {
            valintatapajonoOid: "@valintatapajonoOid",
            hakijaryhmaOid: "@hakijaryhmaOid"
        }, {
            liita: {method: "POST"}
        });
    }])

    .factory('HakijaryhmaLiitaHakukohde', ['$resource', function ($resource) {
        return $resource(SERVICE_URL_BASE + "resources/hakukohde/:hakukohdeOid/hakijaryhma/:hakijaryhmaOid", {
            hakukohdeOid: "@hakukohdeOid",
            hakijaryhmaOid: "@hakijaryhmaOid"
        }, {
            liita: {method: "POST"}
        });
    }])

    .factory('HakijaryhmaKopiointi', ['$resource', function ($resource) {
        return $resource(SERVICE_URL_BASE + "resources/hakijaryhma/siirra", {}, {put: {method: "PUT"}})
    }])

    //Järjestyskriteeri
    .factory('Jarjestyskriteeri', ['$resource', function ($resource) {
        return $resource(SERVICE_URL_BASE + "resources/jarjestyskriteeri/:oid", {oid: "@oid"}, {
            post: {method: "POST"}
        });
    }])
    .factory('JarjestyskriteeriJarjesta', ['$resource', function ($resource) {
        return $resource(SERVICE_URL_BASE + "resources/jarjestyskriteeri/jarjesta", {}, {
            post: {method: "POST", isArray: true}
        });
    }])

    .factory('TarjontaImport', ['$resource', function ($resource) {
        return $resource(VALINTALASKENTAKOOSTE_URL_BASE + "resources/hakuimport/aktivoi", {}, {
            aktivoi: {method: "GET", cache: false}
        });
    }])

    //TARJONTA RESOURCES
    .factory('Haku', ['$resource', function ($resource) {
        return $resource(TARJONTA_URL_BASE + "haku?count=500", {}, {
            get: {method: "GET", cache: true}
        });
    }])
    .factory('HaunTiedot', ['$resource', function ($resource) {
        return $resource(TARJONTA_URL_BASE + "haku/:hakuOid", {hakuOid: "@hakuOid"}, {
            get: {method: "GET", cache: true}
        });
    }])

    .factory('TarjontaHaut', function($resource) {
        return $resource(TARJONTA_URL_BASE + "haku/find?addHakukohdes=false");
    })

    .factory('TarjontaHaku', ['$resource', function ($resource) {
        return $resource(TARJONTA_URL_BASE + "haku/:hakuOid/hakukohdeTulos", {}, {
            query: {method: 'GET', isArray: false, cache: true}
        });
    }])
    .factory('HakukohdeNimi', ['$resource', function ($resource) {
        return $resource(TARJONTA_URL_BASE + "hakukohde/:hakukohdeoid/nimi", {hakukohdeoid: "@hakukohdeoid"}, {
            get: {method: "GET", cache: true}
        });
    }])

    .factory('TarjontaHakukohde', ['$resource', function ($resource) {
        return $resource(TARJONTA_URL_BASE + "hakukohde/:hakukohdeoid", {hakukohdeoid: "@hakukohdeoid"});
    }])


    .factory('Organizations', ['$resource', function ($resource) {
        return $resource(ORGANIZATION_SERVICE_URL_BASE + "rest/organisaatio/hae", {}, {
            get: {method: "GET", cache: true}
        });
    }])

    .factory('OrganizationByOid', ['$resource', function ($resource) {
        return $resource(ORGANIZATION_SERVICE_URL_BASE + "rest/organisaatio/:oid", {oid: "@oid"}, {
            get: {method: "GET", cache: true}
        });
    }])

    .factory('OrganizationParentOids', ['$resource', function ($resource) {
        return $resource(ORGANIZATION_SERVICE_URL_BASE + "rest/organisaatio/:oid/parentoids", {oid: "@oid"}, {
            get: {method: "GET", cache: true}
        });
    }])

    .factory('OrganizationChildOids', ['$resource', function ($resource) {
        return $resource(ORGANIZATION_SERVICE_URL_BASE + "rest/organisaatio/:oid/childoids", {oid: "@oid"}, {
            get: {method: "GET", cache: true}
        });
    }])

    .factory('HakujenHakutyypit', ['$resource', function ($resource) {
        return $resource(KOODISTO_URL_BASE + "codeelement/codes/hakutyyppi/1");
    }])

    .factory('HakujenKohdejoukot', ['$resource', function ($resource) {
        return $resource(KOODISTO_URL_BASE + "codeelement/codes/haunkohdejoukko/1");
    }])

    .factory('HakujenHakutavat', ['$resource', function ($resource) {
        return $resource(KOODISTO_URL_BASE + "codeelement/codes/hakutapa/1");
    }])

    .factory('HakujenHakukaudet', ['$resource', function ($resource) {
        return $resource(KOODISTO_URL_BASE + "codeelement/codes/kausi/1");
    }]);