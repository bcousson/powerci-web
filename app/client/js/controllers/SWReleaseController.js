angular.module('PowerCiApp').controller('showSWReleasesController', function($rootScope, $scope, $http, $state){

    // Call get all board instances service
    $http({
            method: 'GET',
            url: 'http://localhost:8080/sWReleases/',
            dataType: 'jsonp',
            skipAuthorization: false
        }).then(function(response) {
            $scope.sWReleases = response.data.details;
        });

    $('.search-form i.icon-magnifier').click(function() {
        if($('.search-form input:text').val() != "") {
                // Call find board instances service
                $http({
                        method: 'GET',
                        url: 'http://localhost:8080/sWRelease/find?requestString=' + $('.search-form input:text').val(),
                        dataType: 'jsonp',
                        skipAuthorization: false
                     }).then(function(response) {
                    $scope.sWReleases = response.data.details;
                });
            
        } else {
            $state.go($state.current, {}, {reload: true});
        }
    });
});

// Edit sWRelease
angular.module('PowerCiApp').controller('editSWReleaseController', function($rootScope, $scope, $http, $stateParams, $state){

    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
    $scope.sWRelease = {};
    $scope.imageTmp = {};


    if(null != $stateParams.id) {

        // Call get all board instances service
        $http({
                method: 'GET',
                url: 'http://localhost:8080/sWRelease/' + $stateParams.id,
                dataType: 'jsonp',
                skipAuthorization: false
             }).then(function(response) {
            $scope.sWRelease = response.data.details;
            //$scope.imageTmp.resized.dataURL = sWRelease.image
        });
    } else {
        $state.go('sWReleases');
    }

    $scope.saveSWRelease = function(sWRelease) {

         if(null != $scope.imageTmp.resized)
            sWRelease.image = $scope.imageTmp.resized.dataURL;

        var request = {
            method: 'PUT',
            url: 'http://localhost:8080/sWRelease/'  + $stateParams.id,
            dataType: 'jsonp',
            skipAuthorization: false,
            data: sWRelease
        }
        $http(request)
            .success(function(response) {
                $state.go("sWReleases")
                $scope.sWRelease = {};
                $scope.imageTmp = null;
            })
            .error(function(err){
                console.log(err);
            });
    }


});
angular.module('PowerCiApp').controller('setSWReleaseController', function($rootScope, $scope, $http){

    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;

    $scope.sWRelease = {};

    $scope.saveSWRelease = function(sWRelease) {

         if(null != $scope.imageTmp)
            sWRelease.image = $scope.imageTmp.resized.dataURL;

        var request = {
            method: 'POST',
            url: 'http://localhost:8080/sWRelease/',
            dataType: 'jsonp',
            skipAuthorization: false,
            data: sWRelease
        }
        $http(request)
            .success(function(response) {
                e(response)
                $scope.sWRelease = {};
                $scope.imageTmp = null;
            })
            .error(function(err){
                console.log(err);
            });
    }
});

angular.module('PowerCiApp').controller('deleteSWReleaseController', function($rootScope, $scope, $http, $stateParams, $state){

    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;

    $scope.sWRelease = {};

         if(null != $scope.imageTmp)
            sWRelease.image = $scope.imageTmp.resized.dataURL;

        var request = {
            method: 'DELETE',
            url: 'http://localhost:8080/sWRelease/' + $stateParams.id,
            dataType: 'jsonp',
            skipAuthorization: false
        }
        $http(request)
            .success(function() {
                console.log('ok');
                $state.go('sWReleases');
            })
            .error(function(err){
                console.log(err);
            });
});

function e(string)  {
    console.log(string);
}