define(["jquery", "backbone", "icanhaz", "m/satellite", "backbone-tastypie"], function($, Backbone, ich, satellite) {
    "use strict";

    var possibleStates = {
        INSTRUCTIONS: 0,
        SEARCHING: 1,
        VERIFY: 2,
        ADD: 3,
        CANCEL: 4
    };

    var possibleDirections = {
        BACKWARD: 0,
        CANCEL: 1,
        FORWARD: 2,
        UNKNOWN: 3
    };

    var AppView = Backbone.View.extend({
        el: $("#main"),
        innerEl: $("#main"),

        currentState: possibleStates.INSTRUCTIONS,
        previousState: possibleStates.INSTRUCTIONS,
        direction: possibleDirections.UNKNOWN,

        model: new satellite(),

        events: {
            "click #next": "nextState",
            "click #prev": "prevState",
            "click #cancel": "cancel"
        },

        initialize: function() {
            // Create an inner elements
            this.innerEl = $("#inner-el");
            this.currentState = possibleStates.INSTRUCTIONS;
            this.setState();
            var klass = $("body").attr("class");
            if(klass == "popup ") {
                resizeTo(225, 510);
                $("#content").css("width", "200px");
                //$("#container").css("width", "150px");
                $("#container").css("min-width", "200px");
                //$("body").css("width", "150px");
            }
        },

        nextState: function() {
            this.previousState = this.currentState;
            this.direction = possibleDirections.FORWARD;
            switch(this.currentState) {
            case possibleStates.INSTRUCTIONS:
                this.currentState = possibleStates.SEARCHING;
                break;
            case possibleStates.SEARCHING:
                this.currentState = possibleStates.VERIFY;
                break;
            case possibleStates.VERIFY:
                this.currentState = possibleStates.ADD;
                break;
            case possibleStates.ADD:
                this.currentState = possibleStates.CANCEL;
                break;
            case possibleStates.CANCEL:
                this.currentState = possibleStates.CANCEL;
                break;
            }

            this.setState();
        },

        prevState: function() {
            this.previousState = this.currentState;
            this.direction = possibleDirections.BACKWARD;
            switch(this.currentState) {
            case possibleStates.INSTRUCTIONS:
                this.currentState = possibleStates.CANCEL;
                break;
            case possibleStates.SEARCHING:
                this.currentState = possibleStates.CANCEL;
                break;
            case possibleStates.VERIFY:
                this.currentState = possibleStates.SEARCHING;
                break;
            case possibleStates.ADD:
                // This state does not have a previous state
                break;
            case possibleStates.CANCEL:
                this.currentState = possibleStates.CANCEL;
                break;
            }

            this.setState();
        },

        setState: function() {
            // Now that each state has been set, load up the template 
            //  and execute any code specific to that state
            switch(this.currentState) {
            case possibleStates.INSTRUCTIONS:
                var i = ich.instructions();
                this.innerEl.html(i);

                // The previous button should be disabled, everything else enabled
                $("#prev").attr('disabled', '');
                $("#cancel").removeAttr('disabled');
                $("#next").removeAttr('disabled');
                break;
            case possibleStates.SEARCHING:
                var i = ich.searching();
                this.innerEl.html(i);

                // Disable the previous and next buttons
                $("#prev").attr('disabled', '');
                $("#cancel").removeAttr('disabled');
                $("#next").attr('disabled', '');

                // If a searching action was defined, call that
                console.log(this.options.searching);
                if(typeof this.options.searching == 'function') {
                    this.options.searching();
                }
                break;
            case possibleStates.VERIFY:
                var i = ich.verify(this.model.toJSON());
                this.innerEl.html(i);

                // All buttons should be enabled
                // Disable the previous and next buttons
                $("#prev").removeAttr('disabled');
                $("#cancel").removeAttr('disabled');
                $("#next").removeAttr('disabled');

                break;
            case possibleStates.ADD:
                var i = ich.add();
                this.innerEl.html(i);

                // All buttons should be disabled
                // Disable the previous and next buttons
                $("#prev").attr('disabled', '');
                $("#cancel").attr('disabled', '');
                $("#next").attr('disabled', '');

                // Remove dashes from name
                this.model.set("serial_number", this.model.get("serial_number").replace(/\-/g, ""));

                // Save the model, if it exists
                this.model.save({outlet: "A"}, {wait: true});
                this.model.save({outlet: "B"}, {wait: true});
                // Then move to the next state
                this.nextState();
                break;
            case possibleStates.CANCEL:
                var message;
                console.log(this.previousState);
                console.log(possibleStates.ADD);
                console.log(this.previousState == possibleStates.ADD);
                if(this.previousState == possibleStates.ADD) {
                    message = "Satellite added!";
                 } else {
                    message = "Sattelite search cancelled.";
                }

                var klass = $("body").attr("class");
                if(klass == "popup ") {
                    var delay = 5;
                    var innerEl = this.innerEl;
                    setInterval(function() {
                        var mm = message;
                        var m = "<br />This window will self-desctruct in <b>" + delay;
                        if(delay > 1)
                            m += "</b> seconds";
                        else
                            m += "</b> second";
                        var i = ich.cancel({message: mm+m});
                        innerEl.html(i);
                        delay -= 1;
                    }, 1000);
                    message = message + " Click <a href=\"javascript: self.close()\">here</a> to close the window.<br />";
                    setTimeout(function () {
                        window.opener.location.reload();
                        window.close();
                    }, 6000);
                }
                else
                    message = message + " Please return to the home page.";
                var i = ich.cancel({message: message});
                this.innerEl.html(i);

                // All buttons should be disabled
                // Disable the previous and next buttons
                $("#prev").attr('disabled', '');
                $("#cancel").attr('disabled', '');
                $("#next").attr('disabled', '');

                break;
            }
        },

        cancel: function() {
            this.previousState = this.currentState;
            this.direction = possibleDirections.CANCEL;
            this.currentState = possibleStates.CANCEL;
            this.setState();
        }
    });
    
    return AppView;
});
