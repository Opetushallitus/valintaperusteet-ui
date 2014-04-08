
angular.module('LaskentakaavaEditor').factory('TemplateService', function(FunktioService) {
	var templateservice = new function() {



		this.getSyoteparametriTemplate = function(syoteparametrityyppi) {

			switch(syoteparametrityyppi) {
				case "DESIMAALILUKU":
					return "desimaaliluku-template";
				case "KOKONAISLUKU":
					return "kokonaisluku-template";
				case "TOTUUSARVO":
					return "totuusarvo-template";
				case "MERKKIJONO":
					return "merkkijono-template";
                case "ARVOJOUKKO":
                    return "arvojoukko-template";
				default:
					return ""
			}
		}

        this.getValintaperusteTemplate = function(syoteparametrityyppi) {

            switch(syoteparametrityyppi) {
                case "ARVOJOUKKO":
                    return "valintaperuste-arvojoukko-template";
                default:
                    return "valintaperuste-default-template"
            }
        }



		this.getKonvertteriparametriTemplate = function(konvertteriparametriSelection) {
			switch(konvertteriparametriSelection) {
				case "ARVOKONVERTTERI":
					return "arvokonvertteri-template";
				case "ARVOVALIKONVERTTERI":
					return "arvovalikonvertteri-template";
				default:
					return "";
			}
		}

		this.getTemplateName = function(key) {
			var map = {
				LUKUARVO: 'lukuarvo',
				TOTUUSARVO: 'totuusarvo',
				HAKUTOIVE: 'hakutoive',
				DEMOGRAFIA: 'demografia',

				HAETOTUUSARVO: 'haettava_arvo',
				HAELUKUARVO: 'haettava_arvo',
				HAELUKUARVOEHDOLLA: 'haettava_arvo',
				HAEMERKKIJONOJAKONVERTOILUKUARVOKSI: 'haettava_arvo',
				HAEMERKKIJONOJAVERTAAYHTASUURUUS: 'haettava_arvo',
				HAEMERKKIJONOJAKONVERTOITOTUUSARVOKSI: 'haettava_arvo',
				VALINTAPERUSTEYHTASUURUUS: 'haettava_arvo',
                HAEYOARVOSANA: 'haettava_arvo',
                HAEOSAKOEARVOSANA: 'haettava_arvo',

				SUMMA: 'summa',

				HYLKAA: 'hylkaa',

				TAI: 'funktio',
				TULO: 'funktio',
				JOS: 'funktio',
				OSAMAARA: 'funktio',
				SUUREMPI: 'funktio',
				YHTASUURI: 'funktio',
				PIENEMPI: 'funktio',
				MEDIAANI: 'funktio',
				PIENEMPITAIYHTASUURI: 'funktio',
				SUUREMPITAIYHTASUURI: 'funktio',
				EI: 'funktio',
				JA: 'funktio',
				MAKSIMI: 'funktio',
				MINIMI: 'funktio',
				NEGAATIO: 'funktio',
				KESKIARVO: 'funktio',
				KONVERTOILUKUARVO: 'funktio',

				PYORISTYS: 'funktio',
				SKAALAUS: 'funktio',
				PAINOTETTUKESKIARVO: 'funktio',

				NMINIMI: 'fargumentticount_funktio_handle',
				NMAKSIMI: 'fargumentticount_funktio_handle',
				KESKIARVONPARASTA: 'fargumentticount_funktio_handle',
				SUMMANPARASTA: 'fargumentticount_funktio_handle',

				HYLKAAARVOVALILLA: 'hylkaa_arvovalilla',
				NIMETTYLUKUARVO: 'nimetty_lukuarvo',
				NIMETTYTOTUUSARVO: 'nimetty_totuusarvo'
			}
			return map[key];
		}

	}

	return templateservice;
});
