define('services/UserProfile', ['jquery', 'services/LocalStorage'], function($, localStorage)
{
    "use strict";

    var UserProfile = function(){};

    UserProfile.prototype.isAuthenticated = function()
    {

        $.ajax({
            url: "/PhpSemesterproject/index.php?function=isAuthenticated",
            type: "POST",

            contentType:'application/x-www-form-urlencoded',
            cache: false,
            success: function(result)
            {
                if(result == null || result.status === false)
                {
                    
                    document.location = "/PhpSemesterproject/LoginView.php";
                }
                else if ( result.status === true){
                    localStorage.setUserName(result.username);

                    if ( localStorage.isPlayIntro() && !localStorage.wasRedirected() ){
                        console.log(document.location);
                        localStorage.setWasRedirected(true);
                        document.location = "/index.html";
                    }
                }
            },
            error: function(result){
                console.log('Cant Login. Error: ');
                console.log(result);
                document.location = "/PhpSemesterproject/LoginView.php";
            }
        });
    };

    UserProfile.prototype.logout = function()
    { 
        $.ajax({
            url: "/PhpSemesterproject/index.php?function=logout",
            type: "POST",

            contentType:'application/x-www-form-urlencoded',
            cache: false,
            success: function(result)
            {

                if(result.status === true)
                {
                    localStorage.clearStorage();
                    document.location = "/PhpSemesterproject/LoginView.php";
                }
                else{
                    console.log('Cant logout. returned result was: ');
                    console.log(result);
                }
            },
            error: function(result){
                console.log('Cant logout. Error: ');
                console.log(result);
            }
        });
    };

    return new Authenticated();

});

