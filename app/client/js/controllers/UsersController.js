// Show all users
angular.module('PowerCiApp').controller('showUsersController', function($scope, $http, $location, $state) {
    // Call get all users service
    $http({
        method: 'GET',
        url: 'http://localhost:8080/users',
        dataType: 'jsonp',
        skipAuthorization: false
    }).success(function(response) {
        if (success(response, $state)) {
            $scope.users = response.details;
        }
    }).error(function(err) {
        console.log(err);
    });

    $('.search-form i.icon-magnifier').click(function() {
        if ($('.search-form input:text').val() != "") {
            // Call find users service
            $http({
                method: 'GET',
                url: 'http://localhost:8080/users/find?requestString=' + $('.search-form input:text').val(),
                dataType: 'jsonp',
                skipAuthorization: false
            }).success(function(response) {
                if (success(response, $state)) {
                    $scope.users = response.details;
                }
            }).error(function(err) {
                console.log(err);
            });
        } else {
            $state.go($state.current, {}, {
                reload: true
            });
        }
    });


});

// Find user
angular.module('PowerCiApp').controller('findUserController', function($scope, $http, $routeParams, $state) {

    $scope.findUser = function(requestString) {
        // Call find users service
        $http({
            method: 'GET',
            url: 'http://localhost:8080/users/find?requestString=' + requestString,
            dataType: 'jsonp',
            skipAuthorization: false
        }).success(function(response) {
            if (success(response, $state)) {
                $scope.users = response.details;
            }
        }).error(function(err) {
            console.log(err);
        });
    }
});

// Show detail user
angular.module('PowerCiApp').controller('detailUserController', function($scope, $http, $routeParams, $state) {
    $scope.message = "";


    // Call get all users service
    $http({
        method: 'GET',
        url: 'http://localhost:8080/user/' + $routeParams.id,
        dataType: 'jsonp',
        skipAuthorization: false
    }).success(function(response) {
        if (success(response, $state)) {
            $scope.user = response.details;
            $scope.message = response.data.message;
        }
    }).error(function(err) {
        console.log(err);
    });
});

// Add new user controller
angular.module('PowerCiApp').controller('addUserController', ['$http', '$scope', '$location', function($http, $scope, $location, $state) {
    $scope.user = {};

    $scope.saveUser = function(user) {
        if (null != $scope.imageTmp)
            user.avatar = $scope.imageTmp.resized.dataURL
        e(user);
        $http({
            method: 'POST',
            url: 'http://localhost:8080/user/', //webAPI exposed to upload the file
            skipAuthorization: false,
            data: $scope.user //pass file as data, should be user ng-model
        }).success(function(response) {
            if (success(response, $state)) {
                $state.go('users/');
            }
        }).error(function(err) {
            console.log(err);
        });
    }
}]);

// Edit users
angular.module('PowerCiApp').controller('editUserController', ['$http', '$scope', '$location', '$stateParams', function($http, $scope, $location, $stateParams, $state) {

    $scope.user = {};

    // Call get all users service
    $http({
        method: 'GET',
        url: 'http://localhost:8080/user/' + $stateParams.id,
        dataType: 'jsonp',
        skipAuthorization: false
    }).success(function(response) {
        if (success(response, $state)) {
            //console.log(response);
            $scope.user = response.details;
            if ($scope.user.avatar != null) {
                $scope.imageTmp = {};
                $scope.imageTmp.resized = {};
                $scope.imageTmp.resized.dataURL = $scope.user.avatar;
            }
        }
    }).error(function(err) {
        console.log(err);
    });

    // NOW UPLOAD THE FILES.
    $scope.saveUser = function(user) {

        if (null != $scope.imageTmp.resized.dataURL) {
            user.avatar = $scope.imageTmp.resized.dataURL;
        }
        e(user);
        var request = {
            method: 'PUT',
            url: 'http://localhost:8080/user/' + $stateParams.id,
            skipAuthorization: false,
            data: user
        };

        // SEND THE FILES.
        $http(request).success(function(response) {
            if (success(response, $state)) {
                $state.go('users/');
            }
        }).error(function(err) {
            console.log(err);
        });
    }
}]);

angular.module('PowerCiApp').controller('deleteUserController', function($scope, $http, $stateParams, $location, $state) {
    if (null != $stateParams.id) {
        // Call delete user
        $http({
            method: 'DELETE',
            url: 'http://localhost:8080/user/' + $stateParams.id,
            dataType: 'jsonp',
            skipAuthorization: false
        }).success(function(response) {
            if (success(response, $state)) {
                $state.go('users/');
            }
        }).error(function(err) {
            console.log(err);
        });
    }
});


// Login
function success(response, state) {
    if (response.code == -1) {
        state.go('login');
        return false;
    } else
        return true;
}


function e(e) {
    console.log(e);
}