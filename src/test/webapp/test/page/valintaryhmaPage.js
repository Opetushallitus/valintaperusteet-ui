function valintaryhmaPage() {
  var openValintaryhmaPage = openPage(
    "/valintaperusteet-ui/app/index.html#/valintaryhma/VALINTARYHMA",
    function () {
      return (
        S("h1").length === 1 && S("h1").text() === "Valintaryhmän muokkaus"
      );
    }
  );

  var pageFunctions = {
    kopioiRyhma: function () {
      return S("a:contains(Valintaryhmän kopiointi)");
    },
    kopioiButton: Button(function () {
      return S("button:contains(Kopioi)");
    }),
    virheIlmoitus: function () {
      return S("div.alert h3");
    },
    kopiointiOtsikko: function () {
      return S("h3:contains(Valintaryhmän kopiointi)");
    },
    ryhmanUusinimi: function () {
      return S("input#uusinimi");
    },
    juuriRyhma: function () {
      return S("input#root");
    },
    openPage: function (done) {
      openValintaryhmaPage().then(
        wait.until(function () {
          var pageReady = pageFunctions.kopioiRyhma().length === 1;
          if (pageReady) {
            done();
          }
          return pageReady;
        })
      );
    },
  };
  return pageFunctions;
}
