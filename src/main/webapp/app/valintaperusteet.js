"use strict";

var app = angular.module('valintaperusteet', ['ngResource', 'ngCookies', 'loading', 'ngRoute',
    'ui.bootstrap', 'lodash','ng-breadcrumbs', 'oph.localisation', 'oph.utils']).
    run(function($http, LocalisationService){
    $http.get(SERVICE_URL_BASE + "buildversion.txt?auth");
    LocalisationService.getTranslation("");
});


var underscore = angular.module('lodash', []);
underscore.factory('_', function() {
  return window._; // assumes lodash has already been loaded on the page
});

var SERVICE_URL_BASE = SERVICE_URL_BASE || "";
var TEMPLATE_URL_BASE = TEMPLATE_URL_BASE || "";
var KOODISTO_URL_BASE = KOODISTO_URL_BASE || "";
var ORGANIZATION_SERVICE_URL_BASE = ORGANIZATION_SERVICE_URL_BASE || "/organisaatio-service/";
var LOKALISOINTIPALVELU_URL_BASE = LOKALISOINTIPALVELU_URL_BASE || "";
var TARJONTA_URL_BASE = TARJONTA_URL_BASE || "";
var VALINTALASKENTAKOOSTE_URL_BASE = VALINTALASKENTAKOOSTE_URL_BASE || "";
var LOCALISATION_URL_BASE = LOCALISATION_URL_BASE || "";
var HAKEMUS_URL_BASE = HAKEMUS_URL_BASE || "";

angular.module('valintaperusteet')
    .controller('mainCtrl', ['$scope', '$routeParams', 'breadcrumbs', 'UserAccessLevels', 'UserModel',
                function ($scope, $routeParams, breadcrumbs, UserAccessLevels, UserModel) {

    $scope.breadcrumbs = breadcrumbs;
    UserAccessLevels.refreshIfNeeded($routeParams.id, $routeParams.hakukohdeOid);
    UserModel.refreshIfNeeded();

}]);




//TARJONTA RESOURCES
app.factory('Haku', function($resource) {
  return $resource(TARJONTA_URL_BASE + "haku?count=500", {}, {
    get: {method: "GET", isArray: true}
  });
});

app.factory('HaunTiedot', function($resource) {
  return $resource(TARJONTA_URL_BASE + "haku/:hakuOid", {hakuOid: "@hakuOid"}, {
    get: {method: "GET"}
  });
});

// HAKU-APP
app.factory('HakemusAvaimet', function($resource) {
    return $resource(HAKEMUS_URL_BASE + "application-system-form-editor/application-system-form/:asId", {asId: "@asId"}, {
        get: {method: "GET", isArray: false}
    });
});

app.factory('HakemusLisakysymykset', function($resource) {
    return $resource(HAKEMUS_URL_BASE + "application-system-form-editor/theme-question/list/:asId", {asId: "@asId"}, {
        get: {method: "GET", isArray: false}
    });
});

//Valintaryhma
app.factory('ValintaperusteetPuu', function($resource) {
return $resource(SERVICE_URL_BASE + "resources/puu", {
      q: "@q",
      hakuOid: "@hakuOid",
      tila: "@tila",
      kohdejoukko: "@kohdejoukko"
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
	    get: {method: "GET", cache: false},
	    post:{method: "POST"},
	    insert: {method: "PUT"},
        query: {method: "GET", isArray: true},
        delete: {method: "DELETE"}
	});
});

app.factory('ParentValintaryhmas', function($resource) {
    return $resource(SERVICE_URL_BASE + "resources/valintaryhma/:parentOid/parents", {parentOid: "@parentOid"}, {
        get: {method: "GET", isArray: true, cache: false}
    });
});

app.factory('ValintaryhmaValinnanvaihe', function($resource) {
return $resource(SERVICE_URL_BASE + "resources/valintaryhma/:oid/valinnanvaihe", {oid: "@oid"}, {
    get: {method: "GET", isArray: true, cache: false}
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
    get: {method: "GET", isArray: true, cache: true}
  });
});

app.factory('KoodistoValintakoekoodi', function($resource) {
  return $resource(KOODISTO_URL_BASE + "json/valintakokeentyyppi/koodi", {}, {
    get: {method: "get", isArray: true, cache: true}
  });
});

app.factory('KoodistoHaunKohdejoukko', function($resource) {
    return $resource(KOODISTO_URL_BASE + "json/haunkohdejoukko/koodi", {}, {
    //return $resource(KOODISTO_URL_BASE + "codeelement/codes/haunkohdejoukko/0", {}, {
        get: {method: "get", isArray: true, cache: true}
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
     get: {method: "GET", isArray: true, cache: false },
     post:{method: "POST"},
     insert: {method: "PUT"}
   });
});

app.factory('Hakukohde', function($resource) {
	return $resource(SERVICE_URL_BASE + "resources/hakukohde/:oid", {oid: "@oid"}, {
    	get: {method: "GET", cache: false},
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
     get: {method: "GET", cache: false},
     post:{method: "POST"},
     delete: {method: "DELETE"}
   });
});
app.factory('ValinnanvaiheValintatapajono', function($resource) {
 return $resource(SERVICE_URL_BASE + "resources/valinnanvaihe/:parentOid/valintatapajono", {parentOid: "@parentOid"}, {
     get: {method: "GET",  isArray: true, cache: false},
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
    get: {method: "GET", isArray: true, cache: false},
    remove: {method: "REMOVE"}
  });
});


//Valintakoe
app.factory('Valintakoe', function($resource) {
  return $resource(SERVICE_URL_BASE + "resources/valintakoe/:valintakoeOid", {valintakoeOid: "@valintakoeOid"}, {
    get: {method: "GET", cache: false},
    update: {method: "POST"},
    delete: {method: "DELETE"}
  });
});


