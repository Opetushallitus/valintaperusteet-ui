angular
  .module('valintaperusteet')

  .factory('ValintaryhmaModel', [
    '$q',
    '_',
    'Valintaryhma',
    'Hakijaryhma',
    'HakijaryhmaJarjesta',
    'KoodistoHakukohdekoodi',
    'KoodistoAikuHakukohdekoodi',
    'KoodistoValintakoekoodi',
    'KoodistoHaunKohdejoukko',
    'Laskentakaava',
    'Treemodel',
    'ValintaryhmaValintakoekoodi',
    'Valinnanvaihe',
    'ValintaryhmaValinnanvaihe',
    'ValinnanvaiheJarjesta',
    'ValintaryhmaHakukohdekoodi',
    'ValintaryhmaHakijaryhma',
    'OrganizationByOid',
    '$modal',
    'Utils',
    'ParentValintaryhmas',
    'ChildValintaryhmas',
    '$location',
    '$log',
    'RootValintaryhmas',
    'Ilmoitus',
    'HakuModel',
    function (
      $q,
      _,
      Valintaryhma,
      Hakijaryhma,
      HakijaryhmaJarjesta,
      KoodistoHakukohdekoodi,
      KoodistoAikuHakukohdekoodi,
      KoodistoValintakoekoodi,
      KoodistoHaunKohdejoukko,
      Laskentakaava,
      Treemodel,
      ValintaryhmaValintakoekoodi,
      Valinnanvaihe,
      ValintaryhmaValinnanvaihe,
      ValinnanvaiheJarjesta,
      ValintaryhmaHakukohdekoodi,
      ValintaryhmaHakijaryhma,
      OrganizationByOid,
      $modal,
      Utils,
      ParentValintaryhmas,
      ChildValintaryhmas,
      $location,
      $log,
      RootValintaryhmas,
      Ilmoitus,
      HakuModel
    ) {
      'use strict'

      var model = new (function () {
        this.loaded = $q.defer()
        this.valintaryhma = {}
        this.valinnanvaiheet = []
        this.hakukohdekoodit = []
        this.valintakoekoodit = []
        this.kohdejoukot = []
        this.haut = []
        this.hakijaryhmat = []
        this.hakuoidit = []
        this.haettu = false
        this.nameerror = false
        this.okToDelete = false

        this.refresh = function (oid) {
          model.nameerror = false

          if (!oid) {
            model.valintaryhma = {}
            model.valinnanvaiheet = []
          } else {
            Valintaryhma.get(
              { oid: oid },
              function (result) {
                model.valintaryhma = result
                model.okToDelete = model.isOkToDelete()

                ParentValintaryhmas.get(
                  { parentOid: model.valintaryhma.oid },
                  function (data) {
                    model.valintaryhma.level = data.length
                    //if there are empty arrays present that are attached to view, the view won't update when arrays are modified
                    if (
                      model.valintaryhma.hakukohdekoodit !== undefined &&
                      model.valintaryhma.hakukohdekoodit.length === 0
                    ) {
                      model.valintaryhma.hakukohdekoodit = undefined
                    }
                    if (
                      model.valintaryhma.valintakoekoodit !== undefined &&
                      model.valintaryhma.valintakoekoodit.length === 0
                    ) {
                      model.valintaryhma.valintakoekoodit = undefined
                    }
                    model.valintaryhma.organisaatiot.forEach(function (
                      org,
                      index
                    ) {
                      OrganizationByOid.get(org, function (result) {
                        model.valintaryhma.organisaatiot[index] = result
                      })
                    })

                    model.loaded.resolve()
                  }
                )
              },
              function () {
                model.loaded.reject()
              }
            )

            ValintaryhmaValinnanvaihe.get({ oid: oid }, function (result) {
              model.valinnanvaiheet = result
            })

            ValintaryhmaHakijaryhma.get({ oid: oid }, function (result) {
              model.hakijaryhmat = result
              model.hakijaryhmat.forEach(function (hr) {
                Laskentakaava.get(
                  { oid: hr.laskentakaavaId, funktiopuu: false },
                  function (result) {
                    hr.laskentakaava_nimi = result.nimi
                  }
                )
              })
            })

            KoodistoHaunKohdejoukko.get(function (result) {
              model.kohdejoukot = result
            })

            if (_.isEmpty(HakuModel.hakuDeferred)) {
              HakuModel.init()
            }

            HakuModel.hakuDeferred.promise.then(
              function () {
                model.haut = HakuModel.haut
              },
              function (error) {
                $log.error('Hakujen haku epäonnistui', error)
              }
            )
          }
        }

        this.getHakukohdekoodit = function () {
          var deferred = $q.defer()
          $q.all([
            KoodistoHakukohdekoodi.get().$promise,
            KoodistoAikuHakukohdekoodi.get().$promise,
          ]).then(function (resolved) {
            model.hakukohdekoodit = resolved[0].concat(resolved[1])
            deferred.resolve()
          })
          return deferred.promise
        }

        this.getValintakoeKoodit = function () {
          var deferred = $q.defer()
          KoodistoValintakoekoodi.get(function (result) {
            model.valintakoekoodit = result
            deferred.resolve()
          })
          return deferred.promise
        }

        this.refreshIfNeeded = function (oid) {
          if (oid !== model.valintaryhma.oid) {
            this.refresh(oid)
          }
        }

        this.updateKohdejoukot = function (kohdejoukko, oid) {
          var deferred = $q.defer()

          ChildValintaryhmas.get(
            { parentOid: oid },
            function (result) {
              if (result.length == 0) {
                deferred.resolve()
              }
              result.forEach(function (valintaryhma) {
                var promises = []
                if (valintaryhma.kohdejoukko !== kohdejoukko) {
                  valintaryhma.kohdejoukko = kohdejoukko
                  promises.push(
                    Valintaryhma.post(valintaryhma, function (result) {})
                      .$promise
                  )
                }
                promises.push(
                  model.updateKohdejoukot(kohdejoukko, valintaryhma.oid)
                )

                $q.all(promises).then(
                  function () {
                    deferred.resolve()
                  },
                  function (error) {
                    deferred.reject()
                  }
                )
              })
            },
            function (error) {
              deferred.reject()
            }
          )
          return deferred.promise
        }

        this.persistValintaryhma = function (oid, afterSuccess, afterFailure) {
          if (model.valintaryhma.level === 1) {
            RootValintaryhmas.get(
              { parentOid: model.parentOid },
              function (all) {
                model.persist(all, all, afterSuccess, afterFailure)
              },
              function (error) {
                afterFailure(function () {})
              }
            )
          } else {
            ParentValintaryhmas.get(
              { parentOid: oid },
              function (parents) {
                ChildValintaryhmas.get(
                  { parentOid: parents[0].oid },
                  function (children) {
                    model.persist(parents, children, afterSuccess, afterFailure)
                  },
                  function (error) {
                    afterFailure(function () {})
                  }
                )
              },
              function (error) {
                afterFailure(function () {})
              }
            )
          }
        }

        this.persist = function (
          parents,
          children,
          afterSuccess,
          afterFailure
        ) {
          if (!Utils.hasSameName(model, parents, children)) {
            model.nameerror = false
            var promises = []
            var deferred = $q.defer()
            promises.push(deferred.promise)
            Valintaryhma.post(
              model.valintaryhma,
              function (result) {
                model.valintaryhma = result
                if (model.valintaryhma.level === 1) {
                  model
                    .updateKohdejoukot(
                      model.valintaryhma.kohdejoukko,
                      model.valintaryhma.oid
                    )
                    .then(
                      function () {
                        deferred.resolve()
                      },
                      function (error) {
                        deferred.reject()
                      }
                    )
                } else {
                  deferred.resolve()
                }
                Treemodel.refresh()
              },
              function (error) {
                deferred.reject()
              }
            )

            if (model.valinnanvaiheet.length > 0) {
              promises.push(
                ValinnanvaiheJarjesta.post(getValinnanvaiheOids(), function (
                  result
                ) {}).$promise
              )
              for (var i = 0; i < model.valinnanvaiheet.length; ++i) {
                promises.push(
                  Valinnanvaihe.post(model.valinnanvaiheet[i], function () {})
                    .$promise
                )
              }
            }

            if (model.hakijaryhmat.length > 0) {
              promises.push(
                HakijaryhmaJarjesta.post(getHakijaryhmaOids(), function (
                  result
                ) {}).$promise
              )
              for (var i = 0; i < model.hakijaryhmat.length; ++i) {
                promises.push(
                  Hakijaryhma.update(model.hakijaryhmat[i], function () {})
                    .$promise
                )
              }
            }

            $q.all(promises).then(
              function () {
                afterSuccess(function () {})
              },
              function (err) {
                afterFailure(function () {})
              }
            )
          } else {
            afterFailure(function () {},
            'Valintaryhmän nimi on jo käytössä. Anna jokin toinen nimi ryhmälle.')
            model.nameerror = true
          }
        }

        this.deleteValintaryhma = function (oid, laskentakaavat) {
          $modal
            .open({
              backdrop: 'static',
              templateUrl: 'poistavalintaryhma.html',
              controller: function ($scope, $window, $modalInstance) {
                $scope.laskentakaavat = laskentakaavat
                $scope.ok = function () {
                  Valintaryhma.delete({ oid: oid }, function (result) {
                    Treemodel.refresh()
                    $location.path('/')
                  })
                  $modalInstance.close()
                }
                $scope.cancel = function () {
                  $modalInstance.dismiss('cancel')
                }
              },
            })
            .result.then(
              function () {},
              function () {}
            )
        }

        this.removeValinnanvaihe = function (vaihe) {
          $modal
            .open({
              backdrop: 'static',
              templateUrl: 'poistavalinnanvaihe.html',
              controller: function ($scope, $window, $modalInstance) {
                $scope.ok = function () {
                  $scope.working = true
                  Valinnanvaihe.delete({ oid: vaihe.oid }, function () {
                    for (var i in model.valinnanvaiheet) {
                      if (vaihe.oid === model.valinnanvaiheet[i].oid) {
                        model.valinnanvaiheet.splice(i, 1)
                      }
                    }
                  }).$promise.then(function () {
                    $scope.working = false
                    $modalInstance.close()
                  })
                }
                $scope.cancel = function () {
                  $modalInstance.dismiss('cancel')
                }
              },
            })
            .result.then(
              function () {},
              function () {}
            )
        }

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

        this.getValinnanvaiheType = function (valinnanvaihe) {
          var type
          if (valinnanvaihe.valinnanVaiheTyyppi === 'TAVALLINEN') {
            type = 'valinnanvaihe'
          } else {
            type = 'valintakoevalinnanvaihe'
          }
          return type
        }

        this.getValintaryhmaOrganisaatioOids = function () {
          return _.reduce(
            model.valintaryhma.organisaatiot,
            function (memo, item) {
              memo.push(item.oid)
              return memo
            },
            []
          )
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

              //persist valintaryhma with added hakukohdekoodiuri
              ValintaryhmaHakukohdekoodi.insert(
                { valintaryhmaOid: model.valintaryhma.oid },
                hakukohdekoodi,
                function (result) {
                  if (!model.valintaryhma.hakukohdekoodit) {
                    model.valintaryhma.hakukohdekoodit = []
                  }
                  model.valintaryhma.hakukohdekoodit.push(result)
                },
                function (error) {
                  $log.error(error.data)
                }
              )
              return true
            }
          })
        }

        this.addValintakoeUri = function (valintakoeKoodiUri) {
          model.valintakoekoodit.some(function (koodi) {
            if (koodi.koodiUri === valintakoeKoodiUri) {
              var valintakoekoodi = {
                uri: koodi.koodiUri,
                arvo: koodi.koodiArvo,
              }

              koodi.metadata.forEach(function (metadata) {
                if (metadata.kieli === 'FI') {
                  valintakoekoodi.nimiFi = metadata.nimi
                } else if (metadata.kieli === 'SV') {
                  valintakoekoodi.nimiSv = metadata.nimi
                } else if (metadata.kieli === 'EN') {
                  valintakoekoodi.nimiEn = metadata.nimi
                }
              })

              //persist valintaryhma with added valintakoekoodiuri
              ValintaryhmaValintakoekoodi.insert(
                { valintaryhmaOid: model.valintaryhma.oid },
                valintakoekoodi,
                function (result) {
                  if (!model.valintaryhma.valintakoekoodit) {
                    model.valintaryhma.valintakoekoodit = []
                  }
                  model.valintaryhma.valintakoekoodit.push(result)
                },
                function (error) {
                  $log.error(error.data)
                }
              )
              return true
            }
          })
        }

        this.removeHakukohdeKoodi = function (hakukohdekoodi) {
          var hakukohdekoodit, index

          hakukohdekoodit = model.valintaryhma.hakukohdekoodit
          index = hakukohdekoodit.indexOf(hakukohdekoodi)

          if (index !== -1) {
            hakukohdekoodit.splice(index, 1)
          }

          ValintaryhmaHakukohdekoodi.post(
            { valintaryhmaOid: model.valintaryhma.oid },
            hakukohdekoodit,
            function (result) {
              if (model.valintaryhma.hakukohdekoodit.length === 0) {
                model.valintaryhma.hakukohdekoodit = undefined
              }
            }
          )
        }

        this.removeValintakoeKoodi = function (valintakoekoodi) {
          var valintakoekoodit, index

          valintakoekoodit = model.valintaryhma.valintakoekoodit
          index = valintakoekoodit.indexOf(valintakoekoodi)

          if (index !== -1) {
            valintakoekoodit.splice(index, 1)
          }

          ValintaryhmaValintakoekoodi.post(
            { valintaryhmaOid: model.valintaryhma.oid },
            valintakoekoodit,
            function (result) {
              if (model.valintaryhma.valintakoekoodit.length === 0) {
                model.valintaryhma.valintakoekoodit = undefined
              }
            }
          )
        }

        this.removeHakijaryhma = function (hakijaryhmaOid) {
          $modal
            .open({
              backdrop: 'static',
              templateUrl: 'poistahakijaryhma.html',
              controller: function ($scope, $window, $modalInstance) {
                $scope.ok = function () {
                  Hakijaryhma.delete(
                    { oid: hakijaryhmaOid },
                    function (result) {
                      model.hakijaryhmat = _.filter(
                        model.hakijaryhmat,
                        function (item) {
                          return item.oid !== hakijaryhmaOid
                        }
                      )
                    },
                    function (error) {
                      $log.error(
                        'Hakijaryhmän poistaminen valintaryhmästä ei onnistunu',
                        error
                      )
                      $log.error(
                        'Hakijaryhm\u00E4 on k\u00E4yt\u00F6ss\u00E4 eik\u00E4 sit\u00E4 voi poistaa.'
                      )
                    }
                  )
                  $modalInstance.close()
                }
                $scope.cancel = function () {
                  $modalInstance.dismiss('cancel')
                }
              },
            })
            .result.then(
              function () {},
              function () {}
            )
        }

        this.isOkToDelete = function () {
          return (
            !model.valintaryhma.lapsihakukohde &&
            !model.valintaryhma.lapsivalintaryhma
          )
        }
      })()

      return model
    },
  ])

  .controller('ValintaryhmaController', [
    '$scope',
    '$log',
    '$q',
    '$location',
    '$routeParams',
    'ValintaryhmaModel',
    'Laskentakaava',
    'UserAccessLevels',
    '$modal',
    'SuoritaToiminto',
    function (
      $scope,
      $log,
      $q,
      $location,
      $routeParams,
      ValintaryhmaModel,
      Laskentakaava,
      UserAccessLevels,
      $modal,
      SuoritaToiminto
    ) {
      'use strict'

      $scope.valintaryhmaOid = $routeParams.id
      $scope.model = ValintaryhmaModel
      $scope.model.refreshIfNeeded($scope.valintaryhmaOid)

      UserAccessLevels.refreshIfNeeded(
        $routeParams.id,
        $routeParams.hakukohdeOid
      )

      $scope.submit = function () {
        if ($scope.model.valintaryhma.viimeinenKaynnistyspaiva) {
          $scope.model.valintaryhma.viimeinenKaynnistyspaiva = new Date(
            $scope.model.valintaryhma.viimeinenKaynnistyspaiva
          )
        }
        SuoritaToiminto.avaa(function (success, failure) {
          $scope.model.persistValintaryhma(
            $scope.valintaryhmaOid,
            success,
            failure
          )
        })
      }

      $scope.cancel = function () {
        $location.path('/')
      }

      $scope.deleteValintaryhma = function () {
        Laskentakaava.list({ valintaryhma: $scope.valintaryhmaOid }, function (
          data
        ) {
          $scope.model.deleteValintaryhma($scope.valintaryhmaOid, data)
        })
      }

      $scope.lisaaValinnanVaihe = function () {
        $location.path(
          '/valintaryhma/' + $scope.valintaryhmaOid + '/valinnanvaihe/'
        )
      }

      $scope.lisaaValintakoeValinnanVaihe = function () {
        $location.path(
          '/valintaryhma/' +
            $scope.valintaryhmaOid +
            '/valintakoevalinnanvaihe/'
        )
      }

      $scope.lisaaHakijaryhma = function () {
        $location.path(
          '/valintaryhma/' + $scope.valintaryhmaOid + '/hakijaryhma/'
        )
      }

      $scope.toValintaryhmaForm = function () {
        $location.path('/valintaryhma/' + $scope.valintaryhmaOid)
      }

      $scope.organisaatioSelector = function (data) {
        if (!$scope.model.valintaryhma.organisaatiot) {
          $scope.model.valintaryhma.organisaatiot = []
        }
        var contains = false
        $scope.model.valintaryhma.organisaatiot.forEach(function (org) {
          if (data.oid === org.oid) {
            contains = true
          }
        })

        if (!contains) {
          $scope.model.valintaryhma.organisaatiot.push(data)
        }
      }

      $scope.showValintaryhmaKopiointi = function () {
        var resultErrorHandler = function ($scope) {
          return function (httpResponse) {
            $log.error('Valintaryhmän kopiointi epäonnnistui: ', httpResponse)
            if (httpResponse.status) {
              var errorStr =
                'Valintaryhmän kopiointi epäonnnistui. Virhe: ' +
                httpResponse.status
              if (httpResponse.data) {
                if (httpResponse.data.message) {
                  errorStr = errorStr + ' - ' + httpResponse.data.message
                } else if (httpResponse.statusText) {
                  errorStr = errorStr + ' - ' + httpResponse.statusText
                } else {
                  errorStr = errorStr + ' - ' + httpResponse.data
                }
              }
              $scope.error = errorStr
              $scope.working = false
            } else {
              $scope.error =
                'Valintaryhmän kopiointi aikakatkaistu. Huom! Älä käynnistä uutta, kopiointi todennäköisesti yhä palvelimella käynnissä'
            }
          }
        }
        $modal
          .open({
            backdrop: 'static',
            templateUrl: 'valintaryhma/valintaryhmaKopiointi.html',
            size: 'lg',
            controller: function (
              $scope,
              $window,
              $modalInstance,
              kopioitavaOid,
              ValintaryhmaKopiointi,
              ValintaryhmaKopiointiJuureen
            ) {
              $scope.model = {}
              $scope.kopioObj = {}
              $scope.working = false
              $scope.kopioiValintaryhma = function () {
                $scope.error = false
                $scope.working = true
                if (!$scope.kopioObj.value.oid) {
                  ValintaryhmaKopiointiJuureen.put(
                    {
                      kopioitavaOid: $routeParams.id,
                      nimi: $scope.model.uusinimi,
                    },
                    function () {
                      $scope.working = false
                      $modalInstance.dismiss('cancel')
                    },
                    resultErrorHandler($scope)
                  )
                } else {
                  ValintaryhmaKopiointi.put(
                    {
                      parentOid: $scope.kopioObj.value.oid,
                      kopioitavaOid: $routeParams.id,
                      nimi: $scope.model.uusinimi,
                    },
                    function () {
                      $scope.working = false
                      $modalInstance.dismiss('cancel')
                    },
                    resultErrorHandler($scope)
                  )
                }
              }

              $scope.error = false

              $scope.cancel = function () {
                $modalInstance.dismiss('cancel')
              }
            },
            resolve: {
              kopioitavaOid: function () {
                return ValintaryhmaModel.valintaryhma.oid
              },
            },
          })
          .result.then(
            function () {},
            function () {}
          )

        //
      }

      $scope.openHakijaryhmaKopiointiModal = function (hakijaryhma) {
        $scope.$broadcast('openHakijaryhmaKopiointiModal', hakijaryhma)
      }
    },
  ])

  .controller('HakijaryhmaKopiointiController', [
    '$scope',
    '$routeParams',
    '$log',
    'Ylavalintaryhma',
    'HakijaryhmaKopiointi',
    function (
      $scope,
      $routeParams,
      $log,
      Ylavalintaryhma,
      HakijaryhmaKopiointi
    ) {
      $scope.domain = Ylavalintaryhma
      $scope.domain.refresh()

      $scope.model = {}
      $scope.working = false

      $scope.hakijaryhma = {}

      $scope.$on('openHakijaryhmaKopiointiModal', function (
        event,
        hakijaryhma
      ) {
        $scope.hakijaryhma = hakijaryhma
        $scope.show()
      })

      $scope.kopioiHakijaryhma = function () {
        $scope.working = true

        var payload = {
          uusinimi: $scope.model.uusinimi,
          valintaryhmaOid: $scope.model.parentOid,
          nimi: $scope.hakijaryhma.nimi,
          kuvaus: $scope.hakijaryhma.kuvaus,
          kiintio: $scope.hakijaryhma.kiintio,
          laskentakaavaId: $scope.hakijaryhma.laskentakaavaId,
          kaytaKaikki: $scope.hakijaryhma.kaytaKaikki,
          tarkkaKiintio: $scope.hakijaryhma.tarkkaKiintio,
        }

        HakijaryhmaKopiointi.put(
          payload,
          function (result) {
            $scope.working = false
            $scope.$broadcast('suljemodal')
          },
          function (error) {
            $scope.working = false
            $log.error(
              'Hakijaryhman kopiointi toiseen valintaryhmään ei onnistunut',
              error
            )
            $scope.$broadcast('suljemodal')
          }
        )
      }
    },
  ])
