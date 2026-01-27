angular
  .module('valintaperusteet')

  .directive('auth', [
    '$routeParams',
    '$q',
    '$animate',
    '$timeout',
    '$log',
    'AuthService',
    'UserAccessLevels',
    'UserModel',
    function (
      $routeParams,
      $q,
      $animate,
      $timeout,
      $log,
      AuthService,
      UserAccessLevels,
      UserModel
    ) {
      return {
        priority: 1000,
        link: function ($scope, element, attrs) {
          UserModel.refreshIfNeeded()
          UserAccessLevels.refreshIfNeeded(
            $routeParams.id,
            $routeParams.hakukohdeOid
          )

          $scope.userAccess = UserAccessLevels
          $scope.userModel = UserModel

          $animate.addClass(element, 'ng-hide')

          var promises = []

          promises.push(UserModel.organizationsDeferred.promise)
          promises.push(UserAccessLevels.deferred.promise)

          // Reveal element for oph-users and KK-users by default
          $q.all(promises).then(
            function () {
              var isYhteisvalintaAuth = attrs.auth === 'yhteisvalinta'
              if (
                UserAccessLevels.isOphUser() ||
                (UserModel.isKKUser && UserAccessLevels.readApp) ||
                (isYhteisvalintaAuth && UserModel.hasYhteisvalintaRights)
              ) {
                $animate.removeClass(element, 'ng-hide')
              }
            },
            function (error) {
              $log.error('Error revealing element:', error)
            }
          )
        },
      }
    },
  ])
