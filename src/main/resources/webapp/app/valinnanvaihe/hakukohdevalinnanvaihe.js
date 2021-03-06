angular
  .module('valintaperusteet')
  .controller('ValinnanVaiheController', [
    '$scope',
    '$location',
    '$routeParams',
    'HakukohdeValinnanVaiheModel',
    'HakukohdeModel',
    function (
      $scope,
      $location,
      $routeParams,
      HakukohdeValinnanVaiheModel,
      HakukohdeModel
    ) {
      'use strict'

      $scope.hakukohdeOid = $routeParams.hakukohdeOid
      $scope.valinnanvaiheOid = $routeParams.valinnanvaiheOid

      $scope.model = HakukohdeValinnanVaiheModel
      $scope.model.refreshIfNeeded($scope.valinnanvaiheOid)

      $scope.submit = function () {
        $scope.model.persistValinnanvaihe(
          $scope.hakukohdeOid,
          HakukohdeModel.valinnanvaiheet
        )
      }

      $scope.cancel = function () {
        $location.path('/hakukohde/' + $scope.hakukohdeOid)
      }

      $scope.addJono = function () {
        $location.path(
          '/hakukohde/' +
            $scope.hakukohdeOid +
            '/valinnanvaihe/' +
            $scope.model.valinnanvaihe.oid +
            '/valintatapajono/'
        )
      }

      $scope.modifyJono = function (oid) {
        $location.path(
          '/hakukohde/' +
            $scope.hakukohdeOid +
            '/valinnanvaihe/' +
            $scope.model.valinnanvaihe.oid +
            '/valintatapajono/' +
            oid
        )
      }
    },
  ])

  .factory('HakukohdeValinnanVaiheModel', [
    'Valinnanvaihe',
    'Valintatapajono',
    'ValinnanvaiheValintatapajono',
    'HakukohdeValinnanvaihe',
    'ValinnanvaiheKuuluuSijoitteluun',
    'ValintatapajonoJarjesta',
    'Ilmoitus',
    function (
      Valinnanvaihe,
      Valintatapajono,
      ValinnanvaiheValintatapajono,
      HakukohdeValinnanvaihe,
      ValinnanvaiheKuuluuSijoitteluun,
      ValintatapajonoJarjesta,
      Ilmoitus
    ) {
      'use strict'

      var model = new (function () {
        this.valinnanvaihe = {}
        this.valintatapajonot = []

        this.refresh = function (oid) {
          if (!oid) {
            model.valinnanvaihe = {}
            model.valintatapajonot = []
          } else {
            Valinnanvaihe.get({ oid: oid }, function (result) {
              model.valinnanvaihe = result
              kuuluuSijoitteluun(oid)
            })

            ValinnanvaiheValintatapajono.fetchWithSijoitteluUsage(oid).then(
              function (valintatapajonot) {
                model.valintatapajonot = valintatapajonot
              }
            )
          }
        }

        this.refreshIfNeeded = function (oid) {
          if (oid !== model.valinnanvaihe.oid) {
            this.refresh(oid)
          } else {
            kuuluuSijoitteluun(oid)
          }
        }

        this.remove = function (jono) {
          Valintatapajono.deleteWithDialog(jono).then(function () {
            model.refresh(model.valinnanvaihe.oid)
          })
        }

        this.persistValinnanvaihe = function (
          hakukohdeParentOid,
          valinnanvaiheet
        ) {
          if (!model.valinnanvaihe.oid) {
            var valinnanvaihe = {
              nimi: model.valinnanvaihe.nimi,
              kuvaus: model.valinnanvaihe.kuvaus,
              aktiivinen: true,
              valinnanVaiheTyyppi: 'TAVALLINEN',
            }

            HakukohdeValinnanvaihe.insert(
              { parentOid: hakukohdeParentOid },
              valinnanvaihe,
              function (result) {
                model.valinnanvaihe = result
                Ilmoitus.avaa('Tallennus onnistui', 'Tallennus onnistui.')
                valinnanvaiheet.push(result)
              }
            )
          } else {
            Valinnanvaihe.post(model.valinnanvaihe, function (result) {
              model.valinnanvaihe = result
              Ilmoitus.avaa('Tallennus onnistui', 'Tallennus onnistui.')
              // Päivitetään myös edellisen näkymän modeli
              var i
              for (i in valinnanvaiheet) {
                if (result.oid === valinnanvaiheet[i].oid) {
                  valinnanvaiheet[i] = result
                }
              }
            })

            ValintatapajonoJarjesta.post(getValintatapajonoOids(), function (
              result
            ) {})

            for (var i = 0; i < model.valintatapajonot.length; ++i) {
              Valintatapajono.post(model.valintatapajonot[i], function (
                result
              ) {})
            }
          }
        }

        function kuuluuSijoitteluun(oid) {
          ValinnanvaiheKuuluuSijoitteluun.get({ oid: oid }, function (result) {
            model.valinnanvaihe.kuuluuSijoitteluun = result.sijoitteluun
          })
        }

        function getValintatapajonoOids() {
          var oids = []
          for (var i = 0; i < model.valintatapajonot.length; ++i) {
            oids.push(model.valintatapajonot[i].oid)
          }
          return oids
        }
      })()
      return model
    },
  ])

  .factory('HakukohdeValintakoeValinnanvaiheModel', [
    '$q',
    'HakukohdeValinnanvaihe',
    'Valinnanvaihe',
    'ValinnanvaiheValintakoe',
    'Valintakoe',
    function (
      $q,
      HakukohdeValinnanvaihe,
      Valinnanvaihe,
      ValinnanvaiheValintakoe,
      Valintakoe
    ) {
      'use strict'

      var model = new (function () {
        this.valintakoevalinnanvaihe = {}
        this.valintakokeet = []

        this.refresh = function (oid) {
          if (!oid) {
            model.valintakoevalinnanvaihe = {}
            model.valintakokeet = []
          } else {
            Valinnanvaihe.get({ oid: oid }, function (result) {
              model.valintakoevalinnanvaihe = result
            })

            ValinnanvaiheValintakoe.get(
              { valinnanvaiheOid: oid },
              {},
              function (result) {
                model.valintakokeet = result
              }
            )
          }
        }

        this.persist = function (parentHakukohdeOid, valinnanvaiheet) {
          if (model.valintakoevalinnanvaihe.oid) {
            //päivitä hakukohteen valintakoevalinnanvaiheen tiedot
            Valinnanvaihe.post(model.valintakoevalinnanvaihe, function (
              result
            ) {
              var i
              for (i in valinnanvaiheet) {
                if (result.oid === valinnanvaiheet[i].oid) {
                  valinnanvaiheet[i] = result
                }
              }
            })

            //päivitä hakukohteen valintakoevalinnanvaiheen valintakokeet
            for (var i = 0; i < model.valintakokeet.length; i++) {
              Valintakoe.update(
                { valintakoeOid: model.valintakokeet[i].oid },
                model.valintakokeet[i],
                function (result) {}
              )
            }
          } else {
            var valintakoevalinnanvaihe = {
              nimi: model.valintakoevalinnanvaihe.nimi,
              kuvaus: model.valintakoevalinnanvaihe.kuvaus,
              aktiivinen: true,
              valinnanVaiheTyyppi: 'VALINTAKOE',
            }

            HakukohdeValinnanvaihe.insert(
              { parentOid: parentHakukohdeOid },
              valintakoevalinnanvaihe,
              function (result) {
                model.valintakoevalinnanvaihe = result
                valinnanvaiheet.push(result)
              }
            )
          }
        }

        this.removeValintakoe = function (valintakoe) {
          Valintakoe.remove({ valintakoeOid: valintakoe.oid }, function (
            result
          ) {
            for (var i in model.valintakokeet) {
              if (valintakoe.oid === model.valintakokeet[i].oid) {
                model.valintakokeet.splice(i, 1)
              }
            }
          })
        }
      })()

      return model
    },
  ])

  .controller('HakukohdeValintakoeValinnanvaiheController', [
    '$scope',
    '$location',
    '$routeParams',
    'HakukohdeValintakoeValinnanvaiheModel',
    'HakukohdeModel',
    function (
      $scope,
      $location,
      $routeParams,
      HakukohdeValintakoeValinnanvaiheModel,
      HakukohdeModel
    ) {
      'use strict'

      $scope.hakukohdeOid = $routeParams.hakukohdeOid
      $scope.HakukohdeValintakoeValinnanvaiheOid =
        $routeParams.valintakoevalinnanvaiheOid
      $scope.model = HakukohdeValintakoeValinnanvaiheModel
      $scope.model.refresh($scope.HakukohdeValintakoeValinnanvaiheOid)

      $scope.submit = function () {
        $scope.model.persist(
          $scope.hakukohdeOid,
          HakukohdeModel.valinnanvaiheet
        )
      }

      $scope.cancel = function () {
        $location.path('/hakukohde/' + $scope.hakukohdeOid)
      }

      $scope.modifyvalintakoe = function (valintakoeOid) {
        $location.path(
          '/hakukohde/' +
            $scope.hakukohdeOid +
            '/valintakoevalinnanvaihe/' +
            $scope.model.valintakoevalinnanvaihe.oid +
            '/valintakoe/' +
            valintakoeOid
        )
      }

      $scope.addValintakoe = function () {
        $location.path(
          '/hakukohde/' +
            $scope.hakukohdeOid +
            '/valintakoevalinnanvaihe/' +
            $scope.model.valintakoevalinnanvaihe.oid +
            '/valintakoe/'
        )
      }
    },
  ])
