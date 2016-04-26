angular.module('truncate', [])
    .filter('characters', function () {
        return function (input, chars) {
            if (isNaN(chars)) return input;
            if (chars <= 0) return '';
            if (input && input.length >= chars) {
                // check that ther's more than one word and first word smaller than cut length
                var lastspace = input.lastIndexOf(' ');
                var firstSpace = input.indexOf(' ');
                if ( ((lastspace === -1)&& input.length > chars) || (firstSpace > chars )){
                    console.log("input:"+input);

                    return '';
                };
                input = input.substring(0, chars);
                var lastspace = input.lastIndexOf(' ');
                //get last space
                if (lastspace !== -1) {
                    input = input.substr(0, lastspace);
                }
                return input ;
            }
            return input;
        };
    });

    /*
    what if the input was only one word and was longer than chars! in the old script it will be cut!
    */