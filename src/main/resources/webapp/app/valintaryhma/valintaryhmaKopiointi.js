angular
  .module('valintaperusteet')

  .controller('ValintaryhmaKopiointiController', [
    '$scope',
    '$routeParams',
    'HakuModel',
    'ValintaryhmaModel',
    'ValintaperusteetPuu',
    function (
      $scope,
      $routeParams,
      HakuModel,
      ValintaryhmaModel,
      ValintaperusteetPuu
    ) {
      HakuModel.init()

      $scope.kopioObj = {}

      $scope.$on('showValintaryhmaKopiointi', function () {
        $scope.show()
      })

      $scope.kopioiValintaryhma = function () {
        HakuModel.init().then(function (model) {
          ValintaperusteetPuu.get(
            {
              hakuOid: model.haku.oid,
              hakukohteet: false,
              valintaryhma: $routeParams.id,
            },
            function (result) {
              console.log(result)
            }
          )
        })
      }
    },
  ])
