"use strict";

describe("FunktioService", function () {
    var funktioservice, funktiokutsuKeskiarvo, funktiokutsuJos,
        funktiokutsuSumma, funktiokutsuHylkaaarvovalilla, funktiokutsuPainotettukeskiarvo,
        laskentakaavaviite, rootFunktiokutsu, funktiokutsuPainotettukeskiarvoWith2EmptySlots,
        funktiokutsuPainotettukeskiarvoWith4EmptySlots;
    beforeEach(module('MockData'));
    beforeEach(module('valintaperusteet'));

    beforeEach(inject(function (FunktioService, Funktiokuvaukset, FunktiokutsuKeskiarvo, FunktiokutsuJos,
                                FunktiokutsuSumma, FunktiokutsuHylkaaarvovalilla, FunktiokutsuPainotettukeskiarvo,
                                Laskentakaavaviite, RootFunktiokutsu, FunktiokutsuPainotettukeskiarvoWith2EmptySlots,
                                FunktiokutsuPainotettukeskiarvoWith4EmptySlots) {
        funktioservice = FunktioService;
        funktioservice.funktiokuvaukset = Funktiokuvaukset;
        funktiokutsuKeskiarvo = FunktiokutsuKeskiarvo;
        funktiokutsuJos = FunktiokutsuJos;
        funktiokutsuSumma = FunktiokutsuSumma;
        funktiokutsuHylkaaarvovalilla = FunktiokutsuHylkaaarvovalilla;
        funktiokutsuPainotettukeskiarvo = FunktiokutsuPainotettukeskiarvo;
        laskentakaavaviite = Laskentakaavaviite;
        rootFunktiokutsu = RootFunktiokutsu;
        funktiokutsuPainotettukeskiarvoWith2EmptySlots = FunktiokutsuPainotettukeskiarvoWith2EmptySlots;
        funktiokutsuPainotettukeskiarvoWith4EmptySlots = FunktiokutsuPainotettukeskiarvoWith4EmptySlots;
    }));

    //getFunktiokuvaukset
    describe('getFunktiokuvaukset()', function () {
        it('should return funktiokuvaukset', function () {
            expect(funktioservice.getFunktiokuvaukset()).toEqual(funktioservice.funktiokuvaukset);
        });
    });


    //getFunktiokuvaus
    describe('getFunktiokuvaus(', function () {

        describe("'PIENEMPITAIYHTASUURI' )", function () {
            var funktiokutsu;
            beforeEach(function () {
                funktiokutsu = funktioservice.getFunktiokuvaus('PIENEMPITAIYHTASUURI');
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
                funktiokutsu = funktioservice.getFunktiokuvaus('LUKUARVO');
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
                expect(funktioservice.getFunktiokuvaus()).toEqual(undefined);
            });
        });
    });

    //isNimettyFunktioargumentti()
    describe("isNimettyFunktioargumentti(parent)", function () {

        it('should return false for keskiarvo-funktiokutsu', function () {
            expect(funktioservice.isNimettyFunktioargumentti(funktiokutsuKeskiarvo)).toBe(false);
        });

        it('should return true for jos-funktiokutsu', function () {
            expect(funktioservice.isNimettyFunktioargumentti(funktiokutsuJos)).toBe(true);
        });

        it('should return false for summa-funktiokutsu', function () {
            expect(funktioservice.isNimettyFunktioargumentti(funktiokutsuSumma)).toBe(false);
        });

        it('should return true for hylkaaarvovalilla-funktiokutsu', function () {
            expect(funktioservice.isNimettyFunktioargumentti(funktiokutsuHylkaaarvovalilla)).toBe(true);
        });

    });

    //isNimettyFunktioargumenttiByFunktionimi
    describe("isNimettyFunktioargumenttiByFunktionimi(name)", function () {

        it('should return false for KESKIARVO-funktiokutsu', function () {
            expect(funktioservice.isNimettyFunktioargumenttiByFunktionimi('KESKIARVO')).toBe(false);
        });

        it('should return true for JOS-funktiokutsu', function () {
            expect(funktioservice.isNimettyFunktioargumenttiByFunktionimi('JOS')).toBe(true);
        });

        it('should return false for SUMMA-funktiokutsu', function () {
            expect(funktioservice.isNimettyFunktioargumenttiByFunktionimi('SUMMA')).toBe(false);
        });

        it('should return true for HYLKAAARVOVALILLA-funktiokutsu', function () {
            expect(funktioservice.isNimettyFunktioargumenttiByFunktionimi('HYLKAAARVOVALILLA')).toBe(true);
        });

        it('should return false for PAINOTETTUKESKIARVO-funktiokutsu', function () {
            expect(funktioservice.isNimettyFunktioargumenttiByFunktionimi('PAINOTETTUKESKIARVO')).toBe(false);
        });

        it('should return false for HAELUKUARVO-funktiokutsu', function () {
            expect(funktioservice.isNimettyFunktioargumenttiByFunktionimi('HAELUKUARVO')).toBe(false);
        });

        it('should return true for NEGAATIO-funktiokutsu', function () {
            expect(funktioservice.isNimettyFunktioargumenttiByFunktionimi('NEGAATIO')).toBe(true);
        });

        it('should return false for HAEYOARVOSANA-funktiokutsu', function () {
            expect(funktioservice.isNimettyFunktioargumenttiByFunktionimi('HAEYOARVOSANA')).toBe(false);
        });

    });

    //getNimettyFunktioargumenttiCount
    describe("getNimettyFunktioargumenttiCount(parent)", function () {
        it("should return undefined if parent is undefined", function () {
            expect(funktioservice.getNimettyFunktioargumenttiCount(undefined)).toBe(undefined);
        });

        it("should return 3 for JOS", function () {
            expect(funktioservice.getNimettyFunktioargumenttiCount(funktiokutsuJos)).toBe(3);
        });

        it("should return 0 for SUMMA", function () {
            expect(funktioservice.getNimettyFunktioargumenttiCount(funktiokutsuSumma)).toBe(0);
        });

        it("should return 0 for SUMMA", function () {
            expect(funktioservice.getNimettyFunktioargumenttiCount(funktiokutsuHylkaaarvovalilla)).toBe(1);
        });
    });

    //isFunktiokutsuWithFunktioargumenttiSizeN
    describe("isFunktiokutsuWithFunktioargumenttiSizeN(parent)", function () {
        it("should return undefined if parent is undefined", function () {
            expect(funktioservice.getNimettyFunktioargumenttiCount(undefined)).toBe(undefined);
        });

        it("should return true for funktiokutsu SUMMA", function () {
            expect(funktioservice.isFunktiokutsuWithFunktioargumenttiSizeN(funktiokutsuSumma)).toBe(true);
        });

        it("should return true for funktiokutsu KESKIARVO", function () {
            expect(funktioservice.isFunktiokutsuWithFunktioargumenttiSizeN(funktiokutsuKeskiarvo)).toBe(true);
        });

        it("should return false for funktiokutsu PAINOTETTUKESKIARVO", function () {
            expect(funktioservice.isFunktiokutsuWithFunktioargumenttiSizeN(funktiokutsuPainotettukeskiarvo)).toBe(false);
        });

        it("should return false for laskentakaavaviite", function () {
            expect(funktioservice.isFunktiokutsuWithFunktioargumenttiSizeN(laskentakaavaviite)).toBe(false);
        })
    });

    //isPainotettukeskiarvoChild
    describe("isPainotettukeskiarvoChild(name)", function () {

        it("should return true if parent is of type PAINOTETTUKESKIARVO", function () {
            expect(funktioservice.isPainotettukeskiarvoChild(funktiokutsuPainotettukeskiarvo)).toBe(true);
        });

        it('should return false for a KESKIARVO-funktiokutsu', function () {
            expect(funktioservice.isPainotettukeskiarvoChild(funktiokutsuKeskiarvo)).toBe(false);
        });

        it('should return false for a JOS-funktiokutsu', function () {
            expect(funktioservice.isPainotettukeskiarvoChild(funktiokutsuJos)).toBe(false);
        });

        it('should return false for undefined parameter', function () {
            expect(funktioservice.isPainotettukeskiarvoChild()).toBe();
        });
    });

    //isPainotettukeskiarvoChildByParentNimi
    describe("isPainotettukeskiarvoChildByParentNimi", function () {
        it("should return true if PAINOTETTUKESKIARVO", function () {
            expect(funktioservice.isPainotettukeskiarvoChildByParentNimi("PAINOTETTUKESKIARVO")).toBe(true);
        });

        it("should return false if KESKIARVO", function () {
            expect(funktioservice.isPainotettukeskiarvoChildByParentNimi("KESKIARVO")).toBe(false);
        });

        it("should return false if parameter is undefined", function () {
            expect(funktioservice.isPainotettukeskiarvoChildByParentNimi()).toBe(false);
        });
    });

    //isEmptyNimettyFunktioargumentti
    describe("isEmptyNimettyFunktioargumentti(parent, index)", function () {
        it("should return false if child funktiokutsu of KESKIARVO", function () {
            expect(funktioservice.isEmptyNimettyFunktioargumentti(funktiokutsuKeskiarvo, 0)).toBe(false);
        });

        it("should return false if child funktiokutsu of SUMMA", function () {
            expect(funktioservice.isEmptyNimettyFunktioargumentti(funktiokutsuSumma, 0)).toBe(false);
        });

        it("should return false if child funktiokutsu of PAINOTETTUKESKIARVO", function () {
            expect(funktioservice.isEmptyNimettyFunktioargumentti(funktiokutsuPainotettukeskiarvo, 0)).toBe(false);
        });

        it("should return true if child funktiokutsu of JOS", function () {
            expect(funktioservice.isEmptyNimettyFunktioargumentti(funktiokutsuJos, 2)).toBe(true);
        });

        it("should return undefined if either of params is undefined", function () {
            expect(funktioservice.isEmptyNimettyFunktioargumentti(undefined)).toBe(undefined);
        });
    });

    //isRootFunktiokutsu
    describe("isRootFunktiokutsu(funktiokutsu)", function () {
        it("should return false for an object with a key called 'lapsi'", function () {
            expect(funktioservice.isRootFunktiokutsu(funktiokutsuKeskiarvo)).toBe(false);
        });

        it("should return true for a root object of laskentakaava", function () {
            expect(funktioservice.isRootFunktiokutsu(rootFunktiokutsu)).toBe(true);
        });

        it("should return undefined for a root object of laskentakaava", function () {
            expect(funktioservice.isRootFunktiokutsu(undefined)).toBe(undefined);
        });
    });

    //getFunktionimi
    describe("getFunktionimi()", function () {
        it("should return JOS for funktiokutsu JOS", function () {
            expect(funktioservice.getFunktionimi(funktiokutsuJos)).toBe("JOS");
        });

        it("should return SUMMA for funktiokutsu SUMMA", function () {
            expect(funktioservice.getFunktionimi(funktiokutsuSumma)).toBe("SUMMA");
        });

        it("should return undefined for undefined parameter", function () {
            expect(funktioservice.getFunktionimi()).toBe(undefined);
        });
    });

    //isLukuarvoFunktioSlot
    describe("isLukuarvoFunktioSlot(funktiokutsu, index)", function () {
        it("should return true for JOS-funktiokutsu and 2nd index", function () {
            expect(funktioservice.isLukuarvoFunktioSlot(funktiokutsuJos, 2)).toBe(true);
        });

        it("should return false for JOS-funktiokutsu and 1st index", function () {
            expect(funktioservice.isLukuarvoFunktioSlot(funktiokutsuJos, 0)).toBe(false);
        });

        it("should return true for SUMMA-funktiokutsu and 1nd index", function () {
            expect(funktioservice.isLukuarvoFunktioSlot(funktiokutsuSumma, 0)).toBe(true);
        });

        it("should return true for KESKIARVO-funktiokutsu and 1nd index", function () {
            expect(funktioservice.isLukuarvoFunktioSlot(funktiokutsuSumma, 0)).toBe(true);
        });

        it("should return true for PAINOTETTUKESKIARVO-funktiokutsu and 1st index", function () {
            expect(funktioservice.isLukuarvoFunktioSlot(funktiokutsuPainotettukeskiarvo, 0)).toBe(true);
        });

        it("should return true for root-funktiokutsu and 1st index", function () {
            expect(funktioservice.isLukuarvoFunktioSlot(rootFunktiokutsu, 0)).toBe(true);
        });
    });

    //getDefinedFunktioargumenttiCount
    describe("getDefinedFunktioargumenttiCount(funktiokutsu)", function () {
        it("should return 2 for JOS with 2 defined funktioargumenttia", function () {
            expect(funktioservice.getDefinedFunktioargumenttiCount(funktiokutsuJos)).toBe(2)
        });

        it("should return 5 for SUMMA with 5 defined funktioargumentti", function () {
            expect(funktioservice.getDefinedFunktioargumenttiCount(funktiokutsuSumma)).toBe(5);
        });

        it("should return 2 for PAINOTETTUKESKIARVO with 2 defined funktioargumentti", function () {
            expect(funktioservice.getDefinedFunktioargumenttiCount(funktiokutsuPainotettukeskiarvo)).toBe(2);
        });
    });

    //isFunktiokutsu
    describe("isFunktiokutsu(parameter)", function () {
        it("should return true if given a funktiokutsu", function () {
            expect(funktioservice.isFunktiokutsu(funktiokutsuJos)).toBe(true);
        });

        it("should return true if given a funktiokutsu", function () {
            expect(funktioservice.isFunktiokutsu(funktiokutsuKeskiarvo)).toBe(true);
        });

        it("should return false if given a laskentakaavaviite", function () {
            expect(funktioservice.isFunktiokutsu(laskentakaavaviite)).toBe(false);
        });

        it("should return undefined if parameter is undefined", function () {
            expect(funktioservice.isFunktiokutsu()).toBe(undefined);
        });
    });

    //isLaskentakaavaviite
    describe("isLaskentakaavaviite(param)", function () {
        it("should return undefined for undefined param", function () {
            expect(funktioservice.isLaskentakaavaviite()).toBe(undefined);
        });

        it("should return false for hylkää arvovälillä -funktiokutsulla", function () {
            expect(funktioservice.isLaskentakaavaviite(funktiokutsuHylkaaarvovalilla)).toBe(false);
        });

        it("should return false for keskiarvo -funktiokutsulla", function () {
            expect(funktioservice.isLaskentakaavaviite(funktiokutsuKeskiarvo)).toBe(false);
        });

        it("should return false for painotettukeskiarvo -funktiokutsulla", function () {
            expect(funktioservice.isLaskentakaavaviite(funktiokutsuPainotettukeskiarvo)).toBe(false);
        });

        it("should return true for a laskentakaavaviite", function () {
            expect(funktioservice.isLaskentakaavaviite(laskentakaavaviite)).toBe(true);
        });
    });
    
    describe("hasFunktioargumentit(parentFunktiokutsu, index)", function () {
        it("should throw erro if first parameter is missing", function () {
            expect(function () { funktioservice.hasFunktioargumentit(undefined, 0); }).toThrow(new Error('Missing parameter for Funktioservice.hasFunktioargumentit'));
        });

        it("should throw error if second parameter is missing", function () {
            expect(function () {funktioservice.hasFunktioargumentit({}, undefined); }).toThrow(new Error('Missing parameter for Funktioservice.hasFunktioargumentit'));
        });

        it("should return true for funktiokutsu JOS", function () { //JOS-funktiokutsu funktiokutsuSumma:n ensimmäisenä parametrina
            expect(funktioservice.hasFunktioargumentit(funktiokutsuSumma, 0)).toBe(true);
        });
        
        it("should return false for funktiokutsu LUKUARVO", function () { //LUKUARVO-funktiokutsu funktiokutsuJos:n toisena parametrina
            expect(funktioservice.hasFunktioargumentit(funktiokutsuJos, 1)).toBe(false);
        });
        
        it("should return true for rootfunktiokutsu", function () {
            expect(funktioservice.hasFunktioargumentit(rootFunktiokutsu, 0)).toBe(true);
        });


    });

});
