'use strict';



// controllers
/**
* mentoringControllers Module
*
* Module for controllers of the App.
*/
angular
.module('mentoringControllers', ['mentoringServices'])
.controller('mentorsListController', [ '$scope', '$http', 'textSplitter', function($scope, $http, textSplitter) {

    //varaibles

// console.log(textSplitter);
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
        mentor.newBio = textSplitter.getSplitData(mentor.bio, 10);
        
    });

    // angular.forEach($scope.mentors[2].newBio, function(splitted) {
    //     var plainT = splitted.replace(/(&([^;]+);|\r?\n|\r)|(<([^>]+)>)/ig,"");
    //     console.log(splitted.length);
        
    // });
    // console.log($scope.mentors[2].newBio[0].replace(/(&([^;]+);|\r?\n|\r)|(<([^>]+)>)/ig,"")+"length"+$scope.mentors[2].newBio[0].replace(/(&([^;]+);|\r?\n|\r)|(<([^>]+)>)/ig,"").length);
    console.log('fetched');
}),
function myError(response) {
    console.log('not fetched');
};




}]);

// now you're splitting beform stripping but you need to know where to split after striping