
angular.module('MockData')

    .service('UserMockData', function () {
        this.ophAdmin = ["APP_HAKULOMAKKEENHALLINTA_CRUD","APP_HAKEMUS_LISATIETOCRUD", "APP_HAKEMUS_LISATIETOCRUD_1.2.246.562.10.00000000001","APP_ANOMUSTENHALLINTA", "APP_ANOMUSTENHALLINTA_READ", "APP_ANOMUSTENHALLINTA_READ_1.2.246.562.10.00000000001", "APP_ANOMUSTENHALLINTA_READ_UPDATE", "APP_ANOMUSTENHALLINTA_READ_UPDATE_1.2.246.562.10.00000000001", "APP_ANOMUSTENHALLINTA_CRUD", "APP_ANOMUSTENHALLINTA_CRUD_1.2.246.562.10.00000000001", "APP_ORGANISAATIOHALLINTA", "APP_ORGANISAATIOHALLINTA_READ", "APP_ORGANISAATIOHALLINTA_READ_1.2.246.562.10.00000000001", "APP_ORGANISAATIOHALLINTA_READ_UPDATE", "APP_ORGANISAATIOHALLINTA_READ_UPDATE_1.2.246.562.10.00000000001", "APP_ORGANISAATIOHALLINTA_CRUD", "APP_ORGANISAATIOHALLINTA_CRUD_1.2.246.562.10.00000000001", "APP_HENKILONHALLINTA", "APP_HENKILONHALLINTA_READ", "APP_HENKILONHALLINTA_READ_1.2.246.562.10.00000000001", "APP_HENKILONHALLINTA_READ_UPDATE", "APP_HENKILONHALLINTA_READ_UPDATE_1.2.246.562.10.00000000001", "APP_HENKILONHALLINTA_CRUD", "APP_HENKILONHALLINTA_CRUD_1.2.246.562.10.00000000001", "APP_KOODISTO", "APP_KOODISTO_READ", "APP_KOODISTO_READ_1.2.246.562.10.00000000001", "APP_KOODISTO_READ_UPDATE", "APP_KOODISTO_READ_UPDATE_1.2.246.562.10.00000000001", "APP_KOODISTO_CRUD", "APP_KOODISTO_CRUD_1.2.246.562.10.00000000001", "APP_KOOSTEROOLIENHALLINTA", "APP_KOOSTEROOLIENHALLINTA_READ", "APP_KOOSTEROOLIENHALLINTA_READ_1.2.246.562.10.00000000001", "APP_KOOSTEROOLIENHALLINTA_READ_UPDATE", "APP_KOOSTEROOLIENHALLINTA_READ_UPDATE_1.2.246.562.10.00000000001", "APP_KOOSTEROOLIENHALLINTA_CRUD", "APP_KOOSTEROOLIENHALLINTA_CRUD_1.2.246.562.10.00000000001", "APP_OID", "APP_OID_READ", "APP_OID_READ_1.2.246.562.10.00000000001", "APP_OID_READ_UPDATE", "APP_OID_READ_UPDATE_1.2.246.562.10.00000000001", "APP_OID_CRUD", "APP_OID_CRUD_1.2.246.562.10.00000000001", "APP_OMATTIEDOT", "APP_OMATTIEDOT_READ", "APP_OMATTIEDOT_READ_1.2.246.562.10.00000000001", "APP_OMATTIEDOT_READ_UPDATE", "APP_OMATTIEDOT_READ_UPDATE_1.2.246.562.10.00000000001", "APP_OMATTIEDOT_CRUD", "APP_OMATTIEDOT_CRUD_1.2.246.562.10.00000000001", "APP_TARJONTA", "APP_TARJONTA_CRUD", "APP_TARJONTA_CRUD_1.2.246.562.10.00000000001", "VIRKAILIJA", "APP_TARJONTA_READ_UPDATE_1.2.246.562.10.00000000001", "APP_TARJONTA_READ_1.2.246.562.10.00000000001", "APP_TARJONTA_READ_UPDATE", "APP_TARJONTA_READ", "APP_VALINTAPERUSTEKUVAUKSET_READ", "APP_HAKEMUS", "APP_HAKEMUS_CRUD_1.2.246.562.10.00000000001", "APP_HAKEMUS_READ", "APP_HAKEMUS_CRUD", "APP_VALINTAPERUSTEKUVAUKSET_CRUD_1.2.246.562.10.00000000001", "APP_VALINTAPERUSTEKUVAUKSET_CRUD", "APP_VALINTAPERUSTEKUVAUKSET_READ_1.2.246.562.10.00000000001", "APP_VALINTAPERUSTEKUVAUKSET", "APP_VALINTAPERUSTEKUVAUKSET_READ_UPDATE", "APP_HAKEMUS_READ_UPDATE_1.2.246.562.10.00000000001", "APP_HAKEMUS_READ_UPDATE", "APP_HAKEMUS_READ_1.2.246.562.10.00000000001", "APP_VALINTAPERUSTEKUVAUKSET_READ_UPDATE_1.2.246.562.10.00000000001", "APP_VALINTAPERUSTEKUVAUSTENHALLINTA_READ_UPDATE_1.2.246.562.10.00000000001", "APP_HAKUJENHALLINTA_CRUD_1.2.246.562.10.00000000001", "APP_VALINTAPERUSTEKUVAUSTENHALLINTA_CRUD_1.2.246.562.10.00000000001", "APP_YHTEYSTIETOTYYPPIENHALLINTA_CRUD_1.2.246.562.10.00000000001", "APP_YHTEYSTIETOTYYPPIENHALLINTA", "APP_HAKUJENHALLINTA", "APP_VALINTAPERUSTEKUVAUSTENHALLINTA_CRUD", "APP_VALINTAPERUSTEKUVAUSTENHALLINTA_READ_1.2.246.562.10.00000000001", "APP_HAKUJENHALLINTA_READ_UPDATE_1.2.246.562.10.00000000001", "APP_YHTEYSTIETOTYYPPIENHALLINTA_READ_UPDATE_1.2.246.562.10.00000000001", "APP_VALINTAPERUSTEKUVAUSTENHALLINTA", "APP_YHTEYSTIETOTYYPPIENHALLINTA_READ_1.2.246.562.10.00000000001", "APP_YHTEYSTIETOTYYPPIENHALLINTA_READ", "APP_VALINTAPERUSTEKUVAUSTENHALLINTA_READ", "APP_YHTEYSTIETOTYYPPIENHALLINTA_CRUD", "APP_VALINTAPERUSTEKUVAUSTENHALLINTA_READ_UPDATE", "APP_YHTEYSTIETOTYYPPIENHALLINTA_READ_UPDATE", "APP_HAKUJENHALLINTA_READ_1.2.246.562.10.00000000001", "APP_HAKUJENHALLINTA_CRUD", "APP_HAKUJENHALLINTA_READ_UPDATE", "APP_HAKUJENHALLINTA_READ", "APP_VALINTAPERUSTEET_READ", "APP_VALINTAPERUSTEET_CRUD", "APP_VALINTAPERUSTEET_READ_UPDATE", "APP_VALINTOJENTOTEUTTAMINEN_READ_UPDATE", "APP_VALINTOJENTOTEUTTAMINEN_CRUD_1.2.246.562.10.00000000001", "APP_VALINTOJENTOTEUTTAMINEN", "APP_VALINTAPERUSTEET_READ_1.2.246.562.10.00000000001", "APP_VALINTOJENTOTEUTTAMINEN_READ", "APP_VALINTAPERUSTEET", "APP_VALINTOJENTOTEUTTAMINEN_CRUD", "APP_VALINTOJENTOTEUTTAMINEN_READ_1.2.246.562.10.00000000001", "APP_VALINTAPERUSTEET_CRUD_1.2.246.562.10.00000000001", "APP_VALINTAPERUSTEET_READ_UPDATE_1.2.246.562.10.00000000001", "APP_VALINTOJENTOTEUTTAMINEN_READ_UPDATE_1.2.246.562.10.00000000001", "APP_SIJOITTELU", "APP_SIJOITTELU_READ_1.2.246.562.10.00000000001", "APP_SIJOITTELU_READ", "APP_SIJOITTELU_READ_UPDATE_1.2.246.562.10.00000000001", "APP_SIJOITTELU_CRUD_1.2.246.562.10.00000000001", "APP_SIJOITTELU_CRUD", "APP_SIJOITTELU_READ_UPDATE"];
        this.kkCrud = ["USER_mallikas", "VIRKAILIJA", "LANG_fi", "APP_HAKUJENHALLINTA", "APP_HAKUJENHALLINTA_CRUD", "APP_HAKUJENHALLINTA_CRUD_1.2.246.562.10.64582714578", "APP_VALINTAPERUSTEKUVAUSTENHALLINTA_KK", "APP_VALINTAPERUSTEKUVAUSTENHALLINTA_KK_CRUD", "APP_VALINTAPERUSTEKUVAUSTENHALLINTA_KK_CRUD_1.2.246.562.10.64582714578", "APP_SIJOITTELU", "APP_SIJOITTELU_READ", "APP_SIJOITTELU_READ_1.2.246.562.10.64582714578", "APP_ORGANISAATIOHALLINTA", "APP_ORGANISAATIOHALLINTA_CRUD", "APP_ORGANISAATIOHALLINTA_CRUD_1.2.246.562.10.64582714578", "APP_ORGANISAATIOHALLINTA", "APP_ORGANISAATIOHALLINTA_RYHMA", "APP_ORGANISAATIOHALLINTA_RYHMA_1.2.246.562.10.64582714578", "APP_OID", "APP_OID_READ", "APP_OID_READ_1.2.246.562.10.64582714578", "APP_VALINTOJENTOTEUTTAMINENKK", "APP_VALINTOJENTOTEUTTAMINENKK_CRUD", "APP_VALINTOJENTOTEUTTAMINENKK_CRUD_1.2.246.562.10.64582714578", "APP_HAKULOMAKKEENHALLINTA", "APP_HAKULOMAKKEENHALLINTA_CRUD", "APP_HAKULOMAKKEENHALLINTA_CRUD_1.2.246.562.10.64582714578", "APP_OMATTIEDOT", "APP_OMATTIEDOT_READ_UPDATE", "APP_OMATTIEDOT_READ_UPDATE_1.2.246.562.10.64582714578", "APP_RAPORTOINTI", "APP_RAPORTOINTI_KK", "APP_RAPORTOINTI_KK_1.2.246.562.10.64582714578", "APP_HENKILONHALLINTA", "APP_HENKILONHALLINTA_READ", "APP_HENKILONHALLINTA_READ_1.2.246.562.10.64582714578", "APP_SUORITUSREKISTERI", "APP_SUORITUSREKISTERI_CRUD", "APP_SUORITUSREKISTERI_CRUD_1.2.246.562.10.64582714578", "APP_VALINTAPERUSTEETKK", "APP_VALINTAPERUSTEETKK_CRUD", "APP_VALINTAPERUSTEETKK_CRUD_1.2.246.562.10.64582714578", "APP_VALINTOJENTOTEUTTAMINEN", "APP_VALINTOJENTOTEUTTAMINEN_CRUD", "APP_VALINTOJENTOTEUTTAMINEN_CRUD_1.2.246.562.10.64582714578", "APP_HAKEMUS", "APP_HAKEMUS_CRUD", "APP_HAKEMUS_CRUD_1.2.246.562.10.64582714578", "APP_KKHAKUVIRKAILIJA", "APP_KKHAKUVIRKAILIJA_CRUD", "APP_KKHAKUVIRKAILIJA_CRUD_1.2.246.562.10.64582714578", "APP_TARJONTA", "APP_TARJONTA_CRUD", "APP_TARJONTA_CRUD_1.2.246.562.10.64582714578", "APP_VALINTAPERUSTEET", "APP_VALINTAPERUSTEET_CRUD", "APP_VALINTAPERUSTEET_CRUD_1.2.246.562.10.64582714578", "APP_TARJONTA_KK", "APP_TARJONTA_KK_CRUD", "APP_TARJONTA_KK_CRUD_1.2.246.562.10.64582714578", "APP_HAKEMUS", "APP_HAKEMUS_LISATIETORU", "APP_HAKEMUS_LISATIETORU_1.2.246.562.10.64582714578", "APP_VALINTAPERUSTEKUVAUSTENHALLINTA", "APP_VALINTAPERUSTEKUVAUSTENHALLINTA_CRUD", "APP_VALINTAPERUSTEKUVAUSTENHALLINTA_CRUD_1.2.246.562.10.64582714578", "APP_HAKUJENHALLINTA", "APP_HAKUJENHALLINTA_CRUD", "APP_HAKUJENHALLINTA_CRUD_1.2.246.562.10.69981965515", "APP_VALINTAPERUSTEKUVAUSTENHALLINTA_KK", "APP_VALINTAPERUSTEKUVAUSTENHALLINTA_KK_CRUD", "APP_VALINTAPERUSTEKUVAUSTENHALLINTA_KK_CRUD_1.2.246.562.10.69981965515", "APP_SIJOITTELU", "APP_SIJOITTELU_READ", "APP_SIJOITTELU_READ_1.2.246.562.10.69981965515", "APP_ORGANISAATIOHALLINTA", "APP_ORGANISAATIOHALLINTA_CRUD", "APP_ORGANISAATIOHALLINTA_CRUD_1.2.246.562.10.69981965515", "APP_ORGANISAATIOHALLINTA", "APP_ORGANISAATIOHALLINTA_RYHMA", "APP_ORGANISAATIOHALLINTA_RYHMA_1.2.246.562.10.69981965515", "APP_OID", "APP_OID_READ", "APP_OID_READ_1.2.246.562.10.69981965515", "APP_VALINTOJENTOTEUTTAMINENKK", "APP_VALINTOJENTOTEUTTAMINENKK_CRUD", "APP_VALINTOJENTOTEUTTAMINENKK_CRUD_1.2.246.562.10.69981965515", "APP_HAKULOMAKKEENHALLINTA", "APP_HAKULOMAKKEENHALLINTA_CRUD", "APP_HAKULOMAKKEENHALLINTA_CRUD_1.2.246.562.10.69981965515", "APP_OMATTIEDOT", "APP_OMATTIEDOT_READ_UPDATE", "APP_OMATTIEDOT_READ_UPDATE_1.2.246.562.10.69981965515", "APP_RAPORTOINTI", "APP_RAPORTOINTI_KK", "APP_RAPORTOINTI_KK_1.2.246.562.10.69981965515", "APP_HENKILONHALLINTA", "APP_HENKILONHALLINTA_READ", "APP_HENKILONHALLINTA_READ_1.2.246.562.10.69981965515", "APP_SUORITUSREKISTERI", "APP_SUORITUSREKISTERI_CRUD", "APP_SUORITUSREKISTERI_CRUD_1.2.246.562.10.69981965515", "APP_VALINTAPERUSTEETKK", "APP_VALINTAPERUSTEETKK_CRUD", "APP_VALINTAPERUSTEETKK_CRUD_1.2.246.562.10.69981965515", "APP_VALINTOJENTOTEUTTAMINEN", "APP_VALINTOJENTOTEUTTAMINEN_CRUD", "APP_VALINTOJENTOTEUTTAMINEN_CRUD_1.2.246.562.10.69981965515", "APP_HAKEMUS", "APP_HAKEMUS_CRUD", "APP_HAKEMUS_CRUD_1.2.246.562.10.69981965515", "APP_KKHAKUVIRKAILIJA", "APP_KKHAKUVIRKAILIJA_CRUD", "APP_KKHAKUVIRKAILIJA_CRUD_1.2.246.562.10.69981965515", "APP_TARJONTA", "APP_TARJONTA_CRUD", "APP_TARJONTA_CRUD_1.2.246.562.10.69981965515", "APP_VALINTAPERUSTEET", "APP_VALINTAPERUSTEET_CRUD", "APP_VALINTAPERUSTEET_CRUD_1.2.246.562.10.69981965515", "APP_TARJONTA_KK", "APP_TARJONTA_KK_CRUD", "APP_TARJONTA_KK_CRUD_1.2.246.562.10.69981965515", "APP_HAKEMUS", "APP_HAKEMUS_LISATIETORU", "APP_HAKEMUS_LISATIETORU_1.2.246.562.10.69981965515", "APP_VALINTAPERUSTEKUVAUSTENHALLINTA", "APP_VALINTAPERUSTEKUVAUSTENHALLINTA_CRUD", "APP_VALINTAPERUSTEKUVAUSTENHALLINTA_CRUD_1.2.246.562.10.69981965515"];
        this.kkUpdate = ["USER_mallikas", "VIRKAILIJA", "LANG_fi", "APP_HAKUJENHALLINTA", "APP_HAKUJENHALLINTA_CRUD", "APP_HAKUJENHALLINTA_CRUD_1.2.246.562.10.64582714578", "APP_VALINTAPERUSTEKUVAUSTENHALLINTA_KK", "APP_VALINTAPERUSTEKUVAUSTENHALLINTA_KK_CRUD", "APP_VALINTAPERUSTEKUVAUSTENHALLINTA_KK_CRUD_1.2.246.562.10.64582714578", "APP_SIJOITTELU", "APP_SIJOITTELU_READ", "APP_SIJOITTELU_READ_1.2.246.562.10.64582714578", "APP_ORGANISAATIOHALLINTA", "APP_ORGANISAATIOHALLINTA_CRUD", "APP_ORGANISAATIOHALLINTA_CRUD_1.2.246.562.10.64582714578", "APP_ORGANISAATIOHALLINTA", "APP_ORGANISAATIOHALLINTA_RYHMA", "APP_ORGANISAATIOHALLINTA_RYHMA_1.2.246.562.10.64582714578", "APP_OID", "APP_OID_READ", "APP_OID_READ_1.2.246.562.10.64582714578", "APP_VALINTOJENTOTEUTTAMINENKK", "APP_VALINTOJENTOTEUTTAMINENKK_CRUD", "APP_VALINTOJENTOTEUTTAMINENKK_CRUD_1.2.246.562.10.64582714578", "APP_HAKULOMAKKEENHALLINTA", "APP_HAKULOMAKKEENHALLINTA_CRUD", "APP_HAKULOMAKKEENHALLINTA_CRUD_1.2.246.562.10.64582714578", "APP_OMATTIEDOT", "APP_OMATTIEDOT_READ_UPDATE", "APP_OMATTIEDOT_READ_UPDATE_1.2.246.562.10.64582714578", "APP_RAPORTOINTI", "APP_RAPORTOINTI_KK", "APP_RAPORTOINTI_KK_1.2.246.562.10.64582714578", "APP_HENKILONHALLINTA", "APP_HENKILONHALLINTA_READ", "APP_HENKILONHALLINTA_READ_1.2.246.562.10.64582714578", "APP_SUORITUSREKISTERI", "APP_SUORITUSREKISTERI_CRUD", "APP_SUORITUSREKISTERI_CRUD_1.2.246.562.10.64582714578", "APP_VALINTAPERUSTEETKK", "APP_VALINTAPERUSTEETKK_READ_UPDATE", "APP_VALINTAPERUSTEETKK_READ_UPDATE_1.2.246.562.10.64582714578", "APP_VALINTOJENTOTEUTTAMINEN", "APP_VALINTOJENTOTEUTTAMINEN_CRUD", "APP_VALINTOJENTOTEUTTAMINEN_CRUD_1.2.246.562.10.64582714578", "APP_HAKEMUS", "APP_HAKEMUS_CRUD", "APP_HAKEMUS_CRUD_1.2.246.562.10.64582714578", "APP_KKHAKUVIRKAILIJA", "APP_KKHAKUVIRKAILIJA_CRUD", "APP_KKHAKUVIRKAILIJA_CRUD_1.2.246.562.10.64582714578", "APP_TARJONTA", "APP_TARJONTA_CRUD", "APP_TARJONTA_CRUD_1.2.246.562.10.64582714578", "APP_VALINTAPERUSTEET", "APP_VALINTAPERUSTEET_READ_UPDATE", "APP_VALINTAPERUSTEET_READ_UPDATE_1.2.246.562.10.64582714578", "APP_TARJONTA_KK", "APP_TARJONTA_KK_CRUD", "APP_TARJONTA_KK_CRUD_1.2.246.562.10.64582714578", "APP_HAKEMUS", "APP_HAKEMUS_LISATIETORU", "APP_HAKEMUS_LISATIETORU_1.2.246.562.10.64582714578", "APP_VALINTAPERUSTEKUVAUSTENHALLINTA", "APP_VALINTAPERUSTEKUVAUSTENHALLINTA_CRUD", "APP_VALINTAPERUSTEKUVAUSTENHALLINTA_CRUD_1.2.246.562.10.64582714578", "APP_HAKUJENHALLINTA", "APP_HAKUJENHALLINTA_CRUD", "APP_HAKUJENHALLINTA_CRUD_1.2.246.562.10.69981965515", "APP_VALINTAPERUSTEKUVAUSTENHALLINTA_KK", "APP_VALINTAPERUSTEKUVAUSTENHALLINTA_KK_CRUD", "APP_VALINTAPERUSTEKUVAUSTENHALLINTA_KK_CRUD_1.2.246.562.10.69981965515", "APP_SIJOITTELU", "APP_SIJOITTELU_READ", "APP_SIJOITTELU_READ_1.2.246.562.10.69981965515", "APP_ORGANISAATIOHALLINTA", "APP_ORGANISAATIOHALLINTA_CRUD", "APP_ORGANISAATIOHALLINTA_CRUD_1.2.246.562.10.69981965515", "APP_ORGANISAATIOHALLINTA", "APP_ORGANISAATIOHALLINTA_RYHMA", "APP_ORGANISAATIOHALLINTA_RYHMA_1.2.246.562.10.69981965515", "APP_OID", "APP_OID_READ", "APP_OID_READ_1.2.246.562.10.69981965515", "APP_VALINTOJENTOTEUTTAMINENKK", "APP_VALINTOJENTOTEUTTAMINENKK_CRUD", "APP_VALINTOJENTOTEUTTAMINENKK_CRUD_1.2.246.562.10.69981965515", "APP_HAKULOMAKKEENHALLINTA", "APP_HAKULOMAKKEENHALLINTA_CRUD", "APP_HAKULOMAKKEENHALLINTA_CRUD_1.2.246.562.10.69981965515", "APP_OMATTIEDOT", "APP_OMATTIEDOT_READ_UPDATE", "APP_OMATTIEDOT_READ_UPDATE_1.2.246.562.10.69981965515", "APP_RAPORTOINTI", "APP_RAPORTOINTI_KK", "APP_RAPORTOINTI_KK_1.2.246.562.10.69981965515", "APP_HENKILONHALLINTA", "APP_HENKILONHALLINTA_READ", "APP_HENKILONHALLINTA_READ_1.2.246.562.10.69981965515", "APP_SUORITUSREKISTERI", "APP_SUORITUSREKISTERI_CRUD", "APP_SUORITUSREKISTERI_CRUD_1.2.246.562.10.69981965515", "APP_VALINTAPERUSTEETKK", "APP_VALINTAPERUSTEETKK_CRUD", "APP_VALINTAPERUSTEETKK_CRUD_1.2.246.562.10.69981965515", "APP_VALINTOJENTOTEUTTAMINEN", "APP_VALINTOJENTOTEUTTAMINEN_CRUD", "APP_VALINTOJENTOTEUTTAMINEN_CRUD_1.2.246.562.10.69981965515", "APP_HAKEMUS", "APP_HAKEMUS_CRUD", "APP_HAKEMUS_CRUD_1.2.246.562.10.69981965515", "APP_KKHAKUVIRKAILIJA", "APP_KKHAKUVIRKAILIJA_CRUD", "APP_KKHAKUVIRKAILIJA_CRUD_1.2.246.562.10.69981965515", "APP_TARJONTA", "APP_TARJONTA_CRUD", "APP_TARJONTA_CRUD_1.2.246.562.10.69981965515", "APP_VALINTAPERUSTEET", "APP_VALINTAPERUSTEET_READ_UPDATE", "APP_VALINTAPERUSTEET_READ_UPDATE_1.2.246.562.10.69981965515", "APP_TARJONTA_KK", "APP_TARJONTA_KK_CRUD", "APP_TARJONTA_KK_CRUD_1.2.246.562.10.69981965515", "APP_HAKEMUS", "APP_HAKEMUS_LISATIETORU", "APP_HAKEMUS_LISATIETORU_1.2.246.562.10.69981965515", "APP_VALINTAPERUSTEKUVAUSTENHALLINTA", "APP_VALINTAPERUSTEKUVAUSTENHALLINTA_CRUD", "APP_VALINTAPERUSTEKUVAUSTENHALLINTA_CRUD_1.2.246.562.10.69981965515"];
        this.kkRead = ["USER_mallikas", "VIRKAILIJA", "LANG_fi", "APP_HAKUJENHALLINTA", "APP_HAKUJENHALLINTA_CRUD", "APP_HAKUJENHALLINTA_CRUD_1.2.246.562.10.64582714578", "APP_VALINTAPERUSTEKUVAUSTENHALLINTA_KK", "APP_VALINTAPERUSTEKUVAUSTENHALLINTA_KK_CRUD", "APP_VALINTAPERUSTEKUVAUSTENHALLINTA_KK_CRUD_1.2.246.562.10.64582714578", "APP_SIJOITTELU", "APP_SIJOITTELU_READ", "APP_SIJOITTELU_READ_1.2.246.562.10.64582714578", "APP_ORGANISAATIOHALLINTA", "APP_ORGANISAATIOHALLINTA_CRUD", "APP_ORGANISAATIOHALLINTA_CRUD_1.2.246.562.10.64582714578", "APP_ORGANISAATIOHALLINTA", "APP_ORGANISAATIOHALLINTA_RYHMA", "APP_ORGANISAATIOHALLINTA_RYHMA_1.2.246.562.10.64582714578", "APP_OID", "APP_OID_READ", "APP_OID_READ_1.2.246.562.10.64582714578", "APP_VALINTOJENTOTEUTTAMINENKK", "APP_VALINTOJENTOTEUTTAMINENKK_CRUD", "APP_VALINTOJENTOTEUTTAMINENKK_CRUD_1.2.246.562.10.64582714578", "APP_HAKULOMAKKEENHALLINTA", "APP_HAKULOMAKKEENHALLINTA_CRUD", "APP_HAKULOMAKKEENHALLINTA_CRUD_1.2.246.562.10.64582714578", "APP_OMATTIEDOT", "APP_OMATTIEDOT_READ_UPDATE", "APP_OMATTIEDOT_READ_UPDATE_1.2.246.562.10.64582714578", "APP_RAPORTOINTI", "APP_RAPORTOINTI_KK", "APP_RAPORTOINTI_KK_1.2.246.562.10.64582714578", "APP_HENKILONHALLINTA", "APP_HENKILONHALLINTA_READ", "APP_HENKILONHALLINTA_READ_1.2.246.562.10.64582714578", "APP_SUORITUSREKISTERI", "APP_SUORITUSREKISTERI_CRUD", "APP_SUORITUSREKISTERI_CRUD_1.2.246.562.10.64582714578", "APP_VALINTAPERUSTEETKK", "APP_VALINTAPERUSTEETKK_READ", "APP_VALINTAPERUSTEETKK_READ_1.2.246.562.10.64582714578", "APP_VALINTOJENTOTEUTTAMINEN", "APP_VALINTOJENTOTEUTTAMINEN_CRUD", "APP_VALINTOJENTOTEUTTAMINEN_CRUD_1.2.246.562.10.64582714578", "APP_HAKEMUS", "APP_HAKEMUS_CRUD", "APP_HAKEMUS_CRUD_1.2.246.562.10.64582714578", "APP_KKHAKUVIRKAILIJA", "APP_KKHAKUVIRKAILIJA_CRUD", "APP_KKHAKUVIRKAILIJA_CRUD_1.2.246.562.10.64582714578", "APP_TARJONTA", "APP_TARJONTA_CRUD", "APP_TARJONTA_CRUD_1.2.246.562.10.64582714578", "APP_VALINTAPERUSTEET", "APP_VALINTAPERUSTEET_READ", "APP_VALINTAPERUSTEET_READ_1.2.246.562.10.64582714578", "APP_TARJONTA_KK", "APP_TARJONTA_KK_CRUD", "APP_TARJONTA_KK_CRUD_1.2.246.562.10.64582714578", "APP_HAKEMUS", "APP_HAKEMUS_LISATIETORU", "APP_HAKEMUS_LISATIETORU_1.2.246.562.10.64582714578", "APP_VALINTAPERUSTEKUVAUSTENHALLINTA", "APP_VALINTAPERUSTEKUVAUSTENHALLINTA_CRUD", "APP_VALINTAPERUSTEKUVAUSTENHALLINTA_CRUD_1.2.246.562.10.64582714578", "APP_HAKUJENHALLINTA", "APP_HAKUJENHALLINTA_CRUD", "APP_HAKUJENHALLINTA_CRUD_1.2.246.562.10.69981965515", "APP_VALINTAPERUSTEKUVAUSTENHALLINTA_KK", "APP_VALINTAPERUSTEKUVAUSTENHALLINTA_KK_CRUD", "APP_VALINTAPERUSTEKUVAUSTENHALLINTA_KK_CRUD_1.2.246.562.10.69981965515", "APP_SIJOITTELU", "APP_SIJOITTELU_READ", "APP_SIJOITTELU_READ_1.2.246.562.10.69981965515", "APP_ORGANISAATIOHALLINTA", "APP_ORGANISAATIOHALLINTA_CRUD", "APP_ORGANISAATIOHALLINTA_CRUD_1.2.246.562.10.69981965515", "APP_ORGANISAATIOHALLINTA", "APP_ORGANISAATIOHALLINTA_RYHMA", "APP_ORGANISAATIOHALLINTA_RYHMA_1.2.246.562.10.69981965515", "APP_OID", "APP_OID_READ", "APP_OID_READ_1.2.246.562.10.69981965515", "APP_VALINTOJENTOTEUTTAMINENKK", "APP_VALINTOJENTOTEUTTAMINENKK_CRUD", "APP_VALINTOJENTOTEUTTAMINENKK_CRUD_1.2.246.562.10.69981965515", "APP_HAKULOMAKKEENHALLINTA", "APP_HAKULOMAKKEENHALLINTA_CRUD", "APP_HAKULOMAKKEENHALLINTA_CRUD_1.2.246.562.10.69981965515", "APP_OMATTIEDOT", "APP_OMATTIEDOT_READ_UPDATE", "APP_OMATTIEDOT_READ_UPDATE_1.2.246.562.10.69981965515", "APP_RAPORTOINTI", "APP_RAPORTOINTI_KK", "APP_RAPORTOINTI_KK_1.2.246.562.10.69981965515", "APP_HENKILONHALLINTA", "APP_HENKILONHALLINTA_READ", "APP_HENKILONHALLINTA_READ_1.2.246.562.10.69981965515", "APP_SUORITUSREKISTERI", "APP_SUORITUSREKISTERI_CRUD", "APP_SUORITUSREKISTERI_CRUD_1.2.246.562.10.69981965515", "APP_VALINTAPERUSTEETKK", "APP_VALINTAPERUSTEETKK_CRUD", "APP_VALINTAPERUSTEETKK_CRUD_1.2.246.562.10.69981965515", "APP_VALINTOJENTOTEUTTAMINEN", "APP_VALINTOJENTOTEUTTAMINEN_CRUD", "APP_VALINTOJENTOTEUTTAMINEN_CRUD_1.2.246.562.10.69981965515", "APP_HAKEMUS", "APP_HAKEMUS_CRUD", "APP_HAKEMUS_CRUD_1.2.246.562.10.69981965515", "APP_KKHAKUVIRKAILIJA", "APP_KKHAKUVIRKAILIJA_CRUD", "APP_KKHAKUVIRKAILIJA_CRUD_1.2.246.562.10.69981965515", "APP_TARJONTA", "APP_TARJONTA_CRUD", "APP_TARJONTA_CRUD_1.2.246.562.10.69981965515", "APP_VALINTAPERUSTEET", "APP_VALINTAPERUSTEET_READ", "APP_VALINTAPERUSTEET_READ_1.2.246.562.10.69981965515", "APP_TARJONTA_KK", "APP_TARJONTA_KK_CRUD", "APP_TARJONTA_KK_CRUD_1.2.246.562.10.69981965515", "APP_HAKEMUS", "APP_HAKEMUS_LISATIETORU", "APP_HAKEMUS_LISATIETORU_1.2.246.562.10.69981965515", "APP_VALINTAPERUSTEKUVAUSTENHALLINTA", "APP_VALINTAPERUSTEKUVAUSTENHALLINTA_CRUD", "APP_VALINTAPERUSTEKUVAUSTENHALLINTA_CRUD_1.2.246.562.10.69981965515"];

        this.valintaperusteetApp = 'APP_VALINTAPERUSTEET';
        this.valintaperusteetOphAdmin = 'APP_VALINTAPERUSTEET_CRUD_1.2.246.562.10.00000000001';
        this.valintojentoteuttaminenKK = 'APP_VALINTOJENTOTEUTTAMINENKK';
        this.valintaperusteetCrudOrg = 'APP_VALINTAPERUSTEETKK_CRUD_1.2.246.562.10.34573782876';
        this.valintaperusteetUpdateOrg = 'APP_VALINTAPERUSTEETKK_READ_UPDATE_1.2.246.562.10.34573782876';



        this.palvelut = ["HAKEMUS", "KOOSTEROOLIENHALLINTA", "RAPORTOINTI", "TIEDONSIIRTO", "AITU", "IPOSTI", "EPERUSTEET", "VALINTOJENTOTEUTTAMINEN", "ASIAKIRJAPALVELU", "RYHMASAHKOPOSTI", "OHJAUSPARAMETRIT", "VALINTAPERUSTEET", "LOKALISOINTI", "KKHAKUVIRKAILIJA", "ANOMUSTENHALLINTA", "VALINTAPERUSTEETKK", "YHTEYSTIETOTYYPPIENHALLINTA", "VALINTAPERUSTEKUVAUSTENHALLINTA", "HAKULOMAKKEENHALLINTA", "SUORITUSREKISTERI", "OMATTIEDOT", "TARJONTA", "OSOITE", "YTLMATERIAALITILAUS", "ORGANISAATIOHALLINTA", "SISALLONHALLINTA", "TARJONTA_KK", "VALINTAPERUSTEKUVAUSTENHALLINTA_KK", "VALINTATULOSSERVICE", "HENKILONHALLINTA", "OID", "KOUTE", "AIPAL", "YTLTULOSLUETTELO", "SIJOITTELU", "VALINTOJENTOTEUTTAMINENKK", "HAKUJENHALLINTA", "KOODISTO"];
        this.palveluResourceResult = [
            {
                name: "HAKEMUS",
                palveluTyyppi: "YKSITTAINEN",
                description: {
                    texts: [
                        {
                            text: "Hakemusten kÃ¤sittely",
                            lang: "EN"
                        },
                        {
                            text: "Hakemusten kÃ¤sittely",
                            lang: "SV"
                        },
                        {
                            text: "Hakemusten kÃ¤sittely",
                            lang: "FI"
                        }
                    ]
                },
                kokoelma: null
            },
            {
                name: "KOOSTEROOLIENHALLINTA",
                palveluTyyppi: "YKSITTAINEN",
                description: {
                    texts: [
                        {
                            text: "KÃ¤yttÃ¶oikeusryhmien yllÃ¤pito",
                            lang: "SV"
                        },
                        {
                            text: "KÃ¤yttÃ¶oikeusryhmien yllÃ¤pito",
                            lang: "FI"
                        },
                        {
                            text: "KÃ¤yttÃ¶oikeusryhmien yllÃ¤pito",
                            lang: "EN"
                        }
                    ]
                },
                kokoelma: null
            },
            {
                name: "RAPORTOINTI",
                palveluTyyppi: "YKSITTAINEN",
                description: {
                    texts: [
                        {
                            text: "Raportointi",
                            lang: "FI"
                        },
                        {
                            text: "Raportointi",
                            lang: "SV"
                        },
                        {
                            text: "Raportointi",
                            lang: "EN"
                        }
                    ]
                },
                kokoelma: null
            },
            {
                name: "TIEDONSIIRTO",
                palveluTyyppi: "YKSITTAINEN",
                description: {
                    texts: [
                        {
                            text: "Tiedonsiirto",
                            lang: "EN"
                        },
                        {
                            text: "Tiedonsiirto",
                            lang: "SV"
                        },
                        {
                            text: "Tiedonsiirto",
                            lang: "FI"
                        }
                    ]
                },
                kokoelma: null
            },
            {
                name: "AITU",
                palveluTyyppi: "YKSITTAINEN",
                description: {
                    texts: [
                        {
                            text: "Aitu",
                            lang: "FI"
                        },
                        {
                            text: "Aitu",
                            lang: "EN"
                        },
                        {
                            text: "Aitu",
                            lang: "SV"
                        }
                    ]
                },
                kokoelma: null
            },
            {
                name: "IPOSTI",
                palveluTyyppi: "YKSITTAINEN",
                description: {
                    texts: [
                        {
                            text: "IPosti",
                            lang: "SV"
                        },
                        {
                            text: "IPosti",
                            lang: "FI"
                        },
                        {
                            text: "IPosti",
                            lang: "EN"
                        }
                    ]
                },
                kokoelma: null
            },
            {
                name: "EPERUSTEET",
                palveluTyyppi: "YKSITTAINEN",
                description: {
                    texts: [
                        {
                            text: "ePerusteet",
                            lang: "SV"
                        },
                        {
                            text: "ePerusteet",
                            lang: "FI"
                        },
                        {
                            text: "ePerusteet",
                            lang: "EN"
                        }
                    ]
                },
                kokoelma: null
            },
            {
                name: "VALINTOJENTOTEUTTAMINEN",
                palveluTyyppi: "YKSITTAINEN",
                description: {
                    texts: [
                        {
                            text: "Valintojen toteuttaminen",
                            lang: "EN"
                        },
                        {
                            text: "Valintojen toteuttaminen",
                            lang: "SV"
                        },
                        {
                            text: "Valintojen toteuttaminen",
                            lang: "FI"
                        }
                    ]
                },
                kokoelma: null
            },
            {
                name: "ASIAKIRJAPALVELU",
                palveluTyyppi: "YKSITTAINEN",
                description: {
                    texts: [
                        {
                            text: "Document service",
                            lang: "EN"
                        },
                        {
                            text: "Dokumentservice",
                            lang: "SV"
                        },
                        {
                            text: "ViestintÃ¤palvelu",
                            lang: "FI"
                        }
                    ]
                },
                kokoelma: null
            },
            {
                name: "RYHMASAHKOPOSTI",
                palveluTyyppi: "YKSITTAINEN",
                description: {
                    texts: [
                        {
                            text: "Ryhmasahkoposti",
                            lang: "EN"
                        },
                        {
                            text: "Ryhmasahkoposti",
                            lang: "SV"
                        },
                        {
                            text: "Ryhmasahkoposti",
                            lang: "FI"
                        }
                    ]
                },
                kokoelma: null
            },
            {
                name: "OHJAUSPARAMETRIT",
                palveluTyyppi: "YKSITTAINEN",
                description: {
                    texts: [
                        {
                            text: "Ohjausparametrit",
                            lang: "FI"
                        },
                        {
                            text: "Ohjausparametrit",
                            lang: "EN"
                        },
                        {
                            text: "Ohjausparametrit",
                            lang: "SV"
                        }
                    ]
                },
                kokoelma: null
            },
            {
                name: "VALINTAPERUSTEET",
                palveluTyyppi: "YKSITTAINEN",
                description: {
                    texts: [
                        {
                            text: "Valintaperusteet",
                            lang: "SV"
                        },
                        {
                            text: "Valintaperusteet",
                            lang: "EN"
                        },
                        {
                            text: "Valintaperusteet",
                            lang: "FI"
                        }
                    ]
                },
                kokoelma: null
            },
            {
                name: "LOKALISOINTI",
                palveluTyyppi: "YKSITTAINEN",
                description: {
                    texts: [
                        {
                            text: "KÃ¤Ã¤nnÃ¶sten hallinta",
                            lang: "SV"
                        },
                        {
                            text: "KÃ¤Ã¤nnÃ¶sten hallinta",
                            lang: "FI"
                        },
                        {
                            text: "KÃ¤Ã¤nnÃ¶sten hallinta",
                            lang: "EN"
                        }
                    ]
                },
                kokoelma: null
            },
            {
                name: "KKHAKUVIRKAILIJA",
                palveluTyyppi: "YKSITTAINEN",
                description: {
                    texts: [
                        {
                            text: "KK-hakuvirkailija",
                            lang: "SV"
                        },
                        {
                            text: "KK-hakuvirkailija",
                            lang: "FI"
                        },
                        {
                            text: "KK-hakuvirkailija",
                            lang: "EN"
                        }
                    ]
                },
                kokoelma: null
            },
            {
                name: "ANOMUSTENHALLINTA",
                palveluTyyppi: "YKSITTAINEN",
                description: {
                    texts: [
                        {
                            text: "KÃ¤yttÃ¶oikeusanomukset",
                            lang: "FI"
                        },
                        {
                            text: "KÃ¤yttÃ¶oikeusanomukset",
                            lang: "EN"
                        },
                        {
                            text: "KÃ¤yttÃ¶oikeusanomukset",
                            lang: "SV"
                        }
                    ]
                },
                kokoelma: null
            },
            {
                name: "VALINTAPERUSTEETKK",
                palveluTyyppi: "YKSITTAINEN",
                description: {
                    texts: [
                        {
                            text: "Valintaperusteet KK",
                            lang: "EN"
                        },
                        {
                            text: "Valintaperusteet KK",
                            lang: "SV"
                        },
                        {
                            text: "Valintaperusteet KK",
                            lang: "FI"
                        }
                    ]
                },
                kokoelma: null
            },
            {
                name: "YHTEYSTIETOTYYPPIENHALLINTA",
                palveluTyyppi: "YKSITTAINEN",
                description: {
                    texts: [
                        {
                            text: "Yhteystietotyypit",
                            lang: "SV"
                        },
                        {
                            text: "Yhteystietotyypit",
                            lang: "FI"
                        },
                        {
                            text: "Yhteystietotyypit",
                            lang: "EN"
                        }
                    ]
                },
                kokoelma: null
            },
            {
                name: "VALINTAPERUSTEKUVAUSTENHALLINTA",
                palveluTyyppi: "YKSITTAINEN",
                description: {
                    texts: [
                        {
                            text: "Valintaperustekuvausten yllÃ¤pito",
                            lang: "EN"
                        },
                        {
                            text: "Valintaperustekuvausten yllÃ¤pito",
                            lang: "FI"
                        },
                        {
                            text: "Valintaperustekuvausten yllÃ¤pito",
                            lang: "SV"
                        }
                    ]
                },
                kokoelma: null
            },
            {
                name: "HAKULOMAKKEENHALLINTA",
                palveluTyyppi: "YKSITTAINEN",
                description: {
                    texts: [
                        {
                            text: "Hakulomakkeen hallinta",
                            lang: "FI"
                        },
                        {
                            text: "Hakulomakkeen hallinta",
                            lang: "SV"
                        },
                        {
                            text: "Hakulomakkeen hallinta",
                            lang: "EN"
                        }
                    ]
                },
                kokoelma: null
            },
            {
                name: "SUORITUSREKISTERI",
                palveluTyyppi: "YKSITTAINEN",
                description: {
                    texts: [
                        {
                            text: "Suoritusrekisteri",
                            lang: "FI"
                        },
                        {
                            text: "Suoritusrekisteri",
                            lang: "SV"
                        },
                        {
                            text: "Suoritusrekisteri",
                            lang: "EN"
                        }
                    ]
                },
                kokoelma: null
            },
            {
                name: "OMATTIEDOT",
                palveluTyyppi: "YKSITTAINEN",
                description: {
                    texts: [
                        {
                            text: "Omat tiedot",
                            lang: "FI"
                        },
                        {
                            text: "Omat tiedot",
                            lang: "EN"
                        },
                        {
                            text: "Omat tiedot",
                            lang: "SV"
                        }
                    ]
                },
                kokoelma: null
            },
            {
                name: "TARJONTA",
                palveluTyyppi: "YKSITTAINEN",
                description: {
                    texts: [
                        {
                            text: "Koulutusten ja hakukohteiden yllÃ¤pito",
                            lang: "SV"
                        },
                        {
                            text: "Koulutusten ja hakukohteiden yllÃ¤pito",
                            lang: "EN"
                        },
                        {
                            text: "Koulutusten ja hakukohteiden yllÃ¤pito",
                            lang: "FI"
                        }
                    ]
                },
                kokoelma: null
            },
            {
                name: "OSOITE",
                palveluTyyppi: "YKSITTAINEN",
                description: {
                    texts: [
                        {
                            text: "Osoitepalvelu",
                            lang: "SV"
                        },
                        {
                            text: "Address service",
                            lang: "EN"
                        },
                        {
                            text: "Osoitepalvelu",
                            lang: "FI"
                        }
                    ]
                },
                kokoelma: null
            },
            {
                name: "YTLMATERIAALITILAUS",
                palveluTyyppi: "YKSITTAINEN",
                description: {
                    texts: [
                        {
                            text: "YTL-materiaalitilaus",
                            lang: "SV"
                        },
                        {
                            text: "YTL-materiaalitilaus",
                            lang: "EN"
                        },
                        {
                            text: "YTL-materiaalitilaus",
                            lang: "FI"
                        }
                    ]
                },
                kokoelma: null
            },
            {
                name: "ORGANISAATIOHALLINTA",
                palveluTyyppi: "YKSITTAINEN",
                description: {
                    texts: [
                        {
                            text: "Organisaatiotietojen yllÃ¤pito",
                            lang: "FI"
                        },
                        {
                            text: "Organisaatiotietojen yllÃ¤pito",
                            lang: "SV"
                        },
                        {
                            text: "Organisaatiotietojen yllÃ¤pito",
                            lang: "EN"
                        }
                    ]
                },
                kokoelma: null
            },
            {
                name: "SISALLONHALLINTA",
                palveluTyyppi: "YKSITTAINEN",
                description: {
                    texts: [
                        {
                            text: "SisÃ¤llÃ¶nhallinta",
                            lang: "EN"
                        },
                        {
                            text: "SisÃ¤llÃ¶nhallinta",
                            lang: "SV"
                        },
                        {
                            text: "SisÃ¤llÃ¶nhallinta",
                            lang: "FI"
                        }
                    ]
                },
                kokoelma: null
            },
            {
                name: "TARJONTA_KK",
                palveluTyyppi: "YKSITTAINEN",
                description: {
                    texts: [
                        {
                            text: "Tarjonta kk",
                            lang: "EN"
                        },
                        {
                            text: "Tarjonta kk",
                            lang: "SV"
                        },
                        {
                            text: "Tarjonta kk",
                            lang: "FI"
                        }
                    ]
                },
                kokoelma: null
            },
            {
                name: "VALINTAPERUSTEKUVAUSTENHALLINTA_KK",
                palveluTyyppi: "YKSITTAINEN",
                description: {
                    texts: [
                        {
                            text: "Valintaperustekuvausten yllÃ¤pito KK",
                            lang: "FI"
                        },
                        {
                            text: "Valintaperustekuvausten yllÃ¤pito KK",
                            lang: "EN"
                        },
                        {
                            text: "Valintaperustekuvausten yllÃ¤pito KK",
                            lang: "SV"
                        }
                    ]
                },
                kokoelma: null
            },
            {
                name: "VALINTATULOSSERVICE",
                palveluTyyppi: "YKSITTAINEN",
                description: {
                    texts: [
                        {
                            text: "Valintatulospalvelu",
                            lang: "EN"
                        },
                        {
                            text: "Valintatulospalvelu",
                            lang: "SV"
                        },
                        {
                            text: "Valintatulospalvelu",
                            lang: "FI"
                        }
                    ]
                },
                kokoelma: null
            },
            {
                name: "HENKILONHALLINTA",
                palveluTyyppi: "YKSITTAINEN",
                description: {
                    texts: [
                        {
                            text: "HenkilÃ¶tietojen kÃ¤sittely",
                            lang: "SV"
                        },
                        {
                            text: "HenkilÃ¶tietojen kÃ¤sittely",
                            lang: "FI"
                        },
                        {
                            text: "HenkilÃ¶tietojen kÃ¤sittely",
                            lang: "EN"
                        }
                    ]
                },
                kokoelma: null
            },
            {
                name: "OID",
                palveluTyyppi: "YKSITTAINEN",
                description: {
                    texts: [
                        {
                            text: "OID service",
                            lang: "SV"
                        },
                        {
                            text: "OID-palvelu",
                            lang: "FI"
                        },
                        {
                            text: "OID service",
                            lang: "EN"
                        }
                    ]
                },
                kokoelma: null
            },
            {
                name: "KOUTE",
                palveluTyyppi: "YKSITTAINEN",
                description: {
                    texts: [
                        {
                            text: "OKM:n jÃ¤rjestÃ¤mislupapalvelu",
                            lang: "EN"
                        },
                        {
                            text: "OKM:n jÃ¤rjestÃ¤mislupapalvelu",
                            lang: "FI"
                        },
                        {
                            text: "OKM:n jÃ¤rjestÃ¤mislupapalvelu",
                            lang: "SV"
                        }
                    ]
                },
                kokoelma: null
            },
            {
                name: "AIPAL",
                palveluTyyppi: "YKSITTAINEN",
                description: {
                    texts: [
                        {
                            text: "Aikuiskoulutuksen palautejÃ¤rjestelmÃ¤",
                            lang: "FI"
                        },
                        {
                            text: "Aikuiskoulutuksen palautejÃ¤rjestelmÃ¤",
                            lang: "SV"
                        },
                        {
                            text: "Aikuiskoulutuksen palautejÃ¤rjestelmÃ¤",
                            lang: "EN"
                        }
                    ]
                },
                kokoelma: null
            },
            {
                name: "YTLTULOSLUETTELO",
                palveluTyyppi: "YKSITTAINEN",
                description: {
                    texts: [
                        {
                            text: "YTL-tulosluettelo",
                            lang: "FI"
                        },
                        {
                            text: "YTL-tulosluettelo",
                            lang: "SV"
                        },
                        {
                            text: "YTL-tulosluettelo",
                            lang: "EN"
                        }
                    ]
                },
                kokoelma: null
            },
            {
                name: "SIJOITTELU",
                palveluTyyppi: "YKSITTAINEN",
                description: {
                    texts: [
                        {
                            text: "Sijoittelu",
                            lang: "EN"
                        },
                        {
                            text: "Sijoittelu",
                            lang: "SV"
                        },
                        {
                            text: "Sijoittelu",
                            lang: "FI"
                        }
                    ]
                },
                kokoelma: null
            },
            {
                name: "VALINTOJENTOTEUTTAMINENKK",
                palveluTyyppi: "YKSITTAINEN",
                description: {
                    texts: [
                        {
                            text: "Valintojen toteuttaminen KK",
                            lang: "SV"
                        },
                        {
                            text: "Valintojen toteuttaminen KK",
                            lang: "FI"
                        },
                        {
                            text: "Valintojen toteuttaminen KK",
                            lang: "EN"
                        }
                    ]
                },
                kokoelma: null
            },
            {
                name: "HAKUJENHALLINTA",
                palveluTyyppi: "YKSITTAINEN",
                description: {
                    texts: [
                        {
                            text: "Haun yllÃ¤pito",
                            lang: "FI"
                        },
                        {
                            text: "Haun yllÃ¤pito",
                            lang: "SV"
                        },
                        {
                            text: "Haun yllÃ¤pito",
                            lang: "EN"
                        }
                    ]
                },
                kokoelma: null
            },
            {
                name: "KOODISTO",
                palveluTyyppi: "YKSITTAINEN",
                description: {
                    texts: [
                        {
                            text: "Koodistojen yllÃ¤pito",
                            lang: "FI"
                        },
                        {
                            text: "Koodistojen yllÃ¤pito",
                            lang: "SV"
                        },
                        {
                            text: "Koodistojen yllÃ¤pito",
                            lang: "EN"
                        }
                    ]
                },
                kokoelma: null
            }
        ];



    });







