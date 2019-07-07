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
  background-image: url("/user-profile/Images/PassChangeRequest.png");

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
.AlertTextStyle{
    width: 200px !important;
    height: 40px !important;
    margin-left:38% !important;
    margin-top:-53px !important;
    margin-bottom: 15px;
    color:red;

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
        <title>TODO supply a title</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
   <body class="bg">
     
       <div class="show" id="ResetInputs"> 
        <div style="text-align:center;margin-top:-9%">
            <input type="text" id="Username" placeholder="Benutzername" class="inputStyle">
            
        </div>
              <div class="hide" id="MessageAlert" style="text-align:center;height: 30px">
            <div  >
            <img src="/user-profile/Images/fox.png" width="70px" height="100px" style="margin-left:-270px;margin-bottom: -40px" >
            
               <div class="AlertTextStyle" ><b id="MessageAlertText"></b></div>
        </div>
             </div>
        
         <div style="text-align:center;margin-top:3%">
             <button type="button"  class="buttonStyle"  onclick="SendRequest()">
                 <img src="/user-profile/Images/sova.png" width="30px" height="40px" stye="margin-top:-10px">
                 <span class="spanInButton">Senden </span>
                 <img src="/user-profile/Images/sova.png" width="30px" height="40px" stye="margin-top:-10px">
             </button>
        </div>
       </div>
       <p id="Message" class="hide" style="text-align:center;margin-top:-9%;margin-left:-5%;font-size:18px"><b Id="MessageText"></b></p>
    
    </body>
</html>
 
<script>
    
  var SendRequest=function()
  {
      
      var Username=$("#Username").val();
      
      
    $.ajax({
      url: "/user-profile/index.php?function=PasswordResetRequest",
                        type: "POST",

                        contentType:'application/x-www-form-urlencoded',
                        cache: false,

                        data:{
                        "Username":Username
                        },

                        success: function(result)
                        {
                            console.log(result);
                      if(result!=null && result.status==true)
                      {
                       
                      

                        var ResetInputs=$("#ResetInputs");
                       var Message=$("#Message");
                       
                         var MessageText=$("#MessageText");
                       MessageText.html("Ein Link zum Zurücksetzen <br> deines Passwortes wurde <br> dir per E-Mail zugeschickt. <br> Bitte prüfe dein Postfach.");
                        ResetInputs.removeClass("show");
                       ResetInputs.addClass("hide");
                      Message.removeClass("hide");
                       Message.addClass("show");
                       }
                      else{
                          $("#MessageAlertText").html(result.message);
                           var Alert= $("#MessageAlert");
                           Alert.removeClass("show");
                           Alert.removeClass("hide");
                           Alert.addClass("show");
                      }
                    }
                });
  }
              
              

</script>