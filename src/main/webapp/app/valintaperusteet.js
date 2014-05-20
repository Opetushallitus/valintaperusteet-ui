"use strict";
var app = angular.module('valintaperusteet', ['ngResource', 'loading', 'ngRoute', 'pascalprecht.translate', 'ui.bootstrap', 'underscore', 'LaskentakaavaEditor', 'ng-breadcrumbs']).run(function($http){
    $http.get(SERVICE_URL_BASE + "buildversion.txt?auth");
});



var underscore = angular.module('underscore', []);
underscore.factory('_', function() {
  return window._; // assumes lodash has already been loaded on the page
});


function mainCtrl($scope, breadcrumbs) {
	$scope.breadcrumbs = breadcrumbs;
}



var SERVICE_URL_BASE = SERVICE_URL_BASE || "";
var TEMPLATE_URL_BASE = TEMPLATE_URL_BASE || "";
var KOODISTO_URL_BASE = KOODISTO_URL_BASE || "";
var ORGANIZATION_SERVICE_URL_BASE = ORGANIZATION_SERVICE_URL_BASE || "/organisaatio-service/";





//TARJONTA RESOURCES
app.factory('Haku', function($resource) {
  return $resource(TARJONTA_URL_BASE + "haku", {}, {
    get: {method: "GET", isArray: true}
  });
});

app.factory('HaunTiedot', function($resource) {
  return $resource(TARJONTA_URL_BASE + "haku/:hakuOid", {hakuOid: "@hakuOid"}, {
    get: {method: "GET"}
  });
});

//Valintaryhma
app.factory('ValintaperusteetPuu', function($resource) {
return $resource(SERVICE_URL_BASE + "resources/puu", {
      q: "@q",
      hakuOid: "@hakuOid",
      tila: "@tila"
    }, {
        get: {method: "GET", isArray: true  }
      });
});





app.factory('RootValintaryhmas', function($resource) {
return $resource(SERVICE_URL_BASE + "resources/valintaryhma", {}, {
    get: {method: "GET", isArray: true,
        params: {
            paataso: true
        }
    }
  });
});
app.factory('ChildValintaryhmas', function($resource) {
return $resource(SERVICE_URL_BASE + "resources/valintaryhma/:parentOid/lapsi", {parentOid: "@parentOid"}, {
    get: {method: "GET", isArray: true},
    insert: {method: "PUT"}
  });
});

app.factory('ChildHakukohdes', function($resource) {
return $resource(SERVICE_URL_BASE + "resources/valintaryhma/:oid/hakukohde", {}, {
    get: {method: "GET", isArray: true}
  });
});
//Sama kuin Hakukohderyhma mutta odottaa yksittaista tulosta!
app.factory('Valintaryhma', function($resource) {
	return $resource(SERVICE_URL_BASE + "resources/valintaryhma/:oid", {oid: "@oid"}, {
	    get: {method: "GET"},
	    post:{method: "POST"},
	    insert: {method: "PUT"},
      query: {method: "GET", isArray: true}
	});
});

app.factory('ParentValintaryhmas', function($resource) {
    return $resource(SERVICE_URL_BASE + "resources/valintaryhma/:parentOid/parents", {parentOid: "@parentOid"}, {
        get: {method: "GET", isArray: true}
    });
});

app.factory('ValintaryhmaValinnanvaihe', function($resource) {
return $resource(SERVICE_URL_BASE + "resources/valintaryhma/:oid/valinnanvaihe", {oid: "@oid"}, {
    get: {method: "GET", isArray: true}
  });
});

app.factory('NewValintaryhmaValinnanvaihe', function($resource) {
return $resource(SERVICE_URL_BASE + "resources/valintaryhma/:valintaryhmaOid/valinnanvaihe", {valintaryhmaOid: "@valintaryhmaOid"}, {
    put: {method: "PUT"}
  });
});

app.factory('ValintaryhmaHakukohdekoodi', function($resource) {
return $resource(SERVICE_URL_BASE + "resources/valintaryhma/:valintaryhmaOid/hakukohdekoodi", {valintaryhmaOid: "@valintaryhmaOid"}, {
    insert: {method: "PUT" }, //one
    post: {method: "POST", isArray: true} //array
  });
});

app.factory('ValintaryhmaValintakoekoodi', function($resource) {
return $resource(SERVICE_URL_BASE + "resources/valintaryhma/:valintaryhmaOid/valintakoekoodi", {valintaryhmaOid: "@valintaryhmaOid"}, {
    insert: {method: "PUT" }, //one
    post: {method: "POST", isArray: true} //array
  });
});

app.factory('KoodistoHakukohdekoodi', function($resource) {
return $resource(KOODISTO_URL_BASE + "json/hakukohteet/koodi", {}, {
    get: {method: "GET", isArray: true}
  });
});

