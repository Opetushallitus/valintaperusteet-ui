package fi.vm.sade.valintaperusteet.config;

import java.io.IOException;
import java.util.Collections;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;
import java.util.Properties;

import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.google.gson.Gson;

/**
 * 
 * @author Jussi Jartamo
 * 
 *         Vie I18N tiedostot angularin kaytettavaksi. Halutaan valttaa
 *         template-tyokalujen kayttoa niin on ainoa vaihtoehto.
 */
@Controller
public class I18NController {

    private static final Map<String, String> I18N_RESOURCES = loadImmutableResourceMap();

    @RequestMapping(value = "/i18n_{lowerCaseLocale}.js", method = RequestMethod.GET, produces = "application/json; charset=utf-8")
    @ResponseBody
    public String getI18N(@PathVariable String lowerCaseLocale, Locale locale) throws IOException {
        // String lowercase = locale.toString().toLowerCase();
        return I18N_RESOURCES.get(lowerCaseLocale);
    }

    private static Map<String, String> loadImmutableResourceMap() {
        try {
            Gson gson = new Gson();
            Map<String, String> tmp = new HashMap<String, String>();
            tmp.put("en-us", gson.toJson(fromClassPathResource("i18n/messages_en_US.properties")));
            tmp.put("fi-fi", gson.toJson(fromClassPathResource("i18n/messages_fi_FI.properties")));
            return Collections.unmodifiableMap(tmp);
        } catch (IOException e) {
            e.printStackTrace();
        }
        throw new RuntimeException("Loading resource files failed for some reason!");
    }

    private static Properties fromClassPathResource(String resource) throws IOException {
        Properties p = new Properties();
        p.load(new ClassPathResource(resource).getInputStream());
        return p;
    }
}
