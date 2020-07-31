package fi.vm.sade.valintaperusteet;

import fi.vm.sade.jetty.OpintopolkuJetty;

public class ValintaperusteUiJetty extends OpintopolkuJetty {
  public static final String CONTEXT_PATH = "/valintaperusteet-ui";
  public static final ValintaperusteUiJetty JETTY = new ValintaperusteUiJetty();

  public static void main(String... args) {
    JETTY.start(CONTEXT_PATH);
  }
}
