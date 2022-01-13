angular
  .module('valintaperusteet')
  .controller('ValintaryhmaPuuValitsinController', [
    '$scope',
    'Treemodel',
    'HakuModel',
    'CustomHakuUtil',
    function ($scope, Treemodel, HakuModel, CustomHakuUtil) {
      // Deep copy for non-persisting changes
      $scope.hakuModel = angular.copy(HakuModel)
      $scope.hakuModel.init().then(function (model) {
        $scope.valintaryhmaPuu = Treemodel
        Treemodel.refreshHaku(model.haku)
      })

      // Deep copy for non-persisting changes
      $scope.customHakuUtil = angular.copy(CustomHakuUtil)
      $scope.customHakuUtil.hakutyyppi.value = undefined
      $scope.customHakuUtil.kohdejoukko.value = undefined
      $scope.customHakuUtil.hakutapa.value = undefined
      $scope.customHakuUtil.hakukausi.value = undefined
      $scope.customHakuUtil.hakuvuosi.value = undefined
      $scope.customHakuUtil.refresh()

      $scope.selection = {} // input radio needs this empty object when mapping object reference
      $scope.changeSelection = function (puuNode) {
        //kopioObj must be set in parent scope
        if (puuNode === 'ROOT') {
          $scope.kopioObj.value = {
            oid: null,
          }
        } else {
          $scope.kopioObj.value = puuNode
        }
      }
      $scope.$watch('hakuModel.haku', function () {
        if ($scope.hakuModel && $scope.hakuModel.haku) {
          // Bypass HakuModel used in Treemodel
          Treemodel.refreshHaku($scope.hakuModel.haku)
        }
      })
    },
  ])
