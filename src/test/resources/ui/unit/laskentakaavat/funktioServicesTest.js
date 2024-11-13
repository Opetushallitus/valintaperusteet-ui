"use strict";

describe("FunktioService", function () {
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

    //isNimettyFunktioargumentti()
    describe("isNimettyFunktioargumentti(parent)", function () {

        it('should return false for keskiarvo-funktiokutsu', function () {
            expect(funktioservice.isNimettyFunktioargumentti(funktiokutsuKeskiarvo)).toBeFalsy();
        });

        it('should return true for jos-funktiokutsu', function () {
            expect(funktioservice.isNimettyFunktioargumentti(funktiokutsuJos)).toBeTruthy();
        });

        it('should return false for summa-funktiokutsu', function () {
            expect(funktioservice.isNimettyFunktioargumentti(funktiokutsuSumma)).toBeFalsy();
        });

        it('should return true for hylkaaarvovalilla-funktiokutsu', function () {
            expect(funktioservice.isNimettyFunktioargumentti(funktiokutsuHylkaaarvovalilla)).toBeTruthy();
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



    //isPainotettukeskiarvoChild
    describe("isPainotettukeskiarvo(name)", function () {

        it("should return true if parent is of type PAINOTETTUKESKIARVO", function () {
            expect(funktioservice.isPainotettukeskiarvo(funktiokutsuPainotettukeskiarvo)).toBeTruthy();
        });

        it('should return false for a KESKIARVO-funktiokutsu', function () {
            expect(funktioservice.isPainotettukeskiarvo(funktiokutsuKeskiarvo)).toBeFalsy();
        });

        it('should return false for a JOS-funktiokutsu', function () {
            expect(funktioservice.isPainotettukeskiarvo(funktiokutsuJos)).toBeFalsy();
        });

        it('should return false for undefined parameter', function () {
            expect(funktioservice.isPainotettukeskiarvo()).toBe();
        });
    });



    //isEmptyNimettyFunktioargumentti
    describe("isEmptyNimettyFunktioargumentti(parent, index)", function () {
        it("should return false if child funktiokutsu of KESKIARVO", function () {
            expect(funktioservice.isEmptyNimettyFunktioargumentti(funktiokutsuKeskiarvo, 0)).toBeFalsy();
        });

        it("should return false if child funktiokutsu of SUMMA", function () {
            expect(funktioservice.isEmptyNimettyFunktioargumentti(funktiokutsuSumma, 0)).toBeFalsy();
        });

        it("should return false if child funktiokutsu of PAINOTETTUKESKIARVO", function () {
            expect(funktioservice.isEmptyNimettyFunktioargumentti(funktiokutsuPainotettukeskiarvo, 0)).toBeFalsy();
        });

        it("should return true if child funktiokutsu of JOS", function () {
            expect(funktioservice.isEmptyNimettyFunktioargumentti(funktiokutsuJos, 2)).toBeTruthy();
        });

        it("should return undefined if either of params is undefined", function () {
            expect(funktioservice.isEmptyNimettyFunktioargumentti(undefined)).toBe(undefined);
        });
    });

    //isRootFunktiokutsu
    describe("isRootFunktiokutsu(funktiokutsu)", function () {
        it("should return false for an object with a key called 'lapsi'", function () {
            expect(funktioservice.isRootFunktiokutsu(funktiokutsuKeskiarvo)).toBeFalsy();
        });

        it("should return true for a root object of laskentakaava", function () {
            expect(funktioservice.isRootFunktiokutsu(rootFunktiokutsu)).toBeTruthy();
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
            expect(funktioservice.isLukuarvoFunktioSlot(funktiokutsuJos, 2)).toBeTruthy();
        });

        it("should return false for JOS-funktiokutsu and 1st index", function () {
            expect(funktioservice.isLukuarvoFunktioSlot(funktiokutsuJos, 0)).toBeFalsy();
        });

        it("should return true for SUMMA-funktiokutsu and 1nd index", function () {
            expect(funktioservice.isLukuarvoFunktioSlot(funktiokutsuSumma, 0)).toBeTruthy();
        });

        it("should return true for KESKIARVO-funktiokutsu and 1nd index", function () {
            expect(funktioservice.isLukuarvoFunktioSlot(funktiokutsuSumma, 0)).toBeTruthy();
        });

        it("should return true for PAINOTETTUKESKIARVO-funktiokutsu and 1st index", function () {
            expect(funktioservice.isLukuarvoFunktioSlot(funktiokutsuPainotettukeskiarvo, 0)).toBeTruthy();
        });

        it("should return true for root-funktiokutsu and 1st index", function () {
            expect(funktioservice.isLukuarvoFunktioSlot(rootFunktiokutsu, 0)).toBeTruthy();
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
            expect(funktioservice.isFunktiokutsu(funktiokutsuJos)).toBeTruthy();
        });

        it("should return true if given a funktiokutsu", function () {
            expect(funktioservice.isFunktiokutsu(funktiokutsuKeskiarvo)).toBeTruthy();
        });

        it("should return false if given a laskentakaavaviite", function () {
            expect(funktioservice.isFunktiokutsu(laskentakaavaviite)).toBeFalsy();
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
            expect(funktioservice.isLaskentakaavaviite(funktiokutsuHylkaaarvovalilla)).toBeFalsy();
        });

        it("should return false for keskiarvo -funktiokutsulla", function () {
            expect(funktioservice.isLaskentakaavaviite(funktiokutsuKeskiarvo)).toBeFalsy();
        });

        it("should return false for painotettukeskiarvo -funktiokutsulla", function () {
            expect(funktioservice.isLaskentakaavaviite(funktiokutsuPainotettukeskiarvo)).toBeFalsy();
        });

        it("should return true for a laskentakaavaviite", function () {
            expect(funktioservice.isLaskentakaavaviite(laskentakaavaviite)).toBeTruthy();
        });
    });

    //hasFunktioargumentit
    describe("hasFunktioargumentit(parentFunktiokutsu, index)", function () {
        it("should throw error if first parameter is missing", function () {
            expect(function () { funktioservice.hasFunktioargumentit(undefined); }).toThrow(new Error('Missing parameter for Funktioservice.hasFunktioargumentit'));
        });

        it("should throw error if second parameter is missing", function () {
            expect(function () {funktioservice.hasFunktioargumentit({}, undefined); }).toThrow(new Error('Missing parameter for Funktioservice.hasFunktioargumentit'));
        });

        it("should return true for funktiokutsu SUMMA", function () { //JOS-funktiokutsu funktiokutsuSumma:n ensimmäisenä parametrina
            expect(funktioservice.hasFunktioargumentit(funktiokutsuSumma)).toBeTruthy();
        });
        
        it("should return false for funktiokutsu JOS", function () { //LUKUARVO-funktiokutsu funktiokutsuJos:n toisena parametrina
            expect(funktioservice.hasFunktioargumentit(funktiokutsuJos)).toBeTruthy();
        });
        
        it("should return true for rootfunktiokutsu", function () {
            expect(funktioservice.hasFunktioargumentit(rootFunktiokutsu)).toBeTruthy();
        });

    });

    //getCurrentFunktiokutsu
    describe("getCurrentFunktiokutsu(parentFunktiokutsu, index)", function () {
        it('should return the correct child for parent and index', function () {
            expect(funktioservice.getCurrentFunktiokutsu(funktiokutsuXParent,0)).toEqual(funktiokutsuXFirstChild);
        });
    });



    //isLukuarvoFunktiokutsu
    describe("isLukuarvoFunktiokutsu(funktiokuvaus)", function () {
        it('should return false for funktiokuvaus EI', function () {
            expect(funktioservice.isLukuarvoFunktiokutsu(ei)).toBeFalsy();
        });

        it('should return true for funktiokuvaus SKAALAUS', function () {
            expect(funktioservice.isLukuarvoFunktiokutsu(skaalaus)).toBeTruthy();
        });

        it('should return false for funktiokuvaus PIENEMPITAIYHTASUURI', function () {
            expect(funktioservice.isLukuarvoFunktiokutsu(pienempitaiyhtasuuri)).toBeFalsy();
        });
    });

});
