
angular.module('valintaperusteet')
    .factory('UserAccessLevels', ['$q', '$log', 'UserOrganizationsModel', 'AuthService', 'ValintaryhmaModel', '_',
        function ($q, $log, UserOrganizationsModel, AuthService, ValintaryhmaModel, _) {
        var model = new function () {
            this.deferred = undefined;

            this.crudOph = false;
            this.updateOph = false;
            this.readOph = false;

            this.crudOrg = false;
            this.updateOrg = false;
            this.readOrg = false;

            this.refresh = function () {
                model.deferred = $q.defer();

                model.resetRights(); // reset all rights to false

                // Make all authentication request asynchronously so there's no need to wait for consecutive calls
                // Calling crudOphPromise.then below starts the promise chain - all promises won't likely be called
                // because running successcallback stops the chain. No need to check if user has lower level rights

                // OPH rights
                var crudOphPromise = AuthService.crudOph('APP_VALINTAPERUSTEET');
                var updateOphPromise = AuthService.updateOph('APP_VALINTAPERUSTEET');
                var readOphPromise = AuthService.readOph('APP_VALINTAPERUSTEET');

                // Organization rights
                var crudOrgPromise = AuthService.crudOph('APP_VALINTAPERUSTEET');
                var updateOrgPromise = AuthService.updateOph('APP_VALINTAPERUSTEET');
                var readOrgPromise = AuthService.readOph('APP_VALINTAPERUSTEET');

                // set user rights for OPHCRUD or continue to next level
                var crudOphSuccessFn = function () { model.setCrudRights(true); model.deferred.resolve(); };
                var crudOphRejectFn = function () { updateOphPromise.then(updateOphSuccessFn, updateOphRejectFn); };

                // set user rights for OPHUPDATE or continue to next level
                var updateOphSuccessFn = function () { model.setUpdateRights(true); model.deferred.resolve(); };
                var updateOphRejectFn = function () { readOphPromise.then(readOphSuccessFn, readOphRejectFn); };

                // set user rights for OPHREAD or continue to next level
                var readOphSuccessFn = function () { model.setReadRights(true); model.deferred.resolve();};
                var readOphRejectFn = function () { crudOrgPromise.then(crudOrgSuccessFn, crudOrgRejectFn); };

                // set user rights for ORGCRUD or continue to next level
                var crudOrgSuccessFn = function () { model.setCrudRights(false); model.deferred.resolve(); };
                var crudOrgRejectFn = function () { updateOrgPromise.then(updateOrgSuccessFn, updateOrgRejectFn()); };

                // set user rights for ORGUPDATE or continue to next level
                var updateOrgSuccessFn = function () { model.setUpdateRight(false); model.deferred.resolve(); };
                var updateOrgRejectFn = function () {readOrgPromise.then(readOrgSuccessFn, readOrgRejectFn); };

                // set user rights for ORGREAD or continue to next level
                var readOrgSuccessFn = function () { model.setReadRights(false); model.deferred.resolve(); };
                var readOrgRejectFn = function () { $log.error('Ei oikeuksia'); model.deferred.reject();};

                // Start promisechain checking
                crudOphPromise.then(crudOphSuccessFn, crudOphRejectFn);



                return model.deferred.promise;
            };
            
            this.isOphUser = function () {
                return model.crudOph || model.updateOph || model.readOph;
            };
            
            this.hasCrudRights = function () {
                return model.crudOph || model.crudOrg;
            };

            this.hasUpdateRights = function () {
                return model.updateOph || model.updateOrg;
            };
            
            this.hasReadRights = function () {
                return model.readOph || model.readOrg;
            };

            this.setCrudRights = function (isOph) {
                model.crudOph = isOph;
                model.crudOrg = true;
                model.setUpdateRights(isOph); //set lower level rights to true
            };

            this.setUpdateRights = function(isOph) {
                model.updateOph = isOph;
                model.updateOrg = true;
                model.setReadRights(isOph); //set lower level rights to true
            };

            this.setReadRights = function (isOph) {
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