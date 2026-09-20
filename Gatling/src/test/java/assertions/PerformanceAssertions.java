package assertions;

import io.gatling.javaapi.core.Assertion;

import java.util.List;

import static config.BaseHelpers.*;
import static io.gatling.javaapi.core.CoreDsl.*;

public class PerformanceAssertions {

    public static final String SMOKE_TEST = "smokeTest";
    public static final String WIKIPEDIA_MOBILE = "wikipediaMobile";

    public static final List<Assertion> smokeTestAssertions = List.of(
            global().successfulRequests().percent().gte(SUCCESSFUL_REQUESTS_PERCENT)
    );

    public static final List<Assertion> wikipediaMobileAssertions = List.of(
            details("001_AppBootstrap").responseTime().percentile3().lte(APP_BOOTSTRAP_RESPONSE_TIME_MILLISECONDS),
            details("002_Search_e").responseTime().percentile3().lte(SEARCH_RESPONSE_TIME_MILLISECONDS),
            details("003_Search_ep").responseTime().percentile3().lte(SEARCH_RESPONSE_TIME_MILLISECONDS),
            details("004_Search_epa").responseTime().percentile3().lte(SEARCH_RESPONSE_TIME_MILLISECONDS),
            details("005_Search_epam").responseTime().percentile3().lte(SEARCH_RESPONSE_TIME_MILLISECONDS),
            details("006_ArticleSummary").responseTime().percentile3().lte(ARTICLE_SUMMARY_RESPONSE_TIME_MILLISECONDS),
            details("007_ArticleCategories").responseTime().percentile3().lte(ARTICLE_CATEGORIES_RESPONSE_TIME_MILLISECONDS),
            details("008_ArticleMobileHtml").responseTime().percentile3().lte(ARTICLE_MOBILE_HTML_RESPONSE_TIME_MILLISECONDS),
            details("009_ArticleThumbnails").responseTime().percentile3().lte(ARTICLE_THUMBNAILS_RESPONSE_TIME_MILLISECONDS)
    );
}
