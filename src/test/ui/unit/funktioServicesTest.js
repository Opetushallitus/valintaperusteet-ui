"use strict";

describe("FunktioService", function () {
    var funktioservice;

    var funktiokuvaukset = [{"nimi":"HYLKAAARVOVALILLA","tyyppi":"LUKUARVOFUNKTIO","funktioargumentit":[{"nimi":"f","tyyppi":"LUKUARVOFUNKTIO","kardinaliteetti":"1"}],"syoteparametrit":[{"avain":"hylkaysperustekuvaus_FI","tyyppi":"MERKKIJONO","pakollinen":false,"arvojoukko":{},"kuvaus":""},{"avain":"hylkaysperustekuvaus_SV","tyyppi":"MERKKIJONO","pakollinen":false,"arvojoukko":{},"kuvaus":""},{"avain":"hylkaysperustekuvaus_EN","tyyppi":"MERKKIJONO","pakollinen":false,"arvojoukko":{},"kuvaus":""},{"avain":"arvovaliMin","tyyppi":"MERKKIJONO","pakollinen":true,"arvojoukko":{},"kuvaus":""},{"avain":"arvovaliMax","tyyppi":"MERKKIJONO","pakollinen":true,"arvojoukko":{},"kuvaus":""}]},{"nimi":"SKAALAUS","tyyppi":"LUKUARVOFUNKTIO","funktioargumentit":[{"nimi":"f","tyyppi":"LUKUARVOFUNKTIO","kardinaliteetti":"1"}],"syoteparametrit":[{"avain":"kohdeskaalaMin","tyyppi":"DESIMAALILUKU","pakollinen":true,"arvojoukko":{},"kuvaus":""},{"avain":"kohdeskaalaMax","tyyppi":"DESIMAALILUKU","pakollinen":true,"arvojoukko":{},"kuvaus":""},{"avain":"lahdeskaalaMin","tyyppi":"DESIMAALILUKU","pakollinen":false,"arvojoukko":{},"kuvaus":""},{"avain":"lahdeskaalaMax","tyyppi":"DESIMAALILUKU","pakollinen":false,"arvojoukko":{},"kuvaus":""},{"avain":"kaytaLaskennallistaLahdeskaalaa","tyyppi":"TOTUUSARVO","pakollinen":true,"arvojoukko":{},"kuvaus":""}]},{"nimi":"NIMETTYTOTUUSARVO","tyyppi":"TOTUUSARVOFUNKTIO","funktioargumentit":[{"nimi":"f","tyyppi":"TOTUUSARVOFUNKTIO","kardinaliteetti":"1"}],"syoteparametrit":[{"avain":"nimi","tyyppi":"MERKKIJONO","pakollinen":true,"arvojoukko":{},"kuvaus":""}]},{"nimi":"PIENEMPITAIYHTASUURI","tyyppi":"TOTUUSARVOFUNKTIO","funktioargumentit":[{"nimi":"vasenOperandi","tyyppi":"LUKUARVOFUNKTIO","kardinaliteetti":"1"},{"nimi":"oikeaOperandi","tyyppi":"LUKUARVOFUNKTIO","kardinaliteetti":"1"}]},{"nimi":"NEGAATIO","tyyppi":"LUKUARVOFUNKTIO","funktioargumentit":[{"nimi":"f","tyyppi":"LUKUARVOFUNKTIO","kardinaliteetti":"1"}]},{"nimi":"DEMOGRAFIA","tyyppi":"TOTUUSARVOFUNKTIO","syoteparametrit":[{"avain":"tunniste","tyyppi":"MERKKIJONO","pakollinen":true,"arvojoukko":{},"kuvaus":""},{"avain":"prosenttiosuus","tyyppi":"DESIMAALILUKU","pakollinen":true,"arvojoukko":{},"kuvaus":""}]},{"nimi":"PIENEMPI","tyyppi":"TOTUUSARVOFUNKTIO","funktioargumentit":[{"nimi":"vasenOperandi","tyyppi":"LUKUARVOFUNKTIO","kardinaliteetti":"1"},{"nimi":"oikeaOperandi","tyyppi":"LUKUARVOFUNKTIO","kardinaliteetti":"1"}]},{"nimi":"KESKIARVO","tyyppi":"LUKUARVOFUNKTIO","funktioargumentit":[{"nimi":"args","tyyppi":"LUKUARVOFUNKTIO","kardinaliteetti":"n"}]},{"nimi":"LUKUARVO","tyyppi":"LUKUARVOFUNKTIO","syoteparametrit":[{"avain":"luku","tyyppi":"DESIMAALILUKU","pakollinen":true,"arvojoukko":{},"kuvaus":""}]},{"nimi":"TULO","tyyppi":"LUKUARVOFUNKTIO","funktioargumentit":[{"nimi":"args","tyyppi":"LUKUARVOFUNKTIO","kardinaliteetti":"n"}]},{"nimi":"JOS","tyyppi":"LUKUARVOFUNKTIO","funktioargumentit":[{"nimi":"ehto","tyyppi":"TOTUUSARVOFUNKTIO","kardinaliteetti":"1"},{"nimi":"sitten","tyyppi":"LUKUARVOFUNKTIO","kardinaliteetti":"1"},{"nimi":"muuten","tyyppi":"LUKUARVOFUNKTIO","kardinaliteetti":"1"}]},{"nimi":"MEDIAANI","tyyppi":"LUKUARVOFUNKTIO","funktioargumentit":[{"nimi":"args","tyyppi":"LUKUARVOFUNKTIO","kardinaliteetti":"n"}]},{"nimi":"HAEMERKKIJONOJAKONVERTOITOTUUSARVOKSI","tyyppi":"TOTUUSARVOFUNKTIO","syoteparametrit":[{"avain":"oletusarvo","tyyppi":"TOTUUSARVO","pakollinen":false,"arvojoukko":{},"kuvaus":""}],"valintaperusteviitteet":[{"nimi":"tunniste","tyyppi":"MERKKIJONO","arvojoukko":{},"kuvaus":""}],"konvertteri":{"pakollinen":true,"konvertteriTyypit":[{"tyyppi":"ARVOKONVERTTERI","arvotyyppi":"MERKKIJONO"}]}},{"nimi":"HAELUKUARVOEHDOLLA","tyyppi":"LUKUARVOFUNKTIO","syoteparametrit":[{"avain":"oletusarvo","tyyppi":"DESIMAALILUKU","pakollinen":false,"arvojoukko":{},"kuvaus":""}],"valintaperusteviitteet":[{"nimi":"tunniste","tyyppi":"DESIMAALILUKU","arvojoukko":{},"kuvaus":""},{"nimi":"ehto","tyyppi":"MERKKIJONO","arvojoukko":{},"kuvaus":""}],"konvertteri":{"pakollinen":false,"konvertteriTyypit":[{"tyyppi":"ARVOKONVERTTERI","arvotyyppi":"DESIMAALILUKU"},{"tyyppi":"ARVOVALIKONVERTTERI"}]}},{"nimi":"HAELUKUARVO","tyyppi":"LUKUARVOFUNKTIO","syoteparametrit":[{"avain":"oletusarvo","tyyppi":"DESIMAALILUKU","pakollinen":false,"arvojoukko":{},"kuvaus":""}],"valintaperusteviitteet":[{"nimi":"tunniste","tyyppi":"DESIMAALILUKU","arvojoukko":{},"kuvaus":""}],"konvertteri":{"pakollinen":false,"konvertteriTyypit":[{"tyyppi":"ARVOKONVERTTERI","arvotyyppi":"DESIMAALILUKU"},{"tyyppi":"ARVOVALIKONVERTTERI"}]}},{"nimi":"OSAMAARA","tyyppi":"LUKUARVOFUNKTIO","funktioargumentit":[{"nimi":"osoittaja","tyyppi":"LUKUARVOFUNKTIO","kardinaliteetti":"1"},{"nimi":"nimittaja","tyyppi":"LUKUARVOFUNKTIO","kardinaliteetti":"1"}]},{"nimi":"JA","tyyppi":"TOTUUSARVOFUNKTIO","funktioargumentit":[{"nimi":"args","tyyppi":"TOTUUSARVOFUNKTIO","kardinaliteetti":"n"}]},{"nimi":"NMINIMI","tyyppi":"LUKUARVOFUNKTIO","funktioargumentit":[{"nimi":"args","tyyppi":"LUKUARVOFUNKTIO","kardinaliteetti":"n"}],"syoteparametrit":[{"avain":"n","tyyppi":"KOKONAISLUKU","pakollinen":true,"arvojoukko":{},"kuvaus":""}]},{"nimi":"VALINTAPERUSTEYHTASUURUUS","tyyppi":"TOTUUSARVOFUNKTIO","valintaperusteviitteet":[{"nimi":"tunniste1","tyyppi":"MERKKIJONO","arvojoukko":{},"kuvaus":""},{"nimi":"tunniste2","tyyppi":"MERKKIJONO","arvojoukko":{},"kuvaus":""}]},{"nimi":"SUMMA","tyyppi":"LUKUARVOFUNKTIO","funktioargumentit":[{"nimi":"args","tyyppi":"LUKUARVOFUNKTIO","kardinaliteetti":"n"}]},{"nimi":"SUUREMPI","tyyppi":"TOTUUSARVOFUNKTIO","funktioargumentit":[{"nimi":"vasenOperandi","tyyppi":"LUKUARVOFUNKTIO","kardinaliteetti":"1"},{"nimi":"oikeaOperandi","tyyppi":"LUKUARVOFUNKTIO","kardinaliteetti":"1"}]},{"nimi":"HYLKAA","tyyppi":"LUKUARVOFUNKTIO","funktioargumentit":[{"nimi":"f","tyyppi":"TOTUUSARVOFUNKTIO","kardinaliteetti":"1"}],"syoteparametrit":[{"avain":"hylkaysperustekuvaus_FI","tyyppi":"MERKKIJONO","pakollinen":false,"arvojoukko":{},"kuvaus":""},{"avain":"hylkaysperustekuvaus_SV","tyyppi":"MERKKIJONO","pakollinen":false,"arvojoukko":{},"kuvaus":""},{"avain":"hylkaysperustekuvaus_EN","tyyppi":"MERKKIJONO","pakollinen":false,"arvojoukko":{},"kuvaus":""}]},{"nimi":"HAETOTUUSARVO","tyyppi":"TOTUUSARVOFUNKTIO","syoteparametrit":[{"avain":"oletusarvo","tyyppi":"TOTUUSARVO","pakollinen":false,"arvojoukko":{},"kuvaus":""}],"valintaperusteviitteet":[{"nimi":"tunniste","tyyppi":"TOTUUSARVO","arvojoukko":{},"kuvaus":""}],"konvertteri":{"pakollinen":false,"konvertteriTyypit":[{"tyyppi":"ARVOKONVERTTERI","arvotyyppi":"TOTUUSARVO"}]}},{"nimi":"TOTUUSARVO","tyyppi":"TOTUUSARVOFUNKTIO","syoteparametrit":[{"avain":"totuusarvo","tyyppi":"TOTUUSARVO","pakollinen":true,"arvojoukko":{},"kuvaus":""}]},{"nimi":"HAEYOARVOSANA","tyyppi":"LUKUARVOFUNKTIO","syoteparametrit":[{"avain":"alkuvuosi","tyyppi":"KOKONAISLUKU","pakollinen":false,"arvojoukko":{},"kuvaus":"Alkaen (vuosi)"},{"avain":"alkulukukausi","tyyppi":"ARVOJOUKKO","pakollinen":false,"arvojoukko":{"1":"Syksy","2":"Kevät"},"kuvaus":"Alkaen (lukukausi)"},{"avain":"loppuvuosi","tyyppi":"KOKONAISLUKU","pakollinen":false,"arvojoukko":{},"kuvaus":"Päättyen (vuosi)"},{"avain":"loppulukukausi","tyyppi":"ARVOJOUKKO","pakollinen":false,"arvojoukko":{"1":"Syksy","2":"Kevät"},"kuvaus":"Päättyen (lukukausi)"},{"avain":"I","tyyppi":"DESIMAALILUKU","pakollinen":false,"arvojoukko":{},"kuvaus":"Arvosana I"},{"avain":"A","tyyppi":"DESIMAALILUKU","pakollinen":false,"arvojoukko":{},"kuvaus":"Arvosana A"},{"avain":"B","tyyppi":"DESIMAALILUKU","pakollinen":false,"arvojoukko":{},"kuvaus":"Arvosana B"},{"avain":"C","tyyppi":"DESIMAALILUKU","pakollinen":false,"arvojoukko":{},"kuvaus":"Arvosana C"},{"avain":"M","tyyppi":"DESIMAALILUKU","pakollinen":false,"arvojoukko":{},"kuvaus":"Arvosana M"},{"avain":"E","tyyppi":"DESIMAALILUKU","pakollinen":false,"arvojoukko":{},"kuvaus":"Arvosana E"},{"avain":"L","tyyppi":"DESIMAALILUKU","pakollinen":false,"arvojoukko":{},"kuvaus":"Arvosana L"}],"valintaperusteviitteet":[{"nimi":"oppiaine","tyyppi":"ARVOJOUKKO","arvojoukko":{"S9":"Saksalaisen koulun saksan kielen koe","TC":"Italia, lyhyt oppimäärä","REAALI":"Reaali","L1":"Latina, lyhyt oppimäärä","PITKA_KIELI":"Kieli, pitkä oppimäärä","N":"Matematiikan koe, lyhyt oppimäärä","FC":"Ranska, lyhyt oppimäärä","FY":"Fysiikka","FB":"Ranska, keskipitkä oppimäärä","SB":"Saksa, keskipitkä oppimäärä","KC":"Kreikka, lyhyt oppimäärä","J":"Englanninkielinen kypsyyskoe","EB":"Englanti, keskipitkä oppimäärä","EA":"Englanti, pitkä oppimäärä","RO":"Reaali, ortod.uskonnon kysymykset","TE":"Terveystieto","VC":"Venäjä, lyhyt oppimäärä","A":"Äidinkielen koe, suomi","TB":"Italia, keskipitkä oppimäärä","A5":"Suomi toisena kielenä","PC":"Espanja, lyhyt oppimäärä","BB":"Ruotsi, keskipitkä oppimäärä","RY":"Reaali, elämänkatsomustiedon kysymykset","SA":"Saksa, pitkä oppimäärä","GC":"Portugali, lyhyt oppimäärä","M":"Matematiikan koe, pitkä oppimäärä","FF":"Filosofia","I":"Äidinkielen koe, inarinsaame","PB":"Espanja, keskipitkä oppimäärä","FA":"Ranska, pitkä oppimäärä","CC":"Suomi, lyhyt oppimäärä","KESKIPITKA_KIELI":"Kieli, keskipitkä oppimäärä","BI":"Biologia","RR":"Reaali, ev lut uskonnon kysymykset","TA":"Italia, pitkä oppimäärä","BA":"Ruotsi, pitkä oppimäärä","GB":"Portugali, keskipitkä oppimäärä","QC":"Koltan saame, lyhyt oppimäärä","HB":"Unkari, keskipitkä oppimäärä","CB":"Suomi, keskipitkä oppimäärä","VB":"Venäjä, keskipitkä oppimäärä","DC":"Pohjoissaame, lyhyt oppimäärä","YH":"Yhteiskuntaoppi","PA":"Espanja, pitkä oppimäärä","L7":"Latina, laajempi oppimäärä","GA":"Portugali, pitkä oppimäärä","W":"Äidinkielen koe, koltansaame","HI":"Historia","KE":"Kemia","IC":"Inarinsaame, lyhyt oppimäärä","CA":"Suomi, pitkä oppimäärä","O":"Äidinkielen koe, ruotsi","UE":"Ev.lut. Uskonto","UO":"Ortodoksiuskonto","ET":"Elämänkatsomustieto","O5":"Ruotsi toisena kielenä","VA":"Venäjä, pitkä oppimäärä","GE":"Maantiede","Z":"Äidinkielen koe, pohjoissaame","LYHYT_KIELI":"Kieli, lyhyt oppimäärä","SC":"Saksa, lyhyt oppimäärä","PS":"Psykologia","EC":"Englanti, lyhyt oppimäärä","HA":"Unkari, pitkä oppimäärä"},"kuvaus":"Oppiaine"}]},{"nimi":"EI","tyyppi":"TOTUUSARVOFUNKTIO","funktioargumentit":[{"nimi":"f","tyyppi":"TOTUUSARVOFUNKTIO","kardinaliteetti":"1"}]},{"nimi":"SUUREMPITAIYHTASUURI","tyyppi":"TOTUUSARVOFUNKTIO","funktioargumentit":[{"nimi":"vasenOperandi","tyyppi":"LUKUARVOFUNKTIO","kardinaliteetti":"1"},{"nimi":"oikeaOperandi","tyyppi":"LUKUARVOFUNKTIO","kardinaliteetti":"1"}]},{"nimi":"HAEMERKKIJONOJAVERTAAYHTASUURUUS","tyyppi":"TOTUUSARVOFUNKTIO","syoteparametrit":[{"avain":"oletusarvo","tyyppi":"TOTUUSARVO","pakollinen":false,"arvojoukko":{},"kuvaus":""},{"avain":"vertailtava","tyyppi":"MERKKIJONO","pakollinen":true,"arvojoukko":{},"kuvaus":""}],"valintaperusteviitteet":[{"nimi":"tunniste","tyyppi":"MERKKIJONO","arvojoukko":{},"kuvaus":""}]},{"nimi":"KONVERTOILUKUARVO","tyyppi":"LUKUARVOFUNKTIO","funktioargumentit":[{"nimi":"f","tyyppi":"LUKUARVOFUNKTIO","kardinaliteetti":"1"}],"konvertteri":{"pakollinen":true,"konvertteriTyypit":[{"tyyppi":"ARVOKONVERTTERI","arvotyyppi":"DESIMAALILUKU"},{"tyyppi":"ARVOVALIKONVERTTERI"}]}},{"nimi":"KESKIARVONPARASTA","tyyppi":"LUKUARVOFUNKTIO","funktioargumentit":[{"nimi":"args","tyyppi":"LUKUARVOFUNKTIO","kardinaliteetti":"n"}],"syoteparametrit":[{"avain":"n","tyyppi":"KOKONAISLUKU","pakollinen":true,"arvojoukko":{},"kuvaus":""}]},{"nimi":"HAKUTOIVE","tyyppi":"TOTUUSARVOFUNKTIO","syoteparametrit":[{"avain":"n","tyyppi":"KOKONAISLUKU","pakollinen":true,"arvojoukko":{},"kuvaus":""}]},{"nimi":"MINIMI","tyyppi":"LUKUARVOFUNKTIO","funktioargumentit":[{"nimi":"args","tyyppi":"LUKUARVOFUNKTIO","kardinaliteetti":"n"}]},{"nimi":"NMAKSIMI","tyyppi":"LUKUARVOFUNKTIO","funktioargumentit":[{"nimi":"args","tyyppi":"LUKUARVOFUNKTIO","kardinaliteetti":"n"}],"syoteparametrit":[{"avain":"n","tyyppi":"KOKONAISLUKU","pakollinen":true,"arvojoukko":{},"kuvaus":""}]},{"nimi":"PYORISTYS","tyyppi":"LUKUARVOFUNKTIO","funktioargumentit":[{"nimi":"f","tyyppi":"LUKUARVOFUNKTIO","kardinaliteetti":"1"}],"syoteparametrit":[{"avain":"tarkkuus","tyyppi":"KOKONAISLUKU","pakollinen":true,"arvojoukko":{},"kuvaus":""}]},{"nimi":"TAI","tyyppi":"TOTUUSARVOFUNKTIO","funktioargumentit":[{"nimi":"args","tyyppi":"TOTUUSARVOFUNKTIO","kardinaliteetti":"n"}]},{"nimi":"NIMETTYLUKUARVO","tyyppi":"LUKUARVOFUNKTIO","funktioargumentit":[{"nimi":"f","tyyppi":"LUKUARVOFUNKTIO","kardinaliteetti":"1"}],"syoteparametrit":[{"avain":"nimi","tyyppi":"MERKKIJONO","pakollinen":true,"arvojoukko":{},"kuvaus":""}]},{"nimi":"YHTASUURI","tyyppi":"TOTUUSARVOFUNKTIO","funktioargumentit":[{"nimi":"vasenOperandi","tyyppi":"LUKUARVOFUNKTIO","kardinaliteetti":"1"},{"nimi":"oikeaOperandi","tyyppi":"LUKUARVOFUNKTIO","kardinaliteetti":"1"}]},{"nimi":"MAKSIMI","tyyppi":"LUKUARVOFUNKTIO","funktioargumentit":[{"nimi":"args","tyyppi":"LUKUARVOFUNKTIO","kardinaliteetti":"n"}]},{"nimi":"PAINOTETTUKESKIARVO","tyyppi":"LUKUARVOFUNKTIO","funktioargumentit":[{"nimi":"args","tyyppi":"LUKUARVOFUNKTIO","kardinaliteetti":"lista_pareja"}]},{"nimi":"HAEMERKKIJONOJAKONVERTOILUKUARVOKSI","tyyppi":"LUKUARVOFUNKTIO","syoteparametrit":[{"avain":"oletusarvo","tyyppi":"DESIMAALILUKU","pakollinen":false,"arvojoukko":{},"kuvaus":""}],"valintaperusteviitteet":[{"nimi":"tunniste","tyyppi":"MERKKIJONO","arvojoukko":{},"kuvaus":""}],"konvertteri":{"pakollinen":true,"konvertteriTyypit":[{"tyyppi":"ARVOKONVERTTERI","arvotyyppi":"MERKKIJONO"}]}},{"nimi":"SUMMANPARASTA","tyyppi":"LUKUARVOFUNKTIO","funktioargumentit":[{"nimi":"args","tyyppi":"LUKUARVOFUNKTIO","kardinaliteetti":"n"}],"syoteparametrit":[{"avain":"n","tyyppi":"KOKONAISLUKU","pakollinen":true,"arvojoukko":{},"kuvaus":""}]}];
    var funktiokutsuKeskiarvo = {"lapsi":{"funktionimi":"KESKIARVO","arvokonvertteriparametrit":[],"arvovalikonvertteriparametrit":[],"syoteparametrit":[],"funktioargumentit":[{"lapsi":{"funktionimi":"HAELUKUARVO","arvokonvertteriparametrit":[],"arvovalikonvertteriparametrit":[],"syoteparametrit":[],"funktioargumentit":[],"valintaperusteviitteet":[{"tunniste":"PK_A1","kuvaus":"","lahde":"HAETTAVA_ARVO","onPakollinen":false,"epasuoraViittaus":false,"indeksi":2}],"validointivirheet":[],"onLuonnos":null,"nimi":null,"kuvaus":null,"tyyppi":null,"id":819222,"lapsityyppi":"funktiokutsu","tulosTunniste":null,"tulosTekstiFi":null,"tulosTekstiSv":null,"tulosTekstiEn":null,"tallennaTulos":false},"indeksi":1},{"lapsi":{"funktionimi":"KESKIARVO","arvokonvertteriparametrit":[],"arvovalikonvertteriparametrit":[],"syoteparametrit":[],"funktioargumentit":[{"lapsi":{"funktionimi":"HAELUKUARVO","arvokonvertteriparametrit":[],"arvovalikonvertteriparametrit":[],"syoteparametrit":[],"funktioargumentit":[],"valintaperusteviitteet":[{"tunniste":"PK_A1_VAL1","kuvaus":"","lahde":"HAETTAVA_ARVO","onPakollinen":false,"epasuoraViittaus":false,"indeksi":2}],"validointivirheet":[],"onLuonnos":null,"nimi":null,"kuvaus":null,"tyyppi":null,"id":819224,"lapsityyppi":"funktiokutsu","tulosTunniste":null,"tulosTekstiFi":null,"tulosTekstiSv":null,"tulosTekstiEn":null,"tallennaTulos":false},"indeksi":1},{"lapsi":{"funktionimi":"HAELUKUARVO","arvokonvertteriparametrit":[],"arvovalikonvertteriparametrit":[],"syoteparametrit":[],"funktioargumentit":[],"valintaperusteviitteet":[{"tunniste":"PK_A1_VAL2","kuvaus":"","lahde":"HAETTAVA_ARVO","onPakollinen":false,"epasuoraViittaus":false,"indeksi":2}],"validointivirheet":[],"onLuonnos":null,"nimi":null,"kuvaus":null,"tyyppi":null,"id":819226,"lapsityyppi":"funktiokutsu","tulosTunniste":null,"tulosTekstiFi":null,"tulosTekstiSv":null,"tulosTekstiEn":null,"tallennaTulos":false},"indeksi":2}],"valintaperusteviitteet":[],"validointivirheet":[],"onLuonnos":null,"nimi":null,"kuvaus":null,"tyyppi":null,"id":819228,"lapsityyppi":"funktiokutsu","tulosTunniste":null,"tulosTekstiFi":null,"tulosTekstiSv":null,"tulosTekstiEn":null,"tallennaTulos":false},"indeksi":2}],"valintaperusteviitteet":[],"validointivirheet":[],"onLuonnos":null,"nimi":null,"kuvaus":null,"tyyppi":null,"id":819231,"lapsityyppi":"funktiokutsu","tulosTunniste":null,"tulosTekstiFi":null,"tulosTekstiSv":null,"tulosTekstiEn":null,"tallennaTulos":false},"indeksi":1};
    //JOS funktiokutsun sitten-arvo on tyhjä objekti
    var funktiokutsuJos = {"lapsi":{"funktionimi":"JOS","arvokonvertteriparametrit":[],"arvovalikonvertteriparametrit":[],"syoteparametrit":[],"funktioargumentit":[{"lapsi":{"funktionimi":"DEMOGRAFIA","arvokonvertteriparametrit":[],"arvovalikonvertteriparametrit":[],"syoteparametrit":[{"avain":"prosenttiosuus","arvo":"30.0"},{"avain":"tunniste","arvo":"SUKUPUOLI"}],"funktioargumentit":[],"valintaperusteviitteet":[],"validointivirheet":[],"onLuonnos":null,"nimi":null,"kuvaus":null,"tyyppi":null,"id":819237,"lapsityyppi":"funktiokutsu","tulosTunniste":null,"tulosTekstiFi":null,"tulosTekstiSv":null,"tulosTekstiEn":null,"tallennaTulos":false},"indeksi":1},{"lapsi":{"funktionimi":"LUKUARVO","arvokonvertteriparametrit":[],"arvovalikonvertteriparametrit":[],"syoteparametrit":[{"avain":"luku","arvo":"2.0"}],"funktioargumentit":[],"valintaperusteviitteet":[],"validointivirheet":[],"onLuonnos":null,"nimi":null,"kuvaus":null,"tyyppi":null,"id":819240,"lapsityyppi":"funktiokutsu","tulosTunniste":null,"tulosTekstiFi":null,"tulosTekstiSv":null,"tulosTekstiEn":null,"tallennaTulos":false},"indeksi":2},{}],"valintaperusteviitteet":[],"validointivirheet":[],"onLuonnos":null,"nimi":null,"kuvaus":null,"tyyppi":null,"id":819244,"lapsityyppi":"funktiokutsu","tulosTunniste":null,"tulosTekstiFi":null,"tulosTekstiSv":null,"tulosTekstiEn":null,"tallennaTulos":false},"indeksi":1};
    var funktiokutsuSumma = {"lapsi":{"funktionimi":"SUMMA","arvokonvertteriparametrit":[],"arvovalikonvertteriparametrit":[],"syoteparametrit":[],"funktioargumentit":[{"lapsi":{"funktionimi":"JOS","arvokonvertteriparametrit":[],"arvovalikonvertteriparametrit":[],"syoteparametrit":[],"funktioargumentit":[{"lapsi":{"funktionimi":"HAKUTOIVE","arvokonvertteriparametrit":[],"arvovalikonvertteriparametrit":[],"syoteparametrit":[{"avain":"n","arvo":"1"}],"funktioargumentit":[],"valintaperusteviitteet":[],"validointivirheet":[],"onLuonnos":null,"nimi":null,"kuvaus":null,"tyyppi":null,"id":819251,"lapsityyppi":"funktiokutsu","tulosTunniste":null,"tulosTekstiFi":null,"tulosTekstiSv":null,"tulosTekstiEn":null,"tallennaTulos":false},"indeksi":1},{"lapsi":{"funktionimi":"LUKUARVO","arvokonvertteriparametrit":[],"arvovalikonvertteriparametrit":[],"syoteparametrit":[{"avain":"luku","arvo":"5.0"}],"funktioargumentit":[],"valintaperusteviitteet":[],"validointivirheet":[],"onLuonnos":null,"nimi":null,"kuvaus":null,"tyyppi":null,"id":819253,"lapsityyppi":"funktiokutsu","tulosTunniste":null,"tulosTekstiFi":null,"tulosTekstiSv":null,"tulosTekstiEn":null,"tallennaTulos":false},"indeksi":2},{"lapsi":{"funktionimi":"LUKUARVO","arvokonvertteriparametrit":[],"arvovalikonvertteriparametrit":[],"syoteparametrit":[{"avain":"luku","arvo":"0.0"}],"funktioargumentit":[],"valintaperusteviitteet":[],"validointivirheet":[],"onLuonnos":null,"nimi":null,"kuvaus":null,"tyyppi":null,"id":819255,"lapsityyppi":"funktiokutsu","tulosTunniste":null,"tulosTekstiFi":null,"tulosTekstiSv":null,"tulosTekstiEn":null,"tallennaTulos":false},"indeksi":3}],"valintaperusteviitteet":[],"validointivirheet":[],"onLuonnos":null,"nimi":null,"kuvaus":null,"tyyppi":null,"id":819257,"lapsityyppi":"funktiokutsu","tulosTunniste":null,"tulosTekstiFi":null,"tulosTekstiSv":null,"tulosTekstiEn":null,"tallennaTulos":false},"indeksi":1},{"lapsi":{"funktionimi":"JOS","arvokonvertteriparametrit":[],"arvovalikonvertteriparametrit":[],"syoteparametrit":[],"funktioargumentit":[{"lapsi":{"funktionimi":"HAKUTOIVE","arvokonvertteriparametrit":[],"arvovalikonvertteriparametrit":[],"syoteparametrit":[{"avain":"n","arvo":"2"}],"funktioargumentit":[],"valintaperusteviitteet":[],"validointivirheet":[],"onLuonnos":null,"nimi":null,"kuvaus":null,"tyyppi":null,"id":819261,"lapsityyppi":"funktiokutsu","tulosTunniste":null,"tulosTekstiFi":null,"tulosTekstiSv":null,"tulosTekstiEn":null,"tallennaTulos":false},"indeksi":1},{"lapsi":{"funktionimi":"LUKUARVO","arvokonvertteriparametrit":[],"arvovalikonvertteriparametrit":[],"syoteparametrit":[{"avain":"luku","arvo":"4.0"}],"funktioargumentit":[],"valintaperusteviitteet":[],"validointivirheet":[],"onLuonnos":null,"nimi":null,"kuvaus":null,"tyyppi":null,"id":819263,"lapsityyppi":"funktiokutsu","tulosTunniste":null,"tulosTekstiFi":null,"tulosTekstiSv":null,"tulosTekstiEn":null,"tallennaTulos":false},"indeksi":2},{"lapsi":{"funktionimi":"LUKUARVO","arvokonvertteriparametrit":[],"arvovalikonvertteriparametrit":[],"syoteparametrit":[{"avain":"luku","arvo":"0.0"}],"funktioargumentit":[],"valintaperusteviitteet":[],"validointivirheet":[],"onLuonnos":null,"nimi":null,"kuvaus":null,"tyyppi":null,"id":819265,"lapsityyppi":"funktiokutsu","tulosTunniste":null,"tulosTekstiFi":null,"tulosTekstiSv":null,"tulosTekstiEn":null,"tallennaTulos":false},"indeksi":3}],"valintaperusteviitteet":[],"validointivirheet":[],"onLuonnos":null,"nimi":null,"kuvaus":null,"tyyppi":null,"id":819267,"lapsityyppi":"funktiokutsu","tulosTunniste":null,"tulosTekstiFi":null,"tulosTekstiSv":null,"tulosTekstiEn":null,"tallennaTulos":false},"indeksi":2},{"lapsi":{"funktionimi":"JOS","arvokonvertteriparametrit":[],"arvovalikonvertteriparametrit":[],"syoteparametrit":[],"funktioargumentit":[{"lapsi":{"funktionimi":"HAKUTOIVE","arvokonvertteriparametrit":[],"arvovalikonvertteriparametrit":[],"syoteparametrit":[{"avain":"n","arvo":"3"}],"funktioargumentit":[],"valintaperusteviitteet":[],"validointivirheet":[],"onLuonnos":null,"nimi":null,"kuvaus":null,"tyyppi":null,"id":819271,"lapsityyppi":"funktiokutsu","tulosTunniste":null,"tulosTekstiFi":null,"tulosTekstiSv":null,"tulosTekstiEn":null,"tallennaTulos":false},"indeksi":1},{"lapsi":{"funktionimi":"LUKUARVO","arvokonvertteriparametrit":[],"arvovalikonvertteriparametrit":[],"syoteparametrit":[{"avain":"luku","arvo":"3.0"}],"funktioargumentit":[],"valintaperusteviitteet":[],"validointivirheet":[],"onLuonnos":null,"nimi":null,"kuvaus":null,"tyyppi":null,"id":819273,"lapsityyppi":"funktiokutsu","tulosTunniste":null,"tulosTekstiFi":null,"tulosTekstiSv":null,"tulosTekstiEn":null,"tallennaTulos":false},"indeksi":2},{"lapsi":{"funktionimi":"LUKUARVO","arvokonvertteriparametrit":[],"arvovalikonvertteriparametrit":[],"syoteparametrit":[{"avain":"luku","arvo":"0.0"}],"funktioargumentit":[],"valintaperusteviitteet":[],"validointivirheet":[],"onLuonnos":null,"nimi":null,"kuvaus":null,"tyyppi":null,"id":819275,"lapsityyppi":"funktiokutsu","tulosTunniste":null,"tulosTekstiFi":null,"tulosTekstiSv":null,"tulosTekstiEn":null,"tallennaTulos":false},"indeksi":3}],"valintaperusteviitteet":[],"validointivirheet":[],"onLuonnos":null,"nimi":null,"kuvaus":null,"tyyppi":null,"id":819277,"lapsityyppi":"funktiokutsu","tulosTunniste":null,"tulosTekstiFi":null,"tulosTekstiSv":null,"tulosTekstiEn":null,"tallennaTulos":false},"indeksi":3},{"lapsi":{"funktionimi":"JOS","arvokonvertteriparametrit":[],"arvovalikonvertteriparametrit":[],"syoteparametrit":[],"funktioargumentit":[{"lapsi":{"funktionimi":"HAKUTOIVE","arvokonvertteriparametrit":[],"arvovalikonvertteriparametrit":[],"syoteparametrit":[{"avain":"n","arvo":"4"}],"funktioargumentit":[],"valintaperusteviitteet":[],"validointivirheet":[],"onLuonnos":null,"nimi":null,"kuvaus":null,"tyyppi":null,"id":819281,"lapsityyppi":"funktiokutsu","tulosTunniste":null,"tulosTekstiFi":null,"tulosTekstiSv":null,"tulosTekstiEn":null,"tallennaTulos":false},"indeksi":1},{"lapsi":{"funktionimi":"LUKUARVO","arvokonvertteriparametrit":[],"arvovalikonvertteriparametrit":[],"syoteparametrit":[{"avain":"luku","arvo":"2.0"}],"funktioargumentit":[],"valintaperusteviitteet":[],"validointivirheet":[],"onLuonnos":null,"nimi":null,"kuvaus":null,"tyyppi":null,"id":819283,"lapsityyppi":"funktiokutsu","tulosTunniste":null,"tulosTekstiFi":null,"tulosTekstiSv":null,"tulosTekstiEn":null,"tallennaTulos":false},"indeksi":2},{"lapsi":{"funktionimi":"LUKUARVO","arvokonvertteriparametrit":[],"arvovalikonvertteriparametrit":[],"syoteparametrit":[{"avain":"luku","arvo":"0.0"}],"funktioargumentit":[],"valintaperusteviitteet":[],"validointivirheet":[],"onLuonnos":null,"nimi":null,"kuvaus":null,"tyyppi":null,"id":819285,"lapsityyppi":"funktiokutsu","tulosTunniste":null,"tulosTekstiFi":null,"tulosTekstiSv":null,"tulosTekstiEn":null,"tallennaTulos":false},"indeksi":3}],"valintaperusteviitteet":[],"validointivirheet":[],"onLuonnos":null,"nimi":null,"kuvaus":null,"tyyppi":null,"id":819287,"lapsityyppi":"funktiokutsu","tulosTunniste":null,"tulosTekstiFi":null,"tulosTekstiSv":null,"tulosTekstiEn":null,"tallennaTulos":false},"indeksi":4},{"lapsi":{"funktionimi":"JOS","arvokonvertteriparametrit":[],"arvovalikonvertteriparametrit":[],"syoteparametrit":[],"funktioargumentit":[{"lapsi":{"funktionimi":"HAKUTOIVE","arvokonvertteriparametrit":[],"arvovalikonvertteriparametrit":[],"syoteparametrit":[{"avain":"n","arvo":"5"}],"funktioargumentit":[],"valintaperusteviitteet":[],"validointivirheet":[],"onLuonnos":null,"nimi":null,"kuvaus":null,"tyyppi":null,"id":819291,"lapsityyppi":"funktiokutsu","tulosTunniste":null,"tulosTekstiFi":null,"tulosTekstiSv":null,"tulosTekstiEn":null,"tallennaTulos":false},"indeksi":1},{"lapsi":{"funktionimi":"LUKUARVO","arvokonvertteriparametrit":[],"arvovalikonvertteriparametrit":[],"syoteparametrit":[{"avain":"luku","arvo":"1.0"}],"funktioargumentit":[],"valintaperusteviitteet":[],"validointivirheet":[],"onLuonnos":null,"nimi":null,"kuvaus":null,"tyyppi":null,"id":819293,"lapsityyppi":"funktiokutsu","tulosTunniste":null,"tulosTekstiFi":null,"tulosTekstiSv":null,"tulosTekstiEn":null,"tallennaTulos":false},"indeksi":2},{"lapsi":{"funktionimi":"LUKUARVO","arvokonvertteriparametrit":[],"arvovalikonvertteriparametrit":[],"syoteparametrit":[{"avain":"luku","arvo":"0.0"}],"funktioargumentit":[],"valintaperusteviitteet":[],"validointivirheet":[],"onLuonnos":null,"nimi":null,"kuvaus":null,"tyyppi":null,"id":819295,"lapsityyppi":"funktiokutsu","tulosTunniste":null,"tulosTekstiFi":null,"tulosTekstiSv":null,"tulosTekstiEn":null,"tallennaTulos":false},"indeksi":3}],"valintaperusteviitteet":[],"validointivirheet":[],"onLuonnos":null,"nimi":null,"kuvaus":null,"tyyppi":null,"id":819297,"lapsityyppi":"funktiokutsu","tulosTunniste":null,"tulosTekstiFi":null,"tulosTekstiSv":null,"tulosTekstiEn":null,"tallennaTulos":false},"indeksi":5}],"valintaperusteviitteet":[],"validointivirheet":[],"onLuonnos":null,"nimi":null,"kuvaus":null,"tyyppi":null,"id":819301,"lapsityyppi":"funktiokutsu","tulosTunniste":null,"tulosTekstiFi":null,"tulosTekstiSv":null,"tulosTekstiEn":null,"tallennaTulos":false},"indeksi":1};
    var funktiokutsuHylkaaarvovalilla = {"lapsi":{"funktionimi":"HYLKAAARVOVALILLA","arvokonvertteriparametrit":[],"arvovalikonvertteriparametrit":[],"syoteparametrit":[{"avain":"arvovaliMin","arvo":"{{hakukohde.paasykoe_ja_lisanaytto_hylkays_min}}"},{"avain":"arvovaliMax","arvo":"{{hakukohde.paasykoe_ja_lisanaytto_hylkays_max}}"},{"avain":"hylkaysperustekuvaus_FI","arvo":"Pääsykokeen ja lisänäytön summa ei ole tarpeeksi suuri"}],"funktioargumentit":[{"lapsi":{"funktionimi":"SUMMA","arvokonvertteriparametrit":[],"arvovalikonvertteriparametrit":[],"syoteparametrit":[],"funktioargumentit":[{"lapsi":{"funktionimi":null,"arvokonvertteriparametrit":[],"arvovalikonvertteriparametrit":[],"syoteparametrit":[],"funktioargumentit":[],"valintaperusteviitteet":[],"validointivirheet":[],"onLuonnos":false,"nimi":"Lukion valintaperusteet, pääsykoe","kuvaus":"Lukion valintaperusteet, pääsykoe","tyyppi":"LUKUARVOFUNKTIO","id":4273,"lapsityyppi":"laskentakaava","tulosTunniste":null,"tulosTekstiFi":null,"tulosTekstiSv":null,"tulosTekstiEn":null,"tallennaTulos":null},"indeksi":1},{"lapsi":{"funktionimi":null,"arvokonvertteriparametrit":[],"arvovalikonvertteriparametrit":[],"syoteparametrit":[],"funktioargumentit":[],"valintaperusteviitteet":[],"validointivirheet":[],"onLuonnos":false,"nimi":"Lukion valintaperusteet, lisänäyttö","kuvaus":"Lukion valintaperusteet, lisänäyttö","tyyppi":"LUKUARVOFUNKTIO","id":4285,"lapsityyppi":"laskentakaava","tulosTunniste":null,"tulosTekstiFi":null,"tulosTekstiSv":null,"tulosTekstiEn":null,"tallennaTulos":null},"indeksi":2}],"valintaperusteviitteet":[],"validointivirheet":[],"onLuonnos":null,"nimi":null,"kuvaus":null,"tyyppi":null,"id":819310,"lapsityyppi":"funktiokutsu","tulosTunniste":null,"tulosTekstiFi":null,"tulosTekstiSv":null,"tulosTekstiEn":null,"tallennaTulos":false},"indeksi":1}],"valintaperusteviitteet":[],"validointivirheet":[],"onLuonnos":null,"nimi":null,"kuvaus":null,"tyyppi":null,"id":819313,"lapsityyppi":"funktiokutsu","tulosTunniste":null,"tulosTekstiFi":null,"tulosTekstiSv":null,"tulosTekstiEn":null,"tallennaTulos":false},"indeksi":1};
    var funktiokutsuPainotettukeskiarvo = {"lapsi":{"funktionimi":"PAINOTETTUKESKIARVO","arvokonvertteriparametrit":[],"arvovalikonvertteriparametrit":[],"syoteparametrit":[],"funktioargumentit":[{"lapsi":{"funktionimi":"LUKUARVO","arvokonvertteriparametrit":[],"arvovalikonvertteriparametrit":[],"syoteparametrit":[{"avain":"luku","arvo":"1"}],"funktioargumentit":[],"valintaperusteviitteet":[],"validointivirheet":[],"onLuonnos":null,"nimi":null,"kuvaus":null,"tyyppi":null,"id":1081414,"lapsityyppi":"funktiokutsu","tulosTunniste":null,"tulosTekstiFi":null,"tulosTekstiSv":null,"tulosTekstiEn":null,"tallennaTulos":false},"indeksi":1},{"lapsi":{"funktionimi":"LUKUARVO","arvokonvertteriparametrit":[],"arvovalikonvertteriparametrit":[],"syoteparametrit":[{"avain":"luku","arvo":"2"}],"funktioargumentit":[],"valintaperusteviitteet":[],"validointivirheet":[],"onLuonnos":null,"nimi":null,"kuvaus":null,"tyyppi":null,"id":1081416,"lapsityyppi":"funktiokutsu","tulosTunniste":null,"tulosTekstiFi":null,"tulosTekstiSv":null,"tulosTekstiEn":null,"tallennaTulos":false},"indeksi":2}],"valintaperusteviitteet":[],"validointivirheet":[],"onLuonnos":null,"nimi":null,"kuvaus":null,"tyyppi":null,"id":1081418,"lapsityyppi":"funktiokutsu","tulosTunniste":null,"tulosTekstiFi":null,"tulosTekstiSv":null,"tulosTekstiEn":null,"tallennaTulos":false},"indeksi":1};
    var laskentakaavaviite = {"lapsi":{"funktionimi":null,"arvokonvertteriparametrit":[],"arvovalikonvertteriparametrit":[],"syoteparametrit":[],"funktioargumentit":[],"valintaperusteviitteet":[],"validointivirheet":[],"onLuonnos":false,"nimi":"1. A1-kieli, LK päättötodistus","kuvaus":"1. A1-kieli, LK päättötodistus","tyyppi":"LUKUARVOFUNKTIO","id":1359,"lapsityyppi":"laskentakaava","tulosTunniste":null,"tulosTekstiFi":null,"tulosTekstiSv":null,"tulosTekstiEn":null,"tallennaTulos":null},"indeksi":1};
    var rootFunktiokutsu = {"funktionimi":"NIMETTYLUKUARVO","tulosTunniste":null,"tulosTekstiFi":null,"tulosTekstiSv":null,"tulosTekstiEn":null,"tallennaTulos":false,"arvokonvertteriparametrit":[],"arvovalikonvertteriparametrit":[],"syoteparametrit":[{"avain":"nimi","arvo":"paasykoe_tunniste + hylkäysperusteet (*)"}],"funktioargumentit":[{"lapsi":{"funktionimi":"SUMMA","arvokonvertteriparametrit":[],"arvovalikonvertteriparametrit":[],"syoteparametrit":[],"funktioargumentit":[{"lapsi":{"funktionimi":null,"arvokonvertteriparametrit":[],"arvovalikonvertteriparametrit":[],"syoteparametrit":[],"funktioargumentit":[],"valintaperusteviitteet":[],"validointivirheet":[],"onLuonnos":false,"nimi":"paasykoe_tunniste","kuvaus":"paasykoe_tunniste","tyyppi":"LUKUARVOFUNKTIO","id":4105,"lapsityyppi":"laskentakaava","tulosTunniste":null,"tulosTekstiFi":null,"tulosTekstiSv":null,"tulosTekstiEn":null,"tallennaTulos":null},"indeksi":1},{"lapsi":{"funktionimi":"HYLKAA","arvokonvertteriparametrit":[],"arvovalikonvertteriparametrit":[],"syoteparametrit":[{"avain":"hylkaysperustekuvaus_FI","arvo":"Kielikoetta ei suoritettu tai kielikokeen korvaavuusehto ei täyttynyt"}],"funktioargumentit":[{"lapsi":{"funktionimi":null,"arvokonvertteriparametrit":[],"arvovalikonvertteriparametrit":[],"syoteparametrit":[],"funktioargumentit":[],"valintaperusteviitteet":[],"validointivirheet":[],"onLuonnos":false,"nimi":"Kielikokeen pakollisuus - 2 aste, pk ja yo","kuvaus":"Kielikokeen pakollisuus - 2 aste, pk ja yo","tyyppi":"TOTUUSARVOFUNKTIO","id":579,"lapsityyppi":"laskentakaava","tulosTunniste":null,"tulosTekstiFi":null,"tulosTekstiSv":null,"tulosTekstiEn":null,"tallennaTulos":null},"indeksi":1}],"valintaperusteviitteet":[],"validointivirheet":[],"onLuonnos":null,"nimi":null,"kuvaus":null,"tyyppi":null,"id":820550,"lapsityyppi":"funktiokutsu","tulosTunniste":null,"tulosTekstiFi":null,"tulosTekstiSv":null,"tulosTekstiEn":null,"tallennaTulos":false},"indeksi":2}],"valintaperusteviitteet":[],"validointivirheet":[],"onLuonnos":null,"nimi":null,"kuvaus":null,"tyyppi":null,"id":820553,"lapsityyppi":"funktiokutsu","tulosTunniste":null,"tulosTekstiFi":null,"tulosTekstiSv":null,"tulosTekstiEn":null,"tallennaTulos":false},"indeksi":1}],"valintaperusteviitteet":[],"validointivirheet":[]};

    var funktiokutsuPainotettukeskiarvoWith2EmptySlots = {"lapsi":{"funktionimi":"PAINOTETTUKESKIARVO","arvokonvertteriparametrit":[],"arvovalikonvertteriparametrit":[],"syoteparametrit":[],"funktioargumentit":[{"lapsi":{"funktionimi":"LUKUARVO","arvokonvertteriparametrit":[],"arvovalikonvertteriparametrit":[],"syoteparametrit":[{"avain":"luku","arvo":"1"}],"funktioargumentit":[],"valintaperusteviitteet":[],"validointivirheet":[],"onLuonnos":null,"nimi":null,"kuvaus":null,"tyyppi":null,"id":1081685,"lapsityyppi":"funktiokutsu","tulosTunniste":null,"tulosTekstiFi":null,"tulosTekstiSv":null,"tulosTekstiEn":null,"tallennaTulos":false},"indeksi":1},{"lapsi":{"funktionimi":"LUKUARVO","arvokonvertteriparametrit":[],"arvovalikonvertteriparametrit":[],"syoteparametrit":[{"avain":"luku","arvo":"2"}],"funktioargumentit":[],"valintaperusteviitteet":[],"validointivirheet":[],"onLuonnos":null,"nimi":null,"kuvaus":null,"tyyppi":null,"id":1081687,"lapsityyppi":"funktiokutsu","tulosTunniste":null,"tulosTekstiFi":null,"tulosTekstiSv":null,"tulosTekstiEn":null,"tallennaTulos":false},"indeksi":2},{},{}],"valintaperusteviitteet":[],"validointivirheet":[],"onLuonnos":null,"nimi":null,"kuvaus":null,"tyyppi":null,"id":1081689,"lapsityyppi":"funktiokutsu","tulosTunniste":null,"tulosTekstiFi":null,"tulosTekstiSv":null,"tulosTekstiEn":null,"tallennaTulos":false},"indeksi":1}
    var funktiokutsuPainotettukeskiarvoWith4EmptySlots = {"lapsi":{"funktionimi":"PAINOTETTUKESKIARVO","arvokonvertteriparametrit":[],"arvovalikonvertteriparametrit":[],"syoteparametrit":[],"funktioargumentit":[{"lapsi":{"funktionimi":"LUKUARVO","arvokonvertteriparametrit":[],"arvovalikonvertteriparametrit":[],"syoteparametrit":[{"avain":"luku","arvo":"1"}],"funktioargumentit":[],"valintaperusteviitteet":[],"validointivirheet":[],"onLuonnos":null,"nimi":null,"kuvaus":null,"tyyppi":null,"id":1081685,"lapsityyppi":"funktiokutsu","tulosTunniste":null,"tulosTekstiFi":null,"tulosTekstiSv":null,"tulosTekstiEn":null,"tallennaTulos":false},"indeksi":1},{"lapsi":{"funktionimi":"LUKUARVO","arvokonvertteriparametrit":[],"arvovalikonvertteriparametrit":[],"syoteparametrit":[{"avain":"luku","arvo":"2"}],"funktioargumentit":[],"valintaperusteviitteet":[],"validointivirheet":[],"onLuonnos":null,"nimi":null,"kuvaus":null,"tyyppi":null,"id":1081687,"lapsityyppi":"funktiokutsu","tulosTunniste":null,"tulosTekstiFi":null,"tulosTekstiSv":null,"tulosTekstiEn":null,"tallennaTulos":false},"indeksi":2},null,null,{},{}],"valintaperusteviitteet":[],"validointivirheet":[],"onLuonnos":null,"nimi":null,"kuvaus":null,"tyyppi":null,"id":1081689,"lapsityyppi":"funktiokutsu","tulosTunniste":null,"tulosTekstiFi":null,"tulosTekstiSv":null,"tulosTekstiEn":null,"tallennaTulos":false},"indeksi":1}


    beforeEach(module('LaskentakaavaEditor'));
    beforeEach(inject(function(FunktioService) {
        funktioservice = FunktioService;
        funktioservice.funktiokuvaukset = funktiokuvaukset;
    }));

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

        });

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

    //getNimettyFunktioargumenttiCount
    describe("getNimettyFunktioargumenttiCount(parent)", function () {
        it("should return undefined if parent is undefined", function () {
            expect(funktioservice.getNimettyFunktioargumenttiCount(undefined)).toBe(undefined);
        });

        it("should return 3 for JOS", function() {
            expect(funktioservice.getNimettyFunktioargumenttiCount(funktiokutsuJos)).toBe(3);
        });

        it("should return 0 for SUMMA", function() {
            expect(funktioservice.getNimettyFunktioargumenttiCount(funktiokutsuSumma)).toBe(0);
        });

        it("should return 0 for SUMMA", function() {
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

        it("should return false for laskentakaavaviite", function() {
            expect(funktioservice.isFunktiokutsuWithFunktioargumenttiSizeN(laskentakaavaviite)).toBe(false);
        })
    });

    //isPainotettukeskiarvoChild
    describe("isPainotettukeskiarvoChild(name)", function () {

        it("should return true if parent is of type PAINOTETTUKESKIARVO", function () {
            expect(funktioservice.isPainotettukeskiarvoChild(funktiokutsuPainotettukeskiarvo)).toBe(true);
        });

        it('should return false for a KESKIARVO-funktiokutsu', function() {
            expect(funktioservice.isPainotettukeskiarvoChild(funktiokutsuKeskiarvo)).toBe(false);
        });

        it('should return false for a JOS-funktiokutsu', function() {
            expect(funktioservice.isPainotettukeskiarvoChild(funktiokutsuJos)).toBe(false);
        });

        it('should return false for undefined parameter', function() {
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

        it("should return true for a root object of laskentakaava", function() {
            expect(funktioservice.isRootFunktiokutsu(rootFunktiokutsu)).toBe(true);
        });

        it("should return undefined for a root object of laskentakaava", function() {
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

        it("should return 5 for SUMMA with 5 defined funktioargumentti", function() {
            expect(funktioservice.getDefinedFunktioargumenttiCount(funktiokutsuSumma)).toBe(5);
        });

        it("should return 2 for PAINOTETTUKESKIARVO with 2 defined funktioargumentti", function() {
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

        it("should return undefined if parameter is undefined", function() {
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
    


});
