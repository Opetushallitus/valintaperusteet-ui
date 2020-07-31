angular
  .module('valintaperusteet')

  .factory('Ylavalintaryhma', [
    '$resource',
    'ValintaperusteetPuu',
    'AuthService',
    function ($resource, ValintaperusteetPuu, AuthService) {
      'use strict'

      //and return interface for manipulating the model
      var modelInterface = {
        //models
        valintaperusteList: [],
        search: { q: null, valintaryhmatAuki: null },
        tilasto: {
          valintaryhmia: 0,
          valintaryhmiaNakyvissa: 0,
        },

        isExpanded: function (data) {
          return data.isVisible
        },
        isCollapsed: function (data) {
          return !this.isExpanded(data)
        },
        refresh: function () {
          ValintaperusteetPuu.get(
            {
              q: this.search.q,
              hakukohteet: false,
            },
            function (result) {
              modelInterface.valintaperusteList = result
              modelInterface.update()
            }
          )
        },
        expandTree: function () {
          modelInterface.forEachValintaryhma(function (item) {
            item.isVisible = true
          })
        },
        forEachValintaryhma: function (f) {
          var recursion = function (item, f) {
            f(item)
            if (item.alavalintaryhmat) {
              for (var i = 0; i < item.alavalintaryhmat.length; i++) {
                recursion(item.alavalintaryhmat[i], f)
              }
            }
          }
          for (var i = 0; i < modelInterface.valintaperusteList.length; i++) {
            recursion(modelInterface.valintaperusteList[i], f)
          }
        },
        getValintaryhma: function (oid) {
          var valintaryhma = null
          modelInterface.forEachValintaryhma(function (item) {
            if (item.oid === oid) {
              valintaryhma = item
            }
          })
          return valintaryhma
        },
        update: function () {
          var list = modelInterface.valintaperusteList
          modelInterface.valintaperusteList = []
          modelInterface.tilasto.valintaryhmia = 0
          modelInterface.tilasto.valintaryhmiaNakyvissa = 0

          var recursion = function (item) {
            if (item.tyyppi === 'VALINTARYHMA') {
              modelInterface.tilasto.valintaryhmia++
            }

            item.access = true
            /*
                AuthService.getOrganizations("APP_VALINTAPERUSTEET").then(function(organisations){
                    item.access = false;
                    organisations.forEach(function(org){

                        if(item.organisaatiot.length > 0) {
                            item.organisaatiot.forEach(function(org2) {
                                if (org2.parentOidPath && org2.parentOidPath.indexOf(org) > -1) {
                                    item.access = true;
                                }
                            });
                        } else {
                            AuthService.updateOph("APP_VALINTAPERUSTEET").then(function(){
                                item.access = true;
                            });
                        }
                    });
                });
                */

            if (item.alavalintaryhmat) {
              for (var i = 0; i < item.alavalintaryhmat.length; i++)
                recursion(item.alavalintaryhmat[i])
            }
          }
          for (var i = 0; i < list.length; i++) {
            recursion(list[i])
          }

          modelInterface.valintaperusteList = list
        },
        expandNode: function (node) {
          if (node.alavalintaryhmat && node.alavalintaryhmat.length > 0) {
            node.isVisible = !node.isVisible
          }
        },
      }
      modelInterface.refresh()
      return modelInterface
    },
  ])

  .factory('UusiHakukohdeModel', [
    'NewHakukohde',
    function (NewHakukohde) {
      'use strict'

      var model = new (function () {
        this.hakukohde = {}
        this.tilat = ['LUONNOS', 'VALMIS', 'JULKAISTU', 'PERUTTU', 'KOPIOITU']

        this.persistHakukohde = function () {
          if (model.parentOid) {
            model.hakukohde.valintaryhmaOid = model.parentOid
          }
          return NewHakukohde.insert(model.hakukohde, function (result) {})
            .$promise
        }

        this.refresh = function () {
          model.hakukohde = {}
          model.haku = ''
          model.selectedHakukohde = ''
          model.parentOid = ''
        }
      })()

      return model
    },
  ])

  .controller('UusiHakukohdeController', [
    '$scope',
    '$location',
    'UusiHakukohdeModel',
    'Ylavalintaryhma',
    'Haku',
    'TarjontaHaku',
    'HaunTiedot',
    'Hakukohde',
    function (
      $scope,
      $location,
      UusiHakukohdeModel,
      Ylavalintaryhma,
      Haku,
      TarjontaHaku,
      HaunTiedot,
      Hakukohde
    ) {
      'use strict'

      $scope.predicate = 'nimi'
      $scope.model = UusiHakukohdeModel

      $scope.domain = Ylavalintaryhma
      UusiHakukohdeModel.refresh()
      Ylavalintaryhma.refresh()

      Haku.get({}, function (resultWrapper) {
        var hakuArray = resultWrapper.result
        var haut = []

        for (var i = 0; i < hakuArray.length; ++i) {
          HaunTiedot.get({ hakuOid: hakuArray[i].oid }, function (
            resultWrapper
          ) {
            haut.push(resultWrapper.result)
          })
        }

        $scope.haut = haut
      })

      /* Hakua ei pysty muuttamaan uuden hakukohteen luonnin lomakkeella joten tämän ei pitäisi olla tarpeellinen
    $scope.$watch("model.hakukohde.hakuoid", function() {
        $scope.hakukohteet = [];
        $scope.model.selectedHakukohde = undefined;

        if($scope.model.hakukohde.hakuoid) {
            var searchParams = {
                hakuOid:$scope.model.hakukohde.hakuoid,
                startIndex:0,
                count:999999
            };

            TarjontaHaku.get(searchParams, function(result) {
                $scope.hakukohteet = result.tulokset;
            });
        }
    });
    */

      $scope.setHakuoid = function (item) {
        $scope.model.hakukohde.hakuoid = item.oid
        $scope.model.hakukohde.oid = undefined
      }

      $scope.setHakukohdeoid = function (item) {
        $scope.model.hakukohde.oid = item.hakukohdeOid
        $scope.model.hakukohde.tila = item.hakukohdeTila
        $scope.model.hakukohde.nimi =
          item.tarjoajaNimi.fi + ', ' + item.hakukohdeNimi.fi
        $scope.model.hakukohde.tarjoajaOid = item.tarjoajaOid
      }

      $scope.submit = function () {
        Hakukohde.get({ oid: $scope.model.hakukohde.oid }, function (
          result
        ) {}).$promise.then(
          function () {
            alert('Hakukohde on jo olemassa.')
            $location.path('/hakukohde/' + $scope.model.hakukohde.oid)
          },
          function () {
            // Ei löydy
            var promise = $scope.model.persistHakukohde()
            promise.then(
              function (result) {
                $location.path('/hakukohde/' + $scope.model.hakukohde.oid)
              },
              function (result) {
                alert('Hakukohdetta ei saatu luotua.')
              }
            )
          }
        )
      }

      $scope.cancel = function () {
        $location.path('/')
      }
    },
  ])
