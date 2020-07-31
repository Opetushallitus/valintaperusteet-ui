angular.module("valintaperusteet").factory("FunktioFactory", [
  "FunktiokuvausService",
  "FunktioService",
  function (FunktiokuvausService, FunktioService) {
    "use strict";

    var factory = new (function () {
      this.createEmptyLaskentakaava = function (
        funktiokutsu,
        routeParams,
        nimi,
        kuvaus
      ) {
        var kaavatree = {};
        var newfunktioFunktionimi =
          funktiokutsu.lapsi.tyyppi === "LUKUARVOFUNKTIO"
            ? "NIMETTYLUKUARVO"
            : "NIMETTYTOTUUSARVO";

        var funktiokuvaus = FunktiokuvausService.getFunktiokuvaus(
          funktiokutsu.lapsi.funktionimi
        );

        angular.copy(funktiokutsu, kaavatree);

        var kaava = {
          valintaryhmaOid: routeParams.id,
          hakukohdeOid: routeParams.hakukohdeOid,
          laskentakaava: {
            funktiokutsu: {
              funktioargumentit: [kaavatree],
              funktionimi: newfunktioFunktionimi,
              arvokonvertteriparametrit: [],
              arvovalikonvertteriparametrit: [],
              syoteparametrit: [{ arvo: nimi, avain: "nimi" }],
              tulosTunniste: null,
              tulosTekstiFi: null,
              tulosTekstiSv: null,
              tulosTekstiEn: null,
              tallennaTulos: false,
              omaopintopolku: false,
              validointivirheet: [],
              valintaperusteviitteet: [],
            },
            id: undefined,
            onLuonnos: false,
            tyyppi: funktiokuvaus.tyyppi,
            kuvaus: kuvaus,
            nimi: nimi,
            kardinaliteetti: 1,
          },
        };

        return kaava;
      };

      this.getLaskentakaavaviiteFromLaskentakaava = function (laskentakaava) {
        return {
          indeksi: 0,
          lapsi: {
            funktionimi: laskentakaava.funktiokutsu.funktionimi,
            arvokonvertteriparametrit: [],
            arvovalikonvertteriparametrit: [],
            syoteparametrit: [],
            funktioargumentit: [],
            valintaperusteviitteet: [],
            validointivirheet: [],
            onLuonnos: laskentakaava.onLuonnos,
            nimi: laskentakaava.nimi,
            kuvaus: laskentakaava.kuvaus,
            tyyppi: laskentakaava.tyyppi,
            id: laskentakaava.id,
            lapsityyppi: "laskentakaava",
            tulosTunniste: null,
            tulosTekstiFi: null,
            tulosTekstiSv: null,
            tulosTekstiEn: null,
            tallennaTulos: null,
            omaopintopolku: null,
          },
        };
      };

      this.createLaskentakaavaviite = function (laskentakaavaviite) {
        if (laskentakaavaviite) {
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
              tallennaTulos: false,
              omaopintopolku: false,
            },
            indeksi: 0,
          };
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
              nimi: "Valitse laskentakaava",
              kuvaus: null,
              tyyppi: null,
              id: null,
              lapsityyppi: "laskentakaava",
              tulosTunniste: null,
              tulosTekstiFi: null,
              tulosTekstiSv: null,
              tulosTekstiEn: null,
              tallennaTulos: false,
              omaopintopolku: false,
            },
            indeksi: 0,
          };
        }
      };

      this.createFunktioInstance = function (
        parentFunktiokutsu,
        newFunktioType,
        isDirectChildForRoot
      ) {
        var parentFunktiokuvaus = isDirectChildForRoot
          ? FunktiokuvausService.getFunktiokuvaus(
              parentFunktiokutsu.funktionimi
            )
          : FunktiokuvausService.getFunktiokuvaus(
              parentFunktiokutsu.lapsi.funktionimi
            );
        var newFunktioFunktiokuvaus = FunktiokuvausService.getFunktiokuvaus(
          newFunktioType
        );
        var funktioprototype = generateFunktioPrototype();

        //Funktionimi
        funktioprototype.lapsi.funktionimi = newFunktioType;
        funktioprototype.lapsi.tyyppi = newFunktioFunktiokuvaus.tyyppi;

        //Asetetaan lapsityyppi
        setLapsityyppi(funktioprototype, newFunktioType);

        //Generoidaan parametrit
        populateParameters(funktioprototype, newFunktioFunktiokuvaus);

        //Generoidaan funktioargumentit
        if (newFunktioFunktiokuvaus.funktioargumentit) {
          populateFunktioargumentit(
            funktioprototype,
            newFunktioFunktiokuvaus,
            FunktiokuvausService.hasNimettyFunktioargumenttiByFunktioNimi(
              newFunktioType
            ),
            FunktiokuvausService.isPainotettukeskiarvoByFunktioNimi(
              newFunktioType
            )
          );
        }

        return funktioprototype;
      };

      function populateParameters(funktioprototype, funktiokuvaus) {
        // Lisätään funktioprototypeen funktiokuvauksen valintaperusteiden mukainen määrä tyhjiä objekteja
        if (funktiokuvaus.valintaperusteviitteet) {
          funktiokuvaus.valintaperusteviitteet.forEach(function (item) {
            funktioprototype.lapsi.valintaperusteviitteet.push({});
          });
        }

        // Lisätään funktioprototypeen funktiokuvauksen mukaiset syoteparametrit
        if (funktiokuvaus.syoteparametrit) {
          funktiokuvaus.syoteparametrit.forEach(function (item) {
            funktioprototype.lapsi.syoteparametrit.push({});
            //täytyy käyttää angular.copya, tai syoteparametrit luoduissa eri funktiokutsuissa viittaavat samoihin syoteparametriobjekteihin
            angular.copy(
              item,
              funktioprototype.lapsi.syoteparametrit[
                funktioprototype.lapsi.syoteparametrit.length - 1
              ]
            );
          });
        }
      }

      // Lisätään funktioprototypeen tarvittava määrä null objekteja funktioargumenteiksi
      // funktioparentin ja funktioargumentin mukaiset tekstit muodostetaan templateissa
      function populateFunktioargumentit(
        funktioprototype,
        funktiokuvaus,
        hasNimetytFunktioargumentit,
        isPainotettukeskiarvoChild
      ) {
        if (hasNimetytFunktioargumentit) {
          //Lisätään yhtä monta null objektia, kuin nimettyjä funktioargumentteja.
          funktiokuvaus.funktioargumentit.forEach(function () {
            funktioprototype.lapsi.funktioargumentit.push(null);
          });
        } else if (isPainotettukeskiarvoChild) {
          funktioprototype.lapsi.funktioargumentit.push({});
          funktioprototype.lapsi.funktioargumentit.push({});
        } else {
          //jos funktiolla on nimeämätön määrä funktioargumentteja, lisätään listaan yksi null
          funktioprototype.lapsi.funktioargumentit.push(null);
        }
      }

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
            omaopintopolku: false,
            tulosTekstiFi: null,
            tulosTekstiSv: null,
            tulosTekstiEn: null,
          },

          indeksi: 0,
        };
      }

      function setLapsityyppi(funktioprototype, funktiotyyppi) {
        if (funktiotyyppi === "LASKENTAKAAVAVIITE") {
          funktioprototype.lapsi.lapsityyppi = "laskentakaava";
        } else {
          funktioprototype.lapsi.lapsityyppi = "funktiokutsu";
        }
      }
    })();

    return factory;
  },
]);
