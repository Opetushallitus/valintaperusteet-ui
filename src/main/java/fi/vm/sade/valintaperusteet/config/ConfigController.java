package fi.vm.sade.valintaperusteet.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import javax.servlet.http.HttpServletResponse;

/**
 * User: tommiha
 * Date: 2/15/13
 * Time: 2:43 PM
 */
@Controller
public class ConfigController {

    @Value("${valintaperusteet-ui.valintaperuste-service-url.rest}")
    private String valintaperusteServiceRestURL;

    @RequestMapping(value="/configuration.js", method = RequestMethod.GET, produces="text/javascript")
    @ResponseBody
    public String index(HttpServletResponse response) {
       // response.setContentType("text/javascript");
      //  response.setCharacterEncoding("UTF-8");
        StringBuilder b = new StringBuilder();
        append(b, "SERVICE_URL_BASE", valintaperusteServiceRestURL);
        append(b, "TEMPLATE_URL_BASE", "");
        /*
        try{
            PrintWriter out = response.getWriter();
            out.println(b.toString());
            out.close();
        }
        catch(IOException ex){
          ex.printStackTrace();
        }
            //response.getWriter().print(b.toString());
            //return b.toString();
            */
        return b.toString();

        }

    private void append(StringBuilder b, String key, String value) {
        b.append(key);
        b.append( " = \"");
        b.append(value);
        b.append("\";\n");
    }

}
