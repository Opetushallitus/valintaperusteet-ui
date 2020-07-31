angular
  .module('valintaperusteet')

  .controller('HakukohdeLaskentakaavaListController', [
    '$scope',
    '$log',
    '$location',
    '$routeParams',
    'Laskentakaava',
    'LaskentakaavaLista',
    'HakukohdeModel',
    'Valintaryhma',
    'Hakukohde',
    '$modal',
    '$timeout',
    function (
      $scope,
      $log,
      $location,
      $routeParams,
      Laskentakaava,
      LaskentakaavaLista,
      HakukohdeModel,
      Valintaryhma,
      Hakukohde,
      $modal,
      $timeout
    ) {
      'use strict'

      $scope.hakukohdeModel = HakukohdeModel
      $scope.hakukohdeOid = $routeParams.hakukohdeOid

      $scope.hakukohdeLaskentakaavaLista = LaskentakaavaLista
      $scope.hakukohdeLaskentakaavaLista.refresh(
        null,
        $scope.hakukohdeOid,
        true
      )

      $scope.linkprefix = '/hakukohde/' + $scope.hakukohdeOid

      $scope.showForm = false
      var saveParams = {}
      saveParams.hakukohde = { oid: $routeParams.hakukohdeOid }

      $scope.createKaava = function () {
        $location.path(
          '/hakukohde/' +
            $routeParams.hakukohdeOid +
            '/laskentakaavalista/laskentakaava'
        )
      }

      $scope.cancel = function () {
        $location.path('/hakukohde/' + $routeParams.hakukohdeOid)
      }

      $scope.kaavaKopiointiModal = function (kaava) {
        $scope.$broadcast('kaavakopiointi', kaava)
      }

      $scope.kaavaPoisto = function (kaava) {
        Laskentakaava.delete(
          { oid: kaava.id },
          function () {
            LaskentakaavaLista.refresh(null, $scope.hakukohdeOid, true)
            $scope.kaavaPoistoEpaonnistui = false
          },
          function (error) {
            $scope.kaavaPoistoEpaonnistui = true
            $timeout(function () {
              $scope.kaavaPoistoEpaonnistui = false
            }, 5000)
          }
        )
      }

      $scope.kaavaPoistoModal = function (kaava) {
        var kaavapoistoModalInstance = $modal.open({
          templateUrl: 'laskentakaavat/listaus/kaavapoistokuittausModal.html',
          controller: 'KaavaPoistoController',
          size: 'sm',
          resolve: {
            kaava: function () {
              return kaava
            },
          },
        })

        kaavapoistoModalInstance.result.then(function (kaava) {
          if (kaava) {
            $scope.kaavaPoisto(kaava)
          }
        })
      }
    },
  ])
