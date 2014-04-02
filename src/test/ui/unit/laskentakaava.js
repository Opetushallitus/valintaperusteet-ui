"use strict";

describe('LaskentakaavaController', function(){

    var scope, laskentakaavaCtrl;

    beforeEach(module('LaskentakaavaEditor'));
    beforeEach(inject(function($rootScope, $controller){
        scope = $rootScope.$new;
        laskentakaavaCtrl = $controller('UusiLaskentakaavaController', {$scope: scope});
    }));

    describe('booleans', function() {
        it('false should be false', function() {
            expect(false).toBe(false);
        });
        it('should be true', function() {
            expect(true).toBe(true);
        });
    });

});
