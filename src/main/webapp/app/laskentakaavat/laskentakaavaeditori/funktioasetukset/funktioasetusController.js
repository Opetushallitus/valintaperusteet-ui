angular.module('LaskentakaavaEditor')

    .controller('funktiokutsuAsetuksetController', ['$scope', '$q', '$routeParams', '$location', '$timeout', 'Laskentakaava',
        'FunktioNimiService', 'FunktioFactory', 'KaavaValidationService', 'GuidGenerator', 'Hakemusavaimet', 'HakemusavaimetLomake',
        function ($scope, $q, $routeParams, $location, $timeout, Laskentakaava, FunktioNimiService, FunktioFactory,
                  KaavaValidationService, GuidGenerator, Hakemusavaimet, HakemusavaimetLomake) {
        "use strict";

        $scope.funktioFactory = FunktioFactory;

        $scope.$on('showFunktiokutsuAsetukset', function () {
            $scope.show();
        });

        $scope.guidGenerator = GuidGenerator;

        $scope.generateSyoteId = function(valintaperuste) {
            valintaperuste.tunniste = $scope.guidGenerator();
        };

        $scope.getFunktiokutsuName = function (funktiokutsu) {
            if (funktiokutsu.lapsi) {
                return FunktioNimiService.getName(funktiokutsu.lapsi.funktionimi);
            } else {
                return FunktioNimiService.getName(funktiokutsu.funktionimi);
            }
        };

        $scope.saveAsNewLaskentakaava = function (parent, funktiokutsu, newKaavaNimi, newKaavaKuvaus, closeModal) {
            var osakaava = FunktioFactory.createEmptyLaskentakaava($scope.funktioSelection, $routeParams, newKaavaNimi, newKaavaKuvaus);
            $scope.persistOsakaava(osakaava, funktiokutsu, closeModal);
        };

        $scope.persistOsakaava = function (osakaava, funktiokutsu, closeModal) {
            KaavaValidationService.validateTree($scope.model.laskentakaavapuu.funktiokutsu, $scope.errors);
            if ($scope.errors.length === 0) {
                closeModal();
                Laskentakaava.insert({}, osakaava, function (savedKaava) {
                    $scope.funktiokutsuSavedAsLaskentakaava(FunktioFactory.getLaskentakaavaviiteFromLaskentakaava(savedKaava));
                }, function (error) {

                });
            }
        };

        $scope.toggle = false;



        $scope.getHakemusAvaimet = function() {
            var promises = [];

            var def1 = $q.defer();
            promises.push(def1.promise);
            HakemusavaimetLomake.get({hakuoid: "1.2.3.4"}, function(result) {
                def1.resolve();
                $scope.bigdata = result;

                $scope.bigdata.children = [_.last($scope.bigdata.children)];
            }, function(error) {
                def1.reject('Avaimien haku epäonnistui: ', error);
            });

            /*
            var def2 = $q.defer();
            promises.push(def2.promise);
            Hakemusavaimet.query({hakuoid: "1.2.246.562.29.173465377510"}, function(result) {
                def2.resolve();
            }, function(error) {
                def2.reject('Avaimien haku epäonnistui: ', error);
            });
            */

            return promises;
        };



        $scope.promises = $scope.getHakemusAvaimet();
        $q.all($scope.promises).then(function(obj) {

            var fetched = [{"type":"RadioButton","applicationSystemId":"1.2.246.562.29.173465377510","theme":"hakutoiveet.teema","learningOpportunityId":"1.2.246.562.20.13137248202","targetIsGroup":false,"state":"ACTIVE","ownerOrganizationOids":["1.2.246.562.10.56753942459","1.2.246.562.10.39920288212","1.2.246.562.10.00000000001","1.2.246.562.10.82388989657"],"messageText":{"translations":{"fi":"Millä paikkakunnalla haluat osallistua pääsy- ja soveltuvuuskokeeseen?"}},"helpText":{"translations":{"fi":"Valintakoe on kaikilla paikkakunnilla identtinen ja järjestetään samaan aikaan."}},"verboseHelpText":{"translations":{"fi":""}},"requiredFieldValidator":false,"onCompletedPage":false,"options":[{"id":"option_0","optionText":{"translations":{"fi":"Tampere"}}},{"id":"option_1","optionText":{"translations":{"fi":"Turku"}}},{"id":"option_2","optionText":{"translations":{"fi":"Oulu"}}},{"id":"option_3","optionText":{"translations":{"fi":"Helsinki"}}},{"id":"option_4","optionText":{"translations":{"fi":"Joensuu"}}}],"_id":"53b550ace4b00c5103adf89d"},{"type":"TextQuestion","applicationSystemId":"1.2.246.562.29.173465377510","theme":"arvosanat","learningOpportunityId":"1.2.246.562.20.13137248202","targetIsGroup":false,"state":"ACTIVE","ownerOrganizationOids":["1.2.246.562.10.56753942459","1.2.246.562.10.39920288212","1.2.246.562.10.00000000001","1.2.246.562.10.82388989657"],"messageText":{"translations":{"fi":"Mikä biologian arvosana sinulla on lukion päättötodistuksessasi?"}},"helpText":{"translations":{"fi":""}},"verboseHelpText":{"translations":{}},"requiredFieldValidator":true,"onCompletedPage":false,"size":2,"_id":"53b55143e4b00c5103adf89e"},{"type":"CheckBox","applicationSystemId":"1.2.246.562.29.173465377510","theme":"lupatiedot","learningOpportunityId":"1.2.246.562.20.13137248202","targetIsGroup":false,"validators":{"min":"0","max":"3"},"state":"ACTIVE","ownerOrganizationOids":["1.2.246.562.10.56753942459","1.2.246.562.10.39920288212","1.2.246.562.10.00000000001","1.2.246.562.10.82388989657"],"messageText":{"translations":{"fi":"Valitse miten haluat vastaanottaa tietoa hakuprosessista ja opiskelijavalinnan tuloksista"}},"helpText":{"translations":{"fi":"Mikäli et anna tässä lupatietoja, valinnan tulos ilmoitetaan sinulle kirjeellä."}},"verboseHelpText":{"translations":{}},"requiredFieldValidator":false,"onCompletedPage":false,"options":[{"id":"option_0","optionText":{"translations":{"fi":"Haluan vastaanottaa tietoja valinnan etenemisestä sähköpostilla"}}},{"id":"option_1","optionText":{"translations":{"fi":"Tietoni saa julkaista korkeakoulun ovessa"}}},{"id":"option_2","optionText":{"translations":{"fi":"Tietoni saa julkaista korkeakoulun www-sivuilla"}}}],"_id":"53b5525ee4b00c5103adf89f"},{"type":"RadioButton","applicationSystemId":"1.2.246.562.29.173465377510","theme":"hakutoiveet.teema","learningOpportunityId":"1.2.246.562.20.17928538945","targetIsGroup":false,"state":"ACTIVE","ownerOrganizationOids":["1.2.246.562.10.56753942459","1.2.246.562.10.00000000001","1.2.246.562.10.82388989657"],"messageText":{"translations":{"fi":"Millä paikkakunnalla haluat osallistua pääsy- ja soveltuvuuskokeeseen?"}},"helpText":{"translations":{}},"verboseHelpText":{"translations":{}},"requiredFieldValidator":false,"onCompletedPage":false,"options":[{"id":"option_0","optionText":{"translations":{"fi":"Espoo"}}},{"id":"option_1","optionText":{"translations":{"fi":"Helsinki"}}},{"id":"option_2","optionText":{"translations":{"fi":"Vantaa"}}}],"_id":"53b5529be4b00c5103adf8a0"},{"type":"TextQuestion","applicationSystemId":"1.2.246.562.29.173465377510","theme":"arvosanat","learningOpportunityId":"1.2.246.562.20.17928538945","targetIsGroup":false,"state":"ACTIVE","ownerOrganizationOids":["1.2.246.562.10.56753942459","1.2.246.562.10.00000000001","1.2.246.562.10.82388989657"],"messageText":{"translations":{"fi":"Montako fysiikan kurssia olet suorittanut lukion aikana?"}},"helpText":{"translations":{"fi":"Ilmoita pakollisten ja valinnaisten kurssien yhteenlaskettu määrä."}},"verboseHelpText":{"translations":{}},"requiredFieldValidator":true,"onCompletedPage":false,"size":2,"_id":"53b5531ae4b00c5103adf8a1"},{"type":"CheckBox","applicationSystemId":"1.2.246.562.29.173465377510","theme":"lupatiedot","learningOpportunityId":"1.2.246.562.20.17928538945","targetIsGroup":false,"validators":{"min":"1","max":"1"},"state":"ACTIVE","ownerOrganizationOids":["1.2.246.562.10.56753942459","1.2.246.562.10.00000000001","1.2.246.562.10.82388989657"],"messageText":{"translations":{"fi":"Valitse miten haluat vastaanottaa tietoa hakuprosessista ja opiskelijavalinnan tuloksista"}},"helpText":{"translations":{}},"verboseHelpText":{"translations":{}},"requiredFieldValidator":false,"onCompletedPage":false,"options":[{"id":"option_0","optionText":{"translations":{"fi":"Valinnan tuloksen saa julkaista korkeakoulun verkkosivuilla"}}}],"_id":"53b55388e4b00c5103adf8a2"},{"type":"RadioButton","applicationSystemId":"1.2.246.562.29.173465377510","theme":"hakutoiveet.teema","learningOpportunityId":"1.2.246.562.20.645785477510","targetIsGroup":false,"attachmentRequests":[{"header":{"translations":{"fi":"Maol-voitto"}},"description":{"translations":{"fi":"Lähetä kopio todistuksestasi."}},"deliveryDue":1408104000000,"deliveryAddress":{"street":"Hyn osoite","postOffice":"HELSINKI","postCode":"00100"},"attachedToOptionId":"option_0"}],"state":"ACTIVE","ordinal":2,"ownerOrganizationOids":["1.2.246.562.10.94639300915","1.2.246.562.10.39218317368","1.2.246.562.10.00000000001","1.2.246.562.10.53814745062"],"messageText":{"translations":{"fi":"Haen maol-kilpailun voiton perusteella?","sv":"Haen maol-kilpailun voiton perusteella? på svenska"}},"helpText":{"translations":{"sv":"ohjeteksti","fi":"näytöllä näkyvä"}},"verboseHelpText":{"translations":{"sv":"?-merkin takaa avautuva","fi":"?-merkin taakse"}},"requiredFieldValidator":false,"onCompletedPage":false,"options":[{"id":"option_0","optionText":{"translations":{"sv":"Kyllä","fi":"Kyllä"}}},{"id":"option_1","optionText":{"translations":{"sv":"Ei","fi":"Ei"}}}],"_id":"53e47429e4b0d272fdc5d865"},{"type":"TextQuestion","applicationSystemId":"1.2.246.562.29.173465377510","theme":"hakutoiveet.teema","learningOpportunityId":"1.2.246.562.20.645785477510","targetIsGroup":false,"state":"ACTIVE","ordinal":1,"ownerOrganizationOids":["1.2.246.562.10.94639300915","1.2.246.562.10.39218317368","1.2.246.562.10.00000000001","1.2.246.562.10.53814745062"],"messageText":{"translations":{"fi":"Kerro matematiikan arvosanasi?"}},"helpText":{"translations":{"fi":"Sallitut arvot 4-10."}},"verboseHelpText":{"translations":{"fi":"Ei ohjetta"}},"requiredFieldValidator":true,"onCompletedPage":false,"size":2,"_id":"53e47517e4b0d272fdc5d866"}];
            var arr = [];
            _.each(fetched, function(item) {
                arr.push(_.pick(item, '_id', 'messageText'));
            });

            _.each(arr, function(item) {
                item.messageText = item.messageText.translations.fi;
            });
            
            console.log(arr);
        });

    }])

    .controller('laskentakaavaviiteAsetuksetController', ['$scope', 'FunktioService', function ($scope, FunktioService) {
        "use strict";

        $scope.$on('showLaskentakaavaviiteAsetukset', function () {
            $scope.show();
        });

        $scope.getFunktioargumenttiSlotTyyppi = function(parent, funktioargumenttiSlotIndex) {
            return FunktioService.isLukuarvoFunktioSlot(parent, funktioargumenttiSlotIndex) === true ? "LUKUARVOFUNKTIO" : "TOTUUSARVOFUNKTIO";
        };


    }])

    .controller('funktioMenuController', ['$scope', function ($scope) {
        "use strict";

        $scope.$on('hideFunktioMenu', function () {
            $scope.showNewFunktioList.visible = false;
        });
    }])

    .controller('funktiokutsunTallentaminenLaskentakaavanaController', ['$scope', function ($scope) {
        "use strict";

        $scope.$on('showTallennaFunktiokutsuLaskentakaavanaModal', function () {
            $scope.show();
        });
    }]);