
angular.module('valintaperusteet')
    .factory('UserAccessLevels', ['$q', '$log', 'UserOrganizationsModel', 'AuthService', 'ValintaryhmaModel', '_',
        function ($q, $log, UserOrganizationsModel, AuthService, ValintaryhmaModel, _) {
        var model = new function () {
            this.crudOph = false;
            this.updateOph = false;
            this.readOph = false;

            this.crudOrg = false;
            this.updateOrg = false;
            this.readOrg = false;

            this.crudRights = false;
            this.updateRights = false;
            this.readRights = false;

            this.refresh = function () {
                
                model.resetRights(); // reset all rights to false

                // Make all authentication request asynchronously so there's no need to wait for consecutive calls
                // Calling crudOphPromise.then below starts the promise chain - all promises won't likely be called

                // OPH rights
                var crudOphPromise = AuthService.crudOph('APP_VALINTAPERUSTEET');
                var updateOphPromise = AuthService.updateOph('APP_VALINTAPERUSTEET');
                var readOphPromise = AuthService.readOph('APP_VALINTAPERUSTEET');

                // Organization rights
                var crudOrgPromise = AuthService.crudOph('APP_VALINTAPERUSTEET');
                var updateOrgPromise = AuthService.updateOph('APP_VALINTAPERUSTEET');
                var readOrgPromise = AuthService.readOph('APP_VALINTAPERUSTEET');

                // set user rights for OPHCRUD or continue to next level
                var crudOphSuccessFn = function () { model.setCrudRights(true); };
                var crudOphRejectFn = function () { updateOphPromise.then(updateOphSuccessFn, updateOphRejectFn); };

                // set user rights for OPHUPDATE or continue to next level
                var updateOphSuccessFn = function () { model.setUpdateRights(true); };
                var updateOphRejectFn = function () { readOphPromise.then(readOphSuccessFn, readOphRejectFn); };

                // set user rights for OPHREAD or continue to next level
                var readOphSuccessFn = function () { model.setReadRights(true); };
                var readOphRejectFn = function () { crudOrgPromise.then(crudOrgSuccessFn, crudOrgRejectFn); };

                // set user rights for ORGCRUD or continue to next level
                var crudOrgSuccessFn = function () { model.setCrudRights(false); };
                var crudOrgRejectFn = function () { updateOrgPromise.then(updateOrgSuccessFn, updateOrgRejectFn()); };

                // set user rights for ORGUPDATE or continue to next level
                var updateOrgSuccessFn = function () { model.setUpdateRight(false); };
                var updateOrgRejectFn = function () {readOrgPromise.then(readOrgSuccessFn, readOrgRejectFn); };

                // set user rights for ORGREAD or continue to next level
                var readOrgSuccessFn = function () { model.setReadRights(false); };
                var readOrgRejectFn = function () { $log.error('Ei oikeuksia')};

                // Start promisechain checking
                crudOphPromise.then(crudOphSuccessFn, crudOphRejectFn);
                

                /*
                var updateOphSuccessFn = function () {model.setUpdateRights(true); return readOphPromise; };
                var readOphSuccessFn = function () { model.setReadRights(true); return crudOrgPromise; };

                var crudOrgSuccessFn = function () { model.setCrudRights(false); return updateOrgPromise; };
                var updateOrgSuccessFn = function () { model.setUpdateRights(false); return readOrgPromise; };
                var readOrgSuccessFn = function () { model.setReadRights(false); };
*/
            /*
                $q.all(UserOrganizationsModel.promises).then(function () {
                    ValintaryhmaModel.loaded.promise.then(function () {
                        $scope.disableChanges = false;
                        var valintaryhmaOrganisaatioOids = $scope.model.getValintaryhmaOrganisaatioOids();
                        var disable = _.every(UserOrganizationsModel.organizationOids, function (item) {

                        });



                        _.forEach(UserOrganizationsModel.organizationOids, function (item) {
                            if(_.contains(valintaryhmaOrganisaatioOids, item)) {

                            }
                        });

                    });
                });
                */
            };

            this.setCrudRights = function (isOph) {
                model.crudRights = true;
                model.crudOph = isOph;
                model.crudOrg = true;
                model.setUpdateRights(isOph); //set lower level rights to true
            };

            this.setUpdateRights = function(isOph) {
                model.updateRight = true;
                model.updateOph = isOph;
                model.updateOrg = true;
                model.setReadRights(isOph); //set lower level rights to true
            };

            this.setReadRights = function (isOph) {
                model.readRight = true;
                model.readOph = isOph;
                model.readOrg = true;
            };

            this.resetRights = function () {
                model.crudOph = false;
                model.updateOph = false;
                model.readOph = false;
                model.crudOrg = false;
                model.updateOrg = false;
                model.readOrg = false;
            };
        };

        return model;
    }]);