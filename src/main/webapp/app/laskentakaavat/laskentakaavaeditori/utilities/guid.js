angular.module('LaskentakaavaEditor').factory('GuidGenerator', [function() {
    "use strict";

    function S4() {
        return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    }
    function guid() {
        return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
    }

    return guid;
}]);