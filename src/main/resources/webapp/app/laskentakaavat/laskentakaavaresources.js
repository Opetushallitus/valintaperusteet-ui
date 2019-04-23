'use strict';

var plainUrl = window.urls().noEncode().url;

angular.module('valintaperusteet').factory('FunktioKuvausResource', function ($resource) {

    return $resource(window.url("valintaperusteet-service.laskentakaava.funktiokuvaus"), {}, {
        get: {method: "GET", isArray: true, cache: true}
    });
})

    .factory('KaavaValidointi', function ($resource) {
        return $resource(window.url("valintaperusteet-service.laskentakaava.validoi"), {}, {
            post: {method: "POST"}
        });
    })

    .factory('KaavaSiirto', function ($resource) {
        return $resource(window.url("valintaperusteet-service.laskentakaava.siirra"), {},
            {put: {method: "PUT"}});
    })

    .factory('Laskentakaava', function ($resource) {
        return $resource(plainUrl("valintaperusteet-service.laskentakaava", ":oid"), {oid: "@oid"}, {
            list: {method: "GET", isArray: true, cache: false},
            get: {method: "GET", cache: false},
            insert: {method: "PUT"},
            update: {method: "POST"}
        });
    })

    .factory('LaskentakaavanHakuoid', function ($resource) {

        return $resource(plainUrl("valintaperusteet-service.laskentakaava.hakuoid", ":hakukohdeOid", ":valintaryhmaOid"),
            {hakukohdeOid: "@hakukohdeOid", valintaryhmaOid: "@valintaryhmaOid"},
            {get: {method: "GET"}}
        );
    })

    .factory('HakukohdeLaskentakaavat', function ($resource) {

        return $resource(plainUrl("valintaperusteet-service.hakukohde.laskentakaava", ":hakukohdeOid"),
            {hakukohdeOid: "@hakukohdeOid"},
            {get: {method: "GET", cache: false}}
        );
    })

    .factory('HakemusavaimetLisakysymykset', function ($resource) {
        return $resource(plainUrl("haku-app.application-system-form-editor.theme-question.list", ":hakuoid"), {
            hakuoid: "@hakuoid",
            orgId: "@orgId"
        }, {
            get: {method: "GET", isArray: true, cache: true}
        });
    })

    .factory('HakemusavaimetLomake', function ($resource) {
        return $resource(plainUrl("haku-app.lomake.form", ":hakuoid"), {hakuoid: "@hakuoid"}, {
            get: {method: "GET", cache: true}
        });

    });
