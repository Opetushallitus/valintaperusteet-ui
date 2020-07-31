angular
  .module("oph-roles")

  .service("RoleService", [
    "MyRolesModel",
    "RoleParser",
    function (MyRolesModel, RoleParser) {
      var api = this;

      this.parsedRoles = [];
      this.isOphUser = false;

      this.parseRoles = function (myRoles, services) {
        if (api.parsedRoles.length === 0) {
          if (RoleParser.isOphUser(myRoles.myRoles)) {
            api.isOphUser = true;
          } else {
            api.parsedRoles = RoleParser.parseRoles(myRoles, services);
          }
        }
      };
    },
  ]);
