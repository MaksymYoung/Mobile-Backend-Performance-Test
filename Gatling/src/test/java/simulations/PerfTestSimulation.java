package simulations;

import static assertions.AssertionsMap.ASSERT_MAPPING;
import static config.BaseHelpers.*;
import static io.gatling.javaapi.core.CoreDsl.*;

import io.gatling.javaapi.core.Assertion;
import io.gatling.javaapi.core.PopulationBuilder;
import io.gatling.javaapi.core.Simulation;
import scenarios.UserFlow;

import java.util.List;

public class PerfTestSimulation extends Simulation {
    {
        // Run command:
        // .\mvnw.cmd gatling:test "-Dgatling.simulationClass=simulations.PerfTestSimulation" -DOPEN_USERS=30 -DLOAD_MODEL=open -DRAMP_UP_PERIOD_SECONDS=180
        // .\mvnw.cmd gatling:test "-Dgatling.simulationClass=simulations.PerfTestSimulation" -DOPEN_USERS=30 -DLOAD_MODEL=open -DASSERTION_TYPE=smokeTest -DRAMP_UP_PERIOD_SECONDS=180
        // .\mvnw.cmd gatling:test "-Dgatling.simulationClass=simulations.PerfTestSimulation" -DCONCURRENT_USERS=6 -DLOAD_MODEL=closed
        // .\mvnw.cmd gatling:test "-Dgatling.simulationClass=simulations.PerfTestSimulation" -DCONCURRENT_USERS=6 -DLOAD_MODEL=closed -DASSERTION_TYPE=smokeTest
        setUp(
                injection()
        )
                .protocols(HTTP_PROTOCOL)
                .assertions(assertions());
    }

    private PopulationBuilder injection() {
        if ("closed".equalsIgnoreCase(LOAD_MODEL)) {
            return UserFlow.userJourney()
                    .injectClosed(rampConcurrentUsers(0).to(CONCURRENT_USERS).during(RAMP_UP_PERIOD_SECONDS));
        }

        return UserFlow.userJourney()
                .injectOpen(rampUsers(OPEN_USERS).during(RAMP_UP_PERIOD_SECONDS));
    }

    private Assertion[] assertions() {
        List<Assertion> selectedAssertions = ASSERT_MAPPING.get(ASSERTION_TYPE);
        if (selectedAssertions == null) {
            throw new IllegalArgumentException(
                    "Unsupported ASSERTION_TYPE '" + ASSERTION_TYPE + "'. Supported values: " + ASSERT_MAPPING.keySet()
            );
        }

        return selectedAssertions.toArray(new Assertion[0]);
    }
}
