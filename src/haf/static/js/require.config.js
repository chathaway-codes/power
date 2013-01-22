var require = {
    baseUrl: window.STATIC_URL + 'js/',
    paths: {
        "jquery": "components/jquery/jquery",
        "backbone": "components/backbone/backbone",
        "underscore": "components/underscore/underscore",
        "ejs": "components/ejs.js/"
    },

    shim: {
        underscore: {
            exports: "_"
        },
        backbone: {
            deps: ["underscore", "jquery"],
            exports: "Backbone"
        },
    }
}

console.log(require);
