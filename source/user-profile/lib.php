<?php

class DataLayer
{
    const db_host = "146.66.85.55";
    const db_username = "zirkusem_dbv2";
    const db_pass = "empathie100%";
    const db_databaseName = "zirkusem_trainingv2_dev";
    
    
//    const db_host = "localhost";
//    const db_username = "root";
//    const db_pass = "";
//    const db_databaseName = "zirkusempaticonew";
    
    /*
     * Updates the JSON entry of a user in the minigame progress table
     * @Input
     * $Username: Username String of the user whos data is to be updated
     * $JsonString: String containing the users level progress JSON Object
     * @Return
     * Boolean value indicating the success of the operation
     */
    function updateLevelProgress($Username, $JsonString){
        $con = new mysqli(self::db_host,self::db_username,self::db_pass,self::db_databaseName);
        $con->set_charset('utf8');
        if ($con->connect_errno) {
		return false;
            //print ("Conn error ($con->connect_errno): $con->connect_error");
        } else {
            $comand = $con->prepare("
                                     UPDATE minigame_progress
                                     SET JsonString=?
                                     WHERE Username=?
                                     ");
            $comand->bind_param('ss',$JsonString, $Username); 
            $res=$comand->execute();
            if($res){
                $comand->close();
                $con->close();
                return true;
            }else if($con->errno){
                //print ("Error with execute query ($con->errno): $con->error");
                return false;
            } else{
                //print ("Unknown error");
                return false;
            }
        }
    }
   
    /*
     * Creates an entry in the minigame progress table for a specific user.
     * @Input
     * $Username: String, Username of the user whos entry is to be created
     * $JsonString: JSON Object in a String containing the user's level progress
     * @Return
     * Boolean value indicating the success of the operation
     */
    function insertLevelProgress($Username, $JsonString){
        $con = new mysqli(self::db_host,self::db_username,self::db_pass,self::db_databaseName);
        $con->set_charset('utf8');
        if ($con->connect_errno) {
		return false;
            //print ("Conn error ($con->connect_errno): $con->connect_error");
        } else {
            $comand = $con->prepare("
                                     INSERT INTO minigame_progress(Username, JsonString)
                                     VALUES(?, ?)
                                     ");
            $comand->bind_param('ss',$Username,$JsonString); 
            $res=$comand->execute();
            if($res){
                $comand->close();
                $con->close();
                return true;
            }else if($con->errno){
                //print ("Error with execute query ($con->errno): $con->error");
                return false;
            } else{
                //print ("Unknown error");
                return false;
            }
        }
    }
    /*
     * Retrieves the JSON String of a users minigame progress.
     * @Input
     * $Username: Username String of the user whos JSON Data is to be retrieved
     * @Return
     * Returns the users minigame progress data as a JSON Object in a String
     */
    function retrieveLevelProgress($Username){
        $con = new mysqli(self::db_host,self::db_username,self::db_pass,self::db_databaseName);
     
        $con->set_charset('utf8');
         if ($con->connect_errno) {
				return NULL;
            //print ("Conn error ($con->connect_errno): $con->connect_error");
        } else {
            $comand = $con->prepare("SELECT JsonString FROM minigame_progress WHERE Username = ?");
            $comand->bind_param('s', $Username); 
            $res=$comand->execute();
            $JsonString = NULL;
            $comand->bind_result($JsonString);
            if ($res) {
                if ($comand->fetch()) {
                   $comand->close();
                   $con->close();
                }
            } else if ($con->errno) {
                //print ("Error with execute query ($con->errno): $con->error");
                return NULL;
            } else {
                //print ("Unknown error");
                return NULL;
            }
            
            return $JsonString;
        }
    }
    
    
    /*
	Returns the latest stored score of the Surprised emotion from a user
	@input: $Username: Username String of who's score is to be retrieved
	@return: Upon success, an integer with the score, or NULL if there is an error.
	*/
	function retrieveSurprised($Username){
        $con = new mysqli(self::db_host,self::db_username,self::db_pass,self::db_databaseName);
     
        $con->set_charset('utf8');
        
         if ($con->connect_errno) {
				return NULL;
            //print ("Conn error ($con->connect_errno): $con->connect_error");
        } else {
            $comand = $con->prepare("SELECT SURPRISED FROM surprised_score WHERE EntryID = (SELECT MAX(EntryID) FROM surprised_score WHERE Username = ?)");
            $comand->bind_param('s', $Username); 
            $res=$comand->execute();
            $Surprised = NULL;
            $comand->bind_result($Surprised);
            if ($res) {
                if ($comand->fetch()) {
                   $comand->close();
                   $con->close();
                }
                return $Surprised;
            } else if ($con->errno) {
                //print ("Error with execute query ($con->errno): $con->error");
                return NULL;
            } else {
                //print ("Unknown error");
                return NULL;
            } 
        }
    }
	/*
	Returns the latest stored score of the Sad emotion from a user
	@input: $Username: Username String of who's score is to be retrieved
	@return: Upon success, an integer with the score, or NULL if there is an error.
	*/
    function retrieveSad($Username){
        $con = new mysqli(self::db_host,self::db_username,self::db_pass,self::db_databaseName);
     
        $con->set_charset('utf8');
        
         if ($con->connect_errno) { 
			return NULL;
            //print ("Conn error ($con->connect_errno): $con->connect_error");
        } else {
            $comand = $con->prepare("SELECT SAD FROM sad_score WHERE EntryID = (SELECT MAX(EntryID) FROM sad_score WHERE Username = ?)");
            $comand->bind_param('s', $Username); 
            $res=$comand->execute();
            $Sad = NULL;
            $comand->bind_result($Sad);
            if ($res) {
                if ($comand->fetch()) {
                   $comand->close();
                   $con->close();
                }
                return $Sad;
            } else if ($con->errno) {
                //print ("Error with execute query ($con->errno): $con->error");
                return NULL;
            } else {
                //print ("Unknown error");
                return NULL;
            } 
        }
    }
	
	    /*
	Returns the latest stored score of the Neutral emotion from a user
	@input: $Username: Username String of who's score is to be retrieved
	@return: Upon success, an integer with the score, or NULL if there is an error.
	*/
    function retrieveNeutral($Username){
        $con = new mysqli(self::db_host,self::db_username,self::db_pass,self::db_databaseName);
     
        $con->set_charset('utf8');
        
         if ($con->connect_errno) { 
			return NULL;
            //print ("Conn error ($con->connect_errno): $con->connect_error");
        } else {
            $comand = $con->prepare("SELECT NEUTRAL FROM neutral_score WHERE EntryID = (SELECT MAX(EntryID) FROM neutral_score WHERE Username = ?)");
            $comand->bind_param('s', $Username); 
            $res=$comand->execute();
            $Neutral = NULL;
            $comand->bind_result($Neutral);
            if ($res) {
                if ($comand->fetch()) {
                   $comand->close();
                   $con->close();
                }
                return $Neutral;
            } else if ($con->errno) {
                //print ("Error with execute query ($con->errno): $con->error");
                return NULL;
            } else {
                //print ("Unknown error");
                return NULL;
            } 
        }
    }
	/*
	Returns the latest stored score of the Surprised emotion from a user
	@input: $Username: Username String of who's score is to be retrieved
	@return: Upon success, an integer with the score, or NULL if there is an error.
	*/
    function retrieveJoyful($Username){
        $con = new mysqli(self::db_host,self::db_username,self::db_pass,self::db_databaseName);
     
        $con->set_charset('utf8');
        
         if ($con->connect_errno) { 
			return NULL;
            //print ("Conn error ($con->connect_errno): $con->connect_error");
        } else {
            $comand = $con->prepare("SELECT JOYFUL FROM joyful_score WHERE EntryID = (SELECT MAX(EntryID) FROM joyful_score WHERE Username = ?)");
            $comand->bind_param('s', $Username); 
            $res=$comand->execute();
            $Joyful = NULL;
            $comand->bind_result($Joyful);
            if ($res) {
                if ($comand->fetch()) {
                   $comand->close();
                   $con->close();
                }
                return $Joyful;
            } else if ($con->errno) {
                //print ("Error with execute query ($con->errno): $con->error");
                return NULL;
            } else {
                //print ("Unknown error");
                return NULL;
            } 
        }
    }
	/*
	Returns the latest stored score of the Anxious emotion from a user
	@input: $Username: Username String of who's score is to be retrieved
	@return: Upon success, an integer with the score, or NULL if there is an error.
	*/
    function retrieveAnxious($Username){
        $con = new mysqli(self::db_host,self::db_username,self::db_pass,self::db_databaseName);
     
        $con->set_charset('utf8');
        
         if ($con->connect_errno) { 
			return NULL;
            //print ("Conn error ($con->connect_errno): $con->connect_error");
        } else {
            $comand = $con->prepare("SELECT ANXIOUS FROM anxious_score WHERE EntryID = (SELECT MAX(EntryID) FROM anxious_score WHERE Username = ?)");
            $comand->bind_param('s', $Username); 
            $res=$comand->execute();
            $Anxious = NULL;
            $comand->bind_result($Anxious);
            if ($res) {
                if ($comand->fetch()) {
                   $comand->close();
                   $con->close();
                }
                return $Anxious;
            } else if ($con->errno) {
                //print ("Error with execute query ($con->errno): $con->error");
                return NULL;
            } else {
                //print ("Unknown error");
                return NULL;
            } 
        }
    }
	/*
	Returns the latest stored score of the Angry emotion from a user
	@input: $Username: Username String of who's score is to be retrieved
	@return: Upon success, an integer with the score, or NULL if there is an error.
	*/
    function retrieveAngry($Username){
        $con = new mysqli(self::db_host,self::db_username,self::db_pass,self::db_databaseName);
     
        $con->set_charset('utf8');
        
         if ($con->connect_errno) {
				return NULL;
            //print ("Conn error ($con->connect_errno): $con->connect_error");
        } else {
            $comand = $con->prepare("SELECT ANGRY FROM angry_score WHERE EntryID = (SELECT MAX(EntryID) FROM angry_score WHERE Username = ?)");
            $comand->bind_param('s', $Username); 
            $res=$comand->execute();
            $Angry = NULL;
            $comand->bind_result($Angry);
            if ($res) {
                if ($comand->fetch()) {
                   $comand->close();
                   $con->close();
                }
                return $Angry;
            } else if ($con->errno) {
                //print ("Error with execute query ($con->errno): $con->error");
                return NULL;
            } else {
                //print ("Unknown error");
                return NULL;
            } 
        }
    }
	/*
	Returns the latest stored K-Value from a user
	@input: $Username: Username String of who's value is to be retrieved
	@return: Upon success, a float with the value, or NULL if there is an error.
	*/
    function retrieveKval($Username){
        $con = new mysqli(self::db_host,self::db_username,self::db_pass,self::db_databaseName);
     
        $con->set_charset('utf8');
        
         if ($con->connect_errno) { 
			return NULL;
            //print ("Conn error ($con->connect_errno): $con->connect_error");
        } else {
            $comand = $con->prepare("SELECT KVAL FROM kval_score WHERE EntryID = (SELECT MAX(EntryID) FROM kval_score WHERE Username = ?)");
            $comand->bind_param('s', $Username); 
            $res=$comand->execute();
            $Kval = NULL;
            $comand->bind_result($Kval);
            if ($res) {
                if ($comand->fetch()) {
                   $comand->close();
                   $con->close();
                }
                return $Kval;
            } else if ($con->errno) {
                //print ("Error with execute query ($con->errno): $con->error");
                return NULL;
            } else {
                //print ("Unknown error");
                return NULL;
            } 
        }
    }
	    /*
	Returns the latest stored ELO score from a user
	@input: $Username: Username String of who's score is to be retrieved
	@return: Upon success, an integer with the score, or NULL if there is an error.
	*/
    function retrieveELO($Username){
        $con = new mysqli(self::db_host,self::db_username,self::db_pass,self::db_databaseName);
     
        $con->set_charset('utf8');
        
         if ($con->connect_errno) { 
			return NULL;
            //print ("Conn error ($con->connect_errno): $con->connect_error");
        } else {
            $comand = $con->prepare("SELECT ELO FROM elo_score WHERE EntryID = (SELECT MAX(EntryID) FROM elo_score WHERE Username = ?)");
            $comand->bind_param('s', $Username); 
            $res=$comand->execute();
            $Elo = NULL;
            $comand->bind_result($Elo);
            if ($res) {
                if ($comand->fetch()) {
                   $comand->close();
                   $con->close();
                }
                return $Elo;
            } else if ($con->errno) {
                //print ("Error with execute query ($con->errno): $con->error");
                return NULL;
            } else {
                //print ("Unknown error");
                return NULL;
            } 
        }
    }
   
   /*
   Retrieves the timestamp of the latest entry of a user.
   @input
   $Username: Username String of whos timestamp is to be retrieved
   @return
   Upon success, an integer with the UNIX timestamp, and NULL on error
   */
    function retrieveTimestamp($Username){
        $con = new mysqli(self::db_host,self::db_username,self::db_pass,self::db_databaseName);
     
        $con->set_charset('utf8');
        
         if ($con->connect_errno) { 
			return NULL;
            //print ("Conn error ($con->connect_errno): $con->connect_error");
        } else {
			//The timestamps of a user from all tables are selected, and the maximum is retrieved
            $comand = $con->prepare("
                SELECT MAX(ts) FROM
                (
                    SELECT Timestamp AS ts, Username FROM elo_score
                    UNION ALL
                    SELECT Timestamp AS ts, Username FROM kval_score
                    UNION ALL
                    SELECT Timestamp AS ts, Username FROM angry_score
                    UNION ALL
                    SELECT Timestamp AS ts, Username FROM anxious_score
                    UNION ALL
                    SELECT Timestamp AS ts, Username FROM joyful_score
                    UNION ALL
                    SELECT Timestamp AS ts, Username FROM kval_score
                    UNION ALL
                    SELECT Timestamp AS ts, Username FROM neutral_score
                    UNION ALL
                        SELECT Timestamp AS ts, Username FROM sad_score
                    UNION ALL
                    SELECT Timestamp AS ts, Username FROM surprised_score
                ) AS TimestampTable WHERE Username = ?");
            $comand->bind_param('s', $Username); 
            $res=$comand->execute();
            $Timestamp = NULL;
            $comand->bind_result($Timestamp);
            if ($res) {
                if ($comand->fetch()) {
                   $comand->close();
                   $con->close();
                }
                return $Timestamp;
            } else if ($con->errno) {
                //print ("Error with execute query ($con->errno): $con->error");
                return NULL;
            } else {
                //print ("Unknown error");
                return NULL;
            } 
        }
    }
  
	/*
	Inserts a score into the Surprised table for a user.
	@input
	$Username: The Username String of the User whos score is to be stored
	$Timestamp: The UNIX Timestamp of when the score was achieved
	$Surprised: An integer of the score to be stored
	@return
	A boolean value indicating if the operation was successful
	*/
    function insertSurprised($Username, $Timestamp, $Surprised){
        $con = new mysqli(self::db_host,self::db_username,self::db_pass,self::db_databaseName);
        $con->set_charset('utf8');
        if ($con->connect_errno) {
			return false;
            //print ("Conn error ($con->connect_errno): $con->connect_error");
        } else {
            $comand = $con->prepare("
                                     INSERT INTO surprised_score(Username, Timestamp, SURPRISED)
                                     VALUES(?, ?, ?)
                                     ");
            $comand->bind_param('sii',$Username,$Timestamp,$Surprised); 
            $res=$comand->execute();
            if($res){
                $comand->close();
                $con->close();
                return true;
            }else if($con->errno){
                //print ("Error with execute query ($con->errno): $con->error");
                return false;
            } else{
                //print ("Unknown error");
                return false;
            }
        }
    }
	
	/*
	Inserts a score into the Sad table for a user.
	@input
	$Username: The Username String of the User whos score is to be stored
	$Timestamp: The UNIX Timestamp of when the score was achieved
	$Sad: An integer of the score to be stored
	@return
	A boolean value indicating if the operation was successful
	*/
    function insertSad($Username, $Timestamp, $Sad){
        $con = new mysqli(self::db_host,self::db_username,self::db_pass,self::db_databaseName);
        $con->set_charset('utf8');
        if ($con->connect_errno) {
			return false;
            //print ("Conn error ($con->connect_errno): $con->connect_error");
        } else {
            $comand = $con->prepare("
                                     INSERT INTO sad_score(Username, Timestamp, SAD)
                                     VALUES(?, ?, ?)
                                     ");
            $comand->bind_param('sii',$Username,$Timestamp,$Sad); 
            $res=$comand->execute();
            if($res){
                $comand->close();
                $con->close();
                return true;
            }else if($con->errno){
                //print ("Error with execute query ($con->errno): $con->error");
                return false;
            } else{
                //print ("Unknown error");
                return false;
            }
        }
    }
	/*
	Inserts a score into the Neutral table for a user.
	@input
	$Username: The Username String of the User whos score is to be stored
	$Timestamp: The UNIX Timestamp of when the score was achieved
	$Neutral: An integer of the score to be stored
	@return
	A boolean value indicating if the operation was successful
	*/
    function insertNeutral($Username, $Timestamp, $Neutral){
        $con = new mysqli(self::db_host,self::db_username,self::db_pass,self::db_databaseName);
        $con->set_charset('utf8');
        if ($con->connect_errno) {
			return false;
            //print ("Conn error ($con->connect_errno): $con->connect_error");
        } else {
            $comand = $con->prepare("
                                     INSERT INTO neutral_score(Username, Timestamp, NEUTRAL)
                                     VALUES(?, ?, ?)
                                     ");
            $comand->bind_param('sii',$Username,$Timestamp,$Neutral); 
            $res=$comand->execute();
            if($res){
                $comand->close();
                $con->close();
                return true;
            }else if($con->errno){
                //print ("Error with execute query ($con->errno): $con->error");
                return false;
            } else{
                //print ("Unknown error");
                return false;
            }
        }
    }
	/*
	Inserts a score into the Joyful table for a user.
	@input
	$Username: The Username String of the User whos score is to be stored
	$Timestamp: The UNIX Timestamp of when the score was achieved
	$Joyful: An integer of the score to be stored
	@return
	A boolean value indicating if the operation was successful
	*/
    function insertJoyful($Username, $Timestamp, $Joyful){
        $con = new mysqli(self::db_host,self::db_username,self::db_pass,self::db_databaseName);
        $con->set_charset('utf8');
        if ($con->connect_errno) {
			return false;
            //print ("Conn error ($con->connect_errno): $con->connect_error");
        } else {
            $comand = $con->prepare("
                                     INSERT INTO joyful_score(Username, Timestamp, JOYFUL)
                                     VALUES(?, ?, ?)
                                     ");
            $comand->bind_param('sii',$Username,$Timestamp,$Joyful); 
            $res=$comand->execute();
            if($res){
                $comand->close();
                $con->close();
                return true;
            }else if($con->errno){
                //print ("Error with execute query ($con->errno): $con->error");
                return false;
            } else{
                //print ("Unknown error");
                return false;
            }
        }
    }
	/*
	Inserts a score into the Anxious table for a user.
	@input
	$Username: The Username String of the User whos score is to be stored
	$Timestamp: The UNIX Timestamp of when the score was achieved
	$Anxious: An integer of the score to be stored
	@return
	A boolean value indicating if the operation was successful
	*/
    function insertAnxious($Username, $Timestamp, $Anxious){
        $con = new mysqli(self::db_host,self::db_username,self::db_pass,self::db_databaseName);
        $con->set_charset('utf8');
        if ($con->connect_errno) {
			return false;
            //print ("Conn error ($con->connect_errno): $con->connect_error");
        } else {
            $comand = $con->prepare("
                                     INSERT INTO anxious_score(Username, Timestamp, ANXIOUS)
                                     VALUES(?, ?, ?)
                                     ");
            $comand->bind_param('sii',$Username,$Timestamp,$Anxious); 
            $res=$comand->execute();
            if($res){
                $comand->close();
                $con->close();
                return true;
            }else if($con->errno){
                //print ("Error with execute query ($con->errno): $con->error");
                return false;
            } else{
                //print ("Unknown error");
                return false;
            }
        }
    }
	/*
	Inserts a score into the Angry table for a user.
	@input
	$Username: The Username String of the User whos score is to be stored
	$Timestamp: The UNIX Timestamp of when the score was achieved
	$Angry: An integer of the score to be stored
	@return
	A boolean value indicating if the operation was successful
	*/
    function insertAngry($Username, $Timestamp, $Angry){
        $con = new mysqli(self::db_host,self::db_username,self::db_pass,self::db_databaseName);
        $con->set_charset('utf8');
        if ($con->connect_errno) {
			return false;
            //print ("Conn error ($con->connect_errno): $con->connect_error");
        } else {
            $comand = $con->prepare("
                                     INSERT INTO angry_score(Username, Timestamp, ANGRY)
                                     VALUES(?, ?, ?)
                                     ");
            $comand->bind_param('sii',$Username,$Timestamp,$Angry); 
            $res=$comand->execute();
            if($res){
                $comand->close();
                $con->close();
                return true;
            }else if($con->errno){
                //print ("Error with execute query ($con->errno): $con->error");
                return false;
            } else{
                //print ("Unknown error");
                return false;
            }
        }
    }
	/*
	Inserts a value into the K-Value table for a user.
	@input
	$Username: The Username String of the User whos score is to be stored
	$Timestamp: The UNIX Timestamp of when the score was achieved
	$Kval: A float of the score to be stored
	@return
	A boolean value indicating if the operation was successful
	*/
    function insertKval($Username, $Timestamp, $Kval){
        $con = new mysqli(self::db_host,self::db_username,self::db_pass,self::db_databaseName);
        $con->set_charset('utf8');
        if ($con->connect_errno) {
			return false;
            //print ("Conn error ($con->connect_errno): $con->connect_error");
        } else {
            $comand = $con->prepare("
                                     INSERT INTO kval_score(Username, Timestamp, KVAL)
                                     VALUES(?, ?, ?)
                                     ");
            $comand->bind_param('sid',$Username,$Timestamp,$Kval); 
            $res=$comand->execute();
            if($res){
                $comand->close();
                $con->close();
                return true;
            }else if($con->errno){
                //print ("Error with execute query ($con->errno): $con->error");
                return false;
            } else{
                //print ("Unknown error");
                return false;
            }
        }
    }
	/*
	Inserts a score into the ELO table for a user.
	@input
	$Username: The Username String of the User whos score is to be stored
	$Timestamp: The UNIX Timestamp of when the score was achieved
	$Eloscore: An integer of the score to be stored
	@return
	A boolean value indicating if the operation was successful
	*/	
    function insertELO($Username, $Timestamp, $Eloscore){
        $con = new mysqli(self::db_host,self::db_username,self::db_pass,self::db_databaseName);
        $con->set_charset('utf8');
        if ($con->connect_errno) {
			return false;
            //print ("Conn error ($con->connect_errno): $con->connect_error");
        } else {
            $comand = $con->prepare("
                                     INSERT INTO elo_score(Username, Timestamp, ELO)
                                     VALUES(?, ?, ?)
                                     ");
            $comand->bind_param('sii',$Username,$Timestamp,$Eloscore); 
            $res=$comand->execute();
            if($res){
                $comand->close();
                $con->close();
                return true;
            }else if($con->errno){
                //print ("Error with execute query ($con->errno): $con->error");
                return false;
            } else{
                //print ("Unknown error");
                return false;
            }
        }
    }
    
	/*
	Checks whether a given username already exists in the base table.
	@input
	$Username: String of the username to be checked.
	@return
	true, if the username exists and false if it doesn't
	*/
    function usernameExists($Username){
        $exists = false;
        $con = new mysqli(self::db_host,self::db_username,self::db_pass,self::db_databaseName);
        $con->set_charset('utf8');
        
         if ($con->connect_errno) {
			 return false;
            //print ("Conn error ($con->connect_errno): $con->connect_error");
        } else {
            $comand = $con->prepare("SELECT Username FROM base_table WHERE Username=?");
            $comand->bind_param('s',$Username);
            $res=$comand->execute();
            
            $Username = NULL;
            $comand->bind_result($Username);
            
            if($res){
                if($comand->fetch()){
                    $exists = ($Username != NULL);
                }
                $comand->close();
                $con->close();
            } else if($con->errno){
                //print ("Error with execute query ($con->errno): $con->error");
                return false;
            } else{
                //print ("Unknown error");
                return false;
            }
            return $exists;
        }
    }
    
	/*
	Inserts a user into the base table and inserts default starting scores into the score tables for the newly created user.
	@input
	$Username: Username String of the user to be created
	$Password: Hashed Password String of the user
	$Email: Either NULL or a String containing the users Email-Address
	@return
	Boolean value indicating the success of the operation
	*/
    function createUser($Username, $Password, $Email){
        if($this->usernameExists($Username)){
           // //print("Username already exists!");
            return false;
        }
        $con = new mysqli(self::db_host,self::db_username,self::db_pass,self::db_databaseName);
        $con->set_charset('utf8');
        $Unixtime = time();
        $success = true;
        
         if ($con->connect_errno) {
            //print ("Conn error ($con->connect_errno): $con->connect_error");
        } else {
            $comand = $con->prepare("
                                     INSERT INTO base_table(Username, HashedPassword, EmailAddress)
                                     VALUES(?, ?, ?)
                                     ");
            $comand->bind_param('sss',$Username,$Password,$Email);
                                   
            
            $res=$comand->execute();
            
            if($res){
                $comand->close();
                $con->close();
            } else if($con->errno){
                //print ("Error with execute query ($con->errno): $con->error");
            } else{
                //print ("Unknown error");
            }
            if($success){
             $success=$this->insertELO($Username, $Unixtime, NULL);   
            }
            if($success){
             $success=$this->insertKval($Username, $Unixtime, NULL);   
            }
            if($success){
             $success=$this->insertAngry($Username, $Unixtime, NULL);   
            }
            if($success){
             $success=$this->insertAnxious($Username, $Unixtime, NULL);   
            }
            if($success){
             $success=$this->insertJoyful($Username, $Unixtime, NULL);   
            }
            if($success){
             $success=$this->insertNeutral($Username, $Unixtime, NULL);
            }
            if($success){
             $success=$this->insertSad($Username, $Unixtime, NULL);   
            }
            if($success){
             $success=$this->insertSurprised($Username, $Unixtime, NULL);   
            }
            if($success){
             $success=$this->insertLevelProgress($Username, NULL);   
            }
            return $success;
        }
    }
	/*
	Checks if the pair of Username and Password is correct and exists in the base table.
	@input
	$Username: Username String of the User to be checked
	$Password: Hashed Password String of the user to be checked
	@return
	True, if the user entered his password correctly and false, if username and password don't match
	*/
    function verifyLogin($Username, $Password){
        $con = new mysqli(self::db_host,self::db_username,self::db_pass,self::db_databaseName);
        $con->set_charset('utf8');
        $success = false;
        
        if ($con->connect_errno) {
			return false;
            //print ("Conn error ($con->connect_errno): $con->connect_error");
        } else {
            $comand = $con->prepare("SELECT Username, hashedPassword FROM base_table WHERE Username=? AND HashedPassword=?"); 
            $comand->bind_param('ss',$Username,$Password);
             
            $res=$comand->execute();
            
            $Username = NULL;
            $Password = NULL;
            $comand->bind_result($Username, $Password);
            if($res){
                if($comand->fetch()){
                    $success = ($Username != NULL) and ($Password != NULL);
                }
                $comand->close();
                $con->close();
            } else if($con->errno){
                //print ("Error with execute query ($con->errno): $con->error");
                return false;
            } else{
                //print ("Unknown error");
                return false;
            }
            return $success;
        }
    }
	/*
	Stores the scores of a user in their respective tables.
	@input
	$DBData: Indexed array with the values to be updated. Values not changing are NULL.  Timestamp and Username can't be NULL.
	The array has the following indices to access the data: ELO, KVAL, ANGRY, ANXIOUS, JOYFUL, NEUTRAL, SAD, SURPRISED, Timestamp, Username.
	@return
	Boolean value indicating the success of the operation.
	*/
    function pushData($DBData){
        $success = true;
        if(($DBData["ELO"] != NULL) and $success){
            $success = $this->insertELO($DBData["Username"], $DBData["Timestamp"], $DBData["ELO"]);
        }
        if(($DBData["KVAL"] != NULL) and $success){
            $success = $this->insertKval($DBData["Username"], $DBData["Timestamp"], $DBData["KVAL"]);
        }
        if(($DBData["ANGRY"] != NULL) and $success){
            $success = $this->insertAngry($DBData["Username"], $DBData["Timestamp"], $DBData["ANGRY"]);
        }
        if(($DBData["ANXIOUS"] != NULL) and $success){
            $success = $this->insertAnxious($DBData["Username"], $DBData["Timestamp"], $DBData["ANXIOUS"]);
        }
        if(($DBData["JOYFUL"] != NULL) and $success){
            $success = $this->insertJoyful($DBData["Username"], $DBData["Timestamp"], $DBData["JOYFUL"]);
        }
        if(($DBData["NEUTRAL"] != NULL) and $success){
            $success = $this->insertNeutral($DBData["Username"], $DBData["Timestamp"], $DBData["NEUTRAL"]);
        }
        if(($DBData["SAD"] != NULL) and $success){
            $success = $this->insertSad($DBData["Username"], $DBData["Timestamp"], $DBData["SAD"]);
        }
        if(($DBData["SURPRISED"] != NULL) and $success){
            $success = $this->insertSurprised($DBData["Username"], $DBData["Timestamp"], $DBData["SURPRISED"]);
        }
        return $success;
    }
	/*
	Retrieves the latest values of scores of a given user.
	@input
	$Username: Username String of the user whos data is to be retrieved.
	@return
	An array with the values as described in pushData, or NULL on error.
	*/
    function retrieveData($Username){
        $DBData["Username"] = $Username;
        $DBData["Timestamp"] = $this->retrieveTimestamp($Username);
        $DBData["ELO"] = $this->retrieveELO($Username);
        $DBData["KVAL"] = $this->retrieveKval($Username);
        $DBData["ANGRY"] = $this->retrieveAngry($Username);
        $DBData["ANXIOUS"] = $this->retrieveAnxious($Username);
        $DBData["JOYFUL"] = $this->retrieveJoyful($Username);
        $DBData["NEUTRAL"] = $this->retrieveNeutral($Username);
        $DBData["SAD"] = $this->retrieveSad($Username);
        $DBData["SURPRISED"] = $this->retrieveSurprised($Username);
        foreach($DBData as $key => $DBEntry){
            if($DBEntry == NULL){
                return NULL;
            }
        }
        return $DBData;
    }
	/*
	Verifies the user using the password and deletes ALL stored data from ALL tables linked to that user.
	@input
	$Username: String containing the Username of whos data is to be deleted
	$Password: String containing the users hashed password
	@return
	Boolean value indicating the success of the operation. 
	*/
    function deleteUser($Username, $Password){
        if( !($this->verifyLogin($Username, $Password)) ){
            //print "Password incorrect!";
            return false;
        }
        $con = new mysqli(self::db_host,self::db_username,self::db_pass,self::db_databaseName);
        $con->set_charset('utf8');
        
        if ($con->connect_errno) {
            //print ("Conn error ($con->connect_errno): $con->connect_error");
        } else {
            $commands = [
                $con->prepare("DELETE FROM elo_score WHERE Username = ?"),
                $con->prepare("DELETE FROM kval_score WHERE Username = ?"),
                $con->prepare("DELETE FROM anxious_score WHERE Username = ?"),
                $con->prepare("DELETE FROM angry_score WHERE Username = ?"),
                $con->prepare("DELETE FROM joyful_score WHERE Username = ?"),
                $con->prepare("DELETE FROM neutral_score WHERE Username = ?"),
                $con->prepare("DELETE FROM sad_score WHERE Username = ?"),
                $con->prepare("DELETE FROM surprised_score WHERE Username = ?"),
                $con->prepare("DELETE FROM base_table WHERE Username = ?"),
                $con->prepare("DELETE FROM minigame_progress WHERE Username = ?")
                ];
            foreach ($commands as $command){
                $command->bind_param('s', $Username);
                $res = $command->execute();
                if(!$res || $con->errno){
                    //print "Error deleting User!";
                    $comand->close();
                    $con->close();
                    return false;
                }
            }
            return true;
        }
    }
    
	/*
	OBSOLETE STUB FUNCTION, NOT TO BE USED!!!
	*/
    function TryLogin($Username,$Password) {
        
      
        
        $con = new mysqli(self::db_host,self::db_username,self::db_pass,self::db_databaseName);
     
        $con->set_charset('utf8');
        if ($con->connect_errno) {
           
            //print ("Conn error ($con->connect_errno): $con->connect_error");
        } else {
            
            $comand = $con->prepare("SELECT Username FROM BASE_TABLE");
           
            //$comand->bind_param('ss',$Username,$Password);
            //Izvršenje upita nad bazom podataka. 
            $res=$comand->execute();
          
            $user = NULL;
            $Username=null;
            $Password=null;
            $comand->bind_result($Username);
            if ($res) {

                if ($comand->fetch()) {
                   
                    $user = $Username;
                }
                $comand->close();
                $con->close();
                return $user;
            } else if ($con->errno) {
               
                //print ("Error with execute query ($con->errno): $con->error");
            } else {
                //print ("Unknown error");
            }
        }
    }
    
    
      function incrementGamesPlayed($Username){
        $con = new mysqli(self::db_host,self::db_username,self::db_pass,self::db_databaseName);
        $con->set_charset('utf8');
        if ($con->connect_errno) {
		return false;
            //print ("Conn error ($con->connect_errno): $con->connect_error");
        } else {
            $comand = $con->prepare("
                                     UPDATE base_table
                                     SET GamesPlayed=GamesPlayed + 1
                                     WHERE Username=?
                                     ");
            $comand->bind_param('s',$Username); 
            $res=$comand->execute();
            if($res){
                $comand->close();
                $con->close();
                return true;
            }else if($con->errno){
                //print ("Error with execute query ($con->errno): $con->error");
                return false;
            } else{
                //print ("Unknown error");
                return false;
            }
        }
    }
    
    function retrieveGamesPlayed($Username){
        $con = new mysqli(self::db_host,self::db_username,self::db_pass,self::db_databaseName);
     
        $con->set_charset('utf8');
        
         if ($con->connect_errno) {
				return NULL;
            //print ("Conn error ($con->connect_errno): $con->connect_error");
        } else {
            $comand = $con->prepare("SELECT GamesPlayed FROM base_table WHERE Username = ?");
            $comand->bind_param('s', $Username); 
            $res=$comand->execute();
            $GamesPlayed = NULL;
            $comand->bind_result($GamesPlayed);
            if ($res) {
                if ($comand->fetch()) {
                   $comand->close();
                   $con->close();
                }
                return $GamesPlayed;
            } else if ($con->errno) {
                //print ("Error with execute query ($con->errno): $con->error");
                return NULL;
            } else {
                //print ("Unknown error");
                return NULL;
            } 
        }
    }
	
	    function PasswordResetInsert($Username,$Guid){
        $con = new mysqli(self::db_host,self::db_username,self::db_pass,self::db_databaseName);
        $con->set_charset('utf8');
        if ($con->connect_errno) {
		return false;
            //print ("Conn error ($con->connect_errno): $con->connect_error");
        } else {
            $comand = $con->prepare("
                                     INSERT INTO PasswordResetRequests(Id,Username)
                                     VALUES(?, ?)
                                     ");
            $comand->bind_param('ss',$Guid,$Username); 
            $res=$comand->execute();
            if($res){
                $comand->close();
                $con->close();
                return true;
            }else if($con->errno){
                //print ("Error with execute query ($con->errno): $con->error");
                return false;
            } else{
                //print ("Unknown error");
                return false;
            }
        }
    }
    
    
      function ReturnUsernameForPassReset($Guid){
        $username = null;
        $con = new mysqli(self::db_host,self::db_username,self::db_pass,self::db_databaseName);
        $con->set_charset('utf8');
        
         if ($con->connect_errno) {
			 return null;
            //print ("Conn error ($con->connect_errno): $con->connect_error");
        } else {
            $comand = $con->prepare("SELECT Username FROM PasswordResetRequests WHERE Id=?");
            $comand->bind_param('s',$Guid);
            $res=$comand->execute();
            
            $Username = NULL;
            $comand->bind_result($Username);
            
            if($res){
                if($comand->fetch()){
                    $username =$Username;
                }
                $comand->close();
                $con->close();
            } else if($con->errno){
                //print ("Error with execute query ($con->errno): $con->error");
                return null;
            } else{
                //print ("Unknown error");
                return null;
            }
            return $username;
        }
    }


}
?>
