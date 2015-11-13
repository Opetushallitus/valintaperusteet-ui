


// UserAccessLevels contains information about current users accessrights to currently selected valintaryhma/hakukohde

angular.module('valintaperusteet')
    .factory('UserAccessLevels', ['$q', '$log', 'AuthService', 'OrganisaatioUtility', '_',
        function ($q, $log, AuthService, OrganisaatioUtility, _) {
        var model = new function () {
            "use strict";
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

                // OPH level
                AuthService.crudOph('APP_VALINTAPERUSTEET').then(function () { model.setCrudRights("oph"); model.deferred.resolve(); }, crudOphRejectFn);
                var updateOph = AuthService.updateOph('APP_VALINTAPERUSTEET');
                var readOph = AuthService.readOph('APP_VALINTAPERUSTEET');
                function crudOphRejectFn() {updateOph.then(function () { model.setUpdateRights("oph"); model.deferred.resolve(); }, updateOphRejectFn); }
                function updateOphRejectFn() {readOph.then(function () { model.setReadRights("oph"); model.deferred.resolve();}, readOphRejectFn); }

                // no OPH rights, ORG level
                function readOphRejectFn() {
                    // If users organizations are found then use them getting access
                    if(valintaryhmaOid !== undefined) {
                        OrganisaatioUtility.getChildOrganizationsForValintaryhmaAsOidList(valintaryhmaOid).then(handleOrganizationOids, readOrgRejectFn);
                    } else if(hakukohdeOid !== undefined) {
                        OrganisaatioUtility.getChildOrganizationsForHakukohdeAsOidList(hakukohdeOid).then(handleOrganizationOids, readOrgRejectFn);
                    } else {
                        readOrgRejectFn();
                    }
                }
                var updateOrg, readOrg
                function handleOrganizationOids(organizationOids) {
                    if(_.isEmpty(organizationOids)) {
                        readOrgRejectFn();
                    } else {
                        //check rights against valintaryhma or hakukohde organizations
                        AuthService.crudOrg('APP_VALINTAPERUSTEET', organizationOids).then(function () { model.setCrudRights("org"); model.deferred.resolve(); }, crudOrgRejectFn);
                        updateOrg = AuthService.updateOrg('APP_VALINTAPERUSTEET', organizationOids)
                        readOrg = AuthService.readOrg('APP_VALINTAPERUSTEET', organizationOids)
                    }
                }
                function crudOrgRejectFn() { updateOrg.then(function () { model.setUpdateRights("org"); model.deferred.resolve(); }, updateOrgRejectFn); }
                function updateOrgRejectFn() { readOrg.then(function () { model.setReadRights("org"); model.deferred.resolve(); }, readOrgRejectFn); }

                // no ORG, APP level
                var updateApp, readApp
                function readOrgRejectFn () {AuthService.crudOrg('APP_VALINTAPERUSTEET').then(function () { model.setCrudRights("noOrg"); model.deferred.resolve(); }, crudAppRejectFn);
                    updateApp = AuthService.updateOrg('APP_VALINTAPERUSTEET')
                    readApp = AuthService.readOrg('APP_VALINTAPERUSTEET')
                }
                function crudAppRejectFn() { updateApp.then(function() { model.setUpdateRights("noOrg"); model.deferred.resolve(); }, updateAppRejectFn);}
                function updateAppRejectFn() { readApp.then(function() { model.setReadRights("noOrg"); model.deferred.resolve(); }, readAppRejectFn); }
                function readAppRejectFn() { $log.error('Ei oikeuksia'); model.deferred.reject(); }

                return model.deferred.promise;
            };

            model.isOphUser = function () {
                return model.crudOph || model.updateOph || model.readOph;
            };

            model.isOrganizationUser = function () {
                return model.crudOrg || model.updateOrg || model.readOrg;
            };

            model.isApplicationUser = function () {
                return model.crudApp || model.updateApp || model.readApp;
            };

            model.hasCrudRights = function () {
                return model.crudOph || model.crudOrg || model.crudApp;
            };

            model.hasUpdateRights = function () {
                return model.updateOph || model.updateOrg || model.updateApp;
            };

            model.hasReadRights = function () {
                return model.readOph || model.readOrg || model.readApp;
            };
            
            model.setCrudRights = function (level) {
                console.log("setCrudRights", level)
                switch(level) {
                    case "oph":
                        model.crudOph = true;
                    case "org":
                        model.crudOrg = true;
                    case "noOrg":
                        model.crudApp = true;
                }
                model.setUpdateRights(level, true); //set lower level rights to true
            };

            model.setUpdateRights = function(level, doNotLog) {
                if(!doNotLog) {
                    console.log("setUpdateRights", level)
                }
                switch(level) {
                    case "oph":
                        model.updateOph = true;
                    case "org":
                        model.updateOrg = true;
                    case "noOrg":
                        model.updateApp = true;
                }
                model.setReadRights(level, true); //set lower level rights to true
            };

            model.setReadRights = function (level, doNotLog) {
                if(!doNotLog) {
                    console.log("setReadRights", level)
                }
                switch(level) {
                    case "oph":
                        model.readOph = true;
                    case "org":
                        model.readOrg = true;
                    case "noOrg":
                        model.readApp = true;
                }
            };

            model.resetRights = function () {
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

