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
        HakuModel.hakuDeferred.promise.then(function () {
          ValintaperusteetPuu.get(
            {
              hakuOid: HakuModel.hakuOid,
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
