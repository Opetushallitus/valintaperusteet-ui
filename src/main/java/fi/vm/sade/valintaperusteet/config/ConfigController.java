package fi.vm.sade.valintaperusteet.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * @author kkammone
 */
@Controller
public class ConfigController {
    @Value("${localisation.rest:https://itest-virkailija.oph.ware.fi/lokalisointi/cxf/rest/v1}")
    private String localisationUrl;

    @Value("${valintaperusteet-ui.valintaperuste-service-url.rest}")
    private String valintaperusteServiceRestURL;

    @Value("${valintaperusteet-ui.koodisto-service-url.rest}")
    private String koodistoServiceRestURL;

    @Value("${valintaperusteet-ui.tarjona-service-url.rest}")
    private String tarjontaServiceRestURL;

    @Value("${valintaperusteet-ui.organisaatio-service-url}")
    private String organisaatioServiceURL;

    @Value("${valintaperusteet-ui.valintalaskentakoostepalvelu-service-url.rest}")
    private String valintalaskentakoostepalvelu;

    @Value("${auth.mode:}")
    private String authMode;

    @Value("${valintalaskenta-ui.cas.url:/cas/myroles}")
    private String casUrl;

    @Value("${valintaperusteet-ui.lokalisointi-service-url}")
    private String lokalisointiServiceUrl;

    @Value("${valintalaskenta-ui.hakemus-service-url.rest}")
    private String hakemusServiceUrl;

    @RequestMapping(value = "/configuration.js", method = RequestMethod.GET, produces = "text/javascript", headers="Accept=*/*")
    @ResponseBody
    public String index() {
        StringBuilder b = new StringBuilder();
        append(b, "LOCALISATION_URL_BASE", localisationUrl);
        append(b, "SERVICE_URL_BASE", valintaperusteServiceRestURL);
        append(b, "KOODISTO_URL_BASE", koodistoServiceRestURL);
        append(b, "TARJONTA_URL_BASE", tarjontaServiceRestURL);
        append(b, "ORGANIZATION_SERVICE_URL_BASE", organisaatioServiceURL);
        append(b, "VALINTALASKENTAKOOSTE_URL_BASE", valintalaskentakoostepalvelu);
        append(b, "LOKALISOINTIPALVELU_URL_BASE", lokalisointiServiceUrl);
        append(b, "HAKEMUS_URL_BASE", hakemusServiceUrl);
        append(b, "TEMPLATE_URL_BASE", "");

        append(b, "CAS_URL", casUrl);
        if (!authMode.isEmpty()) {
            append(b, "AUTH_MODE", authMode);

        }

        return b.toString();
    }

    private void append(StringBuilder b, String key, String value) {
        b.append(key);
        b.append(" = \"");
        b.append(value);
        b.append("\";\n");
    }

}
