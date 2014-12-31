"use strict";

describe("FunktioService", function () {
    var funktioservice, funktiokutsuKeskiarvo, funktiokutsuJos,
        funktiokutsuSumma, funktiokutsuHylkaaarvovalilla, funktiokutsuPainotettukeskiarvo,
        laskentakaavaviite, rootFunktiokutsu, funktiokutsuPainotettukeskiarvoWith2EmptySlots,
        funktiokutsuPainotettukeskiarvoWith4EmptySlots, funktiokutsuXParent, funktiokutsuXFirstChild, ei, pienempitaiyhtasuuri, skaalaus;
    beforeEach(module('MockData'));
    beforeEach(module('valintaperusteet'));

    beforeEach(inject(function (FunktioService, Funktiokuvaukset, FunktiokutsuKeskiarvo, FunktiokutsuJos,
                                FunktiokutsuSumma, FunktiokutsuHylkaaarvovalilla, FunktiokutsuPainotettukeskiarvo,
                                Laskentakaavaviite, RootFunktiokutsu, FunktiokutsuPainotettukeskiarvoWith2EmptySlots,
                                FunktiokutsuPainotettukeskiarvoWith4EmptySlots, FunktiokutsuXParent, FunktiokutsuXFirstChild,
                                PIENEMPITAIYHTASUURI, EI, SKAALAUS) {
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
        funktiokutsuXParent = FunktiokutsuXParent;
        funktiokutsuXFirstChild = FunktiokutsuXFirstChild;
        ei = EI;
        pienempitaiyhtasuuri = PIENEMPITAIYHTASUURI;
        skaalaus = SKAALAUS;


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

    //isNimettyFunktioargumenttiByFunktionimi
    describe("isNimettyFunktioargumenttiByFunktionimi(name)", function () {

        it('should return false for KESKIARVO-funktiokutsu', function () {
            expect(funktioservice.isNimettyFunktioargumenttiByFunktionimi('KESKIARVO')).toBeFalsy();
        });

        it('should return true for JOS-funktiokutsu', function () {
            expect(funktioservice.isNimettyFunktioargumenttiByFunktionimi('JOS')).toBeTruthy();
        });

        it('should return false for SUMMA-funktiokutsu', function () {
            expect(funktioservice.isNimettyFunktioargumenttiByFunktionimi('SUMMA')).toBeFalsy();
        });

        it('should return true for HYLKAAARVOVALILLA-funktiokutsu', function () {
            expect(funktioservice.isNimettyFunktioargumenttiByFunktionimi('HYLKAAARVOVALILLA')).toBeTruthy();
        });

        it('should return false for PAINOTETTUKESKIARVO-funktiokutsu', function () {
            expect(funktioservice.isNimettyFunktioargumenttiByFunktionimi('PAINOTETTUKESKIARVO')).toBeFalsy();
        });

        it('should return false for HAELUKUARVO-funktiokutsu', function () {
            expect(funktioservice.isNimettyFunktioargumenttiByFunktionimi('HAELUKUARVO')).toBeFalsy();
        });

        it('should return true for NEGAATIO-funktiokutsu', function () {
            expect(funktioservice.isNimettyFunktioargumenttiByFunktionimi('NEGAATIO')).toBeTruthy();
        });

        it('should return false for HAEYOARVOSANA-funktiokutsu', function () {
            expect(funktioservice.isNimettyFunktioargumenttiByFunktionimi('HAEYOARVOSANA')).toBeFalsy();
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

        it("should return true for funktiokutsu SUMMA", function () {
            expect(funktioservice.hasNSizeFunktioargumenttiByFunktionimi(funktioservice.getFunktionimi(funktiokutsuSumma))).toBeTruthy();
        });

        it("should return true for funktiokutsu KESKIARVO", function () {
            expect(funktioservice.hasNSizeFunktioargumenttiByFunktionimi(funktioservice.getFunktionimi(funktiokutsuKeskiarvo))).toBeTruthy();
        });

        it("should return false for funktiokutsu PAINOTETTUKESKIARVO", function () {
            expect(funktioservice.hasNSizeFunktioargumenttiByFunktionimi(funktioservice.getFunktionimi(funktiokutsuPainotettukeskiarvo))).toBeFalsy();
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

    //isPainotettukeskiarvoChildByParentNimi
    describe("isPainotettukeskiarvoChildByParentNimi", function () {
        it("should return true if PAINOTETTUKESKIARVO", function () {
            expect(funktioservice.isPainotettukeskiarvoChildByParentNimi("PAINOTETTUKESKIARVO")).toBeTruthy();
        });

        it("should return false if KESKIARVO", function () {
            expect(funktioservice.isPainotettukeskiarvoChildByParentNimi("KESKIARVO")).toBeFalsy();
        });

        it("should return false if parameter is undefined", function () {
            expect(funktioservice.isPainotettukeskiarvoChildByParentNimi()).toBeFalsy();
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
            expect(function () { funktioservice.hasFunktioargumentit(undefined, 0); }).toThrow(new Error('Missing parameter for Funktioservice.hasFunktioargumentit'));
        });

        it("should throw error if second parameter is missing", function () {
            expect(function () {funktioservice.hasFunktioargumentit({}, undefined); }).toThrow(new Error('Missing parameter for Funktioservice.hasFunktioargumentit'));
        });

        it("should return true for funktiokutsu JOS", function () { //JOS-funktiokutsu funktiokutsuSumma:n ensimmäisenä parametrina
            expect(funktioservice.hasFunktioargumentit(funktiokutsuSumma, 0)).toBeTruthy();
        });
        
        it("should return false for funktiokutsu LUKUARVO", function () { //LUKUARVO-funktiokutsu funktiokutsuJos:n toisena parametrina
            expect(funktioservice.hasFunktioargumentit(funktiokutsuJos, 1)).toBeFalsy();
        });
        
        it("should return true for rootfunktiokutsu", function () {
            expect(funktioservice.hasFunktioargumentit(rootFunktiokutsu, 0)).toBeTruthy();
        });
    });

    //getCurrentFunktiokutsu
    describe("getCurrentFunktiokutsu(parentFunktiokutsu, index)", function () {
        it('should return the correct child for parent and index', function () {
            expect(funktioservice.getCurrentFunktiokutsu(funktiokutsuXParent,0)).toEqual(funktiokutsuXFirstChild);
        });
    });

    //funktiokuvausHasFunktioargumentit
    describe("hasFunktioargumentitByFunktionimi(funktionimi)", function () {
        it('should return true for JOS', function () {
            expect(funktioservice.hasFunktioargumentitByFunktionimi('JOS')).toBeTruthy();
        });

        it('should return false for LUKUARVO', function () {
            expect(funktioservice.hasFunktioargumentitByFunktionimi('LUKUARVO')).toBeFalsy();
        });

        it('should return true for MAKSIMI', function () {
            expect(funktioservice.hasFunktioargumentitByFunktionimi('MAKSIMI')).toBeTruthy();
        });

        it('should return false for PIENEMPITAIYHTASUURI', function () {
            expect(funktioservice.hasFunktioargumentitByFunktionimi('PIENEMPITAIYHTASUURI')).toBeTruthy();
        });

        it('should return false for HAEYOARVOSANA', function () {
            expect(funktioservice.hasFunktioargumentitByFunktionimi('HAEYOARVOSANA')).toBeFalsy();
        });

        it('should return false for HAETOTUUSARVO', function () {
            expect(funktioservice.hasFunktioargumentitByFunktionimi('HAETOTUUSARVO')).toBeFalsy();
        });

        it('should return false for PAINOTETTUKESKIARVO', function () {
            expect(funktioservice.hasFunktioargumentitByFunktionimi('PAINOTETTUKESKIARVO')).toBeTruthy();
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
