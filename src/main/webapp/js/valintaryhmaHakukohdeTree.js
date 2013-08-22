//domain .. this is both, service & domain layer
app.factory('Treemodel', function($resource, RootValintaryhmas, ChildValintaryhmas, RootHakukohde, ChildHakukohdes, HakukohdeKuuluuSijoitteluun) {
    //keep model to yourself
    var model = {nimi: "ROOT", lapsihakukohdeList: []};
    
    
    //and return interface for manipulating the model
    var modelInterface =  {
    	isValintaryhmaLeaf: function(data) {
    		if(data.lapsivalintaryhma===false && (data.lapsihakukohde===false || data.lapsihakukohde===true)) {
    			return true;
    		}
    		return false;
    	},
    	getLapset: function(data) {
    		data.lapset = [];
    		
    		if(data.lapsivalintaryhmaList) {
    			data.lapsivalintaryhmaList.forEach(function(l) {
    				if(data.lapset.indexOf(l) == -1) {
    				data.lapset.push(l);
    				}
    			});
    		}
    		if(data.lapsihakukohdeList) {
    			data.lapsihakukohdeList.forEach(function(l) {
    				
    				if(data.lapset.indexOf(l) == -1) {
    				data.lapset.push(l);
    				}
    			});
    		}
    		return data.lapset;
    	},
    	isFile: function(data) {
    		return !data.lapsivalintaryhma && !data.lapsihakukohde;
    	},
    	isHakukohde: function(data) { 
    		// used to disable nesting -- to prevent putting hakukohde under hakukohde
    		return this.isFile(data);
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
    			if(data.lapsivalintaryhma || this.isValintaryhmaLeaf(data)) {
    				return "valintaryhma_node.html";
    			} else {
    				return "hakukohde_leaf.html";
    			}
    		}
    		return "";
    	},
    	getRootNode:function() {
            return this.getLapset(model);
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
        },
        expandNode:function(node) {
           if( node.lapsivalintaryhma) {
                  ChildValintaryhmas.get({parentOid: node.oid}, function(result) {
                         node.lapsivalintaryhmaList = result;
                   });
           }
           if(node.lapsihakukohde) {
                 ChildHakukohdes.get({oid: node.oid}, function(result) {
                     node.lapsihakukohdeList = result;

                     result.forEach(function(hk){
                         if(hk.oid) {
                             HakukohdeKuuluuSijoitteluun.get({oid: hk.oid}, function(result) {
                                 hk.kuuluuSijoitteluun = result.sijoitteluun;
                             });
                         }
                     });

                  });
           }
        },
        refresh:function() {
        	//get initial listing
            RootValintaryhmas.get({},function(result) {
            	 // lapsivalintaryhmaList lapsihakukohdeList
            	model.lapsivalintaryhmaList = result;
                
                RootHakukohde.get({},function(result) {
                	model.lapsihakukohdeList = result;
                    result.forEach(function(hk){
                    	HakukohdeKuuluuSijoitteluun.get({oid: hk.oid}, function(result) {
                    		hk.kuuluuSijoitteluun = result.sijoitteluun;
                    	});
                    });
                });

            });
        }
    };
    modelInterface.refresh();
    return modelInterface;
});


function ValintaryhmaHakukohdeTreeController($scope, $resource,Treemodel,HakukohdeSiirra) {
	$scope.predicate = 'nimi';
	$scope.domain = Treemodel;
	
	$scope.expandGroup = function($event) {
		$($event.target).closest('li').toggleClass('uiCollapsed').toggleClass('uiExpanded');
	}
	$scope.move = function(index,hakukohdeOid, valintaryhmaOid) {
		$scope.domain.moveNodeInATree(index,hakukohdeOid,valintaryhmaOid);
		
		HakukohdeSiirra.siirra({hakukohdeOid: hakukohdeOid}, valintaryhmaOid, function(result) {
			// onnistui
			//
    	}, function() {
    		alert('Siirto epäonnistui!');
    	});
	}
	
    $scope.expandNode = function(node) {
        if( (node.lapsivalintaryhma && (node.lapsivalintaryhmaList == null || node.lapsivalintaryhmaList.length <= 0) )  ||
            (node.lapsihakukohde && (node.lapsihakukohdeList == null || node.lapsihakukohdeList.length <= 0 ) )) {
        	Treemodel.expandNode(node);
        	node.isVisible = true;
        } else if(node.isVisible != true) {
        	node.isVisible = true;
        } else {
        	node.isVisible = false;
        }
    }

}