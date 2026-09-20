package api;

import io.gatling.javaapi.core.ChainBuilder;

import java.util.Map;

import static config.BaseHelpers.*;
import static io.gatling.javaapi.core.CoreDsl.*;
import static io.gatling.javaapi.http.HttpDsl.*;

public class Navigation {

    public static ChainBuilder loadNamespaces(String group) {
        return group(group).on(
                exec(
                        http("GET /w/api.php?action=query&meta=siteinfo")
                                .get("/w/api.php")
                                .headers(commonApiHeaders())
                                .queryParamMap(siteInfoParams())
                                .check(status().is(200))
                                .check(jsonPath("$.query.namespaces").exists())
                )
        );
    }

    public static ChainBuilder searchPrefix(String group, String prefix) {
        return group(group).on(
                exec(
                        http("GET /w/api.php?generator=prefixsearch&gpssearch=" + prefix)
                                .get("/w/api.php")
                                .headers(commonApiHeaders())
                                .queryParamMap(prefixSearchParams(prefix))
                                .check(status().is(200))
                                .check(jsonPath("$.query.pages").exists())
                )
        );
    }

    public static ChainBuilder loadArticleCategories(String group) {
        return group(group).on(
                exec(
                        http("GET /w/api.php?action=query&prop=categories&titles=" + ARTICLE_TITLE)
                                .get("/w/api.php")
                                .headers(commonApiHeaders())
                                .queryParamMap(categoryParams())
                                .check(status().is(200))
                                .check(jsonPath("$.query.pages[0].title").is(ARTICLE_TITLE))
                )
        );
    }

    public static ChainBuilder loadArticleSummary(String group) {
        return group(group).on(
                exec(
                        http("GET /api/rest_v1/page/summary/" + ARTICLE_TITLE)
                                .get("/api/rest_v1/page/summary/" + ARTICLE_TITLE)
                                .headers(articleHeaders("preview=1"))
                                .header("accept", "application/json; charset=utf-8; profile=\"https://www.mediawiki.org/wiki/Specs/Summary/1.2.0\"")
                                .check(status().is(200))
                )
        );
    }

    public static ChainBuilder loadArticleMobileHtml(String group) {
        return group(group).on(
                exec(
                        http("GET /api/rest_v1/page/mobile-html/" + ARTICLE_TITLE)
                                .get("/api/rest_v1/page/mobile-html/" + ARTICLE_TITLE)
                                .headers(articleHeaders("pageview=1"))
                                .header("accept", "application/json; charset=utf-8; profile=\"https://www.mediawiki.org/wiki/Specs/Mobile-HTML/1.2.1\"")
                                .header("upgrade-insecure-requests", "1")
                                .check(status().is(200))
                )
        );
    }

    public static ChainBuilder loadArticleThumbnails(String group) {
        return group(group).on(
                exec(
                        http("GET thumb Question_book-new.svg")
                                .get(THUMB_BASE_URL + "/wikipedia/en/thumb/9/99/Question_book-new.svg/120px-Question_book-new.svg.png")
                                .queryParamMap(thumbnailParams())
                                .headers(imageHeaders())
                                .check(status().is(200))
                ),
                exec(
                        http("GET thumb Thebes_Stater.jpg")
                                .get(THUMB_BASE_URL + "/wikipedia/commons/thumb/9/9b/Thebes%2C_Stater%2C_c.364-362_BC%2C_HGC_1333.jpg/500px-Thebes%2C_Stater%2C_c.364-362_BC%2C_HGC_1333.jpg")
                                .queryParamMap(thumbnailParams())
                                .headers(imageHeaders())
                                .check(status().is(200))
                )
        );
    }

    private static Map<String, Object> siteInfoParams() {
        return Map.of(
                "format", "json",
                "formatversion", "2",
                "errorformat", "html",
                "errorsuselocal", "1",
                "action", "query",
                "meta", "siteinfo",
                "siprop", "namespaces"
        );
    }

    private static Map<String, Object> prefixSearchParams(String prefix) {
        return Map.ofEntries(
                Map.entry("format", "json"),
                Map.entry("formatversion", "2"),
                Map.entry("errorformat", "html"),
                Map.entry("errorsuselocal", "1"),
                Map.entry("action", "query"),
                Map.entry("redirects", ""),
                Map.entry("converttitles", ""),
                Map.entry("prop", "description|pageimages|coordinates|info"),
                Map.entry("piprop", "thumbnail"),
                Map.entry("pilicense", "any"),
                Map.entry("generator", "prefixsearch"),
                Map.entry("gpsnamespace", "0"),
                Map.entry("inprop", "varianttitles|displaytitle"),
                Map.entry("pithumbsize", "330"),
                Map.entry("gpssearch", prefix),
                Map.entry("gpslimit", "30"),
                Map.entry("gpsoffset", "0")
        );
    }

    private static Map<String, Object> categoryParams() {
        return Map.of(
                "format", "json",
                "formatversion", "2",
                "errorformat", "html",
                "errorsuselocal", "1",
                "action", "query",
                "prop", "categories",
                "clshow", "!hidden",
                "cllimit", "100",
                "titles", ARTICLE_TITLE
        );
    }

    private static Map<String, Object> thumbnailParams() {
        return Map.of(
                "utm_source", "en.wikipedia.org",
                "utm_campaign", "parser",
                "utm_content", "thumbnail"
        );
    }

    private static Map<String, String> commonApiHeaders() {
        return Map.of(
                "accept-language", "en"
        );
    }

    private static Map<String, String> articleHeaders(String analytics) {
        return Map.of(
                "accept-language", "en",
                "x-offline-lang", "en",
                "x-offline-title", ARTICLE_TITLE,
                "x-analytics", analytics
        );
    }

    private static Map<String, String> imageHeaders() {
        return Map.of(
                "accept", "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
                "referer", BASE_URL + "/",
                "accept-language", "en",
                "x-offline-lang", "en",
                "x-offline-title", ARTICLE_TITLE
        );
    }
}
