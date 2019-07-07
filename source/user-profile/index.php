
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
       
        else if($_GET['function'] == 'passReset')
       {
            $username=$_POST['Username'];
            $guid=$_POST['Guid'];
            $password=$_POST['Password'];
            
            passReset($username,$password,$guid);
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
             $SessionUser=null;
             session_start();
              if(isset($_SESSION["User"])){
                $SessionUser=$_SESSION["User"];
               }
            $username=$_POST['Username'];
           retrieveData($username,$SessionUser);
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
             
              $SessionUser=null;
             session_start();
              if(isset($_SESSION["User"])){
                $SessionUser=$_SESSION["User"];
               }
             
             pushData($Username,$Timestamp,$ELO,$KVAL,$ANGRY,$ANXIOUS,$JOYFUL,$NEUTRAL,$SAD,$SURPRISED,$SessionUser);
             
           exit();
       }
          else if($_GET['function'] == 'retrieveLevelProgress')
       {
            $username=$_POST['Username'];
            
             $SessionUser=null;
             session_start();
              if(isset($_SESSION["User"])){
                $SessionUser=$_SESSION["User"];
               }
               
           retrieveLevelProgress($username,$SessionUser);
           exit();
       }
         else if($_GET['function'] == 'updateLevelProgress')
       {
            $username=$_POST['Username'];
            $jsonString=$_POST['JsonString'];
             $SessionUser=null;
             session_start();
              if(isset($_SESSION["User"])){
                $SessionUser=$_SESSION["User"];
               }
           updateLevelProgress($username,$jsonString,$SessionUser);
           exit();
       }
         else if($_GET['function'] == 'incrementGamesPlayed')
       {
            $username=$_POST['Username'];
            
             $SessionUser=null;
             session_start();
              if(isset($_SESSION["User"])){
                $SessionUser=$_SESSION["User"];
               }
               
           incrementGamesPlayed($username,$SessionUser);
           exit();
       }
        else if($_GET['function'] == 'retrieveGamesPlayed')
       {
            $username=$_POST['Username'];
            
             $SessionUser=null;
             session_start();
              if(isset($_SESSION["User"])){
                $SessionUser=$_SESSION["User"];
               }
               
           retrieveGamesPlayed($username,$SessionUser);
           exit();
       }
       
       
             
       
        }
        else{
         header("Location: LoginView.php");
         die();
        }

             
        
   function isAuthenticated()
           {
         $jsonObj = new stdClass();
         session_start();
        if(isset($_SESSION["User"])){
            $jsonObj->username=$_SESSION["User"];
            $jsonObj->status=True;
        }
        else{
         $jsonObj->status=False;
        }
         header('Content-type: application/json');
        echo json_encode($jsonObj);
     }
     
     
    function pushData($Username,$Timestamp,$ELO,$KVAL,$ANGRY,$ANXIOUS,$JOYFUL,$NEUTRAL,$SAD,$SURPRISED,$SessionUser){ 
          $jsonObj = new stdClass();
          
            if($Username!=$SessionUser){
                 $jsonObj->status=false;
      
                header('Content-type: application/json');
                 echo json_encode($jsonObj);
        
                 return;
                }
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

     
     $service = new DataLayer();
     $jsonObj->status=$service->verifyLogin($Username,$Password);
     if($jsonObj->status){
       session_start();
       $jsonObj->username=$Username;
       $_SESSION["User"]=$Username;
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
    
    
    function retrieveData($Username,$SessionUser){
           
     $jsonObj = new stdClass();
     
     if($Username!=$SessionUser){
      $jsonObj->status=false;
      
       header('Content-type: application/json');
        echo json_encode($jsonObj);
        
        return;
     }
     
     $service = new DataLayer();
     $jsonObj->Data=$service->retrieveData($Username);
     $jsonObj->status=true;
     if($jsonObj->Data==null){
        $jsonObj->status=false; 
     }
    
       header('Content-type: application/json');
        echo json_encode($jsonObj);
    }
    
    
    function updateLevelProgress($username,$jsonString,$SessionUser)
    {
      $jsonObj = new stdClass();
      
        if($username!=$SessionUser){
      $jsonObj->status=false;
      
       header('Content-type: application/json');
        echo json_encode($jsonObj);
        
        return;
     }
     
     $service = new DataLayer();
     $jsonObj->status=$service->updateLevelProgress($username, $jsonString);
    
    
       header('Content-type: application/json');
        echo json_encode($jsonObj);
    }
    
    function incrementGamesPlayed($username,$SessionUser){
        $jsonObj = new stdClass();
        
          if($username!=$SessionUser){
             $jsonObj->status=false;
      
       header('Content-type: application/json');
        echo json_encode($jsonObj);
        
        return;
     }
     
     $service = new DataLayer();
     $jsonObj->status=$service->incrementGamesPlayed($username);
    
    
       header('Content-type: application/json');
        echo json_encode($jsonObj);
    }
    
   function  retrieveGamesPlayed($Username,$SessionUser){
           
     $jsonObj = new stdClass();
     
       if($Username!=$SessionUser){
      $jsonObj->status=false;
      
       header('Content-type: application/json');
        echo json_encode($jsonObj);
        
        return;
     }
     
     $service = new DataLayer();
     $jsonObj->Data=$service->retrieveGamesPlayed($Username);
     $jsonObj->status=true;
     if($jsonObj->Data==null){
        $jsonObj->status=false; 
     }   
       header('Content-type: application/json');
        echo json_encode($jsonObj);
   }
    
     function retrieveLevelProgress($Username,$SessionUser){
           
     $jsonObj = new stdClass();
     
       if($Username!=$SessionUser){
      $jsonObj->status=false;
      
       header('Content-type: application/json');
        echo json_encode($jsonObj);
        
        return;
      }
     
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
    
    
     function passReset($username,$password,$guid)
     {
           $jsonObj = new stdClass();
       $service = new DataLayer();
       $tableUsername=$service->ReturnUsernameForPassReset($guid);
       if($username!=$tableUsername){
           $jsonObj->status=false;
           header('Content-type: application/json');
        echo json_encode($jsonObj);
        return;
       }
       
       
      $jsonObj->status=$service->setNewPass($username, $password);
      $service->RemoveRequestForPassReset($guid,$username);
      
      
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
            $service = new DataLayer();
         if(!$service->usernameExists($Username)){
             $jsonObj->status=false;
             $jsonObj->message="Benutzer existiert nicht";
              header('Content-type: application/json');
              echo json_encode($jsonObj);
              return;
         }
        
             $Email=$service->returnEmail($Username);
           if($Email==null || $Email=="" || $Email==false){
             $jsonObj->status=false;
             $jsonObj->message="Dieser Benutzer hat keine E-Mailadresse angegeben";
              header('Content-type: application/json');
              echo json_encode($jsonObj);
              return;
         }
         
         //generate Guid
         $Guid= GUID();
         //enter record in database

      $jsonObj->status=$service->PasswordResetInsert($Username,$Guid);

      SendMail($Email, $Guid);
         //send mail
         //return true
      
        header('Content-type: application/json');
        echo json_encode($jsonObj);
     }
        
  
     
     
     function SendMail($Email,$Guid){

         
          $from = "studie@zirkus-empathico.de";
    $to = $Email;
    //$subject = "Anfrage zum Passwort Zurücksetzen";
    $subject = "Password Reset Request";

    
      $headers = 'MIME-Version: 1.0' . "\r\n";
     $headers .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";
     $headers .= 'From: '.$from."\r\n".
    'Reply-To: '.$from."\r\n";
 
     
     
     $message = '<html><body>';
$message .= '<h4 style="color:#f40;">Bitte klicke auf den Link um dein Passwort zurückzusetzen!</h4>';
$message .= '<a href="https://dev.zirkus-empathico.de/user-profile/PasswordReset.php?Guid='.$Guid.'">Passwort zurücksetzen</a></p>';
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
   
