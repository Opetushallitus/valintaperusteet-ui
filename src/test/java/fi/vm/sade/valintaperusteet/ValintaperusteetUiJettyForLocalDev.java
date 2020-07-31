package fi.vm.sade.valintaperusteet;

import static fi.vm.sade.valintaperusteet.ValintaperusteUiJetty.CONTEXT_PATH;
import static fi.vm.sade.valintaperusteet.ValintaperusteUiJetty.JETTY;

import java.time.Duration;

public class ValintaperusteetUiJettyForLocalDev {
  public static final int port =
      Integer.parseInt(System.getProperty("valintaperusteet-ui.port", "8082"));

  public static void main(String... args) {
    JETTY.start(CONTEXT_PATH, port, 1, 10, Duration.ofMinutes(1));
  }
}
