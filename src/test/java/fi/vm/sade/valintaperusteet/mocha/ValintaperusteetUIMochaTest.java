package fi.vm.sade.valintaperusteet.mocha;

import static org.junit.jupiter.api.Assertions.*;

import fi.vm.sade.valintaperusteet.TestApp;
import java.util.concurrent.TimeUnit;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest(classes = TestApp.class, webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
public class ValintaperusteetUIMochaTest {

  @LocalServerPort private int port;

  @Test
  public void mochaTest() throws Exception {
    System.setProperty("front.baseUrl", "http://localhost:" + port);

    String runnerUrl = "http://localhost:" + port + "/valintaperusteet-ui/test/runner.html";
    String node = new java.io.File("node/node").canExecute() ? "node/node" : "node";

    String[] cmd = {node, "scripts/run-mocha-in-chrome.js", runnerUrl};

    System.out.println(runnerUrl);

    ProcessBuilder pb = new ProcessBuilder(cmd);
    pb.inheritIO();
    Process ps = pb.start();

    assertTrue(ps.waitFor(120, TimeUnit.SECONDS));
    assertEquals(0, ps.exitValue());
  }
}
