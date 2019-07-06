
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
         else if($_GET['function'] == 'deleteUser')
       {
           $username=$_POST['Username'];
           $password=$_POST['Password'];
           deleteUser($username,$password);
           exit();
       }
         else if($_GET['function'] == 'retrieveData')
       {
            $username=$_POST['Username'];
           retrieveData($username);
           exit();
       }
       
        else if($_GET['function'] == 'pushData')
       {
             $Username=null; 
             if(isset($_POST['Username'])) {
                  $Username=$_POST['Username'];
             }
             $Timestamp=null;
              if(isset($_POST['Timestamp'])) {
                  $Timestamp=$_POST['Timestamp'];
             }
             $ELO=null; 
              if(isset($_POST['ELO'])) {
                  $ELO=$_POST['ELO'];
             }
             $KVAL=null;
              if(isset($_POST['KVAL'])) {
                  $KVAL=$_POST['KVAL'];
             }
             $ANGRY=null;
             if(isset($_POST['ANGRY'])) {
                  $ANGRY=$_POST['ANGRY'];
             }
             $ANXIOUS=null;
               if(isset($_POST['ANXIOUS'])) {
                  $ANXIOUS=$_POST['ANXIOUS'];
             }
             $JOYFUL=null;
             if(isset($_POST['JOYFUL'])) {
                  $JOYFUL=$_POST['JOYFUL'];
             }
             $NEUTRAL=null;
              if(isset($_POST['NEUTRAL'])) {
                  $NEUTRAL=$_POST['NEUTRAL'];
             }
             $SAD=null;
              if(isset($_POST['SAD'])) {
                  $SAD=$_POST['SAD'];
             }
             $SURPRISED=null;
             if(isset($_POST['SURPRISED'])) {
                  $SURPRISED=$_POST['SURPRISED'];
             }
             
             pushData($Username,$Timestamp,$ELO,$KVAL,$ANGRY,$ANXIOUS,$JOYFUL,$NEUTRAL,$SAD,$SURPRISED);
             
           exit();
       }
          else if($_GET['function'] == 'retrieveLevelProgress')
       {
            $username=$_POST['Username'];
           retrieveLevelProgress($username);
           exit();
       }
         else if($_GET['function'] == 'updateLevelProgress')
       {
            $username=$_POST['Username'];
            $jsonString=$_POST['JsonString'];
           updateLevelProgress($username,$jsonString);
           exit();
       }
         else if($_GET['function'] == 'incrementGamesPlayed')
       {
            $username=$_POST['Username'];
           incrementGamesPlayed($username);
           exit();
       }
        else if($_GET['function'] == 'retrieveGamesPlayed')
       {
            $username=$_POST['Username'];
           retrieveGamesPlayed($username);
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
     
     
    function pushData($Username,$Timestamp,$ELO,$KVAL,$ANGRY,$ANXIOUS,$JOYFUL,$NEUTRAL,$SAD,$SURPRISED){ 
          $jsonObj = new stdClass();
            $service = new DataLayer();
            $DBData["Username"] = $Username;
            $DBData["Timestamp"] = $Timestamp;
            $DBData["ELO"] = $ELO;
            $DBData["KVAL"] = $KVAL;
            $DBData["ANGRY"] = $ANGRY;
            $DBData["ANXIOUS"] = $ANXIOUS;
            $DBData["JOYFUL"] = $JOYFUL;
            $DBData["NEUTRAL"] = $NEUTRAL;
            $DBData["SAD"] = $SAD;
            $DBData["SURPRISED"] = $SURPRISED;
            $jsonObj->status=$service->pushData($DBData);
            
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
    
    
      function deleteUser($Username,$Password){
           
     $jsonObj = new stdClass();
     
     $service = new DataLayer();
     $jsonObj->status=$service->deleteUser($Username,$Password);
     
    
       header('Content-type: application/json');
        echo json_encode($jsonObj);
    }
    
    
    function retrieveData($Username){
           
     $jsonObj = new stdClass();
     
     $service = new DataLayer();
     $jsonObj->Data=$service->retrieveData($Username);
     $jsonObj->status=true;
     if($jsonObj->Data==null){
        $jsonObj->status=false; 
     }
    
       header('Content-type: application/json');
        echo json_encode($jsonObj);
    }
    
    
    function updateLevelProgress($username,$jsonString)
    {
      $jsonObj = new stdClass();
     
     $service = new DataLayer();
     $jsonObj->status=$service->updateLevelProgress($username, $jsonString);
    
    
       header('Content-type: application/json');
        echo json_encode($jsonObj);
    }
    
    function incrementGamesPlayed($username){
        $jsonObj = new stdClass();
     
     $service = new DataLayer();
     $jsonObj->status=$service->incrementGamesPlayed($username);
    
    
       header('Content-type: application/json');
        echo json_encode($jsonObj);
    }
    
   function  retrieveGamesPlayed($Username){
           
     $jsonObj = new stdClass();
     
     $service = new DataLayer();
     $jsonObj->Data=$service->retrieveGamesPlayed($Username);
     $jsonObj->status=true;
     if($jsonObj->Data==null){
        $jsonObj->status=false; 
     }   
       header('Content-type: application/json');
        echo json_encode($jsonObj);
   }
    
     function retrieveLevelProgress($Username){
           
     $jsonObj = new stdClass();
     
     $service = new DataLayer();
     $jsonObj->Data=$service->retrieveLevelProgress($Username);
     $jsonObj->status=true;
     if($jsonObj->Data==null){
        $jsonObj->status=false; 
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
////        <p>Please click the following link to proceed to the password reset "<a href ="https://dev.zirkus-empathico.de/user-profile/PassChangeReguestView.php?Guid="'+$Guid+'>Password Reset</a>"</p>
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
$message .= '<a href="https://dev.zirkus-empathico.de/user-profile/PasswordReset.php?Guid='.$Guid.'">Password Reset</a></p>';
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
   
