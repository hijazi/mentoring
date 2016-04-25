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
            // console.log(data);
            angular.forEach($scope.mentors, function(mentor) {
                //console.log(textSplit.getSplitData(mentor.bio, 30));
                mentor.newBio = textSplit.getSplitData(mentor.bio, 5);
            });
            console.log('fetched');
            // return data.response;
        }),
function myError(response) {
    console.log('not fetched');
};




}]);