angular.module('PowerCiApp').controller('showBoardsController', function($rootScope, $scope, $http){
	console.log('controller');

	// Call get all board instances service
	$http({
            method: 'GET',
            url: 'http://localhost:8080/board_instances/',
            dataType: 'jsonp',
            skipAuthorization: false
         }).then(function(response) {
            console.log(response);
		$scope.boardInstances = response.data.details;

		// set sidebar closed and body solid layout mode
	    $rootScope.settings.layout.pageContentWhite = true;
	    $rootScope.settings.layout.pageBodySolid = false;
	    $rootScope.settings.layout.pageSidebarClosed = false;


	});
});