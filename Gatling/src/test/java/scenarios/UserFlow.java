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
                .exec(flushHttpCache())
                .exec(flushCookieJar())
                .exitBlockOnFail().on(
                        page(Navigation.loadNamespaces("001_AppBootstrap"))
                                .exec(page(Navigation.searchPrefix("002_Search_e", SEARCH_TERM.substring(0, 1))))
                                .exec(page(Navigation.searchPrefix("003_Search_ep", SEARCH_TERM.substring(0, 2))))
                                .exec(page(Navigation.searchPrefix("004_Search_epa", SEARCH_TERM.substring(0, 3))))
                                .exec(page(Navigation.searchPrefix("005_Search_epam", SEARCH_TERM)))
                                .exec(page(Navigation.loadArticleSummary("006_ArticleSummary")))
                                .exec(page(Navigation.loadArticleCategories("007_ArticleCategories")))
                                .exec(page(Navigation.loadArticleMobileHtml("008_ArticleMobileHtml")))
                                .exec(page(Navigation.loadArticleThumbnails("009_ArticleThumbnails")))
                );
    }

    private static ChainBuilder page(ChainBuilder request) {
        return exec(request).pause(MIN_THINK_TIME_SECONDS, MAX_THINK_TIME_SECONDS);
    }
}
