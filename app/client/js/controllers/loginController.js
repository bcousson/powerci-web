angular.module('PowerCiApp').controller('loginController', function($rootScope, $scope, $http, $state){

    if(window.localStorage.getItem("token")) {
        $state.go("groups");
    }

    $scope.login = function() {
        err = false;
        if(checkStringIsNull($scope.username)) {
            $("#username").addClass("has-error");
            $(".alert-danger span").html("Enter any username and password.");
            $(".alert-danger").show();
            err = true;
        } 
        if(checkStringIsNull($scope.password)) {
            $("#password").addClass("has-error");
            $(".alert-danger span").html("Enter any username and password.");
            $(".alert-danger").show()
            err =  true;
        }
        if(!err) {
            // Call login service
            $http({
                method: 'POST',
                url: 'http://localhost:8080/login/',
                dataType: 'jsonp',
                skipAuthorization: true,
                data: {username:$scope.username,  password: $scope.password}
             }).then(function(response) {
                if(response.data.code == 0) {
                    var token = JSON.stringify(response.data.details);
                    e(token);
                    window.localStorage.setItem("token", token);
                    $state.go('groups');
                } else {
                    localStorage.clear();
                    $(".alert-danger span").html("Incorrect username or password.");
                    $(".alert-danger").show()
                }
            });
        }
    }

    $(".login-form input").keypress(function(el) {
        $(".login-form input").removeClass("has-error");
        $(".alert-danger").hide()
        if(13 == el.which) { $(".login-form .form-actions .btn.green").click();}
    });

    $("#register-btn").click(function() {
        $(".login-form").hide();
        $(".register-form").show();
    });

    $("#register-back-btn").click(function() {
        $(".login-form").show(); 
        $(".register-form").hide();
    })

    $("#forget-password").click(function() {
        $(".login-form").hide(); 
        $(".forget-form").show();
    });
    $("#back-btn").click(function() {
        $(".login-form").show(); 
        $(".forget-form").hide();
    });
});

angular.module('PowerCiApp').controller('logoutController', function($rootScope, $scope, $http, $state){
    localStorage.clear();
    $state.go('login');
});

function checkStringIsNull(string) {
    return string == null || $.trim(string) == "" || $.trim(string) == "undefined";
}

function e(s) {
    console.log(s);
}