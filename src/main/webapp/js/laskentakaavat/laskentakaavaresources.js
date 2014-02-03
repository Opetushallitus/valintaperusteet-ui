'use strict';

laskentakaavaEditor.factory('FunktioKuvausResource', function($resource) {
    return $resource(SERVICE_URL_BASE + "resources/laskentakaava/funktiokuvaus", {}, {
        get: {method: "GET", isArray: true}
    });
});

laskentakaavaEditor.factory('KaavaValidointi', function($resource) {
    return $resource(SERVICE_URL_BASE + "resources/laskentakaava/validoi", {}, {
        post: {method: "POST"}
    })
});

laskentakaavaEditor.factory('Laskentakaava', function($resource) {
 return $resource(SERVICE_URL_BASE + "resources/laskentakaava/:oid", {oid: "@oid"}, {
     list: {method: "GET", isArray: true},
     get: {method: "GET"},
     insert: {method: "PUT"},
     update: {method: "POST"},
     updateMetadata: {method: "POST", params: {metadata: "true"}}
   });
});

laskentakaavaEditor.factory('HakukohdeLaskentakaavat', function($resource) {
    return $resource(SERVICE_URL_BASE + "resources/hakukohde/:hakukohdeOid/laskentakaava", {hakukohdeOid: "@hakukohdeOid"}, {
        get: {method: "GET"}
    })
});

