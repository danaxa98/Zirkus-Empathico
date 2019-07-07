<?php
       include "lib.php";
        if(isset($_GET['Guid'])) {
       session_start();
       $service = new DataLayer();
      $Username= $service->ReturnUsernameForPassReset($_GET['Guid']);
      
      if($Username==null || $Username==""){
          echo 'Dieser Link ist nicht mehr gültig, prüfe den Link noch einmal oder beantrage einen neuen.';
          die();
      }
       $_SESSION["ResetPassUsername"]=$Username;
       $_SESSION["ResetPassGuid"]=$_GET['Guid'];
        }

        header("Location: PasswordResetView.php");
         die();
         
  ?>
