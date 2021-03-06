angular
  .module('oph-roles', ['lodash'])

  //AppRole == part of a role in myroles list - for example APP_VALINTAPERUSTEET & APP_VALINTOJENTOTEUTTAMINEN are AppRoles
  .service('RoleParser', [
    '$log',
    '_',
    'READ',
    'UPDATE',
    'CRUD',
    'OID_REGEXP',
    'OPH_ORG_OID',
    function ($log, _, READ, UPDATE, CRUD, OID_REGEXP, OPH_ORG_OID) {
      var api = this

      /**
       * Parse rights for the services defined in services-parameter and for the organizations (and their accessLevel) for the services
       *
       * @param {Object, Array}
       * @returns {Array} of objects containing service, its access level and services organizations and their accesslevels
       */
      this.parseRoles = function (myRoles, services) {
        var rolesArr = myRoles.myroles

        //parse rightlevels for each organization in roles
        return _(services)
          .filter(function (service) {
            return api.getRolesByApp(rolesArr, service).length !== 0
          })
          .map(function (service) {
            var rolesByApp = api.getRolesByApp(rolesArr, service)
            return {
              service: service,
              accessRights: api.getAppRights(rolesByApp, service),
              organizationRights: api.getOrganizationRights(rolesByApp),
            }
          })
          .value()
      }

      /**
       * Get rightslevel for the service (e.g. 'VALINTAPERUSTEET' or 'VALINTOJENTOTEUTTAMINEN')
       *
       * @param {Array, String}
       * @returns {Array} of objects containing oid and corresponding highest rightlevel
       */
      this.getAppRights = function (roles, service) {
        var accessRights = 'READ'
        _.some(roles, function (role) {
          if (
            !api.containsOid(role) &&
            api.getRoleRightLevel(role) !== undefined &&
            api.isHigherAccessLevel(accessRights, api.getRoleRightLevel(role))
          ) {
            accessRights = api.getRoleRightLevel(role)
          }
          return accessRights === 'CRUD' ? true : false
        })
        return accessRights
      }

      /**
       * Get organizations and highest corresponding highest
       *
       * @param {Array}
       * @returns {Array} of objects containing oid and corresponding highest rightlevel
       */
      this.getOrganizationRights = function (roles) {
        //unique oids found in roles-parameter
        var oids = _(roles)
          .filter(function (role) {
            return api.containsOid(role)
          })
          .map(function (role) {
            return api.getOrganizationOid(role)
          })
          .uniq()
          .value()

        return _.map(oids, function (oid) {
          var accessRights = 'READ' //default rights
          _.some(roles, function (role) {
            if (
              api.containsOid(role) &&
              api.getOrganizationOid(role) === oid &&
              api.isHigherAccessLevel(accessRights, api.getRoleRightLevel(role))
            ) {
              accessRights = api.getRoleRightLevel(role)
            }
            return accessRights === 'CRUD' ? true : false //if crud-rights found no need to continue
          })

          return {
            oid: oid,
            accessRights: accessRights,
          }
        })
      }

      /**
       *  Compare rightlevels and determine if second argument is higher
       *
       * @param {String, String}
       * @returns {Boolean} true if second argument is higher than first
       */
      this.isHigherAccessLevel = function (comparated, comparator) {
        return (
          comparated === comparator ||
          ((comparated === 'READ_UPDATE' || comparated === 'READ') &&
            (comparator === 'CRUD' || comparator === 'READ_UPDATE'))
        )
      }

      /**
       *   Parse out roles that aren't exact matches for service (e.g. APP_VALINTAPERUSTEET vs. APP_VALINTAPERUSTEETKK)
       *
       * @param {Array, String}
       * @returns {Array} roles
       */
      this.getRolesByApp = function (roles, service) {
        return _.filter(roles, function (role) {
          return (
            service === role ||
            _.startsWith(role, service + '_' + 'CRUD') ||
            _.startsWith(role, service + '_' + 'READ_UPDATE') ||
            _.startsWith(role, service + '_' + 'READ')
          )
        })
      }

      /**
       *  Search for rightlevel-string in role
       *
       * @param {String} a role from myroles
       * @returns {String} returns CRUD, READ_UPDATE, READ or undefined rightlevel isn't found
       */
      this.getRoleRightLevel = function (role) {
        var accessLeveltokens = ['CRUD', 'READ_UPDATE', 'READ']
        var rightLevel = undefined

        _.some(accessLeveltokens, function (token) {
          if (role.indexOf(token) >= 0) {
            rightLevel = token
            return true
          }
        })

        return rightLevel
      }

      /**
       *  Does this role contain an oid
       *
       * @param {String} a role from myroles
       * @returns {Boolean} role contains oid
       */
      this.containsOid = function (role) {
        return OID_REGEXP.test(role)
      }

      /**
       *  get oid-string from role
       *
       * @param {String} a role from myroles
       * @returns {String} organization oid found from role
       */
      this.getOrganizationOid = function (role) {
        if (!api.containsOid(role)) {
          $log.error('Oidin parsiminen käyttäjän epäonnistui roolista: ', role)
          return
        }
        return role.match(OID_REGEXP)[0]
      }

      /**
       *  oph-user
       *
       * @param {Array} users myroles-array
       * @returns {Boolean} is user oph-user
       */
      this.isOphUser = function (roles) {
        return _.some(roles, function (role) {
          return _.includes(role, OPH_ORG_OID)
        })
      }

      /**
       *  Get highest. expect roles include oph-user -organization
       *
       * @param {Array} users myroles-array
       * @returns {String} oph-users rights (READ, READ_UPDATE, CRUD)
       */
      this.getRightsForOrganization = function (roles, organization) {
        var rights = 'READ'
        _(roles)
          .filter(function (role) {
            return _.includes(role, organization)
          })
          .some(function (role) {
            if (api.isHigherAccessLevel(rights, api.getRoleRightLevel(role))) {
              rights = api.getRoleRightLevel(role)
              return true
            }
          })

        return rights
      }
    },
  ])
