package fi.vm.sade.valintaperusteet.configurations.security;

import fi.vm.sade.java_utils.security.OpintopolkuCasAuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.cas.ServiceProperties;

public class ValintaperusteetUiCasAuthenticationFilter extends OpintopolkuCasAuthenticationFilter {
  @Autowired
  public ValintaperusteetUiCasAuthenticationFilter(ServiceProperties serviceProperties) {
    super(serviceProperties);
    setAuthenticationDetailsSource(
        new ValintaperusteetUiServiceAuthenticationDetailsSource(serviceProperties));
  }
}
