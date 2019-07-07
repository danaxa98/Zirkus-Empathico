define('services/UserProfile', ['jquery', 'services/LocalStorage', 'AdaptiveSystem', 'store'], function($, localStorage, adaptiveSystem, store)
{
    "use strict";


    var UserProfile = function(){

        this.userName = this.getUserName();
    };


    UserProfile.prototype.getUserName = function()
    {
        var userName = '';

        if ( localStorage.getUserName() )
            return localStorage.getUserName();

        $.ajax({
            url: "/user-profile/index.php?function=isAuthenticated",
            type: "POST",

            contentType:'application/x-www-form-urlencoded',
            cache: false,
            async: false,

            success: function(result)
            {
                if(result == null || result.status === false)
                {
                   // document.location = "/user-profile/LoginView.php";
                }
                else if ( result.status === true){

                    localStorage.setUserName(result.username);
                    userName = result.userName;

                }
            },
            error: function(result){
                console.log('Cant get Username. Error: ');
                console.log(result);
                //document.location = "/user-profile/LoginView.php";
            }
        });

        return userName;
    };


    UserProfile.prototype.isAuthenticated = function()
    {

        var that = this;

        $.ajax({
            url: "/user-profile/index.php?function=isAuthenticated",
            type: "POST",

            contentType:'application/x-www-form-urlencoded',
            cache: false,
            async: false,

            success: function(result)
            {
                if(result == null || result.status === false)
                {
                    
                    document.location = "/user-profile/LoginView.php";
                }
                else if ( result.status === true){

                    that.userName = that.getUserName();
                    that.retrieveLocalStorage();

                    if ( localStorage.isPlayIntro() && !localStorage.wasRedirected() ){
                        console.log(document.location);
                        localStorage.setWasRedirected(true);
                        document.location = "/index.html";
                    }
                }
            },
            error: function(result){
                console.log('Cant Login. Error: ');
                console.log(result);
                document.location = "/user-profile/LoginView.php";
            }
        });
    };

    UserProfile.prototype.logout = function()
    { 
        var that = this;

        that.saveLocalStorage();

        $.ajax({
            url: "/user-profile/index.php?function=logout",
            type: "POST",

            contentType:'application/x-www-form-urlencoded',
            cache: false,
            async: false,

            success: function(result)
            {

                if(result.status === true)
                {
                    
                    document.location = "/user-profile/LoginView.php";
                }
                else{
                    console.log('Cant logout. returned result was: ');
                    console.log(result);
                }
            },
            error: function(result){
                console.log('Cant logout. Error: ');
                console.log(result);
            },
            complete: function(){
                console.log('clearing Local Storage now');
                localStorage.clearStorage();
            }

        });


    };

    UserProfile.prototype.retrieveLocalStorage = function()
    {

        var that = this;
        var retrievedData = '';

        $.ajax({
            url: "/user-profile/index.php?function=retrieveLevelProgress",
            type: "POST",
            contentType:'application/x-www-form-urlencoded',
            cache: false,
            async: false,

            data:{
            "Username": that.userName, //enter username
            },

            success: function(result)
            {

                if (result.status){
                    retrievedData = store.deserialize(result.Data);
                }

                for (var key in retrievedData) {
                    store.set(key, retrievedData[key]);
                }

                return result.status;

            },
            error: function(result, textStatus, errorThrown){
                console.log('Cant retrieve LocalStorage. Error: ');
                console.log(result);
                console.log(textStatus);
                console.log(errorThrown);
                throw(errorThrown);
            }

        });
    };

    UserProfile.prototype.saveLocalStorage = function()
    {

        var that = this;
        var tempStorageJson = store.serialize( store.getAll() );

        //we dont want to save our adaptive temporary stats in the db
        localStorage.clearAdaptiveStorage();

        $.ajax({
            url: "/user-profile/index.php?function=updateLevelProgress",
            type: "POST",
            contentType:'application/x-www-form-urlencoded',
            cache: false,
            async: false,

            data:{
                "Username": that.userName,
                "JsonString": store.serialize( store.getAll() )
                },

            success: function(result)
            {
                console.log('Saving Local Storage to DB successful');
                return result.status;
                // result.status //true or false
                // result.Data //json object in string format
        
            },
            error: function(result, textStatus, errorThrown){
                console.log('Cant save LocalStorage. Error: ');
                console.log(result);
                console.log(textStatus);
                console.log(errorThrown);
                throw(errorThrown);
            }
        });

        //rebuild original store (with adaptive stats)
        var tempStoreObject = store.deserialize(tempStorageJson);
        for (var key in tempStoreObject) {
            store.set(key, tempStoreObject[key]);
        }

    };

    UserProfile.prototype.getGamesPlayed = function()
    {
        var that = this;

        var gamesPlayed = 0;

        if ( localStorage.getNumberOfGamesPlayed() )
            return localStorage.getNumberOfGamesPlayed();

        $.ajax({
            url: "/user-profile/index.php?function=retrieveGamesPlayed",
            type: "POST",
            contentType:'application/x-www-form-urlencoded',
            cache: false,
            async: false,

            data:{
            "Username":that.userName, //enter username
            },

            success: function(result)
            {
                if (result.status === true){
                    gamesPlayed = result.Data;
                    localStorage.setNumberOfGamesPlayed(gamesPlayed);

                }
            },
            error: function(result, textStatus, errorThrown){
                console.log('cant retrieveGamesPlayed. Error: ');
                console.log(result);
                console.log(textStatus);
                console.log(errorThrown);
                throw(errorThrown);
            }
        });

        return gamesPlayed;
    };

    UserProfile.prototype.incrementGamesPlayed = function()
    {
        var that = this;

        if ( localStorage.getNumberOfGamesPlayed() )
            localStorage.setNumberOfGamesPlayed( localStorage.getNumberOfGamesPlayed() + 1 );

        $.ajax({
            url: "/user-profile/index.php?function=incrementGamesPlayed",
            type: "POST",
            contentType:'application/x-www-form-urlencoded',
            cache: false,
            async: false,

            data:{
                "Username":that.userName, //enter username
            },

            success: function(result)
            {
                return result.status; //true or false
            },
            error: function(result, textStatus, errorThrown){
                console.log('cant increment games played. Error: ');
                console.log(result);
                console.log(textStatus);
                console.log(errorThrown);
                throw(errorThrown);
            }
        });
    };


    UserProfile.prototype.getUserEloScore = function()
    {
        var that = this;
        var userEloScore = -1;

        if ( localStorage.getEloScore() )
            return localStorage.getEloScore();

        $.ajax({
            url: "/user-profile/index.php?function=retrieveData",
            type: "POST",
            contentType:'application/x-www-form-urlencoded',
            cache: false,
            async: false,

            data:{
            "Username":that.userName, //enter username
            },

            success: function(result)
            {
                if (result.status){

                    //if user just registered all scores will be null so we give back standard
                    if (result.Data.ELO === null ){

                        userEloScore =  adaptiveSystem.calculateEloScore( that.getUserEmotionScores() );
                        
                    }
                    else{
                        userEloScore = result.Data.ELO;
                    }

                    localStorage.setEloScore(userEloScore);

                }

                else{
                    userEloScore =  adaptiveSystem.calculateEloScore( that.getUserEmotionScores() );
                    localStorage.setEloScore(userEloScore);
                }
            
            //result.Data is object from database or its null result.Data!=null ?
            // result.Data.Username 
            //     result.Data.ELO 
            //     result.Data.KVAL
            //     result.Data.ANGRY
            //     result.Data.ANXIOUS
            //     result.Data.JOYFUL
            //     result.Data.NEUTRAL
            //     result.Data.SAD
            //     result.Data.SURPRISED
            },
            error: function(result, textStatus, errorThrown){
                console.log('cant getUserEmotionScores. Error: ');
                console.log(result);
                console.log(textStatus);
                console.log(errorThrown);
                throw(errorThrown);
            }            
         });

         return userEloScore;
    };

    UserProfile.prototype.setUserEloScore = function(eloScore)
    {
        var that = this;

        localStorage.setEloScore(eloScore);

        // Only values that are not NULL will be stored. So after a game of Sad,
        // everything but the changing values e.g. sad, elo and kval can be left null and will not be pushed
        $.ajax({
            url: "/user-profile/index.php?function=pushData",
            type: "POST",
            contentType:'application/x-www-form-urlencoded',
            cache: false,
            async: false,

            data:{
            "Username": that.userName,
            "ELO": eloScore,
            

            },

            success: function(result)
            {
                return result.status;
                
            },
            error: function(result, textStatus, errorThrown){
                console.log('Cant setUserEloScore . Error: ');
                console.log(result);
                console.log(textStatus);
                console.log(errorThrown);
                throw(errorThrown);
            }
        });

    };

    UserProfile.prototype.updateUserEmotionScore = function(emotion, emotionScoreChange)
    {
        var that = this;

        var emotionScores = that.getUserEmotionScores();
        var newScore = null;
        var ajaxData = {};

        for (var i = 0; i < emotionScores.length; i++){
            if ( emotion === emotionScores[i][0]){
                newScore = emotionScores[i][1] + emotionScoreChange;
                emotionScores[i][1] = emotionScores[i][1] + emotionScoreChange;
            }
        }

        ajaxData["Username"] = that.userName;
        ajaxData[emotion.toUpperCase()] = newScore;

        localStorage.setEmotionScores(emotionScores);

        $.ajax({
            url: "/user-profile/index.php?function=pushData",
            type: "POST",
            contentType:'application/x-www-form-urlencoded',
            cache: false,
            async: false,

            data: ajaxData,

            success: function(result)
            {
                return result.status;
                
            },
            error: function(result, textStatus, errorThrown){
                console.log('Cant update Score for Emotion ' + emotion + '. Error: ');
                console.log(result);
                console.log(textStatus);
                console.log(errorThrown);
                throw(errorThrown);
            }
        });

        that.setUserEloScore( adaptiveSystem.calculateEloScore( emotionScores ) );

    };


    UserProfile.prototype.setUserEmotionScores = function(emotionScores)
    {
        var that = this;

        localStorage.setEmotionScores(emotionScores);

        // Only values that are not NULL will be stored. So after a game of Sad,
        // everything but the changing values e.g. sad, elo and kval can be left null and will not be pushed
        $.ajax({
            url: "/user-profile/index.php?function=pushData",
            type: "POST",
            contentType:'application/x-www-form-urlencoded',
            cache: false,
            async: false,

            data:{
            "Username": that.userName,
            "ANGRY": emotionScores[0][1],
            "ANXIOUS": emotionScores[1][1],
            "JOYFUL": emotionScores[2][1],
            "NEUTRAL": emotionScores[3][1],
            "SAD": emotionScores[4][1],
            "SURPRISED": emotionScores[5][1]

            },

            success: function(result)
            {
                return result.status;
                
            },
            error: function(result, textStatus, errorThrown){
                console.log('Cant setUserEloScore . Error: ');
                console.log(result);
                console.log(textStatus);
                console.log(errorThrown);
                throw(errorThrown);
            }
        });

    };

    UserProfile.prototype.getUserEmotionScores = function()
    {
        var that = this;
        var userEmotionScores = [];

        if ( localStorage.getEmotionScores() )
            return localStorage.getEmotionScores();

        $.ajax({
            url: "/user-profile/index.php?function=retrieveData",
            type: "POST",
            contentType:'application/x-www-form-urlencoded',
            cache: false,
            async: false,

            data:{
            "Username":that.userName, //enter username
            },

            success: function(result)
            {
                if (result.status){

                    //if user just registered all scores will be null so we give back standard
                    if (result.Data.ANGRY === null || result.Data.ANXIOUS === null || result.Data.JOYFUL === null || result.Data.NEUTRAL === null || result.Data.SAD === null || result.Data.SURPRISED === null ){
                        that.setUserEmotionScores(adaptiveSystem.startingEmotionScores); //setUserEmotionScores also sets localStorage
                        userEmotionScores = adaptiveSystem.startingEmotionScores;
                    }
                    else{
                        userEmotionScores = [['angry', result.Data.ANGRY], ['anxious', result.Data.ANXIOUS], ['joyful', result.Data.JOYFUL], ['neutral', result.Data.NEUTRAL], ['sad', result.Data.SAD], ['surprised', result.Data.SURPRISED]];
                        localStorage.setEmotionScores(userEmotionScores);
                    }

                    

                }
                else{
                    throw('retrieveData result.status = false');
                }
            },
            error: function(result, textStatus, errorThrown){
                console.log('cant getUserEmotionScores. Error: ');
                console.log(result);
                console.log(textStatus);
                console.log(errorThrown);
                throw(errorThrown);
            }            
         });

         return userEmotionScores;
    };


    return new UserProfile();

});

