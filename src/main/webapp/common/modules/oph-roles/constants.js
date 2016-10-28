//Constants for auth
angular.module('oph-roles')

    .constant('READ', "_READ")
    .constant('UPDATE', "_READ_UPDATE")
    .constant('CRUD', "_CRUD")

    .constant('OPH_ORG_OID', "1.2.246.562.10.00000000001")

    .constant('OID_REGEXP', /\d(\d|\.)+\d/)