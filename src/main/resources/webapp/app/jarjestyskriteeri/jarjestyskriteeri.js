// Valintaryhma Järjestyskriteerit
app.factory('JarjestyskriteeriModel', function (
  $q,
  Laskentakaava,
  Jarjestyskriteeri,
  ValintatapajonoJarjestyskriteeri,
  ParentValintaryhmas,
  Hakukohde,
  LaskentakaavaModel,
  ValintatapajonoModel,
  Ilmoitus
) {
  'use strict'

  var model

  model = new (function () {
    this.jarjestyskriteeri = {}
    this.laskentakaavat = []

    this.refresh = function (oid) {
      if (oid) {
        Jarjestyskriteeri.get({ oid: oid }, function (result) {
          model.jarjestyskriteeri = result
        })
      }
    }

    this.refreshIfNeeded = function (oid, valintaryhmaOid, hakukohdeOid) {
      if (!oid) {
        model.jarjestyskriteeri = {}
        model.laskentakaavat = []
        model.valintaryhmaLaskentakaavat = []
      } else if (oid !== model.jarjestyskriteeri.oid) {
        this.refresh(oid)
      }

      var jarjestyskriteerit = ValintatapajonoModel

      LaskentakaavaModel.refresh(valintaryhmaOid, hakukohdeOid)
      model.laskentakaavaModel = LaskentakaavaModel
    }

    this.submit = function (valintatapajonoOid, jarjestyskriteerit) {
      var obj = {
        oid: model.jarjestyskriteeri.oid,
        jarjestyskriteeri: model.jarjestyskriteeri,
        laskentakaavaId: model.jarjestyskriteeri.laskentakaavaId,
      }

      var deferred = $q.defer()
      if (!obj.oid) {
        obj.jarjestyskriteeri.aktiivinen = 'true'
        ValintatapajonoJarjestyskriteeri.insert(
          { parentOid: valintatapajonoOid },
          obj,
          function (jk) {
            Laskentakaava.get(
              { oid: jk.laskentakaavaId, funktiopuu: false },
              function (result) {
                jk.nimi = result.nimi
                deferred.resolve()
              },
              function (err) {
                deferred.reject()
              }
            )
            jarjestyskriteerit.push(jk)
          },
          function (err) {
            deferred.reject()
          }
        )
      } else {
        Jarjestyskriteeri.post(
          obj,
          function (jk) {
            var i

            var promises = []
            for (i in jarjestyskriteerit) {
              if (jk.oid === jarjestyskriteerit[i].oid) {
                promises.push(
                  Laskentakaava.get(
                    { oid: jk.laskentakaavaId, funktiopuu: false },
                    function (result) {
                      jk.nimi = result.nimi
                    }
                  ).$promise
                )

                jarjestyskriteerit[i] = jk
              }
            }
            $q.all(promises).then(
              function () {
                deferred.resolve()
              },
              function (err) {
                deferred.reject()
              }
            )
          },
          function (err) {
            deferred.reject()
          }
        )
      }

      return deferred.promise
    }
  })()

  return model
})

angular.module('valintaperusteet').controller('JarjestyskriteeriController', [
  '$scope',
  '$filter',
  '$location',
  '$routeParams',
  'JarjestyskriteeriModel',
  'ValintatapajonoModel',
  'SuoritaToiminto',
  function (
    $scope,
    $filter,
    $location,
    $routeParams,
    JarjestyskriteeriModel,
    ValintatapajonoModel,
    SuoritaToiminto
  ) {
    'use strict'

    $scope.hakukohdeOid = $routeParams.hakukohdeOid
    $scope.valintaryhmaOid = $routeParams.id
    $scope.valinnanvaiheOid = $routeParams.valinnanvaiheOid
    $scope.valintatapajonoOid = $routeParams.valintatapajonoOid

    $scope.model = JarjestyskriteeriModel
    $scope.model.refreshIfNeeded(
      $routeParams.jarjestyskriteeriOid,
      $routeParams.id,
      $routeParams.hakukohdeOid
    )

    ValintatapajonoModel.refreshIfNeeded(
      $routeParams.valintatapajonoOid,
      $routeParams.id,
      $routeParams.hakukohdeOid,
      $routeParams.valinnanvaiheOid
    )

    $scope.submit = function () {
      SuoritaToiminto.avaa(function (success, failure) {
        var promise = JarjestyskriteeriModel.submit(
          $scope.valintatapajonoOid,
          ValintatapajonoModel.jarjestyskriteerit
        )
        promise.then(
          function (greeting) {
            success(function () {
              var path
              if ($routeParams.hakukohdeOid) {
                path = '/hakukohde/' + $routeParams.hakukohdeOid
              } else {
                path = '/valintaryhma/' + $routeParams.id
              }
              $location.path(
                path +
                  '/valinnanvaihe/' +
                  $routeParams.valinnanvaiheOid +
                  '/valintatapajono/' +
                  $routeParams.valintatapajonoOid
              )
            })
          },
          function (error) {
            failure(function () {})
          }
        )
      })
    }

    $scope.cancel = function () {
      var path
      if ($routeParams.hakukohdeOid) {
        path = '/hakukohde/' + $routeParams.hakukohdeOid
      } else {
        path = '/valintaryhma/' + $routeParams.id
      }
      $location.path(
        path +
          '/valinnanvaihe/' +
          $routeParams.valinnanvaiheOid +
          '/valintatapajono/' +
          $routeParams.valintatapajonoOid
      )
    }

    $scope.kaavasFiltered = function (kaavas) {
      return $filter('laskentakaavaFilter')(kaavas).length != 0
    }
  },
])
