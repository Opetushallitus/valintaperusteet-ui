app.filter('hakukohdekoodiFullMatchFilter', function (ValintaryhmaModel) {
    return function (list) {
        var model = ValintaryhmaModel;
        var koodi;
        var filterableListKoodi;
        var result = [];

        //copy original list (removing objects here would make it difficult to add them back if necessary)
        if (list) {

            for (var i = 0; i < list.length; i++) {
                result[i] = list[i];
            }

            if (model.valintaryhma.hakukohdekoodit) {
                for (var i = 0; i < result.length; i++) {
                    filterableListKoodi = result[i];
                    for (var j = 0; j < model.valintaryhma.hakukohdekoodit.length; j++) {
                        koodi = model.valintaryhma.hakukohdekoodit[j];
                        if (koodi.uri === filterableListKoodi.koodiUri) {
                            result.splice(i, 1);
                        }
                    }
                }
            }
        }
        return result;
    }
});


app.filter('valintakoekoodiFullMatchFilter', function (ValintaryhmaModel) {
    return function (list) {
        var model = ValintaryhmaModel;
        var koodi;
        var filterableListKoodi;

        var result = [];

        if (list) {


            for (var i = 0; i < list.length; i++) {
                result[i] = list[i];
            }

            if (model.valintaryhma.valintakoekoodit) {
                for (var i = 0; i < result.length; i++) {
                    filterableListKoodi = result[i];
                    for (var j = 0; j < model.valintaryhma.valintakoekoodit.length; j++) {
                        koodi = model.valintaryhma.valintakoekoodit[j];
                        if (koodi.uri === filterableListKoodi.koodiUri) {
                            result.splice(i, 1);
                        }
                    }
                }
            }
        }
        return result;
    }
});


app.filter('laskentakaavaFilter', function (_, ValintatapajonoModel) {
    return function (list) {
        return _.difference(list, _.filter(list, function (item) {
            return _.some(ValintatapajonoModel.jarjestyskriteerit, function (jk) {
                return jk.laskentakaavaId == item.id;
            });
        }));
    }
});

app.filter('hakijaryhmatFilter', function (_, ValintatapajonoModel) {
    return function (hakijaryhmat, more, even) {
        return _.difference(hakijaryhmat, _.filter(hakijaryhmat, function(origItem) {
            return _.some(ValintatapajonoModel.hakijaryhmat, function(filterItem) {
                return origItem.oid == filterItem.hakijaryhma.oid;
            })
        }));
    }
})