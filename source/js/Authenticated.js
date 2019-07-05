define('Authenticated', ['jquery'], function($)
{
    "use strict";

    var Authenticated = function(){};

    Authenticated.prototype.isAuthenticated = function()
    {

        $.ajax({
            url: "/PhpSemesterproject/index.php?function=isAuthenticated",
            type: "POST",

            contentType:'application/x-www-form-urlencoded',
            cache: false,
            success: function(result)
            {
                if(result==null || result.status==false)
                {
                    
                    window.location.href="/PhpSemesterproject/LoginView.php"
                }
                else if ( result.status == true){
                    localStorage.setUsername(result.Username);
                }
            },
            error: function(result){
                console.log('Cant Login. Error: ');
                console.log(result);
                window.location.href="/PhpSemesterproject/LoginView.php"
            }
        });
    };

    Authenticated.prototype.logout = function()
    { 
        $.ajax({
            url: "/PhpSemesterproject/index.php?function=logout",
            type: "POST",

            contentType:'application/x-www-form-urlencoded',
            cache: false,
            success: function(result)
            {

                if(result.status == true)
                {
                    
                    window.location.href="/PhpSemesterproject/LoginView.php"
                }
                else{
                    console.log('Cant logout. Error: ');
                    console.log(result);
                }
            },
            error: function(result){
                console.log('Cant logout. Error: ');
                console.log(result);
                //window.location.href="/PhpSemesterproject/LoginView.php"
            }
        });
    }

    return new Authenticated();

});