app.factory('KoodistoValintakoekoodi', function($resource) {
  return $resource(KOODISTO_URL_BASE + "json/valintakokeentyyppi/koodi", {}, {
    get: {method: "get", isArray: true}
  });
});


//Hakukohde
app.factory('RootHakukohde', function($resource) {
return $resource(SERVICE_URL_BASE + "resources/hakukohde", {paataso: true}, {
    get: {method: "GET", isArray: true}
  });
});

app.factory('ChildHakukohdes', function($resource) {
return $resource(SERVICE_URL_BASE + "resources/valintaryhma/:oid/hakukohde", {}, {
    get: {method: "GET", isArray: true}
  });
});
app.factory('HakukohdeKuuluuSijoitteluun', function($resource) {
return $resource(SERVICE_URL_BASE + "resources/hakukohde/:oid/kuuluuSijoitteluun", {}, {
    get: {method: "GET"}
  });
});
app.factory('NewHakukohde', function($resource) {
  return $resource(SERVICE_URL_BASE + "resources/hakukohde", {}, {
    insert: {method: "PUT"}
  });
});
app.factory('HakukohdeValinnanvaihe', function($resource) {
 return $resource(SERVICE_URL_BASE + "resources/hakukohde/:parentOid/valinnanvaihe", {parentOid: "@parentOid"}, {
     get: {method: "GET", isArray: true },
     post:{method: "POST"},
     insert: {method: "PUT"}
   });
});

app.factory('Hakukohde', function($resource) {
	return $resource(SERVICE_URL_BASE + "resources/hakukohde/:oid", {oid: "@oid"}, {
    	get: {method: "GET"},
    	post:{method: "POST"}
	});
});
app.factory('HakukohdeHakukohdekoodi', function($resource) {
	return $resource(SERVICE_URL_BASE + "resources/hakukohde/:hakukohdeOid/hakukohdekoodi", {hakukohdeOid: "@hakukohdeOid"}, {
		post: {method: "POST"}
	});
});

app.factory('HakukohdeSiirra', function($resource) {
	return $resource(SERVICE_URL_BASE + "resources/hakukohde/:hakukohdeOid/siirra", {hakukohdeOid: "@hakukohdeOid"}, {
		siirra: {method: "POST"}
	});
});

//Valinnanvaihe
app.factory('Valinnanvaihe', function($resource) {
 return $resource(SERVICE_URL_BASE + "resources/valinnanvaihe/:oid", {oid: "@oid"}, {
     get: {method: "GET"},
     post:{method: "POST"},
     delete: {method: "DELETE"}
   });
});
app.factory('ValinnanvaiheValintatapajono', function($resource) {
 return $resource(SERVICE_URL_BASE + "resources/valinnanvaihe/:parentOid/valintatapajono", {parentOid: "@parentOid"}, {
     get: {method: "GET",  isArray: true},
     insert:{method: "PUT"}
   });
});
app.factory('ValinnanvaiheJarjesta', function($resource) {
    return $resource(SERVICE_URL_BASE + "resources/valinnanvaihe/jarjesta", {}, {
        post: {method: "POST", isArray: true}
    });
});
app.factory('ValinnanvaiheKuuluuSijoitteluun', function($resource) {
return $resource(SERVICE_URL_BASE + "resources/valinnanvaihe/:oid/kuuluuSijoitteluun", {}, {
    get: {method: "GET"}
  });
});

app.factory('ValinnanvaiheValintakoe', function($resource) {
  return $resource(SERVICE_URL_BASE + "resources/valinnanvaihe/:valinnanvaiheOid/valintakoe", {valinnanvaiheOid: "@valinnanvaiheOid"}, {
    insert: {method: "PUT"},
    get: {method: "GET", isArray: true},
    remove: {method: "REMOVE"}
  });
});


//Valintakoe
app.factory('Valintakoe', function($resource) {
  return $resource(SERVICE_URL_BASE + "resources/valintakoe/:valintakoeOid", {valintakoeOid: "@valintakoeOid"}, {
    get: {method: "GET"},
    update: {method: "POST"},
    delete: {method: "DELETE"}
  });
});


//Valintatapajono
app.factory('Valintatapajono', function($resource) {
 return $resource(SERVICE_URL_BASE + "resources/valintatapajono/:oid", {oid: "@oid"}, {
     get:   {method: "GET"},
     post:  {method: "POST"},
     delete:{method: "DELETE"}
   });
});
app.factory('ValintatapajonoJarjestyskriteeri', function($resource) {
 return $resource(SERVICE_URL_BASE + "resources/valintatapajono/:parentOid/jarjestyskriteeri", {parentOid: "@parentOid"}, {
     get: {method: "GET", isArray: true},
     insert: {method: "PUT"}
   });
});
app.factory('ValintatapajonoJarjesta', function($resource) {
    return $resource(SERVICE_URL_BASE + "resources/valintatapajono/jarjesta", {}, {
        post: {method: "POST", isArray: true}
    });
});

