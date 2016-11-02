angular.module('PowerCiApp').controller('showBoardsController', function($rootScope, $scope, $http, $state){

    // Call get all boards service
    $http({
            method: 'GET',
            url: 'http://localhost:8080/boards/',
            dataType: 'jsonp',
            skipAuthorization: false
         }).success(function(response) {
            if (success(response, $state)) {
                $scope.boardInstances = response.data.details;
            }
        }).error(function(err) {
            console.log(err);
        });
});

// Login
function success(response, state) {
    if (response.code == -1) {
        state.go('login');
        return false;
    } else
        return true;
}

