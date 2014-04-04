"use strict";

describe('UusiLaskentakaavaController', function () {

    var scope, uusilaskentakaavaCtrl;

    beforeEach(module('LaskentakaavaEditor'));
    beforeEach(inject(function ($rootScope, $controller) {
        scope = $rootScope.$new;
        uusilaskentakaavaCtrl = $controller('UusiLaskentakaavaController', {$scope: scope});
    }));

    describe('funktioservice', function () {

    });

    describe('createlaskentakaava', function () {
    });

});


describe("FunktioService", function () {
    var funktioservice;

    var funktiokuvaukset = [{"nimi":"HYLKAAARVOVALILLA","tyyppi":"LUKUARVOFUNKTIO","funktioargumentit":[{"nimi":"f","tyyppi":"LUKUARVOFUNKTIO","kardinaliteetti":"1"}],"syoteparametrit":[{"avain":"hylkaysperustekuvaus_FI","tyyppi":"MERKKIJONO","pakollinen":false,"arvojoukko":{},"kuvaus":""},{"avain":"hylkaysperustekuvaus_SV","tyyppi":"MERKKIJONO","pakollinen":false,"arvojoukko":{},"kuvaus":""},{"avain":"hylkaysperustekuvaus_EN","tyyppi":"MERKKIJONO","pakollinen":false,"arvojoukko":{},"kuvaus":""},{"avain":"arvovaliMin","tyyppi":"MERKKIJONO","pakollinen":true,"arvojoukko":{},"kuvaus":""},{"avain":"arvovaliMax","tyyppi":"MERKKIJONO","pakollinen":true,"arvojoukko":{},"kuvaus":""}]},{"nimi":"SKAALAUS","tyyppi":"LUKUARVOFUNKTIO","funktioargumentit":[{"nimi":"f","tyyppi":"LUKUARVOFUNKTIO","kardinaliteetti":"1"}],"syoteparametrit":[{"avain":"kohdeskaalaMin","tyyppi":"DESIMAALILUKU","pakollinen":true,"arvojoukko":{},"kuvaus":""},{"avain":"kohdeskaalaMax","tyyppi":"DESIMAALILUKU","pakollinen":true,"arvojoukko":{},"kuvaus":""},{"avain":"lahdeskaalaMin","tyyppi":"DESIMAALILUKU","pakollinen":false,"arvojoukko":{},"kuvaus":""},{"avain":"lahdeskaalaMax","tyyppi":"DESIMAALILUKU","pakollinen":false,"arvojoukko":{},"kuvaus":""},{"avain":"kaytaLaskennallistaLahdeskaalaa","tyyppi":"TOTUUSARVO","pakollinen":true,"arvojoukko":{},"kuvaus":""}]},{"nimi":"NIMETTYTOTUUSARVO","tyyppi":"TOTUUSARVOFUNKTIO","funktioargumentit":[{"nimi":"f","tyyppi":"TOTUUSARVOFUNKTIO","kardinaliteetti":"1"}],"syoteparametrit":[{"avain":"nimi","tyyppi":"MERKKIJONO","pakollinen":true,"arvojoukko":{},"kuvaus":""}]},{"nimi":"PIENEMPITAIYHTASUURI","tyyppi":"TOTUUSARVOFUNKTIO","funktioargumentit":[{"nimi":"vasenOperandi","tyyppi":"LUKUARVOFUNKTIO","kardinaliteetti":"1"},{"nimi":"oikeaOperandi","tyyppi":"LUKUARVOFUNKTIO","kardinaliteetti":"1"}]},{"nimi":"NEGAATIO","tyyppi":"LUKUARVOFUNKTIO","funktioargumentit":[{"nimi":"f","tyyppi":"LUKUARVOFUNKTIO","kardinaliteetti":"1"}]},{"nimi":"DEMOGRAFIA","tyyppi":"TOTUUSARVOFUNKTIO","syoteparametrit":[{"avain":"tunniste","tyyppi":"MERKKIJONO","pakollinen":true,"arvojoukko":{},"kuvaus":""},{"avain":"prosenttiosuus","tyyppi":"DESIMAALILUKU","pakollinen":true,"arvojoukko":{},"kuvaus":""}]},{"nimi":"PIENEMPI","tyyppi":"TOTUUSARVOFUNKTIO","funktioargumentit":[{"nimi":"vasenOperandi","tyyppi":"LUKUARVOFUNKTIO","kardinaliteetti":"1"},{"nimi":"oikeaOperandi","tyyppi":"LUKUARVOFUNKTIO","kardinaliteetti":"1"}]},{"nimi":"KESKIARVO","tyyppi":"LUKUARVOFUNKTIO","funktioargumentit":[{"nimi":"args","tyyppi":"LUKUARVOFUNKTIO","kardinaliteetti":"n"}]},{"nimi":"LUKUARVO","tyyppi":"LUKUARVOFUNKTIO","syoteparametrit":[{"avain":"luku","tyyppi":"DESIMAALILUKU","pakollinen":true,"arvojoukko":{},"kuvaus":""}]},{"nimi":"TULO","tyyppi":"LUKUARVOFUNKTIO","funktioargumentit":[{"nimi":"args","tyyppi":"LUKUARVOFUNKTIO","kardinaliteetti":"n"}]},{"nimi":"JOS","tyyppi":"LUKUARVOFUNKTIO","funktioargumentit":[{"nimi":"ehto","tyyppi":"TOTUUSARVOFUNKTIO","kardinaliteetti":"1"},{"nimi":"sitten","tyyppi":"LUKUARVOFUNKTIO","kardinaliteetti":"1"},{"nimi":"muuten","tyyppi":"LUKUARVOFUNKTIO","kardinaliteetti":"1"}]},{"nimi":"MEDIAANI","tyyppi":"LUKUARVOFUNKTIO","funktioargumentit":[{"nimi":"args","tyyppi":"LUKUARVOFUNKTIO","kardinaliteetti":"n"}]},{"nimi":"HAEMERKKIJONOJAKONVERTOITOTUUSARVOKSI","tyyppi":"TOTUUSARVOFUNKTIO","syoteparametrit":[{"avain":"oletusarvo","tyyppi":"TOTUUSARVO","pakollinen":false,"arvojoukko":{},"kuvaus":""}],"valintaperusteviitteet":[{"nimi":"tunniste","tyyppi":"MERKKIJONO","arvojoukko":{},"kuvaus":""}],"konvertteri":{"pakollinen":true,"konvertteriTyypit":[{"tyyppi":"ARVOKONVERTTERI","arvotyyppi":"MERKKIJONO"}]}},{"nimi":"HAELUKUARVOEHDOLLA","tyyppi":"LUKUARVOFUNKTIO","syoteparametrit":[{"avain":"oletusarvo","tyyppi":"DESIMAALILUKU","pakollinen":false,"arvojoukko":{},"kuvaus":""}],"valintaperusteviitteet":[{"nimi":"tunniste","tyyppi":"DESIMAALILUKU","arvojoukko":{},"kuvaus":""},{"nimi":"ehto","tyyppi":"MERKKIJONO","arvojoukko":{},"kuvaus":""}],"konvertteri":{"pakollinen":false,"konvertteriTyypit":[{"tyyppi":"ARVOKONVERTTERI","arvotyyppi":"DESIMAALILUKU"},{"tyyppi":"ARVOVALIKONVERTTERI"}]}},{"nimi":"HAELUKUARVO","tyyppi":"LUKUARVOFUNKTIO","syoteparametrit":[{"avain":"oletusarvo","tyyppi":"DESIMAALILUKU","pakollinen":false,"arvojoukko":{},"kuvaus":""}],"valintaperusteviitteet":[{"nimi":"tunniste","tyyppi":"DESIMAALILUKU","arvojoukko":{},"kuvaus":""}],"konvertteri":{"pakollinen":false,"konvertteriTyypit":[{"tyyppi":"ARVOKONVERTTERI","arvotyyppi":"DESIMAALILUKU"},{"tyyppi":"ARVOVALIKONVERTTERI"}]}},{"nimi":"OSAMAARA","tyyppi":"LUKUARVOFUNKTIO","funktioargumentit":[{"nimi":"osoittaja","tyyppi":"LUKUARVOFUNKTIO","kardinaliteetti":"1"},{"nimi":"nimittaja","tyyppi":"LUKUARVOFUNKTIO","kardinaliteetti":"1"}]},{"nimi":"JA","tyyppi":"TOTUUSARVOFUNKTIO","funktioargumentit":[{"nimi":"args","tyyppi":"TOTUUSARVOFUNKTIO","kardinaliteetti":"n"}]},{"nimi":"NMINIMI","tyyppi":"LUKUARVOFUNKTIO","funktioargumentit":[{"nimi":"args","tyyppi":"LUKUARVOFUNKTIO","kardinaliteetti":"n"}],"syoteparametrit":[{"avain":"n","tyyppi":"KOKONAISLUKU","pakollinen":true,"arvojoukko":{},"kuvaus":""}]},{"nimi":"VALINTAPERUSTEYHTASUURUUS","tyyppi":"TOTUUSARVOFUNKTIO","valintaperusteviitteet":[{"nimi":"tunniste1","tyyppi":"MERKKIJONO","arvojoukko":{},"kuvaus":""},{"nimi":"tunniste2","tyyppi":"MERKKIJONO","arvojoukko":{},"kuvaus":""}]},{"nimi":"SUMMA","tyyppi":"LUKUARVOFUNKTIO","funktioargumentit":[{"nimi":"args","tyyppi":"LUKUARVOFUNKTIO","kardinaliteetti":"n"}]},{"nimi":"SUUREMPI","tyyppi":"TOTUUSARVOFUNKTIO","funktioargumentit":[{"nimi":"vasenOperandi","tyyppi":"LUKUARVOFUNKTIO","kardinaliteetti":"1"},{"nimi":"oikeaOperandi","tyyppi":"LUKUARVOFUNKTIO","kardinaliteetti":"1"}]},{"nimi":"HYLKAA","tyyppi":"LUKUARVOFUNKTIO","funktioargumentit":[{"nimi":"f","tyyppi":"TOTUUSARVOFUNKTIO","kardinaliteetti":"1"}],"syoteparametrit":[{"avain":"hylkaysperustekuvaus_FI","tyyppi":"MERKKIJONO","pakollinen":false,"arvojoukko":{},"kuvaus":""},{"avain":"hylkaysperustekuvaus_SV","tyyppi":"MERKKIJONO","pakollinen":false,"arvojoukko":{},"kuvaus":""},{"avain":"hylkaysperustekuvaus_EN","tyyppi":"MERKKIJONO","pakollinen":false,"arvojoukko":{},"kuvaus":""}]},{"nimi":"HAETOTUUSARVO","tyyppi":"TOTUUSARVOFUNKTIO","syoteparametrit":[{"avain":"oletusarvo","tyyppi":"TOTUUSARVO","pakollinen":false,"arvojoukko":{},"kuvaus":""}],"valintaperusteviitteet":[{"nimi":"tunniste","tyyppi":"TOTUUSARVO","arvojoukko":{},"kuvaus":""}],"konvertteri":{"pakollinen":false,"konvertteriTyypit":[{"tyyppi":"ARVOKONVERTTERI","arvotyyppi":"TOTUUSARVO"}]}},{"nimi":"TOTUUSARVO","tyyppi":"TOTUUSARVOFUNKTIO","syoteparametrit":[{"avain":"totuusarvo","tyyppi":"TOTUUSARVO","pakollinen":true,"arvojoukko":{},"kuvaus":""}]},{"nimi":"HAEYOARVOSANA","tyyppi":"LUKUARVOFUNKTIO","syoteparametrit":[{"avain":"alkuvuosi","tyyppi":"KOKONAISLUKU","pakollinen":false,"arvojoukko":{},"kuvaus":"Alkaen (vuosi)"},{"avain":"alkulukukausi","tyyppi":"ARVOJOUKKO","pakollinen":false,"arvojoukko":{"1":"Syksy","2":"Kevät"},"kuvaus":"Alkaen (lukukausi)"},{"avain":"loppuvuosi","tyyppi":"KOKONAISLUKU","pakollinen":false,"arvojoukko":{},"kuvaus":"Päättyen (vuosi)"},{"avain":"loppulukukausi","tyyppi":"ARVOJOUKKO","pakollinen":false,"arvojoukko":{"1":"Syksy","2":"Kevät"},"kuvaus":"Päättyen (lukukausi)"},{"avain":"I","tyyppi":"DESIMAALILUKU","pakollinen":false,"arvojoukko":{},"kuvaus":"Arvosana I"},{"avain":"A","tyyppi":"DESIMAALILUKU","pakollinen":false,"arvojoukko":{},"kuvaus":"Arvosana A"},{"avain":"B","tyyppi":"DESIMAALILUKU","pakollinen":false,"arvojoukko":{},"kuvaus":"Arvosana B"},{"avain":"C","tyyppi":"DESIMAALILUKU","pakollinen":false,"arvojoukko":{},"kuvaus":"Arvosana C"},{"avain":"M","tyyppi":"DESIMAALILUKU","pakollinen":false,"arvojoukko":{},"kuvaus":"Arvosana M"},{"avain":"E","tyyppi":"DESIMAALILUKU","pakollinen":false,"arvojoukko":{},"kuvaus":"Arvosana E"},{"avain":"L","tyyppi":"DESIMAALILUKU","pakollinen":false,"arvojoukko":{},"kuvaus":"Arvosana L"}],"valintaperusteviitteet":[{"nimi":"oppiaine","tyyppi":"ARVOJOUKKO","arvojoukko":{"S9":"Saksalaisen koulun saksan kielen koe","TC":"Italia, lyhyt oppimäärä","REAALI":"Reaali","L1":"Latina, lyhyt oppimäärä","PITKA_KIELI":"Kieli, pitkä oppimäärä","N":"Matematiikan koe, lyhyt oppimäärä","FC":"Ranska, lyhyt oppimäärä","FY":"Fysiikka","FB":"Ranska, keskipitkä oppimäärä","SB":"Saksa, keskipitkä oppimäärä","KC":"Kreikka, lyhyt oppimäärä","J":"Englanninkielinen kypsyyskoe","EB":"Englanti, keskipitkä oppimäärä","EA":"Englanti, pitkä oppimäärä","RO":"Reaali, ortod.uskonnon kysymykset","TE":"Terveystieto","VC":"Venäjä, lyhyt oppimäärä","A":"Äidinkielen koe, suomi","TB":"Italia, keskipitkä oppimäärä","A5":"Suomi toisena kielenä","PC":"Espanja, lyhyt oppimäärä","BB":"Ruotsi, keskipitkä oppimäärä","RY":"Reaali, elämänkatsomustiedon kysymykset","SA":"Saksa, pitkä oppimäärä","GC":"Portugali, lyhyt oppimäärä","M":"Matematiikan koe, pitkä oppimäärä","FF":"Filosofia","I":"Äidinkielen koe, inarinsaame","PB":"Espanja, keskipitkä oppimäärä","FA":"Ranska, pitkä oppimäärä","CC":"Suomi, lyhyt oppimäärä","KESKIPITKA_KIELI":"Kieli, keskipitkä oppimäärä","BI":"Biologia","RR":"Reaali, ev lut uskonnon kysymykset","TA":"Italia, pitkä oppimäärä","BA":"Ruotsi, pitkä oppimäärä","GB":"Portugali, keskipitkä oppimäärä","QC":"Koltan saame, lyhyt oppimäärä","HB":"Unkari, keskipitkä oppimäärä","CB":"Suomi, keskipitkä oppimäärä","VB":"Venäjä, keskipitkä oppimäärä","DC":"Pohjoissaame, lyhyt oppimäärä","YH":"Yhteiskuntaoppi","PA":"Espanja, pitkä oppimäärä","L7":"Latina, laajempi oppimäärä","GA":"Portugali, pitkä oppimäärä","W":"Äidinkielen koe, koltansaame","HI":"Historia","KE":"Kemia","IC":"Inarinsaame, lyhyt oppimäärä","CA":"Suomi, pitkä oppimäärä","O":"Äidinkielen koe, ruotsi","UE":"Ev.lut. Uskonto","UO":"Ortodoksiuskonto","ET":"Elämänkatsomustieto","O5":"Ruotsi toisena kielenä","VA":"Venäjä, pitkä oppimäärä","GE":"Maantiede","Z":"Äidinkielen koe, pohjoissaame","LYHYT_KIELI":"Kieli, lyhyt oppimäärä","SC":"Saksa, lyhyt oppimäärä","PS":"Psykologia","EC":"Englanti, lyhyt oppimäärä","HA":"Unkari, pitkä oppimäärä"},"kuvaus":"Oppiaine"}]},{"nimi":"EI","tyyppi":"TOTUUSARVOFUNKTIO","funktioargumentit":[{"nimi":"f","tyyppi":"TOTUUSARVOFUNKTIO","kardinaliteetti":"1"}]},{"nimi":"SUUREMPITAIYHTASUURI","tyyppi":"TOTUUSARVOFUNKTIO","funktioargumentit":[{"nimi":"vasenOperandi","tyyppi":"LUKUARVOFUNKTIO","kardinaliteetti":"1"},{"nimi":"oikeaOperandi","tyyppi":"LUKUARVOFUNKTIO","kardinaliteetti":"1"}]},{"nimi":"HAEMERKKIJONOJAVERTAAYHTASUURUUS","tyyppi":"TOTUUSARVOFUNKTIO","syoteparametrit":[{"avain":"oletusarvo","tyyppi":"TOTUUSARVO","pakollinen":false,"arvojoukko":{},"kuvaus":""},{"avain":"vertailtava","tyyppi":"MERKKIJONO","pakollinen":true,"arvojoukko":{},"kuvaus":""}],"valintaperusteviitteet":[{"nimi":"tunniste","tyyppi":"MERKKIJONO","arvojoukko":{},"kuvaus":""}]},{"nimi":"KONVERTOILUKUARVO","tyyppi":"LUKUARVOFUNKTIO","funktioargumentit":[{"nimi":"f","tyyppi":"LUKUARVOFUNKTIO","kardinaliteetti":"1"}],"konvertteri":{"pakollinen":true,"konvertteriTyypit":[{"tyyppi":"ARVOKONVERTTERI","arvotyyppi":"DESIMAALILUKU"},{"tyyppi":"ARVOVALIKONVERTTERI"}]}},{"nimi":"KESKIARVONPARASTA","tyyppi":"LUKUARVOFUNKTIO","funktioargumentit":[{"nimi":"args","tyyppi":"LUKUARVOFUNKTIO","kardinaliteetti":"n"}],"syoteparametrit":[{"avain":"n","tyyppi":"KOKONAISLUKU","pakollinen":true,"arvojoukko":{},"kuvaus":""}]},{"nimi":"HAKUTOIVE","tyyppi":"TOTUUSARVOFUNKTIO","syoteparametrit":[{"avain":"n","tyyppi":"KOKONAISLUKU","pakollinen":true,"arvojoukko":{},"kuvaus":""}]},{"nimi":"MINIMI","tyyppi":"LUKUARVOFUNKTIO","funktioargumentit":[{"nimi":"args","tyyppi":"LUKUARVOFUNKTIO","kardinaliteetti":"n"}]},{"nimi":"NMAKSIMI","tyyppi":"LUKUARVOFUNKTIO","funktioargumentit":[{"nimi":"args","tyyppi":"LUKUARVOFUNKTIO","kardinaliteetti":"n"}],"syoteparametrit":[{"avain":"n","tyyppi":"KOKONAISLUKU","pakollinen":true,"arvojoukko":{},"kuvaus":""}]},{"nimi":"PYORISTYS","tyyppi":"LUKUARVOFUNKTIO","funktioargumentit":[{"nimi":"f","tyyppi":"LUKUARVOFUNKTIO","kardinaliteetti":"1"}],"syoteparametrit":[{"avain":"tarkkuus","tyyppi":"KOKONAISLUKU","pakollinen":true,"arvojoukko":{},"kuvaus":""}]},{"nimi":"TAI","tyyppi":"TOTUUSARVOFUNKTIO","funktioargumentit":[{"nimi":"args","tyyppi":"TOTUUSARVOFUNKTIO","kardinaliteetti":"n"}]},{"nimi":"NIMETTYLUKUARVO","tyyppi":"LUKUARVOFUNKTIO","funktioargumentit":[{"nimi":"f","tyyppi":"LUKUARVOFUNKTIO","kardinaliteetti":"1"}],"syoteparametrit":[{"avain":"nimi","tyyppi":"MERKKIJONO","pakollinen":true,"arvojoukko":{},"kuvaus":""}]},{"nimi":"YHTASUURI","tyyppi":"TOTUUSARVOFUNKTIO","funktioargumentit":[{"nimi":"vasenOperandi","tyyppi":"LUKUARVOFUNKTIO","kardinaliteetti":"1"},{"nimi":"oikeaOperandi","tyyppi":"LUKUARVOFUNKTIO","kardinaliteetti":"1"}]},{"nimi":"MAKSIMI","tyyppi":"LUKUARVOFUNKTIO","funktioargumentit":[{"nimi":"args","tyyppi":"LUKUARVOFUNKTIO","kardinaliteetti":"n"}]},{"nimi":"PAINOTETTUKESKIARVO","tyyppi":"LUKUARVOFUNKTIO","funktioargumentit":[{"nimi":"args","tyyppi":"LUKUARVOFUNKTIO","kardinaliteetti":"lista_pareja"}]},{"nimi":"HAEMERKKIJONOJAKONVERTOILUKUARVOKSI","tyyppi":"LUKUARVOFUNKTIO","syoteparametrit":[{"avain":"oletusarvo","tyyppi":"DESIMAALILUKU","pakollinen":false,"arvojoukko":{},"kuvaus":""}],"valintaperusteviitteet":[{"nimi":"tunniste","tyyppi":"MERKKIJONO","arvojoukko":{},"kuvaus":""}],"konvertteri":{"pakollinen":true,"konvertteriTyypit":[{"tyyppi":"ARVOKONVERTTERI","arvotyyppi":"MERKKIJONO"}]}},{"nimi":"SUMMANPARASTA","tyyppi":"LUKUARVOFUNKTIO","funktioargumentit":[{"nimi":"args","tyyppi":"LUKUARVOFUNKTIO","kardinaliteetti":"n"}],"syoteparametrit":[{"avain":"n","tyyppi":"KOKONAISLUKU","pakollinen":true,"arvojoukko":{},"kuvaus":""}]}];
    var funktiokutsuKeskiarvo = {"lapsi":{"funktionimi":"KESKIARVO","arvokonvertteriparametrit":[],"arvovalikonvertteriparametrit":[],"syoteparametrit":[],"funktioargumentit":[{"lapsi":{"funktionimi":"HAELUKUARVO","arvokonvertteriparametrit":[],"arvovalikonvertteriparametrit":[],"syoteparametrit":[],"funktioargumentit":[],"valintaperusteviitteet":[{"tunniste":"PK_A1","kuvaus":"","lahde":"HAETTAVA_ARVO","onPakollinen":false,"epasuoraViittaus":false,"indeksi":2}],"validointivirheet":[],"onLuonnos":null,"nimi":null,"kuvaus":null,"tyyppi":null,"id":819222,"lapsityyppi":"funktiokutsu","tulosTunniste":null,"tulosTekstiFi":null,"tulosTekstiSv":null,"tulosTekstiEn":null,"tallennaTulos":false},"indeksi":1},{"lapsi":{"funktionimi":"KESKIARVO","arvokonvertteriparametrit":[],"arvovalikonvertteriparametrit":[],"syoteparametrit":[],"funktioargumentit":[{"lapsi":{"funktionimi":"HAELUKUARVO","arvokonvertteriparametrit":[],"arvovalikonvertteriparametrit":[],"syoteparametrit":[],"funktioargumentit":[],"valintaperusteviitteet":[{"tunniste":"PK_A1_VAL1","kuvaus":"","lahde":"HAETTAVA_ARVO","onPakollinen":false,"epasuoraViittaus":false,"indeksi":2}],"validointivirheet":[],"onLuonnos":null,"nimi":null,"kuvaus":null,"tyyppi":null,"id":819224,"lapsityyppi":"funktiokutsu","tulosTunniste":null,"tulosTekstiFi":null,"tulosTekstiSv":null,"tulosTekstiEn":null,"tallennaTulos":false},"indeksi":1},{"lapsi":{"funktionimi":"HAELUKUARVO","arvokonvertteriparametrit":[],"arvovalikonvertteriparametrit":[],"syoteparametrit":[],"funktioargumentit":[],"valintaperusteviitteet":[{"tunniste":"PK_A1_VAL2","kuvaus":"","lahde":"HAETTAVA_ARVO","onPakollinen":false,"epasuoraViittaus":false,"indeksi":2}],"validointivirheet":[],"onLuonnos":null,"nimi":null,"kuvaus":null,"tyyppi":null,"id":819226,"lapsityyppi":"funktiokutsu","tulosTunniste":null,"tulosTekstiFi":null,"tulosTekstiSv":null,"tulosTekstiEn":null,"tallennaTulos":false},"indeksi":2}],"valintaperusteviitteet":[],"validointivirheet":[],"onLuonnos":null,"nimi":null,"kuvaus":null,"tyyppi":null,"id":819228,"lapsityyppi":"funktiokutsu","tulosTunniste":null,"tulosTekstiFi":null,"tulosTekstiSv":null,"tulosTekstiEn":null,"tallennaTulos":false},"indeksi":2}],"valintaperusteviitteet":[],"validointivirheet":[],"onLuonnos":null,"nimi":null,"kuvaus":null,"tyyppi":null,"id":819231,"lapsityyppi":"funktiokutsu","tulosTunniste":null,"tulosTekstiFi":null,"tulosTekstiSv":null,"tulosTekstiEn":null,"tallennaTulos":false},"indeksi":1}
    var funktiokutsuJos = {"lapsi":{"funktionimi":"JOS","arvokonvertteriparametrit":[],"arvovalikonvertteriparametrit":[],"syoteparametrit":[],"funktioargumentit":[{"lapsi":{"funktionimi":"DEMOGRAFIA","arvokonvertteriparametrit":[],"arvovalikonvertteriparametrit":[],"syoteparametrit":[{"avain":"prosenttiosuus","arvo":"30.0"},{"avain":"tunniste","arvo":"SUKUPUOLI"}],"funktioargumentit":[],"valintaperusteviitteet":[],"validointivirheet":[],"onLuonnos":null,"nimi":null,"kuvaus":null,"tyyppi":null,"id":819237,"lapsityyppi":"funktiokutsu","tulosTunniste":null,"tulosTekstiFi":null,"tulosTekstiSv":null,"tulosTekstiEn":null,"tallennaTulos":false},"indeksi":1},{"lapsi":{"funktionimi":"LUKUARVO","arvokonvertteriparametrit":[],"arvovalikonvertteriparametrit":[],"syoteparametrit":[{"avain":"luku","arvo":"2.0"}],"funktioargumentit":[],"valintaperusteviitteet":[],"validointivirheet":[],"onLuonnos":null,"nimi":null,"kuvaus":null,"tyyppi":null,"id":819240,"lapsityyppi":"funktiokutsu","tulosTunniste":null,"tulosTekstiFi":null,"tulosTekstiSv":null,"tulosTekstiEn":null,"tallennaTulos":false},"indeksi":2},{"lapsi":{"funktionimi":"LUKUARVO","arvokonvertteriparametrit":[],"arvovalikonvertteriparametrit":[],"syoteparametrit":[{"avain":"luku","arvo":"0.0"}],"funktioargumentit":[],"valintaperusteviitteet":[],"validointivirheet":[],"onLuonnos":null,"nimi":null,"kuvaus":null,"tyyppi":null,"id":819242,"lapsityyppi":"funktiokutsu","tulosTunniste":null,"tulosTekstiFi":null,"tulosTekstiSv":null,"tulosTekstiEn":null,"tallennaTulos":false},"indeksi":3}],"valintaperusteviitteet":[],"validointivirheet":[],"onLuonnos":null,"nimi":null,"kuvaus":null,"tyyppi":null,"id":819244,"lapsityyppi":"funktiokutsu","tulosTunniste":null,"tulosTekstiFi":null,"tulosTekstiSv":null,"tulosTekstiEn":null,"tallennaTulos":false},"indeksi":1}
    var funktiokutsuSumma = {"lapsi":{"funktionimi":"SUMMA","arvokonvertteriparametrit":[],"arvovalikonvertteriparametrit":[],"syoteparametrit":[],"funktioargumentit":[{"lapsi":{"funktionimi":"JOS","arvokonvertteriparametrit":[],"arvovalikonvertteriparametrit":[],"syoteparametrit":[],"funktioargumentit":[{"lapsi":{"funktionimi":"HAKUTOIVE","arvokonvertteriparametrit":[],"arvovalikonvertteriparametrit":[],"syoteparametrit":[{"avain":"n","arvo":"1"}],"funktioargumentit":[],"valintaperusteviitteet":[],"validointivirheet":[],"onLuonnos":null,"nimi":null,"kuvaus":null,"tyyppi":null,"id":819251,"lapsityyppi":"funktiokutsu","tulosTunniste":null,"tulosTekstiFi":null,"tulosTekstiSv":null,"tulosTekstiEn":null,"tallennaTulos":false},"indeksi":1},{"lapsi":{"funktionimi":"LUKUARVO","arvokonvertteriparametrit":[],"arvovalikonvertteriparametrit":[],"syoteparametrit":[{"avain":"luku","arvo":"5.0"}],"funktioargumentit":[],"valintaperusteviitteet":[],"validointivirheet":[],"onLuonnos":null,"nimi":null,"kuvaus":null,"tyyppi":null,"id":819253,"lapsityyppi":"funktiokutsu","tulosTunniste":null,"tulosTekstiFi":null,"tulosTekstiSv":null,"tulosTekstiEn":null,"tallennaTulos":false},"indeksi":2},{"lapsi":{"funktionimi":"LUKUARVO","arvokonvertteriparametrit":[],"arvovalikonvertteriparametrit":[],"syoteparametrit":[{"avain":"luku","arvo":"0.0"}],"funktioargumentit":[],"valintaperusteviitteet":[],"validointivirheet":[],"onLuonnos":null,"nimi":null,"kuvaus":null,"tyyppi":null,"id":819255,"lapsityyppi":"funktiokutsu","tulosTunniste":null,"tulosTekstiFi":null,"tulosTekstiSv":null,"tulosTekstiEn":null,"tallennaTulos":false},"indeksi":3}],"valintaperusteviitteet":[],"validointivirheet":[],"onLuonnos":null,"nimi":null,"kuvaus":null,"tyyppi":null,"id":819257,"lapsityyppi":"funktiokutsu","tulosTunniste":null,"tulosTekstiFi":null,"tulosTekstiSv":null,"tulosTekstiEn":null,"tallennaTulos":false},"indeksi":1},{"lapsi":{"funktionimi":"JOS","arvokonvertteriparametrit":[],"arvovalikonvertteriparametrit":[],"syoteparametrit":[],"funktioargumentit":[{"lapsi":{"funktionimi":"HAKUTOIVE","arvokonvertteriparametrit":[],"arvovalikonvertteriparametrit":[],"syoteparametrit":[{"avain":"n","arvo":"2"}],"funktioargumentit":[],"valintaperusteviitteet":[],"validointivirheet":[],"onLuonnos":null,"nimi":null,"kuvaus":null,"tyyppi":null,"id":819261,"lapsityyppi":"funktiokutsu","tulosTunniste":null,"tulosTekstiFi":null,"tulosTekstiSv":null,"tulosTekstiEn":null,"tallennaTulos":false},"indeksi":1},{"lapsi":{"funktionimi":"LUKUARVO","arvokonvertteriparametrit":[],"arvovalikonvertteriparametrit":[],"syoteparametrit":[{"avain":"luku","arvo":"4.0"}],"funktioargumentit":[],"valintaperusteviitteet":[],"validointivirheet":[],"onLuonnos":null,"nimi":null,"kuvaus":null,"tyyppi":null,"id":819263,"lapsityyppi":"funktiokutsu","tulosTunniste":null,"tulosTekstiFi":null,"tulosTekstiSv":null,"tulosTekstiEn":null,"tallennaTulos":false},"indeksi":2},{"lapsi":{"funktionimi":"LUKUARVO","arvokonvertteriparametrit":[],"arvovalikonvertteriparametrit":[],"syoteparametrit":[{"avain":"luku","arvo":"0.0"}],"funktioargumentit":[],"valintaperusteviitteet":[],"validointivirheet":[],"onLuonnos":null,"nimi":null,"kuvaus":null,"tyyppi":null,"id":819265,"lapsityyppi":"funktiokutsu","tulosTunniste":null,"tulosTekstiFi":null,"tulosTekstiSv":null,"tulosTekstiEn":null,"tallennaTulos":false},"indeksi":3}],"valintaperusteviitteet":[],"validointivirheet":[],"onLuonnos":null,"nimi":null,"kuvaus":null,"tyyppi":null,"id":819267,"lapsityyppi":"funktiokutsu","tulosTunniste":null,"tulosTekstiFi":null,"tulosTekstiSv":null,"tulosTekstiEn":null,"tallennaTulos":false},"indeksi":2},{"lapsi":{"funktionimi":"JOS","arvokonvertteriparametrit":[],"arvovalikonvertteriparametrit":[],"syoteparametrit":[],"funktioargumentit":[{"lapsi":{"funktionimi":"HAKUTOIVE","arvokonvertteriparametrit":[],"arvovalikonvertteriparametrit":[],"syoteparametrit":[{"avain":"n","arvo":"3"}],"funktioargumentit":[],"valintaperusteviitteet":[],"validointivirheet":[],"onLuonnos":null,"nimi":null,"kuvaus":null,"tyyppi":null,"id":819271,"lapsityyppi":"funktiokutsu","tulosTunniste":null,"tulosTekstiFi":null,"tulosTekstiSv":null,"tulosTekstiEn":null,"tallennaTulos":false},"indeksi":1},{"lapsi":{"funktionimi":"LUKUARVO","arvokonvertteriparametrit":[],"arvovalikonvertteriparametrit":[],"syoteparametrit":[{"avain":"luku","arvo":"3.0"}],"funktioargumentit":[],"valintaperusteviitteet":[],"validointivirheet":[],"onLuonnos":null,"nimi":null,"kuvaus":null,"tyyppi":null,"id":819273,"lapsityyppi":"funktiokutsu","tulosTunniste":null,"tulosTekstiFi":null,"tulosTekstiSv":null,"tulosTekstiEn":null,"tallennaTulos":false},"indeksi":2},{"lapsi":{"funktionimi":"LUKUARVO","arvokonvertteriparametrit":[],"arvovalikonvertteriparametrit":[],"syoteparametrit":[{"avain":"luku","arvo":"0.0"}],"funktioargumentit":[],"valintaperusteviitteet":[],"validointivirheet":[],"onLuonnos":null,"nimi":null,"kuvaus":null,"tyyppi":null,"id":819275,"lapsityyppi":"funktiokutsu","tulosTunniste":null,"tulosTekstiFi":null,"tulosTekstiSv":null,"tulosTekstiEn":null,"tallennaTulos":false},"indeksi":3}],"valintaperusteviitteet":[],"validointivirheet":[],"onLuonnos":null,"nimi":null,"kuvaus":null,"tyyppi":null,"id":819277,"lapsityyppi":"funktiokutsu","tulosTunniste":null,"tulosTekstiFi":null,"tulosTekstiSv":null,"tulosTekstiEn":null,"tallennaTulos":false},"indeksi":3},{"lapsi":{"funktionimi":"JOS","arvokonvertteriparametrit":[],"arvovalikonvertteriparametrit":[],"syoteparametrit":[],"funktioargumentit":[{"lapsi":{"funktionimi":"HAKUTOIVE","arvokonvertteriparametrit":[],"arvovalikonvertteriparametrit":[],"syoteparametrit":[{"avain":"n","arvo":"4"}],"funktioargumentit":[],"valintaperusteviitteet":[],"validointivirheet":[],"onLuonnos":null,"nimi":null,"kuvaus":null,"tyyppi":null,"id":819281,"lapsityyppi":"funktiokutsu","tulosTunniste":null,"tulosTekstiFi":null,"tulosTekstiSv":null,"tulosTekstiEn":null,"tallennaTulos":false},"indeksi":1},{"lapsi":{"funktionimi":"LUKUARVO","arvokonvertteriparametrit":[],"arvovalikonvertteriparametrit":[],"syoteparametrit":[{"avain":"luku","arvo":"2.0"}],"funktioargumentit":[],"valintaperusteviitteet":[],"validointivirheet":[],"onLuonnos":null,"nimi":null,"kuvaus":null,"tyyppi":null,"id":819283,"lapsityyppi":"funktiokutsu","tulosTunniste":null,"tulosTekstiFi":null,"tulosTekstiSv":null,"tulosTekstiEn":null,"tallennaTulos":false},"indeksi":2},{"lapsi":{"funktionimi":"LUKUARVO","arvokonvertteriparametrit":[],"arvovalikonvertteriparametrit":[],"syoteparametrit":[{"avain":"luku","arvo":"0.0"}],"funktioargumentit":[],"valintaperusteviitteet":[],"validointivirheet":[],"onLuonnos":null,"nimi":null,"kuvaus":null,"tyyppi":null,"id":819285,"lapsityyppi":"funktiokutsu","tulosTunniste":null,"tulosTekstiFi":null,"tulosTekstiSv":null,"tulosTekstiEn":null,"tallennaTulos":false},"indeksi":3}],"valintaperusteviitteet":[],"validointivirheet":[],"onLuonnos":null,"nimi":null,"kuvaus":null,"tyyppi":null,"id":819287,"lapsityyppi":"funktiokutsu","tulosTunniste":null,"tulosTekstiFi":null,"tulosTekstiSv":null,"tulosTekstiEn":null,"tallennaTulos":false},"indeksi":4},{"lapsi":{"funktionimi":"JOS","arvokonvertteriparametrit":[],"arvovalikonvertteriparametrit":[],"syoteparametrit":[],"funktioargumentit":[{"lapsi":{"funktionimi":"HAKUTOIVE","arvokonvertteriparametrit":[],"arvovalikonvertteriparametrit":[],"syoteparametrit":[{"avain":"n","arvo":"5"}],"funktioargumentit":[],"valintaperusteviitteet":[],"validointivirheet":[],"onLuonnos":null,"nimi":null,"kuvaus":null,"tyyppi":null,"id":819291,"lapsityyppi":"funktiokutsu","tulosTunniste":null,"tulosTekstiFi":null,"tulosTekstiSv":null,"tulosTekstiEn":null,"tallennaTulos":false},"indeksi":1},{"lapsi":{"funktionimi":"LUKUARVO","arvokonvertteriparametrit":[],"arvovalikonvertteriparametrit":[],"syoteparametrit":[{"avain":"luku","arvo":"1.0"}],"funktioargumentit":[],"valintaperusteviitteet":[],"validointivirheet":[],"onLuonnos":null,"nimi":null,"kuvaus":null,"tyyppi":null,"id":819293,"lapsityyppi":"funktiokutsu","tulosTunniste":null,"tulosTekstiFi":null,"tulosTekstiSv":null,"tulosTekstiEn":null,"tallennaTulos":false},"indeksi":2},{"lapsi":{"funktionimi":"LUKUARVO","arvokonvertteriparametrit":[],"arvovalikonvertteriparametrit":[],"syoteparametrit":[{"avain":"luku","arvo":"0.0"}],"funktioargumentit":[],"valintaperusteviitteet":[],"validointivirheet":[],"onLuonnos":null,"nimi":null,"kuvaus":null,"tyyppi":null,"id":819295,"lapsityyppi":"funktiokutsu","tulosTunniste":null,"tulosTekstiFi":null,"tulosTekstiSv":null,"tulosTekstiEn":null,"tallennaTulos":false},"indeksi":3}],"valintaperusteviitteet":[],"validointivirheet":[],"onLuonnos":null,"nimi":null,"kuvaus":null,"tyyppi":null,"id":819297,"lapsityyppi":"funktiokutsu","tulosTunniste":null,"tulosTekstiFi":null,"tulosTekstiSv":null,"tulosTekstiEn":null,"tallennaTulos":false},"indeksi":5}],"valintaperusteviitteet":[],"validointivirheet":[],"onLuonnos":null,"nimi":null,"kuvaus":null,"tyyppi":null,"id":819301,"lapsityyppi":"funktiokutsu","tulosTunniste":null,"tulosTekstiFi":null,"tulosTekstiSv":null,"tulosTekstiEn":null,"tallennaTulos":false},"indeksi":1}
    var funktiokutsuHylkaaarvovalilla = {"lapsi":{"funktionimi":"HYLKAAARVOVALILLA","arvokonvertteriparametrit":[],"arvovalikonvertteriparametrit":[],"syoteparametrit":[{"avain":"arvovaliMin","arvo":"{{hakukohde.paasykoe_ja_lisanaytto_hylkays_min}}"},{"avain":"arvovaliMax","arvo":"{{hakukohde.paasykoe_ja_lisanaytto_hylkays_max}}"},{"avain":"hylkaysperustekuvaus_FI","arvo":"Pääsykokeen ja lisänäytön summa ei ole tarpeeksi suuri"}],"funktioargumentit":[{"lapsi":{"funktionimi":"SUMMA","arvokonvertteriparametrit":[],"arvovalikonvertteriparametrit":[],"syoteparametrit":[],"funktioargumentit":[{"lapsi":{"funktionimi":null,"arvokonvertteriparametrit":[],"arvovalikonvertteriparametrit":[],"syoteparametrit":[],"funktioargumentit":[],"valintaperusteviitteet":[],"validointivirheet":[],"onLuonnos":false,"nimi":"Lukion valintaperusteet, pääsykoe","kuvaus":"Lukion valintaperusteet, pääsykoe","tyyppi":"LUKUARVOFUNKTIO","id":4273,"lapsityyppi":"laskentakaava","tulosTunniste":null,"tulosTekstiFi":null,"tulosTekstiSv":null,"tulosTekstiEn":null,"tallennaTulos":null},"indeksi":1},{"lapsi":{"funktionimi":null,"arvokonvertteriparametrit":[],"arvovalikonvertteriparametrit":[],"syoteparametrit":[],"funktioargumentit":[],"valintaperusteviitteet":[],"validointivirheet":[],"onLuonnos":false,"nimi":"Lukion valintaperusteet, lisänäyttö","kuvaus":"Lukion valintaperusteet, lisänäyttö","tyyppi":"LUKUARVOFUNKTIO","id":4285,"lapsityyppi":"laskentakaava","tulosTunniste":null,"tulosTekstiFi":null,"tulosTekstiSv":null,"tulosTekstiEn":null,"tallennaTulos":null},"indeksi":2}],"valintaperusteviitteet":[],"validointivirheet":[],"onLuonnos":null,"nimi":null,"kuvaus":null,"tyyppi":null,"id":819310,"lapsityyppi":"funktiokutsu","tulosTunniste":null,"tulosTekstiFi":null,"tulosTekstiSv":null,"tulosTekstiEn":null,"tallennaTulos":false},"indeksi":1}],"valintaperusteviitteet":[],"validointivirheet":[],"onLuonnos":null,"nimi":null,"kuvaus":null,"tyyppi":null,"id":819313,"lapsityyppi":"funktiokutsu","tulosTunniste":null,"tulosTekstiFi":null,"tulosTekstiSv":null,"tulosTekstiEn":null,"tallennaTulos":false},"indeksi":1}

    beforeEach(module('LaskentakaavaEditor'));
    beforeEach(inject(function(FunktioService) {
        funktioservice = FunktioService;
        funktioservice.funktiokuvaukset = funktiokuvaukset;
    }))

    //getFunktiokuvaukset
    describe('getFunktiokuvaukset()', function() {
        it('should return funktiokuvaukset', function() {
            expect(funktioservice.getFunktiokuvaukset()).toEqual(funktiokuvaukset);
        });
    });


    //getFunktiokuvaus
    describe('getFunktiokuvaus(', function() {

        describe("'PIENEMPITAIYHTASUURI' )", function() {
            var funktiokutsu;
            beforeEach(function() {
                funktiokutsu = funktioservice.getFunktiokuvaus('PIENEMPITAIYHTASUURI');
            });

            it('should return correct funktiokuvaus', function() {
                expect(funktiokutsu.nimi).toBe('PIENEMPITAIYHTASUURI');
            });

            it("should be of type lukuarvofunktio", function () {
                expect(funktiokutsu.tyyppi).toBe('TOTUUSARVOFUNKTIO');
            });

            it('should have funktioargumentit-array with length 2', function() {
                expect(funktiokutsu.funktioargumentit.length).toBe(2);
            });

        })

        describe("'LUKUARVO' )", function () {
            var funktiokutsu;

            beforeEach(function() {
                funktiokutsu = funktioservice.getFunktiokuvaus('LUKUARVO');
            });

            it("should return correct funktiokuvaus ", function () {
               expect(funktiokutsu.nimi).toBe('LUKUARVO');
            });

            it("should be of type lukuarvofunktio", function () {
                expect(funktiokutsu.tyyppi).toBe('LUKUARVOFUNKTIO');
            });

            it("should be of type lukuarvofunktio", function () {
                expect(funktiokutsu.tyyppi).toBe('LUKUARVOFUNKTIO');
            });

            it("should be of type lukuarvofunktio", function () {
                expect(funktiokutsu.syoteparametrit.length).toBe(1);
            });

        });

        describe("'noFunktiokutsuWithThisName' )", function () {
            it('should return undefined if not found', function() {
                expect(funktioservice.getFunktiokuvaus('noFunktiokutsuWithThisName')).toEqual(undefined);
            });
        });
    });

    //isNimettyFunktioargumentti()
    describe("isNimettyFunktioargumentti(parent)", function () {

        it('should return false for keskiarvo-funktiokutsu', function() {
            expect(funktioservice.isNimettyFunktioargumentti(funktiokutsuKeskiarvo)).toBe(false);
        });

        it('should return true for jos-funktiokutsu', function() {
            expect(funktioservice.isNimettyFunktioargumentti(funktiokutsuJos)).toBe(true);
        });

        it('should return false for summa-funktiokutsu', function() {
            expect(funktioservice.isNimettyFunktioargumentti(funktiokutsuSumma)).toBe(false);
        });

        it('should return true for hylkaaarvovalilla-funktiokutsu', function() {
            expect(funktioservice.isNimettyFunktioargumentti(funktiokutsuHylkaaarvovalilla)).toBe(true);
        });

    });

    //isNimettyFunktioargumenttiByFunktionimi
    describe("isNimettyFunktioargumenttiByFunktionimi(name)", function () {

        it('should return false for KESKIARVO-funktiokutsu', function() {
            expect(funktioservice.isNimettyFunktioargumenttiByFunktionimi('KESKIARVO')).toBe(false);
        });

        it('should return true for JOS-funktiokutsu', function() {
            expect(funktioservice.isNimettyFunktioargumenttiByFunktionimi('JOS')).toBe(true);
        });

        it('should return false for SUMMA-funktiokutsu', function() {
            expect(funktioservice.isNimettyFunktioargumenttiByFunktionimi('SUMMA')).toBe(false);
        });

        it('should return true for HYLKAAARVOVALILLA-funktiokutsu', function() {
            expect(funktioservice.isNimettyFunktioargumenttiByFunktionimi('HYLKAAARVOVALILLA')).toBe(true);
        });

        it('should return false for PAINOTETTUKESKIARVO-funktiokutsu', function() {
            expect(funktioservice.isNimettyFunktioargumenttiByFunktionimi('PAINOTETTUKESKIARVO')).toBe(false);
        });

        it('should return false for HAELUKUARVO-funktiokutsu', function() {
            expect(funktioservice.isNimettyFunktioargumenttiByFunktionimi('HAELUKUARVO')).toBe(false);
        });

        it('should return true for NEGAATIO-funktiokutsu', function() {
            expect(funktioservice.isNimettyFunktioargumenttiByFunktionimi('NEGAATIO')).toBe(true);
        });

        it('should return false for HAEYOARVOSANA-funktiokutsu', function() {
            expect(funktioservice.isNimettyFunktioargumenttiByFunktionimi('HAEYOARVOSANA')).toBe(false);
        });

    });

    //isPainotettukeskiarvoChild
    describe("isNimettyFunktioargumenttiByFunktionimi(name)", function () {
/*
        it('should return false for a KESKIARVO-funktiokutsu', function() {
            expect(funktioservice.isPainotettukeskiarvoChild(funktiokutsuKeskiarvo)).toBe(false);
        });

        it('should return false for a JOS-funktiokutsu', function() {
            expect(funktioservice.isPainotettukeskiarvoChild(funktiokutsuJos)).toBe(false);
        });

        it('should return false for undefined parameter', function() {
            expect(funktioservice.isPainotettukeskiarvoChild()).toBe(false);
        });
*/


    });
});
