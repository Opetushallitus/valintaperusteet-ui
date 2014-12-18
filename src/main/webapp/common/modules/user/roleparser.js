

angular.module('user')

    .constant('READ', "_READ")
    .constant('UPDATE', "_READ_UPDATE")
    .constant('CRUD', "_CRUD")
    .constant('OID_REGEXP', /\d(\d|\.)+\d/)



    //AppRole == part of a role in myroles list - for example APP_VALINTAPERUSTEET & APP_VALINTOJENTOTEUTTAMINEN are AppRoles
    .service('RoleParser', ['$log', '_', 'READ', 'UPDATE', 'CRUD', 'OID_REGEXP',
                    function ($log, _, READ, UPDATE, CRUD, OID_REGEXP) {

        var that = this;
        
        this.getParsedRoles = function (myRoles, appRoles) {
            var RIGHT_LEVELS = [CRUD, UPDATE, READ];
            var roles =  _.map(appRoles, function (appRole) {
                var appRoleObj = {
                    app: appRole
                };

                var oidRegExp = new RegExp(OID_REGEXP);

                var filtered = _.filter(myRoles, function (myRole) {
                    that.matchesAppRole(appRole, myRole);

                    if(myRole.search(oidRegExp) >= 0) {
                        console.log(myRole.slice(myRole.search(oidRegExp), myRole.length));
                    }


                    return myRole.indexOf(appRole) >= 0;

                });
                
                return filtered;

            });


            function isKorkeakouluRole(myRole, appRole) {

            }
            
        };

        this.getOrganizationOidsByAppRole = function () {
            
        };


        //check that myRole includes appRole and appRole isn't a substring of another appRole
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
            if(!that.containsOid(myRole)) {
                $log.error('Oidin parsiminen käyttäjän epäonnistui roolista: ', myRole);
                return;
            }
            return myRole.match(OID_REGEXP)[0];
        };
        
        this.getOrganizations = function (myRoles, appRole) {
            _.filter(myRoles, function (myRole) {

            });
        };

        //Get the items from myRoles list that include appRole -string
        this.getMyAppRoles = function (myRoles, appRole) {
            return _.filter(myRoles, function (myRole) {
                return that.matchesAppRole(appRole, myRole);
            });
        };
        
        
    }]);

/*
[
    {
        app: APP_VALINTAPERUSTEET,
        rights: [
            {
                
            }
        ]
    },
    {
        app:
    }
]
    */