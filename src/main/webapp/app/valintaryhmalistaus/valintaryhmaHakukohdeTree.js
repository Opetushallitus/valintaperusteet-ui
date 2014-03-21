//domain .. this is both, service & domain layer
app.factory('Treemodel', function($resource, ValintaperusteetPuu, AuthService) {

    //and return interface for manipulating the model
    var modelInterface =  {
       //models
       valintaperusteList: [],
       hakukohteet: [],
       search : {   q: null,
                    haku: null,
                    vainValmiitJaJulkaistut: true,
                    vainHakukohteitaSisaltavatRyhmat: true,
                    vainHakukohteet: null,
                    valintaryhmatAuki: null
        },
        tilasto: {
                    valintaryhmia: 0,
                    hakukohteita: 0,
                    valintaryhmiaNakyvissa: 0,
                    hakukohteitaNakyvissa: 0
        },
        //methods
    	isFile: function(data) {
    		return data.hakukohdeViitteet == 0 && data.alavalintaryhmat == 0;
    	},
    	isHakukohde: function(data) { 
    	   return data.tyyppi == 'HAKUKOHDE';
    	},
    	noNesting: function(data) {
    		if(this.isHakukohde(data)) {
    			return "noNesting";
    		} else {
    			return "";
    		}
    	},
    	isExpanded: function(data) {
    		if(this.isFile(data)) { // force file always open!
    			return true;
    		}
    		return data.isVisible;
    	},
    	isCollapsed: function(data) {
    		return !this.isExpanded(data);
    	},
    	getTemplate: function(data) {
    		if(data) {
    			if(data.tyyppi == 'VALINTARYHMA') {
    				return "valintaryhma_node.html";
    			} else {
    				return "hakukohde_leaf.html";
    			}
    		}
    		return "";
    	},
        refresh:function() {
            var hakuoid = null;
            if(this.search.haku) {
                hakuoid = this.search.haku.oid;
            }
            var tila=null;
            if(this.search.vainValmiitJaJulkaistut) {
                tila = ["VALMIS", "JULKAISTU"];
            }
            ValintaperusteetPuu.get({
                q: this.search.q,
                hakuOid: hakuoid,
                tila: tila
            },function(result) {
            	modelInterface.valintaperusteList = result;
            	modelInterface.update();
            });
        },
        expandTree:function() {
            modelInterface.forEachValintaryhma(function(item) {
                item.isVisible = true;
            });
        },
        forEachValintaryhma:function(f) {
            var recursion = function(item, f) {
                f(item);
                if(item.alavalintaryhmat) for(var i=0; i<item.alavalintaryhmat.length;i++)  recursion(item.alavalintaryhmat[i],  f);
            }
           for(var i=0; i<modelInterface.valintaperusteList.length;i++) recursion(modelInterface.valintaperusteList[i],  f);
        },
        getHakukohde:function(oid) {
            for(i=0;i<modelInterface.hakukohteet.length;i++) {
                if(oid == modelInterface.hakukohteet[i].oid) {
                    return modelInterface.hakukohteet[i];
                }
            }
        },
       getValintaryhma:function(oid) {
            var valintaryhma = null;
            modelInterface.forEachValintaryhma(function(item) {
                if(item.oid == oid) valintaryhma = item;
            });
            return valintaryhma;
        },
        update:function() {
            var list = modelInterface.valintaperusteList;
            modelInterface.valintaperusteList = [];
            modelInterface.hakukohteet = [];
            modelInterface.tilasto.valintaryhmia = 0;
            modelInterface.tilasto.hakukohteita = 0;
            modelInterface.tilasto.valintaryhmiaNakyvissa = 0;
            modelInterface.tilasto.hakukohteitaNakyvissa = 0;


            var recursion = function(item, previousItem) {
                if(previousItem != null) {
                    item.ylavalintaryhma = previousItem;
                }
                item.getParents = function() {
                  i = this.ylavalintaryhma;
                  arr = [];
                  while(i != null) {
                     arr.unshift(i);
                     i = i.ylavalintaryhma;
                  }
                  return arr;
                };

                if(item.tyyppi == 'VALINTARYHMA') {
                  modelInterface.tilasto.valintaryhmia++;
                  AuthService.getOrganizations("APP_VALINTAPERUSTEET").then(function(organisations){
                      "use strict";
                      item.access = false;
                      organisations.forEach(function(org){
                          if(item.organisaatiot.length > 0) {
                              item.organisaatiot.forEach(function(org2) {

                                  if(org2.parentOidPath != null && org2.parentOidPath.indexOf(org) > -1) {
                                      item.access = true;
                                  }
                              });
                          } else {
                              item.access = true;
                          }
                      });
                  });
                }
                if(item.tyyppi == 'HAKUKOHDE') {
                   modelInterface.tilasto.hakukohteita++;
                   modelInterface.hakukohteet.push(item);
                }
                if(item.alavalintaryhmat)  for(var i=0; i<item.alavalintaryhmat.length;i++)  recursion(item.alavalintaryhmat[i],  item);
                if(item.hakukohdeViitteet) for(var i=0; i<item.hakukohdeViitteet.length;i++) recursion(item.hakukohdeViitteet[i], item);
            }
            for(var i=0; i<list.length;i++) recursion(list[i]);

            modelInterface.hakukohteet.forEach(function(hakukohde){
              hakukohde.sisaltaaHakukohteita = true;
              var parent = hakukohde.ylavalintaryhma;
              while(parent != null) {
                parent.sisaltaaHakukohteita = true;
                parent = parent.ylavalintaryhma;
              }
            });

          modelInterface.valintaperusteList = list;
        }

    };
    modelInterface.refresh();
    return modelInterface;
});


