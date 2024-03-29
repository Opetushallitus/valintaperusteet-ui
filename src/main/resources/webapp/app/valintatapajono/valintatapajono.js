angular
  .module('valintaperusteet')

  .factory('ValintatapajonoModel', [
    '$rootScope',
    '$q',
    'Valintatapajono',
    'ValinnanvaiheValintatapajono',
    'ValintatapajonoJarjestyskriteeri',
    'Laskentakaava',
    'Jarjestyskriteeri',
    'JarjestyskriteeriJarjesta',
    'ValintatapajonoHakijaryhma',
    'HakukohdeHakijaryhma',
    'ValintaryhmaHakijaryhma',
    'HakijaryhmaValintatapajono',
    'ValintatapajonoValmisSijoiteltavaksi',
    '$modal',
    'Ilmoitus',
    'KoodistoValintatapajono',
    '$location',
    function (
      $rootScope,
      $q,
      Valintatapajono,
      ValinnanvaiheValintatapajono,
      ValintatapajonoJarjestyskriteeri,
      Laskentakaava,
      Jarjestyskriteeri,
      JarjestyskriteeriJarjesta,
      ValintatapajonoHakijaryhma,
      HakukohdeHakijaryhma,
      ValintaryhmaHakijaryhma,
      HakijaryhmaValintatapajono,
      ValintatapajonoValmisSijoiteltavaksi,
      $modal,
      Ilmoitus,
      KoodistoValintatapajono,
      $location
    ) {
      'use strict'

      function lastMomentOfDate(date) {
        const lastMoment = new Date(date)
        lastMoment.setHours(23, 59, 59, 999)
        return lastMoment
      }

      var model = new (function () {
        this.valintatapajono = {}
        this.jarjestyskriteerit = []
        this.hakijaryhmat = []
        this.jonot = []
        this.valintatapajonoTyypit = []

        this.refresh = function (oid, valinnanVaiheOid) {
          this.refreshValintatapajonoTyypit()

          ValinnanvaiheValintatapajono.get(
            { parentOid: valinnanVaiheOid },
            function (result) {
              model.jonot = _.filter(result, function (jono) {
                return jono.oid != oid && jono.siirretaanSijoitteluun
              })
            }
          )

          ValintatapajonoValmisSijoiteltavaksi.get({ oid: oid }, function (
            result
          ) {
            model.valmisSijoiteltavaksi = !!result.value
          })

          Valintatapajono.get({ oid: oid }, function (result) {
            model.valintatapajono = result
            model.valintatapajono.rajattu = model.valintatapajono.varasijat > 0
            model.valintatapajono.alkaenRajattu = !!model.valintatapajono
              .varasijojaKaytetaanAlkaen
            model.valintatapajono.astiRajattu = !!model.valintatapajono
              .varasijojaTaytetaanAsti
            if (model.valintatapajono.varasijojaTaytetaanAsti) {
              model.valintatapajono.varasijojaTaytetaanAsti = new Date(
                model.valintatapajono.varasijojaTaytetaanAsti
              )
            }

            if (model.valintatapajono.eiLasketaPaivamaaranJalkeen) {
              model.valintatapajono.eiLasketaPaivamaaranJalkeen = lastMomentOfDate(
                new Date(model.valintatapajono.eiLasketaPaivamaaranJalkeen)
              )
            }

            if (model.valintatapajono.varasijojaKaytetaanAlkaen) {
              model.valintatapajono.varasijojaKaytetaanAlkaen = new Date(
                model.valintatapajono.varasijojaKaytetaanAlkaen
              )
            }
            model.valintatapajono.siirretaanSijoitteluun = !!model
              .valintatapajono.siirretaanSijoitteluun
            model.valintatapajono.kaytetaanValintalaskentaa = !!model
              .valintatapajono.kaytetaanValintalaskentaa
            model.valintatapajono.kaikkiEhdonTayttavatHyvaksytaan = !!model
              .valintatapajono.kaikkiEhdonTayttavatHyvaksytaan
            model.valintatapajono.poistetaankoHylatyt = !!model.valintatapajono
              .poistetaankoHylatyt
            model.valintatapajono.valisijoittelu = !!model.valintatapajono
              .valisijoittelu
            model.valintatapajono.automaattinenSijoitteluunSiirto = !!model
              .valintatapajono.automaattinenSijoitteluunSiirto
          })

          ValintatapajonoHakijaryhma.get({ oid: oid }, function (result) {
            model.hakijaryhmat = result
          })

          this.refreshJK(oid)
        }

        this.refreshValintatapajonoTyypit = function () {
          KoodistoValintatapajono.get(function (result) {
            result.forEach((koodi) => {
              koodi.metadata = koodi.metadata.filter(
                (m) => m.kieli == $rootScope.userLang.toUpperCase()
              )
            })
            model.valintatapajonoTyypit = result
          })
        }

        this.refreshIfNeeded = function (
          oid,
          valintaryhmaOid,
          hakukohdeOid,
          valinnanVaiheOid
        ) {
          if (!oid) {
            model.valintatapajono = {}
            model.jarjestyskriteerit = []
            model.hakijaryhmat = []
            model.valintatapajono.tasapistesaanto = 'YLITAYTTO'
            model.valintatapajono.siirretaanSijoitteluun = !!model
              .valintatapajono.siirretaanSijoitteluun
            model.valintatapajono.kaytetaanValintalaskentaa = !!model
              .valintatapajono.kaytetaanValintalaskentaa
            model.valintatapajono.kaikkiEhdonTayttavatHyvaksytaan = !!model
              .valintatapajono.kaikkiEhdonTayttavatHyvaksytaan
            model.valintatapajono.poistetaankoHylatyt = !!model.valintatapajono
              .poistetaankoHylatyt
            model.valintatapajono.valisijoittelu = !!model.valintatapajono
              .valisijoittelu
            model.valintatapajono.automaattinenSijoitteluunSiirto = !!model
              .valintatapajono.automaattinenSijoitteluunSiirto
            model.valintatapajono.automaattinenSijoitteluunSiirtoMuokattavissa = !!model
              .valintatapajono.automaattinenSijoitteluunSiirtoMuokattavissa
            this.refreshValintatapajonoTyypit()
          } else if (oid !== model.valintatapajono.oid) {
            this.refresh(oid, valinnanVaiheOid)
          }
        }

        this.refreshJK = function (oid) {
          ValintatapajonoJarjestyskriteeri.get({ parentOid: oid }, function (
            result
          ) {
            model.jarjestyskriteerit = result
            model.jarjestyskriteerit.forEach(function (jk) {
              Laskentakaava.get(
                { oid: jk.laskentakaavaId, funktiopuu: false },
                function (result) {
                  jk.nimi = result.nimi
                }
              )
            })
          })
        }

        this.submit = function (
          valinnanvaiheOid,
          valintatapajonot,
          afterSuccess,
          afterFailure
        ) {
          if (!model.valintatapajono.rajattu) {
            model.valintatapajono.varasijat = 0
          }

          if (!model.valintatapajono.alkaenRajattu) {
            model.valintatapajono.varasijojaKaytetaanAlkaen = null
          }

          if (!model.valintatapajono.astiRajattu) {
            model.valintatapajono.varasijojaTaytetaanAsti = null
          }

          if (
            !model.valintatapajono.aloituspaikat &&
            model.valintatapajono.kaikkiEhdonTayttavatHyvaksytaan
          ) {
            model.valintatapajono.aloituspaikat = 0
          }

          // Ei mitään null checkiä tähän!!!!
          if (!model.valintatapajono.oid) {
            model.valintatapajono.aktiivinen = true
            ValinnanvaiheValintatapajono.insert(
              { parentOid: valinnanvaiheOid },
              model.valintatapajono,
              function (result) {
                model.valintatapajono = result
                model.valintatapajono.rajattu =
                  model.valintatapajono.varasijat > 0
                model.valintatapajono.alkaenRajattu = !!model.valintatapajono
                  .varasijojaKaytetaanAlkaen
                model.valintatapajono.astiRajattu = !!model.valintatapajono
                  .varasijojaTaytetaanAsti
                if (model.valintatapajono.varasijojaKaytetaanAlkaen) {
                  model.valintatapajono.varasijojaKaytetaanAlkaen = new Date(
                    model.valintatapajono.varasijojaKaytetaanAlkaen
                  )
                }

                if (model.valintatapajono.varasijojaTaytetaanAsti) {
                  model.valintatapajono.varasijojaTaytetaanAsti = new Date(
                    model.valintatapajono.varasijojaTaytetaanAsti
                  )
                }
                if (model.valintatapajono.eiLasketaPaivamaaranJalkeen) {
                  model.valintatapajono.eiLasketaPaivamaaranJalkeen = lastMomentOfDate(
                    new Date(model.valintatapajono.eiLasketaPaivamaaranJalkeen)
                  )
                }
                valintatapajonot.push(result)
                $location.path($location.path() + result.oid)
                afterSuccess(function () {})
              },
              function (error) {
                afterFailure(function () {})
              }
            )
          } else {
            var promises = []
            promises.push(
              Valintatapajono.post(model.valintatapajono, function (result) {
                var i
                for (i in valintatapajonot) {
                  if (result.oid === valintatapajonot[i].oid) {
                    valintatapajonot[i] = result
                  }
                }
                model.valintatapajono = result
                model.valintatapajono.rajattu =
                  model.valintatapajono.varasijat > 0
                model.valintatapajono.alkaenRajattu = !!model.valintatapajono
                  .varasijojaKaytetaanAlkaen
                model.valintatapajono.astiRajattu = !!model.valintatapajono
                  .varasijojaTaytetaanAsti
                if (model.valintatapajono.varasijojaKaytetaanAlkaen) {
                  model.valintatapajono.varasijojaKaytetaanAlkaen = new Date(
                    model.valintatapajono.varasijojaKaytetaanAlkaen
                  )
                }

                if (model.valintatapajono.varasijojaTaytetaanAsti) {
                  model.valintatapajono.varasijojaTaytetaanAsti = new Date(
                    model.valintatapajono.varasijojaTaytetaanAsti
                  )
                }

                if (model.valintatapajono.eiLasketaPaivamaaranJalkeen) {
                  model.valintatapajono.eiLasketaPaivamaaranJalkeen = lastMomentOfDate(
                    new Date(model.valintatapajono.eiLasketaPaivamaaranJalkeen)
                  )
                }
              }).$promise
            )

            model.hakijaryhmat.forEach(function (hr) {
              hr.masterOid = null
              promises.push(
                HakijaryhmaValintatapajono.update(
                  { oid: hr.oid },
                  hr,
                  function (result) {
                    hr = result
                  }
                ).$promise
              )
            })

            for (var i = 0; i < model.jarjestyskriteerit.length; ++i) {
              var update = {
                oid: model.jarjestyskriteerit[i].oid,
                jarjestyskriteeri: model.jarjestyskriteerit[i],
                laskentakaavaId: model.jarjestyskriteerit[i].laskentakaavaId,
              }

              promises.push(
                Jarjestyskriteeri.post(update, function (result) {}).$promise
              )
            }

            $q.all(promises).then(
              function () {
                jarjestaJarjestyskriteerit(afterSuccess, afterFailure)
              },
              function (err) {
                afterFailure(function () {})
              }
            )
          }
        }

        this.remove = function (oid) {
          $modal
            .open({
              backdrop: 'static',
              templateUrl: 'poistajononmuodostumiskriteeri.html',
              controller: function ($scope, $window, $modalInstance) {
                $scope.ok = function () {
                  $scope.working = true
                  Jarjestyskriteeri.delete({ oid: oid }, function () {
                    for (var i in model.jarjestyskriteerit) {
                      if (oid === model.jarjestyskriteerit[i].oid) {
                        model.jarjestyskriteerit.splice(i, 1)
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

        this.removeHakijaryhma = function (oid) {
          $modal
            .open({
              backdrop: 'static',
              templateUrl: 'poistahakijaryhma.html',
              controller: function ($scope, $window, $modalInstance) {
                $scope.ok = function () {
                  HakijaryhmaValintatapajono.delete({ oid: oid }, function () {
                    for (var i in model.hakijaryhmat) {
                      if (oid === model.hakijaryhmat[i].oid) {
                        model.hakijaryhmat.splice(i, 1)
                      }
                    }
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

        function jarjestaJarjestyskriteerit(afterSuccess, afterFailure) {
          if (model.jarjestyskriteerit.length > 0) {
            var deferred = $q.defer()
            JarjestyskriteeriJarjesta.post(
              getJarjestyskriteeriOids(),
              function (result) {
                var getPromises = []
                model.jarjestyskriteerit = result
                model.jarjestyskriteerit.forEach(function (jk) {
                  getPromises.push(
                    Laskentakaava.get(
                      { oid: jk.laskentakaavaId, funktiopuu: false },
                      function (result) {
                        jk.nimi = result.nimi
                      }
                    ).$promise
                  )
                })
                $q.all(getPromises).then(
                  function () {
                    deferred.resolve()
                  },
                  function (err) {
                    deferred.reject()
                  }
                )
              }
            )
            deferred.promise.then(
              function () {
                afterSuccess(function () {})
              },
              function (err) {
                afterFailure(function () {})
              }
            )
          } else {
            afterSuccess(function () {})
          }
        }

        function getJarjestyskriteeriOids() {
          var oids = []
          for (var i = 0; i < model.jarjestyskriteerit.length; ++i) {
            oids.push(model.jarjestyskriteerit[i].oid)
          }
          return oids
        }
      })()

      return model
    },
  ])

  .controller('HakukohdeValintatapajonoController', [
    '$scope',
    '$location',
    '$routeParams',
    'ValintatapajonoModel',
    'HakukohdeValinnanVaiheModel',
    'SuoritaToiminto',
    'OnkoValintatapaJonoaSijoiteltu',
    'UserModel',
    function (
      $scope,
      $location,
      $routeParams,
      ValintatapajonoModel,
      HakukohdeValinnanVaiheModel,
      SuoritaToiminto,
      OnkoValintatapaJonoaSijoiteltu,
      UserModel
    ) {
      'use strict'

      $scope.hakukohdeOid = $routeParams.hakukohdeOid
      $scope.valinnanvaiheOid = $routeParams.valinnanvaiheOid

      $scope.model = ValintatapajonoModel

      $scope.model.refreshIfNeeded(
        $routeParams.valintatapajonoOid,
        $routeParams.id,
        $routeParams.hakukohdeOid,
        $routeParams.valinnanvaiheOid
      )

      $scope.forceSiirretaanSijoitteluun = false
      UserModel.refreshIfNeeded().then(function () {
        if (!UserModel.isOphUser && $routeParams.valintatapajonoOid) {
          var isSijoiteltu = OnkoValintatapaJonoaSijoiteltu.get({
            jonoOid: $routeParams.valintatapajonoOid,
          })
          isSijoiteltu.$promise.then(function (data) {
            if (data.IsSijoiteltu) {
              $scope.model.siirretaanSijoitteluun = true
              $scope.forceSiirretaanSijoitteluun = true
              $scope.$watch('model', function () {
                $scope.model.siirretaanSijoitteluun = true
              })
            }
          })
        }
      })

      $scope.submit = function () {
        SuoritaToiminto.avaa(function (success, failure) {
          $scope.model.submit(
            $scope.valinnanvaiheOid,
            HakukohdeValinnanVaiheModel.valintatapajonot,
            success,
            failure
          )
        })
      }

      $scope.cancel = function () {
        $location.path(
          '/hakukohde/' +
            $scope.hakukohdeOid +
            '/valinnanvaihe/' +
            $scope.valinnanvaiheOid
        )
      }

      $scope.addKriteeri = function () {
        $location.path(
          '/hakukohde/' +
            $scope.hakukohdeOid +
            '/valinnanvaihe/' +
            $scope.valinnanvaiheOid +
            '/valintatapajono/' +
            $scope.model.valintatapajono.oid +
            '/jarjestyskriteeri/'
        )
      }

      $scope.addHakijaryhma = function () {
        $location.path(
          '/hakukohde/' +
            $scope.hakukohdeOid +
            '/valinnanvaihe/' +
            $scope.valinnanvaiheOid +
            '/valintatapajono/' +
            $scope.model.valintatapajono.oid +
            '/hakijaryhma'
        )
      }

      $scope.modifyHakijaryhma = function (oid) {
        $location.path(
          '/hakukohde/' +
            $scope.hakukohdeOid +
            '/valinnanvaihe/' +
            $scope.valinnanvaiheOid +
            '/valintatapajono/' +
            $scope.model.valintatapajono.oid +
            '/hakijaryhma/' +
            oid
        )
      }

      $scope.modifyKriteeri = function (oid) {
        $location.path(
          '/hakukohde/' +
            $scope.hakukohdeOid +
            '/valinnanvaihe/' +
            $scope.valinnanvaiheOid +
            '/valintatapajono/' +
            $scope.model.valintatapajono.oid +
            '/jarjestyskriteeri/' +
            oid
        )
      }

      $scope.remove = function (oid) {
        $scope.model.remove(oid)
      }

      $scope.removeHakjiaryhma = function (oid) {
        $scope.model.removeHakijaryhma(oid)
      }

      $scope.$on('hakijaryhmaliita', function () {
        $scope.model.refresh(
          $routeParams.valintatapajonoOid,
          $routeParams.valinnanvaiheOid
        )
      })

      $scope.today = new Date()

      $scope.openAstiRajattu = function ($event) {
        $event.preventDefault()
        $event.stopPropagation()
        $scope.astiRajattuOpen = true
      }

      $scope.openEiLasketaPaivamaaranJalkeen = function ($event) {
        $event.preventDefault()
        $event.stopPropagation()
        $scope.eiLasketaPaivamaaranJalkeenOpen = true
      }

      $scope.nykyinenArvoOnMenneisyydessa = function () {
        if ($scope.model.valintatapajono.eiLasketaPaivamaaranJalkeen == null) {
          return false
        } else {
          var currentTime = new Date()
          var currentValue = new Date(
            $scope.model.valintatapajono.eiLasketaPaivamaaranJalkeen
          )
          return (
            currentValue.setHours(0, 0, 0, 0) < currentTime.setHours(0, 0, 0, 0)
          )
        }
      }
    },
  ])

  .controller('ValintaryhmaValintatapajonoController', [
    '$scope',
    '$location',
    '$routeParams',
    '$timeout',
    'ValintatapajonoModel',
    'ValintaryhmaValinnanvaiheModel',
    'SuoritaToiminto',
    'OnkoValintatapaJonoaSijoiteltu',
    'UserModel',
    function (
      $scope,
      $location,
      $routeParams,
      $timeout,
      ValintatapajonoModel,
      ValintaryhmaValinnanvaiheModel,
      SuoritaToiminto,
      OnkoValintatapaJonoaSijoiteltu,
      UserModel
    ) {
      'use strict'
      $scope.valintaryhmaOid = $routeParams.id
      $scope.valinnanvaiheOid = $routeParams.valinnanvaiheOid

      $scope.model = ValintatapajonoModel
      $scope.model.refreshIfNeeded(
        $routeParams.valintatapajonoOid,
        $routeParams.id,
        $routeParams.hakukohdeOid,
        $routeParams.valinnanvaiheOid
      )

      $scope.forceSiirretaanSijoitteluun = false
      UserModel.refreshIfNeeded().then(function () {
        if (!UserModel.isOphUser && $routeParams.valintatapajonoOid) {
          var isSijoiteltu = OnkoValintatapaJonoaSijoiteltu.get({
            jonoOid: $routeParams.valintatapajonoOid,
          })
          isSijoiteltu.$promise.then(function (data) {
            if (data.IsSijoiteltu) {
              $scope.model.siirretaanSijoitteluun = true
              $scope.forceSiirretaanSijoitteluun = true
              $scope.$watch('model', function () {
                $scope.model.siirretaanSijoitteluun = true
              })
            }
          })
        }
      })

      $scope.submit = function () {
        SuoritaToiminto.avaa(function (success, failure) {
          $scope.model.submit(
            $scope.valinnanvaiheOid,
            ValintaryhmaValinnanvaiheModel.valintatapajonot,
            success,
            failure
          )
        })
      }

      $scope.cancel = function () {
        $location.path(
          '/valintaryhma/' +
            $scope.valintaryhmaOid +
            '/valinnanvaihe/' +
            $scope.valinnanvaiheOid
        )
      }

      $scope.addKriteeri = function () {
        $location.path(
          '/valintaryhma/' +
            $scope.valintaryhmaOid +
            '/valinnanvaihe/' +
            $scope.valinnanvaiheOid +
            '/valintatapajono/' +
            $scope.model.valintatapajono.oid +
            '/jarjestyskriteeri/'
        )
      }

      $scope.addHakijaryhma = function () {
        $location.path(
          '/valintaryhma/' +
            $scope.valintaryhmaOid +
            '/valinnanvaihe/' +
            $scope.valinnanvaiheOid +
            '/valintatapajono/' +
            $scope.model.valintatapajono.oid +
            '/hakijaryhma'
        )
      }

      $scope.modifyKriteeri = function (oid) {
        $location.path(
          '/valintaryhma/' +
            $scope.valintaryhmaOid +
            '/valinnanvaihe/' +
            $scope.valinnanvaiheOid +
            '/valintatapajono/' +
            $scope.model.valintatapajono.oid +
            '/jarjestyskriteeri/' +
            oid
        )
      }
      $scope.modifyHakijaryhma = function (oid) {
        $location.path(
          '/valintaryhma/' +
            $scope.valintaryhmaOid +
            '/valinnanvaihe/' +
            $scope.valinnanvaiheOid +
            '/valintatapajono/' +
            $scope.model.valintatapajono.oid +
            '/hakijaryhma/' +
            oid
        )
      }

      $scope.remove = function (oid) {
        $scope.model.remove(oid)
      }

      $scope.removeHakjiaryhma = function (oid) {
        $scope.model.removeHakijaryhma(oid)
      }

      $scope.$on('hakijaryhmaliita', function () {
        $scope.model.refresh(
          $routeParams.valintatapajonoOid,
          $routeParams.valinnanvaiheOid
        )
      })

      $scope.today = new Date()

      $scope.openAlkaenRajattu = function ($event) {
        $event.preventDefault()
        $event.stopPropagation()
        $scope.alkaenRajattuOpen = true
      }

      $scope.openAstiRajattu = function ($event) {
        $event.preventDefault()
        $event.stopPropagation()
        $scope.astiRajattuOpen = true
      }

      $scope.openEiLasketaPaivamaaranJalkeen = function ($event) {
        $event.preventDefault()
        $event.stopPropagation()
        $scope.eiLasketaPaivamaaranJalkeenOpen = true
      }
    },
  ])

  .factory('HakijaryhmaLiitaModel', [
    '$resource',
    '$location',
    '$routeParams',
    'Hakijaryhma',
    'HakijaryhmaLiita',
    function (
      $resource,
      $location,
      $routeParams,
      Hakijaryhma,
      HakijaryhmaLiita
    ) {
      'use strict'

      var model = new (function () {
        this.hakijaryhma = {}

        this.refresh = function () {
          model.hakijaryhmaOid = {}
          this.parentOid = ''
        }

        this.move = function () {
          if (model.parentOid) {
            HakijaryhmaLiita.liita(
              { valintatapajonoOid: $routeParams.valintatapajonoOid },
              model.parentOid,
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

  .controller('HakijaryhmaValintaController', [
    '$scope',
    '$routeParams',
    'HakijaryhmaLiitaModel',
    'HakukohdeModel',
    'Hakukohde',
    'ValintaryhmaModel',
    'HakijaryhmaLiita',
    function (
      $scope,
      $routeParams,
      HakijaryhmaLiitaModel,
      HakukohdeModel,
      Hakukohde,
      ValintaryhmaModel,
      HakijaryhmaLiita
    ) {
      'use strict'
      $scope.model = HakijaryhmaLiitaModel
      $scope.model.refresh()
      $scope.hakukohdeModel = HakukohdeModel
      $scope.domain = ValintaryhmaModel

      if ($routeParams.id) {
        ValintaryhmaModel.refresh($routeParams.id)
      } else if ($routeParams.hakukohdeOid) {
        Hakukohde.get({ oid: $routeParams.hakukohdeOid }, function (result) {
          if (result.valintaryhmaOid) {
            ValintaryhmaModel.refresh(result.valintaryhmaOid)
          }
        })
      }

      $scope.liita = function () {
        if ($scope.model.parentOid) {
          HakijaryhmaLiita.liita(
            {
              valintatapajonoOid: $routeParams.valintatapajonoOid,
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
