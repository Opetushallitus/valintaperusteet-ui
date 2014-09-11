angular.module('oph.utils', [])
    .factory('Utils',[ function () {
        "use strict";
        var utils =
        {
            hasSameName: function (model, parents, children) {
                var nameFound=false;
                if (parents) {
                    parents.forEach(function (parent) {
                        if (parent && parent.nimi === model.valintaryhma.nimi && parent.oid !== model.valintaryhma.oid) {
                            nameFound = true;
                        }
                    });
                }
                if (children) {
                    children.forEach(function (child) {
                        if (child.nimi === model.valintaryhma.nimi && child.oid !== model.valintaryhma.oid) {
                            nameFound = true;
                        }
                        if (!nameFound && child.alavalintaryhmat) {
                            nameFound = utils.hasSameName(model, null, child.alavalintaryhmat);
                        }
                    });
                }
                return nameFound;

            }
        };
        return utils;
    }]);