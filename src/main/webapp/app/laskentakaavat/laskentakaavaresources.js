'use strict';

angular.module('LaskentakaavaEditor').factory('FunktioKuvausResource', function($resource) {
    return $resource(SERVICE_URL_BASE + "resources/laskentakaava/funktiokuvaus", {}, {
        get: {method: "GET", isArray: true}
    });
});

angular.module('LaskentakaavaEditor').factory('KaavaValidointi', function($resource) {
    return $resource(SERVICE_URL_BASE + "resources/laskentakaava/validoi", {}, {
        post: {method: "POST"}
    });
});

angular.module('LaskentakaavaEditor').factory('Laskentakaava', function($resource) {
 return $resource(SERVICE_URL_BASE + "resources/laskentakaava/:oid", {oid: "@oid"}, {
     list: {method: "GET", isArray: true},
     get: {method: "GET"},
     insert: {method: "PUT"},
     update: {method: "POST"},
     updateMetadata: {method: "POST", params: {metadata: "true"}}
   });
});

angular.module('LaskentakaavaEditor').factory('HakukohdeLaskentakaavat', function($resource) {
    return $resource(SERVICE_URL_BASE + "resources/hakukohde/:hakukohdeOid/laskentakaava", {hakukohdeOid: "@hakukohdeOid"}, {
        get: {method: "GET"}
    });
});

