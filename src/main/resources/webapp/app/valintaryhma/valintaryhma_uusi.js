angular
  .module('valintaperusteet')
  .factory('ValintaryhmaCreatorModel', [
    '$q',
    '$resource',
    '$location',
    '$routeParams',
    'Valintaryhma',
    'KoodistoHaunKohdejoukko',
    'ChildValintaryhmas',
    'Treemodel',
    'ParentValintaryhmas',
    'Utils',
    'RootValintaryhmas',
    'UserModel',
    'HakuModel',
    function (
      $q,
      $resource,
      $location,
      $routeParams,
      Valintaryhma,
      KoodistoHaunKohdejoukko,
      ChildValintaryhmas,
      Treemodel,
      ParentValintaryhmas,
      Utils,
      RootValintaryhmas,
      UserModel,
      HakuModel
    ) {
      'use strict'

      var model = new (function () {
        this.valintaryhma = {}
        this.kohdejoukot = []
        this.nameerror = false

        this.refresh = function () {
          model.valintaryhma = {}
          model.parentOid = ''
          model.nameerror = false

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

          UserModel.refreshIfNeeded()
          UserModel.organizationsDeferred.promise.then(function () {
            model.valintaryhma.organisaatiot = UserModel.organizations
          })
        }

        this.refreshIfNeeded = function () {
          this.refresh()
        }

        this.persistValintaryhma = function (oid) {
          if (model.parentOid) {
            ParentValintaryhmas.get({ parentOid: model.parentOid }, function (
              parents
            ) {
              ChildValintaryhmas.get({ parentOid: model.parentOid }, function (
                children
              ) {
                if (parents && parents.length > 0) {
                  model.valintaryhma.kohdejoukko =
                    parents[parents.length - 1].kohdejoukko
                }
                model.persist(parents, children)
              })
            })
          } else {
            RootValintaryhmas.get({ parentOid: model.parentOid }, function (
              all
            ) {
              model.persist(all, all)
            })
          }
        }

        this.persist = function (parents, children) {
          if (!Utils.hasSameName(model, parents, children)) {
            if (model.parentOid) {
              model.valintaryhma.hakuoid = ''
            }
            var newValintaryhma = {
              lapsihakukohde: false,
              lapsivalintaryhma: false,
              nimi: model.valintaryhma.nimi,
              kohdejoukko: model.valintaryhma.kohdejoukko,
              organisaatiot: model.valintaryhma.organisaatiot,
              hakuoid: model.valintaryhma.hakuoid,
            }
            if (!model.parentOid) {
              Valintaryhma.insert(newValintaryhma, function (result) {
                Treemodel.refresh()
                $location.path('/valintaryhma/' + result.oid)
              })
            } else {
              ChildValintaryhmas.insert(
                { parentOid: model.parentOid },
                newValintaryhma,
                function (result) {
                  Treemodel.refresh()
                  model.valintaryhma = result
                  $location.path('/valintaryhma/' + result.oid)
                }
              )
            }
          } else {
            model.nameerror = true
          }
        }
      })()

      return model
    },
  ])

  .controller('UusiValintaryhmaController', [
    '$scope',
    '$location',
    '$routeParams',
    'ValintaryhmaCreatorModel',
    'Ylavalintaryhma',
    function (
      $scope,
      $location,
      $routeParams,
      ValintaryhmaCreatorModel,
      Ylavalintaryhma
    ) {
      'use strict'

      $scope.valintaryhmaOid = $routeParams.id
      $scope.model = ValintaryhmaCreatorModel
      $scope.model.refreshIfNeeded($scope.valintaryhmaOid)

      $scope.domain = Ylavalintaryhma
      Ylavalintaryhma.refresh()

      $scope.submit = function () {
        $scope.model.persistValintaryhma($scope.valintaryhmaOid)
      }

      $scope.cancel = function () {
        $location.path('/')
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
    },
  ])
