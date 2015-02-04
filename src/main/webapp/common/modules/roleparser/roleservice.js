angular.module('RoleParser')
    .service('RoleService', ['MyRolesModel',
        function (MyRolesModel) {

            var api = this;

            this.parsedRoles = [];
            this.isOphUser = false;

            //IIFE: populate myroles with services (apps)
            (function getMyroles() {

            }())

            MyRolesModel.then(function (myRoles) {
                if(api.isOphUser(myRoles.myRoles)) {
                    api.isOphUser = true;
                } else {
                    api.parsedRoles = api.parseRoles(myRoles);
                }
            });

    }]);
