angular.module('PowerCiApp').controller('showProvidersController', function($rootScope, $scope, $http, $state){

    // Call get all board instances service
    $http({
            method: 'GET',
            url: 'http://localhost:8080/providers/',
            dataType: 'jsonp',
            skipAuthorization: false
        }).then(function(response) {
            $scope.providers = response.data.details;
        });

    $('.search-form i.icon-magnifier').click(function() {
        if($('.search-form input:text').val() != "") {
                // Call find board instances service
                $http({
                        method: 'GET',
                        url: 'http://localhost:8080/provider/find?requestString=' + $('.search-form input:text').val(),
                        dataType: 'jsonp',
                        skipAuthorization: false
                     }).then(function(response) {
                    $scope.providers = response.data.details;
                });
            
        } else {
            $state.go($state.current, {}, {reload: true});
        }
    });
});

// Edit provider
angular.module('PowerCiApp').controller('editProviderController', function($rootScope, $scope, $http, $stateParams, $state){

    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
    $scope.provider = {};
    $scope.imageTmp = {};


    if(null != $stateParams.id) {

        // Call get all board instances service
        $http({
                method: 'GET',
                url: 'http://localhost:8080/provider/' + $stateParams.id,
                dataType: 'jsonp',
                skipAuthorization: false
             }).then(function(response) {
            $scope.provider = response.data.details;
            //$scope.imageTmp.resized.dataURL = provider.image
        });
    } else {
        $state.go('providers');
    }

    $scope.saveProvider = function(provider) {

         if(null != $scope.imageTmp.resized)
            provider.image = $scope.imageTmp.resized.dataURL;

        var request = {
            method: 'PUT',
            url: 'http://localhost:8080/provider/'  + $stateParams.id,
            dataType: 'jsonp',
            skipAuthorization: false,
            data: provider
        }
        $http(request)
            .success(function(response) {
                $state.go("providers")
                $scope.provider = {};
                $scope.imageTmp = null;
            })
            .error(function(err){
                console.log(err);
            });
    }


});
angular.module('PowerCiApp').controller('setProviderController', function($rootScope, $scope, $http){

    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;

    $scope.provider = {};

    $scope.saveProvider = function(provider) {

         if(null != $scope.imageTmp)
            provider.image = $scope.imageTmp.resized.dataURL;

        var request = {
            method: 'POST',
            url: 'http://localhost:8080/provider/',
            dataType: 'jsonp',
            skipAuthorization: false,
            data: provider
        }
        $http(request)
            .success(function(response) {
                e(response)
                $scope.provider = {};
                $scope.imageTmp = null;
            })
            .error(function(err){
                console.log(err);
            });
    }
});

angular.module('PowerCiApp').controller('deleteProviderController', function($rootScope, $scope, $http, $stateParams, $state){

    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;

    $scope.provider = {};

         if(null != $scope.imageTmp)
            provider.image = $scope.imageTmp.resized.dataURL;

        var request = {
            method: 'DELETE',
            url: 'http://localhost:8080/provider/' + $stateParams.id,
            dataType: 'jsonp',
            skipAuthorization: false
        }
        $http(request)
            .success(function() {
                console.log('ok');
                $state.go('providers');
            })
            .error(function(err){
                console.log(err);
            });
});

function e(string)  {
    console.log(string);
}