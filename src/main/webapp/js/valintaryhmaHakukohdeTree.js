//domain .. this is both, service & domain layer
app.factory('Treemodel', function($resource, ValintaperusteetPuu) {

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
        //rest
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
            var list = modelInterface.valintaperusteList;
                  modelInterface.valintaperusteList = [];
                  var recursion = function(item) {
                      item.isVisible = true;
                      if(item.alavalintaryhmat)  item.alavalintaryhmat.forEach(recursion);
                  }
                list.forEach(recursion);
                modelInterface.valintaperusteList = list;
                modelInterface.update();

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
                }
                if(item.tyyppi == 'HAKUKOHDE') {
                   modelInterface.tilasto.hakukohteita++;
                   modelInterface.hakukohteet.push(item);
                 }
                if(item.alavalintaryhmat)  for(var i=0; i<item.alavalintaryhmat.length;i++)  recursion(item.alavalintaryhmat[i],  item);
                if(item.hakukohdeViitteet) for(var i=0; i<item.hakukohdeViitteet.length;i++) recursion(item.hakukohdeViitteet[i], item);
            }

          for(var i=0; i<list.length;i++) recursion(list[i]);
          modelInterface.valintaperusteList = list;
        }

    };
    modelInterface.refresh();
    return modelInterface;
});


function ValintaryhmaHakukohdeTreeController($scope, $resource,Treemodel,HakukohdeSiirra, HakuModel) {
	$scope.predicate = 'nimi';
	$scope.domain = Treemodel;

    $scope.hakuModel = HakuModel;
    $scope.hakuModel.init();

	$scope.expandGroup = function($event) {
		$($event.target).closest('li').toggleClass('uiCollapsed').toggleClass('uiExpanded');
	}



	$scope.move = function(index, hakukohdeOid, valintaryhmaOid, item) {

        console.log("siirto");
	    console.log(index);
	    console.log("Hakukohde oid :"  + hakukohdeOid);
	    console.log("Valintaryhmaoidi olisi sit :" + valintaryhmaOid);
	    console.log(item);


		HakukohdeSiirra.siirra({hakukohdeOid: hakukohdeOid}, valintaryhmaOid, function(result) {

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