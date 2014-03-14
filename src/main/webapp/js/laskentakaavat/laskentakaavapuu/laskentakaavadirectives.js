'use strict';

angular.module('LaskentakaavaEditor').directive('kaavadrag', function() {
  return {
    restrict: 'A',
    link: function($scope, iElm, iAttrs, controller) {

      $(iElm[0]).nestedSortable({ 
        disableNesting: "no-nesting",
        cancel: 'cancel',
        listType: 'ul',
        handle: '.icon',
        opacity: 0.5,
        items: 'li',
        revert: 250,
        placeholder: 'placeholder',
        tolerance: 'intersect',
        protectRoot: 'true',
        update: function(event, ui) {
          var item = ui.item;
          var draggedFunktio = item.scope().farg;
          var oldParentFunktio = item.scope().parent;
          var newParentFunktio = ui.item.parent().parent().parent().scope().funktio;
          var index = ui.item.index();

          // jos parentti on nimetyt argumentit -tyyppinen ja funktioargumentteja on jo maksimimäärä -> cancel
          // tai jos siirrettävä funktio ei ole samantyyppinen kuin paikka johon se yritetään tiputtaa
          if(!newParentFunktio.subFunctionCanBeAdded() || !newParentFunktio.isLegalSubFunktio(draggedFunktio, index)) {
            $(iElm[0]).nestedSortable('cancel');  
            return;  
          }        
            

          $scope.$emit('kaavadrag', {
            draggedFunktio: draggedFunktio,
            oldParentFunktio: oldParentFunktio,
            newParentFunktio: newParentFunktio,
            index: index
          });
        }
      });




    }
  };
});
