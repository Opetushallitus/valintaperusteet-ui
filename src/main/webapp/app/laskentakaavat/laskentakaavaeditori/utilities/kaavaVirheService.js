angular.module('valintaperusteet')

    .constant('KaavaVirheTyypit', {
        FunktioargumenttiVirhe: 'FUNKTIOARGUMENTTIVIRHE',
        SyoteparametriVirhe: 'SYOTEPARAMETRIVIRHE',

        TallennaTulosVirhe: 'TALLENNATULOSVIRHE',
        TaustaPalveluVirhe: 'TAUSTAPALVELUVIRHE',
        Tuntematon: 'TUNTEMATONVIRHE'
    })


    .service('KaavaVirheService', ['FunktioService', 'FunktioNimiService', function (FunktioService, FunktioNimiService) {
        'use strict';


        this.laskentakaavavirheet = [];

        this.clearErrors = function () {
            this.laskentakaavavirheet.length = 0;
        };

        this.addError = function (virhetyyppi) {
            
        };

    }])

.directive('validationErrors', [function () {
        return {
            restrict: 'E',
            templateUrl: 'laskentakaavat/laskentakaavaeditori/puu/errors.html'
        }
    }]);

