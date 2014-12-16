

angular.module('user')

    .constant('READ', "_READ")
    .constant('UPDATE', "_READ_UPDATE")
    .constant('CRUD', "_CRUD")
    .constant('OID_REGEXP', /\d(\d|\.)+\d/)

    .service('RoleParser', ['_', 'READ', 'UPDATE', 'CRUD', 'OID_REGEXP', function (_, READ, UPDATE, CRUD, OID_REGEXP) {
        var that = this;
        
        this.getParsedRoles = function (myRoles, appRoles) {
            var RIGHT_LEVELS = [CRUD, UPDATE, READ];
            var roles =  _.map(appRoles, function (appRole) {
                var appRoleObj = {
                    app: appRole
                };

                var oidRegExp = new RegExp(OID_REGEXP);

                var filtered = _.filter(myRoles, function (myRole) {

                    if(myRole.search(oidRegExp) >= 0) {
                        console.log(myRole.slice(myRole.search(oidRegExp), myRole.length));
                    }


                    return myRole.indexOf(appRole) >= 0;

                });
                
                return filtered;

            });


            function isKorkeakouluRole(myRole, appRole) {
                console.log(myRole.slice(0, appRole.length));
            }
            
        };
        
        this.containsOid = function (myRole) {
            return OID_REGEXP.test(myRole);
        };
        
        this.getOrganizations = function (myRoles, appRole) {
            _.filter(myRoles, function (myRole) {

            });
        };

        //Get the items from myRoles list that include appRole -string
        this.getMyAppRole = function (myRoles, appRole) {
            return _.filter(myRoles, function (myRole) {
                return myRole.indexOf(appRole) >= 0;
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