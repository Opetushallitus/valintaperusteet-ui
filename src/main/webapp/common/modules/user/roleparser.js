

angular.module('user')

    .constant('READ', "_READ")
    .constant('UPDATE', "_READ_UPDATE")
    .constant('CRUD', "_CRUD")
    .constant('OID_REGEXP', /\d(\d|\.)+\d/)



    //AppRole == part of a role in myroles list - for example APP_VALINTAPERUSTEET & APP_VALINTOJENTOTEUTTAMINEN are AppRoles
    .service('RoleParser', ['$log', '_', 'READ', 'UPDATE', 'CRUD', 'OID_REGEXP',
                    function ($log, _, READ, UPDATE, CRUD, OID_REGEXP) {

        var api = this;
        
        this.getParsedRoles = function (myRoles, appRoles) {
            var RoleParser = [CRUD, UPDATE, READ];
            var roles =  _.map(appRoles, function (appRole) {
                var appRoleObj = {
                    app: appRole
                };

                var oidRegExp = new RegExp(OID_REGEXP);

                var filtered = [];
                //var filtered = _.filter(myRoles, function (myRole) {
                //    api.matchesAppRole(appRole, myRole);
                //
                //    if(myRole.search(oidRegExp) >= 0) {
                //        console.log(myRole.slice(myRole.search(oidRegExp), myRole.length));
                //    }
                //
                //
                //    return myRole.indexOf(appRole) >= 0;
                //
                //});
                
                return filtered;

            });

        };

        this.getOrganizationOidsByAppRole = function () {
            
        };


        //check api myRole includes appRole and appRole isn't a substring of another appRole
        this.matchesAppRole = function (appRole, myRole) {

            if(myRole.indexOf(appRole) >= 0) {
                var sliced = myRole.slice(appRole.length, myRole.length);
                if(sliced.length === 0 || sliced.indexOf(READ) == 0 || sliced.indexOf(UPDATE) == 0 || sliced.indexOf(CRUD) == 0) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        };
        
        this.containsOid = function (myRole) {
            return OID_REGEXP.test(myRole);
        };

        this.getRoleOrganizationOid = function(myRole) {
            if(!api.containsOid(myRole)) {
                $log.error('Oidin parsiminen käyttäjän epäonnistui roolista: ', myRole);
                return;
            }
            return myRole.match(OID_REGEXP)[0];
        };
        
        //Get the items from myRoles list that include appRole -string
        this.getMyAppRoles = function (myRoles, appRole) {
            return _.filter(myRoles, function (myRole) {
                return api.matchesAppRole(appRole, myRole);
            });
        };
                        
        this.getMyRolesWithOrganizationAndAppRole = function (myRoles, appRole) {
            return _.filter(api.getMyAppRoles(myRoles, appRole), function (role) {
                return api.containsOid(role);
            });
        };

        this.getOrganizationsByAppRole = function (myRoles, appRole) {
            return _.uniq(_.map(api.getMyRolesWithOrganizationAndAppRole(myRoles, appRole), function (myAppRole) {
                return api.getRoleOrganizationOid(myAppRole);
            }));
        };
        
        
    }]);

