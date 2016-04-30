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
    ,   obj
    ,   doneText;

    angular.forEach($scope.mentors, function(mentor) {
        mentor.newBio = textSplit.getSplitData(mentor.bio, 500);
        text = mentor.newBio[0];
        console.log("t.len:"+text.length+"t:"+text);
        obj = textSplit.helperStripHtml(text);
        console.log(obj);
        text = obj.done;
        var thrown = obj.thrown;
        var textLen = text.length;
        var thrownLen = thrown.length;
        var sum = textLen+thrownLen;
        console.log("t.len:"+textLen+"thrown.len:"+thrownLen+"sum:"+sum+"t:"+text);
    });
    console.log('fetched');
}),
function myError(response) {
    console.log('not fetched');
};




}]);

// now you're splitting beform stripping but you need to know where to split after striping