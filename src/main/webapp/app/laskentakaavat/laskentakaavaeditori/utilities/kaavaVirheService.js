'use strict';


angular.module('LaskentakaavaEditor')

    .constant('KaavaVirheTyypit', {
        FunktioargumenttiVirhe: 'FUNKTIOARGUMENTTIVIRHE',
        SyoteparametriVirhe: 'SYOTEPARAMETRIVIRHE',
        MuuVirhe: 'MUUVIRHE',
        TallennaTulosVirhe: 'TALLENNATULOSVIRHE'
    })


    .factory('KaavaVirheService', ['FunktioService', 'FunktioNimiService', function (FunktioService, FunktioNimiService) {

        var kaavaVirheService = new function () {

        };

        return kaavaVirheService;
    }]);

