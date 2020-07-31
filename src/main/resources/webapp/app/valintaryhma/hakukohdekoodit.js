angular
  .module('valintaperusteet')

  .controller('HakukohdekoodiController', [
    '$scope',
    function ($scope) {
      'use strict'

      $scope.toggleValintaryhmaHakukohdekoodit = false

      $scope.toggleHakukohdekoodit = function () {
        $scope.toggleValintaryhmaHakukohdekoodit = !$scope.toggleValintaryhmaHakukohdekoodit
      }

      $scope.showHakukohdeKoodit = function () {
        var promise = $scope.model.getHakukohdekoodit()
        $scope.toggleValintaryhmaHakukohdekoodit = true
        promise.finally(function () {
          $scope.show()
        })
      }

      $scope.setHakukohdeUri = function (newUri) {
        $scope.newHakukohdeUri = newUri
      }

      $scope.addHakukohdeUri = function (newHakukohdeUri) {
        $scope.model.addHakukohdeUri(newHakukohdeUri)
      }

      $scope.removeHakukohdeKoodi = function (hakukohdekoodi) {
        $scope.model.removeHakukohdeKoodi(hakukohdekoodi)
      }
    },
  ])
