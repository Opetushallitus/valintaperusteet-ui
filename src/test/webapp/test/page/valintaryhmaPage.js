function valintaryhmaPage() {
    var openValintaryhmaPage = openPage("/valintaperusteet-ui/app/index.html#/valintaryhma/VALINTARYHMA", function () {
        return S("h1").length === 1 && S("h1").text() === "Valintaryhmän muokkaus";
    });

    var pageFunctions = {
        kopioiRyhma: function() {
            return S("a:contains(Valintaryhmän kopiointi)");
        },
        openPage: function (done) {
            openValintaryhmaPage().then(wait.until(function () {
              var pageReady = pageFunctions.kopioiRyhma().length === 1;
              if (pageReady) {
                done()
              }
              return pageReady
            }))
        }
    };
    return pageFunctions;
}
