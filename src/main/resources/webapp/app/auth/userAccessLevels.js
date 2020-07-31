// UserAccessLevels contains information about current users accessrights to currently selected valintaryhma/hakukohde

angular.module("valintaperusteet").factory("UserAccessLevels", [
  "$q",
  "$log",
  "AuthService",
  "OrganisaatioUtility",
  "_",
  function ($q, $log, AuthService, OrganisaatioUtility, _) {
    var model = new (function () {
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

      this.refreshIfNeeded = function (valintaryhmaOid, hakukohdeOid) {
        if (
          _.isEmpty(model.deferred) ||
          (!_.isEmpty(valintaryhmaOid) &&
            valintaryhmaOid !== model.valintaryhmaOid) ||
          (!_.isEmpty(hakukohdeOid) && hakukohdeOid !== model.hakukohdeOid)
        ) {
          return model.refresh(valintaryhmaOid, hakukohdeOid);
        } else {
          return model.deferred.promise;
        }
      };

      this.refresh = function (valintaryhmaOid, hakukohdeOid) {
        model.valintaryhmaOid = valintaryhmaOid;
        model.hakukohdeOid = hakukohdeOid;
        model.deferred = $q.defer();

        resetRights(); // reset all rights to false

        // OPH level
        AuthService.crudOph("APP_VALINTAPERUSTEET").then(function () {
          setCrudRights("oph");
        }, crudOphRejectFn);
        var updateOph = AuthService.updateOph("APP_VALINTAPERUSTEET");
        var readOph = AuthService.readOph("APP_VALINTAPERUSTEET");
        function crudOphRejectFn() {
          updateOph.then(function () {
            setUpdateRights("oph");
          }, updateOphRejectFn);
        }
        function updateOphRejectFn() {
          readOph.then(function () {
            setReadRights("oph");
          }, readOphRejectFn);
        }

        // no OPH rights, ORG level
        function readOphRejectFn() {
          // If users organizations are found then use them getting access
          if (valintaryhmaOid !== undefined) {
            OrganisaatioUtility.getChildOrganizationsForValintaryhmaAsOidList(
              valintaryhmaOid
            ).then(handleOrganizationOids, readOrgRejectFn);
          } else if (hakukohdeOid !== undefined) {
            OrganisaatioUtility.getChildOrganizationsForHakukohdeAsOidList(
              hakukohdeOid
            ).then(handleOrganizationOids, readOrgRejectFn);
          } else {
            readOrgRejectFn();
          }
        }
        function handleOrganizationOids(organizationOids) {
          if (_.isEmpty(organizationOids)) {
            readOrgRejectFn();
          } else {
            //check rights against valintaryhma or hakukohde organizations
            AuthService.crudOrg("APP_VALINTAPERUSTEET", organizationOids).then(
              function () {
                setCrudRights("org");
              },
              crudOrgRejectFn
            );
          }
          function crudOrgRejectFn() {
            AuthService.updateOrg(
              "APP_VALINTAPERUSTEET",
              organizationOids
            ).then(function () {
              setUpdateRights("org");
            }, updateOrgRejectFn);
          }
          function updateOrgRejectFn() {
            AuthService.readOrg("APP_VALINTAPERUSTEET", organizationOids).then(
              function () {
                setReadRights("org");
              },
              readOrgRejectFn
            );
          }
        }

        // no ORG, APP level
        function readOrgRejectFn() {
          AuthService.crudOrg("APP_VALINTAPERUSTEET").then(function () {
            setCrudRights("noOrg");
          }, crudAppRejectFn);
        }
        function crudAppRejectFn() {
          AuthService.updateOrg("APP_VALINTAPERUSTEET").then(function () {
            setUpdateRights("noOrg");
          }, updateAppRejectFn);
        }
        function updateAppRejectFn() {
          AuthService.readOrg("APP_VALINTAPERUSTEET").then(function () {
            setReadRights("noOrg");
          }, readAppRejectFn);
        }
        function readAppRejectFn() {
          $log.error("Ei oikeuksia");
          model.deferred.reject();
        }

        return model.deferred.promise;
      };

      function setCrudRights(level) {
        switch (level) {
          case "oph":
            model.crudOph = true;
          case "org":
            model.crudOrg = true;
          case "noOrg":
            model.crudApp = true;
        }
        setUpdateRights(level, true); //set lower level rights to true
      }

      function setUpdateRights(level, doNotLog) {
        if (!doNotLog) {
          console.log("setUpdateRights", level);
        }
        switch (level) {
          case "oph":
            model.updateOph = true;
          case "org":
            model.updateOrg = true;
          case "noOrg":
            model.updateApp = true;
        }
        setReadRights(level, true); //set lower level rights to true
      }

      function setReadRights(level, doNotLog) {
        if (!doNotLog) {
          console.log("setReadRights", level);
        }
        switch (level) {
          case "oph":
            model.readOph = true;
          case "org":
            model.readOrg = true;
          case "noOrg":
            model.readApp = true;
        }
        model.deferred.resolve();
      }

      function resetRights() {
        model.crudOph = false;
        model.updateOph = false;
        model.readOph = false;

        model.crudOrg = false;
        model.updateOrg = false;
        model.readOrg = false;

        model.crudApp = false;
        model.updateApp = false;
        model.readApp = false;
      }
    })();

    return model;
  },
]);
