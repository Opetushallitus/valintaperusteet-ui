
function valintakokeen_muokkausPage() {
    function isLocalhost() {
        return location.host.indexOf('localhost') > -1
    }

    var muokkausPage = openPage("/valintaperusteet-ui/app/index.html#/valintaryhma/VALINTARYHMA/valintakoevalinnanvaihe/VALINTAKOEVALINNANVAIHE/valintakoe/VALINTAKOE", function () {
        return S("#valintakoelomake").length === 1 && S("#kutsunKohde").length === 1;
    });

    var pageFunctions = {
        kutsunKohde: function() {
            return S("#kutsunKohde");
        },
        openPage: function (done) {
            return muokkausPage()
                .then(wait.until(function () {
                    var pageReady = pageFunctions.kutsunKohde().length === 1;
                    if (pageReady) {
                        done()
                    }
                    return pageReady
                }))
        }
    };
    return pageFunctions;
}
