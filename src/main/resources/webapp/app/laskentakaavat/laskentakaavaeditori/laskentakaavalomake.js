angular.module("valintaperusteet").controller("LaskentakaavaLomakeController", [
  "$scope",
  "$routeParams",
  "$location",
  "Laskentakaava",
  "KaavaVirheTyypit",
  function ($scope, $routeParams, $location, Laskentakaava, KaavaVirheTyypit) {
    "use strict";

    $scope.kaavaVirheTyypit = KaavaVirheTyypit;
    $routeParams.laskentakaavaOid
      ? ($scope.kaavaHasId = true)
      : ($scope.kaavaHasId = false);

    if (!$routeParams.laskentakaavaOid) {
      $scope.showNewKaava = true;
      $scope.createNewKaava = true;
    }

    $scope.setLaskentakaava = function (laskentakaava) {
      $scope.newKaavaTemplate = laskentakaava;
      $scope.showNewKaava = false;
      $scope.$broadcast("newkaava");
    };

    $scope.persist = function () {
      $scope.$broadcast("persistKaava");
    };

    $scope.persistNewKaava = function () {
      $scope.$broadcast("persistNewKaava");
    };

    $scope.back = function () {
      if ($routeParams.id) {
        $location.path(
          "/valintaryhma/" + $routeParams.id + "/laskentakaavalista"
        );
      } else if ($routeParams.hakukohdeOid) {
        $location.path(
          "/hakukohde/" + $routeParams.hakukohdeOid + "/laskentakaavalista"
        );
      } else {
        $location.path("/laskentakaava");
      }
    };

    $scope.hasHakijaryhmaCookie = function () {
      return sessionStorage.getItem("hakijaryhmaSkeleton") ? true : false;
    };

    $scope.initializeKaava = function () {
      $scope.$broadcast("initializeKaava");
    };

    $scope.returnHakijaryhmaLuonti = function () {
      $location.path(
        JSON.parse(sessionStorage.getItem("hakijaryhmaSkeleton")).url
      );
    };
  },
]);
