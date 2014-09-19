
angular.module('valintaperusteet').factory('KaavaKopiointiModel', function($log,  Laskentakaava) {
    'use strict';
    var model = new function () {


        this.laskentakaava = {};

        this.refresh = function (kaavaId) {
            Laskentakaava.get({oid: kaavaId}, function(result) {
                model.laskentakaava = result.funktiokutsu;
            }, function(error) {
                $log.error('Laskentakaavan hakeminen epäonnistui', error);
            });


        };

        this.refreshIfNeeded = function(kaavaId) {
            if(model.laskentakaava.id !== kaavaId) {
                model.refresh(kaavaId);
            }
        };

    };

    return model;
});

angular.module('valintaperusteet').controller('KaavaKopiointiController', ['$scope', '$log', 'KaavaKopiointiModel', 'HakuModel', 'Ylavalintaryhma', 'KaavaSiirto', 'Treemodel',
    function($scope, $log, KaavaKopiointiModel, HakuModel, Ylavalintaryhma, KaavaSiirto, Treemodel) {

    $scope.hakuModel = HakuModel;

    $scope.kopiointiModel = KaavaKopiointiModel;
    $scope.kaavaKopioParams = {};

    $scope.kopioiKaava = function() {
        var payload = {
            uusinimi: $scope.kaavaKopioParams.uusinimi,
            funktiokutsu: $scope.kopiointiModel.laskentakaava,
            onLuonnos: $scope.kaavaData.onLuonnos,
            nimi: $scope.kaavaData.nimi,
            kuvaus: $scope.kaavaData.kuvaus
        };

        if(Treemodel.isHakukohde($scope.kaavaKopioParams.value)) {
            payload.hakukohdeOid = $scope.kaavaKopioParams.value.oid;
        } else {
            payload.valintaryhmaOid = $scope.kaavaKopioParams.value.oid;
        }

        KaavaSiirto.put(payload, function(result) {
            $scope.$broadcast('suljemodal');
        }, function(error) {
            $log.error('Kaavan siirto ei onnistunut', error);
            $scope.$broadcast('suljemodal');
        });
    };



    $scope.cancel = function() {
        $scope.$broadcast('suljemodal');
    };

    $scope.$on('kaavakopiointi', function(event, kaava) {
        if(kaava.id) {
            $scope.kaavaData = kaava;
            $scope.kopiointiModel.refreshIfNeeded(kaava.id);
            $scope.show();
        } else {
            $log.error('Kopioitavan kaavan Id puuttuu');
        }
    });


}]);