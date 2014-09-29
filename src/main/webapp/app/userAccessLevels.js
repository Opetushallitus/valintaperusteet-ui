
angular.module('valintaperusteet')
    .factory('UserAccessLevels', ['$q', '$log', 'AuthService', 'OrganisaatioUtility', 'ValintaryhmaModel', '_',
        function ($q, $log, AuthService, OrganisaatioUtility, ValintaryhmaModel, _) {
        var model = new function () {
            this.deferred = undefined;

            // OPH-users
            this.crudOph = false;
            this.updateOph = false;
            this.readOph = false;

            // users with rights to currently selected valintaryhma/hakukohde by organizations
            this.crudOrg = false;
            this.updateOrg = false;
            this.readOrg = false;

            // users with rights to application but not to currently selected valintaryhma/hakukohde
            this.crudNoOrg = false;
            this.updateNoOrg = false;
            this.readNoOrg = false;

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

                var crudOrgPromise = undefined;
                var updateOrgPromise = undefined;
                var readOrgPromise = undefined;

                var crudNoOrgPromise = undefined;
                var updateNoOrgPromise = undefined;
                var readNoOrgPromise = undefined;


                // set user rights for OPHCRUD or continue to next level
                var crudOphSuccessFn = function () { model.setCrudRights("oph"); model.deferred.resolve(); };
                var crudOphRejectFn = function () { updateOphPromise.then(updateOphSuccessFn, updateOphRejectFn); };

                // set user rights for OPHUPDATE or continue to next level
                var updateOphSuccessFn = function () { model.setUpdateRights("oph"); model.deferred.resolve(); };
                var updateOphRejectFn = function () { readOphPromise.then(readOphSuccessFn, readOphRejectFn); };

                // set user rights for OPHREAD or continue to next level
                var readOphSuccessFn = function () { model.setReadRights("oph"); model.deferred.resolve();};
                var readOphRejectFn = function () {
                    // If users organizations are found then use them getting access
                    OrganisaatioUtility.getOrganizations(true).then(function (organizationOids) {

                        if(_.isEmpty(organizationOids)) { //check rights against valintaryhma or hakukohde organizations
                            crudOrgPromise = AuthService.crudOrg('APP_VALINTAPERUSTEET', organizationOids);
                            updateOrgPromise = AuthService.updateOrg('APP_VALINTAPERUSTEET', organizationOids);
                            readOrgPromise = AuthService.readOrg('APP_VALINTAPERUSTEET', organizationOids);
                            crudOrgPromise.then(crudOrgSuccessFn, crudOrgRejectFn);
                        } else { // check if user has rights to this application
                            crudNoOrgPromise = AuthService.crudOrg('APP_VALINTAPERUSTEET');
                            updateNoOrgPromise = AuthService.updateOrg('APP_VALINTAPERUSTEET');
                            readNoOrgPromise = AuthService.readOrg('APP_VALINTAPERUSTEET');
                            crudNoOrgPromise.then(crudNoOrgSuccessFn, crudNoOrgRejectFn);
                        }


                    }, function () {
                        crudOrgPromise = AuthService.crudOrg('APP_VALINTAPERUSTEET');
                        updateOrgPromise = AuthService.updateOrg('APP_VALINTAPERUSTEET');
                        readOrgPromise = AuthService.readOrg('APP_VALINTAPERUSTEET');

                        crudOrgPromise.then(crudOrgSuccessFn, crudOrgRejectFn);
                    });
                };

                // set user rights for ORGCRUD or continue to next level
                var crudOrgSuccessFn = function () { model.setCrudRights("org"); model.deferred.resolve(); };
                var crudOrgRejectFn = function () { updateOrgPromise.then(updateOrgSuccessFn, updateOrgRejectFn); };

                // set user rights for ORGUPDATE or continue to next level
                var updateOrgSuccessFn = function () { model.setUpdateRights("org"); model.deferred.resolve(); };
                var updateOrgRejectFn = function () {readOrgPromise.then(readOrgSuccessFn, readOrgRejectFn); };

                // set user rights for ORGREAD or continue to next level
                var readOrgSuccessFn = function () { model.setReadRights("org"); model.deferred.resolve(); };
                var readOrgRejectFn = function () {

                    // check if user has rights to this application
                    crudNoOrgPromise = AuthService.crudOrg('APP_VALINTAPERUSTEET');
                    updateNoOrgPromise = AuthService.updateOrg('APP_VALINTAPERUSTEET');
                    readNoOrgPromise = AuthService.readOrg('APP_VALINTAPERUSTEET');
                    crudNoOrgPromise.then(crudNoOrgSuccessFn, crudNoOrgRejectFn);

                };

                // set user rights for NOORGCRUD or continue to next level
                var crudNoOrgSuccessFn = function () { model.setCrudRights("noOrg"); model.deferred.resolve(); };
                var crudNoOrgRejectFn = function () { updateNoOrgPromise.then(updateNoOrgSuccessFn, updateNoOrgRejectFn); };

                var updateNoOrgSuccessFn = function() { model.setUpdateRights("noOrg"); model.deferred.resolve(); };
                var updateNoOrgRejectFn = function() {readNoOrgPromise.then(readNoOrgSuccessFn, readNoOrgRejectFn); };

                var readNoOrgSuccessFn = function() {model.setReadRights("noOrg"); model.deferred.resolve(); };
                var readNoOrgRejectFn = function() { $log.error('Ei oikeuksia'); model.deferred.reject(); };

                // Start promisechain checking
                crudOphPromise.then(crudOphSuccessFn, crudOphRejectFn);

                return model.deferred.promise;
            };

            this.refreshIfNeeded = function () {
                if(_.isEmpty(model.deferred)) {
                    model.refresh();
                } else {
                    return model.deferred.promise;
                }
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

            this.setCrudRights = function (level) {
                switch(level) {
                    case "oph":
                        model.crudOph = true;
                    case "org":
                        model.crudOrg = true;
                    case "noOrg":
                        model.crudNoOrg = true;
                }
                model.setUpdateRights(level); //set lower level rights to true
            };

            this.setUpdateRights = function(level) {
                switch(level) {
                    case "oph":
                        model.updateOph = true;
                    case "org":
                        model.updateOrg = true;
                    case "noOrg":
                        model.updateNoOrg = true;
                }
                model.setReadRights(level); //set lower level rights to true
            };

            this.setReadRights = function (level) {
                switch(level) {
                    case "oph":
                        model.readOph = true;
                    case "org":
                        model.readOrg = true;
                    case "noOrg":
                        model.readNoOrg = true;
                }
            };

            this.resetRights = function () {
                model.crudOph = false;
                model.updateOph = false;
                model.readOph = false;

                model.crudOrg = false;
                model.updateOrg = false;
                model.readOrg = false;

                model.crudNoOrg = false;
                model.updateNoOrg = false;
                model.readNoOrg = false;
            };
        };

        return model;
    }]);

