define('task-page/mg4/ShowOptionsAfterVideoState', ['jsb', 'jquery', 'services/Animations', 'task-page/BaseTaskPageState',
    'services/Manikin', 'services/EmotionBar'],
    function(jsb, $, Animations, BaseTaskPageState, Manikin, EmotionBar)
{
    "use strict";

    var ShowOptionsAfterVideoState = BaseTaskPageState.extend('ShowOptionsAfterVideoState');

    ShowOptionsAfterVideoState.prototype.show = function() {
        var that = this;

        //Show and Hide necessary elements
        that.showElements(['.manikin', 'video', '.rays', '.video-container']);
        that.hideElements(['.next-button', '.fox-animation', '.second-hint', '.curtain', '.bottom-bar']);

        that.step = 0;

        // Init Stage
        that.setStage();

        //Slider
        that.manikin = new Manikin(that.domElement);
        that.manikin.hideManikin();

        //Video
        that.showVideo();
        that.loadLevelVideo(function() {
            that.foxAnimation('fox-attention');
            that.playSound(that.options.level.person.salutation + '_fuehlt.mp3', function() {
                that.foxAnimation('fox-pondering');
                that.playSound('du_' + that.options.level.person.salutation + '.mp3', function () {
                    setTimeout(function () {
                        that.manikin.showValenceSlider();
                        that.manikin.showArousalSlider();
                        that.manikin.showManikin();
                        that.domElement.find('.next-button').show();
                    }, 3 * 1000);
                });
            });
            that.startVideo();
        });



    };

    /**
     * Set Poster Image and Stage to right position.
     */
    ShowOptionsAfterVideoState.prototype.setStage = function() {
        var that = this;

        that.domElement.addClass('video-background-blackout');

        var background = that.domElement.find('.stage-background');
        var stage =  that.domElement.find('.stage');
        var videoContainer = that.domElement.find('.video-container');

        background.addClass('background-poster');
        background.css('background-image', 'url("' + that.getContextPosterUrl() + '")');

        stage.css('background-image','');
        stage.addClass('mini-game-' + that.options.level.miniGameId + '-stage');
        stage.show();

        videoContainer.css('background-image','');
        videoContainer.addClass('video-emotion');

        //Disable hint for the further game instruction
        //that.setTimerWithBlinkingNextBtn();

    };

    ShowOptionsAfterVideoState.prototype.resetStage = function() {
        var that = this;
        that.domElement.removeClass('video-background-blackout');
        that.domElement.find('.stage').removeClass('mini-game-' + that.options.level.miniGameId + '-stage');
        that.domElement.find('.stage-background').removeClass('background-poster').css('background-image','');
        that.domElement.find('.video-container').removeClass('video-emotion');
    };

    ShowOptionsAfterVideoState.prototype.hide = function() {
        var that = this;

        that.clearTimer();

        that.manikin.clear();
        that.stopVideo();

        clearTimeout(that.inactiveTimer);
        that.resetStage();

        that.hideElements(['.hint-video-container', '.fox-animation', '.video-container',
            '.next-button', 'video', '.rays']);
        that.showElements(['.curtain']);
    };

    ShowOptionsAfterVideoState.prototype.onClickNextButton = function() {
        var that = this;
        that.clearTimer();
        that.options.completeCallback(that.manikin.getValues());
    };

    ShowOptionsAfterVideoState.prototype.showBeforeCorrectState = function(callback) {

    };

    ShowOptionsAfterVideoState.prototype.showBeforeFirstHintState = function(callback) {

    };

    ShowOptionsAfterVideoState.prototype.showBeforeSecondHintState = function(callback) {

    };

    return ShowOptionsAfterVideoState;
});
