
var CAS_URL = CAS_URL || "/cas/myroles";
var ORGANISAATIO_URL_BASE = ORGANISAATIO_URL_BASE;

//Constants for auth
angular.module('valintaperusteet')

    .constant('READ', "_READ")
    .constant('UPDATE', "_READ_UPDATE")
    .constant('CRUD', "_CRUD")

    .constant('OPH_ORG_OID', "1.2.246.562.10.00000000001")

    .constant('ORGANISAATIO_URL_BASE', ORGANIZATION_SERVICE_URL_BASE + "rest/")

    .constant('OID_REGEXP', /\d(\d|\.)+\d/)