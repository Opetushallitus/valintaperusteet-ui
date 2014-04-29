angular.module('LaskentakaavaEditor').factory('FunktioFactory', function(FunktioService){
	var factory = new function() {

		function generateFunktioPrototype() {
			return {
				lapsi: {
					funktionimi: null,
					arvokonvertteriparametrit: [],
					arvovalikonvertteriparametrit: [],
					syoteparametrit: [],
					funktioargumentit: [],
					valintaperusteviitteet: [],
					validointivirheet: [],
					onLuonnos: null,
					nimi: null,
					kuvaus: null,
					tyyppi: null,
					lapsityyppi: null,
					tulosTunniste: null,
					tallennaTulos: false,
					tulosTekstiFi: null,
					tulosTekstiSv: null,
					tulosTekstiEn: null
				},

				indeksi: 0
			}
		}

		function setLapsityyppi(funktioprototype, funktiotyyppi) {
			if(funktiotyyppi === 'LASKENTAKAAVAVIITE') {
				funktioprototype.lapsi.lapsityyppi = "laskentakaava";
			} else {
				funktioprototype.lapsi.lapsityyppi = "funktiokutsu";
			}
		}

		this.createLaskentakaavaviite = function(laskentakaavaviite) {

			if(laskentakaavaviite) {
				return {
					lapsi: {
						funktionimi: null,
						arvokonvertteriparametrit: [],
						arvovalikonvertteriparametrit: [],
						syoteparametrit: [],
						funktioargumentit: [],
						valintaperusteviitteet: [],
						validointivirheet: [],
						onLuonnos: laskentakaavaviite.onLuonnos,
						nimi: laskentakaavaviite.nimi,
						kuvaus: laskentakaavaviite.kuvaus,
						tyyppi: laskentakaavaviite.tyyppi,
						id: laskentakaavaviite.id,
						lapsityyppi: "laskentakaava",
						tulosTunniste: null,
						tulosTekstiFi: null,
						tulosTekstiSv: null,
						tulosTekstiEn: null,
						tallennaTulos: false
					},
					indeksi: 0
				}
			} else {
				return {
					lapsi: {
						funktionimi: null,
						arvokonvertteriparametrit: [],
						arvovalikonvertteriparametrit: [],
						syoteparametrit: [],
						funktioargumentit: [],
						valintaperusteviitteet: [],
						validointivirheet: [],
						onLuonnos: false,
						nimi: 'Valitse laskentakaava',
						kuvaus: null,
						tyyppi: null,
						id: null,
						lapsityyppi: "laskentakaava",
						tulosTunniste: null,
						tulosTekstiFi: null,
						tulosTekstiSv: null,
						tulosTekstiEn: null,
						tallennaTulos: false
					},
					indeksi: 0
				}
			}
		};

		this.createFunktioInstance = function(parentFunktiokutsu, newFunktioType, isDirectChildForRoot) {

			var parentFunktiokuvaus = isDirectChildForRoot ? FunktioService.getFunktiokuvaus(parentFunktiokutsu.funktionimi) : FunktioService.getFunktiokuvaus(parentFunktiokutsu.lapsi.funktionimi);
			var newFunktioFunktiokuvaus = FunktioService.getFunktiokuvaus(newFunktioType);
			var funktioprototype = generateFunktioPrototype();

			//Funktionimi
			funktioprototype.lapsi.funktionimi = newFunktioType;

			//Asetetaan lapsityyppi
			setLapsityyppi(funktioprototype, newFunktioType);

			//Generoidaan parametrit
			populateParameters(funktioprototype, newFunktioFunktiokuvaus);

			//Generoidaan funktioargumentit
			if(newFunktioFunktiokuvaus.funktioargumentit) {
				populateFunktioargumentit(funktioprototype, newFunktioFunktiokuvaus, FunktioService.isNimettyFunktioargumenttiByFunktionimi(newFunktioType), FunktioService.isPainotettukeskiarvoChildByParentNimi(newFunktioType) );
			}

			return funktioprototype;
		}

		function populateParameters(funktioprototype, funktiokuvaus) {

			// Lisätään funktioprototypeen funktiokuvauksen valintaperusteiden mukainen määrä tyhjiä objekteja
			if(funktiokuvaus.valintaperusteviitteet) {
				funktiokuvaus.valintaperusteviitteet.forEach(function(item) {
					funktioprototype.lapsi.valintaperusteviitteet.push({});
				});
			}

			// Lisätään funktioprototypeen funktiokuvauksen mukaiset syoteparametrit
			if(funktiokuvaus.syoteparametrit) {
				funktiokuvaus.syoteparametrit.forEach(function(item) {
					funktioprototype.lapsi.syoteparametrit.push({});
					//täytyy käyttää angular.copya, tai syoteparametrit luoduissa eri funktiokutsuissa viittaavat samoihin syoteparametriobjekteihin
					angular.copy(item, funktioprototype.lapsi.syoteparametrit[funktioprototype.lapsi.syoteparametrit.length - 1]);
				});
			}


		}

		// Lisätään funktioprototypeen tarvittava määrä null objekteja funktioargumenteiksi
		// funktioparentin ja funktioargumentin mukaiset tekstit muodostetaan templateissa
		function populateFunktioargumentit(funktioprototype, funktiokuvaus, hasNimetytFunktioargumentit, isPainotettukeskiarvoChild) {

			if(hasNimetytFunktioargumentit) {
				//Lisätään yhtä monta null objektia, kuin nimettyjä funktioargumentteja.
				funktiokuvaus.funktioargumentit.forEach(function() {
					funktioprototype.lapsi.funktioargumentit.push(null)
				});
			} else if(isPainotettukeskiarvoChild) {
				funktioprototype.lapsi.funktioargumentit.push({});
				funktioprototype.lapsi.funktioargumentit.push({});
			} else {
				//jos funktiolla on nimeämätön määrä funktioargumentteja, lisätään listaan yksi null
				funktioprototype.lapsi.funktioargumentit.push(null);
			}
		}

	}

	return factory;
});
