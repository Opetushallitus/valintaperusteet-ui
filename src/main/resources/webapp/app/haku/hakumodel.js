angular
  .module('valintaperusteet')

  .factory('HakuModel', [
    '$q',
    '$cookieStore',
    '_',
    'UserModel',
    'TarjontaHaut',
    function ($q, $cookieStore, _, UserModel, TarjontaHaut) {
      'use strict'

      return new (function () {
        this.hakuDeferred = undefined
        this.hakuOid = ''
        this.haku = {}
        this.haut = []

        this.init = function () {
          if (this.haut.length < 1 && !this.hakuDeferred) {
            this.hakuDeferred = $q.defer()
            var that = this
            UserModel.refreshIfNeeded().then(function () {
              var hakufiltering = 'all'
              if (
                UserModel.isOphUser ||
                (UserModel.hasOtherThanKKUserOrgs && UserModel.isKKUser)
              ) {
                hakufiltering = 'all'
              } else if (
                UserModel.isKKUser &&
                !UserModel.hasOtherThanKKUserOrgs
              ) {
                hakufiltering = 'kkUser'
              } else if (
                !UserModel.isKKUser &&
                UserModel.hasOtherThanKKUserOrgs
              ) {
                hakufiltering = 'toinenAsteUser'
              }

              TarjontaHaut.get(
                { virkailijaTyyppi: hakufiltering },
                function (haut) {
                  that.haut = _.filter(haut, function (haku) {
                    return haku.tila === 'JULKAISTU' || haku.tila === 'VALMIS'
                  })

                  if ($cookieStore.get('hakuoid')) {
                    var previouslySelectedHaku = _.find(that.haut, function (
                      haku
                    ) {
                      return haku.oid === $cookieStore.get('hakuoid')
                    })
                    if (previouslySelectedHaku) {
                      that.hakuOid = $cookieStore.get('hakuoid')
                      that.haku = previouslySelectedHaku
                    }
                  } else {
                    that.haku = that.haut[0]
                  }

                  that.hakuDeferred.resolve()
                },
                function (error) {
                  console.log(error)
                  that.hakuDeferred.reject()
                }
              )
            })
          }
        }

        this.isKKHaku = function (haku) {
          return haku.kohdejoukkoUri.indexOf('_12') > -1
        }
      })()
    },
  ])

  .controller('HakuController', [
    '$scope',
    'HakuModel',
    '$cookieStore',
    'CustomHakuUtil',
    function ($scope, HakuModel, $cookieStore, CustomHakuUtil) {
      $scope.hakuModel = HakuModel
      $scope.hakuModel.init()
      $scope.customHakuUtil = CustomHakuUtil
      CustomHakuUtil.refreshIfNeeded()

      $scope.changeHaku = function () {
        if ($scope.hakuModel && $scope.hakuModel.haku) {
          $scope.hakuModel.hakuOid = $scope.hakuModel.haku.oid
          sessionStorage.setItem(
            'valintaperusteHakuOid',
            $scope.hakuModel.hakuOid
          )
          $cookieStore.put('hakuoid', $scope.hakuModel.hakuOid)
        }
      }
    },
  ])

  .filter('kkHakuFilter', [
    '_',
    function (_) {
      return function (haut) {
        return _.filter(haut, function (haku) {
          if (haku.kohdejoukkoUri) {
            return haku.kohdejoukkoUri.indexOf('_12') > -1
          }
        })
      }
    },
  ])

  .filter('CustomHakuFilter', [
    '_',
    function (_) {
      return function (haut, customHakuUtil) {
        var result = haut
        _.each(customHakuUtil.hakuKeys, function (key) {
          if (
            customHakuUtil[key].value !== null &&
            customHakuUtil[key].value !== undefined
          ) {
            result = customHakuUtil[key].filter(result)
          }
        })
        return result
      }
    },
  ])

  .service('CustomHakuUtil', [
    '$q',
    '_',
    'HakujenHakutyypit',
    'HakujenKohdejoukot',
    'HakujenHakutavat',
    'HakujenHakukaudet',
    'HakuModel',
    function (
      $q,
      _,
      HakujenHakutyypit,
      HakujenKohdejoukot,
      HakujenHakutavat,
      HakujenHakukaudet,
      HakuModel
    ) {
      this.hakuKeys = [
        'hakuvuosi',
        'hakukausi',
        'kohdejoukko',
        'hakutapa',
        'hakutyyppi',
      ]

      this.deferred = undefined // deferred here is meant just to prevent multiple refresh-calls

      this.hakutyyppiOpts = undefined
      this.kohdejoukkoOpts = undefined
      this.hakutapaOpts = undefined
      this.hakukausiOpts = undefined
      this.hakuvuodetOpts = undefined

      this.refresh = function () {
        var that = this
        this.deferred = $q.defer()

        HakujenHakutyypit.query(function (result) {
          that.hakutyyppiOpts = _.map(result, function (hakutyyppi) {
            //parse hakuoptions
            return {
              koodiUri: hakutyyppi.koodiUri,
              nimi: _.findWhere(hakutyyppi.metadata, { kieli: 'FI' }).nimi,
            }
          })
        })

        HakujenKohdejoukot.query(function (result) {
          that.kohdejoukkoOpts = _.map(result, function (kohdejoukko) {
            //parse hakuoptions
            return {
              koodiUri: kohdejoukko.koodiUri,
              nimi: _.findWhere(kohdejoukko.metadata, { kieli: 'FI' }).nimi,
            }
          })
        })

        HakujenHakutavat.query(function (result) {
          that.hakutapaOpts = _.map(result, function (tapa) {
            //parse hakuoptions
            return {
              koodiUri: tapa.koodiUri,
              nimi: _.findWhere(tapa.metadata, { kieli: 'FI' }).nimi,
            }
          })
        })

        HakujenHakukaudet.query(function (result) {
          that.hakukausiOpts = _.map(result, function (kausi) {
            //parse hakuoptions
            return {
              koodiUri: kausi.koodiUri,
              nimi: _.findWhere(kausi.metadata, { kieli: 'FI' }).nimi,
            }
          })
        })

        if (_.isEmpty(HakuModel.deferred)) {
          HakuModel.init()
        }

        HakuModel.hakuDeferred.promise.then(function () {
          that.hakuvuodetOpts = _.uniq(
            _.pluck(HakuModel.haut, 'hakukausiVuosi')
          ).filter(function (hakuvuosi) {
            return hakuvuosi !== null
          })
        })

        this.deferred.resolve()
      }

      this.refreshIfNeeded = function () {
        if (_.isEmpty(this.deferred)) {
          this.refresh()
        }
      }

      this.hakuvuosi = {
        value: undefined,
        filter: function (haut) {
          var that = this
          return !_.isNumber(this.value)
            ? haut
            : _.filter(haut, function (haku) {
                return haku.hakukausiVuosi === that.value
              })
        },
      }

      this.hakukausi = {
        value: undefined,
        filter: function (haut) {
          var that = this
          return !_.isString(this.value)
            ? haut
            : _.filter(haut, function (haku) {
                return haku.hakukausiUri.indexOf(that.value) > -1
              })
        },
      }

      this.kohdejoukko = {
        value: undefined,
        filter: function (haut) {
          var that = this
          return !_.isString(this.value)
            ? haut
            : _.filter(haut, function (haku) {
                return haku.kohdejoukkoUri.indexOf(that.value) > -1
              })
        },
      }

      this.hakutapa = {
        value: undefined,
        filter: function (haut) {
          var that = this
          return !_.isString(this.value)
            ? haut
            : _.filter(haut, function (haku) {
                return haku.hakutapaUri.indexOf(that.value) > -1
              })
        },
      }

      this.hakutyyppi = {
        value: undefined,
        filter: function (haut) {
          var that = this
          return !_.isString(this.value)
            ? haut
            : _.filter(haut, function (haku) {
                return haku.hakutyyppiUri.indexOf(that.value) > -1
              })
        },
      }
    },
  ])
