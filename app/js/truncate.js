angular.module('truncate', [])
.filter('characters', function () {
    return function (input, chars) {
        if (isNaN(chars)) return input;
        if (chars <= 0) return '';
        if (input && input.length >= chars) {
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