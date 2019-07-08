define('LevelPage',
    ['jsb', 'logging', 'jquery', 'underscore', 'BasePage', 'services/Levels', 'services/LocalStorage',
        'task-page/mg1/Controller',
        'task-page/mg2/Controller',
        'task-page/mg3/Controller',
        'task-page/mg4/Controller',
        'task-page/mg5/Controller',
        'AdaptiveSystem',
        'services/UserProfile'],
    function(jsb, logging, $, _, BasePage, levels,
             localStorage,
             mg1Controller,
             mg2Controller,
             mg3Controller,
             mg4Controller,
             mg5Controller,
             AdaptiveSystem,
             userProfile
        )
{
    "use strict";

    var LevelPage = BasePage.extend('LevelPage');

    LevelPage.prototype.show = function(levelId) {
        var that = this;

        //WebApp AddOn modul
        if ((typeof levelId == "undefined" || levelId == null) &&
            (window.location.pathname.indexOf("mg5.html") > 0 ||
             window.location.pathname.indexOf("alltagsmodul") > 0
                )) {
            levelId = 31;
            that.runMg5OnlyMode = true;
        }

        that.controller = [null, mg1Controller, mg2Controller, mg3Controller, mg4Controller, mg5Controller];

        that.domElement.find('button').removeClass('is-correct is-incorrect');

        that.isVideoPlaying = false;

        that.level = levels.load(levelId);

        that.level.runMg5OnlyMode = that.runMg5OnlyMode;

		jsb.fireEvent('Tracking::ACTIVITY', {
			"actor": {
				"objectType": "user",
				"minigame": this.level.miniGameId
			},
			"object": {
				"id": this.level.id,
				"objectType": "level"
			},
			"verb": "choose-level"
		});

        that.hintLevel = 0;

        that.domElement.removeClass('mini-game-1 mini-game-2 mini-game-3 mini-game-4 mini-game-5');
        that.domElement.addClass('mini-game-' + this.level.miniGameId);

        that.getController().setStates(that);

        that.state.show();
        that.domElement.show();
    };

    LevelPage.prototype.hide = function() {
        this.domElement.hide();
        this.state.hide();
        this.stopVideo();
        this.stopSound();
        this.domElement.find('.bottom-bar button').removeClass('click-event-in-progress');
    };


    LevelPage.prototype.getController = function() {
        var that = this;
        var controller = that.controller[that.level.miniGameId];
        if (controller === null) {
            throw new Error("Selected undefined controller");
        }

        return controller;
    };

    LevelPage.prototype.initializeEventListeners = function() {
        var that = this;

        BasePage.prototype.initializeEventListeners.apply(this, arguments);

        this.domElement.find('.close-button').on('click', function() {
            localStorage.setLastPlayedLevel(that.level.miniGameId, that.level.id);
            that.state.hide();
            that.state.resetStage();
            document.location = 'main.html#choose-level/' + that.level.miniGameId;
        });


        this.domElement.find('.first-option').on('click', function() {
            that.chooseFace(1, $(this));
        });
        this.domElement.find('.second-option').on('click', function() {
            that.chooseFace(2, $(this));
        });
        this.domElement.find('.third-option').on('click', function() {
            that.chooseFace(3, $(this));
        });
        this.domElement.find('.fourth-option').on('click', function() {
            that.chooseFace(4, $(this));
        });
        this.domElement.find('.fifth-option').on('click', function() {
            that.chooseFace(5, $(this));
        });
        this.domElement.find('.sixth-option').on('click', function() {
            that.chooseFace(6, $(this));
        });                        

        this.domElement.find('.correct-option').on('click', function() {
            that.chooseCorrectFace();
        });

        this.domElement.find('.next-button').on('click', function() {
            that.playSound('klick.mp3', function() {
                that.getController().onClickNextButton(that);
            });
        });

        that.domElement.find('video').on('click', function() {
            if (that.isVideoPlaying) {
                //that.domElement.find('video')[0].pause();
            } else {
                that.domElement.find('video')[0].play();
            }
        });

        this.domElement.find('video').on('play', function() {
            that.logDebug('play event');
            that.isVideoPlaying = true;
        });

        this.domElement.find('video').on('ended', function() {
            that.isVideoPlaying = false;
            that.logDebug('end event');
        });

        this.domElement.find('video').on('pause', function() {
            that.isVideoPlaying = false;
            that.logDebug('pause event');
        });

        //FIXME: Implement a Debug mode

        this.domElement.find('.skip-button').on('click', function() {
            that.state.skipState();
        });

    };

    /**
     * This function is uesed by MG2 and MG3 for the selection of a emotion.
     * @param [facePosition] The poistion of the button on the screen 1 to 3.
     * @param [domButton] The jQuery Button Object
     */
    LevelPage.prototype.chooseFace = function(facePosition, domButton) {
        var that = this;
        if (domButton.hasClass('click-event-in-progress')) {
            that.playBackgroundSound('incorrect.mp3', null, {loop: false});
            return;
        }
        that.playSound('klick.mp3', function() {
            that.domElement.find('.bottom-bar button').addClass('click-event-in-progress');

            var emotion = that.level.options[facePosition - 1];

            var aryOption = ['.first-option', '.second-option', '.third-option', '.fourth-option', '.fifth-option', '.sixth-option'];
            that.domElement.find(aryOption[facePosition - 1]).addClass(
                (emotion == that.level.correct) ? 'is-correct' : 'is-incorrect');

            jsb.fireEvent('Tracking::ACTIVITY', {
                "actor": {
                    "objectType": "user",
                    "minigame": that.level.miniGameId
                },
                "object": {
                    "id": emotion,
                    "objectType": "emotion"
                },
                "verb": "choose-emotion"
            });

            if (emotion == that.level.correct) {
                if (typeof that.state.showBeforeCorrectState != "undefined") {
                    that.state.showBeforeCorrectState(function () {
                        that.chooseCorrectFace(false);
                    });
                } else {
                    that.chooseCorrectFace(false);
                }
            } else {
                that.hintLevel = that.hintLevel + 1;
                that.getController().chooseFaceHintOption(that);
            }
        });
    };


    LevelPage.prototype.chooseCorrectFace = function(manualClick) {
        var that = this;
        if (typeof manualClick == "undefined") {
            manualClick = true;
        }
        if (manualClick && that.domElement.find('.click-event-in-progress').length > 0) {
            that.playBusySound();
            return;
        }

        that.finish(this.hintLevel === 0);
    };
    /**
     * Close Level.
     * @param {Boolean} [successfully] true = won with award, false = won without a award
     */
    LevelPage.prototype.finish = function(successfully) {
        var that = this;

        if (that.level.miniGameId == 2){

            clearTimeout(localStorage.getCurrentTimerID() );

            if ( localStorage.isCurrentTimeConstraintAchieved() === false )
                successfully = false;

            var eScoreChange = AdaptiveSystem.updateScores( userProfile.getGamesPlayed(), localStorage.getExpectedSuccessRate() , successfully ? 1 : 0, localStorage.getNumberOfChoicesForCurrentTask() );

            userProfile.incrementGamesPlayed();

            localStorage.setCurrentScoreChange(eScoreChange);
            localStorage.setCurrentScoreChange(eScoreChange);

            userProfile.updateUserEmotionScore(localStorage.getLastEmotionPlayed(), eScoreChange);
            
        }

        localStorage.setLastPlayedLevel(that.level.miniGameId, that.level.id);
        if (successfully) {
            jsb.fireEvent('Tracking::ACTIVITY', {
                "actor": {
                    "objectType": "level-system",
                    "minigame": that.level.miniGameId
                },
                "object": {
                    "id": that.level.taskId,
                    "objectType": "task"
                },
                "verb": "win-task",
                "target": {
                    "id": that.level.id,
                    "objectType": "level"
                }
            });
        } else {
            jsb.fireEvent('Tracking::ACTIVITY', {
                "actor": {
                    "objectType": "level-system",
                    "minigame": that.level.miniGameId
                },
                "object": {
                    "id": that.level.taskId,
                    "objectType": "task"
                },
                "verb": "pass-task",
                "target": {
                    "id": that.level.id,
                    "objectType": "level"
                }
            });
        }

        if (successfully && localStorage.getTaskProgress(that.level.miniGameId, that.level.id) < 10) {
            that.finishWithAward();
        } else {
            that.finishWithoutAward();
        }
    };

    LevelPage.prototype.finishWithAward = function() {
        var that = this;

        localStorage.setTaskFinishedForMiniGameLevelAndTaskId(that.level.miniGameId, that.level.id, that.level.taskId);
        localStorage.setStatusWonWithAward();
        userProfile.saveLocalStorage();
        document.location = 'main.html#choose-level/' + that.level.miniGameId + '';
    };

    LevelPage.prototype.finishWithoutAward = function() {
        var that = this;
        localStorage.setStatusWonWithoutAward();
        userProfile.saveLocalStorage();
        document.location = 'main.html#choose-level/' + that.level.miniGameId;
    };

    return LevelPage;
});
