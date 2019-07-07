<!DOCTYPE html>
<!--
To change this license header, choose License Headers in Project Properties.
To change this template file, choose Tools | Templates
and open the template in the editor.
-->
<style>
    body, html {
  height: 30%;
  width:80%;
  margin:auto;
  margin-top:17%
}

.bg { 
  /* The image used */
  background-image: url("/user-profile/Images/login.png");

  /* Full height */
  height: 100%; 

  /* Center and scale the image nicely */
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}

.bgSuccessfull {
    /* The image used */
  background-image: url("/user-profile/Images/LoginSuccessful.png");

  /* Full height */
  height: 100%; 

  /* Center and scale the image nicely */
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}

.bgAlert {
    /* The image used */
  background-image: url("/user-profile/Images/Login2.png");

  /* Full height */
  height: 100%; 

  /* Center and scale the image nicely */
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}

::-webkit-input-placeholder {
   text-align: center;
}

:-moz-placeholder { /* Firefox 18- */
   text-align: center;  
}

::-moz-placeholder {  /* Firefox 19+ */
   text-align: center;  
}

:-ms-input-placeholder {  
   text-align: center; 
}

.inputStyle{
    width: 200px !important;
    height: 30px !important;
    margin-left:-45px;
}

input{
   text-align:center;
   font-size:22px;
}

.buttonStyle{
   margin-left:-45px;

}

.spanInButton {
  display: inline-block;
  vertical-align: middle;
  line-height: normal;
  font-size:25px;
  margin-top:-30px;
  
}
</style>
<html>
    <head>
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js"></script>
        <title>Zirkus Empathico</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
     <?php
     session_start();
     if(isset($_SESSION["Succes"])){
   echo '<body id="body" class="bgSuccessfull">';
         $_SESSION["Succes"]=null;
     }
     else{
         echo '<body id="body" class="bg">';
     }
            ?>
        <div style="text-align:center;margin-top:-11%">
            <input type="text" id="Username" placeholder="Benutzername" class="inputStyle">
            
        </div>
        <div style="text-align:center;margin-top:3%">
            <input type="password" id="Password" placeholder="Passwort" class="inputStyle">
        </div>
    
    <div style="text-align:center;margin-top:1%">
        <a style="margin-left:-5%;margin-right: 10px" href="/user-profile/PassChangeReguestView.php">Passwort vergessen?</a><a href="/user-profile/RegisterView.php">Registrierung</a>
        </div>
        
         <div style="text-align:center;margin-top:1%">
             <button type="button"  class="buttonStyle" value="Submit" onclick="login()">
                 <img src="/user-profile/Images/sova.png" width="30px" height="40px" stye="margin-top:-10px">
                 <span class="spanInButton">Absenden </span>
                 <img src="/user-profile/Images/sova.png" width="30px" height="40px" stye="margin-top:-10px">
             </button>
        </div>
    
    </body>
</html>
<script src="/user-profile/Js/SHA.js"></script>
<script>
    
    var login=function(){

    var username=$("#Username").val();
    var pass=$("#Password").val();

    
    
    var hashObj = new jsSHA("SHA-512", "TEXT", {numRounds: 1});
  hashObj.update(pass);
  var HashPass = hashObj.getHash("HEX");
  
    $.ajax({
      url: "/user-profile/index.php?function=login",
                        type: "POST",

                        contentType:'application/x-www-form-urlencoded',
                        cache: false,

                        data:{
                        "Username":username,
                        "Password":HashPass
                        },

                        success: function(result)
                        {
                      if(result!=null && result.status==true)
                      {
                        window.location.href="/main.html#start"
                    }
                   else{
                       var body=$("#body");
                       body.removeClass("bgSuccessfull");
                       body.removeClass("bg");
                       body.removeClass("bgAlert");
                       body.addClass("bgAlert");
                   }
                  }
                });
                
                }
              
              

</script>