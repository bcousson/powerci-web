angular.module('PowerCiApp').controller('showSocsController', function($rootScope, $scope, $http, $state){

    // Call get all board instances service
    $http({
            method: 'GET',
            url: 'http://localhost:8080/socs/',
            dataType: 'jsonp',
            skipAuthorization: false
        }).then(function(response) {
            $scope.socs = response.data.details;
        });

    $('.search-form i.icon-magnifier').click(function() {
        if($('.search-form input:text').val() != "") {
                // Call find board instances service
                $http({
                        method: 'GET',
                        url: 'http://localhost:8080/soc/find?requestString=' + $('.search-form input:text').val(),
                        dataType: 'jsonp',
                        skipAuthorization: false
                     }).then(function(response) {
                    $scope.socs = response.data.details;
                });
            
        } else {
            $state.go($state.current, {}, {reload: true});
        }
    });
});

// Edit soc
angular.module('PowerCiApp').controller('editSocController', function($rootScope, $scope, $http, $stateParams, $state){

    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
    $scope.soc = {};
    $scope.imageTmp = {};


    if(null != $stateParams.id) {

        // Call get all board instances service
        $http({
                method: 'GET',
                url: 'http://localhost:8080/soc/' + $stateParams.id,
                dataType: 'jsonp',
                skipAuthorization: false
             }).then(function(response) {
            $scope.soc = response.data.details;
            //$scope.imageTmp.resized.dataURL = soc.image
        });
    } else {
        $state.go('socs');
    }

    $scope.saveSoc = function(soc) {

         if(null != $scope.imageTmp.resized)
            soc.image = $scope.imageTmp.resized.dataURL;

        var request = {
            method: 'PUT',
            url: 'http://localhost:8080/soc/'  + $stateParams.id,
            dataType: 'jsonp',
            skipAuthorization: false,
            data: soc
        }
        $http(request)
            .success(function(response) {
                $state.go("socs")
                $scope.soc = {};
                $scope.imageTmp = null;
            })
            .error(function(err){
                console.log(err);
            });
    }


});
angular.module('PowerCiApp').controller('setSocController', function($rootScope, $scope, $http){

    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;

    $scope.soc = {};

    $scope.saveSoc = function(soc) {

         if(null != $scope.imageTmp)
            soc.image = $scope.imageTmp.resized.dataURL;

        var request = {
            method: 'POST',
            url: 'http://localhost:8080/soc/',
            dataType: 'jsonp',
            skipAuthorization: false,
            data: soc
        }
        $http(request)
            .success(function(response) {
                e(response)
                $scope.soc = {};
                $scope.imageTmp = null;
            })
            .error(function(err){
                console.log(err);
            });
    }
});

angular.module('PowerCiApp').controller('deleteSocController', function($rootScope, $scope, $http, $stateParams, $state){

    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;

    $scope.soc = {};

         if(null != $scope.imageTmp)
            soc.image = $scope.imageTmp.resized.dataURL;

        var request = {
            method: 'DELETE',
            url: 'http://localhost:8080/soc/' + $stateParams.id,
            dataType: 'jsonp',
            skipAuthorization: false
        }
        $http(request)
            .success(function() {
                console.log('ok');
                $state.go('socs');
            })
            .error(function(err){
                console.log(err);
            });
});

function e(string)  {
    console.log(string);
}