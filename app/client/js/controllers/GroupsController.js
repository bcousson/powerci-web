// Show all groups
angular.module('PowerCiApp').controller('showGroupsController', function($scope, $http, $state) {
    // Call get all groups service
    $http({
        method: 'GET',
        url: 'http://localhost:8080/groups/',
        dataType: 'jsonp',
        skipAuthorization: false
    }).success(function(response) {
        echo(response);
        if (success(response, $state)) {
            $scope.groups = response.details;
            $scope.login = response.login;
        }
    }).error(function(err) {
        console.log(err);
    });

    // Find groups
    $('.search-form i.icon-magnifier').click(function() {
        if ($('.search-form input:text').val() != "") {
            // Call find board instances service
            $http({
                method: 'GET',
                url: 'http://localhost:8080/group/find?requestString=' + $('.search-form input:text').val(),
                dataType: 'jsonp',
                skipAuthorization: false
            }).success(function(response) {
                if (success(response, $state)) {
                    $scope.groups = response.details;
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

// Detail group controller
angular.module('PowerCiApp').controller('detailGroupController', function($scope, $http, $stateParams, $state) {
    // Call get group service
    $http({
        method: 'GET',
        url: 'http://localhost:8080/group/' + $stateParams.id + '?full=true',
        dataType: 'jsonp',
        skipAuthorization: false
    }).success(function(response) {
        echo(response)
        if (success(response, $state)) {
            $scope.group = response.details;
        }
    }).error(function(err) {
        console.log(err);
    });

    // Jquery Script
    $('.groupAddUser .submit').click(function() {
        if ($('.groupAddUser input:text').val() != "") {
            $scope.users = [];
            $scope.list_roles = [];
            $http({
                method: 'GET',
                url: 'http://localhost:8080/groups/find_users_roles?group_id=' + $scope.group._id + "&requestString=" + $('.groupAddUser input:text').val() + "&in=false",
                dataType: 'jsonp',
                skipAuthorization: false
            }).success(function(response) {
                if (success(response, $state)) {
                    angular.copy(response.details, $scope.users);
                    if ($scope.users.length > 0) {
                        $('.listUser').show();
                        angular.copy($scope.group.list_roles, $scope.list_roles);
                        $scope.defaultRole = {}
                        $scope.defaultRole._id = "";
                        $scope.defaultRole.title = "--please select--";
                        $scope.list_roles.unshift($scope.defaultRole)
                    }
                }
            }).error(function(err) {
                console.log(err);
            });
        } else {
            $('.listUser').hide();
        }
    });

    $scope.add = function(user) {
        if ($('select#' + user._id).val() == "") {
            $('select#' + user._id).css("background-color", "red");
        } else {
            $scope.group.users_role.push({
                user: user._id,
                role: $('select#' + user._id).val()
            });
            console.log($scope.group);
            $http({
                method: 'PUT',
                url: 'http://localhost:8080/group/' + $scope.group._id,
                dataType: 'jsonp',
                skipAuthorization: false,
                data: $scope.group
            }).success(function(response) {
                if (success(response, $state)) {
                    $state.go($state.current, {}, {
                        reload: true
                    });
                }
            }).error(function(err) {
                console.log(err);
            });

        }
    };
    $scope.editUsers = function(userId) {
        var roles = [];
        $scope.group.users_role.map(function(ur) {
            if (ur.user._id != userId) roles.push(ur);
        })
        roles.push({
            user: userId,
            role: $('select#' + userId).val()
        });
        $scope.group.users_role = roles;


        $http({
            method: 'PUT',
            url: 'http://localhost:8080/group/' + $scope.group._id,
            skipAuthorization: false,
            data: $scope.group
        }).success(function(response) {
            if (success(response, $state)) {
                $state.go($state.current, {}, {
                    reload: true
                });
            }
        }).error(function(err) {
            console.log(err);
        });

    };
    $scope.remove = function(userId) {

        alert(userId);

        $http({
            method: 'DELETE',
            url: 'http://localhost:8080/group/user_role',
            skipAuthorization: false,
            data: {
                'group_id': $scope.group._id,
                'user_id': userId
            }
        }).success(function(response) {
            if (success(response, $state)) {
                $state.go($state.current, {}, {
                    reload: true
                });
            }
        }).error(function(err) {
            console.log(err);
        });
    };
    $scope.edit = function(userRole) {
        console.log($scope.group.list_roles);
        console.log(userRole.role._id);
        $scope.editUser = userRole.user;
        $scope.group.list_roles.map(function(role) {
            if (role._id == userRole.role._id)
                $scope.defaultRole = role;
        });
        $(".groupEditUser").show();
        $(".bootbox").show();
    };

    $scope.changed = function(userId) {
        if ($('select#' + userId).val() != "")
            $('select#' + userId).css("background-color", "rgb(221, 221, 221)");
    }
    $scope.contact = function(username) {
        $scope.contactUsername = username;
        $(".groupContactUser").show();
        $(".bootbox").show();
    }

    // Add User
    $('#addUser').click(function() {
        $(".groupAddUser").show();
        $(".bootbox").show();
    });
    $('.pop-close').on('click', function() {
        $(".popUp").hide();
        $('.listUser').hide();
    });
});

// Add Group controller
angular.module('PowerCiApp').controller('addGroupController', function($scope, $http, $state) {
    $scope.group = {};

    $scope.saveGroup = function(group) {

        var request = {
            method: 'POST',
            url: 'http://localhost:8080/group/',
            skipAuthorization: false,
            data: group
        };

        $http(request).success(function(response) {
            if (success(response, $state)) {
                $state.go('groups');
            }
        }).error(function(err) {
            console.log(err);
        });
    }
});
// Edit Group controller
angular.module('PowerCiApp').controller('editGroupController', function($scope, $http, $stateParams, $state) {

    $scope.group = {};

    // Call service
    $http({
        method: 'GET',
        url: 'http://localhost:8080/group/' + $stateParams.id,
        dataType: 'jsonp',
        skipAuthorization: false
    }).success(function(response) {
        if (success(response, $state)) {
            $scope.group = response.details;
        }
    }).error(function(err) {
        console.log(err);
    });

    $scope.saveGroup = function(group) {
        var request = {
            method: 'PUT',
            url: 'http://localhost:8080/group/' + $stateParams.id,
            skipAuthorization: false,
            data: group
        };

        // SEND THE FILES.
        $http(request).success(function(response) {
            if (success(response, $state)) {
                $state.go('groups');
            }
        }).error(function(err) {
            console.log(err);
        });
    }
});

// Delete group controller
angular.module('PowerCiApp').controller('deleteGroupController', function($scope, $http, $stateParams, $state) {
    $scope.message = "";

    // Call delete group
    $http({
        method: 'DELETE',
        url: 'http://localhost:8080/group/' + $stateParams.id,
        dataType: 'jsonp',
        skipAuthorization: false
    }).success(function(response) {
        if (success(response, $state)) {
            $state.go('groups');
        }
    }).error(function(err) {
        console.log(err);
    });
});

// Users manager controller
angular.module('PowerCiApp').controller('usersManagerController', function($scope, $http, $stateParams, $location, $route, $state) {
    $scope.message = "";
    $scope.group = {};
    $scope.list_roles = [];
    $scope.list_users_roles = [];
    $scope.list_add_usres = [];
    $scope.list_selects_role = [];

    // Call service
    $http({
        method: 'GET',
        url: 'http://localhost:8080/group/' + $stateParams.id + '?full=true',
        dataType: 'jsonp',
        skipAuthorization: false
    }).success(function(response) {
        if (success(response, $state)) {
            $scope.group = response.details;
            if (null != $scope.group.users_role) {
                if ($scope.group.users_role.length > 0)
                    $scope.users_finded = $scope.group.users_role;
                $scope.group.users_role.forEach(function(userRole) {
                    $scope.list_add_usres.push(userRole.user._id);
                });
            }
        }
    }).error(function(err) {
        console.log(err);
    });

    // Add new Role
    $scope.actions_list = null;
    $scope.actions_selected = [];
    $("button#addRole").click(function() {
        if ($scope.actions_list == null) {
            // Call get all roles service
            $http({
                method: 'GET',
                url: 'http://localhost:8080/actions',
                dataType: 'jsonp',
                skipAuthorization: false
            }).success(function(response) {
                if (success(response, $state)) {
                    $scope.actions_list = response.details;
                }
            }).error(function(err) {
                console.log(err);
            });
        }
        $("div#addRole").toggle(500);
    });

    // toggle actions selection
    $scope.toggleActionSelection = function toggleSelection(actionId) {
        var idx = $scope.actions_selected.indexOf(actionId);
        // is currently selected
        if (idx > -1) {
            $scope.actions_selected.splice(idx, 1);
        }

        // is newly selected
        else {
            $scope.actions_selected.push(actionId);
        }
    };

    $scope.saveRole = function(role) {
        role.actions_list = $scope.actions_selected;
        $scope.group.new_role = role;
        echo($scope.group);
        updateGroup($scope.group, $http, $stateParams._id);
        $route.reload();
    }

    $scope.saveGroup = function(group) {
        updateGroup($scope.group, $http, $stateParams._id);
        $state.go('detailGroup/' + group._id);
    };
    // Add User
    $("button#addUser").click(function() {
        $("div#addUser").toggle(500);
    });

    $scope.addUsersSelection = function(userId) {
        var idx = $scope.list_add_usres.indexOf(userId);
        if (idx > -1) {
            $scope.list_add_usres.splice(idx, 1);
            $('select#' + userId).val('');
            $('select#' + userId).css("background-color", "rgb(221, 221, 221)");
        } else {
            $scope.list_add_usres.push(userId);
            if ($('select#' + userId).val() == "") {
                $('select#' + userId).css("background-color", "red");
            } else {
                $('select#' + userId).css("background-color", "green");
            }
        }
        echo($scope.list_add_usres);
    }

    // Remove user from the group
    $scope.removeUserFromGroup = function(userId) {
        // Call delete group
        $http({
            method: 'DELETE',
            url: 'http://localhost:8080/group/user_role',
            skipAuthorization: false,
            data: {
                'group_id': $scope.group._id,
                'user_id': userId
            }
        }).success(function(response) {
            if (success(response, $state)) {
                $route.reload();
            }
        }).error(function(err) {
            console.log(err);
        });
    };

    $scope.changed = function(userId) {

        if ($('select#' + userId).val() == "") {
            if ($scope.list_add_usres.indexOf(userId) > -1) {
                $('select#' + userId).css("background-color", "red");
            } else {
                $('select#' + userId).css("background-color", "rgb(221, 221, 221)");
            }
        } else {
            if ($scope.list_add_usres.indexOf(userId) == -1) {
                $('select#' + userId).css("background-color", "red");
            } else {
                $('select#' + userId).css("background-color", "green");
            }
        }
    }

    $scope.findUser = function(requestString) {
        // Call get all roles service
        $http({
            method: 'GET',
            url: 'http://localhost:8080/groups/find_users_roles?group_id=' + $scope.group._id + "&requestString=" + requestString + "&in=true",
            dataType: 'jsonp',
            skipAuthorization: false
        }).success(function(response) {
            if (success(response, $state)) {
                if (null != response.details) {
                    echo(response.details);
                    $scope.users_finded = response.details;
                } else {
                    $scope.users_finded = [];
                }
            }
        }).error(function(err) {
            console.log(err);
        });
    }

    $scope.findUsers = function(requestString) {
        // Call get all roles service
        $http({
            method: 'GET',
            url: 'http://localhost:8080/groups/find_users_roles?group_id=' + $scope.group._id + "&requestString=" + requestString + "&in=false",
            dataType: 'jsonp',
            skipAuthorization: false
        }).success(function(response) {
            if (success(response, $state)) {
                if (null != response.details) {
                    $scope.list_users_finded = response.details;
                    if ($scope.list_users_finded.length > 0) {
                        $scope.defaultRole = {}
                        $scope.defaultRole._id = "";
                        $scope.defaultRole.title = "--please select--";
                        $scope.group.list_roles.unshift($scope.defaultRole)
                    }
                } else {
                    $scope.list_users_finded = [];
                }
            }
        }).error(function(err) {
            console.log(err);
        });
    }

    $scope.saveUsers = function() {
        var error = false;
        $scope.list_add_usres.forEach(function(roleSelect) {
            if ($('select#' + roleSelect).val() == "") {
                $('select#' + roleSelect).css("background-color", "red");
                error = true;
            } else {
                $('select#' + roleSelect).css("background-color", "green");
            }
        });
        if (!error) {
            echo('update group :');
            echo($scope.group);
            $scope.list_add_usres.forEach(function(user) {
                if ($scope.group.list_roles.map(function(element) {
                        return element.user;
                    }).indexOf(user) == -1);
                if (null != $('select#' + user).val() && $('select#' + user).val() != 'undefined' && $('select#' + user).val() != "")
                    $scope.group.users_role.push({
                        user: user,
                        role: $('select#' + user).val()
                    });
            });
            echo($scope.group);
            $scope.group.list_roles = getListRolesId($scope.group);
            $scope.group.users_role = getListUsersRolesId($scope.group);

            echo($scope.group);
            // Call update group
            $http({
                method: 'PUT',
                url: 'http://localhost:8080/group/' + $scope.group._id,
                dataType: 'jsonp',
                skipAuthorization: false,
                data: $scope.group
            }).success(function(response) {
                if (success(response, $state)) {
                    if (null != response.details) {
                        $scope.list_users_finded = response.details;
                        if ($scope.list_users_finded.length > 0) {
                            $scope.defaultRole = {}
                            $scope.defaultRole._id = "";
                            $scope.defaultRole.title = "--please select--";
                            $scope.group.list_roles.unshift($scope.defaultRole)
                        }
                    } else {
                        $scope.list_users_finded = [];
                    }
                }
            }).error(function(err) {
                console.log(err);
            });

        } else {
            $scope.message = "You must select a role for every selected user!"
        }
    };
});

// Roles manager controller
angular.module('PowerCiApp').controller('rolesManagerController', function($scope, $http, $stateParams, $route, $state) {
    $scope.message = "";
    $scope.actions_selected = [];
    $scope.roles_selected = [];
    echo($stateParams.id);
    // Call group service
    $http({
        method: 'GET',
        url: 'http://localhost:8080/group/' + $stateParams.id + '?full=true',
        dataType: 'jsonp',
        skipAuthorization: false
    }).success(function(response) {
        if (success(response, $state)) {
            $scope.group = response.details;
            if (null != $scope.group.list_roles && $scope.group.list_roles.length > 0) {
                $scope.group.list_roles.forEach(function(role) {
                    if (role != null) {
                        $scope.roles_selected.push(role._id);
                    }
                });
            }
        }
    }).error(function(err) {
        console.log(err);
    });

    // toggle roles selection
    $scope.toggleRoleSelection = function toggleSelection(roleId) {
        var idx = $scope.roles_selected.indexOf(roleId);
        // is currently selected
        if (idx > -1) {
            $scope.roles_selected.splice(idx, 1);
        }

        // is newly selected
        else {
            $scope.roles_selected.push(roleId);
        }

        echo($scope.roles_selected);
    };


    // Add new Role
    $scope.actions_list = null;
    $scope.list_roles_not_in_group = [];
    $("button#addRole").click(function() {
        if ($scope.list_roles_not_in_group.length == 0) {
            // Call get all roles service
            $http({
                method: 'GET',
                url: 'http://localhost:8080/roles/group?group_id=' + $scope.group._id + "&in=false",
                dataType: 'jsonp',
                skipAuthorization: false
            }).success(function(response) {
                if (success(response, $state)) {
                    $scope.list_roles_not_in_group = response.details;
                    if ($scope.list_roles_not_in_group.length > 0) {
                        $scope.new_selected_role = $scope.list_roles_not_in_group[0]._id;
                    }
                }
            }).error(function(err) {
                console.log(err);
            });

        }
        $("div#addRole").toggle(500);
    });

    $("button#newRole").click(function() {
        if ($scope.actions_list == null) {
            // Call get all roles service
            $http({
                method: 'GET',
                url: 'http://localhost:8080/actions',
                dataType: 'jsonp',
                skipAuthorization: false
            }).success(function(response) {
                if (success(response, $state)) {
                    $scope.actions_list = response.details;
                }
            }).error(function(err) {
                console.log(err);
            });
        }

        $("div#newRole").toggle(500);
    });

    // toggle actions selection
    $scope.toggleActionSelection = function toggleSelection(actionId) {
        var idx = $scope.actions_selected.indexOf(actionId);
        // is currently selected
        if (idx > -1) {
            $scope.actions_selected.splice(idx, 1);
        }

        // is newly selected
        else {
            $scope.actions_selected.push(actionId);
        }
    };

    $scope.findRole = function(requestString) {
        // Call get all roles service
        $http({
            method: 'GET',
            url: 'http://localhost:8080/roles/group?group_id=' + $scope.group._id + "&requestString=" + requestString,
            dataType: 'jsonp',
            skipAuthorization: false
        }).success(function(response) {
            if (success(response, $state)) {
                $scope.group.list_roles = response.details;
            }
        }).error(function(err) {
            console.log(err);
        });
    }

    $scope.saveRole = function() {
        $scope.group.list_roles.push($scope.new_selected_role);
        updateGroup($scope.group, $http, $stateParams._id);
        $route.reload();
    }

    $scope.saveNewRole = function(role) {
        role.actions_list = $scope.actions_selected;
        $scope.group.new_role = role;
        updateGroup($scope.group, $http, $stateParams._id);
        $route.reload();
    }


    $scope.saveGroup = function(group) {
        updateGroup(group, $http, $stateParams._id);
        $state.go('detailGroup/' + group._id);
    };
});

// Board instance manager controller
angular.module('PowerCiApp').controller('boardInstancesManagerController', function($scope, $http, $stateParams, $route, $state) {

    $scope.board_instance_selected = [];
    // Call group service
    $http({
        method: 'GET',
        url: 'http://localhost:8080/group/' + $stateParams.id + '?full=true',
        dataType: 'jsonp',
        skipAuthorization: false
    }).success(function(response) {
        if (success(response, $state)) {
            $scope.group.list_roles = response.details;
        }
    }).error(function(err) {
        console.log(err);
    });

    $("button#addBoardInstance").click(function() {
        $("div#addBoardInstance").toggle(500);
    });

    // toggle actions selection
    $scope.toggleBoardInstanceSelection = function toggleSelection(boardInstanceId) {
        var idx = $scope.board_instance_selected.indexOf(boardInstanceId);
        // is currently selected
        if (idx > -1) {
            $scope.board_instance_selected.splice(idx, 1);
        }

        // is newly selected
        else {
            $scope.board_instance_selected.push(boardInstanceId);
        }
    };

    $scope.saveNewBoardInstance = function(boardInstance) {

        if (null != $scope.image2)
            boardInstance.picture = $scope.image2.resized.dataURL

        boardInstance.customer_id = "576d46649643f69d1e000001";
        boardInstance.lab_id = "576d3ca34e533e251d000002";
        boardInstance.board_id = "576d099e1788e75d13000001";

        echo('board_instance :')
        echo(boardInstance);
        var request = {
            method: 'POST',
            url: 'http://localhost:8080/board_instance/',
            skipAuthorization: false,
            data: boardInstance
        };

        // SEND THE FILES.
        $http(request).success(function(response) {
            if (success(response, $state)) {
                $scope.group.board_instances.push(response.details._id);
                updateGroup($scope.group, $http, $stateParams._id);
                $state.go('detailGroup/' + $scope.group._id);
            }
        }).error(function(err) {
            console.log(err);
        });
    };

    $scope.saveGroup = function(group) {
        group.board_instances = $scope.board_instance_selected;
        updateGroup(group, $http, $stateParams._id);
        $state.go('detailGroup/' + group._id);
    };
});

// Board instance manager controller
angular.module('PowerCiApp').controller('boardInstancesDetailsController', function($scope, $http, $stateParams, $route, $state) {
    $scope.board_instance_role_selected = [];
    // Call group service
    $http({
        method: 'GET',
        url: 'http://localhost:8080/group/board_instance_details?group_id=' + $stateParams.id_group + '&board_instance_id=' + $stateParams.id_board_instance,
        dataType: 'jsonp',
        skipAuthorization: false
    }).success(function(response) {
        if (success(response, $state)) {
            $scope.group = response.details.group;
            $scope.board_instance = response.details.board_instance;
            $scope.list_users_roles = response.details.list_users_roles;
            if ($scope.list_users_roles != null && $scope.list_users_roles.length > 0) {
                $scope.list_users_roles.forEach(function(element) {
                    $scope.board_instance_role_selected.push(element._id);
                })
            }
        }
    }).error(function(err) {
        console.log(err);
    });
    $("button#addBoardInstance").click(function() {
        $("div#addBoardInstance").toggle(500);
    });

    // toggle actions selection
    $scope.toggleBoardInstanceRoleSelection = function toggleSelection(userRoleId) {
        var idx = $scope.board_instance_role_selected.indexOf(userRoleId);
        // is currently selected
        if (idx > -1) {
            $scope.board_instance_role_selected.splice(idx, 1);
        }

        // is newly selected
        else {
            $scope.board_instance_role_selected.push(userRoleId);
        }
    };

    $scope.saveNewBoardInstance = function(boardInstance) {

        boardInstance.customer_id = "576d46649643f69d1e000001";
        boardInstance.lab_id = "576d3ca34e533e251d000002";
        boardInstance.board_id = "576d099e1788e75d13000001";

        echo(boardInstance);
        var request = {
            method: 'POST',
            url: 'http://localhost:8080/board_instance/',
            skipAuthorization: false,
            data: boardInstance
        };

        // SEND THE FILES.
        $http(request).success(function(response) {
            if (success(response, $state)) {
                $scope.group.board_instances.push(response.details._id);
                updateGroup($scope.group, $http, $stateParams.id_group);
                $state.go('detailGroup/' + $scope.group._id);
            }
        }).error(function(err) {
            console.log(err);
        });
    };

    $scope.saveGroup = function(group) {
        echo($scope.board_instance_role_selected);
        $scope.group.user_board_instance_role = $scope.board_instance_role_selected;
        updateGroup($scope.group, $http, $stateParams.id_group);
        $state.go('detailGroup/' + $scope.group._id);
    };
});

// Update group function
function updateGroup(group, $http, group_id, $state) {

    echo('update group :');
    echo(group);
    group.list_roles = getListRolesId(group);
    group.users_role = getListUsersRolesId(group);
    echo(group);
    // Call update group
    $http({
        method: 'PUT',
        url: 'http://localhost:8080/group/' + group._id,
        dataType: 'jsonp',
        skipAuthorization: false,
        data: group
    }).success(function(response) {
        if (success(response, $state)) {
            $state.go('detailGroup/' + $scope.group._id);
        }
    }).error(function(err) {
        console.log(err);
    });
}

// Mapping list roles Ids
function getListRolesId(group) {
    var list_roles = [];
    group.list_roles.forEach(function(role) {
        if (null != role) {
            if (null != role._id) {
                if (role._id != "")
                    list_roles.push(role._id);
            } else
                list_roles.push(role);
        }
    });
    return list_roles;
}

// Mapping list users roles Ids
function getListUsersRolesId(group) {
    var list_users_roles = [];
    group.users_role.forEach(function(userRole) {
        if (null != userRole && null != userRole.user && null != userRole.role) {
            if (null != userRole.user._id && null != userRole.role._id) {
                if (userRole.role._id != "")
                    list_users_roles.push({
                        'user': userRole.user._id,
                        'role': userRole.role._id
                    });
            } else if (userRole.user != "" && userRole.role != "")
                list_users_roles.push({
                    'user': userRole.user,
                    'role': userRole.role
                });
        }
    });
    return list_users_roles;
}

// Login
function success(response, state) {
    if (response.code == -1) {
        state.go('login');
        return false;
    } else
        return true;
}

// echo :)
function echo(String) {
    console.log(String);
}