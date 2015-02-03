angular.module('valintaperusteet')

    .controller('UserPageController', ['$scope', '$routeParams', '$log', 'UserAccessLevels', 'UserModel', 'OrganisaatioUtility',
        function ($scope, $routeParams, $log, UserAccessLevels, UserModel, OrganisaatioUtility) {
            $scope.userAccess = UserAccessLevels;
            UserAccessLevels.refreshIfNeeded($routeParams.id, $routeParams.hakukohdeOid);

            $scope.userModel = UserModel;
            UserModel.refreshIfNeeded();

            $scope.organisaatioUtility = OrganisaatioUtility;
            if($routeParams.id) {
                $scope.isValintaryhma = true;

            } else if($routeParams.hakukohdeOid) {
                $scope.isHakukohde = true;
            }


            if($routeParams.id) {
                OrganisaatioUtility.getChildOrganizationsForValintaryhma($routeParams.id).then(function setValintaryhmaOrganizations(result) {
                    $scope.valitunOrganisaationLapset = result;
                }, function (error) {
                    $log.error('valintaryhmän/hakukohteen organisaatioiden haku epäonnistui', error);
                });
            } else if($routeParams.hakukohdeOid) {
                OrganisaatioUtility.getChildOrganizationsforHakukohde($routeParams.hakukohdeOid).then(function setHakukohdeOrganizations(result) {
                    $scope.valitunOrganisaationLapset = result;
                }, function (error) {
                    $log.error('valintaryhmän/hakukohteen organisaatioiden haku epäonnistui', error);
                });
            }

        }]);
