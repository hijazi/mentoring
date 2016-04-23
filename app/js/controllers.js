'use strict';



// controllers
/**
* mentoringControllers Module
*
* Module for controllers of the App.
*/
var mentoringControllers = angular.module('mentoringApp.mentoringControllers', ['truncate']);

mentoringControllers.factory('textSplit', ['charactersFilter', function(charactersFilter) {
    return {
        getSplitData: function(enteredText, size) {
            var text = enteredText || 'No text abailable!';
            var doneText = '';
            var truncatedLength = 0;
            var i = 1;
            var textArray = [];
            if (! (NaN === size)){
                while (text.length > 0){
                    doneText = charactersFilter(text, size);
                    truncatedLength = doneText.length;
                    text = text.slice(truncatedLength);
                    textArray.push(doneText)
                }

                
            }
            
            return textArray;
        }

        
    }
}])


mentoringControllers.controller('mentorsListController', [ '$scope', '$http', 'textSplit', function($scope, $http, textSplit) {

    //varaibles

// console.log(textSplit);
$http.get('data/mentorsInfo.json').success(function(data) {
    $scope.mentors = data;
            // console.log(data);
            angular.forEach($scope.mentors, function(mentor) {
                // console.log(textSplit.getSplitData(mentor.bio, 30));
                mentor.newBio = textSplit.getSplitData(mentor.bio, 30);
            });
            console.log('fetched');
            // return data.response;
        }),
function myError(response) {
    console.log('not fetched');
};




}]);