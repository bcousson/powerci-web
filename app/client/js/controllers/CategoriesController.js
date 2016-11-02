angular.module('PowerCiApp').controller('showCategoriesController', function($rootScope, $scope, $http){

    // Call get all categories service
    $http({
            method: 'GET',
            url: 'http://localhost:8080/categories/',
            dataType: 'jsonp',
            skipAuthorization: false
        }).then(function(response) {
            $scope.categories = response.data.details;
        });

        // Find categories
        $('.search-form i.icon-magnifier').click(function() {
        if($('.search-form input:text').val() != "") {
                // Call find board instances service
                $http({
                        method: 'GET',
                        url: 'http://localhost:8080/category/find?requestString=' + $('.search-form input:text').val(),
                        dataType: 'jsonp',
                        skipAuthorization: false
                     }).then(function(response) {
                    $scope.categories = response.data.details;
                });
            
        } else {
            $state.go($state.current, {}, {reload: true});
        }
    });
});

// Edit category
angular.module('PowerCiApp').controller('editCategoryController', function($rootScope, $scope, $http, $stateParams, $state){

    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
    $scope.category = {};
    $scope.imageTmp = {};


    if(null != $stateParams.id) {

        // Call get all board instances service
        $http({
                method: 'GET',
                url: 'http://localhost:8080/category/' + $stateParams.id,
                dataType: 'jsonp',
                skipAuthorization: false
             }).then(function(response) {
            $scope.category = response.data.details;
            //$scope.imageTmp.resized.dataURL = category.image
        });
    } else {
        $state.go('categories');
    }

    $scope.saveCategory = function(category) {

         if(null != $scope.imageTmp.resized)
            category.image = $scope.imageTmp.resized.dataURL;

        var request = {
            method: 'PUT',
            url: 'http://localhost:8080/category/'  + $stateParams.id,
            dataType: 'jsonp',
            skipAuthorization: false,
            data: category
        }
        $http(request)
            .success(function(response) {
                $state.go("categories")
                $scope.category = {};
                $scope.imageTmp = null;
            })
            .error(function(err){
                console.log(err);
            });
    }


});
angular.module('PowerCiApp').controller('setCategoryController', function($rootScope, $scope, $http, $state){

    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;

    $scope.category = {};

    $scope.saveCategory = function(category) {

         if(null != $scope.imageTmp)
            category.image = $scope.imageTmp.resized.dataURL;

        var request = {
            method: 'POST',
            url: 'http://localhost:8080/category/',
            dataType: 'jsonp',
            skipAuthorization: false,
            data: category
        }
        $http(request)
            .success(function(response) {
                $state.go("categories")
            })
            .error(function(err){
                console.log(err);
            });
    }
});

angular.module('PowerCiApp').controller('deleteCategoryController', function($rootScope, $scope, $http, $stateParams, $state){

    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;

    $scope.category = {};

         if(null != $scope.imageTmp)
            category.image = $scope.imageTmp.resized.dataURL;

        var request = {
            method: 'DELETE',
            url: 'http://localhost:8080/category/' + $stateParams.id,
            dataType: 'jsonp',
            skipAuthorization: false
        }
        $http(request)
            .success(function() {
                $state.go('categories');
            })
            .error(function(err){
                console.log(err);
            });
});

function e(string)  {
    console.log(string);
}