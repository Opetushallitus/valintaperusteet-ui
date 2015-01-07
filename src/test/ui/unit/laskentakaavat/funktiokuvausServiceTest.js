"use strict";

describe("FunktiokuvausService", function () {
    var funktioservice, funktiokutsuKeskiarvo, funktiokutsuJos,
        funktiokutsuSumma, funktiokutsuHylkaaarvovalilla, funktiokutsuPainotettukeskiarvo,
        laskentakaavaviite, rootFunktiokutsu, funktiokutsuPainotettukeskiarvoWith2EmptySlots,
        funktiokutsuPainotettukeskiarvoWith4EmptySlots, funktiokutsuXParent, funktiokutsuXFirstChild, ei, pienempitaiyhtasuuri, skaalaus,
        funktiokuvausService;
    beforeEach(module('MockData'));
    beforeEach(module('valintaperusteet'));

    beforeEach(inject(function (FunktioService, Funktiokuvaukset, FunktiokutsuKeskiarvo, FunktiokutsuJos,
                                FunktiokutsuSumma, FunktiokutsuHylkaaarvovalilla, FunktiokutsuPainotettukeskiarvo,
                                Laskentakaavaviite, RootFunktiokutsu, FunktiokutsuPainotettukeskiarvoWith2EmptySlots,
                                FunktiokutsuPainotettukeskiarvoWith4EmptySlots, FunktiokutsuXParent, FunktiokutsuXFirstChild,
                                PIENEMPITAIYHTASUURI, EI, SKAALAUS, FunktiokuvausService) {
        funktioservice = FunktioService;
        funktiokutsuKeskiarvo = FunktiokutsuKeskiarvo;
        funktiokutsuJos = FunktiokutsuJos;
        funktiokutsuSumma = FunktiokutsuSumma;
        funktiokutsuHylkaaarvovalilla = FunktiokutsuHylkaaarvovalilla;
        funktiokutsuPainotettukeskiarvo = FunktiokutsuPainotettukeskiarvo;
        laskentakaavaviite = Laskentakaavaviite;
        rootFunktiokutsu = RootFunktiokutsu;
        funktiokutsuPainotettukeskiarvoWith2EmptySlots = FunktiokutsuPainotettukeskiarvoWith2EmptySlots;
        funktiokutsuPainotettukeskiarvoWith4EmptySlots = FunktiokutsuPainotettukeskiarvoWith4EmptySlots;
        funktiokutsuXParent = FunktiokutsuXParent;
        funktiokutsuXFirstChild = FunktiokutsuXFirstChild;
        ei = EI;
        pienempitaiyhtasuuri = PIENEMPITAIYHTASUURI;
        skaalaus = SKAALAUS;
        funktiokuvausService = FunktiokuvausService;
        funktiokuvausService.funktiokuvaukset = Funktiokuvaukset;
        
    }));

    //getFunktiokuvaukset
    describe('getFunktiokuvaukset()', function () {
        it('should return funktiokuvaukset', function () {
            expect(funktiokuvausService.getFunktiokuvaukset()).toEqual(funktiokuvausService.funktiokuvaukset);
        });
    });

    //getFunktiokuvaus
    describe('getFunktiokuvaus(', function () {

        describe("'PIENEMPITAIYHTASUURI' )", function () {
            var funktiokutsu;
            beforeEach(function () {
                funktiokutsu = funktiokuvausService.getFunktiokuvaus('PIENEMPITAIYHTASUURI');
            });

            it('should return correct funktiokuvaus', function () {
                expect(funktiokutsu.nimi).toBe('PIENEMPITAIYHTASUURI');
            });

            it("should be of type lukuarvofunktio", function () {
                expect(funktiokutsu.tyyppi).toBe('TOTUUSARVOFUNKTIO');
            });

            it('should have funktioargumentit-array with length 2', function () {
                expect(funktiokutsu.funktioargumentit.length).toBe(2);
            });

        });

        describe("'LUKUARVO' )", function () {
            var funktiokutsu;

            beforeEach(function () {
                funktiokutsu = funktiokuvausService.getFunktiokuvaus('LUKUARVO');
            });

            it("should return correct funktiokuvaus ", function () {
                expect(funktiokutsu.nimi).toBe('LUKUARVO');
            });

            it("should be of type lukuarvofunktio", function () {
                expect(funktiokutsu.tyyppi).toBe('LUKUARVOFUNKTIO');
            });

            it("should be of type lukuarvofunktio", function () {
                expect(funktiokutsu.syoteparametrit.length).toBe(1);
            });

        });

        describe("'noFunktiokutsuWithThisName' )", function () {
            it('should return undefined if not found', function () {
                expect(funktiokuvausService.getFunktiokuvaus()).toEqual(undefined);
            });
        });
    });


});