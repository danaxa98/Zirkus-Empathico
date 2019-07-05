
        <?php
        
        include "lib.php";
        //include "login.php";
        
       if(isset($_GET['function'])) {
        if($_GET['function'] == 'login')
            {
            
            if(isset($_POST['Username'])) { 
              $username=$_POST['Username'];
              $password=$_POST['Password'];
              login($username,$password);
             exit();
            }
        } else if($_GET['function'] == 'register')
         {
           $username=$_POST['Username'];
           $password=$_POST['Password'];
           $Email=$_POST['Email'];
          //  var_dump($_POST);
            //register($username,$password,$Email);
            register($username,$password,$Email);
             exit();
        }
       else if($_GET['function'] == 'PasswordResetRequest')
       {
            $username=$_POST['Username'];
            PasswordResetRequest($username);
            exit();
       }
       
        else if($_GET['function'] == 'PasswordReset')
       {
            $username=$_POST['Username'];
            $password=$_POST['Password'];
       }
        else if($_GET['function'] == 'isAuthenticated')
       {
           isAuthenticated();
           exit();
       }
        else if($_GET['function'] == 'logout')
       {
           Logout();
           exit();
       }
        }
        else{
         header("Location: LoginView.php");
         die();
        }
//        $_SESSION["Succes"]="Uspesno";
             
        
   function isAuthenticated()
           {
         $jsonObj = new stdClass();
         session_start();
        if(isset($_SESSION["User"])){
            $jsonObj=$_SESSION["User"];
        }
        else{
         $jsonObj->status=False;
        }
         header('Content-type: application/json');
        echo json_encode($jsonObj);
     }
    
    function login($Username,$Password){
           
     $jsonObj = new stdClass();
//     if($Username=='Jovan'){
//     $jsonObj->status=True;
//      
//     }
//     else{
//      $jsonObj->status=False;
//     }
     
     $service = new DataLayer();
     $jsonObj->status=$service->verifyLogin($Username,$Password);
     if($jsonObj->status){
       session_start();
       $jsonObj->username=$Username;
       $_SESSION["User"]=$jsonObj;
     }
    
       header('Content-type: application/json');
        echo json_encode($jsonObj);
    }
    
    
    
   function Register($Username,$Password,$Email){
           
     $jsonObj = new stdClass();
     $service = new DataLayer();
      $jsonObj->status=$service->createUser($Username, $Password, $Email);
      if($jsonObj->status){
     session_start();
     $_SESSION["Succes"]="Uspesno";
      }
     
       header('Content-type: application/json');
        echo json_encode($jsonObj);
    }
    
    
     function Logout(){
           
     $jsonObj = new stdClass();
     $service = new DataLayer();
      $jsonObj->status=true;
     session_start();
     if(isset($_SESSION["User"])){
         $_SESSION["User"]=null;
     }
     
      
     
       header('Content-type: application/json');
        echo json_encode($jsonObj);
    }
    
    
    
    
     function PasswordResetRequest($Username){
          $jsonObj = new stdClass();
         //check if user exist
         //check if user exist and return Email or null
         //generate Guid
         $Guid= GUID();
         //enter record in database
      $service = new DataLayer();
      $jsonObj->status=$service->PasswordResetInsert($Username,$Guid);
     // $jsonObj->status=True;
      SendMail("jocaenimen@gmail.com", $Guid);
         //send mail
         //return true
      
        header('Content-type: application/json');
        echo json_encode($jsonObj);
     }
        
    function PasswordReset($Username,$Password){
         
         //check if user exist in PassResetTable and delete if exist
        // change password
         //return true
     }
     
     
     function SendMail($Email,$Guid){
//        $from = "studie@zirkus-empathico.de";
//    $to = 'jocaenimen@gmail.com';
//    $subject = "Password Resset";
//        
////  $mail_content = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
////<html xmlns="http://www.w3.org/1999/xhtml">
////<head>
////<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
////</head>
////<body>
////
////<div>
////        <p>Please click the following link to proceed to the password reset "<a href ="https://dev.zirkus-empathico.de/PhpSemesterproject/PassChangeReguestView.php?Guid="'+$Guid+'>Password Reset</a>"</p>
////
////
////</div>
////</body>
////</html>';
//    $message='test';
//    $headers = "From:" . $from;
//    mail($to,$subject,$message, $headers);
         
          $from = "studie@zirkus-empathico.de";
    $to = $Email;
    $subject = "Password Reset Request";
    

    
      $headers = 'MIME-Version: 1.0' . "\r\n";
     $headers .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";
     $headers .= 'From: '.$from."\r\n".
    'Reply-To: '.$from."\r\n";
 
     
     
     $message = '<html><body>';
$message .= '<h4 style="color:#f40;">Please click the following link to proceed to the password reset!</h4>';
$message .= '<a href="https://dev.zirkus-empathico.de/PhpSemesterproject/PasswordReset.php?Guid='.$Guid.'">Password Reset</a></p>';
$message .= '</body></html>';
    mail($to,$subject,$message, $headers);
     }
     
   function GUID()
{
    if (function_exists('com_create_guid') === true)
    {
        return trim(com_create_guid(), '{}');
    }

    return sprintf('%04X%04X-%04X-%04X-%04X-%04X%04X%04X', mt_rand(0, 65535), mt_rand(0, 65535), mt_rand(0, 65535), mt_rand(16384, 20479), mt_rand(32768, 49151), mt_rand(0, 65535), mt_rand(0, 65535), mt_rand(0, 65535));
}
        ?>
   
