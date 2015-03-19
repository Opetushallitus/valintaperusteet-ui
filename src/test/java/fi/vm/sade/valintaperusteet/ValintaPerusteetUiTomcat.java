package fi.vm.sade.valintaperusteet;

import fi.vm.sade.integrationtest.tomcat.EmbeddedTomcat;
import fi.vm.sade.integrationtest.tomcat.SharedTomcat;
import fi.vm.sade.integrationtest.util.PortChecker;
import fi.vm.sade.integrationtest.util.ProjectRootFinder;
import org.apache.catalina.LifecycleException;
import org.slf4j.LoggerFactory;

import javax.servlet.ServletException;

public class ValintaPerusteetUiTomcat extends EmbeddedTomcat {
    static final String MODULE_ROOT = ProjectRootFinder.findProjectRoot() + "/ui/valintaperusteet-ui";
    static final String CONTEXT_PATH = "/valintaperusteet-ui";
    static final int DEFAULT_PORT = 9094;
    static final int DEFAULT_AJP_PORT = 8530;

    public ValintaPerusteetUiTomcat(int port, int ajpPort) {
        super(port, ajpPort, MODULE_ROOT, CONTEXT_PATH);
    }

    public final static void main(String... args) throws ServletException, LifecycleException {
        useIntegrationTestSettingsIfNoProfileSelected();
        new ValintaPerusteetUiTomcat(
                Integer.parseInt(System.getProperty("/valintaperusteet-ui-app.port", String.valueOf(DEFAULT_PORT))),
                Integer.parseInt(System.getProperty("/valintaperusteet-ui-app.port.ajp", String.valueOf(DEFAULT_AJP_PORT)))
        ).start().await();
    }


    private static void useIntegrationTestSettingsIfNoProfileSelected() {
        System.setProperty("application.system.cache", "false");
        if (System.getProperty("spring.profiles.active") == null) {
            System.setProperty("spring.profiles.active", "it");
        }
        System.out.println("Running embedded with profile " + System.getProperty("spring.profiles.active"));
    }
}
