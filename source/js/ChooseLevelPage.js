define('ChooseLevelPage', ['jsb', 'logging', 'jquery', 'underscore', 'BasePage', 'services/Levels',
        'services/LocalStorage', 'services/Tasks', 'services/Animations', 'services/LevelScreen'],
    function(jsb, logging, $, _, BasePage, levels, localStorage, tasks, Animations, LevelScreen)
{
    "use strict";

    var ChooseLevelPage = BasePage.extend('ChooseLevelPage');

    ChooseLevelPage.prototype.show = function(miniGameId) {
        var that = this;
        that.levelScreen = new  LevelScreen({'context': that});

		jsb.fireEvent('Tracking::ACTIVITY', {
			"actor": {
				"objectType": "user",
				"minigame": parseInt(miniGameId, 10)
			},
			"verb": "enter-minigame"
		});

        //When old reward is still active, redirect user to reward page.
        if (localStorage.getRewardStatus().active &&
            ((new Date()).getTime() - localStorage.getRewardStatus().time) / 1000 > 15) {
            document.location = 'main.html#reward-page';
        }

        //There is no MG5 Level Screen return to home screen
        if (miniGameId == 5) {
            that.animateThreadId = window.setTimeout(function() {
                that.hide();
                document.location = 'main.html#start';
            }, 10);
        }

        that.setLevelSettings(miniGameId, undefined);

        that.domElement.removeClass('mini-game-1 mini-game-2 mini-game-3 mini-game-4');
        that.domElement.addClass('mini-game-' + miniGameId);
        that.domElement.show();

        that.levelScreen.createLevelChooserElements();
        that.levelScreen.createLevelPresentsElements();
        if (localStorage.getRewardStatus().type == "animal") {
            that.levelScreen.setFoxPosition('fox-' + localStorage.getLastAddedAnimal()).stopAtFirstFrame();
        } else {
            that.levelScreen.setFoxPosition().stop();
        }

        that.levelScreen.displayBigLevelProgress(false);

        if (localStorage.isStatusWonWithAward()) {
            that.showWonAward();
        } else if (localStorage.isStatusWonWithoutAward()) {
            that.showWonWithoutAward();
        }

        that.timeoutEnterLevelScreen = window.setTimeout(that.animateEnterLevelScreen, 1000);
        that.setTimeOut();

        that.options.nextBtn.on('click', function(event) {
            event.stopPropagation();
            that.playSound("klick.mp3", function(){
                document.location = '#play-level/' + that.options.selectedLevelId;
            });
        });

        if (localStorage.isMGFinished(miniGameId)) {
            that.playIntroSound("level_nochmal.mp3", function() {

            }, function () {

            }, function() {

            }, {miniGameId: that.options.miniGameId});
        }
    };

    ChooseLevelPage.prototype.setTimeOut = function() {
        var that = this;
        that.setTimer(that.animateInactiveUser);
    };

    ChooseLevelPage.prototype.animateEnterLevelScreen = function() {
        var that = this;
        if(that.isSoundPlaying()) {
            return;
        }

        that.playIntroSound('introduction_weiter.mp3', function() {
            that.setTimeOut();
            that.timeoutId = setTimeout(function() {
                var el = that.domElement.find('.level-next');
                el.fadeOut(500);
                el.fadeIn(500);
            }, 4000);
        }, function () {
            that.setTimeOut();
        }, function() {
            if (localStorage.isStatusWonWithoutAward()) {
                that.playSound(['gut_gemacht.mp3', 'gut_aufgepasst.mp3', 'richtig.mp3'], function() {
                    that.setTimeOut();
                });
            }
        }, {miniGameId: that.options.miniGameId});

    };

    /**
     * This function get called after specific time and play a sound to cheerup the gamer.
     */
    ChooseLevelPage.prototype.animateInactiveUser = function() {
        var that = this;
        that.levelScreen.setFoxPosition("fox-go-on");
        if (!localStorage.isMGFinished(that.options.miniGameId)) {
            that.playSound(['inactiv_15_level.mp3']);
        }

    };
    /**
     * Load all necessary parameters
     * @param {Integer} [miniGameId]
     * @param {Integer} [selectedLevelId]
     */
    ChooseLevelPage.prototype.setLevelSettings = function(miniGameId, selectedLevelId) {
        var that = this;
        var firstLevelIdForMinigame = levels.getFirstLevelIdByMiniGameId(miniGameId);

        that.options = {
            miniGameId: miniGameId,
            currentLevelId: localStorage.getCurrentLevel(miniGameId) || firstLevelIdForMinigame,
            selectedLevelId: selectedLevelId || localStorage.getLastPlayedLevel(miniGameId) ||
                localStorage.getCurrentLevel(miniGameId) || firstLevelIdForMinigame,
            selectedLevelProgress: localStorage.getTaskProgress(miniGameId,
                localStorage.getLastPlayedLevel(miniGameId)),
            miniGameLevels: levels.getLevelsByMiniGameId(miniGameId),
            fox: that.domElement.find('.fox-animation'),
            nextBtn: that.domElement.find('.level-next a')
        };
        that.options.miniGameLevel = levels.getLevelById(that.options.selectedLevelId);

        that.options.nextBtn.attr('href', '#choose-level/' + that.options.miniGameId);
    };

    ChooseLevelPage.prototype.changeLevel = function(event) {
        var that = this;
        that.levelScreen.changeLevel(event);
    };

    ChooseLevelPage.prototype.onClickAnimal = function(el) {
        var that = this;
        var animalName = el.attr('data-name');
        if (!that.isSoundPlaying()) {
            that.playSound(animalName + ".mp3");
        }
    };

    /**
     * This function get invoke, when the gamer had finish a task successfully.
     */
    ChooseLevelPage.prototype.showWonAward = function() {
        var that = this;

        var spiral = that.domElement.find('.level-won-award');
        spiral.show();
        window.setTimeout(function(){
            spiral.hide();

            if (that.unlockNewLevel()) {
                that.showUnlockNewLevel();
            } else {
                that.levelScreen.setFoxPosition("fox-bow");

                that.playSound(that.levelScreen.getAPositiveAudioFile(), function() {
                    that.levelScreen.displayBigLevelProgress(true);
                    that.playIntroSound('introduction_cake.mp3', undefined, undefined, function() {
                            that.playIntroSound('kuchenstueck.mp3', undefined, undefined, undefined,
                                {levelId: that.options.currentLevelId, miniGameId: that.options.miniGameId});
                    }, {miniGameId: that.options.miniGameId});

                    //that.playSound('kuchenstueck.mp3');
                });
            }
        }, 1500);

        localStorage.setStatusNone();
        that.playSound('spiral.mp3');
    };

    /**
     * This function get invoke, when the gamer had finish a task unsuccessfully.
     */
    ChooseLevelPage.prototype.showWonWithoutAward = function() {
        var that = this;
        that.playSound(['gut_gemacht.mp3', 'gut_aufgepasst.mp3']);

        that.levelScreen.setFoxPosition("fox-clap");
        localStorage.setStatusNone();
    };

    /**
     * After spiral effect and the gamer have 10 points for current the level, this function get called.
     * Show animation and redirect to reward page.
     */
    ChooseLevelPage.prototype.showUnlockNewLevel = function() {
        var that = this;

        that.levelScreen.createLevelChooserElements();
        that.setTimeOut();
        if (localStorage.getRewardStatus().type == "reward") {
            that.levelScreen.setFoxPosition("fox-hop");
            that.playSound('stufe_weiter.mp3', function(){
                document.location = 'main.html#reward-page';
            });
        } else if (localStorage.getRewardStatus().type == "animal") {
            var animalName = localStorage.getLastAddedAnimal();
            var mp3file = (that.options.miniGameId == 2 &&
                that.options.selectedLevelId == 6) ? "treppe_mitte.mp3" : "treppe_oben.mp3";
            that.playSound(mp3file, function(){
                that.levelScreen.setFoxPosition("fox-" + animalName);

                that.playSound('tier.mp3', function(){
                    if (that.options.miniGameId == 2 &&
                        that.options.selectedLevelId == 6){
                        localStorage.setCurrentLevel(that.options.miniGameId, that.options.selectedLevelId + 1);
                        localStorage.setLastPlayedLevel(that.options.miniGameId, that.options.selectedLevelId + 1);
                    }
                    that.setTimeOut();
                    that.timeoutId = setTimeout(function() {
                        document.location = 'main.html#reward-page';
                    }, 2000);
                });
            });

        }
    };

    /**
     * Check is the level done and update the local storage.
     * @returns {boolean} true = new level unlocked, false = just got another point.
     */
    ChooseLevelPage.prototype.unlockNewLevel = function() {
        var that = this;
        //unlocked when the progress is equal 10
        if (that.options.selectedLevelProgress == 10) {
            //increase level stage later
            if (!(that.options.miniGameId == 2 &&
                that.options.selectedLevelId == 6) && !localStorage.isMGFinished(that.options.miniGameId)){
                localStorage.setCurrentLevel(that.options.miniGameId, that.options.selectedLevelId + 1);
                localStorage.setLastPlayedLevel(that.options.miniGameId, that.options.selectedLevelId + 1);
            }
            that.setLevelSettings(that.options.miniGameId, localStorage.getCurrentLevel(that.options.miniGameId)
                || levels.getFirstLevelIdByMiniGameId(that.options.miniGameId));
            return true;
        } else {
            return false;
        }
    };

    ChooseLevelPage.prototype.hide = function() {
        var that = this;
        that.timeoutInactiveUser = clearTimeout(that.timeoutInactiveUser);
        that.timeoutEnterLevelScreen = clearTimeout(that.timeoutEnterLevelScreen);
        that.timeoutId = clearTimeout(that.timeoutId);
        that.stopSound();
        that.clearTimer();
        that.domElement.hide();
    };

    return ChooseLevelPage;
});
