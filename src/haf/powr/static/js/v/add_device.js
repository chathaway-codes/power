define(["jquery", "backbone", "ejs/ejs", "m/device"], function($, Backbone, EJS, device) {
    "use strict";

    var AppView = Backbone.View.extend({
        el: $("#main"),

        model: new Backbone.Model(),

        events: {
            "change .wiz": "updateWizard",
            "click #override": "enableOverride",
            "click #submit": "save",
        },

        initialize: function() {
            var template = new EJS({ url: window.STATIC_URL + "ejs/powr/device_add.ejs"}).render()
            this.$el.html(template);

            var template = ich.preview(this.model.toJSON());
            $("#preview").html(template);

            // Set some default values
            this.model.set("object", "");
            this.model.set("location", "");
            this.model.set("owner", "");
            this.model.set("unique", "");
        },

        updateWizard: function(e) {
            var target = $(e.currentTarget);
            var val = target.val();
            if(target[0] == $("#object")[0]) {
                // It wouldn't be uncommon for the user to specify "a" or "the" lamp...
                // I'm not sure this is needed
                var commonStarts = ["a ", "A ", "the ", "The "];
                for(var i in commonStarts) {
                    if(val.indexOf(commonStarts[i]) == 0) {
                        val = val.substr(commonStarts[i].length);
                    }
                }
                this.model.set("object", val);
            }
            else if(target[0] == $("#location")[0]) {
                // There isn't much stuff to go in here
                // If it doesn't start with "in", add it
                if(val.indexOf("in ") != 0)
                    val = "in " + val;
                this.model.set("location", val);
            } else if(target[0] == $("#owner")[0]) {
                if(val.charAt(val.length-1) == 's')
                    val = val + "'";
                else
                    val = val + "'s";
                this.model.set("owner", val);
            } else if(target[0] == $("#unique")[0]) {
                // If it starts with "it has a" get rid of it
                var commonStarts = ["it has a ", "a "];
                for(var i in commonStarts) {
                    if(val.indexOf(commonStarts[i]) == 0) {
                        val = val.substr(commonStarts[i].length);
                    }
                }
                this.model.set("unique", val);
            }

            // Now update the value of the object
            var name = this.model.get("object");
            if(this.model.get("owner") != "")
                name = this.model.get("owner") + " " + name;
            if(this.model.get("location") != "")
                name = name + " " + this.model.get("location");
            if(this.model.get("unique") != "")
                name = name + " with the " + this.model.get("unique");
            this.model.set("name", name);
            var template = ich.preview(this.model.toJSON());
            $("#preview").html(template);

        },

        enableOverride: function() {
            // Disable all the text boxes
            $(".wiz").attr("disabled", '');

            // Drop in the override
            var template = ich.override(this.model.toJSON());
            $("#preview").html(template);
        },

        save: function() {
            var model = new device();
            model.save({name: this.model.get("name")}, {success: this.redirect});
            this.model = model;
            var template = ich.saved(model.toJSON());
            $("#main").html(template);
        },

        redirect: function(d) {
            var klass = $("body").attr("class");
            if(klass != "popup ") {
                window.location = "/admin/device/device/" + d.get("id") + "/";
            } else {
                window.opener.location = "/admin/device/device/" + d.get("id") + "/";
                window.close();
            }
        }
    });

    return AppView;
});
