angular
  .module('valintaperusteet')

  .factory('ValintakoeModel', [
    '$q',
    'Valintakoe',
    'ValinnanvaiheValintakoe',
    'Laskentakaava',
    'LaskentakaavaModel',
    'UserModel',
    'HakemusavaimetLisakysymykset',
    'HakemusavaimetLisakysymyksetAvaimet',
    '$cookieStore',
    function (
      $q,
      Valintakoe,
      ValinnanvaiheValintakoe,
      Laskentakaava,
      LaskentakaavaModel,
      UserModel,
      HakemusavaimetLisakysymykset,
      HakemusavaimetLisakysymyksetAvaimet,
      $cookieStore
    ) {
      'use strict'

      var model = new (function () {
        this.valintakoe = {}
        this.laskentakaavat = []
        this.laskentakaavaModel = {}

        this.refresh = function (oid, valintaryhmaOid, hakukohdeOid) {
          if (!oid) {
            model.valintakoe = {}
            model.valintakoe.kutsutaankoKaikki = false
            model.valintakoe.lahetetaankoKoekutsut = false
            model.valintakoe.kutsunKohde = 'YLIN_TOIVE'
            model.valintakoe.laskentakaavaId = ''
            model.valintakoe.kutsunKohdeAvain = ''
          } else {
            Valintakoe.get({ valintakoeOid: oid }, function (result) {
              model.valintakoe = result
              if (!result.laskentakaavaId) {
                model.valintakoe.laskentakaavaId = ''
              }

              if (!result.kutsunKohdeAvain) {
                model.valintakoe.kutsunKohdeAvain = ''
              }
            })
          }

          this.resolveHaku()

          LaskentakaavaModel.refresh(valintaryhmaOid, hakukohdeOid)
          model.laskentakaavaModel = LaskentakaavaModel
        }

        this.getHakemusAvaimet = function (hakuoid) {
          HakemusavaimetLisakysymyksetAvaimet.parseLisakysymysAvaimet(
            hakuoid,
            model
          )
        }

        this.resolveHaku = function () {
          var hakuoid = $cookieStore.get('hakuoid')
          if (hakuoid) {
            this.getHakemusAvaimet(hakuoid)
          }
        }

        this.refreshIfNeeded = function (oid, valintaryhmaOid, hakukohdeOid) {
          if (oid === undefined || model.valintakoe.oid !== oid) {
            model.refresh(oid, valintaryhmaOid, hakukohdeOid)
          }
        }

        this.persistValintakoe = function (
          parentValintakoeValinnanvaiheOid,
          valintakokeet
        ) {
          var deferred = $q.defer()
          if (model.valintakoe.oid) {
            model.valintakoe.laskentakaavaId = getlaskentakaavaId()
            Valintakoe.update(
              { valintakoeOid: model.valintakoe.oid },
              model.valintakoe,
              function (result) {
                deferred.resolve()
              }
            )
          } else {
            var laskentakaavaId = getlaskentakaavaId()
            var valintakoe = {
              tunniste: model.valintakoe.tunniste,
              nimi: model.valintakoe.nimi,
              kuvaus: model.valintakoe.kuvaus,
              laskentakaavaId: laskentakaavaId,
              aktiivinen: true,
              kutsutaankoKaikki: model.valintakoe.kutsutaankoKaikki,
              lahetetaankoKoekutsut: model.valintakoe.lahetetaankoKoekutsut,
              kutsuttavienMaara: model.valintakoe.kutsuttavienMaara,
              kutsunKohde: model.valintakoe.kutsunKohde,
              kutsunKohdeAvain: model.valintakoe.kutsunKohdeAvain,
            }

            ValinnanvaiheValintakoe.insert(
              { valinnanvaiheOid: parentValintakoeValinnanvaiheOid },
              valintakoe,
              function (result) {
                var index
                for (index in valintakokeet) {
                  if (result.oid === valintakokeet[index].oid) {
                    valintakokeet[index] = result
                  }
                }
                deferred.resolve()
              }
            )
          }
          return deferred.promise
        }

        this.getParentGroupType = function (path) {
          var type
          var pathArray = path.split('/')
          if (pathArray[1] === 'valintaryhma') {
            type = 'valintaryhma'
          } else {
            type = 'hakukohde'
          }

          return type
        }

        function getlaskentakaavaId() {
          var laskentakaavaId
          if (
            !model.valintakoe.laskentakaavaId ||
            model.valintakoe.laskentakaavaId === ''
          ) {
            laskentakaavaId = null
          } else {
            laskentakaavaId = model.valintakoe.laskentakaavaId
          }
          return laskentakaavaId
        }
      })()

      return model
    },
  ])

  .controller('ValintaryhmaValintakoeController', [
    '$scope',
    '$location',
    '$routeParams',
    'ValintakoeModel',
    'ValintaryhmaValintakoeValinnanvaiheModel',
    'SuoritaToiminto',
    function (
      $scope,
      $location,
      $routeParams,
      ValintakoeModel,
      ValintaryhmaValintakoeValinnanvaiheModel,
      SuoritaToiminto
    ) {
      'use strict'

      $scope.valintaryhmaOid = $routeParams.id
      $scope.valintakoeValinnanvaiheOid =
        $routeParams.valintakoevalinnanvaiheOid
      $scope.valintakoeOid = $routeParams.valintakoeOid
      $scope.model = ValintakoeModel
      $scope.model.refreshIfNeeded(
        $scope.valintakoeOid,
        $scope.valintaryhmaOid,
        undefined
      )

      $scope.submit = function () {
        SuoritaToiminto.avaa(function (success, failure) {
          var promise = $scope.model.persistValintakoe(
            $scope.valintakoeValinnanvaiheOid,
            ValintaryhmaValintakoeValinnanvaiheModel.valintakokeet
          )
          promise.then(
            function () {
              success(function () {
                $location.path(
                  '/' +
                    $scope.model.getParentGroupType($location.$$path) +
                    '/' +
                    $scope.valintaryhmaOid +
                    '/valintakoevalinnanvaihe/' +
                    $scope.valintakoeValinnanvaiheOid
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
        $location.path(
          '/' +
            $scope.model.getParentGroupType($location.$$path) +
            '/' +
            $scope.valintaryhmaOid +
            '/valintakoevalinnanvaihe/' +
            $scope.valintakoeValinnanvaiheOid
        )
      }
    },
  ])

  .controller('HakukohdeValintakoeController', [
    '$scope',
    '$location',
    '$routeParams',
    'ValintakoeModel',
    'ValintaryhmaValintakoeValinnanvaiheModel',
    'HakukohdeValintakoeValinnanvaiheModel',
    'SuoritaToiminto',
    function (
      $scope,
      $location,
      $routeParams,
      ValintakoeModel,
      ValintaryhmaValintakoeValinnanvaiheModel,
      HakukohdeValintakoeValinnanvaiheModel,
      SuoritaToiminto
    ) {
      'use strict'

      $scope.hakukohdeOid = $routeParams.hakukohdeOid
      $scope.valintakoeValinnanvaiheOid =
        $routeParams.valintakoevalinnanvaiheOid
      $scope.valintakoeOid = $routeParams.valintakoeOid
      $scope.model = ValintakoeModel
      $scope.model.refreshIfNeeded(
        $scope.valintakoeOid,
        undefined,
        $scope.hakukohdeOid
      )

      $scope.submit = function () {
        SuoritaToiminto.avaa(function (success, failure) {
          var promise = $scope.model.persistValintakoe(
            $scope.valintakoeValinnanvaiheOid,
            HakukohdeValintakoeValinnanvaiheModel.valintakokeet
          )
          promise.then(
            function () {
              success(function () {
                $location.path(
                  '/' +
                    $scope.model.getParentGroupType($location.$$path) +
                    '/' +
                    $scope.hakukohdeOid +
                    '/valintakoevalinnanvaihe/' +
                    $scope.valintakoeValinnanvaiheOid
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
        $location.path(
          '/' +
            $scope.model.getParentGroupType($location.$$path) +
            '/' +
            $scope.hakukohdeOid +
            '/valintakoevalinnanvaihe/' +
            $scope.valintakoeValinnanvaiheOid
        )
      }
    },
  ])
