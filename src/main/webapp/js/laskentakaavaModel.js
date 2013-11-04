// Valintaryhma Järjestyskriteerit
app.factory('LaskentakaavaModel', function(Laskentakaava, ParentValintaryhmas, Hakukohde) {
    
    var factory = (function() {
        var instance = {};
        instance.laskentakaavat = [];

        instance.refresh = function(valintaryhmaOid, hakukohdeOid) {
            instance.laskentakaavat = [];
            console.log("v: " + valintaryhmaOid);
            console.log("h: " + hakukohdeOid);
            //root kaavat
            Laskentakaava.list(function(result) {
                if(result.length > 0) {
                    var obj = {
                        name: 'root',
                        result: result
                    }
                    instance.laskentakaavat.push(obj);
                }
            });

            // hakukohteelta tulevat
            if(hakukohdeOid) {
                Laskentakaava.list({hakukohde: hakukohdeOid}, function(result) {
                    if(result.length > 0) {
                        var obj = {
                            name: 'current',
                            result: result
                        }
                        instance.laskentakaavat.push(obj);
                    }
                });
                Hakukohde.get({oid: hakukohdeOid}, function(result) {
                    Valintaryhmas(result.valintaryhma_id);
                });
            }

            // valintaryhmiltä tulevata
            if(valintaryhmaOid) {
                  Valintaryhmas(valintaryhmaOid);
            }

        }

        function Valintaryhmas(valintaryhmaOid) {
            ParentValintaryhmas.get({parentOid: valintaryhmaOid}, function(data) {
                data.forEach(function(temp) {
                    Laskentakaava.list({valintaryhma: temp.oid}, function(result) {
                        if(result.length > 0) {
                            var obj = {
                                name: temp.nimi,
                                result: result
                            }
                            instance.laskentakaavat.push(obj);
                        }
                    });

                });
            });
        }

        return instance;
    })();

    return factory;
    
});