function ValintaryhmaHakukohdeTreeController($scope, Treemodel, HakukohdeSiirra, HakuModel) {
	$scope.predicate = 'nimi';
	$scope.domain = Treemodel;

    $scope.hakuModel = HakuModel;
    $scope.hakuModel.init();

    $scope.hakukohteetListingLimit = 100;
    $scope.lazyLoading = function() {
        $scope.hakukohteetListingLimit +=100;
    }

	$scope.expandGroup = function($event) {
		$($event.target).closest('li').toggleClass('uiCollapsed').toggleClass('uiExpanded');
	}

	$scope.move = function(index, hakukohdeOid, valintaryhmaOid, item) {

     

        HakukohdeSiirra.siirra({hakukohdeOid: hakukohdeOid}, valintaryhmaOid, function(result) {
            //var hakukohde = Treemodel.getHakukohde(hakukohdeOid);
            //var parentNode = hakukohde.ylavalintaryhma;
            //var newParentNode = Treemodel.getValintaryhma(valintaryhmaOid);
    	}, function() {
              // show error
    	});

	}

	$scope.addClass = function(cssClass, ehto) {
		if(ehto) {
			return cssClass;
		} else {
			return "";
		}
	}
	
    $scope.expandNode = function(node) {
        if( (node.alavalintaryhmat && node.alavalintaryhmat.length > 0)  ||
            (node.hakukohdeViitteet && node.hakukohdeViitteet.length > 0 )  ) {
            if(node.isVisible != true) {
                node.isVisible = true;

                // aukaisee alitason, jos ei ole liikaa tavaraa
                var iter = function(ala) {
                    ala.forEach(function(ala){
                        "use strict";
                        if(!ala.alavalintaryhmat || ala.alavalintaryhmat.length < 4) {
                            ala.isVisible = true;
                            iter(ala.alavalintaryhmat);
                        }
                    });
                }
                if(node.alavalintaryhmat.length < 4) {
                    iter(node.alavalintaryhmat);
                }


            } else {
                node.isVisible = false;
            }
        }
    }

    $scope.updateDomain = function() {
        Treemodel.refresh();
    }

    $scope.expandTree = function() {
        Treemodel.expandTree();
    }

}