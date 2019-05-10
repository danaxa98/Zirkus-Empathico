define('task-page/mg5/ShowOptionsAfterVideoState', ['jsb', 'jquery', 'services/Animations', 'task-page/BaseTaskPageState',
    'services/Manikin', 'services/EmotionBar'],
    function(jsb, $, Animations, BaseTaskPageState, Manikin, EmotionBar)
{
    "use strict";

    var ShowOptionsAfterVideoState = BaseTaskPageState.extend('ShowOptionsAfterVideoState');

    ShowOptionsAfterVideoState.prototype.show = function() {
        var that = this;

        //Show and Hide necessary elements
        that.showElements(['.next-button', '.manikin', 'video', '.rays']);
        that.hideElements(['.fox-animation', '.video-container',
            '.second-hint', '.curtain', '.bottom-bar']);

        if (!that.options.level.runMg5OnlyMode) {
            that.showElements(['.close-button']);
        } else {
            that.hideElements(['.close-button']);
        }

        that.step = 0;

        // Init Stage
        that.setStage();

        //Slider
        that.manikin = new Manikin(that.domElement, {'eventHandle': that.onChangeManikin});
        that.emotionBar = new EmotionBar({
            'introduction': false,
            'autoplay': true,
            'context': that,
            'emotions': [], //that.manikin.getEmotions(),
            'eventHandle': function(element, emotion){ that.onClickEmotionButtons(element, emotion);}
        });

        that.playIntroSound('new_minigame5b.mp3', null, function() {
            that.manikin.showValenceSlider();
            that.manikin.showArousalSlider();
        }, function() {
            that.manikin.showValenceSlider();
            that.manikin.showArousalSlider();
        });
    };

    /**
     * Set Poster Image and Stage to right position.
     */
    ShowOptionsAfterVideoState.prototype.setStage = function() {
        var that = this;

        var stage =  that.domElement.find('.stage');

        stage.css('background-image','');
        stage.addClass('mini-game-' + that.options.level.miniGameId + '-stage');
        stage.show();


    };

    ShowOptionsAfterVideoState.prototype.resetStage = function() {
        var that = this;

        that.domElement.find('.stage').removeClass('mini-game-' + that.options.level.miniGameId + '-stage');
    };

    ShowOptionsAfterVideoState.prototype.hide = function() {
        var that = this;
        that.clearTimer();
        that.manikin.clear();
        that.domElement.find('.next-button').removeClass('next-button-finish');

        that.resetStage();

        that.hideElements(['.emotion-list', '.hint-video-container', '.fox-animation', '.video-container',
            '.next-button', 'video', '.rays']);
        that.showElements(['.curtain', '.close-button']);
    };

    ShowOptionsAfterVideoState.prototype.onChangeManikin = function() {
        var that = this;
        that.emotionBar.change(that.manikin.getEmotions());
        that.emotionBar.play();
    };
    ShowOptionsAfterVideoState.prototype.onClickNextButton = function() {
        var that = this;

        if (that.options.level.runMg5OnlyMode) {
            that.manikin.reset();
            that.emotionBar.empty();
            that.domElement.find('.next-button').hide();
        } else {
            that.manikin.clear();
            that.hide();
            document.location = 'main.html#start';
        }
    };

    ShowOptionsAfterVideoState.prototype.onClickEmotionButtons = function(el, emotion) {
        var that = this;
        el.addClass('is-correct');
        that.manikin.hideValenceSlider();
        that.manikin.hideArousalSlider();

        that.playSound('klick.mp3', function() {
            that.playSound('du_bist_' + emotion + '.mp3', function() {
                that.domElement.find('.next-button').addClass('next-button-finish');
            });
        });
    };

    return ShowOptionsAfterVideoState;
});
