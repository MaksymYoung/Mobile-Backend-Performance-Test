package config;

import io.gatling.javaapi.http.HttpProtocolBuilder;

import static io.gatling.javaapi.http.HttpDsl.http;

public class BaseHelpers {

    private BaseHelpers() {
    }

    public static final String BASE_URL = System.getProperty("BASE_URL", "https://en.wikipedia.org");
    public static final String THUMB_BASE_URL = System.getProperty("THUMB_BASE_URL", "https://thumb.wikimedia.org");
    public static final String ARTICLE_TITLE = System.getProperty("ARTICLE_TITLE", "Epaminondas");
    public static final String SEARCH_TERM = System.getProperty("SEARCH_TERM", "epam");
    public static final String WIKIPEDIA_APP_USER_AGENT = System.getProperty(
            "WIKIPEDIA_APP_USER_AGENT",
            "WikipediaApp/50608-r-2026-09-15 (Android 13; Phone; sdk_gphone64_x86_64 Build/TE1A.240213.009) Google Play"
    );

    public static final HttpProtocolBuilder HTTP_PROTOCOL = http
            .baseUrl(BASE_URL)
            .acceptEncodingHeader("gzip")
            .acceptLanguageHeader("en")
            .userAgentHeader(WIKIPEDIA_APP_USER_AGENT)
            .disableCaching();

    public static final int MIN_THINK_TIME_SECONDS = Integer.parseInt(
            System.getProperty("MIN_THINK_TIME_SECONDS", "2"));

    public static final int MAX_THINK_TIME_SECONDS = Integer.parseInt(
            System.getProperty("MAX_THINK_TIME_SECONDS", "4"));

    public static final int OPEN_USERS = Integer.parseInt(
            System.getProperty("OPEN_USERS", "50"));

    public static final int CONCURRENT_USERS = Integer.parseInt(
            System.getProperty("CONCURRENT_USERS", "50"));

    public static final int RAMP_UP_PERIOD_SECONDS = Integer.parseInt(
            System.getProperty("RAMP_UP_PERIOD_SECONDS", "90"));

    public static final String LOAD_MODEL = System.getProperty("LOAD_MODEL", "open");

    public static final String ASSERTION_TYPE = System.getProperty(
            "ASSERTION_TYPE", "wikipediaMobile"
    );

    public static final double SUCCESSFUL_REQUESTS_PERCENT = Double.parseDouble(
            System.getProperty("SUCCESSFUL_REQUESTS_PERCENT", "99.0"));

    public static final int APP_BOOTSTRAP_RESPONSE_TIME_MILLISECONDS = Integer.parseInt(
            System.getProperty("APP_BOOTSTRAP_RESPONSE_TIME_MILLISECONDS", "2500"));

    public static final int SEARCH_RESPONSE_TIME_MILLISECONDS = Integer.parseInt(
            System.getProperty("SEARCH_RESPONSE_TIME_MILLISECONDS", "3000"));

    public static final int ARTICLE_SUMMARY_RESPONSE_TIME_MILLISECONDS = Integer.parseInt(
            System.getProperty("ARTICLE_SUMMARY_RESPONSE_TIME_MILLISECONDS", "2500"));

    public static final int ARTICLE_CATEGORIES_RESPONSE_TIME_MILLISECONDS = Integer.parseInt(
            System.getProperty("ARTICLE_CATEGORIES_RESPONSE_TIME_MILLISECONDS", "2500"));

    public static final int ARTICLE_MOBILE_HTML_RESPONSE_TIME_MILLISECONDS = Integer.parseInt(
            System.getProperty("ARTICLE_MOBILE_HTML_RESPONSE_TIME_MILLISECONDS", "3000"));

    public static final int ARTICLE_THUMBNAILS_RESPONSE_TIME_MILLISECONDS = Integer.parseInt(
            System.getProperty("ARTICLE_THUMBNAILS_RESPONSE_TIME_MILLISECONDS", "3000"));
}
