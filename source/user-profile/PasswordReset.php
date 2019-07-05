<?php
       include "lib.php";
        if(isset($_GET['Guid'])) {
       session_start();
       $service = new DataLayer();
      $Username= $service->ReturnUsernameForPassReset($_GET['Guid']);
       $_SESSION["ResetPassUsername"]=$Username;
        }

header("Location: PasswordResetView.php");
         die();
         
  ?>