//Valintatapajono
app.factory('Valintatapajono', function($resource) {
 return $resource(SERVICE_URL_BASE + "resources/valintatapajono/:oid", {oid: "@oid"}, {
     get:   {method: "GET", cache: false},
     post:  {method: "POST"},
     delete:{method: "DELETE"}
   });
});
app.factory('ValintatapajonoJarjestyskriteeri', function($resource) {
 return $resource(SERVICE_URL_BASE + "resources/valintatapajono/:parentOid/jarjestyskriteeri", {parentOid: "@parentOid"}, {
     get: {method: "GET", isArray: true, cache: false},
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
     get: {method: "GET", cache: false},
     update: {method: "POST"},
     delete: {method: "DELETE"}
   });
});

app.factory('ValintaryhmaHakijaryhma', function($resource) {
 return $resource(SERVICE_URL_BASE + "resources/valintaryhma/:oid/hakijaryhma", {oid: "@oid"}, {
     get: {method: "GET", isArray: true, cache: false},
     insert: {method: "PUT"}
   });
});

app.factory('HakukohdeHakijaryhma', function($resource) {
 return $resource(SERVICE_URL_BASE + "resources/hakukohde/:oid/hakijaryhma", {oid: "@oid"}, {
     get: {method: "GET", isArray: true, cache: false},
     insert: {method: "PUT"}
   });
});

app.factory('ValintatapajonoHakijaryhma', function($resource) {
 return $resource(SERVICE_URL_BASE + "resources/valintatapajono/:oid/hakijaryhma/:hakijaryhmaOid", {oid: "@oid", hakijaryhmaOid: "@hakijaryhmaOid"}, {
     get: {method: "GET", isArray: true, cache: false},
     insert: {method: "PUT"}
   });
});

app.factory('HakijaryhmanValintatapajonot', function($resource) {
 return $resource(SERVICE_URL_BASE + "resources/hakijaryhma/:oid/valintatapajono", {oid: "@oid", hakijaryhmaOid: "@hakijaryhmaOid"}, {
     get: {method: "GET", isArray: true, cache: false}
   });
});

app.factory('HakijaryhmaValintatapajono', function($resource) {
 return $resource(SERVICE_URL_BASE + "resources/hakijaryhma_valintatapajono/:oid", {oid: "@oid"}, {
     get: {method: "GET", cache: false},
     delete: {method: "DELETE"},
     update: {method: "POST"}
   });
});

app.factory('HakijaryhmaJarjesta', function($resource) {
    return $resource(SERVICE_URL_BASE + "resources/hakijaryhma/jarjesta", {}, {
        post: {method: "POST", isArray: true}
    });
});

app.factory('HakijaryhmaLiita', function($resource) {
    return $resource(SERVICE_URL_BASE + "resources/valintatapajono/:valintatapajonoOid/hakijaryhma/:hakijaryhmaOid", {valintatapajonoOid: "@valintatapajonoOid", hakijaryhmaOid: "@hakijaryhmaOid"}, {
        liita: {method: "POST"}
    });
});

app.factory('HakijaryhmaLiitaHakukohde', function($resource) {
    return $resource(SERVICE_URL_BASE + "resources/hakukohde/:hakukohdeOid/hakijaryhma/:hakijaryhmaOid", {hakukohdeOid: "@hakukohdeOid", hakijaryhmaOid: "@hakijaryhmaOid"}, {
        liita: {method: "POST"}
    });
});

app.factory('HakijaryhmaKopiointi', function($resource) {
    return $resource(SERVICE_URL_BASE + "resources/hakijaryhma/siirra", {}, {put: {method: "PUT"}})
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
  return $resource(TARJONTA_URL_BASE + "haku?count=500", {}, {
    get: {method: "GET", isArray: true, cache:true}
  });
});
app.factory('HaunTiedot', function($resource) {
  return $resource(TARJONTA_URL_BASE + "haku/:hakuOid", {hakuOid: "@hakuOid"}, {
    get: {method: "GET", cache:true}
  });
});
app.factory('TarjontaImport', function($resource) {
    return $resource(VALINTALASKENTAKOOSTE_URL_BASE + "resources/hakuimport/aktivoi", {}, {
        aktivoi: {method: "GET"}
    });
});
app.factory('HakuHakukohdeChildren', function($resource) {
return $resource(TARJONTA_URL_BASE + "haku/:hakuOid/hakukohde?count=99999", {hakuOid: "@hakuOid"}, {
    get: {method: "GET", isArray: true, cache: true}
  });
});
app.factory('TarjontaHaku', function($resource) {
	return $resource(TARJONTA_URL_BASE + "haku/:hakuOid/hakukohdeTulos", {},{
		query:  {method:'GET', isArray:false, cache: true}
	});
});
app.factory('HakukohdeNimi', function($resource) {
    return $resource(TARJONTA_URL_BASE + "hakukohde/:hakukohdeoid/nimi", {hakukohdeoid: "@hakukohdeoid"}, {
     get: {method: "GET", cache: true}
    });
});



app.factory('Organizations', function ($resource) {
    return $resource(ORGANIZATION_SERVICE_URL_BASE + "rest/organisaatio/hae", {}, {
        get: {method: "GET", cache: true}
    });
});

app.factory('OrganizationByOid', function ($resource) {
    return $resource(ORGANIZATION_SERVICE_URL_BASE + "rest/organisaatio/:oid", {oid: "@oid"}, {
        get: {method: "GET", cache: true}
    });
});