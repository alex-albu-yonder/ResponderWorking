(function () {
    var fileName;
    var language = window.localStorage.getItem("Language");

    switch (language) {
        case "nl":
            fileName = "bower_components/angular-i18n/angular-locale_nl.js";
            break;
        case "en":
            fileName = "bower_components/angular-i18n/angular-locale_en-gb.js";
            break;
    }

    if (fileName) {
        $.holdReady(true);
        $.getScript(fileName, function () {
            $.holdReady(false);
        });
    }    
})();