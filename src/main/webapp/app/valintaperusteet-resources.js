var plainUrl = window.urls().noEncode().url;

angular.module('valintaperusteet')


    // HAKU-APP
    .factory('HakemusAvaimet', ['$resource', function ($resource) {
        return $resource(plainUrl("haku-app.application-system-form-editor.application-system-form", ":asId"),
            {asId: "@asId"},
            {get: {method: "GET", isArray: false, cache: true}
        });
    }])

    .factory('HakemusLisakysymykset', ['$resource', function ($resource) {
        return $resource(plainUrl("haku-app.application-system-form-editor.theme-question.list", ":asId"), {asId: "@asId"}, {
            get: {method: "GET", isArray: false, cache: true}
        });
    }])

    //Valintaryhma
    .factory('ValintaperusteetPuu', ['$resource', function ($resource) {
        return $resource(window.url("valintaperusteet-service.puu"), {
            q: "@q",
            hakuOid: "@hakuOid",
            tila: "@tila",
            kohdejoukko: "@kohdejoukko"
        }, {
            get: {method: "GET", isArray: true, cache: false}
        });
    }])


    .factory('RootValintaryhmas', ['$resource', function ($resource) {
        return $resource(window.url("valintaperusteet-service.valintaryhma"), {}, {
            get: {
                method: "GET", isArray: true, cache: false,
                params: {
                    paataso: true
                }
            }
        });
    }])

    .factory('ChildValintaryhmas', ['$resource', function ($resource) {
        return $resource(plainUrl("valintaperusteet-service.valintaryhma.lapsi", ":parentOid"),
            {parentOid: "@parentOid"},
            {
                get: {method: "GET", isArray: true, cache: false},
                insert: {method: "PUT", cache: false}
            }
        );
    }])

    .factory('ChildHakukohdes', ['$resource', function ($resource) {
        return $resource(plainUrl("valintaperusteet-service.valintaryhma.hakukohde", ":oid"), {}, {
            get: {method: "GET", isArray: true, cache: false}
        });
    }])

    //Sama kuin Hakukohderyhma mutta odottaa yksittaista tulosta!
    .factory('Valintaryhma', ['$resource', function ($resource) {
        return $resource(plainUrl("valintaperusteet-service.valintaryhma.oid", ":oid"), {oid: "@oid"}, {
            get: {method: "GET", cache: false},
            post: {method: "POST"},
            insert: {method: "PUT"},
            query: {method: "GET", isArray: true, cache: false},
            delete: {method: "DELETE"}
        });
    }])

    .factory('ValintaryhmaKopiointi', ['$resource', function ($resource) {
        return $resource(plainUrl("valintaperusteet-service.valintaryhma.kopioilapseksi", ":parentOid"),
            {parentOid: "@parentOid", lahdeOid: "@kopioitavaOid", nimi: "@nimi"},
            {put: {method: "PUT", timeout: 300000}}
        );
    }])

    .factory('ValintaryhmaKopiointiJuureen', ['$resource', function ($resource) {
        return $resource(plainUrl("valintaperusteet-service.valintaryhma.kopioijuureen"),
            {lahdeOid: "@kopioitavaOid", nimi: "@nimi"},
            {put: {method: "PUT", timeout: 300000}}
        );
    }])

    .factory('ParentValintaryhmas', ['$resource', function ($resource) {
        return $resource(plainUrl("valintaperusteet-service.valintaryhma.parents", ":parentOid"), {parentOid: "@parentOid"}, {
            get: {method: "GET", isArray: true, cache: false}
        });
    }])

    .factory('ValintaryhmaValinnanvaihe', ['$resource', function ($resource) {
        return $resource(plainUrl("valintaperusteet-service.valintaryhma.valinnanvaihe", ":oid"),
            {oid: "@oid"},
            {get: {method: "GET", isArray: true, cache: false}}
        );
    }])

    .factory('NewValintaryhmaValinnanvaihe', ['$resource', function ($resource) {
        return $resource(plainUrl("valintaperusteet-service.valintaryhma.valinnanvaihe", ":valintaryhmaOid"),
            {valintaryhmaOid: "@valintaryhmaOid"},
            {put: {method: "PUT", cache: false}}
        );
    }])

    .factory('ValintaryhmaHakukohdekoodi', ['$resource', function ($resource) {
        return $resource(plainUrl("valintaperusteet-service.valintaryhma.hakukohdekoodi", ":valintaryhmaOid"),
            {valintaryhmaOid: "@valintaryhmaOid"},
            {
                insert: {method: "PUT"},
                post: {method: "POST", isArray: true}
            });
    }])

    .factory('ValintaryhmaValintakoekoodi', ['$resource', function ($resource) {
        return $resource(plainUrl("valintaperusteet-service.valintaryhma.valintakoekoodi", ":valintaryhmaOid"),
            {valintaryhmaOid: "@valintaryhmaOid"},
            {
                insert: {method: "PUT"},
                post: {method: "POST", isArray: true}
            });
    }])

    .factory('KoodistoHakukohdekoodi', ['$resource', function ($resource) {
        return $resource(window.url("koodisto-service.hakukohteet.koodi"), {}, {
            get: {method: "GET", isArray: true, cache: true}
        });
    }])

    .factory('KoodistoAikuHakukohdekoodi', ['$resource', function ($resource) {
        return $resource(window.url("koodisto-service.aikuhakukohteet.koodi"), {}, {
            get: {method: "GET", isArray: true, cache: true}
        });
    }])

    .factory('KoodistoValintakoekoodi', ['$resource', function ($resource) {
        return $resource(window.url("koodisto-service.valintakokeentyyppi.koodi"), {}, {
            get: {method: "get", isArray: true, cache: true}
        });
    }])

    .factory('KoodistoHaunKohdejoukko', ['$resource', function ($resource) {
        return $resource(window.url("koodisto-service.haunkohdejoukko.koodi"), {}, {
            get: {method: "get", isArray: true, cache: true}
        });
    }])

    .factory('KoodistoHakijaryhmatyyppikoodi', ['$resource', function ($resource) {
        return $resource(window.url("koodisto-service.hakijaryhmantyypit.koodi"), {}, {
            get: {method: "GET", isArray: true, cache: true}
        });
    }])

    .factory('KoodistoSyotettavanarvonkoodi', ['$resource', function ($resource) {
        return $resource(window.url("koodisto-service.syotettavanarvontyypit.koodi"), {}, {
            get: {method: "GET", isArray: true, cache: true}
        });
    }])

    //Hakukohde
    .factory('RootHakukohde', ['$resource', function ($resource) {
        return $resource(window.url("valintaperusteet-service.hakukohde"), {paataso: true}, {
            get: {method: "GET", isArray: true, cache: false}
        });
    }])

    .factory('ChildHakukohdes', ['$resource', function ($resource) {
        return $resource(plainUrl("valintaperusteet-service.valintaryhma.hakukohde", ":oid"), {}, {
            get: {method: "GET", isArray: true, cache: false}
        });
    }])

    .factory('HakukohdeKuuluuSijoitteluun', ['$resource', function ($resource) {
        return $resource(plainUrl("valintaperusteet-service.hakukohde.kuuluusijoitteluun", ":oid"), {}, {
            get: {method: "GET", cache: false}
        });
    }])

    .factory('NewHakukohde', ['$resource', function ($resource) {
        return $resource(window.url("valintaperusteet-service.hakukohde"), {}, {
            insert: {method: "PUT", cache: false}
        });
    }])

    .factory('HakukohdeValinnanvaihe', ['$resource', function ($resource) {
        return $resource(plainUrl("valintaperusteet-service.hakukohde.valinnanvaihe", ":parentOid"),
            {parentOid: "@parentOid"},
            {
                get: {method: "GET", isArray: true, cache: false},
                post: {method: "POST"},
                insert: {method: "PUT"}
            });
    }])

    .factory('Hakukohde', ['$resource', function ($resource) {
        return $resource(plainUrl("valintaperusteet-service.hakukohde.oid", ":oid"), {oid: "@oid"}, {
            get: {method: "GET", cache: false},
            post: {method: "POST"}
        });
    }])
    .factory('HakukohdeHakukohdekoodi', ['$resource', function ($resource) {
        return $resource(plainUrl("valintaperusteet-service.hakukohde.hakukohdekoodi", ":hakukohdeOid"),
            {hakukohdeOid: "@hakukohdeOid"},
            {post: {method: "POST"}}
        );
    }])

    .factory('HakukohdeSiirra', ['$resource', function ($resource) {
        return $resource(plainUrl("valintaperusteet-service.hakukohde.siirra", ":hakukohdeOid"),
            {hakukohdeOid: "@hakukohdeOid"},
            {siirra: {method: "POST"}}
        );
    }])

    .factory('Valinnanvaihe', ['$resource', function ($resource) {
        return $resource(plainUrl("valintaperusteet-service.valinnanvaihe", ":oid"), {oid: "@oid"}, {
            get: {method: "GET", cache: false},
            post: {method: "POST"},
            delete: {method: "DELETE"}
        });
    }])

    .factory('ValinnanvaiheValintatapajono', ['$resource', '$q', 'Valintatapajono',
        function ($resource, $q, Valintatapajono) {
            var resource = $resource(plainUrl("valintaperusteet-service.valinnanvaihe.valintatapajono", ":parentOid"),
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
        return $resource(window.url("valintaperusteet-service.valinnanvaihe.jarjesta"), {}, {
            post: {method: "POST", isArray: true}
        });
    }])
    .factory('ValinnanvaiheKuuluuSijoitteluun', ['$resource', function ($resource) {
        return $resource(plainUrl("valintaperusteet-service.valinnanvaihe.kuuluusijoitteluun", ":oid"), {}, {
            get: {method: "GET", cache: false}
        });
    }])

    .factory('ValinnanvaiheValintakoe', ['$resource', function ($resource) {
        return $resource(plainUrl("valintaperusteet-service.valinnanvaihe.valintakoe", ":valinnanvaiheOid"),
            {valinnanvaiheOid: "@valinnanvaiheOid"},
            {
                insert: {method: "PUT"},
                get: {method: "GET", isArray: true, cache: false},
                remove: {method: "REMOVE"}
            });
    }])


    //Valintakoe
    .factory('Valintakoe', ['$resource', function ($resource) {
        return $resource(plainUrl("valintaperusteet-service.valintakoe", ":valintakoeOid"),
            {valintakoeOid: "@valintakoeOid"},
            {
                get: {method: "GET", cache: false},
                update: {method: "POST"},
                delete: {method: "DELETE"}
            });
    }])


    //Valintatapajono
    .factory('Valintatapajono', ['$resource', 'LocalisationService', 'Ilmoitus', '$location', '$http', '$q',
        'IlmoitusTila', 'TarjontaHakukohde',
        function ($resource, LocalisationService, Ilmoitus, $location, $http, $q, IlmoitusTila, TarjontaHakukohde) {
            var resource = $resource(plainUrl("valintaperusteet-service.valintatapajono", ":oid"), {oid: "@oid"}, {
                get: {method: "GET", cache: false},
                post: {method: "POST"},
                delete: {method: "DELETE"}
            });

            resource.auth = function() {
                var deferred = $q.defer();

                $http.get(window.url("valinta-tulos-service.login")
                    ).success(function () {
                        deferred.resolve();
                    });

                return deferred.promise;
            };

            resource.fetchSijoitteluUsage = function(jono) {
                var deferred = $q.defer();

                resource.auth().then(function() {
                    $http.get(window.url("valinta-tulos-service.valinnan-tulos", jono.oid), {
                        cache: false
                    }).success(function (result) {
                        var isInUse = result.length !== 0;
                        deferred.resolve(isInUse);
                    });
                });

                return deferred.promise;
            };

            resource.deleteWithDialog = function(jono) {
                var deferred = $q.defer();
                var fetchSijoitteluUsage = resource.fetchSijoitteluUsage(jono);

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
        return $resource(plainUrl("valintalaskenta-laskenta-service.valintatapajono.valmissijoiteltavaksi", ":oid"),
            {valintatapajonoOid: "@valintatapajonoOid"},
            {get: {method: "GET", cache: false}
        });
    }])
    .factory('ValintatapajonoJarjestyskriteeri', ['$resource', function ($resource) {
        return $resource(plainUrl("valintaperusteet-service.valintatapajono.jarjestyskriteeri", ":parentOid"),
            {parentOid: "@parentOid"},
            {
                get: {method: "GET", isArray: true, cache: false},
                insert: {method: "PUT"}
            });
    }])
    .factory('ValintatapajonoJarjesta', ['$resource', function ($resource) {
        return $resource(window.url("valintaperusteet-service.valintatapajono.jarjesta"), {}, {
            post: {method: "POST", isArray: true}
        });
    }])

    // Hakijaryhma
    .factory('Hakijaryhma', ['$resource', function ($resource) {
        return $resource(plainUrl("valintaperusteet-service.hakijaryhma", ":oid"), {oid: "@oid"}, {
            get: {method: "GET", cache: false},
            update: {method: "POST"},
            delete: {method: "DELETE"}
        });
    }])
    .factory('HakijaryhmaJarjesta', ['$resource', function ($resource) {
        return $resource(window.url("valintaperusteet-service.hakijaryhma.jarjesta"), {}, {
            post: {method: "POST", isArray: true}
        });
    }])


    .factory('ValintaryhmaHakijaryhma', ['$resource', function ($resource) {
        return $resource(plainUrl("valintaperusteet-service.valintaryhma.hakijaryhma", ":oid"), {oid: "@oid"}, {
            get: {method: "GET", isArray: true, cache: false},
            insert: {method: "PUT"}
        });
    }])

    .factory('HakukohdeHakijaryhma', ['$resource', function ($resource) {
        return $resource(plainUrl("valintaperusteet-service.hakukohde.hakijaryhma", ":oid"), {oid: "@oid"}, {
            get: {method: "GET", isArray: true, cache: false},
            insert: {method: "PUT"}
        });
    }])

    .factory('HakukohdeHakijaryhmaJarjesta', ['$resource', function ($resource) {
        return $resource(window.url("valintaperusteet-service.hakukohde.hakijaryhma.jarjesta"), {}, {
            post: {method: "POST", isArray: true}
        });
    }])

    .factory('ValintatapajonoHakijaryhma', ['$resource', function ($resource) {
        return $resource(plainUrl("valintaperusteet-service.valintatapajono.hakijaryhma", ":oid", ":hakijaryhmaOid"), {
            oid: "@oid",
            hakijaryhmaOid: "@hakijaryhmaOid"
        }, {
            get: {method: "GET", isArray: true, cache: false},
            insert: {method: "PUT"}
        });
    }])

    .factory('HakijaryhmaValintatapajono', ['$resource', function ($resource) {
        return $resource(plainUrl("valintaperusteet-service.hakijaryhma_valintatapajono", ":oid"), {oid: "@oid"}, {
            get: {method: "GET", cache: false},
            delete: {method: "DELETE"},
            update: {method: "POST"}
        });
    }])

    .factory('HakijaryhmaLiita', ['$resource', function ($resource) {
        return $resource(plainUrl("valintaperusteet-service.valintatapajono.hakijaryhma", ":valintatapajonoOid", ":hakijaryhmaOid"), {
            valintatapajonoOid: "@valintatapajonoOid",
            hakijaryhmaOid: "@hakijaryhmaOid"
        }, {
            liita: {method: "POST"}
        });
    }])

    .factory('HakijaryhmaLiitaHakukohde', ['$resource', function ($resource) {
        return $resource(plainUrl("valintaperusteet-service.hakukohde.hakijaryhma.oid", ":hakukohdeOid", ":hakijaryhmaOid"), {
            hakukohdeOid: "@hakukohdeOid",
            hakijaryhmaOid: "@hakijaryhmaOid"
        }, {
            liita: {method: "POST"}
        });
    }])

    .factory('HakijaryhmaKopiointi', ['$resource', function ($resource) {
        return $resource(window.url("valintaperusteet-service.hakijaryhma.siirra"), {}, {put: {method: "PUT"}})
    }])

    //Järjestyskriteeri
    .factory('Jarjestyskriteeri', ['$resource', function ($resource) {
        return $resource(plainUrl("valintaperusteet-service.jarjestyskriteeri", ":oid"), {oid: "@oid"}, {
            post: {method: "POST"}
        });
    }])
    .factory('JarjestyskriteeriJarjesta', ['$resource', function ($resource) {
        return $resource(window.url("valintaperusteet-service.jarjestyskriteeri.jarjesta"), {}, {
            post: {method: "POST", isArray: true}
        });
    }])

    .factory('TarjontaImport', ['$resource', function ($resource) {
        return $resource(window.url("valintalaskentakoostepalvelu.hakuimport.aktivoi"), {}, {
            aktivoi: {method: "GET", cache: false}
        });
    }])

    //TARJONTA RESOURCES
    .factory('Haku', ['$resource', function ($resource) {
        return $resource(window.url("tarjonta-service.haku", {count : 500}), {}, {
            get: {method: "GET", cache: true}
        });
    }])
    .factory('HaunTiedot', ['$resource', function ($resource) {
        return $resource(plainUrl("tarjonta-service.haku.oid", ":hakuOid"), {hakuOid: "@hakuOid"}, {
            get: {method: "GET", cache: true}
        });
    }])

    .factory('TarjontaHaut', function($resource) {
        return $resource(window.url("tarjonta-service.haku.find", {addHakukohdes : "false", cache: "true"}),
            {virkailijaTyyppi: "@virkailijaTyyppi"},
            {get: {method: "GET", cache: false}});
    })

    .factory('TarjontaHaku', ['$resource', function ($resource) {
        return $resource(plainUrl("tarjonta-service.haku.hakukohdetulos", ":hakuOid"), {}, {
            query: {method: 'GET', isArray: false, cache: true}
        });
    }])
    .factory('HakukohdeNimi', ['$resource', function ($resource) {
        return $resource(plainUrl("tarjonta-service.hakukohde.nimi", ":hakukohdeoid"), {hakukohdeoid: "@hakukohdeoid"}, {
            get: {method: "GET", cache: true}
        });
    }])

    .factory('TarjontaHakukohde', ['$resource', function ($resource) {
        return $resource(plainUrl("tarjonta-service.hakukohde.oid", ":hakukohdeoid"), {hakukohdeoid: "@hakukohdeoid"});
    }])


    .factory('Organizations', ['$resource', function ($resource) {
        return $resource(window.url("organisaatio-service.organisaatio.hae"), {}, {
            get: {method: "GET", cache: true}
        });
    }])

    .factory('OrganizationByOid', ['$resource', function ($resource) {
        return $resource(plainUrl("organisaatio-service.organisaatio", ":oid"), {oid: "@oid"}, {
            get: {method: "GET", cache: true}
        });
    }])

    .factory('OrganizationParentOids', ['$resource', function ($resource) {
        return $resource(plainUrl("organisaatio-service.organisaatio.parentoids", ":oid"), {oid: "@oid"}, {
            get: {method: "GET", cache: true}
        });
    }])

    .factory('OrganizationChildOids', ['$resource', function ($resource) {
        return $resource(plainUrl("organisaatio-service.organisaatio.childoids", ":oid"), {oid: "@oid"}, {
            get: {method: "GET", cache: true}
        });
    }])

    .factory('HakujenHakutyypit', ['$resource', function ($resource) {
        return $resource(window.url("koodisto-service.codeelement.codes.hakutyyppi.1"));
    }])

    .factory('HakujenKohdejoukot', ['$resource', function ($resource) {
        return $resource(window.url("koodisto-service.codeelement.codes.haunkohdejoukko.1"));
    }])

    .factory('HakujenHakutavat', ['$resource', function ($resource) {
        return $resource(window.url("koodisto-service.codeelement.codes.hakutapa.1"));
    }])

    .factory('HakujenHakukaudet', ['$resource', function ($resource) {
        return $resource(window.url("koodisto-service.codeelement.codes.kausi.1"));
    }])

    .factory('Hakijaryhmientyyppikoodit', ['$resource', function ($resource) {
        return $resource(window.url("koodisto-service.codeelement.codes.hakijaryhmatyypit.1"));
    }])

    .factory('Syotettavanarvonkoodit', ['$resource', function ($resource) {
        return $resource(window.url("koodisto-service.codeelement.codes.syotettavanarvontyypit.1"), {
            get: {method: "GET", isArray: true, cache: false}
        });
    }]);
