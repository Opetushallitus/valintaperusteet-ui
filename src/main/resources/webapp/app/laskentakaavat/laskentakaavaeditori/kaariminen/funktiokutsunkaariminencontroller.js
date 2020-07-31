angular
  .module('valintaperusteet')

  .controller('FunktiokutsunKaariminenController', [
    '$scope',
    'FunktiokutsuKaareService',
    'FunktiokuvausService',
    'FunktioService',
    'FunktioFactory',
    '$modalInstance',
    'funktioasetukset',
    function (
      $scope,
      FunktiokutsuKaareService,
      FunktiokuvausService,
      FunktioService,
      FunktioFactory,
      $modalInstance,
      funktioasetukset
    ) {
      $scope.kaareService = FunktiokutsuKaareService
      $scope.funktioasetukset = funktioasetukset

      $scope.kaariFunktiokutsu = function (
        kaarivaFunktiokutsuNimi,
        childFunktiokutsuIndex
      ) {
        if (
          FunktioService.isRootFunktiokutsu(
            $scope.funktioasetukset.parentFunktiokutsu
          ) ||
          FunktiokuvausService.kaarittavaFunktiokutsuCanBeSetToFirstChildByFunktionimi(
            kaarivaFunktiokutsuNimi
          )
        ) {
          $scope.kaariFunktiokutsuFirstFunktioargumentti(
            kaarivaFunktiokutsuNimi
          )
        } else {
          $scope.kaariFunktiokutsuFunktioargumentiksiIndeksilla(
            kaarivaFunktiokutsuNimi,
            childFunktiokutsuIndex
          )
        }
        $modalInstance.close()
      }

      //Käärivällä funktiokutsulla voi olla N määrä funktioargumentteja
      $scope.kaariFunktiokutsuFirstFunktioargumentti = function (
        kaarivaFunktiokutsuNimi
      ) {
        var isRootFunktiokutsu = FunktioService.isRootFunktiokutsu(
          $scope.funktioasetukset.parentFunktiokutsu
        )
        var kaarittavaFunktiokutsu = FunktioService.getCurrentFunktiokutsu(
          $scope.funktioasetukset.parentFunktiokutsu,
          $scope.funktioasetukset.selectedFunktioIndex
        )
        var kaarivaFunktiokutsu = FunktioFactory.createFunktioInstance(
          $scope.funktioasetukset.parentFunktiokutsu,
          kaarivaFunktiokutsuNimi,
          isRootFunktiokutsu
        )
        kaarivaFunktiokutsu.open = false

        if (isRootFunktiokutsu) {
          kaarivaFunktiokutsu.lapsi.funktioargumentit[0] = kaarittavaFunktiokutsu
          $scope.funktioasetukset.parentFunktiokutsu.funktioargumentit[
            $scope.funktioasetukset.selectedFunktioIndex
          ] = kaarivaFunktiokutsu
        } else {
          kaarivaFunktiokutsu.lapsi.funktioargumentit[0] = kaarittavaFunktiokutsu
          $scope.funktioasetukset.parentFunktiokutsu.lapsi.funktioargumentit[
            $scope.funktioasetukset.selectedFunktioIndex
          ] = kaarivaFunktiokutsu
        }
        $modalInstance.close()
      }

      $scope.kaariFunktiokutsuFunktioargumentiksiIndeksilla = function (
        kaarivaFunktiokutsuNimi,
        childFunktiokutsuIndex
      ) {
        var isRootFunktiokutsu = FunktioService.isRootFunktiokutsu(
          $scope.funktioasetukset.parentFunktiokutsu
        )
        var kaarittavaFunktiokutsu = FunktioService.getCurrentFunktiokutsu(
          $scope.funktioasetukset.parentFunktiokutsu,
          $scope.funktioasetukset.selectedFunktioIndex
        )
        var kaarivaFunktiokutsu = FunktioFactory.createFunktioInstance(
          $scope.funktioasetukset.parentFunktiokutsu,
          kaarivaFunktiokutsuNimi,
          isRootFunktiokutsu
        )
        kaarivaFunktiokutsu.open = false

        if (isRootFunktiokutsu) {
          kaarivaFunktiokutsu.lapsi.funktioargumentit[
            childFunktiokutsuIndex
          ] = kaarittavaFunktiokutsu
          $scope.funktioasetukset.parentFunktiokutsu.funktioargumentit[
            $scope.funktioasetukset.selectedFunktioIndex
          ] = kaarivaFunktiokutsu
        } else {
          kaarivaFunktiokutsu.lapsi.funktioargumentit[
            childFunktiokutsuIndex
          ] = kaarittavaFunktiokutsu
          $scope.funktioasetukset.parentFunktiokutsu.lapsi.funktioargumentit[
            $scope.funktioasetukset.selectedFunktioIndex
          ] = kaarivaFunktiokutsu
        }
        $modalInstance.close()
      }

      $scope.selectedKaarivaFunktionimiChanged = function (
        selectedKaarivaFunktionimi
      ) {
        var hasNimettyFunktioargumentti = FunktiokuvausService.hasNimettyFunktioargumenttiByFunktioNimi(
          selectedKaarivaFunktionimi
        )
        var isPainotettuKeskiarvo = FunktiokuvausService.isPainotettukeskiarvoByFunktioNimi(
          selectedKaarivaFunktionimi
        )
        $scope.showFunktioargumenttiSelection =
          isPainotettuKeskiarvo ||
          (hasNimettyFunktioargumentti &&
            FunktiokuvausService.hasMoreThanOneFunktioargumentti(
              selectedKaarivaFunktionimi
            ))
        if ($scope.showFunktioargumenttiSelection) {
          FunktiokutsuKaareService.setKaareFunktiokutsuType(
            selectedKaarivaFunktionimi
          )
        }
      }

      $scope.close = function () {
        $modalInstance.close()
      }
    },
  ])
