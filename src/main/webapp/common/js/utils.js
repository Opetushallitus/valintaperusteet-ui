angular.module('oph.utils', [])
    .factory('Utils',['Treemodel',  function (Treemodel) {
        "use strict";
        var utils =
        {
            checkAlavalintaryhmaForSameName: function (model, ryhma) {
                var returnValue = false;

                ryhma.forEach(function (valinta) {
                    if (!returnValue) {
                        if (valinta.nimi === model.valintaryhma.nimi && valinta.oid !== model.valintaryhma.oid) {
                            returnValue = true;
                        }
                        if (!returnValue && valinta.alavalintaryhmat.length > 0) {
                            returnValue = utils.checkAlavalintaryhmaForSameName(model, valinta.alavalintaryhmat);
                        }
                    }
                });


                return returnValue;
            },
            hasSameName: function (model, parentoid) {
                var returnValue = false;

                Treemodel.valintaperusteList.forEach(function (valinta) {
                    if (!returnValue && valinta.tyyppi === "VALINTARYHMA") {
                        if (!model.parentOid) {
                            if (valinta.nimi === model.valintaryhma.nimi && valinta.oid !== model.valintaryhma.oid) {
                                returnValue = true;
                            }
                        } else {
                            if (!returnValue && parentoid === valinta.oid && valinta.oid !== model.valintaryhma.oid) {
                                if (valinta.nimi === model.valintaryhma.nimi) {
                                    returnValue = true;
                                }
                                if (!returnValue && valinta.alavalintaryhmat.length > 0) {
                                    returnValue = utils.checkAlavalintaryhmaForSameName(model, valinta.alavalintaryhmat);
                                }
                            }

                        }
                    }
                });

                return returnValue;
            }
        };
        return utils;
    }]);