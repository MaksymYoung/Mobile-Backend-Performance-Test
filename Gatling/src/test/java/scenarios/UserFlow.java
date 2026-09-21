package scenarios;

import api.Navigation;
import io.gatling.javaapi.core.ChainBuilder;
import io.gatling.javaapi.core.ScenarioBuilder;

import static config.BaseHelpers.*;
import static io.gatling.javaapi.core.CoreDsl.*;
import static io.gatling.javaapi.http.HttpDsl.*;

public class UserFlow {

    public static ScenarioBuilder userJourney() {
        return scenario("Wikipedia Android Search Journey")
                .exec(flushHttpCache(), flushCookieJar())
                .exitBlockOnFail().on(
                        exec(
                                Navigation.loadNamespaces("001_AppBootstrap"),
                                search(Navigation.searchPrefix("002_Search_e", searchTermPrefix(1))),
                                search(Navigation.searchPrefix("003_Search_ep", searchTermPrefix(2))),
                                search(Navigation.searchPrefix("004_Search_epa", searchTermPrefix(3))),
                                openResult(Navigation.searchPrefix("005_Search_epam", SEARCH_TERM)),
                                Navigation.loadArticleSummary("006_ArticleSummary"),
                                Navigation.loadArticleCategories("007_ArticleCategories"),
                                Navigation.loadArticleMobileHtml("008_ArticleMobileHtml"),
                                Navigation.loadArticleThumbnails("009_ArticleThumbnails")
                        )
                );
    }

    private static ChainBuilder search(ChainBuilder request) {
        return request.pause(SEARCH_KEYSTROKE_THINK_TIME_SECONDS);
    }

    private static ChainBuilder openResult(ChainBuilder request) {
        return request.pause(SEARCH_RESULT_REVIEW_THINK_TIME_SECONDS);
    }

    private static String searchTermPrefix(int length) {
        return SEARCH_TERM.substring(0, Math.min(length, SEARCH_TERM.length()));
    }
}
