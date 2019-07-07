define('StartPage', ['jsb', 'logging', 'jquery', 'BasePage', 'services/LocalStorage'],
    function(jsb, logging, $, BasePage, localStorage)
{
    "use strict";

    var StartPage = BasePage.extend('StartPage');

    StartPage.prototype.show = function()
    {
        var that = this;

		jsb.fireEvent('Tracking::ACTIVITY', {
			"actor": {
				"objectType": "user"
			},
			"verb": "enter-homescreen"
        });
        
        if (localStorage.isGameFinished()){
            that.domElement.addClass('game-is-finished');
            that.initEventListener();
        } else {
            that.playIntroSound('presentation_library.mp3',
                function(){
                    that.domElement.find('a').on('click', function() {
                        that.playBackgroundSound('incorrect.mp3', undefined, {'loop': false});
                    });
                    that.foxAnimation('fox-pointing');
                }, function() {
                    that.domElement.find('a').off('click');
                    that.gotoMiniGame('library');
                }, function() {
                    that.foxAnimation('fox-pointing');
                    that.playMiniGameIntro(function(playedIntro){
                        if (playedIntro) {
                            that.startInactivityTimer('inactiv_30_home.mp3');
                        } else {
                            that.playSound("start_game.mp3", function() {
                                that.playSound("start_library.mp3", function(){
                                    that.startInactivityTimer('inactiv_30_home.mp3');
                                });
                            });
                        }
                    });

                    that.initEventListener();
                });
        }

        that.domElement.show();
        that.foxAnimation('fox-pointing').stop();
        that.loadMiniGames();
    };

    StartPage.prototype.loadMiniGames = function() {
        var that = this;
        _.map(that.domElement.find('.mini-game'), function(val, i) {
            val = $(val);
            var miniGameId = parseInt(val.find('a').attr('data-minigameid'));
            val.removeClass('open closed');
            if (localStorage.isMiniGameUnlocked(miniGameId) || localStorage.isDemoMode()) {
                val.addClass('open');
            } else {
                val.addClass('closed');
            }
        });
    };

    StartPage.prototype.playMiniGameIntro = function(callback) {
        var that = this;
        var ary = _.map(that.domElement.find('.mini-game'), function(val, i) {
            val = $(val);
            var miniGameId = parseInt(val.find('a').attr('data-minigameid'));
            if (localStorage.isMiniGameUnlocked(miniGameId) || localStorage.isDemoMode()) {
                if (!localStorage.isIntroMiniGamePlayed(miniGameId) && miniGameId > 1 && miniGameId < 6) {
                    that.playSound('new_minigame' + miniGameId + '.mp3', function () {
                        localStorage.setIntroMiniGameAsPlayed(miniGameId);
                        callback(true);
                    });
                    return false;
                }
            } else {
                return true;
            }
        });
        var bool = true;
        _.map(ary, function (val, i) {
            if (!val) {
                bool = false;
            }
        });

        /*
        if (bool) {
            callback(false);
        }*/
        callback(bool);

    };


    StartPage.prototype.initEventListener = function() {
        var that = this;
        that.domElement.find('.mini-game a').click(function(event){
            event.stopPropagation();
            that.startInactivityTimer();
            var el = $(this);
            var miniGameId = el.attr('data-minigameid');
            that.onClickElement(el, miniGameId);
            that.startInactivityTimer();

        });

        that.domElement.find('.goto-library-chooser').click(function(event){
            event.stopPropagation();
            that.startInactivityTimer();
            that.playClickSound(function() {
                //that.playSound("start_library.mp3", function() {
                    that.gotoMiniGame("library");
                //});
            });
            that.startInactivityTimer();

        });
    };
    StartPage.prototype.onClickElement = function(el, miniGameId) {
        var that = this;
        that.startInactivityTimer();

        if (el.parent().hasClass('open')) {
            that.playClickSound(function() {
                setTimeout(function(){
                    that.foxAnimation('fox-attention');
                }, 500);
                that.playSound('name_mini' + miniGameId + '.mp3', function() {
                    that.gotoMiniGame(miniGameId);
                });
            });
        } else {
            if (that.isSoundPlaying()) {
                that.playBackgroundSound('incorrect.mp3', undefined, {loop: false});
            } else {
                that.playSound('incorrect.mp3', function() {
                    that.playSound('fenster_zu_2.mp3');
                });
            }
        }
        that.startInactivityTimer();
    };

    StartPage.prototype.gotoMiniGame = function(miniGameId) {
        localStorage.setLastActivity();
        if (miniGameId == 5) {
            document.location = 'main.html#play-level/31';
        } else if (miniGameId == "library") {
            document.location = 'main.html#library';
        } else {
            document.location = 'main.html#choose-level/' + miniGameId + '';
        }
    };


    return StartPage;
});
