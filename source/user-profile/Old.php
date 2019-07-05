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
  background-image: url("http://localhost/PhpSemesterproject/Images/login2.png");

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
    <body class="bg">
        <div style="text-align:center;margin-top:-11%">
            <input type="text" placeholder="Username" class="inputStyle">
            
        </div>
        <div style="text-align:center;margin-top:3%">
            <input type="password" placeholder="Password" class="inputStyle">
        </div>
        
         <div style="text-align:center;margin-top:3%">
             <button type="button"  class="buttonStyle" value="Submit">
                 <img src="http://localhost/PhpSemesterproject/Images/sova.png" width="30px" height="40px" stye="margin-top:-10px">
                 <span class="spanInButton">Submit </span>
                 <img src="http://localhost/PhpSemesterproject/Images/sova.png" width="30px" height="40px" stye="margin-top:-10px">
             </button>
        </div>
    
    </body>
</html>
 
<script>
    
    var username="test";
    var pass="lol"
    $.ajax({
      url: "http://localhost/PhpSemesterproject/login.php",
                        type: "POST",

                        contentType:'application/x-www-form-urlencoded',
                        cache: false,

                        data:{
                        "Username":username,
                        "Password":pass
                        },

                        success: function(result)
                        {
                      if(result!=null && result.status==true)
                      {
                       console.log(result);
                       alert(result.Username+"  "+result.Password);
                    }
                   else{
                       console.log(result);
                       alert("Wrong username or password");
                   }
                  }
                });
              
              

</script>