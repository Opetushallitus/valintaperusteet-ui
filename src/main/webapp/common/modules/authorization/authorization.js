angular.module('valintaperusteet')

    .constant('OPH_ORG_OID', "1.2.246.562.10.00000000001")
    .constant('ORGANISAATIO_URL_BASE', ORGANIZATION_SERVICE_URL_BASE + "rest/")

    .directive('auth', ['$routeParams', '$q', '$animate', '$timeout', '$log', 'UserAccessLevels', 'UserModel',
        function ($routeParams, $q, $animate, $timeout, $log, UserAccessLevels, UserModel) {
            return {
                priority: 1000,
                link: function ($scope, element, attrs) {
                    UserModel.refreshIfNeeded();
                    UserAccessLevels.refreshIfNeeded($routeParams.id, $routeParams.hakukohdeOid);

                    $scope.userAccess = UserAccessLevels;
                    $scope.userModel = UserModel;

                    $animate.addClass(element, 'ng-hide');

                    var promises = [];

                    promises.push(UserModel.organizationsDeferred.promise);
                    promises.push(UserAccessLevels.deferred.promise);

                    // Reveal element for oph-users and KK-users by default
                    $q.all(promises).then(function () {
                        if( UserAccessLevels.isOphUser() || (UserModel.isKKUser && UserAccessLevels.readApp) ) {
                            $animate.removeClass(element, 'ng-hide');
                        }

                    }, function (error) {
                        $log.error('Error revealing element:', error);
                    });
                }
            };
        }])

