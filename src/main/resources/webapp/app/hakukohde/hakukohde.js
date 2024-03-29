angular
  .module('valintaperusteet')

  .factory('HakukohdeModel', [
    '$q',
    'HakukohdeHakukohdekoodi',
    'KoodistoHakukohdekoodi',
    'Hakukohde',
    'Valintaryhma',
    'HakukohdeValinnanvaihe',
    'Valinnanvaihe',
    'ValinnanvaiheJarjesta',
    'HakukohdeKuuluuSijoitteluun',
    'HakukohdeHakijaryhma',
    'HakukohdeHakijaryhmaJarjesta',
    'Laskentakaava',
    'Hakijaryhma',
    'HaunTiedot',
    'Ilmoitus',
    'IlmoitusTila',
    'HakijaryhmaValintatapajono',
    function (
      $q,
      HakukohdeHakukohdekoodi,
      KoodistoHakukohdekoodi,
      Hakukohde,
      Valintaryhma,
      HakukohdeValinnanvaihe,
      Valinnanvaihe,
      ValinnanvaiheJarjesta,
      HakukohdeKuuluuSijoitteluun,
      HakukohdeHakijaryhma,
      HakukohdeHakijaryhmaJarjesta,
      Laskentakaava,
      Hakijaryhma,
      HaunTiedot,
      Ilmoitus,
      IlmoitusTila,
      HakijaryhmaValintatapajono
    ) {
      'use strict'

      var model = new (function () {
        this.hakukohdeOid = ''
        this.loaded = $q.defer()
        this.parentValintaryhma = {}
        this.hakukohde = {}
        this.valinnanvaiheet = []
        this.hakukohdekoodit = []
        this.hakijaryhmat = []
        this.kuuluuSijoitteluun = {}

        this.refresh = function (oid) {
          model.hakukohdeOid = oid
          model.parentValintaryhma = {}
          model.hakukohde = {}
          model.valinnanvaiheet = []
          model.hakukohdekoodit = []
          model.hakijaryhmat = []

          Hakukohde.get(
            { oid: oid },
            function (result) {
              model.hakukohde = result
              if (model.hakukohde.valintaryhmaOid) {
                Valintaryhma.get(
                  { oid: model.hakukohde.valintaryhmaOid },
                  function (result) {
                    model.parentValintaryhma = result
                  }
                )
              }

              HaunTiedot.get({ hakuOid: result.hakuoid }, function (haku) {
                model.haku = haku
              })

              HakukohdeKuuluuSijoitteluun.get({ oid: oid }, function (result) {
                model.kuuluuSijoitteluun = result.sijoitteluun
              })

              model.loaded.resolve()
            },
            function () {
              model.loaded.reject()
            }
          )

          KoodistoHakukohdekoodi.get(function (result) {
            model.hakukohdekoodit = result
          })

          HakukohdeHakijaryhma.get({ oid: oid }, function (result) {
            model.hakijaryhmat = result
          })

          HakukohdeValinnanvaihe.get({ parentOid: oid }, function (result) {
            model.valinnanvaiheet = result
          })
        }

        this.refreshIfNeeded = function (oid) {
          if (oid !== model.hakukohdeOid) {
            //use hakukohdeOid -variable to prevent multiple refresh calls
            this.refresh(oid)
          }
        }

        this.persistHakukohde = function (afterSuccess, afterFailure) {
          var promises = []
          var deferred = $q.defer()
          promises.push(
            Hakukohde.post(
              model.hakukohde,
              function (result) {},
              function (error) {}
            ).$promise
          )

          if (model.valinnanvaiheet.length > 0) {
            promises.push(deferred.promise)
            ValinnanvaiheJarjesta.post(
              getValinnanvaiheOids(),
              function (result) {
                var postPromises = []
                for (var i = 0; i < model.valinnanvaiheet.length; ++i) {
                  postPromises.push(
                    Valinnanvaihe.post(model.valinnanvaiheet[i], function () {})
                      .$promise
                  )
                }
                $q.all(postPromises).then(
                  function () {
                    deferred.resolve()
                  },
                  function (err) {
                    deferred.reject()
                  }
                )
              },
              function (error) {
                deferred.reject()
              }
            )
          }

          if (model.hakijaryhmat.length > 0) {
            promises.push(deferred.promise)
            HakukohdeHakijaryhmaJarjesta.post(
              getHakijaryhmaOids(),
              function (result) {
                var postPromises = []
                for (var i = 0; i < model.hakijaryhmat.length; ++i) {
                  postPromises.push(
                    HakijaryhmaValintatapajono.update(
                      model.hakijaryhmat[i],
                      function () {}
                    ).$promise
                  )
                }
                $q.all(postPromises).then(
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

          $q.all(promises).then(
            function () {
              afterSuccess(function () {})
            },
            function (err) {
              afterFailure(function () {})
            }
          )
        }

        this.remove = function (vaihe) {
          Valinnanvaihe.delete({ oid: vaihe.oid }, function (result) {
            for (var i in model.valinnanvaiheet) {
              if (vaihe.oid === model.valinnanvaiheet[i].oid) {
                model.valinnanvaiheet.splice(i, 1)
              }
            }
          })
        }

        this.getValinnanvaiheType = function (valinnanvaihe) {
          var type
          if (valinnanvaihe.valinnanVaiheTyyppi === 'TAVALLINEN') {
            type = 'valinnanvaihe'
          } else {
            type = 'valintakoevalinnanvaihe'
          }
          return type
        }

        this.addHakukohdeUri = function (hakukohdekoodiUri) {
          model.hakukohdekoodit.some(function (koodi) {
            if (koodi.koodiUri === hakukohdekoodiUri) {
              var hakukohdekoodi = {
                uri: koodi.koodiUri,
                arvo: koodi.koodiArvo,
              }

              koodi.metadata.forEach(function (metadata) {
                if (metadata.kieli === 'FI') {
                  hakukohdekoodi.nimiFi = metadata.nimi
                } else if (metadata.kieli === 'SV') {
                  hakukohdekoodi.nimiSv = metadata.nimi
                } else if (metadata.kieli === 'EN') {
                  hakukohdekoodi.nimiEn = metadata.nimi
                }
              })
              HakukohdeHakukohdekoodi.post(
                { hakukohdeOid: model.hakukohde.oid },
                hakukohdekoodi,
                function (result) {
                  model.hakukohde.hakukohdekoodi = result
                },
                function (error) {
                  alert(error.data)
                }
              )
              return true
            }
          })
        }

        this.removeHakijaryhma = function (hakijaryhmaOid) {
          HakijaryhmaValintatapajono.delete(
            { oid: hakijaryhmaOid },
            function () {
              for (var i in model.hakijaryhmat) {
                if (hakijaryhmaOid === model.hakijaryhmat[i].oid) {
                  model.hakijaryhmat.splice(i, 1)
                }
              }
            }
          )
        }
      })()

      function getValinnanvaiheOids() {
        var oids = []
        for (var i = 0; i < model.valinnanvaiheet.length; ++i) {
          oids.push(model.valinnanvaiheet[i].oid)
        }
        return oids
      }

      function getHakijaryhmaOids() {
        var oids = []
        for (var i = 0; i < model.hakijaryhmat.length; ++i) {
          oids.push(model.hakijaryhmat[i].oid)
        }
        return oids
      }

      return model
    },
  ])

  .controller('HakukohdeController', [
    '$scope',
    '$location',
    '$routeParams',
    'HakukohdeModel',
    'UserAccessLevels',
    'SuoritaToiminto',
    function (
      $scope,
      $location,
      $routeParams,
      HakukohdeModel,
      UserAccessLevels,
      SuoritaToiminto
    ) {
      'use strict'

      $scope.hakukohdeOid = $routeParams.hakukohdeOid
      $scope.model = HakukohdeModel
      $scope.model.refreshIfNeeded($scope.hakukohdeOid)
      $scope.userAccess = UserAccessLevels
      UserAccessLevels.refreshIfNeeded(
        $routeParams.id,
        $routeParams.hakukohdeOid
      )

      $scope.submit = function () {
        SuoritaToiminto.avaa(function (success, failure) {
          $scope.model.persistHakukohde(success, failure)
        })
      }
      $scope.cancel = function () {
        $location.path('/')
      }
      $scope.lisaaValinnanVaihe = function () {
        $location.path('/hakukohde/' + $scope.hakukohdeOid + '/valinnanvaihe/')
      }
      $scope.lisaaValintakoeValinnanVaihe = function () {
        $location.path(
          '/hakukohde/' + $scope.hakukohdeOid + '/valintakoevalinnanvaihe/'
        )
      }

      $scope.addHakukohdeUri = function () {
        $scope.model.addHakukohdeUri($scope.uusiHakukohdeUri.koodiUri)
        $scope.uusiHakukohdeUri = ''
      }

      $scope.lisaaHakijaryhma = function () {
        $location.path('/hakukohde/' + $scope.hakukohdeOid + '/hakijaryhma/')
      }

      $scope.removeHakijaryhma = function (hakijaryhmaOid) {
        $scope.model.removeHakijaryhma(hakijaryhmaOid)
      }

      $scope.$on('valintaryhmansiirto', function () {
        $scope.model.refresh($scope.hakukohdeOid)
      })

      $scope.$on('hakijaryhmaliita', function () {
        $scope.model.refresh($scope.hakukohdeOid)
      })
    },
  ])

  .factory('ValintaryhmaSiirtoModel', [
    '$resource',
    '$location',
    '$routeParams',
    'Valintaryhma',
    'ChildValintaryhmas',
    'Treemodel',
    'HakukohdeSiirra',
    function (
      $resource,
      $location,
      $routeParams,
      Valintaryhma,
      ChildValintaryhmas,
      Treemodel,
      HakukohdeSiirra
    ) {
      'use strict'

      var model = new (function () {
        this.valintaryhma = {}

        this.refresh = function () {
          model.valintaryhma = {}
          model.parentOid = ''
        }

        this.refreshIfNeeded = function () {
          this.refresh()
        }

        this.move = function () {
          if (model.parentOid) {
            HakukohdeSiirra.siirra(
              { hakukohdeOid: $routeParams.hakukohdeOid },
              model.parentOid,
              function (result) {}
            )
          }
        }
      })()

      return model
    },
  ])

  .controller('ValintaryhmanSiirtoController', [
    '$scope',
    '$routeParams',
    'ValintaryhmaSiirtoModel',
    'Ylavalintaryhma',
    'HakukohdeSiirra',
    function (
      $scope,
      $routeParams,
      ValintaryhmaSiirtoModel,
      Ylavalintaryhma,
      HakukohdeSiirra
    ) {
      'use strict'

      $scope.valintaryhmaOid = $routeParams.id
      $scope.model = ValintaryhmaSiirtoModel
      $scope.model.refreshIfNeeded($scope.valintaryhmaOid)

      $scope.domain = Ylavalintaryhma
      Ylavalintaryhma.refresh()

      $scope.siirra = function () {
        if ($scope.model.parentOid) {
          HakukohdeSiirra.siirra(
            { hakukohdeOid: $routeParams.hakukohdeOid },
            $scope.model.parentOid,
            function (result) {
              $scope.$emit('valintaryhmansiirto')
              $scope.$broadcast('suljemodal')
            }
          )
        }
      }

      $scope.openValintaryhmaModal = function () {
        $scope.show()
      }
    },
  ])

  .factory('HakijaryhmaLiitaHakukohdeModel', [
    '$resource',
    '$location',
    '$routeParams',
    'Hakijaryhma',
    'HakijaryhmaLiitaHakukohde',
    function (
      $resource,
      $location,
      $routeParams,
      Hakijaryhma,
      HakijaryhmaLiitaHakukohde
    ) {
      'use strict'

      var model = new (function () {
        this.hakijaryhma = {}

        this.refresh = function () {
          model.hakijaryhmaOid = {}
          this.parentOid = ''
        }

        this.refreshIfNeeded = function () {
          this.refresh()
        }

        this.move = function () {
          if (model.parentOid) {
            HakijaryhmaLiitaHakukohde.liita(
              {
                hakukohdeOid: $routeParams.hakukohdeOid,
                hakijaryhmaOid: $scope.model.parentOid,
              },
              function (result) {
                $scope.$emit('hakijaryhmaliita')
                $scope.$broadcast('suljemodal')
              }
            )
          }
        }
      })()

      return model
    },
  ])

  .controller('HakijaryhmaValintaHakukohdeController', [
    '$scope',
    '$routeParams',
    'HakijaryhmaLiitaHakukohdeModel',
    'ValintaryhmaModel',
    'HakijaryhmaLiitaHakukohde',
    'HakukohdeModel',
    function (
      $scope,
      $routeParams,
      HakijaryhmaLiitaHakukohdeModel,
      ValintaryhmaModel,
      HakijaryhmaLiitaHakukohde,
      HakukohdeModel
    ) {
      'use strict'

      $scope.model = HakijaryhmaLiitaHakukohdeModel
      $scope.model.refreshIfNeeded()

      ValintaryhmaModel.refresh(HakukohdeModel.hakukohde.valintaryhmaOid)
      $scope.domain = ValintaryhmaModel

      $scope.liita = function () {
        if ($scope.model.parentOid) {
          HakijaryhmaLiitaHakukohde.liita(
            {
              hakukohdeOid: $routeParams.hakukohdeOid,
              hakijaryhmaOid: $scope.model.parentOid,
            },
            function (result) {
              $scope.$emit('hakijaryhmaliita')
              $scope.$broadcast('suljemodal')
            }
          )
        }
      }

      $scope.openHakijaryhmaModal = function () {
        $scope.show()
      }
    },
  ])
