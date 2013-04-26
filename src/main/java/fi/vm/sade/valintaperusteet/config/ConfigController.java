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

    @Value("${valintaperusteet-ui.valintaperuste-service-url.rest}")
    private String valintaperusteServiceRestURL;

    @RequestMapping(value="/configuration.js", method = RequestMethod.GET, produces="text/javascript")
    @ResponseBody
    public String index() {
        StringBuilder b = new StringBuilder();
        append(b, "SERVICE_URL_BASE", valintaperusteServiceRestURL);
        append(b, "TEMPLATE_URL_BASE", "");
        return b.toString();
    }

    private void append(StringBuilder b, String key, String value) {
        b.append(key);
        b.append( " = \"");
        b.append(value);
        b.append("\";\n");
    }

}
