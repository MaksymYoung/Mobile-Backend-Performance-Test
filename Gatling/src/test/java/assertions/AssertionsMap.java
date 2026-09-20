package assertions;

import io.gatling.javaapi.core.Assertion;

import java.util.List;
import java.util.Map;

import static assertions.PerformanceAssertions.*;

public class AssertionsMap {

    public static final Map<String, List<Assertion>> ASSERT_MAPPING = Map.of(
            SMOKE_TEST, smokeTestAssertions,
            WIKIPEDIA_MOBILE, wikipediaMobileAssertions
    );
}
