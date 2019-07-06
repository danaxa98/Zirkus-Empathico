define('services/LocalStorage',
    ['logging', 'store', 'uuid'],
    function(logging, store, uuid)
{
    "use strict";
    /**
     * LocalStorage handled every thing what related with the browser storage.
     * @class
     * @constructor
     */
    var LocalStorage = function() {
        logging.applyLogging(this, 'LocalStorage', ['getTaskProgress', 'isTaskFinishedByMiniGameLevelAndTaskId']);
        this.deviceId = store.get('uuid');
        if (!this.deviceId) {
            var newDeviceId = uuid.v4();
            store.set('uuid', newDeviceId);
            this.deviceId = newDeviceId;
            this.logDebug('Initialized Store with deviceId:', this.deviceId);
        } else {
            this.logDebug('Use existing Store with deviceId:', this.deviceId);
        }
        this.sessionId = uuid.v4();
    };

    LocalStorage.prototype.getDeviceId = function() {
        return this.deviceId;
    };

    LocalStorage.prototype.getSessionId = function() {
        return this.sessionId;
    };

    LocalStorage.prototype.setLastPlayedLevel = function(miniGameId, level) {
        store.set('lastPlayed-' + miniGameId, level);
    };

    LocalStorage.prototype.getLastPlayedLevel = function(miniGameId) {
        return store.get('lastPlayed-' + miniGameId) || undefined;
    };

    LocalStorage.prototype.setLastPlayedTask = function(miniGameId, task) {
        store.set('lastPlayedTask-' + miniGameId, task);
    };

    LocalStorage.prototype.getLastPlayedTask = function(miniGameId) {
        return store.get('lastPlayedTask-' + miniGameId) || undefined;
    };

    LocalStorage.prototype.setCurrentLevel = function(miniGameId, level) {
        store.set('currentLevel-' + miniGameId, level);
    };

    LocalStorage.prototype.getCurrentLevel = function(miniGameId) {
        return parseInt(store.get('currentLevel-' + miniGameId), 10) || 0;
    };

    LocalStorage.prototype.isTaskFinishedByMiniGameLevelAndTaskId = function(miniGameId, levelId, taskId)
    {
        var levelData = store.get('taskProgress-' + miniGameId + '-' + levelId) || {};
        return levelData[taskId] ? true : false;
    };

    LocalStorage.prototype.setTaskFinishedForMiniGameLevelAndTaskId = function(miniGameId, levelId, taskId) {
        var levelData = store.get('taskProgress-' + miniGameId + '-' + levelId) || {};
        levelData[taskId] = true;
        store.set('taskProgress-' + miniGameId + '-' + levelId, levelData);
        this.hookChangeTaskProgress(miniGameId, levelId, taskId, levelData);
    };

    LocalStorage.prototype.getTaskProgress = function(miniGameId, levelId) {
        return _.size(store.get('taskProgress-' + miniGameId + '-' + levelId) || {});
    };


    LocalStorage.prototype.setStatusNone = function(){
        this.setStatus('none');
    };
    LocalStorage.prototype.isStatusNone = function(){
        return this.getStatus() == 'none';
    };
    LocalStorage.prototype.setStatusWonWithAward = function(){
        this.setStatus('wonWithAward');
    };
    LocalStorage.prototype.isStatusWonWithAward = function(){
        return this.getStatus() == 'wonWithAward';
    };
    LocalStorage.prototype.setStatusWonWithoutAward = function(){
        this.setStatus('wonWithoutAward');
    };
    LocalStorage.prototype.isStatusWonWithoutAward = function(){
        return this.getStatus() == 'wonWithoutAward';
    };
    LocalStorage.prototype.setStatusWonWithoutAwardAndHelp = function(){
        this.setStatus('wonWithoutAwardAndHelp');
    };
    LocalStorage.prototype.isStatusWonWithoutAwardAndHelp = function(){
        return this.getStatus() == 'wonWithoutAwardAndHelp';
    };

    LocalStorage.prototype.setStatus = function(statusCode){
        store.set('gameStatus', statusCode);
    };
    LocalStorage.prototype.getStatus = function(){
        return store.get('gameStatus') || "nothing";
    };

    LocalStorage.prototype.isMiniGameUnlocked = function(miniGameId){
        if (this.isDebugActive()) {
            return true;
        }

        if (miniGameId == 1) {
            return true;
        } else if (miniGameId == 2) {
            return (this.getTaskProgress(1, 26) == 10);
        } else if (miniGameId == 3) {
            return (this.getTaskProgress(2, 6) == 10);
        } else if (miniGameId == 4) {
            return (this.getTaskProgress(3, 15) == 10);
        } else if (miniGameId == 5) {
            return (this.getTaskProgress(1, 25) == 10);
        }
    };


    LocalStorage.prototype.setGameFinished = function() {
        store.set('is-game-finished', true);
    };

    LocalStorage.prototype.isMGFinished = function(miniGameId) {
        if (miniGameId == 1) {
            return this.getTaskProgress(1, 30) == 10;
        } else if (miniGameId == 2) {
            return this.getTaskProgress(2, 12) == 10;
        } else if (miniGameId == 3) {
            return this.getTaskProgress(3, 18) == 10;
        } else if (miniGameId == 4) {
            return this.getTaskProgress(4, 24) == 10;
        }
    };

    LocalStorage.prototype.isGameFinished = function() {
        if (store.get('is-game-finished', false) || false) {
            return true;
        }
        var bool = (this.isMGFinished(1) && this.isMGFinished(2) && this.isMGFinished(3) && this.isMGFinished(4));
        if (bool) {
            this.setGameFinished();
        }
        return bool;
    };
    /**
     * Get all chosen Animation.
     * @returns {*|Array}
     */
    LocalStorage.prototype.getSelectedAnimations = function() {
        var ary = store.get('circus-animation', []) || [];
        for(var i=0; i < ary.length; i++) {
            ary[i] = parseInt(ary[i], 10);
        }
        return ary;
    };
    /**
     * Add the new chosen Animation from Circus.
     * @param {Integer} [animationId] 1-25
     */
    LocalStorage.prototype.addNewAnimation = function(animationId) {
        var that = this;
        var ary = that.getSelectedAnimations() || [];
        ary.push(animationId);
        ary = _.unique(ary);
        store.set('circus-animation', ary);
    };

    /**
     * Get all achieved Animals.
     * @returns {*|Array}
     */
    LocalStorage.prototype.getAnimals = function() {
        return store.get('circus-animals', []) || [];
    };

    /**
     * Get last achieved Animal.
     * @returns {String}
     */
    LocalStorage.prototype.getLastAddedAnimal = function() {
        return store.get('circus-animals-last-added', "") || "";
    };

    /**
     * Safe the new Animal what going to be displayed in circus
     * @param {String} [animalId] "hedgehog", "owl", "pig", "toad", "wolf"
     */
    LocalStorage.prototype.addNewAnimal = function(animalId) {
        var that = this;
        var ary = that.getAnimals() || [];
        ary.push(animalId);
        ary = _.unique(ary);
        store.set('circus-animals', ary);
        store.set('circus-animals-last-added', animalId);
    };

    /**
     * Is the Animal already in the Circus?
     * @param {String} [addNewAnimal] "hedgehog", "owl", "pig", "toad", "wolf"
     * @returns {boolean} true = yes, false = no
     */
    LocalStorage.prototype.isAnimalInCircus = function(addNewAnimal) {
        return $.inArray(addNewAnimal, this.getAnimals()) >= 0;
    };

    /**
     * Set a Flag for reward that ready for the gamer to choose
     * @param {Object} [value]
     * @param {Boolean} [value.active] true|false
     * @param {Boolean} [value.type] none|animal|reward
     */
    LocalStorage.prototype.setRewardStatus = function(value) {
        store.set('circus-reward-active', value);
    };
    /**
     * @returns {*|{active: boolean, type: string}}
     */
    LocalStorage.prototype.getRewardStatus = function() {
        var defaultValue = {'active':false, 'type': 'none'};
        return store.get('circus-reward-active', defaultValue) || defaultValue;
    };

    LocalStorage.prototype.setRewardAnimal = function() {
        this.setRewardStatus({'active': true, 'type': 'animal', time: (new Date()).getTime()});
    };

    LocalStorage.prototype.setRewardActive = function() {
        this.setRewardStatus({'active': true, 'type': 'reward', time: (new Date()).getTime()});
    };

    LocalStorage.prototype.resetRewardStatus = function() {
        var defaultValue = {'active': false, 'type': 'none', time: null};
        store.set('circus-reward-active', defaultValue);
    };


    LocalStorage.prototype.hookChangeTaskProgress = function(miniGameId, levelId, taskId, levelData) {
        if (_.size(levelData) === 10) {
            var animal = "";
            if (miniGameId == 1 && levelId == 30) {
                animal = "owl";
            } else if (miniGameId == 2 && levelId == 6) {
                animal = "pig";
            } else if (miniGameId == 2 && levelId == 12) {
                animal = "toad";
            } else if (miniGameId == 3 && levelId == 18) {
                animal = "hedgehog";
            } else if (miniGameId == 4 && levelId == 24) {
                animal = "wolf";
            }

            if (animal === "") {
                this.setRewardActive();
            } else {
                this.setRewardAnimal();
                this.addNewAnimal(animal);
            }
        }
    };

    /**
     * Set if the client is cordova app or not.
     * @param {Boolean} [val] true = is a cordova app, false = browser
     */
    LocalStorage.prototype.setCordova = function(val) {
        store.set('is-cordova', val);
    };
    /**
     * Is this a cordova app?
     * @returns {boolean} true = is a cordova app, false = browser
     */
    LocalStorage.prototype.isCordova = function() {
        return store.get('is-cordova') || false;
    };

    LocalStorage.prototype.getAbsolutePathForRelativeMediaPath = function(relativePath) {
        if (this.isCordova()) {
            var deviceUrl = "file:///sdcard/ZirkusEmpathico/media/";
            //Media Files need to uploaded manually into the directory.
            //After the upload the media service need to be refreshed, otherwise reboot system.
            return relativePath.replace(/\/?media\//g, deviceUrl);
        }

        // this.logDebug('storeBJ before: ', store.getAll() );
        // let jsonData = store.serialize( store.getAll() )

        // let retrievedData = store.deserialize(jsonData);



        // for (var key in retrievedData) {

        //     store.set(key, retrievedData[key]);

        //     }
        
        return relativePath;
    };

    /**
     * When Introduction is reset every Audio will be played again.
     */
    LocalStorage.prototype.resetIntro = function() {
        var files = store.get('intro-file-names') || [];
        _.map(files, function(val) {
            store.remove('is-intro-played-' + escape(val));
        });
        store.set('intro-file-names', []);
    };
    /**
     * When Introduction is reset every Audio will be played again.
     */
    LocalStorage.prototype.addIntroFile = function(filename) {
        var files = store.get('intro-file-names') || [];
        files.push(filename);
        files = _.uniq(files);
        store.set('intro-file-names', files);
    };
    /**
     *
     * @param {Object} [config] Parameters
     * @param {Object} [config.file] Name of the audio file
     * @param {Object} [config.levelId] Level Id necessary on the level screen
     * @returns {boolean}
     */
    LocalStorage.prototype.isIntroActive = function(config) {
        var defaultParam = {
            file: 'none.mp3',
            levelId: -1,
            miniGameId: -1,
            lastCall: new Date().getTime()
        };
        config = _.extend(defaultParam, config);
        config.file = config.file + ((config.miniGameId > -1)?  '-' + config.miniGameId : "");
        var storedParam = store.get('is-intro-played-' +
            escape(config.file)) || null;
        var bool = false;

        if (storedParam == null ||
            config.levelId != storedParam.levelId ||
            config.miniGameId != storedParam.miniGameId //||
            //((new Date()).getTime() - config.lastCall) / 1000 > 10800
            ) {
            bool = true;
        }

        config.lastCall = (new Date()).getTime();
        this.addIntroFile(config.file);
        store.set('is-intro-played-' + escape(config.file), config);

        return bool;
    };
    /**
     * When the app will paused the timestamp will be refreshed.
     */
    LocalStorage.prototype.setLastActivity = function() {
        store.set('cordova-last-pause', (new Date()).getTime());
    };
    /**
     * Should the intro play again?
     * @returns {boolean}
     */
    LocalStorage.prototype.isPlayIntro = function() {
        var lastPauseTime = parseInt( store.get('cordova-last-pause') || 0 );
        // 172.800 seconds <=> 2 days
        // 60 * 60 * 2 = 7.200 seconds <=> 2 hours
        return ((new Date()).getTime() - lastPauseTime) / 1000 > 7200;
    };
    /**
     * Set Debug Mode.
     * @param {Boolean} [val]
     */
    LocalStorage.prototype.setDebug = function(val) {
        store.set('debug', val);
    };

    /**
     * Is Debug Mode active?
     * @param {Boolean}
     */
    LocalStorage.prototype.isDebugActive = function() {
        return store.get('debug') || false;
    };
    /**
     *
     * @param miniGameId
     * @param person
     */
    LocalStorage.prototype.setLastPerson = function(miniGameId, person) {
        store.set('last-person-' + miniGameId, person);
    };
    /**
     * Store the last used Pesron for each Mini Game.
     * @param miniGameId
     */
    LocalStorage.prototype.getLastPerson = function(miniGameId) {
        return store.get('last-person-' + miniGameId) || null;
    };

    /**
     * Home Screen: When a level is unlocked play intro audio file.
     * @param {Integer} [miniGameId] Mini Game Id
     * @returns {boolean}
     */
    LocalStorage.prototype.isIntroMiniGamePlayed = function(miniGameId) {
        return store.get('is-intro-played-mg' + miniGameId) || false;
    };

    /**
     * Set the Intro as played.
     * @param {Integer} [miniGameId] Mini Game Id
     * @returns {boolean}
     */
    LocalStorage.prototype.setIntroMiniGameAsPlayed = function(miniGameId) {
        return store.set('is-intro-played-mg' + miniGameId, true);
    };

    /**
     * Store position of the correct answer, to prevent that the correct answer is never on the same position.
     * @param {Integer} [position] on which position is the correct answer.
     */
    LocalStorage.prototype.setLastCorrectPosition = function(position) {
        store.set('last-correct-position', position);
    };

    /**
     * Get the last correct position.
     * @returns {Integer} the last correct position.
     */
    LocalStorage.prototype.getLastCorrectPosition = function() {
        return store.get('last-correct-position') || null;
    };

    /**
     * Is this a Demo Version?
     */
    LocalStorage.prototype.isDemoMode = function() {
        return store.get('demo-mode') || false;
    };

    LocalStorage.prototype.setDemoMode = function(val) {
        store.set('demo-mode', val);
    };

    /**
     * Get the last Emotion that was played.
     * @returns {String} String of the emotion played
     */
    LocalStorage.prototype.getLastEmotionPlayed = function() {
        return store.get('_ADAPTIVE_emotionPlayed') || null;
    };

/**
     * Set the last Emotion that was played.
     * @param {String} emotion String of the emotion played
     */
    LocalStorage.prototype.setLastEmotionPlayed = function(emotion) {
        return store.set('_ADAPTIVE_emotionPlayed', emotion);
    };

    /**
     *
     * @returns {Integer} number of Choices for the task
     */
    LocalStorage.prototype.getNumberOfChoicesForCurrentTask = function() {
        return store.get('_ADAPTIVE_numberOfChoices') || 0;
    };

    /**
     * 
     * @param {Integer} number number of Choices for the task
     */
    LocalStorage.prototype.setNumberOfChoicesForCurrentTask = function(number) {
        return store.set('_ADAPTIVE_numberOfChoices', number);
    };

    /**
     *
     * @returns {Array} an array of emotion (string) and score (float) 
     */
    LocalStorage.prototype.getEmotionScores = function() {
        return store.get('_ADAPTIVE_emotionScores') || false;
    };

    /**
     *  eArray = [[emotion.ANGRY, 3200], [emotion.ANXIOUS, 3400], [emotion.JOYFUL, 3650], [emotion.NEUTRAL, 3100], [emotion.SAD, 3200], [emotion.SURPRISED, 3300]];
     * @param {Array} emotionScoresArray an array of emotion (string) and score (float) (see above)
     */
    LocalStorage.prototype.setEmotionScores = function(emotionScoresArray) {
        return store.set('_ADAPTIVE_emotionScores', emotionScoresArray);
    };

    /**
     *
     * @returns {Integer} number of Games played
     */
    LocalStorage.prototype.getNumberOfGamesPlayed = function() {
        return store.get('_ADAPTIVE_gamesPlayed') || 0;
    };

    /**
     * 
     * @param {Integer} number  number of Games played
     */
    LocalStorage.prototype.setNumberOfGamesPlayed = function(number) {
        return store.set('_ADAPTIVE_gamesPlayed', number);
    };

    /**
     *
     * @returns {Float} expected successrate between 0 and 1
     */
    LocalStorage.prototype.getExpectedSuccessRate = function() {
        return store.get('_ADAPTIVE_expectedSuccessRate') || 0;
    };

    /**
     * 
     * @param {Float} number   expected successrate
     */
    LocalStorage.prototype.setExpectedSuccessRate = function(number) {
        return store.set('_ADAPTIVE_expectedSuccessRate', number);
    };

    /**
     *
     * @returns {Float} get the user elo score
     */
    LocalStorage.prototype.getEloScore = function() {
        return store.get('_ADAPTIVE_userScore') || false;
    };

    /**
     * 
     * @param {Float} number   set the user elo score
     */
    LocalStorage.prototype.setEloScore = function(number) {
        return store.set('_ADAPTIVE_userScore', number);
    };

    /**
     *
     * @returns {Float} time in seconds, -1 for infinite?
     */
    LocalStorage.prototype.getCurrentTimeConstraint = function() {
        return store.get('_ADAPTIVE_timeConstraint') || -1;
    };

    /**
     * 
     * @param {Float} time   in seconds
     */
    LocalStorage.prototype.setCurrentTimeConstraint = function(time) {
        return store.set('_ADAPTIVE_timeConstraint', time);
    };
    
    /**
     *
     * @returns {Integer} ID
     */
    LocalStorage.prototype.getCurrentTimerID = function() {
        return store.get('_ADAPTIVE_timerID') || -1;
    };

    /**
     * 
     * @param {Integer} ID   
     */
    LocalStorage.prototype.setCurrentTimerID = function(ID) {
        return store.set('_ADAPTIVE_timerID', ID);
    };

    /**
     *
     * @returns {Boolean} ID
     */
    LocalStorage.prototype.isCurrentTimeConstraintAchieved = function() {
        return store.get('_ADAPTIVE_timerConstraintAchieved');
    };

    /**
     * 
     * @param {Boolean} achieved   true: time hasn't run up yet, false: time over
     */
    LocalStorage.prototype.setCurrentTimeConstraintAchieved = function(achieved) {
        return store.set('_ADAPTIVE_timerConstraintAchieved', achieved);
    }; 

    /**
     *
     * @returns {Float} ID
     */
    LocalStorage.prototype.getCurrentScoreChange = function() {
        return store.get('_ADAPTIVE_currentScoreChange') || 0;
    };

    /**
     * 
     * @param {Float} number   true: time hasn't run up yet, false: time over
     */
    LocalStorage.prototype.setCurrentScoreChange = function(number) {
        return store.set('_ADAPTIVE_currentScoreChange', number);
    }; 
    
    /**
     *
     * @returns {String} username
     */
    LocalStorage.prototype.getUserName = function() {
        return store.get('_ADAPTIVE_Username') || '';
    };

    /**
     * 
     * @param {String} username   the username
     */
    LocalStorage.prototype.setUserName = function(username) {
        return store.set('_ADAPTIVE_Username', username);
    };

    /**
     *
     * @returns {boolean} true if the user was allready once redirected to index.html, false else
     */
    LocalStorage.prototype.wasRedirected = function() {
        return store.get('_ADAPTIVE_wasRedirected') || false;
    };

    /**
     * 
     * @param {boolean} wasRedirected   the username
     */
    LocalStorage.prototype.setWasRedirected = function(wasRedirected) {
        return store.set('_ADAPTIVE_wasRedirected', wasRedirected);
    };    

    /**
     *
     * deletes everything in the storage
     */
    LocalStorage.prototype.clearStorage = function() {
        return store.clear();
    };

    /**
     *
     * deletes everything related to AdaptiveSystem in the storage
     */
    LocalStorage.prototype.clearAdaptiveStorage = function() {
        store.remove('_ADAPTIVE_wasRedirected');
        store.remove('_ADAPTIVE_Username');
        store.remove('_ADAPTIVE_currentScoreChange');
        store.remove('_ADAPTIVE_timerConstraintAchieved');
        store.remove('_ADAPTIVE_timerID');
        store.remove('_ADAPTIVE_timeConstraint');
        store.remove('_ADAPTIVE_userScore');
        store.remove('_ADAPTIVE_expectedSuccessRate');
        store.remove('_ADAPTIVE_gamesPlayed');
        store.remove('_ADAPTIVE_emotionScores');
        store.remove('_ADAPTIVE_numberOfChoices');
        store.remove('_ADAPTIVE_emotionPlayed');
    };    

    return new LocalStorage();
});