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
    ,   doneText;

    angular.forEach($scope.mentors, function(mentor) {
        mentor.newBio = textSplit.getSplitData(mentor.bio, 500);
        text = mentor.newBio[0];
        text = textSplit.helperStripHtml(text);console.log(text);

        console.log("\\r i:"+text.indexOf("\\r")+"&nbsp; i:"+text.indexOf("&nbsp;"));


    });
    console.log('fetched');
}),
function myError(response) {
    console.log('not fetched');
};




}]);

// now you're splitting beform stripping but you need to know where to split after striping