package fi.vm.sade.valintaperusteet.mocha;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

import fi.vm.sade.valintaperusteet.JettyTestRunner;
import java.util.concurrent.TimeUnit;
import org.junit.Test;

public class ValintaperusteetUIMochaTest {

  @Test
  public void mochaTest() throws Exception {
    JettyTestRunner.start();
    String[] cmd = {
      "node_modules/phantomjs-prebuilt/bin/phantomjs",
      "node_modules/mocha-phantomjs-core/mocha-phantomjs-core.js",
      "http://localhost:" + JettyTestRunner.PORT + "/valintaperusteet-ui/test/runner.html",
      "spec"
    };

    ProcessBuilder pb = new ProcessBuilder(cmd);
    pb.inheritIO();
    Process ps = pb.start();

    assertTrue(ps.waitFor(120, TimeUnit.SECONDS));
    assertEquals(0, ps.exitValue());
    JettyTestRunner.stop();
  }
}
