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
  background-image: url("/PhpSemesterproject/Images/login.png");

  /* Full height */
  height: 100%; 

  /* Center and scale the image nicely */
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}

.bgSuccessfull {
    /* The image used */
  background-image: url("/PhpSemesterproject/Images/LoginSuccessful.png");

  /* Full height */
  height: 100%; 

  /* Center and scale the image nicely */
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}

.bgAlert {
    /* The image used */
  background-image: url("/PhpSemesterproject/Images/Login2.png");

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
        <title>TODO supply a title</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
     <?php
     session_start();
     if(isset($_SESSION["Succes"])){
   echo '<body id="body" class="bgSuccessfull">';
     }
     else{
         echo '<body id="body" class="bg">';
     }
            ?>
        <div style="text-align:center;margin-top:-11%">
            <input type="text" id="Username" placeholder="Username" class="inputStyle">
            
        </div>
        <div style="text-align:center;margin-top:3%">
            <input type="password" id="Password" placeholder="Password" class="inputStyle">
        </div>
    
    <div style="text-align:center;margin-top:1%">
        <a style="margin-left:-5%;margin-right: 10px" href="/PhpSemesterproject/PassChangeReguestView.php">Forgot Password?</a><a href="/PhpSemesterproject/RegisterView.php">Register</a>
        </div>
        
         <div style="text-align:center;margin-top:1%">
             <button type="button"  class="buttonStyle" value="Submit" onclick="login()">
                 <img src="/PhpSemesterproject/Images/sova.png" width="30px" height="40px" stye="margin-top:-10px">
                 <span class="spanInButton">Submit </span>
                 <img src="/PhpSemesterproject/Images/sova.png" width="30px" height="40px" stye="margin-top:-10px">
             </button>
        </div>
    
    </body>
</html>
<script src="/PhpSemesterproject/Js/SHA.js"></script>
<script>
    
    var login=function(){
        console.log("uso");
    var username=$("#Username").val();
    var pass=$("#Password").val();
    console.log(username);
    console.log(pass);
    
    
    var hashObj = new jsSHA("SHA-512", "TEXT", {numRounds: 1});
  hashObj.update(pass);
  var HashPass = hashObj.getHash("HEX");
  
    $.ajax({
      url: "/PhpSemesterproject/index.php?function=login",
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