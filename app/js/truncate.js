angular.module('truncate', [])
.filter('characters', function () {
    return function (text, size) {
        if (isNaN(size)) return text;
        if (size <= 0) return '';
        if (text && text.length >= size) {
            text = text.substring(0, size);
            var lastspace = text.lastIndexOf(' ');
            //get last space
            if (lastspace !== -1) {
                text = text.substr(0, lastspace);
            }
            return text ;
        }
        return text;
    };
});

    /*
    what if the input was only one word and was longer than size! in the old script it will be cut!
    */