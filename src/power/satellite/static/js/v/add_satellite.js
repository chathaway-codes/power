define(["jquery", "backbone", "icanhaz", "m/satellite", "backbone-tastypie"], function($, Backbone, ich, satellite) {
    "use strict";

    var possibleStates = {
        INSTRUCTIONS: 0,
        SEARCHING: 1,
        VERIFY: 2,
        ADD: 3,
        CANCEL: 4
    };

    var AppView = Backbone.View.extend({
        el: $("#main"),
        innerEl: $("#main"),

        currentState: possibleStates.INSTRUCTIONS,

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
        },

        nextState: function() {
            console.log("Switching to next state");
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
                var i = ich.verify();
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

                // Save the model, if it exists
                this.model.save({}, {wait: true});
                // Then move to the next state
                this.nextState();
                break;
            case possibleStates.CANCEL:
                var i = ich.cancel();
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
            this.currentState = possibleStates.CANCEL;
            this.setState();
        }
    });
    
    return AppView;
});
