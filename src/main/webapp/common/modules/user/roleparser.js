

angular.module('valintaperusteet')

    .constant('READ', "_READ")
    .constant('UPDATE', "_READ_UPDATE")
    .constant('CRUD', "_CRUD")

    .constant('OID_REGEXP', /\d(\d|\.)+\d/)

    //AppRole == part of a role in myroles list - for example APP_VALINTAPERUSTEET & APP_VALINTOJENTOTEUTTAMINEN are AppRoles
    .service('RoleParser', ['$log', '_', 'READ', 'UPDATE', 'CRUD', 'OID_REGEXP',
                    function ($log, _, READ, UPDATE, CRUD, OID_REGEXP) {

        var api = this;
        
        this.getParsedRoles = function (myRoles, apps) {
            var accessLeveltokens = [CRUD, UPDATE, READ];
            var rolesWithMyApp = api.getRolesWithApps(myRoles, apps);

            //parse rightlevels for each organization in roles
            return _.map(apps, function (app) {
                var appRightLevel = 'READ';

                //parse oids and highest corresponding level of rights for each oid
                var rolesByApp = api.getRolesByApp(rolesWithMyApp, app);
                var organizationRights = api.getOrganizationRights(rolesByApp);

                return {
                    app: app,
                    rightsLevel: appRightLevel,
                    organizationRights: organizationRights
                };
            });
        };

        /**
         *  Get roles that include one of the apps in apps
         *
         * @param {myroles#Array, apps#Array}
         * @returns {Array} roles
         */
        this.getRolesWithApps = function (roles, apps) {
            //filter out roles that aren't in apps-array
            return _.filter(roles, function (item) {
                return _.some(apps, function (app) {
                    return _.startsWith(item, app);
                });
            });
        };

        /**
         * Get organizations and highest corresponding rightlevel for them
         *
         * @param {myroles#Array}
         * @returns {Array} of objects containing oid and corresponding rightlevel
         */
        this.getOrganizationRights = function (roles) {
            return _(roles)
                .filter(function (approle) {
                    return api.containsOid(approle) && !_.isEmpty(api.getRoleRightLevel(approle));
                })
                .map(function (approle) {
                    return {
                        rightLevel: api.getRoleRightLevel(approle),
                        oid: api.getOrganizationOid(approle)
                    };
                })
                .value();
        };
        

        /**
         *   Parse out roles that aren't exact matches for app (e.g. APP_VALINTAPERUSTEET vs. APP_VALINTAPERUSTEETKK)
         *
         * @param {myroles#Array, app#String}
         * @returns {Array} roles
         */
        this.getRolesByApp = function (roles, app) {
            return _.filter(roles, function (role) {
                return _.some(accessLeveltokens, function (accessLevelToken) {
                    return app === role || _.startsWith(role, app + "_");
                });
            });
        };

        /**
         *  Search for rightlevel-string in role
         *
         * @param {role} a role from myroles
         * @returns {String} returns CRUD, READ_UPDATE, READ or undefined rightlevel isn't found
         */
        this.getRoleRightLevel = function (role) {
            var accessLeveltokens = ["CRUD", "READ_UPDATE", "READ"];
            var rightLevel = undefined;

            _.some(accessLeveltokens, function (token) {
                if(role.indexOf(token) >= 0) {

                    rightLevel = token;
                    return true;
                }
            });

            return rightLevel;
        };

        /**
         *  Does this role contain an oid
         *
         * @param {role} a role from myroles
         * @returns {Boolean} role contains oid
         */
        this.containsOid = function (role) {
            return OID_REGEXP.test(role);
        };

        /**
         *  get oid-string from role
         *
         * @param {role} a role from myroles
         * @returns {String} organization oid found from role
         */
        this.getOrganizationOid = function(role) {
            if(!api.containsOid(role)) {
                $log.error('Oidin parsiminen käyttäjän epäonnistui roolista: ', role);
                return;
            }
            return role.match(OID_REGEXP)[0];
        };

    }]);

