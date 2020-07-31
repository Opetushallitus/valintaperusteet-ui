angular
  .module('oph.utils', [])
  .factory('Utils', [
    function () {
      'use strict'
      var utils = {
        hasSameName: function (model, parents, children) {
          var nameFound = false
          if (parents) {
            parents.forEach(function (parent) {
              if (
                parent &&
                parent.nimi === model.valintaryhma.nimi &&
                parent.oid !== model.valintaryhma.oid
              ) {
                nameFound = true
              }
            })
          }
          if (children) {
            children.forEach(function (child) {
              if (
                child.nimi === model.valintaryhma.nimi &&
                child.oid !== model.valintaryhma.oid
              ) {
                nameFound = true
              }
              if (!nameFound && child.alavalintaryhmat) {
                nameFound = utils.hasSameName(
                  model,
                  null,
                  child.alavalintaryhmat
                )
              }
            })
          }
          return nameFound
        },
      }
      return utils
    },
  ])

  .factory('HakemusavaimetLisakysymyksetAvaimet', [
    'UserModel',
    'HakemusavaimetLisakysymykset',
    function (UserModel, HakemusavaimetLisakysymykset) {
      'use strict'
      var parseOptions = function (options, lomake) {
        return _.map(options, function (option) {
          var opt = {}
          if (lomake) {
            opt.id = option.value
            opt.text = option.i18nText.translations.fi
          } else {
            opt.id = option.id
            opt.text = option.optionText.translations.fi
          }
          return opt
        })
      }
      var parseAvaimet = function (haetutAvaimet) {
        var avaimet = []
        _.forEach(haetutAvaimet, function (phase) {
          var obj = {}
          obj.key = phase._id
          if (phase.messageText) {
            obj.value = phase.messageText.translations.fi
          } else {
            obj.value = phase._id
          }
          if (phase.options) {
            obj.options = parseOptions(phase.options, false)
          }
          avaimet.push(obj)
        })
        return avaimet
      }

      var service = {
        parseOptions: parseOptions,
        parseLisakysymysAvaimet: function (hakuoid, model) {
          UserModel.organizationsDeferred.promise.then(
            function () {
              HakemusavaimetLisakysymykset.get(
                { hakuoid: hakuoid, orgId: UserModel.organizationOids[0] },
                function (haetutAvaimet) {
                  model.lisakysymysAvaimet = parseAvaimet(haetutAvaimet)
                },
                function (error) {
                  console.log('lisakysymyksiä ei löytynyt')
                }
              )
            },
            function () {
              HakemusavaimetLisakysymykset.get(
                { hakuoid: hakuoid },
                function (haetutAvaimet) {
                  model.lisakysymysAvaimet = parseAvaimet(haetutAvaimet)
                },
                function (error) {
                  console.log('lisakysymyksiä ei löytynyt')
                }
              )
            }
          )
        },
      }
      return service
    },
  ])
