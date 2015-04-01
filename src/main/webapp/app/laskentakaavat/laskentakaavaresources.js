'use strict';

angular.module('valintaperusteet').factory('FunktioKuvausResource', function ($resource) {

    return $resource(SERVICE_URL_BASE + "resources/laskentakaava/funktiokuvaus", {}, {
        get: {method: "GET", isArray: true, cache: true}
    });
})

    .factory('KaavaValidointi', function ($resource) {
        return $resource(SERVICE_URL_BASE + "resources/laskentakaava/validoi", {}, {
            post: {method: "POST"}
        });
    })

    .factory('KaavaSiirto', function ($resource) {
        return $resource(SERVICE_URL_BASE + "resources/laskentakaava/siirra", {}, {put: {method: "PUT"}});
    })

    .factory('Laskentakaava', function ($resource) {
        return $resource(SERVICE_URL_BASE + "resources/laskentakaava/:oid", {oid: "@oid"}, {
            list: {method: "GET", isArray: true},
            get: {method: "GET"},
            insert: {method: "PUT"},
            update: {method: "POST"},
            updateMetadata: {method: "POST", params: {metadata: "true"}}
        });
    })

    .factory('LaskentakaavaValintaryhma', function ($resource) {

        return $resource(SERVICE_URL_BASE + "resources/laskentakaava/:oid/valintaryhma", {oid: "@oid"}, {
            get: {method: "GET"}
        });
    })

    .factory('HakukohdeLaskentakaavat', function ($resource) {

        return $resource(SERVICE_URL_BASE + "resources/hakukohde/:hakukohdeOid/laskentakaava", {hakukohdeOid: "@hakukohdeOid"}, {
            get: {method: "GET"}
        });
    })

    .factory('HakemusavaimetLisakysymykset', function ($resource) {
        return $resource(HAKEMUS_URL_BASE + "/application-system-form-editor/theme-question/list/:hakuoid", {
            hakuoid: "@hakuoid",
            orgId: "@orgId"
        }, {
            get: {method: "GET", isArray: true}
        });
    })

    .factory('HakemusavaimetLomake', function ($resource) {
        return $resource(HAKEMUS_URL_BASE + "/lomake/:hakuoid/form", {hakuoid: "@hakuoid"});

    });
