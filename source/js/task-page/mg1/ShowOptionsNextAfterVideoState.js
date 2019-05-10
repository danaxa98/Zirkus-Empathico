/**
 * 3. Step Mini Game 1
 */
define('task-page/mg1/ShowOptionsNextAfterVideoState', ['jsb', 'jquery', 'services/Animations', 'task-page/BaseTaskPageState',
    'services/Manikin', 'services/EmotionBar'],
    function(jsb, $, Animations, BaseTaskPageState, Manikin, EmotionBar)
{
    "use strict";

    var ShowOptionsNextAfterVideoState = BaseTaskPageState.extend('ShowOptionsNextToVideoState');

    ShowOptionsNextAfterVideoState.prototype.show = function() {
        var that = this;

        //Show and Hide necessary elements
        that.showElements(['.next-button', '.manikin']);
        that.hideElements(['.fox-animation', '.second-hint', '.curtain', 'video', '.bottom-bar']);

        that.step = 0;
        that.successfull = false;

        // Init Stage
        that.setStage();

        //Slider
        that.manikin = new Manikin(that.domElement);
        that.manikin.showValenceSlider();
        that.manikin.hideArousalSlider();

        that.foxAnimation('fox-pondering');
        that.playSound('wie_fuehlst_du_dich_NEU.mp3', function() {
            //Disable hint for the further game instruction
            //that.setTimerWithBlinkingNextBtn();
        });
    };

    /**
     * Set Poster Image and Stage to right position.
     */
    ShowOptionsNextAfterVideoState.prototype.setStage = function() {
        var that = this;
        that.domElement.addClass('video-background-blackout');

        var background = that.domElement.find('.stage-background');
        var stage =  that.domElement.find('.stage');

        background.addClass('background-poster');
        background.css('background-image', "url('" + that.getContextPosterUrl() + "')");

        stage.css('background-image','');
        stage.addClass('mini-game-' + that.options.level.miniGameId + '-stage');
        stage.show();
    };

    ShowOptionsNextAfterVideoState.prototype.resetStage = function() {
        var that = this;
        that.domElement.removeClass('video-background-blackout');

        that.domElement.find('.stage').removeClass('mini-game-' + that.options.level.miniGameId + '-stage');
        that.domElement.find('.stage-background').removeClass('background-poster').css('background-image','');
    };

    ShowOptionsNextAfterVideoState.prototype.hide = function() {
        var that = this;
        that.manikin.clear();

        that.clearTimer();
        clearTimeout(that.inactiveTimer);

        that.domElement.find('.next-button').removeClass('next-button-finish');

        that.resetStage();

        that.hideElements(['.hint-video-container', '.fox-animation', '.video-container',
            '.next-button', 'video', '.emotion-list']);
        that.showElements(['.curtain', '.close-button']);
    };


    ShowOptionsNextAfterVideoState.prototype.onClickEmotionButtonsLastStep = function() {
        var that = this;
        that.domElement.find('.emotion-list button').on('click', function() {
            that.options.completeCallback();
        });
    };

    ShowOptionsNextAfterVideoState.prototype.onClickEmotionButtons = function(el, emotion) {
        var that = this;
        var correct = that.manikin.getEmotions();

        jsb.fireEvent('Tracking::ACTIVITY', {
			"actor": {
				"objectType": "user",
				"minigame": that.options.level.miniGameId
			},
			"object": {
				"id": emotion,
				"objectType": "emotion"
			},
			"verb": "choose-emotion"
		});
        that.clearTimer();
        if (_.indexOf(correct, emotion) > -1) {
            if (that.step == 2) {
                that.successfull = true;
            }
            el.addClass('is-correct');
            that.playSound('klick.mp3', function() {
                that.foxAnimation('fox-attention');
                that.onClickEmotionButtonsLastStep();
                that.playSound('du_bist_' + emotion + '.mp3', function() {
                    that.playSound('puppe_passt_' + emotion + '.mp3');
                    that.showFinishButton();
                    //Disable hint for the further game instruction
                    //that.setTimerWithBlinkingNextBtn();
                });
            });
        } else {
            that.step++;
            that.successfull = false;
            el.addClass('is-incorrect');
            that.playSound('klick.mp3', function() {
                that.foxAnimation('fox-pondering');
                that.playSound('' + emotion + '_sicher.mp3', function() {
                    that.emotionBar.empty();
                    that.foxAnimation('fox-attention');
                    that.playSound('passt_besser.mp3', function() {
                        that.emotionBar.change(that.manikin.getEmotions(),
                            { //'eventHandle': function() {},
                             'onCompletion': function() {
                                 that.showFinishButton();
                                 that.onClickEmotionButtonsLastStep();
                            }}
                        );
                        that.emotionBar.play();
                    });
                });
            });
        }
    };

    ShowOptionsNextAfterVideoState.prototype.foxAnimation = function(name, callback) {
        var that = this;
        var val = BaseTaskPageState.prototype.foxAnimation.apply(that, [name, callback]);
        that.domElement.find('.fox-animation').css({'margin-left': '3%'});
        return val;
    };

    ShowOptionsNextAfterVideoState.prototype.showFinishButton = function() {
        var that = this;
        that.domElement.find('.close-button').hide();
        that.domElement.find('.next-button').addClass('next-button-finish');
        that.domElement.find('.next-button').show();
    };

    ShowOptionsNextAfterVideoState.prototype.onClickNextButton = function() {
        var that = this;

        var nxtBtn = that.domElement.find('.next-button');
        that.clearTimer();
        if (that.step === 0) {
            that.manikin.showArousalSlider();
            nxtBtn.hide();
            setTimeout(function(){
                nxtBtn.show();
                //Disable hint for the further game instruction
                //that.setTimerWithBlinkingNextBtn();
            }, 2000);
        } else if (that.step === 1) {
			jsb.fireEvent('Tracking::ACTIVITY', {
				"actor": {
					"objectType": "user",
					"minigame": that.options.level.miniGameId
				},
				"object": {
					"id": that.manikin.getValues().valence,
					"objectType": "valence"
				},
				"verb": "choose-valence"
			});
			jsb.fireEvent('Tracking::ACTIVITY', {
				"actor": {
					"objectType": "user",
					"minigame": that.options.level.miniGameId
				},
				"object": {
					"id": that.manikin.getValues().arousal,
					"objectType": "arousal"
				},
				"verb": "choose-arousal"
			});
            that.manikin.hideArousalSlider();
            that.manikin.hideValenceSlider();
            nxtBtn.hide();
            that.domElement.find('.fox-animation').fadeIn();

			that.manikin.getEmotions().forEach(function(emotion) {
				jsb.fireEvent('Tracking::ACTIVITY', {
					"actor": {
						"objectType": "level-system",
						"minigame": that.options.level.miniGameId
					},
					"object": {
						"id": emotion,
						"objectType": "emotion"
					},
					"verb": "possible-valid-emotion"
				});
			});
            that.emotionBar = new EmotionBar({
                'context': that,
                //'afterSelectionHideOthers': false,
                'introduction': true,
                'emotions': that.manikin.getAllEmotions(),
                'eventHandle': function(element, emotion){
                    that.clearTimer();
                    that.onClickEmotionButtons(element, emotion);
                    //Disable hint for the further game instruction
                    //that.setTimerWithBlinkingNextBtn();
                },
                'onCompletion': function() {
                    //that.setTimerWithBlinkingNextBtn();
                }
            });
            that.foxAnimation('fox-attention');
            that.playSound('was_passt.mp3', function() {
                that.emotionBar.play();
            });
        } else {
            that.options.completeCallback();
        }
        that.step++;
    };

    ShowOptionsNextAfterVideoState.prototype.showBeforeCorrectState = function(callback) {

    };

    ShowOptionsNextAfterVideoState.prototype.showBeforeFirstHintState = function(callback) {

    };

    ShowOptionsNextAfterVideoState.prototype.showBeforeSecondHintState = function(callback) {

    };

    return ShowOptionsNextAfterVideoState;
});
