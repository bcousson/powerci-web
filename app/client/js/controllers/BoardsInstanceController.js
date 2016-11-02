// Show all boards instance controller
angular.module('PowerCiApp').controller('showBoardsInstanceController', function($rootScope, $scope, $http, $state, $stateParams) {

    console.log($stateParams);

    // Call get all board instances service
    $http({
        method: 'GET',
        url: 'http://localhost:8080/board_instances/',
        dataType: 'jsonp',
        headers: {
            'Authorization': $stateParams.token
        }
    }).success(function(response) {
        if (success(response, $state)) {
            $scope.boardInstances = response.details;
            $('.search-form i.icon-magnifier').click(function() {
                if ($('.search-form input:text').val() != "") {
                    // Call find board instances service
                    $http({
                        method: 'GET',
                        url: 'http://localhost:8080/board_instances/find?requestString=' + $('.search-form input:text').val(),
                        dataType: 'jsonp',
                        skipAuthorization: false
                    }).success(function(response) {
                        if (success(response, $state)) {
                            $scope.boardInstances = response.details;
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
        }
    }).error(function(err) {
        console.log(err);
    });
});
// Detail boards instance
angular.module('PowerCiApp').controller('detailBoardInstanceController', function($rootScope, $scope, $http, $state) {

    // Call get all board instances service
    $http({
        method: 'GET',
        url: 'http://localhost:8080/board_instances/',
        dataType: 'jsonp',
        skipAuthorization: false
    }).success(function(response) {
        if (success(response, $state)) {
            $scope.boardInstances = response.details;


            $('.search-form i.icon-magnifier').click(function() {
                if ($('.search-form input:text').val() != "") {
                    // Call find board instances service
                    $http({
                        method: 'GET',
                        url: 'http://localhost:8080/board_instances/find?requestString=' + $('.search-form input:text').val(),
                        dataType: 'jsonp',
                        skipAuthorization: false
                    }).success(function(response) {
                        if (success(response, $state)) {
                            $scope.boardInstances = response.details;
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
        }
    }).error(function(err) {
        console.log(err);
    });

});

// Add new board instance controller
angular.module('PowerCiApp').controller('addBoardInstanceController', function($rootScope, $scope, $http, $state) {

    $scope.boardInstance = {};
    $scope.providers = {};
    $scope.categories = {};

    // Get list of providers
    $http({
        method: 'GET',
        url: 'http://localhost:8080/providers/',
        dataType: 'jsonp',
        skipAuthorization: false
    }).success(function(response) {
        if (success(response, $state)) {
            $scope.providers = response.details;
        }
    }).error(function(err) {
        console.log(err);
    });

    // Get list of categories
    $http({
        method: 'GET',
        url: 'http://localhost:8080/categories/',
        dataType: 'jsonp',
        skipAuthorization: false
    }).success(function(response) {
        if (success(response, $state)) {
            $scope.categories = response.details;
        }
    }).error(function(err) {
        console.log(err);
    });

    $scope.saveBoardInstance = function(boardInstance) {

        if (null != $scope.imageTmp)
            boardInstance.image = $scope.imageTmp.resized.dataURL
        console.log(boardInstance);
        var request = {
            method: 'POST',
            url: 'http://localhost:8080/board_instance/',
            skipAuthorization: false,
            data: boardInstance
        };

        // SEND THE FILES.
        $http(request).success(function(response) {
            if (success(response, $state)) {
                $state.go('boardsInstance');
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

function echo(string) {
    console.log(string);
}