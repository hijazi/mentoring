'use strict';



// controllers
/**
* mentoringControllers Module
*
* Module for controllers of the App.
*/
angular
.module('mentoringControllers', ['mentoringServices'])
.controller('mentorsListController', [ '$scope', '$http', 'textSplit', function($scope, $http, textSplit) {

    //varaibles

// console.log(textSplit);
$http.get('data/mentorsInfo.json').success(function(data) {
    $scope.mentors = data;
    var text
    ,   thrown
    ,   textLen
    ,   thrownLen
    ,   sum
    ,   obj
    ,   splitText
    ,   doneText;

    angular.forEach($scope.mentors, function(mentor) {
        mentor.newBio = textSplit.getSplitData(mentor.bio, 500);
        // text = mentor.bio;

        // var obj = textSplit.splitFormatted(text, 100);
        // console.log("requested size:"+100+"split size:"+obj.text.length);
        // mentor.testPrev = obj.text;




        /* old work
        // console.log("t.len:"+text.length+"t:"+text);
        console.log("t.len:"+text.length);
        obj = textSplit.helperStripHtml(text);
        // console.log(obj);
        text = obj.done;
        thrown = obj.thrown;
        textLen = text.length;
        thrownLen = thrown.length;
        sum = textLen+thrownLen;
        splitText = textSplit.getSplitData(text, 500);
        mentor.splitText = splitText;
        // console.log("t.len:"+textLen+"thrown.len:"+thrownLen+"sum:"+sum+"t:"+text);
        console.log("t.len:"+textLen+"thrown.len:"+thrownLen+"sum:"+sum);
        // console.log("mS:"+mentor.splitText);

        */
    });
    console.log('fetched');
}),
function myError(response) {
    console.log('not fetched');
};




}]);

// now you're splitting beform stripping but you need to know where to split after striping