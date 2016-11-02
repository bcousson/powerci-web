// Show all users
app.controller('showUsersController', function($scope, $http){

		// Call get all users service
		$http({
	            method: 'GET',
	            url: 'http://localhost:8080/users',
	            dataType: 'jsonp',
	            skipAuthorization: false
	         }).then(function(response) {
	         	console.log(response);
			$scope.users = response.data.details;


		});
});

// Find user
 app.controller('findUserController', function($scope, $http, $routeParams){

    $scope.findUser = function (requestString) {
    	// Call find users service
		$http({
	            method: 'GET',
	            url: 'http://localhost:8080/users/find?requestString=' + requestString,
	            dataType: 'jsonp',
	            skipAuthorization: false
	         }).then(function(response) {
	         	console.log(response);
			$scope.users = response.data.details;
		});
    }
});

// Show detail user
app.controller('detailUserController', function($scope, $http, $routeParams){
		$scope.message = "";
        
            
		// Call get all users service
		$http({
	            method: 'GET',
	            url: 'http://localhost:8080/user/' + $routeParams.id,
	            dataType: 'jsonp',
	            skipAuthorization: false
	         }).then(function(response) {
	         	console.log(response);
    			$scope.user = response.data.details;
    			$scope.message = response.data.message;
		});
});

// Add new user controller
app.controller('addUserController',['$http', '$scope', '$location', function($http, $scope, $location){
    $scope.user = {};

    $scope.saveUser = function(user){ 
        if(null != $scope.image)
            user.avatar = $scope.image.resized.dataURL
        echo
        $http({
            method: 'POST',
            url: 'http://localhost:8080/user/', //webAPI exposed to upload the file
            skipAuthorization: false,
            data: $scope.user//pass file as data, should be user ng-model
        }).success(function (response) {
            // $location.path('/detailUser/' + response.details._id);
             $location.path('/users');
        })
        .error(function (e) {
            console.log(e);
        });
    }
}]);

// Edit users
app.controller('editUserController', ['$http', '$scope', '$location', '$routeParams', function($http, $scope, $location, $routeParams){

	$scope.user = {};
    
	// Call get all users service
	$http({
            method: 'GET',
            url: 'http://localhost:8080/user/' + $routeParams.id,
            dataType: 'jsonp',
            skipAuthorization: false
        }).success(function(response) {
         	//console.log(response);
			$scope.user = response.details;
            if($scope.user.avatar != null) {
                $scope.img = {};
                $scope.img.resized = {};
                $scope.img.resized.dataURL = $scope.user.avatar;
            }
            echo($scope.user);
		}).error(function (e) {
            	console.log(e);
        });

    // NOW UPLOAD THE FILES.
    $scope.saveUser = function (user) {

        if(null != $scope.img.resized.dataURL) {
            user.avatar = $scope.img.resized.dataURL;
        }
        echo(user);
        var request = {
            method: 'PUT',
            url: 'http://localhost:8080/user/' + $routeParams.id,
            skipAuthorization: false,
		    data: user
        };

        // SEND THE FILES.
        $http(request)
            .success(function (d) {
                console.log(d);
                console.log("location : ");
                $location.path('/detailUser/' + $routeParams.id);
            })
            .error(function (e) {
            	console.log(e);
            });
        }
}]);

app.controller('deleteUserController', function($scope, $http, $routeParams){
	$scope.message = "";

	// Call delete user
	$http({
            method: 'DELETE',
            url: 'http://localhost:8080/user/' + $routeParams.id,
            dataType: 'jsonp',
            skipAuthorization: false
         }).then(function(response) {
         	$scope.message =  response.data.message;
         	console.log(response);
		});

    // Call get all users
	$http({
            method: 'GET',
            url: 'http://localhost:8080/users',
            dataType: 'jsonp',
            skipAuthorization: false
         }).then(function(response) {
			$scope.users = response.data.details;
		});
});
function e(e){
    console.log(e);
}







