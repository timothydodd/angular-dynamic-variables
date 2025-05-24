(function (window) {
    var appConfig = {
        production: true,
        apiUrl: '${API_URL}',
        favColor: '${FAV_COLOR}',
        favCatchPhrase: '${FAV_CATCH_PHRASE}',
        // Add other environment-controlled settings as needed
    };
    window.APP_CONFIG = appConfig;
})(window);
