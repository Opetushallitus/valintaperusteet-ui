package fi.vm.sade.valintaperusteet.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class ConfigController {

    @Value("${auth.mode:}")
    private String authMode;

    @RequestMapping(value = "/configuration.js", method = RequestMethod.GET, produces = "text/javascript", headers="Accept=*/*")
    @ResponseBody
    public String index() {
        StringBuilder b = new StringBuilder();
        append(b, "TEMPLATE_URL_BASE", "");
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
