


// UserAccessLevels contains information about current users accessrights to currently selected valintaryhma/hakukohde

angular.module('valintaperusteet')
    .factory('UserAccessLevels', ['$q', '$log', 'AuthService', 'OrganisaatioUtility', '_',
        function ($q, $log, AuthService, OrganisaatioUtility, _) {
        var model = new function () {
            this.deferred = undefined;

            // valintaryhmaOid / hakukohdeOid user for matching users
            // organizations against currently selected valintaryhma/hakukohde organizations
            this.valintaryhmaOid = undefined;
            this.hakukohdeOid = undefined;

            // OPH-users
            this.crudOph = false;
            this.updateOph = false;
            this.readOph = false;

            // users with rights to currently selected valintaryhma/hakukohde by organizations
            this.crudOrg = false;
            this.updateOrg = false;
            this.readOrg = false;

            // users with rights to application but not to currently selected valintaryhma/hakukohde
            this.crudApp = false;
            this.updateApp = false;
            this.readApp = false;

            this.refreshIfNeeded = function (valintaryhmaOid, hakukohdeOid) {
                if(_.isEmpty(model.deferred) ||
                     ( !_.isEmpty(valintaryhmaOid) && (valintaryhmaOid !== model.valintaryhmaOid) ) ||
                      ( !_.isEmpty(hakukohdeOid) && (hakukohdeOid !== model.hakukohdeOid) ) )  {
                    return model.refresh(valintaryhmaOid, hakukohdeOid);
                } else {
                    return model.deferred.promise;
                }
            };

            this.refresh = function (valintaryhmaOid, hakukohdeOid) {

                model.valintaryhmaOid = valintaryhmaOid;
                model.hakukohdeOid = hakukohdeOid;
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

                var crudAppPromise = undefined;
                var updateAppPromise = undefined;
                var readAppPromise = undefined;
                
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
                    var organizationOidsPromise = undefined;

                    if(valintaryhmaOid !== undefined) {
                        organizationOidsPromise = OrganisaatioUtility.getChildOrganizationsForValintaryhmaAsOidList(valintaryhmaOid);
                    } else if(hakukohdeOid !== undefined) {
                        organizationOidsPromise = OrganisaatioUtility.getChildOrganizationsforHakukohdeAsOidList(hakukohdeOid);
                    }

                    if(organizationOidsPromise !== undefined) {
                        organizationOidsPromise.then(function (organizationOids) {
                            if(!_.isEmpty(organizationOids)) { //check rights against valintaryhma or hakukohde organizations
                                crudOrgPromise = AuthService.crudOrg('APP_VALINTAPERUSTEET', organizationOids);
                                updateOrgPromise = AuthService.updateOrg('APP_VALINTAPERUSTEET', organizationOids);
                                readOrgPromise = AuthService.readOrg('APP_VALINTAPERUSTEET', organizationOids);
                                crudOrgPromise.then(crudOrgSuccessFn, crudOrgRejectFn);
                            } else { // check if user has rights to this application
                                crudAppPromise = AuthService.crudOrg('APP_VALINTAPERUSTEET');
                                updateAppPromise = AuthService.updateOrg('APP_VALINTAPERUSTEET');
                                readAppPromise = AuthService.readOrg('APP_VALINTAPERUSTEET');
                                crudAppPromise.then(crudAppSuccessFn, crudAppRejectFn);
                            }
                        }, function () {
                            // check users rights to application if organizations can't be fetched
                            crudOrgPromise = AuthService.crudOrg('APP_VALINTAPERUSTEET');
                            updateOrgPromise = AuthService.updateOrg('APP_VALINTAPERUSTEET');
                            readOrgPromise = AuthService.readOrg('APP_VALINTAPERUSTEET');

                            crudOrgPromise.then(crudOrgSuccessFn, crudOrgRejectFn);
                        });
                    } else {
                        // if valintaryhmaOid or hakukohdeOid aren't found
                        // check users rights to application if organizations can't be fetched
                        crudOrgPromise = AuthService.crudOrg('APP_VALINTAPERUSTEET');
                        updateOrgPromise = AuthService.updateOrg('APP_VALINTAPERUSTEET');
                        readOrgPromise = AuthService.readOrg('APP_VALINTAPERUSTEET');

                        crudOrgPromise.then(crudOrgSuccessFn, crudOrgRejectFn);
                    }

                };

                // set user rights for ORGCRUD or continue to next level
                var crudOrgSuccessFn = function () { model.setCrudRights("org"); model.deferred.resolve(); };
                var crudOrgRejectFn = function () { updateOrgPromise.then(updateOrgSuccessFn, updateOrgRejectFn); };

                // set user rights for ORGUPDATE or continue to next level
                var updateOrgSuccessFn = function () { model.setUpdateRights("org"); model.deferred.resolve(); };
                var updateOrgRejectFn = function () { readOrgPromise.then(readOrgSuccessFn, readOrgRejectFn); };

                // set user rights for ORGREAD or continue to next level
                var readOrgSuccessFn = function () { model.setReadRights("org"); model.deferred.resolve(); };
                var readOrgRejectFn = function () {
                    // check if user has rights to this application
                    crudAppPromise = AuthService.crudOrg('APP_VALINTAPERUSTEET');
                    updateAppPromise = AuthService.updateOrg('APP_VALINTAPERUSTEET');
                    readAppPromise = AuthService.readOrg('APP_VALINTAPERUSTEET');
                    crudAppPromise.then(crudAppSuccessFn, crudAppRejectFn);

                };

                // set user rights for NOORGCRUD or continue to next level
                var crudAppSuccessFn = function () { model.setCrudRights("noOrg"); model.deferred.resolve(); };
                var crudAppRejectFn = function () { updateAppPromise.then(updateAppSuccessFn, updateAppRejectFn); };

                var updateAppSuccessFn = function() { model.setUpdateRights("noOrg"); model.deferred.resolve(); };
                var updateAppRejectFn = function() { readAppPromise.then(readAppSuccessFn, readAppRejectFn); };

                var readAppSuccessFn = function() { model.setReadRights("noOrg"); model.deferred.resolve(); };
                var readAppRejectFn = function() { $log.error('Ei oikeuksia'); model.deferred.reject(); };

                // Start promisechain checking
                crudOphPromise.then(crudOphSuccessFn, crudOphRejectFn);

                return model.deferred.promise;
            };

            this.isOphUser = function () {
                return model.crudOph || model.updateOph || model.readOph;
            };
            
            this.isOrganizationUser = function () {
                return model.crudOrg || model.updateOrg || model.readOrg;
            };
            
            this.isApplicationUser = function () {
                return model.crudApp || model.updateApp || model.readApp;
            };

            this.hasCrudRights = function () {
                return model.crudOph || model.crudOrg || model.crudApp;
            };

            this.hasUpdateRights = function () {
                return model.updateOph || model.updateOrg || model.updateApp;
            };

            this.hasReadRights = function () {
                return model.readOph || model.readOrg || model.readApp;
            };
            
            this.setCrudRights = function (level) {
                switch(level) {
                    case "oph":
                        model.crudOph = true;
                    case "org":
                        model.crudOrg = true;
                    case "noOrg":
                        model.crudApp = true;
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
                        model.updateApp = true;
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
                        model.readApp = true;
                }
            };

            this.resetRights = function () {
                model.crudOph = false;
                model.updateOph = false;
                model.readOph = false;

                model.crudOrg = false;
                model.updateOrg = false;
                model.readOrg = false;

                model.crudApp = false;
                model.updateApp = false;
                model.readApp = false;
            };
        };

        return model;
    }]);

