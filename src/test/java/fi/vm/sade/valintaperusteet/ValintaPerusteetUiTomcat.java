package fi.vm.sade.valintaperusteet;

import fi.vm.sade.integrationtest.tomcat.EmbeddedTomcat;
import fi.vm.sade.integrationtest.util.ProjectRootFinder;
import org.apache.catalina.LifecycleException;

import javax.servlet.ServletException;

public class ValintaPerusteetUiTomcat extends EmbeddedTomcat {
    static final String MODULE_ROOT = ProjectRootFinder.findProjectRoot() + "/ui/valintaperusteet-ui";
    static final String CONTEXT_PATH = "/valintaperusteet-ui";
    static final int DEFAULT_PORT = 9094;
    static final int DEFAULT_AJP_PORT = 18530;

    public ValintaPerusteetUiTomcat(int port, int ajpPort) {
        super(port, ajpPort, MODULE_ROOT, CONTEXT_PATH);
    }

    public final static void main(String... args) {
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
