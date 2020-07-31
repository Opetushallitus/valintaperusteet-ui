angular
  .module('oph-roles')

  .factory('MyRolesModel', [
    '$q',
    '$http',
    'TestUsers',
    function ($q, $http, TestUsers) {
      var deferred = $q.defer()

      var factory = (function () {
        var instance = {}
        instance.myroles = []

        //kk-käyttäjä
        //instance.myroles = TestUsers.kkCrud;
        //deferred.resolve(instance);
        $http.get(window.url('cas.myroles')).success(function (result) {
          instance.myroles = result
          deferred.resolve(instance)
        })

        return instance
      })()

      return deferred.promise
    },
  ])

  .service('TestUsers', [
    function () {
      //korkeakoulukäyttäjä, CRUD-oikeudet APP_VALINTAPERUSTEETKK (CRUD organisaatioihin 1.2.246.562.10.64582714578 ja 1.2.246.562.10.69981965515)
      this.kkCrud = [
        'USER_mallikas',
        'VIRKAILIJA',
        'LANG_fi',
        'APP_HAKUJENHALLINTA',
        'APP_HAKUJENHALLINTA_CRUD',
        'APP_HAKUJENHALLINTA_CRUD_1.2.246.562.10.64582714578',
        'APP_VALINTAPERUSTEKUVAUSTENHALLINTA_KK',
        'APP_VALINTAPERUSTEKUVAUSTENHALLINTA_KK_CRUD',
        'APP_VALINTAPERUSTEKUVAUSTENHALLINTA_KK_CRUD_1.2.246.562.10.64582714578',
        'APP_SIJOITTELU',
        'APP_SIJOITTELU_READ',
        'APP_SIJOITTELU_READ_1.2.246.562.10.64582714578',
        'APP_ORGANISAATIOHALLINTA',
        'APP_ORGANISAATIOHALLINTA_CRUD',
        'APP_ORGANISAATIOHALLINTA_CRUD_1.2.246.562.10.64582714578',
        'APP_ORGANISAATIOHALLINTA',
        'APP_ORGANISAATIOHALLINTA_RYHMA',
        'APP_ORGANISAATIOHALLINTA_RYHMA_1.2.246.562.10.64582714578',
        'APP_OID',
        'APP_OID_READ',
        'APP_OID_READ_1.2.246.562.10.64582714578',
        'APP_VALINTOJENTOTEUTTAMINENKK',
        'APP_VALINTOJENTOTEUTTAMINENKK_CRUD',
        'APP_VALINTOJENTOTEUTTAMINENKK_CRUD_1.2.246.562.10.64582714578',
        'APP_HAKULOMAKKEENHALLINTA',
        'APP_HAKULOMAKKEENHALLINTA_CRUD',
        'APP_HAKULOMAKKEENHALLINTA_CRUD_1.2.246.562.10.64582714578',
        'APP_OMATTIEDOT',
        'APP_OMATTIEDOT_READ_UPDATE',
        'APP_OMATTIEDOT_READ_UPDATE_1.2.246.562.10.64582714578',
        'APP_RAPORTOINTI',
        'APP_RAPORTOINTI_KK',
        'APP_RAPORTOINTI_KK_1.2.246.562.10.64582714578',
        'APP_HENKILONHALLINTA',
        'APP_HENKILONHALLINTA_READ',
        'APP_HENKILONHALLINTA_READ_1.2.246.562.10.64582714578',
        'APP_SUORITUSREKISTERI',
        'APP_SUORITUSREKISTERI_CRUD',
        'APP_SUORITUSREKISTERI_CRUD_1.2.246.562.10.64582714578',
        'APP_VALINTAPERUSTEETKK',
        'APP_VALINTAPERUSTEETKK_CRUD',
        'APP_VALINTAPERUSTEETKK_CRUD_1.2.246.562.10.64582714578',
        'APP_VALINTOJENTOTEUTTAMINEN',
        'APP_VALINTOJENTOTEUTTAMINEN_CRUD',
        'APP_VALINTOJENTOTEUTTAMINEN_CRUD_1.2.246.562.10.64582714578',
        'APP_HAKEMUS',
        'APP_HAKEMUS_CRUD',
        'APP_HAKEMUS_CRUD_1.2.246.562.10.64582714578',
        'APP_KKHAKUVIRKAILIJA',
        'APP_KKHAKUVIRKAILIJA_CRUD',
        'APP_KKHAKUVIRKAILIJA_CRUD_1.2.246.562.10.64582714578',
        'APP_TARJONTA',
        'APP_TARJONTA_CRUD',
        'APP_TARJONTA_CRUD_1.2.246.562.10.64582714578',
        'APP_VALINTAPERUSTEET',
        'APP_VALINTAPERUSTEET_CRUD',
        'APP_VALINTAPERUSTEET_CRUD_1.2.246.562.10.64582714578',
        'APP_TARJONTA_KK',
        'APP_TARJONTA_KK_CRUD',
        'APP_TARJONTA_KK_CRUD_1.2.246.562.10.64582714578',
        'APP_HAKEMUS',
        'APP_HAKEMUS_LISATIETORU',
        'APP_HAKEMUS_LISATIETORU_1.2.246.562.10.64582714578',
        'APP_VALINTAPERUSTEKUVAUSTENHALLINTA',
        'APP_VALINTAPERUSTEKUVAUSTENHALLINTA_CRUD',
        'APP_VALINTAPERUSTEKUVAUSTENHALLINTA_CRUD_1.2.246.562.10.64582714578',
        'APP_HAKUJENHALLINTA',
        'APP_HAKUJENHALLINTA_CRUD',
        'APP_HAKUJENHALLINTA_CRUD_1.2.246.562.10.69981965515',
        'APP_VALINTAPERUSTEKUVAUSTENHALLINTA_KK',
        'APP_VALINTAPERUSTEKUVAUSTENHALLINTA_KK_CRUD',
        'APP_VALINTAPERUSTEKUVAUSTENHALLINTA_KK_CRUD_1.2.246.562.10.69981965515',
        'APP_SIJOITTELU',
        'APP_SIJOITTELU_READ',
        'APP_SIJOITTELU_READ_1.2.246.562.10.69981965515',
        'APP_ORGANISAATIOHALLINTA',
        'APP_ORGANISAATIOHALLINTA_CRUD',
        'APP_ORGANISAATIOHALLINTA_CRUD_1.2.246.562.10.69981965515',
        'APP_ORGANISAATIOHALLINTA',
        'APP_ORGANISAATIOHALLINTA_RYHMA',
        'APP_ORGANISAATIOHALLINTA_RYHMA_1.2.246.562.10.69981965515',
        'APP_OID',
        'APP_OID_READ',
        'APP_OID_READ_1.2.246.562.10.69981965515',
        'APP_VALINTOJENTOTEUTTAMINENKK',
        'APP_VALINTOJENTOTEUTTAMINENKK_CRUD',
        'APP_VALINTOJENTOTEUTTAMINENKK_CRUD_1.2.246.562.10.69981965515',
        'APP_HAKULOMAKKEENHALLINTA',
        'APP_HAKULOMAKKEENHALLINTA_CRUD',
        'APP_HAKULOMAKKEENHALLINTA_CRUD_1.2.246.562.10.69981965515',
        'APP_OMATTIEDOT',
        'APP_OMATTIEDOT_READ_UPDATE',
        'APP_OMATTIEDOT_READ_UPDATE_1.2.246.562.10.69981965515',
        'APP_RAPORTOINTI',
        'APP_RAPORTOINTI_KK',
        'APP_RAPORTOINTI_KK_1.2.246.562.10.69981965515',
        'APP_HENKILONHALLINTA',
        'APP_HENKILONHALLINTA_READ',
        'APP_HENKILONHALLINTA_READ_1.2.246.562.10.69981965515',
        'APP_SUORITUSREKISTERI',
        'APP_SUORITUSREKISTERI_CRUD',
        'APP_SUORITUSREKISTERI_CRUD_1.2.246.562.10.69981965515',
        'APP_VALINTAPERUSTEETKK',
        'APP_VALINTAPERUSTEETKK_CRUD',
        'APP_VALINTAPERUSTEETKK_CRUD_1.2.246.562.10.69981965515',
        'APP_VALINTOJENTOTEUTTAMINEN',
        'APP_VALINTOJENTOTEUTTAMINEN_CRUD',
        'APP_VALINTOJENTOTEUTTAMINEN_CRUD_1.2.246.562.10.69981965515',
        'APP_HAKEMUS',
        'APP_HAKEMUS_CRUD',
        'APP_HAKEMUS_CRUD_1.2.246.562.10.69981965515',
        'APP_KKHAKUVIRKAILIJA',
        'APP_KKHAKUVIRKAILIJA_CRUD',
        'APP_KKHAKUVIRKAILIJA_CRUD_1.2.246.562.10.69981965515',
        'APP_TARJONTA',
        'APP_TARJONTA_CRUD',
        'APP_TARJONTA_CRUD_1.2.246.562.10.69981965515',
        'APP_VALINTAPERUSTEET',
        'APP_VALINTAPERUSTEET_CRUD',
        'APP_VALINTAPERUSTEET_CRUD_1.2.246.562.10.69981965515',
        'APP_TARJONTA_KK',
        'APP_TARJONTA_KK_CRUD',
        'APP_TARJONTA_KK_CRUD_1.2.246.562.10.69981965515',
        'APP_HAKEMUS',
        'APP_HAKEMUS_LISATIETORU',
        'APP_HAKEMUS_LISATIETORU_1.2.246.562.10.69981965515',
        'APP_VALINTAPERUSTEKUVAUSTENHALLINTA',
        'APP_VALINTAPERUSTEKUVAUSTENHALLINTA_CRUD',
        'APP_VALINTAPERUSTEKUVAUSTENHALLINTA_CRUD_1.2.246.562.10.69981965515',
        'APP_VALINTAPERUSTEET_READ_1.2.246.562.10.64582714578',
      ]

      //korkeakoulukäyttäjä, READ_UPDATE-oikeudet APP_VALINTAPERUSTEETKK (READ_UPDATE organisaatioihin 1.2.246.562.10.64582714578 ja 1.2.246.562.10.69981965515)
      this.kkUpdate = [
        'USER_mallikas',
        'VIRKAILIJA',
        'LANG_fi',
        'APP_HAKUJENHALLINTA',
        'APP_HAKUJENHALLINTA_CRUD',
        'APP_HAKUJENHALLINTA_CRUD_1.2.246.562.10.64582714578',
        'APP_VALINTAPERUSTEKUVAUSTENHALLINTA_KK',
        'APP_VALINTAPERUSTEKUVAUSTENHALLINTA_KK_CRUD',
        'APP_VALINTAPERUSTEKUVAUSTENHALLINTA_KK_CRUD_1.2.246.562.10.64582714578',
        'APP_SIJOITTELU',
        'APP_SIJOITTELU_READ',
        'APP_SIJOITTELU_READ_1.2.246.562.10.64582714578',
        'APP_ORGANISAATIOHALLINTA',
        'APP_ORGANISAATIOHALLINTA_CRUD',
        'APP_ORGANISAATIOHALLINTA_CRUD_1.2.246.562.10.64582714578',
        'APP_ORGANISAATIOHALLINTA',
        'APP_ORGANISAATIOHALLINTA_RYHMA',
        'APP_ORGANISAATIOHALLINTA_RYHMA_1.2.246.562.10.64582714578',
        'APP_OID',
        'APP_OID_READ',
        'APP_OID_READ_1.2.246.562.10.64582714578',
        'APP_VALINTOJENTOTEUTTAMINENKK',
        'APP_VALINTOJENTOTEUTTAMINENKK_CRUD',
        'APP_VALINTOJENTOTEUTTAMINENKK_CRUD_1.2.246.562.10.64582714578',
        'APP_HAKULOMAKKEENHALLINTA',
        'APP_HAKULOMAKKEENHALLINTA_CRUD',
        'APP_HAKULOMAKKEENHALLINTA_CRUD_1.2.246.562.10.64582714578',
        'APP_OMATTIEDOT',
        'APP_OMATTIEDOT_READ_UPDATE',
        'APP_OMATTIEDOT_READ_UPDATE_1.2.246.562.10.64582714578',
        'APP_RAPORTOINTI',
        'APP_RAPORTOINTI_KK',
        'APP_RAPORTOINTI_KK_1.2.246.562.10.64582714578',
        'APP_HENKILONHALLINTA',
        'APP_HENKILONHALLINTA_READ',
        'APP_HENKILONHALLINTA_READ_1.2.246.562.10.64582714578',
        'APP_SUORITUSREKISTERI',
        'APP_SUORITUSREKISTERI_CRUD',
        'APP_SUORITUSREKISTERI_CRUD_1.2.246.562.10.64582714578',
        'APP_VALINTAPERUSTEETKK',
        'APP_VALINTAPERUSTEETKK_READ_UPDATE',
        'APP_VALINTAPERUSTEETKK_READ_UPDATE_1.2.246.562.10.64582714578',
        'APP_VALINTOJENTOTEUTTAMINEN',
        'APP_VALINTOJENTOTEUTTAMINEN_CRUD',
        'APP_VALINTOJENTOTEUTTAMINEN_CRUD_1.2.246.562.10.64582714578',
        'APP_HAKEMUS',
        'APP_HAKEMUS_CRUD',
        'APP_HAKEMUS_CRUD_1.2.246.562.10.64582714578',
        'APP_KKHAKUVIRKAILIJA',
        'APP_KKHAKUVIRKAILIJA_CRUD',
        'APP_KKHAKUVIRKAILIJA_CRUD_1.2.246.562.10.64582714578',
        'APP_TARJONTA',
        'APP_TARJONTA_CRUD',
        'APP_TARJONTA_CRUD_1.2.246.562.10.64582714578',
        'APP_VALINTAPERUSTEET',
        'APP_VALINTAPERUSTEET_READ_UPDATE',
        'APP_VALINTAPERUSTEET_READ_UPDATE_1.2.246.562.10.64582714578',
        'APP_TARJONTA_KK',
        'APP_TARJONTA_KK_CRUD',
        'APP_TARJONTA_KK_CRUD_1.2.246.562.10.64582714578',
        'APP_HAKEMUS',
        'APP_HAKEMUS_LISATIETORU',
        'APP_HAKEMUS_LISATIETORU_1.2.246.562.10.64582714578',
        'APP_VALINTAPERUSTEKUVAUSTENHALLINTA',
        'APP_VALINTAPERUSTEKUVAUSTENHALLINTA_CRUD',
        'APP_VALINTAPERUSTEKUVAUSTENHALLINTA_CRUD_1.2.246.562.10.64582714578',
        'APP_HAKUJENHALLINTA',
        'APP_HAKUJENHALLINTA_CRUD',
        'APP_HAKUJENHALLINTA_CRUD_1.2.246.562.10.69981965515',
        'APP_VALINTAPERUSTEKUVAUSTENHALLINTA_KK',
        'APP_VALINTAPERUSTEKUVAUSTENHALLINTA_KK_CRUD',
        'APP_VALINTAPERUSTEKUVAUSTENHALLINTA_KK_CRUD_1.2.246.562.10.69981965515',
        'APP_SIJOITTELU',
        'APP_SIJOITTELU_READ',
        'APP_SIJOITTELU_READ_1.2.246.562.10.69981965515',
        'APP_ORGANISAATIOHALLINTA',
        'APP_ORGANISAATIOHALLINTA_CRUD',
        'APP_ORGANISAATIOHALLINTA_CRUD_1.2.246.562.10.69981965515',
        'APP_ORGANISAATIOHALLINTA',
        'APP_ORGANISAATIOHALLINTA_RYHMA',
        'APP_ORGANISAATIOHALLINTA_RYHMA_1.2.246.562.10.69981965515',
        'APP_OID',
        'APP_OID_READ',
        'APP_OID_READ_1.2.246.562.10.69981965515',
        'APP_VALINTOJENTOTEUTTAMINENKK',
        'APP_VALINTOJENTOTEUTTAMINENKK_CRUD',
        'APP_VALINTOJENTOTEUTTAMINENKK_CRUD_1.2.246.562.10.69981965515',
        'APP_HAKULOMAKKEENHALLINTA',
        'APP_HAKULOMAKKEENHALLINTA_CRUD',
        'APP_HAKULOMAKKEENHALLINTA_CRUD_1.2.246.562.10.69981965515',
        'APP_OMATTIEDOT',
        'APP_OMATTIEDOT_READ_UPDATE',
        'APP_OMATTIEDOT_READ_UPDATE_1.2.246.562.10.69981965515',
        'APP_RAPORTOINTI',
        'APP_RAPORTOINTI_KK',
        'APP_RAPORTOINTI_KK_1.2.246.562.10.69981965515',
        'APP_HENKILONHALLINTA',
        'APP_HENKILONHALLINTA_READ',
        'APP_HENKILONHALLINTA_READ_1.2.246.562.10.69981965515',
        'APP_SUORITUSREKISTERI',
        'APP_SUORITUSREKISTERI_CRUD',
        'APP_SUORITUSREKISTERI_CRUD_1.2.246.562.10.69981965515',
        'APP_VALINTAPERUSTEETKK',
        'APP_VALINTAPERUSTEETKK_CRUD',
        'APP_VALINTAPERUSTEETKK_CRUD_1.2.246.562.10.69981965515',
        'APP_VALINTOJENTOTEUTTAMINEN',
        'APP_VALINTOJENTOTEUTTAMINEN_CRUD',
        'APP_VALINTOJENTOTEUTTAMINEN_CRUD_1.2.246.562.10.69981965515',
        'APP_HAKEMUS',
        'APP_HAKEMUS_CRUD',
        'APP_HAKEMUS_CRUD_1.2.246.562.10.69981965515',
        'APP_KKHAKUVIRKAILIJA',
        'APP_KKHAKUVIRKAILIJA_CRUD',
        'APP_KKHAKUVIRKAILIJA_CRUD_1.2.246.562.10.69981965515',
        'APP_TARJONTA',
        'APP_TARJONTA_CRUD',
        'APP_TARJONTA_CRUD_1.2.246.562.10.69981965515',
        'APP_VALINTAPERUSTEET',
        'APP_VALINTAPERUSTEET_READ_UPDATE',
        'APP_VALINTAPERUSTEET_READ_UPDATE_1.2.246.562.10.69981965515',
        'APP_TARJONTA_KK',
        'APP_TARJONTA_KK_CRUD',
        'APP_TARJONTA_KK_CRUD_1.2.246.562.10.69981965515',
        'APP_HAKEMUS',
        'APP_HAKEMUS_LISATIETORU',
        'APP_HAKEMUS_LISATIETORU_1.2.246.562.10.69981965515',
        'APP_VALINTAPERUSTEKUVAUSTENHALLINTA',
        'APP_VALINTAPERUSTEKUVAUSTENHALLINTA_CRUD',
        'APP_VALINTAPERUSTEKUVAUSTENHALLINTA_CRUD_1.2.246.562.10.69981965515',
      ]

      //korkeakoulukäyttäjä, READ-oikeudet APP_VALINTAPERUSTEETKK (READ organisaatioihin 1.2.246.562.10.64582714578 ja 1.2.246.562.10.69981965515)
      this.kkRead = [
        'USER_mallikas',
        'VIRKAILIJA',
        'LANG_fi',
        'APP_HAKUJENHALLINTA',
        'APP_HAKUJENHALLINTA_CRUD',
        'APP_HAKUJENHALLINTA_CRUD_1.2.246.562.10.64582714578',
        'APP_VALINTAPERUSTEKUVAUSTENHALLINTA_KK',
        'APP_VALINTAPERUSTEKUVAUSTENHALLINTA_KK_CRUD',
        'APP_VALINTAPERUSTEKUVAUSTENHALLINTA_KK_CRUD_1.2.246.562.10.64582714578',
        'APP_SIJOITTELU',
        'APP_SIJOITTELU_READ',
        'APP_SIJOITTELU_READ_1.2.246.562.10.64582714578',
        'APP_ORGANISAATIOHALLINTA',
        'APP_ORGANISAATIOHALLINTA_CRUD',
        'APP_ORGANISAATIOHALLINTA_CRUD_1.2.246.562.10.64582714578',
        'APP_ORGANISAATIOHALLINTA',
        'APP_ORGANISAATIOHALLINTA_RYHMA',
        'APP_ORGANISAATIOHALLINTA_RYHMA_1.2.246.562.10.64582714578',
        'APP_OID',
        'APP_OID_READ',
        'APP_OID_READ_1.2.246.562.10.64582714578',
        'APP_VALINTOJENTOTEUTTAMINENKK',
        'APP_VALINTOJENTOTEUTTAMINENKK_CRUD',
        'APP_VALINTOJENTOTEUTTAMINENKK_CRUD_1.2.246.562.10.64582714578',
        'APP_HAKULOMAKKEENHALLINTA',
        'APP_HAKULOMAKKEENHALLINTA_CRUD',
        'APP_HAKULOMAKKEENHALLINTA_CRUD_1.2.246.562.10.64582714578',
        'APP_OMATTIEDOT',
        'APP_OMATTIEDOT_READ_UPDATE',
        'APP_OMATTIEDOT_READ_UPDATE_1.2.246.562.10.64582714578',
        'APP_RAPORTOINTI',
        'APP_RAPORTOINTI_KK',
        'APP_RAPORTOINTI_KK_1.2.246.562.10.64582714578',
        'APP_HENKILONHALLINTA',
        'APP_HENKILONHALLINTA_READ',
        'APP_HENKILONHALLINTA_READ_1.2.246.562.10.64582714578',
        'APP_SUORITUSREKISTERI',
        'APP_SUORITUSREKISTERI_CRUD',
        'APP_SUORITUSREKISTERI_CRUD_1.2.246.562.10.64582714578',
        'APP_VALINTAPERUSTEETKK',
        'APP_VALINTAPERUSTEETKK_READ',
        'APP_VALINTAPERUSTEETKK_READ_1.2.246.562.10.64582714578',
        'APP_VALINTOJENTOTEUTTAMINEN',
        'APP_VALINTOJENTOTEUTTAMINEN_CRUD',
        'APP_VALINTOJENTOTEUTTAMINEN_CRUD_1.2.246.562.10.64582714578',
        'APP_HAKEMUS',
        'APP_HAKEMUS_CRUD',
        'APP_HAKEMUS_CRUD_1.2.246.562.10.64582714578',
        'APP_KKHAKUVIRKAILIJA',
        'APP_KKHAKUVIRKAILIJA_CRUD',
        'APP_KKHAKUVIRKAILIJA_CRUD_1.2.246.562.10.64582714578',
        'APP_TARJONTA',
        'APP_TARJONTA_CRUD',
        'APP_TARJONTA_CRUD_1.2.246.562.10.64582714578',
        'APP_VALINTAPERUSTEET',
        'APP_VALINTAPERUSTEET_READ',
        'APP_VALINTAPERUSTEET_READ_1.2.246.562.10.64582714578',
        'APP_TARJONTA_KK',
        'APP_TARJONTA_KK_CRUD',
        'APP_TARJONTA_KK_CRUD_1.2.246.562.10.64582714578',
        'APP_HAKEMUS',
        'APP_HAKEMUS_LISATIETORU',
        'APP_HAKEMUS_LISATIETORU_1.2.246.562.10.64582714578',
        'APP_VALINTAPERUSTEKUVAUSTENHALLINTA',
        'APP_VALINTAPERUSTEKUVAUSTENHALLINTA_CRUD',
        'APP_VALINTAPERUSTEKUVAUSTENHALLINTA_CRUD_1.2.246.562.10.64582714578',
        'APP_HAKUJENHALLINTA',
        'APP_HAKUJENHALLINTA_CRUD',
        'APP_HAKUJENHALLINTA_CRUD_1.2.246.562.10.69981965515',
        'APP_VALINTAPERUSTEKUVAUSTENHALLINTA_KK',
        'APP_VALINTAPERUSTEKUVAUSTENHALLINTA_KK_CRUD',
        'APP_VALINTAPERUSTEKUVAUSTENHALLINTA_KK_CRUD_1.2.246.562.10.69981965515',
        'APP_SIJOITTELU',
        'APP_SIJOITTELU_READ',
        'APP_SIJOITTELU_READ_1.2.246.562.10.69981965515',
        'APP_ORGANISAATIOHALLINTA',
        'APP_ORGANISAATIOHALLINTA_CRUD',
        'APP_ORGANISAATIOHALLINTA_CRUD_1.2.246.562.10.69981965515',
        'APP_ORGANISAATIOHALLINTA',
        'APP_ORGANISAATIOHALLINTA_RYHMA',
        'APP_ORGANISAATIOHALLINTA_RYHMA_1.2.246.562.10.69981965515',
        'APP_OID',
        'APP_OID_READ',
        'APP_OID_READ_1.2.246.562.10.69981965515',
        'APP_VALINTOJENTOTEUTTAMINENKK',
        'APP_VALINTOJENTOTEUTTAMINENKK_CRUD',
        'APP_VALINTOJENTOTEUTTAMINENKK_CRUD_1.2.246.562.10.69981965515',
        'APP_HAKULOMAKKEENHALLINTA',
        'APP_HAKULOMAKKEENHALLINTA_CRUD',
        'APP_HAKULOMAKKEENHALLINTA_CRUD_1.2.246.562.10.69981965515',
        'APP_OMATTIEDOT',
        'APP_OMATTIEDOT_READ_UPDATE',
        'APP_OMATTIEDOT_READ_UPDATE_1.2.246.562.10.69981965515',
        'APP_RAPORTOINTI',
        'APP_RAPORTOINTI_KK',
        'APP_RAPORTOINTI_KK_1.2.246.562.10.69981965515',
        'APP_HENKILONHALLINTA',
        'APP_HENKILONHALLINTA_READ',
        'APP_HENKILONHALLINTA_READ_1.2.246.562.10.69981965515',
        'APP_SUORITUSREKISTERI',
        'APP_SUORITUSREKISTERI_CRUD',
        'APP_SUORITUSREKISTERI_CRUD_1.2.246.562.10.69981965515',
        'APP_VALINTAPERUSTEETKK',
        'APP_VALINTAPERUSTEETKK_CRUD',
        'APP_VALINTAPERUSTEETKK_CRUD_1.2.246.562.10.69981965515',
        'APP_VALINTOJENTOTEUTTAMINEN',
        'APP_VALINTOJENTOTEUTTAMINEN_CRUD',
        'APP_VALINTOJENTOTEUTTAMINEN_CRUD_1.2.246.562.10.69981965515',
        'APP_HAKEMUS',
        'APP_HAKEMUS_CRUD',
        'APP_HAKEMUS_CRUD_1.2.246.562.10.69981965515',
        'APP_KKHAKUVIRKAILIJA',
        'APP_KKHAKUVIRKAILIJA_CRUD',
        'APP_KKHAKUVIRKAILIJA_CRUD_1.2.246.562.10.69981965515',
        'APP_TARJONTA',
        'APP_TARJONTA_CRUD',
        'APP_TARJONTA_CRUD_1.2.246.562.10.69981965515',
        'APP_VALINTAPERUSTEET',
        'APP_VALINTAPERUSTEET_READ',
        'APP_VALINTAPERUSTEET_READ_1.2.246.562.10.69981965515',
        'APP_TARJONTA_KK',
        'APP_TARJONTA_KK_CRUD',
        'APP_TARJONTA_KK_CRUD_1.2.246.562.10.69981965515',
        'APP_HAKEMUS',
        'APP_HAKEMUS_LISATIETORU',
        'APP_HAKEMUS_LISATIETORU_1.2.246.562.10.69981965515',
        'APP_VALINTAPERUSTEKUVAUSTENHALLINTA',
        'APP_VALINTAPERUSTEKUVAUSTENHALLINTA_CRUD',
        'APP_VALINTAPERUSTEKUVAUSTENHALLINTA_CRUD_1.2.246.562.10.69981965515',
      ]
    },
  ])
