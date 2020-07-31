package fi.vm.sade.valintaperusteet.config;

import fi.vm.sade.properties.OphProperties;
import java.nio.file.Paths;
import org.springframework.context.annotation.Configuration;

@Configuration
public class UrlConfiguration extends OphProperties {
  public UrlConfiguration() {
    addFiles("/valintaperusteet-ui-oph.properties");
    addOptionalFiles(
        Paths.get(
                System.getProperties().getProperty("user.home"),
                "/oph-configuration/common.properties")
            .toString());
  }
}
