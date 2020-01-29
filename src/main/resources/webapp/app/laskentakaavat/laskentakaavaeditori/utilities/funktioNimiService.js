angular.module('valintaperusteet').factory('FunktioNimiService', function () {
  "use strict";

  var nameService = new function () {
    this.nameMappings = {
      LUKUARVO: 'Lukuarvo',
      TOTUUSARVO: 'Totuusarvo',
      HAKUTOIVE: 'Hakutoive',
      HAKUTOIVERYHMASSA: 'Hakutoive ryhmässä',
      DEMOGRAFIA: 'Demografia',
      HAETOTUUSARVO: 'Hae totuusarvo',
      HAELUKUARVO: 'Hae lukuarvo',
      HAELUKUARVOEHDOLLA: 'Hae lukuarvo ehdolla',
      HAEMERKKIJONOJAKONVERTOILUKUARVOKSI: 'Hae merkkijono ja konvertoi lukuarvoksi',
      HAETOTUUSARVOJAKONVERTOILUKUARVOKSI: 'Hae totuusarvo ja konvertoi lukuarvoksi',
      HAEMERKKIJONOJAVERTAAYHTASUURUUS: 'Hae merkkijono ja vertaa yhtäsuuruus',
      HAEMERKKIJONOJAKONVERTOITOTUUSARVOKSI: 'Hae merkkijono ja konvertoi totuusarvoksi',
      VALINTAPERUSTEYHTASUURUUS: 'Valintaperusteyhtäsuuruus',
      SUMMA: 'Summa',
      TAI: 'Tai',
      TULO: 'Tulo',
      JOS: 'Jos',
      OSAMAARA: 'Osamäärä',
      SUUREMPI: 'Suurempi',
      YHTASUURI: 'Yhtäsuuri',
      PIENEMPI: 'Pienempi',
      MEDIAANI: 'Mediaani',
      PIENEMPITAIYHTASUURI: 'Pienempi tai yhtäsuuri',
      SUUREMPITAIYHTASUURI: 'Suurempi tai yhtäsuuri',
      EI: 'Ei',
      JA: 'Ja',
      MAKSIMI: 'Maksimi',
      MINIMI: 'Minimi',
      NEGAATIO: 'Negaatio',
      KESKIARVO: 'Keskiarvo',
      PAINOTETTUKESKIARVO: 'Painotettu keskiarvo',
      KONVERTOILUKUARVO: 'Konvertoi lukuarvo',
      HYLKAA: 'Hylkää',
      PYORISTYS: 'Pyöristys',
      SKAALAUS: 'Skaalaus',
      NMINIMI: 'N huonoin',
      NMAKSIMI: 'N paras',
      KESKIARVONPARASTA: 'N:n suurimman keskiarvo',
      SUMMANPARASTA: 'N:n suurimman summa',
      TULONPARASTA: 'N:n suurimman tulo',
      HYLKAAARVOVALILLA: 'Hylkää arvovälillä',
      NIMETTYLUKUARVO: 'Nimetty lukuarvo',
      NIMETTYTOTUUSARVO: 'Nimetty totuusarvo',
      HAEYOARVOSANA: 'Hae YO-arvosana',
      HAEOSAKOEARVOSANA: 'Hae YO-kokeen pisteet',
      HAKUKELPOISUUS: 'Hakukelpoisuus',
      HAEAMMATILLINENYTOARVOSANA: 'Hae ammatillinen yto:n arvosana',
      HAEAMMATILLINENYTOARVIOINTIASTEIKKO: 'Hae ammatillinen yto:n arviointiasteikko',
      ITEROIAMMATILLISETTUTKINNOT: 'Iteroi ammatilliset perustutkinnot',
      ITEROIAMMATILLISETOSAT: 'Iteroi ammatillisen tutkinnon osat',
      HAEAMMATILLISENOSANLAAJUUS: 'Hae ammatillisen tutkinnon osan laajuus',
      HAEAMMATILLISENOSANARVOSANA: 'Hae ammatillisen tutkinnon osan arvosana',
      HAEAMMATILLISENTUTKINNONKESKIARVO: 'Hae ammatillisten tutkinnon tallennettu keskiarvo',
      HAEAMMATILLISENTUTKINNONSUORITUSTAPA: 'Hae ammatillisen tutkinnon suoritustapa'
    };

    this.getName = function (funktionimi) {
      return nameService.nameMappings[funktionimi];
    };
  }();

  return nameService;
});
