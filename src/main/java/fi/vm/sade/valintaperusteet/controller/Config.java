package fi.vm.sade.valintaperusteet.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class Config {

  @Value("${auth.mode:}")
  public String authMode;

  @Value("${valintaperusteet-ui.session-keepalive-interval.seconds:10000}")
  public Integer sessionKeepAliveIntervalInSeconds;

  @Value("${valintaperusteet-ui.session-max-idle-time.seconds:10000}")
  public Integer maxSessionIdleTimeInSeconds;

  @Value("${valintaperusteet-ui.sijoitteluntulokset.show-tila-hakijalle:true}")
  public boolean showTilaHakijalleInSijoittelunTulokset;
}
