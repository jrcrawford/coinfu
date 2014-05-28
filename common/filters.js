angular.module('coinfu.filters', ['angularMoment'])
    .filter('cfLocalTime', function() {
        "use strict";

        return function(input) {
            return moment.utc(input).local();
        };
    })

    .filter('cfPercentSmall', function() {
        "use strict";

        return function(input) {
            input = Math.abs(input);
            var mostSig = Math.floor(input);
            input = input - mostSig;
            input = input * 100;
            input = Math.round(input);
            if (input < 10) {
                input = "0" + input;
            }

            return input;
        };
    })

    .filter('cfPercentBig', function() {
        "use strict";

        return function(input) {
            if (input < 0){
                input = Math.ceil(input);
            } else {
                input = Math.floor(input);
            }
            return input;
        };
    });