angular.module('valintaperusteet')

    .constant('KaavaVirheTyypit', {
        FunktioargumenttiVirhe: 'FUNKTIOARGUMENTTIVIRHE',
        SyoteparametriVirhe: 'SYOTEPARAMETRIVIRHE',
        MuuVirhe: 'MUUVIRHE',
        TallennaTulosVirhe: 'TALLENNATULOSVIRHE'
    })


    .factory('KaavaVirheService', ['FunktioService', 'FunktioNimiService', function (FunktioService, FunktioNimiService) {
        'use strict';


        var kaavaVirheService = new function () {

        }();

        return kaavaVirheService;
    }]);

