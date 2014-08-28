'use strict';

angular.module('valintaperusteet').factory('FunktioKuvausResource', function ($resource) {

    return $resource(SERVICE_URL_BASE + "resources/laskentakaava/funktiokuvaus", {}, {
        get: {method: "GET", isArray: true, cache: true}
    });
});

angular.module('valintaperusteet').factory('KaavaValidointi', function ($resource) {

    return $resource(SERVICE_URL_BASE + "resources/laskentakaava/validoi", {}, {
        post: {method: "POST"}
    });
});

angular.module('valintaperusteet').factory('KaavaSiirto', function ($resource) {
    'use strict';

    return $resource(SERVICE_URL_BASE + "resources/laskentakaava/siirra", {}, {put: {method: "PUT"}});
});

angular.module('valintaperusteet')

    .factory('Laskentakaava', function ($resource) {

        return $resource(SERVICE_URL_BASE + "resources/laskentakaava/:oid", {oid: "@oid"}, {
            list: {method: "GET", isArray:true},
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
        return $resource(HAKEMUS_URL_BASE + "/application-system-form-editor/theme-question/list/:hakuoid", {hakuoid: "@hakuoid"},{
            get: {method: "GET", isArray:true}
        });
    })

    .factory('HakemusavaimetLomake', function ($resource) {
        return $resource(HAKEMUS_URL_BASE + "/application-system-form-editor/application-system-form/:hakuoid", {hakuoid: "@hakuoid"});

    });
