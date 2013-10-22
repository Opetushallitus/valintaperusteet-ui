//domain .. this is both, service & domain layer
app.factory('Treemodel', function($resource, ValintaperusteetPuu) {

    //and return interface for manipulating the model
    var modelInterface =  {
    valintaperusteList: [],

       search : {q: null,
              haku: null,
               valmiitJaJulkaistut: null
                             },
        filter:'VALMIS JULKAISTU',
         /*
    	getLapset: function(data) {
    		data.lapset = [];
    		if(this.isExpanded(data)) {
                if(data.alavalintaryhmat) {
                   data.lapset = data.lapset.concat(data.alavalintaryhmat);
                }
                if(data.hakukohdeViitteet) {
                 data.lapset= data.lapset.concat(data.hakukohdeViitteet);
                }
           }
    		return data.lapset;
    	},
    	*/
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
        moveNodeInATree:function(index, oid, parent) {
        	console.log("------");
        	var childNode = undefined;
        	var targetNode = model; // initialized as root 
        	var previousNode = undefined;
        	
        	function removeFrom(target, source, nimi) {
        		if(target.indexOf(source) == -1) {
        			console.log("Failed removing from (didn't contain) [" +target.length+ "]" + nimi + " node " + source.nimi);
        		} else {
        			target.splice(target.indexOf(source), 1);
        			console.log("Removing from [" +target.length+ "]" + nimi + " node " + source.nimi);
        		}
        	}
        	function addTo(target, source, nimi) {
        		//target.splice(index, 0, childNode);
        		if(target.indexOf(source) == -1) {
        			target.push(source);
        			console.log("Adding to ["+target.length+"] " + nimi + " node " + source.nimi);
        		} else {
        			console.log("Failed adding to (already in array) [" +target.length+ "]" + nimi + " node " + source.nimi);
        		}
        	}
        	
        	function travel(previous, nodeArray) {
        		nodeArray.forEach(function(node){
        			if(oid === node.oid) {
        				childNode = node;
        				console.log("Child and previous node catched! " + node.nimi);
        				previousNode = previous;
        			}
        			if(parent === node.oid) {
        				console.log("Parent catched! " + node.nimi );
        				targetNode = node;
        			}
        			if(node.lapset) {
            			travel(node,node.lapset);
            		}
        		});
        	}
        	travel(targetNode,this.getLapset(model));
        	if(previousNode === targetNode) {
        		return false;
        	}
        	if(previousNode.lapsihakukohdeList === undefined) {
        		previousNode.lapsihakukohdeList = [];
        	}
        	removeFrom(previousNode.lapsihakukohdeList, childNode, previousNode.nimi);
        	previousNode.lapsihakukohde = previousNode.lapsihakukohdeList.length != 0;
        	if(targetNode.lapsihakukohdeList === undefined) {
        		targetNode.lapsihakukohdeList = [];
        	}
        	addTo(targetNode.lapsihakukohdeList, childNode, targetNode.nimi);
        	targetNode.lapsihakukohde = targetNode.lapsihakukohdeList.length != 0;
        	targetNode.isVisible = true;
        	return true;
        },
        sup:function() {

                    	modelInterface.valintaperusteList = 0;


            },
        refresh:function() {
            var hakuoid = null;
            if(this.search.haku) {
                hakuoid = this.search.haku.oid;
            }
            ValintaperusteetPuu.get({
                q: this.search.q,
                hakuOid: hakuoid,
                tila: this.search.tila
            },function(result) {
            	modelInterface.valintaperusteList = result;
            });
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
	$scope.move = function(index,hakukohdeOid, valintaryhmaOid,item) {
		if($scope.domain.moveNodeInATree(index,hakukohdeOid,valintaryhmaOid)) {
			item.remove();
		}
		
		HakukohdeSiirra.siirra({hakukohdeOid: hakukohdeOid}, valintaryhmaOid, function(result) {
			// onnistui
			//
    	}, function() {
    		alert('Siirto epäonnistui!');
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


}