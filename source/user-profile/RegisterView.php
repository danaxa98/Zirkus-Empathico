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
  background-image: url("/user-profile/Images/register1.png");

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
    margin-left:25px;
}

.AlertTextStyle{
    width: 200px !important;
    height: 40px !important;
    margin-left:41% !important;
    margin-top:-60px !important;
    margin-bottom: 15px;
    color:red;

}
input{
   text-align:center;
   font-size:22px;
}

.buttonStyle{
   margin-left: 25px;

}

.spanInButton {
  display: inline-block;
  vertical-align: middle;
  line-height: normal;
  font-size:25px;
  margin-top:-30px;
  
}


.show{
    display:block;
}
.hide{
    display:none;
}
</style>
<html>
    <head>
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js"></script>
        <title>Zirkus Empathico - Registrieren</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body class="bg">
        <div id="ok"></div>
        <div style="text-align:center;margin-top:-31%">
            <input type="text" id="Username" placeholder="Benutzername" class="inputStyle">
            
        </div>
        <div style="text-align:center;height: 60px">
                <div class="hide" id="UsernameAlert">
            <img src="/user-profile/Images/fox.png" width="70px" height="100px" style="margin-left:-250px;margin-bottom: -40px" >
            
            <div class="AlertTextStyle" ><b id="UsernameAlertMessage">Dieser Benutzername ist bereits vergeben, bitte wähle einen anderen Namen</b></div>
                </div>
        </div>
        <div style="text-align:center;">
            
            <input type="password" id="Password" placeholder="Passwort" class="inputStyle">
        </div>
         <div style="text-align:center;margin-top:2%">
            <input type="password" id="ConfirmPass" placeholder="Passwort bestätigen" class="inputStyle">
        </div>
             <div style="text-align:center;height: 70px">
                 <div class="hide" id="PasswordAlert">
            <img src="/user-profile/Images/fox.png" width="70px" height="100px" style="margin-left:-250px;margin-bottom: -40px" >
            
            <div class="AlertTextStyle" ><b id="PasswordAlertMessage">Die Passwörter stimmen nicht überein.</b></div>
        </div>
             </div>
         <div style="text-align:center">
             <input type="text" id="Email" placeholder="Email(Optional)" class="inputStyle">
        </div>
             <div style="text-align:center;height: 60px">
                <div class="hide" id="EmailAlert">
            <img src="/user-profile/Images/fox.png" width="70px" height="100px" style="margin-left:-250px;margin-bottom: -40px" >
            
            <div class="AlertTextStyle" ><b>Wrong Email format.</b></div>
        </div>
          </div>
         <div style="text-align:center">
             <button type="button"  class="buttonStyle" onclick="Register()">
                 <img src="/user-profile/Images/sova.png" width="30px" height="40px" stye="margin-top:-10px">
                 <span class="spanInButton">Absenden </span>
                 <img src="/user-profile/Images/sova.png" width="30px" height="40px" stye="margin-top:-10px">
             </button>
        </div>
    </body>
</html>
 <script src="/user-profile/Js/SHA.js"></script>
<script>
    
    var Register=function(){
    var username=$("#Username").val();
    var pass=$("#Password").val();
    var confirmPass=$("#ConfirmPass").val();
    var email=$("#Email").val();
    var violation=false;
    
    
    if(username===undefined || username==null || username==''){
   $("#UsernameAlertMessage").html("Bitte Benutzernamen angeben");
    var UsernameAlert= $("#UsernameAlert");
          UsernameAlert.removeClass("show");
           UsernameAlert.removeClass("hide");

            UsernameAlert.addClass("show");
             violation=true;
  }
  else{
       var UsernameAlert= $("#UsernameAlert");
          UsernameAlert.removeClass("show");
           UsernameAlert.removeClass("hide");

            UsernameAlert.addClass("hide");
  }
  
  if(pass===undefined || pass==null || pass==''){
   $("#PasswordAlertMessage").html("Bitte Passwort angeben");
    var PassAlert= $("#PasswordAlert");
     PassAlert.removeClass("show");
     PassAlert.removeClass("hide");
     PassAlert.addClass("show");
  violation=true;
  } else if(pass!=confirmPass){
     var PassAlert= $("#PasswordAlert");
     PassAlert.removeClass("show");
     PassAlert.removeClass("hide");
    $("#PasswordAlertMessage").html( "Die Passwörter stimmen nicht überein");
     PassAlert.addClass("show");
     violation=true;
  }else{
        var PassAlert= $("#PasswordAlert");
     PassAlert.removeClass("show");
     PassAlert.removeClass("hide");
     PassAlert.addClass("hide");
  }
  
  if(email!=undefined && email!=null && email!=''){
   if(!validateEmail(email)){
        var EmailAlert= $("#EmailAlert");
     EmailAlert.removeClass("show");
     EmailAlert.removeClass("hide");
     EmailAlert.addClass("show");
     violation=true;
   }
   else{
        var EmailAlert= $("#EmailAlert");
     EmailAlert.removeClass("show");
     EmailAlert.removeClass("hide");
     EmailAlert.addClass("hide");
   }
  }else{
       var EmailAlert= $("#EmailAlert");
     EmailAlert.removeClass("show");
     EmailAlert.removeClass("hide");
     EmailAlert.addClass("hide");
  }
  
  if(violation){
      return;
  }
  
    var hashObj = new jsSHA("SHA-512", "TEXT", {numRounds: 1});
  hashObj.update(pass);
  var HashPass = hashObj.getHash("HEX");
    $.ajax({
      url: "/user-profile/index.php?function=register",
                        type: "POST",

                        contentType:'application/x-www-form-urlencoded',
                        cache: false,

                        data:{
                        "Username":username,
                        "Password":HashPass,
                        "Email":email
                        },

                        success: function(result)
                        {
                           
                      if(result!=null && result.status==true)
                      {
                       window.location.href="/user-profile/LoginView.php"
                    }
                   else{
                      var UsernameAlert= $("#UsernameAlert");
                          UsernameAlert.removeClass("show");
                          UsernameAlert.removeClass("hide");
                          
                          $("#UsernameAlertMessage").html("Dieser Benutzername ist bereits vergeben, bitte wähle einen anderen Namen");
                          UsernameAlert.addClass("show");
                          
                   }
                  }
                });
                
                }
                
                
                
                
                function validateEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}
              
              
</script>