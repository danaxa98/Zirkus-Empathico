<?php

class User {

    
    public $Username;
    public $Password;
   

 
    public function __construct($Username, $Password) {
        $this->Username = $Username;
        $this->Password = $Password;
        
    }

}

?>
