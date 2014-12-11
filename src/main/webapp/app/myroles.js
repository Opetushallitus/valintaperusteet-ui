angular.module('valintaperusteet')

.factory('MyRolesModel', ['$q', '$http', 'CAS_URL', function ($q, $http, CAS_URL) {
    var deferred = $q.defer();

    var factory = (function () {
        var instance = {};
        instance.myroles = [];
        var kayttaja = ["USER_pia-oamk-fi857", "VIRKAILIJA", "STRONG_AUTHENTICATED_HAKA", "STRONG_AUTHENTICATED", "APP_VALINTAPERUSTEKUVAUSTENHALLINTA_KK", "APP_VALINTAPERUSTEKUVAUSTENHALLINTA_KK_CRUD", "APP_VALINTAPERUSTEKUVAUSTENHALLINTA_KK_CRUD_1.2.246.562.10.34573782876", "APP_ASIAKIRJAPALVELU", "APP_ASIAKIRJAPALVELU_READ", "APP_ASIAKIRJAPALVELU_READ_1.2.246.562.10.34573782876", "APP_KOODISTO", "APP_KOODISTO_READ", "APP_KOODISTO_READ_1.2.246.562.10.34573782876", "APP_ASIAKIRJAPALVELU", "APP_ASIAKIRJAPALVELU_CREATE_LETTER", "APP_ASIAKIRJAPALVELU_CREATE_LETTER_1.2.246.562.10.34573782876", "APP_ASIAKIRJAPALVELU", "APP_ASIAKIRJAPALVELU_CREATE_TEMPLATE", "APP_ASIAKIRJAPALVELU_CREATE_TEMPLATE_1.2.246.562.10.34573782876", "APP_SIJOITTELU", "APP_SIJOITTELU_CRUD", "APP_SIJOITTELU_CRUD_1.2.246.562.10.34573782876", "APP_ORGANISAATIOHALLINTA", "APP_ORGANISAATIOHALLINTA_CRUD", "APP_ORGANISAATIOHALLINTA_CRUD_1.2.246.562.10.34573782876", "APP_RAPORTOINTI", "APP_RAPORTOINTI_KK", "APP_RAPORTOINTI_KK_1.2.246.562.10.34573782876", "APP_OID", "APP_OID_CRUD", "APP_OID_CRUD_1.2.246.562.10.34573782876", "APP_OMATTIEDOT", "APP_OMATTIEDOT_CRUD", "APP_OMATTIEDOT_CRUD_1.2.246.562.10.34573782876", "APP_TARJONTA_KK", "APP_TARJONTA_KK_CRUD", "APP_TARJONTA_KK_CRUD_1.2.246.562.10.34573782876", "APP_HENKILONHALLINTA", "APP_HENKILONHALLINTA_CRUD", "APP_HENKILONHALLINTA_CRUD_1.2.246.562.10.34573782876", "APP_ANOMUSTENHALLINTA", "APP_ANOMUSTENHALLINTA_CRUD", "APP_ANOMUSTENHALLINTA_CRUD_1.2.246.562.10.34573782876", "APP_ASIAKIRJAPALVELU", "APP_ASIAKIRJAPALVELU_SYSTEM_ATTACHMENT_DOWNLOAD", "APP_ASIAKIRJAPALVELU_SYSTEM_ATTACHMENT_DOWNLOAD_1.2.246.562.10.34573782876", "APP_HAKEMUS", "APP_HAKEMUS_CRUD", "APP_HAKEMUS_CRUD_1.2.246.562.10.34573782876", "APP_ASIAKIRJAPALVELU", "APP_ASIAKIRJAPALVELU_ASIOINTITILICRUD", "APP_ASIAKIRJAPALVELU_ASIOINTITILICRUD_1.2.246.562.10.34573782876", "APP_LOKALISOINTI", "APP_LOKALISOINTI_READ", "APP_LOKALISOINTI_READ_1.2.246.562.10.34573782876", "APP_TARJONTA", "APP_TARJONTA_CRUD", "APP_TARJONTA_CRUD_1.2.246.562.10.34573782876", "APP_VALINTAPERUSTEETKK", "APP_VALINTAPERUSTEETKK_CRUD", "APP_VALINTAPERUSTEETKK_CRUD_1.2.246.562.10.34573782876", "APP_HAKUJENHALLINTA", "APP_HAKUJENHALLINTA_CRUD", "APP_HAKUJENHALLINTA_CRUD_1.2.246.562.10.34573782876", "APP_SUORITUSREKISTERI", "APP_SUORITUSREKISTERI_READ_UPDATE", "APP_SUORITUSREKISTERI_READ_UPDATE_1.2.246.562.10.34573782876", "APP_TIEDONSIIRTO", "APP_TIEDONSIIRTO_CRUD", "APP_TIEDONSIIRTO_CRUD_1.2.246.562.10.34573782876", "APP_VALINTOJENTOTEUTTAMINENKK", "APP_VALINTOJENTOTEUTTAMINENKK_CRUD", "APP_VALINTOJENTOTEUTTAMINENKK_CRUD_1.2.246.562.10.34573782876", "APP_VALINTAPERUSTEET", "APP_VALINTAPERUSTEET_CRUD", "APP_VALINTAPERUSTEET_CRUD_1.2.246.562.10.34573782876", "APP_ASIAKIRJAPALVELU", "APP_ASIAKIRJAPALVELU_SEND_LETTER_EMAIL", "APP_ASIAKIRJAPALVELU_SEND_LETTER_EMAIL_1.2.246.562.10.34573782876", "APP_KKHAKUVIRKAILIJA", "APP_KKHAKUVIRKAILIJA_CRUD", "APP_KKHAKUVIRKAILIJA_CRUD_1.2.246.562.10.34573782876", "APP_HAKULOMAKKEENHALLINTA", "APP_HAKULOMAKKEENHALLINTA_CRUD", "APP_HAKULOMAKKEENHALLINTA_CRUD_1.2.246.562.10.34573782876", "APP_RAPORTOINTI", "APP_RAPORTOINTI_READ_UPDATE", "APP_RAPORTOINTI_READ_UPDATE_1.2.246.562.10.34573782876", "APP_RYHMASAHKOPOSTI", "APP_RYHMASAHKOPOSTI_VIEW", "APP_RYHMASAHKOPOSTI_VIEW_1.2.246.562.10.34573782876", "APP_RYHMASAHKOPOSTI", "APP_RYHMASAHKOPOSTI_SEND", "APP_RYHMASAHKOPOSTI_SEND_1.2.246.562.10.34573782876", "APP_ORGANISAATIOHALLINTA", "APP_ORGANISAATIOHALLINTA_RYHMA", "APP_ORGANISAATIOHALLINTA_RYHMA_1.2.246.562.10.34573782876", "APP_VALINTOJENTOTEUTTAMINEN", "APP_VALINTOJENTOTEUTTAMINEN_CRUD", "APP_VALINTOJENTOTEUTTAMINEN_CRUD_1.2.246.562.10.34573782876", "APP_HENKILONHALLINTA", "APP_HENKILONHALLINTA_KKVASTUU", "APP_HENKILONHALLINTA_KKVASTUU_1.2.246.562.10.34573782876"]
        var kkCrud = ["USER_mallikas", "VIRKAILIJA", "LANG_fi", "APP_HAKUJENHALLINTA", "APP_HAKUJENHALLINTA_CRUD", "APP_HAKUJENHALLINTA_CRUD_1.2.246.562.10.64582714578", "APP_VALINTAPERUSTEKUVAUSTENHALLINTA_KK", "APP_VALINTAPERUSTEKUVAUSTENHALLINTA_KK_CRUD", "APP_VALINTAPERUSTEKUVAUSTENHALLINTA_KK_CRUD_1.2.246.562.10.64582714578", "APP_SIJOITTELU", "APP_SIJOITTELU_READ", "APP_SIJOITTELU_READ_1.2.246.562.10.64582714578", "APP_ORGANISAATIOHALLINTA", "APP_ORGANISAATIOHALLINTA_CRUD", "APP_ORGANISAATIOHALLINTA_CRUD_1.2.246.562.10.64582714578", "APP_ORGANISAATIOHALLINTA", "APP_ORGANISAATIOHALLINTA_RYHMA", "APP_ORGANISAATIOHALLINTA_RYHMA_1.2.246.562.10.64582714578", "APP_OID", "APP_OID_READ", "APP_OID_READ_1.2.246.562.10.64582714578", "APP_VALINTOJENTOTEUTTAMINENKK", "APP_VALINTOJENTOTEUTTAMINENKK_CRUD", "APP_VALINTOJENTOTEUTTAMINENKK_CRUD_1.2.246.562.10.64582714578", "APP_HAKULOMAKKEENHALLINTA", "APP_HAKULOMAKKEENHALLINTA_CRUD", "APP_HAKULOMAKKEENHALLINTA_CRUD_1.2.246.562.10.64582714578", "APP_OMATTIEDOT", "APP_OMATTIEDOT_READ_UPDATE", "APP_OMATTIEDOT_READ_UPDATE_1.2.246.562.10.64582714578", "APP_RAPORTOINTI", "APP_RAPORTOINTI_KK", "APP_RAPORTOINTI_KK_1.2.246.562.10.64582714578", "APP_HENKILONHALLINTA", "APP_HENKILONHALLINTA_READ", "APP_HENKILONHALLINTA_READ_1.2.246.562.10.64582714578", "APP_SUORITUSREKISTERI", "APP_SUORITUSREKISTERI_CRUD", "APP_SUORITUSREKISTERI_CRUD_1.2.246.562.10.64582714578", "APP_VALINTAPERUSTEETKK", "APP_VALINTAPERUSTEETKK_CRUD", "APP_VALINTAPERUSTEETKK_CRUD_1.2.246.562.10.64582714578", "APP_VALINTOJENTOTEUTTAMINEN", "APP_VALINTOJENTOTEUTTAMINEN_CRUD", "APP_VALINTOJENTOTEUTTAMINEN_CRUD_1.2.246.562.10.64582714578", "APP_HAKEMUS", "APP_HAKEMUS_CRUD", "APP_HAKEMUS_CRUD_1.2.246.562.10.64582714578", "APP_KKHAKUVIRKAILIJA", "APP_KKHAKUVIRKAILIJA_CRUD", "APP_KKHAKUVIRKAILIJA_CRUD_1.2.246.562.10.64582714578", "APP_TARJONTA", "APP_TARJONTA_CRUD", "APP_TARJONTA_CRUD_1.2.246.562.10.64582714578", "APP_VALINTAPERUSTEET", "APP_VALINTAPERUSTEET_CRUD", "APP_VALINTAPERUSTEET_CRUD_1.2.246.562.10.64582714578", "APP_TARJONTA_KK", "APP_TARJONTA_KK_CRUD", "APP_TARJONTA_KK_CRUD_1.2.246.562.10.64582714578", "APP_HAKEMUS", "APP_HAKEMUS_LISATIETORU", "APP_HAKEMUS_LISATIETORU_1.2.246.562.10.64582714578", "APP_VALINTAPERUSTEKUVAUSTENHALLINTA", "APP_VALINTAPERUSTEKUVAUSTENHALLINTA_CRUD", "APP_VALINTAPERUSTEKUVAUSTENHALLINTA_CRUD_1.2.246.562.10.64582714578", "APP_HAKUJENHALLINTA", "APP_HAKUJENHALLINTA_CRUD", "APP_HAKUJENHALLINTA_CRUD_1.2.246.562.10.69981965515", "APP_VALINTAPERUSTEKUVAUSTENHALLINTA_KK", "APP_VALINTAPERUSTEKUVAUSTENHALLINTA_KK_CRUD", "APP_VALINTAPERUSTEKUVAUSTENHALLINTA_KK_CRUD_1.2.246.562.10.69981965515", "APP_SIJOITTELU", "APP_SIJOITTELU_READ", "APP_SIJOITTELU_READ_1.2.246.562.10.69981965515", "APP_ORGANISAATIOHALLINTA", "APP_ORGANISAATIOHALLINTA_CRUD", "APP_ORGANISAATIOHALLINTA_CRUD_1.2.246.562.10.69981965515", "APP_ORGANISAATIOHALLINTA", "APP_ORGANISAATIOHALLINTA_RYHMA", "APP_ORGANISAATIOHALLINTA_RYHMA_1.2.246.562.10.69981965515", "APP_OID", "APP_OID_READ", "APP_OID_READ_1.2.246.562.10.69981965515", "APP_VALINTOJENTOTEUTTAMINENKK", "APP_VALINTOJENTOTEUTTAMINENKK_CRUD", "APP_VALINTOJENTOTEUTTAMINENKK_CRUD_1.2.246.562.10.69981965515", "APP_HAKULOMAKKEENHALLINTA", "APP_HAKULOMAKKEENHALLINTA_CRUD", "APP_HAKULOMAKKEENHALLINTA_CRUD_1.2.246.562.10.69981965515", "APP_OMATTIEDOT", "APP_OMATTIEDOT_READ_UPDATE", "APP_OMATTIEDOT_READ_UPDATE_1.2.246.562.10.69981965515", "APP_RAPORTOINTI", "APP_RAPORTOINTI_KK", "APP_RAPORTOINTI_KK_1.2.246.562.10.69981965515", "APP_HENKILONHALLINTA", "APP_HENKILONHALLINTA_READ", "APP_HENKILONHALLINTA_READ_1.2.246.562.10.69981965515", "APP_SUORITUSREKISTERI", "APP_SUORITUSREKISTERI_CRUD", "APP_SUORITUSREKISTERI_CRUD_1.2.246.562.10.69981965515", "APP_VALINTAPERUSTEETKK", "APP_VALINTAPERUSTEETKK_CRUD", "APP_VALINTAPERUSTEETKK_CRUD_1.2.246.562.10.69981965515", "APP_VALINTOJENTOTEUTTAMINEN", "APP_VALINTOJENTOTEUTTAMINEN_CRUD", "APP_VALINTOJENTOTEUTTAMINEN_CRUD_1.2.246.562.10.69981965515", "APP_HAKEMUS", "APP_HAKEMUS_CRUD", "APP_HAKEMUS_CRUD_1.2.246.562.10.69981965515", "APP_KKHAKUVIRKAILIJA", "APP_KKHAKUVIRKAILIJA_CRUD", "APP_KKHAKUVIRKAILIJA_CRUD_1.2.246.562.10.69981965515", "APP_TARJONTA", "APP_TARJONTA_CRUD", "APP_TARJONTA_CRUD_1.2.246.562.10.69981965515", "APP_VALINTAPERUSTEET", "APP_VALINTAPERUSTEET_CRUD", "APP_VALINTAPERUSTEET_CRUD_1.2.246.562.10.69981965515", "APP_TARJONTA_KK", "APP_TARJONTA_KK_CRUD", "APP_TARJONTA_KK_CRUD_1.2.246.562.10.69981965515", "APP_HAKEMUS", "APP_HAKEMUS_LISATIETORU", "APP_HAKEMUS_LISATIETORU_1.2.246.562.10.69981965515", "APP_VALINTAPERUSTEKUVAUSTENHALLINTA", "APP_VALINTAPERUSTEKUVAUSTENHALLINTA_CRUD", "APP_VALINTAPERUSTEKUVAUSTENHALLINTA_CRUD_1.2.246.562.10.69981965515"];
        var kkUpdate = ["USER_mallikas", "VIRKAILIJA", "LANG_fi", "APP_HAKUJENHALLINTA", "APP_HAKUJENHALLINTA_CRUD", "APP_HAKUJENHALLINTA_CRUD_1.2.246.562.10.64582714578", "APP_VALINTAPERUSTEKUVAUSTENHALLINTA_KK", "APP_VALINTAPERUSTEKUVAUSTENHALLINTA_KK_CRUD", "APP_VALINTAPERUSTEKUVAUSTENHALLINTA_KK_CRUD_1.2.246.562.10.64582714578", "APP_SIJOITTELU", "APP_SIJOITTELU_READ", "APP_SIJOITTELU_READ_1.2.246.562.10.64582714578", "APP_ORGANISAATIOHALLINTA", "APP_ORGANISAATIOHALLINTA_CRUD", "APP_ORGANISAATIOHALLINTA_CRUD_1.2.246.562.10.64582714578", "APP_ORGANISAATIOHALLINTA", "APP_ORGANISAATIOHALLINTA_RYHMA", "APP_ORGANISAATIOHALLINTA_RYHMA_1.2.246.562.10.64582714578", "APP_OID", "APP_OID_READ", "APP_OID_READ_1.2.246.562.10.64582714578", "APP_VALINTOJENTOTEUTTAMINENKK", "APP_VALINTOJENTOTEUTTAMINENKK_CRUD", "APP_VALINTOJENTOTEUTTAMINENKK_CRUD_1.2.246.562.10.64582714578", "APP_HAKULOMAKKEENHALLINTA", "APP_HAKULOMAKKEENHALLINTA_CRUD", "APP_HAKULOMAKKEENHALLINTA_CRUD_1.2.246.562.10.64582714578", "APP_OMATTIEDOT", "APP_OMATTIEDOT_READ_UPDATE", "APP_OMATTIEDOT_READ_UPDATE_1.2.246.562.10.64582714578", "APP_RAPORTOINTI", "APP_RAPORTOINTI_KK", "APP_RAPORTOINTI_KK_1.2.246.562.10.64582714578", "APP_HENKILONHALLINTA", "APP_HENKILONHALLINTA_READ", "APP_HENKILONHALLINTA_READ_1.2.246.562.10.64582714578", "APP_SUORITUSREKISTERI", "APP_SUORITUSREKISTERI_CRUD", "APP_SUORITUSREKISTERI_CRUD_1.2.246.562.10.64582714578", "APP_VALINTAPERUSTEETKK", "APP_VALINTAPERUSTEETKK_READ_UPDATE", "APP_VALINTAPERUSTEETKK_READ_UPDATE_1.2.246.562.10.64582714578", "APP_VALINTOJENTOTEUTTAMINEN", "APP_VALINTOJENTOTEUTTAMINEN_CRUD", "APP_VALINTOJENTOTEUTTAMINEN_CRUD_1.2.246.562.10.64582714578", "APP_HAKEMUS", "APP_HAKEMUS_CRUD", "APP_HAKEMUS_CRUD_1.2.246.562.10.64582714578", "APP_KKHAKUVIRKAILIJA", "APP_KKHAKUVIRKAILIJA_CRUD", "APP_KKHAKUVIRKAILIJA_CRUD_1.2.246.562.10.64582714578", "APP_TARJONTA", "APP_TARJONTA_CRUD", "APP_TARJONTA_CRUD_1.2.246.562.10.64582714578", "APP_VALINTAPERUSTEET", "APP_VALINTAPERUSTEET_READ_UPDATE", "APP_VALINTAPERUSTEET_READ_UPDATE_1.2.246.562.10.64582714578", "APP_TARJONTA_KK", "APP_TARJONTA_KK_CRUD", "APP_TARJONTA_KK_CRUD_1.2.246.562.10.64582714578", "APP_HAKEMUS", "APP_HAKEMUS_LISATIETORU", "APP_HAKEMUS_LISATIETORU_1.2.246.562.10.64582714578", "APP_VALINTAPERUSTEKUVAUSTENHALLINTA", "APP_VALINTAPERUSTEKUVAUSTENHALLINTA_CRUD", "APP_VALINTAPERUSTEKUVAUSTENHALLINTA_CRUD_1.2.246.562.10.64582714578", "APP_HAKUJENHALLINTA", "APP_HAKUJENHALLINTA_CRUD", "APP_HAKUJENHALLINTA_CRUD_1.2.246.562.10.69981965515", "APP_VALINTAPERUSTEKUVAUSTENHALLINTA_KK", "APP_VALINTAPERUSTEKUVAUSTENHALLINTA_KK_CRUD", "APP_VALINTAPERUSTEKUVAUSTENHALLINTA_KK_CRUD_1.2.246.562.10.69981965515", "APP_SIJOITTELU", "APP_SIJOITTELU_READ", "APP_SIJOITTELU_READ_1.2.246.562.10.69981965515", "APP_ORGANISAATIOHALLINTA", "APP_ORGANISAATIOHALLINTA_CRUD", "APP_ORGANISAATIOHALLINTA_CRUD_1.2.246.562.10.69981965515", "APP_ORGANISAATIOHALLINTA", "APP_ORGANISAATIOHALLINTA_RYHMA", "APP_ORGANISAATIOHALLINTA_RYHMA_1.2.246.562.10.69981965515", "APP_OID", "APP_OID_READ", "APP_OID_READ_1.2.246.562.10.69981965515", "APP_VALINTOJENTOTEUTTAMINENKK", "APP_VALINTOJENTOTEUTTAMINENKK_CRUD", "APP_VALINTOJENTOTEUTTAMINENKK_CRUD_1.2.246.562.10.69981965515", "APP_HAKULOMAKKEENHALLINTA", "APP_HAKULOMAKKEENHALLINTA_CRUD", "APP_HAKULOMAKKEENHALLINTA_CRUD_1.2.246.562.10.69981965515", "APP_OMATTIEDOT", "APP_OMATTIEDOT_READ_UPDATE", "APP_OMATTIEDOT_READ_UPDATE_1.2.246.562.10.69981965515", "APP_RAPORTOINTI", "APP_RAPORTOINTI_KK", "APP_RAPORTOINTI_KK_1.2.246.562.10.69981965515", "APP_HENKILONHALLINTA", "APP_HENKILONHALLINTA_READ", "APP_HENKILONHALLINTA_READ_1.2.246.562.10.69981965515", "APP_SUORITUSREKISTERI", "APP_SUORITUSREKISTERI_CRUD", "APP_SUORITUSREKISTERI_CRUD_1.2.246.562.10.69981965515", "APP_VALINTAPERUSTEETKK", "APP_VALINTAPERUSTEETKK_CRUD", "APP_VALINTAPERUSTEETKK_CRUD_1.2.246.562.10.69981965515", "APP_VALINTOJENTOTEUTTAMINEN", "APP_VALINTOJENTOTEUTTAMINEN_CRUD", "APP_VALINTOJENTOTEUTTAMINEN_CRUD_1.2.246.562.10.69981965515", "APP_HAKEMUS", "APP_HAKEMUS_CRUD", "APP_HAKEMUS_CRUD_1.2.246.562.10.69981965515", "APP_KKHAKUVIRKAILIJA", "APP_KKHAKUVIRKAILIJA_CRUD", "APP_KKHAKUVIRKAILIJA_CRUD_1.2.246.562.10.69981965515", "APP_TARJONTA", "APP_TARJONTA_CRUD", "APP_TARJONTA_CRUD_1.2.246.562.10.69981965515", "APP_VALINTAPERUSTEET", "APP_VALINTAPERUSTEET_READ_UPDATE", "APP_VALINTAPERUSTEET_READ_UPDATE_1.2.246.562.10.69981965515", "APP_TARJONTA_KK", "APP_TARJONTA_KK_CRUD", "APP_TARJONTA_KK_CRUD_1.2.246.562.10.69981965515", "APP_HAKEMUS", "APP_HAKEMUS_LISATIETORU", "APP_HAKEMUS_LISATIETORU_1.2.246.562.10.69981965515", "APP_VALINTAPERUSTEKUVAUSTENHALLINTA", "APP_VALINTAPERUSTEKUVAUSTENHALLINTA_CRUD", "APP_VALINTAPERUSTEKUVAUSTENHALLINTA_CRUD_1.2.246.562.10.69981965515"];
        var kkRead = ["USER_mallikas", "VIRKAILIJA", "LANG_fi", "APP_HAKUJENHALLINTA", "APP_HAKUJENHALLINTA_CRUD", "APP_HAKUJENHALLINTA_CRUD_1.2.246.562.10.64582714578", "APP_VALINTAPERUSTEKUVAUSTENHALLINTA_KK", "APP_VALINTAPERUSTEKUVAUSTENHALLINTA_KK_CRUD", "APP_VALINTAPERUSTEKUVAUSTENHALLINTA_KK_CRUD_1.2.246.562.10.64582714578", "APP_SIJOITTELU", "APP_SIJOITTELU_READ", "APP_SIJOITTELU_READ_1.2.246.562.10.64582714578", "APP_ORGANISAATIOHALLINTA", "APP_ORGANISAATIOHALLINTA_CRUD", "APP_ORGANISAATIOHALLINTA_CRUD_1.2.246.562.10.64582714578", "APP_ORGANISAATIOHALLINTA", "APP_ORGANISAATIOHALLINTA_RYHMA", "APP_ORGANISAATIOHALLINTA_RYHMA_1.2.246.562.10.64582714578", "APP_OID", "APP_OID_READ", "APP_OID_READ_1.2.246.562.10.64582714578", "APP_VALINTOJENTOTEUTTAMINENKK", "APP_VALINTOJENTOTEUTTAMINENKK_CRUD", "APP_VALINTOJENTOTEUTTAMINENKK_CRUD_1.2.246.562.10.64582714578", "APP_HAKULOMAKKEENHALLINTA", "APP_HAKULOMAKKEENHALLINTA_CRUD", "APP_HAKULOMAKKEENHALLINTA_CRUD_1.2.246.562.10.64582714578", "APP_OMATTIEDOT", "APP_OMATTIEDOT_READ_UPDATE", "APP_OMATTIEDOT_READ_UPDATE_1.2.246.562.10.64582714578", "APP_RAPORTOINTI", "APP_RAPORTOINTI_KK", "APP_RAPORTOINTI_KK_1.2.246.562.10.64582714578", "APP_HENKILONHALLINTA", "APP_HENKILONHALLINTA_READ", "APP_HENKILONHALLINTA_READ_1.2.246.562.10.64582714578", "APP_SUORITUSREKISTERI", "APP_SUORITUSREKISTERI_CRUD", "APP_SUORITUSREKISTERI_CRUD_1.2.246.562.10.64582714578", "APP_VALINTAPERUSTEETKK", "APP_VALINTAPERUSTEETKK_READ", "APP_VALINTAPERUSTEETKK_READ_1.2.246.562.10.64582714578", "APP_VALINTOJENTOTEUTTAMINEN", "APP_VALINTOJENTOTEUTTAMINEN_CRUD", "APP_VALINTOJENTOTEUTTAMINEN_CRUD_1.2.246.562.10.64582714578", "APP_HAKEMUS", "APP_HAKEMUS_CRUD", "APP_HAKEMUS_CRUD_1.2.246.562.10.64582714578", "APP_KKHAKUVIRKAILIJA", "APP_KKHAKUVIRKAILIJA_CRUD", "APP_KKHAKUVIRKAILIJA_CRUD_1.2.246.562.10.64582714578", "APP_TARJONTA", "APP_TARJONTA_CRUD", "APP_TARJONTA_CRUD_1.2.246.562.10.64582714578", "APP_VALINTAPERUSTEET", "APP_VALINTAPERUSTEET_READ", "APP_VALINTAPERUSTEET_READ_1.2.246.562.10.64582714578", "APP_TARJONTA_KK", "APP_TARJONTA_KK_CRUD", "APP_TARJONTA_KK_CRUD_1.2.246.562.10.64582714578", "APP_HAKEMUS", "APP_HAKEMUS_LISATIETORU", "APP_HAKEMUS_LISATIETORU_1.2.246.562.10.64582714578", "APP_VALINTAPERUSTEKUVAUSTENHALLINTA", "APP_VALINTAPERUSTEKUVAUSTENHALLINTA_CRUD", "APP_VALINTAPERUSTEKUVAUSTENHALLINTA_CRUD_1.2.246.562.10.64582714578", "APP_HAKUJENHALLINTA", "APP_HAKUJENHALLINTA_CRUD", "APP_HAKUJENHALLINTA_CRUD_1.2.246.562.10.69981965515", "APP_VALINTAPERUSTEKUVAUSTENHALLINTA_KK", "APP_VALINTAPERUSTEKUVAUSTENHALLINTA_KK_CRUD", "APP_VALINTAPERUSTEKUVAUSTENHALLINTA_KK_CRUD_1.2.246.562.10.69981965515", "APP_SIJOITTELU", "APP_SIJOITTELU_READ", "APP_SIJOITTELU_READ_1.2.246.562.10.69981965515", "APP_ORGANISAATIOHALLINTA", "APP_ORGANISAATIOHALLINTA_CRUD", "APP_ORGANISAATIOHALLINTA_CRUD_1.2.246.562.10.69981965515", "APP_ORGANISAATIOHALLINTA", "APP_ORGANISAATIOHALLINTA_RYHMA", "APP_ORGANISAATIOHALLINTA_RYHMA_1.2.246.562.10.69981965515", "APP_OID", "APP_OID_READ", "APP_OID_READ_1.2.246.562.10.69981965515", "APP_VALINTOJENTOTEUTTAMINENKK", "APP_VALINTOJENTOTEUTTAMINENKK_CRUD", "APP_VALINTOJENTOTEUTTAMINENKK_CRUD_1.2.246.562.10.69981965515", "APP_HAKULOMAKKEENHALLINTA", "APP_HAKULOMAKKEENHALLINTA_CRUD", "APP_HAKULOMAKKEENHALLINTA_CRUD_1.2.246.562.10.69981965515", "APP_OMATTIEDOT", "APP_OMATTIEDOT_READ_UPDATE", "APP_OMATTIEDOT_READ_UPDATE_1.2.246.562.10.69981965515", "APP_RAPORTOINTI", "APP_RAPORTOINTI_KK", "APP_RAPORTOINTI_KK_1.2.246.562.10.69981965515", "APP_HENKILONHALLINTA", "APP_HENKILONHALLINTA_READ", "APP_HENKILONHALLINTA_READ_1.2.246.562.10.69981965515", "APP_SUORITUSREKISTERI", "APP_SUORITUSREKISTERI_CRUD", "APP_SUORITUSREKISTERI_CRUD_1.2.246.562.10.69981965515", "APP_VALINTAPERUSTEETKK", "APP_VALINTAPERUSTEETKK_CRUD", "APP_VALINTAPERUSTEETKK_CRUD_1.2.246.562.10.69981965515", "APP_VALINTOJENTOTEUTTAMINEN", "APP_VALINTOJENTOTEUTTAMINEN_CRUD", "APP_VALINTOJENTOTEUTTAMINEN_CRUD_1.2.246.562.10.69981965515", "APP_HAKEMUS", "APP_HAKEMUS_CRUD", "APP_HAKEMUS_CRUD_1.2.246.562.10.69981965515", "APP_KKHAKUVIRKAILIJA", "APP_KKHAKUVIRKAILIJA_CRUD", "APP_KKHAKUVIRKAILIJA_CRUD_1.2.246.562.10.69981965515", "APP_TARJONTA", "APP_TARJONTA_CRUD", "APP_TARJONTA_CRUD_1.2.246.562.10.69981965515", "APP_VALINTAPERUSTEET", "APP_VALINTAPERUSTEET_READ", "APP_VALINTAPERUSTEET_READ_1.2.246.562.10.69981965515", "APP_TARJONTA_KK", "APP_TARJONTA_KK_CRUD", "APP_TARJONTA_KK_CRUD_1.2.246.562.10.69981965515", "APP_HAKEMUS", "APP_HAKEMUS_LISATIETORU", "APP_HAKEMUS_LISATIETORU_1.2.246.562.10.69981965515", "APP_VALINTAPERUSTEKUVAUSTENHALLINTA", "APP_VALINTAPERUSTEKUVAUSTENHALLINTA_CRUD", "APP_VALINTAPERUSTEKUVAUSTENHALLINTA_CRUD_1.2.246.562.10.69981965515"];

        //kk-käyttäjä
        //instance.myroles = kkCrud;
        //deferred.resolve(instance);
        $http.get(CAS_URL).success(function (result) {
            instance.myroles = result;
            deferred.resolve(instance);
        });

        return instance;
    })();


    return deferred.promise;

}])

.factory('AuthenticationServices', ['$http','$q', function ($http, $q) {
        var deferred = $q.defer();
        $http.get(AUTHENTICATION_URL_BASE + "resources/palvelu").success(function (result) {
            deferred.resolve(result);
        });
    
    return deferred.promise;
}])
