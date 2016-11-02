/***
PowerCi AngularJS App Main Script
***/

/* Metronic App */
var PowerCiApp = angular.module("PowerCiApp", [
    "ui.router", 
    "ui.bootstrap", 
    "oc.lazyLoad",  
    "ngSanitize",
    "angular-jwt"
]); 
/* Configure ocLazyLoader(refer: https://github.com/ocombe/ocLazyLoad) */
PowerCiApp.config(['$ocLazyLoadProvider', function($ocLazyLoadProvider) {
    //$httpProvider.defaults.headers.common.Authorization = temp_token;
    $ocLazyLoadProvider.config({
        // global configs go here
    });
}]);

/********************************************
 BEGIN: BREAKING CHANGE in AngularJS v1.3.x:
*********************************************/
/**
`$controller` will no longer look for controllers on `window`.
The old behavior of looking on `window` for controllers was originally intended
for use in examples, demos, and toy apps. We found that allowing global controller
functions encouraged poor practices, so we resolved to disable this behavior by
default.

To migrate, register your controllers with modules rather than exposing them
as globals:

Before:

```javascript
function MyController() {
  // ...
}
```

After:

```javascript
angular.module('myApp', []).controller('MyController', [function() {
  // ...
}]);

Although it's not recommended, you can re-enable the old behavior like this:

```javascript
angular.module('myModule').config(['$controllerProvider', function($controllerProvider) {
  // this option might be handy for migrating old apps, but please don't use it
  // in new ones!
  $controllerProvider.allowGlobals();
}]);
**/

//AngularJS v1.3.x workaround for old style controller declarition in HTML
PowerCiApp.config(['$controllerProvider', function($controllerProvider) {
  // this option might be handy for migrating old apps, but please don't use it
  // in new ones!
  $controllerProvider.allowGlobals();
}]);

/********************************************
 END: BREAKING CHANGE in AngularJS v1.3.x:
*********************************************/

/* Setup global settings */
PowerCiApp.factory('settings', ['$rootScope', function($rootScope) {

    // supported languages
    var settings = {
        layout: {
            pageSidebarClosed: false, // sidebar menu state
            pageContentWhite: true, // set page content layout
            pageBodySolid: false, // solid body color state
            pageAutoScrollOnLoad: 1000 // auto scroll to top on page load
        },
        assetsPath: '../assets',
        globalPath: '../assets/global',
        layoutPath: '../assets/layouts/layout2',
    };

    $rootScope.settings = settings;

    return settings;
}]);

/* Setup App Main Controller */
PowerCiApp.controller('AppController', ['$scope', '$rootScope', function($scope, $rootScope) {

    $scope.$on('$viewContentLoaded', function() {
        App.initComponents(); // init core components
        //Layout.init(); //  Init entire layout(header, footer, sidebar, etc) on page load if the partials included in server side instead of loading with ng-include directive 
    });
}]);

/***
Layout Partials.
By default the partials are loaded through AngularJS ng-include directive. In case they loaded in server side(e.g: PHP include function) then below partial 
initialization can be disabled and Layout.init() should be called on page load complete as explained above.
***/

/* Setup Layout Part - Header */
PowerCiApp.controller('HeaderController', ['$scope', '$http', '$state', function($scope, $http, $state) {
    $http({
        method: 'GET',
        url: 'http://localhost:8080/connecteduser/',
        dataType: 'jsonp',
        skipAuthorization: false
    }).success(function(response) {
        if (response != null) {
            $scope.login = response.login;
        } else
            $state.go('login');
    }).error(function(err) {
        console.log(err);
    });

    $scope.$on('$includeContentLoaded', function() {
        Layout.initHeader(); // init header
    });
}]);

/* Setup Layout Part - Sidebar */
PowerCiApp.controller('SidebarController', ['$scope', function($scope) {
    $scope.$on('$includeContentLoaded', function() {
        Layout.initSidebar(); // init sidebar
    });
}]);

/* Setup Layout Part - Quick Sidebar */
PowerCiApp.controller('QuickSidebarController', ['$scope', function($scope) {    
    $scope.$on('$includeContentLoaded', function() {
       setTimeout(function(){
            QuickSidebar.init(); // init quick sidebar        
        }, 2000)
    });
}]);

