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

    //isNimettyFunktioargumenttiByFunktionimi
    describe("hasFunktioargumentitByFunktionimi(name)", function () {

        it('should return false for KESKIARVO-funktiokutsu', function () {
            expect(funktiokuvausService.hasNimettyFunktioargumenttiByFunktioNimi('KESKIARVO')).toBeFalsy();
        });

        it('should return true for JOS-funktiokutsu', function () {
            expect(funktiokuvausService.hasNimettyFunktioargumenttiByFunktioNimi('JOS')).toBeTruthy();
        });

        it('should return false for SUMMA-funktiokutsu', function () {
            expect(funktiokuvausService.hasNimettyFunktioargumenttiByFunktioNimi('SUMMA')).toBeFalsy();
        });

        it('should return true for HYLKAAARVOVALILLA-funktiokutsu', function () {
            expect(funktiokuvausService.hasNimettyFunktioargumenttiByFunktioNimi('HYLKAAARVOVALILLA')).toBeTruthy();
        });

        it('should return false for PAINOTETTUKESKIARVO-funktiokutsu', function () {
            expect(funktiokuvausService.hasNimettyFunktioargumenttiByFunktioNimi('PAINOTETTUKESKIARVO')).toBeFalsy();
        });

        it('should return false for HAELUKUARVO-funktiokutsu', function () {
            expect(funktiokuvausService.hasNimettyFunktioargumenttiByFunktioNimi('HAELUKUARVO')).toBeFalsy();
        });

        it('should return true for NEGAATIO-funktiokutsu', function () {
            expect(funktiokuvausService.hasNimettyFunktioargumenttiByFunktioNimi('NEGAATIO')).toBeTruthy();
        });

        it('should return false for HAEYOARVOSANA-funktiokutsu', function () {
            expect(funktiokuvausService.hasNimettyFunktioargumenttiByFunktioNimi('HAEYOARVOSANA')).toBeFalsy();
        });

    });

    //funktiokuvausHasFunktioargumentit
    describe("hasFunktioargumentitByFunktionimi(funktionimi)", function () {
        it('should return true for JOS', function () {
            expect(funktiokuvausService.hasFunktioargumentitByFunktionimi('JOS')).toBeTruthy();
        });

        it('should return false for LUKUARVO', function () {
            expect(funktiokuvausService.hasFunktioargumentitByFunktionimi('LUKUARVO')).toBeFalsy();
        });

        it('should return true for MAKSIMI', function () {
            expect(funktiokuvausService.hasFunktioargumentitByFunktionimi('MAKSIMI')).toBeTruthy();
        });

        it('should return false for PIENEMPITAIYHTASUURI', function () {
            expect(funktiokuvausService.hasFunktioargumentitByFunktionimi('PIENEMPITAIYHTASUURI')).toBeTruthy();
        });

        it('should return false for HAEYOARVOSANA', function () {
            expect(funktiokuvausService.hasFunktioargumentitByFunktionimi('HAEYOARVOSANA')).toBeFalsy();
        });

        it('should return false for HAETOTUUSARVO', function () {
            expect(funktiokuvausService.hasFunktioargumentitByFunktionimi('HAETOTUUSARVO')).toBeFalsy();
        });

        it('should return false for PAINOTETTUKESKIARVO', function () {
            expect(funktiokuvausService.hasFunktioargumentitByFunktionimi('PAINOTETTUKESKIARVO')).toBeTruthy();
        });

    });

    //isPainotettukeskiarvoChildByParentNimi
    describe("isPainotettukeskiarvoChildByParentNimi", function () {
        it("should return true if PAINOTETTUKESKIARVO", function () {
            expect(funktiokuvausService.isPainotettukeskiarvoByFunktioNimi("PAINOTETTUKESKIARVO")).toBeTruthy();
        });

        it("should return false if KESKIARVO", function () {
            expect(funktiokuvausService.isPainotettukeskiarvoByFunktioNimi("KESKIARVO")).toBeFalsy();
        });

        it("should return false if parameter is undefined", function () {
            expect(funktiokuvausService.isPainotettukeskiarvoByFunktioNimi()).toBeFalsy();
        });
    });

    //isFunktiokutsuWithFunktioargumenttiSizeN
    describe("isFunktiokutsuWithFunktioargumenttiSizeN(parent)", function () {

        it("should return true for funktiokutsu SUMMA", function () {
            expect(funktiokuvausService.hasNSizeFunktioargumenttiByFunktionimi(funktioservice.getFunktionimi(funktiokutsuSumma))).toBeTruthy();
        });

        it("should return true for funktiokutsu KESKIARVO", function () {
            expect(funktiokuvausService.hasNSizeFunktioargumenttiByFunktionimi(funktioservice.getFunktionimi(funktiokutsuKeskiarvo))).toBeTruthy();
        });

        it("should return false for funktiokutsu PAINOTETTUKESKIARVO", function () {
            expect(funktiokuvausService.hasNSizeFunktioargumenttiByFunktionimi(funktioservice.getFunktionimi(funktiokutsuPainotettukeskiarvo))).toBeFalsy();
        });

    });

});