// Hakijaryhma
app.factory('Hakijaryhma', function($resource) {
 return $resource(SERVICE_URL_BASE + "resources/hakijaryhma/:oid", {oid: "@oid"}, {
     get: {method: "GET"},
     update: {method: "POST"},
     delete: {method: "DELETE"}
   });
});

app.factory('ValintaryhmaHakijaryhma', function($resource) {
 return $resource(SERVICE_URL_BASE + "resources/valintaryhma/:oid/hakijaryhma", {oid: "@oid"}, {
     get: {method: "GET", isArray: true},
     insert: {method: "PUT"}
   });
});

app.factory('HakukohdeHakijaryhma', function($resource) {
 return $resource(SERVICE_URL_BASE + "resources/hakukohde/:oid/hakijaryhma", {oid: "@oid"}, {
     get: {method: "GET", isArray: true},
     insert: {method: "PUT"}
   });
});

app.factory('ValintatapajonoHakijaryhma', function($resource) {
 return $resource(SERVICE_URL_BASE + "resources/valintatapajono/:oid/hakijaryhma/:hakijaryhmaOid", {oid: "@oid", hakijaryhmaOid: "@hakijaryhmaOid"}, {
     get: {method: "GET", isArray: true},
     insert: {method: "POST"}
   });
});

app.factory('HakijaryhmanValintatapajonot', function($resource) {
 return $resource(SERVICE_URL_BASE + "resources/hakijaryhma/:oid/valintatapajono", {oid: "@oid", hakijaryhmaOid: "@hakijaryhmaOid"}, {
     get: {method: "GET", isArray: true}
   });
});

app.factory('HakijaryhmaValintatapajono', function($resource) {
 return $resource(SERVICE_URL_BASE + "resources/hakijaryhma_valintatapajono/:oid", {oid: "@oid"}, {
     delete: {method: "DELETE"},
     update: {method: "POST"}
   });
});

app.factory('HakijaryhmaJarjesta', function($resource) {
    return $resource(SERVICE_URL_BASE + "resources/hakijaryhma/jarjesta", {}, {
        post: {method: "POST", isArray: true}
    });
});

//Järjestyskriteeri
app.factory('Jarjestyskriteeri', function($resource) {
 return $resource(SERVICE_URL_BASE + "resources/jarjestyskriteeri/:oid", {oid: "@oid"}, {
     post: {method: "POST"}
   });
});
app.factory('JarjestyskriteeriJarjesta', function($resource) {
    return $resource(SERVICE_URL_BASE + "resources/jarjestyskriteeri/jarjesta", {}, {
        post: {method: "POST", isArray: true}
    });
});

//ulkoiset
app.factory('Haku', function($resource) {
  return $resource(TARJONTA_URL_BASE + "haku", {}, {
    get: {method: "GET", isArray: true}
  });
});
app.factory('HaunTiedot', function($resource) {
  return $resource(TARJONTA_URL_BASE + "haku/:hakuOid", {hakuOid: "@hakuOid"}, {
    get: {method: "GET"}
  });
});
app.factory('TarjontaImport', function($resource) {
    return $resource(VALINTALASKENTAKOOSTE_URL_BASE + "resources/hakuimport/aktivoi", {}, {
        aktivoi: {method: "GET"}
    })
});
app.factory('HakuHakukohdeChildren', function($resource) {
return $resource(TARJONTA_URL_BASE + "haku/:hakuOid/hakukohde?count=99999", {hakuOid: "@hakuOid"}, {
    get: {method: "GET", isArray: true}
  });
});
app.factory('TarjontaHaku', function($resource) {
	return $resource(TARJONTA_URL_BASE + "haku/:hakuOid/hakukohdeTulos", {},{
		query:  {method:'GET', isArray:false}
	});
});
app.factory('HakukohdeNimi', function($resource) {
    return $resource(TARJONTA_URL_BASE + "hakukohde/:hakukohdeoid/nimi", {hakukohdeoid: "@hakukohdeoid"}, {
     get: {method: "GET"}
    });
});



app.factory('Organizations', function ($resource) {
    return $resource(ORGANIZATION_SERVICE_URL_BASE + "rest/organisaatio/hae", {}, {
        get: {method: "GET"}
    });
});

app.factory('OrganizationByOid', function ($resource) {
    return $resource(ORGANIZATION_SERVICE_URL_BASE + "rest/organisaatio/:oid", {oid: "@oid"}, {
        get: {method: "GET"}
    });
});