/* Setup Layout Part - Theme Panel */
PowerCiApp.controller('ThemePanelController', ['$scope', function($scope) {    
    $scope.$on('$includeContentLoaded', function() {
        Demo.init(); // init theme panel
    });
}]);

/* Setup Layout Part - Footer */
PowerCiApp.controller('FooterController', ['$scope', function($scope) {
    $scope.$on('$includeContentLoaded', function() {
        Layout.initFooter(); // init footer
    });
}]);

/* Setup Rounting For All Pages */
PowerCiApp.config(['$stateProvider', '$urlRouterProvider', '$httpProvider', 'jwtInterceptorProvider', function($stateProvider, $urlRouterProvider, $httpProvider, jwtInterceptorProvider) {
    
    jwtInterceptorProvider.tokenGetter = function() {
        return window.localStorage.getItem("token");
    }

    $httpProvider.interceptors.push("jwtInterceptor")

    // Redirect any unmatched url
    $urlRouterProvider.otherwise("/index.html");  
    
    $stateProvider

        // Authontication
        .state('login', {
            url: "/index.html",
            views: {'content' : {
                        templateUrl:"views/index.html",
                        controller: "loginController"

                    }
                },            
            data: {pageTitle: 'Login'},
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'PowerCiApp',
                         
                        files: [
                            '../assets/global/plugins/select2/css/select2.min.css',
                            '../assets/global/plugins/select2/css/select2-bootstrap.min.css',
                            '../assets/pages/css/login-4.min.css',
        
                            '../assets/global/plugins/jquery-validation/js/jquery.validate.min.js',
                            '../assets/global/plugins/select2/js/select2.full.min.js',
                            '../assets/global/plugins/backstretch/jquery.backstretch.min.js',
                            '../assets/pages/scripts/login-4.min.js',
                            'js/controllers/loginController.js',
                        ] 
                    });
                }]
            }
        })

        .state('logout', {
            url: "/logout",
            views: {'content' : {
                        templateUrl:"views/index.html",
                        controller: "logoutController"

                    }
                },            
            data: {pageTitle: 'Login'},
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'PowerCiApp',
                         
                        files: [
                            '../assets/global/plugins/select2/css/select2.min.css',
                            '../assets/global/plugins/select2/css/select2-bootstrap.min.css',
                            '../assets/pages/css/login-4.min.css',
        
                            '../assets/global/plugins/jquery-validation/js/jquery.validate.min.js',
                            '../assets/global/plugins/select2/js/select2.full.min.js',
                            '../assets/global/plugins/backstretch/jquery.backstretch.min.js',
                            '../assets/pages/scripts/login-4.min.js',
                            'js/controllers/loginController.js',
                        ] 
                    });
                }]
            }
        })

        // Boards
        .state('boards', {
            url: "/boards",
            templateUrl: "views/boards.html",
            params: {'token' : null},            
            data: {pageTitle: 'List Of boards'},
            controller: "showBoardsController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'PowerCiApp',
                        insertBefore: '#ng_load_plugins_before', 
                        files: [
                            '../assets/global/plugins/morris/morris.css',                            
                            '../assets/global/plugins/morris/morris.min.js',
                            '../assets/global/plugins/morris/raphael-min.js',                            
                            '../assets/global/plugins/jquery.sparkline.min.js',

                            'js/controllers/BoardsController.js',
                        ] 
                    });
                }]
            }
        })

        // Boards instance
        .state('boardsInstance', {
            url: "/boardsInstance",
            templateUrl: "views/boards_instance.html",            
            data: {pageTitle: 'List Of boards instance'},
            params: {'token' : null},
            controller: "showBoardsInstanceController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'PowerCiApp',
                        insertBefore: '#ng_load_plugins_before', 
                        files: [
                            '../assets/global/plugins/morris/morris.css',                            
                            '../assets/global/plugins/morris/morris.min.js',
                            '../assets/global/plugins/morris/raphael-min.js',                            
                            '../assets/global/plugins/jquery.sparkline.min.js',

                            'js/controllers/BoardsInstanceController.js',
                        ] 
                    });
                }]
            }
        })

        .state('addNewboardInstance', {
            url: "/newBoardInstance",
            templateUrl: "views/new_board_instance.html",   
            params: {'token' : null},         
            data: {pageTitle: 'List Of boards instance'},
            controller: "addBoardInstanceController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'PowerCiApp',
                        insertBefore: '#ng_load_plugins_before', 
                        files: [
                            '../assets/global/plugins/bootstrap-select/bootstrap-select.min.css',

                            '../assets/global/plugins/bootstrap-select/bootstrap-select.min.js',
                            'js/controllers/BoardsInstanceController.js',
                            'js/image_upload.js',
                        ] 
                    });
                }]
            }
        })

        .state('boardInstance', {
            url: "/boardInstance/:id",
            templateUrl: "views/detail_board_instance.html", 
            params: {'token' : null},           
            data: {pageTitle: 'Board instance detail'},
            controller: "detailBoardInstanceController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'PowerCiApp',
                        insertBefore: '#ng_load_plugins_before', 
                        files: [
                            'js/controllers/BoardsInstanceController.js'
                        ] 
                    });
                }]
            }
        })

        // Socs
        .state('socs', {
            url: "/socs",
            templateUrl: "views/socs.html", 
            params: {'token' : null},           
            data: {pageTitle: 'List of socs'},
            controller: "showSocsController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'PowerCiApp',
                        insertBefore: '#ng_load_plugins_before', 
                        files: [
                            'js/controllers/SocsController.js'
                        ] 
                    });
                }]
            }
        })

        // SW release
        .state('sw_release', {
            url: "/sw_release",
            templateUrl: "views/sw_release.html",   
            params: {'token' : null},         
            data: {pageTitle: 'List of SW release'},
            controller: "showSWReleasesController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'PowerCiApp',
                        insertBefore: '#ng_load_plugins_before', 
                        files: [
                            'js/controllers/SWReleaseController.js'
                        ] 
                    });
                }]
            }
        })

        // Providers
        .state('providers', {
            url: "/providers",
            templateUrl: "views/providers.html",   
            params: {'token' : null},         
            data: {pageTitle: 'List Of providers'},
            controller: "showProvidersController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'PowerCiApp',
                        insertBefore: '#ng_load_plugins_before', 
                        files: [
                            'js/controllers/ProvidersController.js'
                        ] 
                    });
                }]
            }
        })
        .state('newProvider', {
            url: "/newProvider",
            templateUrl: "views/new_provider.html", 
            params: {'token' : null},           
            data: {pageTitle: 'Add new provider'},
            controller: "setProviderController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'PowerCiApp',
                        insertBefore: '#ng_load_plugins_before', 
                        files: [
                            'js/controllers/ProvidersController.js',
                            'js/image_upload.js'
                        ] 
                    });
                }]
            }
        })

        .state('deleteProvider', {
            url: "/deleteProvider/:id",
            templateUrl: "views/providers.html", 
            params: {'token' : null},           
            data: {pageTitle: 'List Of providers'},
            controller: "deleteProviderController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'PowerCiApp',
                        insertBefore: '#ng_load_plugins_before', 
                        files: [
                            'js/controllers/ProvidersController.js'
                        ] 
                    });
                }]
            },
        })

        .state('editProvider', {
            url: "/editProvider/:id",
            templateUrl: "views/new_provider.html", 
            params: {'token' : null},           
            data: {pageTitle: 'Edit provider'},
            controller: "editProviderController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'PowerCiApp',
                        insertBefore: '#ng_load_plugins_before', 
                        files: [
                            'js/controllers/ProvidersController.js'
                        ] 
                    });
                }]
            },
        })

        // Catégories
        .state('categories', {
            url: "/categories",
            templateUrl: "views/categories.html",  
            params: {'token' : null},          
            data: {pageTitle: 'List Of categories'},
            controller: "showCategoriesController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'PowerCiApp',
                        insertBefore: '#ng_load_plugins_before', 
                        files: [
                            'js/controllers/CategoriesController.js'
                        ] 
                    });
                }]
            }
        })
        .state('newCategory', {
            url: "/newCategory",
            templateUrl: "views/new_category.html",            
            data: {pageTitle: 'Add new Category'},
            params: {'token' : null},
            controller: "setCategoryController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'PowerCiApp',
                        insertBefore: '#ng_load_plugins_before', 
                        files: [
                            'js/controllers/CategoriesController.js',
                            'js/image_upload.js'
                        ] 
                    });
                }]
            }
        })

        .state('deleteCategory', {
            url: "/deleteCategory/:id",
            templateUrl: "views/categories.html", 
            params: {'token' : null},           
            data: {pageTitle: 'List Of categories'},
            controller: "deleteCategoryController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'PowerCiApp',
                        insertBefore: '#ng_load_plugins_before', 
                        files: [
                            'js/controllers/CategoriesController.js'
                        ] 
                    });
                }]
            },
        })

        .state('editCategory', {
            url: "/editCategory/:id",
            templateUrl: "views/new_category.html",  
            params: {'token' : null},          
            data: {pageTitle: 'Edit Category', pageHeader: 'Edit Category'},
            controller: "editCategoryController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'PowerCiApp',
                        insertBefore: '#ng_load_plugins_before', 
                        files: [
                            'js/controllers/CategoriesController.js'
                        ] 
                    });
                }]
            },
        })

        // End Categories

        // Users
        .state('users', {
            url: "/users",
            templateUrl: "views/users.html",    
            params: {'token' : null},        
            data: {pageTitle: 'List Of users'},
            controller: "showUsersController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'PowerCiApp',
                        insertBefore: '#ng_load_plugins_before', 
                        files: [
                            'js/controllers/UsersController.js'
                        ] 
                    });
                }]
            }
        })
        .state('newUser', {
            url: "/newUser",
            templateUrl: "views/new_user.html",            
            data: {pageTitle: 'Add new User'},
            params: {'token' : null},
            controller: "addUserController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'PowerCiApp',
                        insertBefore: '#ng_load_plugins_before', 
                        files: [
                            'js/controllers/UsersController.js',
                            'js/image_upload.js'
                        ] 
                    });
                }]
            }
        })

        .state('deleteUser', {
            url: "/deleteUser/:id",
            params: {'token' : null},
            controller: "deleteUserController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'PowerCiApp',
                        insertBefore: '#ng_load_plugins_before', 
                        files: [
                            'js/controllers/UsersController.js'
                        ] 
                    });
                }]
            },
        })

        .state('editUser', {
            url: "/editUser/:id",
            params: {'token' : null},
            templateUrl: "views/new_user.html",            
            data: {pageTitle: 'Edit User'},
            controller: "editUserController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'PowerCiApp',
                        insertBefore: '#ng_load_plugins_before', 
                        files: [
                            'js/controllers/UsersController.js',
                            'js/image_upload.js'
                        ] 
                    });
                }]
            },
        })

        // End Users

        // Groups
        .state('groups', {
            url: "/groups",
            templateUrl: "views/groups.html",
            data: {pageTitle: 'List Of groups'},
            controller: "showGroupsController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'PowerCiApp',
                        insertBefore: '#ng_load_plugins_before', 
                        files: [
                            'js/controllers/GroupsController.js'
                        ] 
                    });
                }]
            }
        })
        .state('newGroup', {
            url: "/newGroup",
            templateUrl: "views/new_group.html",  
            params: {'token' : null},         
            data: {pageTitle: 'Add new Group'},
            controller: "addGroupController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'PowerCiApp',
                        insertBefore: '#ng_load_plugins_before', 
                        files: [
                            'js/controllers/GroupsController.js'
                        ] 
                    });
                }]
            }
        })

        .state('deleteGroup', {
            url: "/deleteGroup/:id",
            params: {'token' : null},
            controller: "deleteGroupController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'PowerCiApp',
                        insertBefore: '#ng_load_plugins_before', 
                        files: [
                            'js/controllers/GroupsController.js'
                        ] 
                    });
                }]
            },
        })

        .state('editGroup', {
            url: "/editGroup/:id",
            templateUrl: "views/new_group.html",  
            params: {'token' : null},          
            data: {pageTitle: 'Edit Group'},
            controller: "editGroupController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'PowerCiApp',
                        insertBefore: '#ng_load_plugins_before', 
                        files: [
                            'js/controllers/GroupsController.js'
                        ] 
                    });
                }]
            },
        })

        .state('detailGroup', {
            url: "/detailGroup/:id",
            templateUrl: "views/detail_group.html", 
            params: {'token' : null},           
            data: {pageTitle: 'Detail Group'},
            controller: "detailGroupController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'PowerCiApp',
                        insertBefore: '#ng_load_plugins_before', 
                        files: [
                            '../assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                            '../assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                            'js/controllers/GroupsController.js',
                            '../assets/global/plugins/bootbox/bootbox.min.js',
                            '../assets/pages/scripts/ui-bootbox.js'
                        ] 
                    });
                }]
            },
        })

        // End Groups


        // // AngularJS plugins
        // .state('fileupload', {
        //     url: "/file_upload.html",
        //     templateUrl: "views/file_upload.html",
        //     params: {'token' : null},
        //     data: {pageTitle: 'AngularJS File Upload'},
        //     controller: "GeneralPageController",
        //     resolve: {
        //         deps: ['$ocLazyLoad', function($ocLazyLoad) {
        //             return $ocLazyLoad.load([{
        //                 name: 'angularFileUpload',
        //                 files: [
        //                     '../assets/global/plugins/angularjs/plugins/angular-file-upload/angular-file-upload.min.js',
        //                 ] 
        //             }, {
        //                 name: 'PowerCiApp',
        //                 files: [
        //                     'js/controllers/GeneralPageController.js'
        //                 ]
        //             }]);
        //         }]
        //     }
        // })

        // // UI Bootstrap
        // .state('uibootstrap', {
        //     url: "/board-detail/mangoh",
        //     templateUrl: "views/mangoh.html",
        //     params: {'token' : null},
        //     data: {pageTitle: 'Board instance detail'},
        //     controller: "GeneralPageController",
        //     resolve: {
        //         deps: ['$ocLazyLoad', function($ocLazyLoad) {
        //             return $ocLazyLoad.load([{
        //                 name: 'PowerCiApp',
        //                 files: [
        //                     'js/controllers/GeneralPageController.js'
        //                 ] 
        //             }]);
        //         }] 
        //     }
        // })

        // // Tree View
        // .state('tree', {
        //     url: "/tree",
        //     templateUrl: "views/tree.html",
        //     data: {pageTitle: 'jQuery Tree View'},
        //     params: {'token' : null},
        //     controller: "GeneralPageController",
        //     resolve: {
        //         deps: ['$ocLazyLoad', function($ocLazyLoad) {
        //             return $ocLazyLoad.load([{
        //                 name: 'PowerCiApp',
        //                 insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
        //                 files: [
        //                     '../assets/global/plugins/jstree/dist/themes/default/style.min.css',

        //                     '../assets/global/plugins/jstree/dist/jstree.min.js',
        //                     '../assets/pages/scripts/ui-tree.min.js',
        //                     'js/controllers/GeneralPageController.js'
        //                 ] 
        //             }]);
        //         }] 
        //     }
        // })     

        // // Form Tools
        // .state('formtools', {
        //     url: "/form-tools",
        //     templateUrl: "views/form_tools.html",
        //     data: {pageTitle: 'Form Tools'},
        //     controller: "GeneralPageController",
        //     resolve: {
        //         deps: ['$ocLazyLoad', function($ocLazyLoad) {
        //             return $ocLazyLoad.load([{
        //                 name: 'PowerCiApp',
        //                 insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
        //                 files: [
        //                     '../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                            
        //                     '../assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
        //                     '../assets/global/plugins/typeahead/typeahead.css',

        //                     '../assets/global/plugins/fuelux/js/spinner.min.js',
        //                     '../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',
        //                     '../assets/global/plugins/jquery-inputmask/jquery.inputmask.bundle.min.js',
        //                     '../assets/global/plugins/jquery.input-ip-address-control-1.0.min.js',
        //                     '../assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
        //                     '../assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
        //                     '../assets/global/plugins/bootstrap-maxlength/bootstrap-maxlength.min.js',
        //                     '../assets/global/plugins/bootstrap-touchspin/bootstrap.touchspin.js',
        //                     '../assets/global/plugins/typeahead/handlebars.min.js',
        //                     '../assets/global/plugins/typeahead/typeahead.bundle.min.js',
        //                     '../assets/pages/scripts/components-form-tools-2.min.js',

        //                     'js/controllers/GeneralPageController.js'
        //                 ] 
        //             }]);
        //         }] 
        //     }
        // })        

        // // Date & Time Pickers
        // .state('pickers', {
        //     url: "/pickers",
        //     templateUrl: "views/pickers.html",
        //     data: {pageTitle: 'Date & Time Pickers'},
        //     controller: "GeneralPageController",
        //     resolve: {
        //         deps: ['$ocLazyLoad', function($ocLazyLoad) {
        //             return $ocLazyLoad.load([{
        //                 name: 'PowerCiApp',
        //                 insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
        //                 files: [
        //                     '../assets/global/plugins/clockface/css/clockface.css',
        //                     '../assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
        //                     '../assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
        //                     '../assets/global/plugins/bootstrap-colorpicker/css/colorpicker.css',
        //                     '../assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',

        //                     '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
        //                     '../assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
        //                     '../assets/global/plugins/clockface/js/clockface.js',
        //                     '../assets/global/plugins/bootstrap-colorpicker/js/bootstrap-colorpicker.js',
        //                     '../assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',

        //                     '../assets/pages/scripts/components-date-time-pickers.min.js',

        //                     'js/controllers/GeneralPageController.js'
        //                 ] 
        //             }]);
        //         }] 
        //     }
        // })

        // // Custom Dropdowns
        // .state('dropdowns', {
        //     url: "/dropdowns",
        //     templateUrl: "views/dropdowns.html",
        //     data: {pageTitle: 'Custom Dropdowns'},
        //     controller: "GeneralPageController",
        //     resolve: {
        //         deps: ['$ocLazyLoad', function($ocLazyLoad) {
        //             return $ocLazyLoad.load([{
        //                 name: 'PowerCiApp',
        //                 insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
        //                 files: [
        //                     '../assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
        //                     '../assets/global/plugins/select2/css/select2.min.css',
        //                     '../assets/global/plugins/select2/css/select2-bootstrap.min.css',

        //                     '../assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
        //                     '../assets/global/plugins/select2/js/select2.full.min.js',

        //                     '../assets/pages/scripts/components-bootstrap-select.min.js',
        //                     '../assets/pages/scripts/components-select2.min.js',

        //                     'js/controllers/GeneralPageController.js'
        //                 ] 
        //             }]);
        //         }] 
        //     }
        // }) 

        // // Advanced Datatables
        // .state('datatablesAdvanced', {
        //     url: "/datatables/managed.html",
        //     templateUrl: "views/datatables/managed.html",
        //     data: {pageTitle: 'Advanced Datatables'},
        //     controller: "GeneralPageController",
        //     resolve: {
        //         deps: ['$ocLazyLoad', function($ocLazyLoad) {
        //             return $ocLazyLoad.load({
        //                 name: 'PowerCiApp',
        //                 insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
        //                 files: [                             
        //                     '../assets/global/plugins/datatables/datatables.min.css', 
        //                     '../assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',

        //                     '../assets/global/plugins/datatables/datatables.all.min.js',

        //                     '../assets/pages/scripts/table-datatables-managed.min.js',

        //                     'js/controllers/GeneralPageController.js'
        //                 ]
        //             });
        //         }]
        //     }
        // })

        // // Ajax Datetables
        // .state('datatablesAjax', {
        //     url: "/datatables/ajax.html",
        //     templateUrl: "views/datatables/ajax.html",
        //     data: {pageTitle: 'Ajax Datatables'},
        //     controller: "GeneralPageController",
        //     resolve: {
        //         deps: ['$ocLazyLoad', function($ocLazyLoad) {
        //             return $ocLazyLoad.load({
        //                 name: 'PowerCiApp',
        //                 insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
        //                 files: [
        //                     '../assets/global/plugins/datatables/datatables.min.css', 
        //                     '../assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',
        //                     '../assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',

        //                     '../assets/global/plugins/datatables/datatables.all.min.js',
        //                     '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
        //                     '../assets/global/scripts/datatable.min.js',

        //                     'js/scripts/table-ajax.js',
        //                     'js/controllers/GeneralPageController.js'
        //                 ]
        //             });
        //         }]
        //     }
        // })

        // // User Profile
        // .state("profile", {
        //     url: "/profile",
        //     templateUrl: "views/profile/main.html",
        //     data: {pageTitle: 'User Profile'},
        //     controller: "UserProfileController",
        //     resolve: {
        //         deps: ['$ocLazyLoad', function($ocLazyLoad) {
        //             return $ocLazyLoad.load({
        //                 name: 'PowerCiApp',  
        //                 insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
        //                 files: [
        //                     '../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
        //                     '../assets/pages/css/profile.css',
                            
        //                     '../assets/global/plugins/jquery.sparkline.min.js',
        //                     '../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',

        //                     '../assets/pages/scripts/profile.min.js',

        //                     'js/controllers/UserProfileController.js'
        //                 ]                    
        //             });
        //         }]
        //     }
        // })

        // // User Profile Dashboard
        // .state("profile.dashboard", {
        //     url: "/dashboard",
        //     templateUrl: "views/profile/dashboard.html",
        //     data: {pageTitle: 'User Profile'}
        // })

        // // User Profile Account
        // .state("profile.account", {
        //     url: "/account",
        //     templateUrl: "views/profile/account.html",
        //     data: {pageTitle: 'User Account'}
        // })

        // // User Profile Help
        // .state("profile.help", {
        //     url: "/help",
        //     templateUrl: "views/profile/help.html",
        //     data: {pageTitle: 'User Help'}      
        // })

        // // Todo
        // .state('todo', {
        //     url: "/todo",
        //     templateUrl: "views/todo.html",
        //     data: {pageTitle: 'Todo'},
        //     controller: "TodoController",
        //     resolve: {
        //         deps: ['$ocLazyLoad', function($ocLazyLoad) {
        //             return $ocLazyLoad.load({ 
        //                 name: 'PowerCiApp',  
        //                 insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
        //                 files: [
        //                     '../assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
        //                     '../assets/apps/css/todo-2.css',
        //                     '../assets/global/plugins/select2/css/select2.min.css',
        //                     '../assets/global/plugins/select2/css/select2-bootstrap.min.css',

        //                     '../assets/global/plugins/select2/js/select2.full.min.js',
                            
        //                     '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',

        //                     '../assets/apps/scripts/todo-2.min.js',

        //                     'js/controllers/TodoController.js'  
        //                 ]                    
        //             });
        //         }]
        //     }
        // })

}]);

angular.module('PowerCiApp').filter('shortNumber', function() {
    return function(number) {
        if (number) {
            abs = Math.abs(number);
            if (abs >= Math.pow(10, 12)) {
                // trillion
                number = (number / Math.pow(10, 12)).toFixed(1) + "T";
            } else if (abs < Math.pow(10, 12) && abs >= Math.pow(10, 9)) {
                // billion
                number = (number / Math.pow(10, 9)).toFixed(1) + "B";
            } else if (abs < Math.pow(10, 9) && abs >= Math.pow(10, 6)) {
                // million
                number = (number / Math.pow(10, 6)).toFixed(1) + "M";
            } else if (abs < Math.pow(10, 6) && abs >= Math.pow(10, 3)) {
                // thousand
                number = (number / Math.pow(10, 3)).toFixed(1) + "K";
            }
            return number;
        }
    };
});

/* Init global settings and run the app */
PowerCiApp.run(["$rootScope", "settings", "$state", function($rootScope, settings, $state) {
    $rootScope.$state = $state; // state to be accessed from view
    $rootScope.$settings = settings; // state to be accessed from view
}]);