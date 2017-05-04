"use strict";

describe("FunktiokuvausService", function () {
    var funktioservice, funktiokutsuKeskiarvo, funktiokutsuJos,
        funktiokutsuSumma, funktiokutsuHylkaaarvovalilla, funktiokutsuPainotettukeskiarvo,
        laskentakaavaviite, rootFunktiokutsu, funktiokutsuPainotettukeskiarvoWith2EmptySlots,
        funktiokutsuPainotettukeskiarvoWith4EmptySlots, funktiokutsuXParent, funktiokutsuXFirstChild, ei, pienempitaiyhtasuuri, skaalaus,
        funktiokuvausService, funktionimiUINamePairsWithFunktioarguments;
    beforeEach(module('MockData'));
    beforeEach(module('valintaperusteet'));


    beforeEach(inject(function (FunktioService, Funktiokuvaukset, FunktiokutsuKeskiarvo, FunktiokutsuJos,
                                FunktiokutsuSumma, FunktiokutsuHylkaaarvovalilla, FunktiokutsuPainotettukeskiarvo,
                                Laskentakaavaviite, RootFunktiokutsu, FunktiokutsuPainotettukeskiarvoWith2EmptySlots,
                                FunktiokutsuPainotettukeskiarvoWith4EmptySlots, FunktiokutsuXParent, FunktiokutsuXFirstChild,
                                PIENEMPITAIYHTASUURI, EI, SKAALAUS, FunktiokuvausService, FunktionimiUINamePairsWithFunktioarguments) {
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
        funktionimiUINamePairsWithFunktioarguments = FunktionimiUINamePairsWithFunktioarguments;
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

    //hasMoreThanOneFunktioargumentti
    describe("hasMoreThanOneFunktioargumentti(funktionimi)", function () {

        it('should return true for JOS', function () {
            expect(funktiokuvausService.hasMoreThanOneFunktioargumentti('JOS')).toBeTruthy();
        });

        it('should return false for SUMMA', function () {
            expect(funktiokuvausService.hasMoreThanOneFunktioargumentti('SUMMA')).toBeFalsy();
        });

        it('should return true for PIENEMPI', function () {
            expect(funktiokuvausService.hasMoreThanOneFunktioargumentti('PIENEMPI')).toBeTruthy();
        });

        it('should return false for EI', function () {
            expect(funktiokuvausService.hasMoreThanOneFunktioargumentti('EI')).toBeFalsy();
        });

        it('should return true for MAKSIMI', function () {
            expect(funktiokuvausService.hasMoreThanOneFunktioargumentti('MAKSIMI')).toBeFalsy();
        });

    });


    //getFunktioNimiLista
    describe("getFunktioNimiLista()", function () {
        it('should return array of funktionames', function () {
            expect(funktiokuvausService.getFunktioNimiLista()).toEqual(['HYLKAAARVOVALILLA', 'SKAALAUS', 'NIMETTYTOTUUSARVO', 'PIENEMPITAIYHTASUURI', 'NEGAATIO', 'DEMOGRAFIA', 'PIENEMPI', 'KESKIARVO', 'LUKUARVO', 'TULO', 'JOS', 'MEDIAANI', 'HAEMERKKIJONOJAKONVERTOITOTUUSARVOKSI', 'HAELUKUARVOEHDOLLA', 'HAELUKUARVO', 'OSAMAARA', 'JA', 'NMINIMI', 'VALINTAPERUSTEYHTASUURUUS', 'SUMMA', 'SUUREMPI', 'HYLKAA', 'HAETOTUUSARVO', 'TOTUUSARVO', 'HAEYOARVOSANA', 'EI', 'SUUREMPITAIYHTASUURI', 'HAEMERKKIJONOJAVERTAAYHTASUURUUS', 'KONVERTOILUKUARVO', 'KESKIARVONPARASTA', 'HAKUTOIVE', 'HAKUTOIVERYHMASSA', 'MINIMI', 'NMAKSIMI', 'PYORISTYS', 'TAI', 'NIMETTYLUKUARVO', 'YHTASUURI', 'MAKSIMI', 'PAINOTETTUKESKIARVO', 'HAEMERKKIJONOJAKONVERTOILUKUARVOKSI', 'SUMMANPARASTA']);
            expect(funktiokuvausService.getFunktioNimiLista().length).toEqual(funktiokuvausService.funktiokuvaukset.length);
        });
    });

    //kaarittavaFunktiokutsuCanBeSetToFirstChildByFunktionimi
    describe("kaarittavaFunktiokutsuCanBeSetToFirstChildByFunktionimi(name)", function () {

        it('should return true for funktionimi SUMMA', function () {
            expect(funktiokuvausService.kaarittavaFunktiokutsuCanBeSetToFirstChildByFunktionimi('SUMMA')).toBeTruthy();
        });

        it('should return true for funktionimi SKAALAUS', function () {
            expect(funktiokuvausService.kaarittavaFunktiokutsuCanBeSetToFirstChildByFunktionimi('SKAALAUS')).toBeTruthy();
        });

        it('should return true for funktionimi SUUREMPI', function () {
            expect(funktiokuvausService.kaarittavaFunktiokutsuCanBeSetToFirstChildByFunktionimi('SUUREMPI')).toBeFalsy();
        });

        it('should return true for funktionimi NMINIMI', function () {
            expect(funktiokuvausService.kaarittavaFunktiokutsuCanBeSetToFirstChildByFunktionimi('NMINIMI')).toBeTruthy();
        });

        it('should return true for funktionimi HAEYOARVOSANA', function () {
            expect(funktiokuvausService.kaarittavaFunktiokutsuCanBeSetToFirstChildByFunktionimi('HAEYOARVOSANA')).toBeFalsy();
        });

        it('should return true for funktionimi JOS', function () {
            expect(funktiokuvausService.kaarittavaFunktiokutsuCanBeSetToFirstChildByFunktionimi('JOS')).toBeFalsy();
        });

        it('should return true for funktionimi PAINOTETTUKESKIARVO', function () {
            expect(funktiokuvausService.kaarittavaFunktiokutsuCanBeSetToFirstChildByFunktionimi('PAINOTETTUKESKIARVO')).toBeFalsy();
        });

    });



    //isNimettyFunktioargumenttiByFunktionimi
    describe("hasNimettyFunktioargumenttiByFunktioNimi(name)", function () {

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

        //it('should return true for PIENEMPITAIYHTASUURI', function () {
        //    expect(funktiokuvausService.hasFunktioargumentitByFunktionimi('PIENEMPITAIYHTASUURI')).toBeTruthy();
        //});

        it('should return false for HAEYOARVOSANA', function () {
            expect(funktiokuvausService.hasFunktioargumentitByFunktionimi('HAEYOARVOSANA')).toBeFalsy();
        });

        it('should return false for HAETOTUUSARVO', function () {
            expect(funktiokuvausService.hasFunktioargumentitByFunktionimi('HAETOTUUSARVO')).toBeFalsy();
        });

        it('should return true for PAINOTETTUKESKIARVO', function () {
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

    //getFunktioargumenttiCountByFunktionimi
    describe("getFunktioargumenttiCountByFunktionimi(funktionimi)", function () {

        it('should return 3 for funktionimi JOS', function () {
            expect(funktiokuvausService.getFunktioargumenttiCountByFunktionimi('JOS')).toBe(3);
        });

        it('should return 1 for funktionimi SUMMA', function () {
            expect(funktiokuvausService.getFunktioargumenttiCountByFunktionimi('SUMMA')).toBe(1);
        });

        it('should return 1 for funktionimi PAINOTETTUKESKIARVO', function () {
            expect(funktiokuvausService.getFunktioargumenttiCountByFunktionimi('PAINOTETTUKESKIARVO')).toBe(1);
        });

        it('should return 2 for funktionimi OSAMAARA', function () {
            expect(funktiokuvausService.getFunktioargumenttiCountByFunktionimi('OSAMAARA')).toBe(2);
        });

        it('should return 2 for funktionimi YHTASUURI', function () {
            expect(funktiokuvausService.getFunktioargumenttiCountByFunktionimi('YHTASUURI')).toBe(2);
        });

        it('should return 1 for funktionimi EI', function () {
            expect(funktiokuvausService.getFunktioargumenttiCountByFunktionimi('EI')).toBe(1);
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

    //getFunktioTyyppiByFunktionimi
    describe("getFunktioTyyppiByFunktionimi(funktionimi)", function () {

        it('should return LUKUARVOFUNKTIO for funktionimi JOS', function () {
            expect(funktiokuvausService.getFunktioTyyppiByFunktionimi('JOS')).toBe('LUKUARVOFUNKTIO');
        });

        it('should return TOTUUSARVOFUNKTIO for funktionimi JA', function () {
            expect(funktiokuvausService.getFunktioTyyppiByFunktionimi('JA')).toBe('TOTUUSARVOFUNKTIO');
        });

        it('should return TOTUUSARVOFUNKTIO for funktionimi YHTASUURI', function () {
            expect(funktiokuvausService.getFunktioTyyppiByFunktionimi('YHTASUURI')).toBe('TOTUUSARVOFUNKTIO');
        });

        it('should return LUKUARVOFUNKTIO for funktionimi NEGAATIO', function () {
            expect(funktiokuvausService.getFunktioTyyppiByFunktionimi('NEGAATIO')).toBe('LUKUARVOFUNKTIO');
        });

    });
});