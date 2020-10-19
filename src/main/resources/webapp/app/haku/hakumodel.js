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
        this.initializingPromise = null
        this.onlyKoutaHaut = false
        this.haku = {}
        this.haut = []

        this.refresh = function () {
          var that = this
          return UserModel.refreshIfNeeded().then(function () {
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

            var organizationOids = _.filter(
              UserModel.organizationOids,
              function (o) {
                return o.startsWith('1.2.246.562.10.')
              }
            )

            return TarjontaHaut.get({
              virkailijaTyyppi: hakufiltering,
              organizationOids: organizationOids,
              onlyKoutaHaut: that.onlyKoutaHaut,
            }).then(
              function (haut) {
                that.haut = _.filter(haut, function (haku) {
                  return haku.tila === 'JULKAISTU' || haku.tila === 'VALMIS'
                })

                var previousHakuOid = $cookieStore.get('hakuoid')
                if (previousHakuOid) {
                  that.haku =
                    _.find(that.haut, function (haku) {
                      return haku.oid === previousHakuOid
                    }) || that.haut[0]
                } else {
                  that.haku = that.haut[0]
                }
                return that
              },
              function (error) {
                console.log(error)
                return error
              }
            )
          })
        }

        this.init = function () {
          if (!this.initializingPromise) {
            var that = this
            this.initializingPromise = this.refresh().then(
              function (model) {
                return model
              },
              function (error) {
                that.initializingPromise = null
                return error
              }
            )
          }
          return this.initializingPromise
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

      $scope.$watch('hakuModel.haku', function () {
        if ($scope.hakuModel.haku.oid) {
          sessionStorage.setItem(
            'valintaperusteHakuOid',
            $scope.hakuModel.haku.oid
          )
          $cookieStore.put('hakuoid', $scope.hakuModel.haku.oid)
        }
      })
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

        HakuModel.init().then(function (model) {
          that.hakuvuodetOpts = _.uniq(
            _.pluck(model.haut, 'hakukausiVuosi')
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
