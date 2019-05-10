/**
 * 3. Step Mini Game 3
 */
define('task-page/mg3/ShowOptionsNextAfterVideoState', ['jsb', 'jquery', 'services/Animations', 'task-page/BaseTaskPageState'],
    function(jsb, $, Animations, BaseTaskPageState)
{
    "use strict";

    var ShowOptionsNextAfterVideoState = BaseTaskPageState.extend('ShowOptionsNextToVideoState');

    ShowOptionsNextAfterVideoState.prototype.show = function()
    {
        var that = this;
        that.hideFaceOptions();

        //Fox
        that.showElements(['.fox-animation']);
        that.hideElements(['.second-hint']);
        that.foxAnimation('fox-pondering');

        //Video
        that.domElement.find('.video-container').addClass('video-full-screen-on-option-screen');
        that.domElement.find('.video-container video').hide();
        var videoWrapper = that.domElement.find('.video-container');
        videoWrapper.addClass('video-full-screen');
        videoWrapper.css('background-image', 'url(\'' + that.getContextPosterUrl() + '\')');

        //that.domElement.find('.no-hint-fox').show();

        //Show second Hint State
        var hint = that.domElement.find('.hint-video-container');
        hint.addClass('hint-video-reposition');
        if (that.options.hintState  === true) {
            hint.show();
        } else {
            hint.hide();
        }

        that.addClickPrevention();
        that.playSound('question_mini3_' + that.options.level.person.salutation + '.mp3', function()
        {
            that.showOption(1, false);
            that.currentTimout = setTimeout(function()
            {
                that.showOption(2, false);
                that.currentTimout = setTimeout(function()
                {
                    that.showOption(3, false);
                    that.currentTimout = setTimeout(function()
                    {
                        that.clearClickPrevention();
                        setTimeout(that.options.completeCallback, 0);
                        //Disable hint for the further game instruction
                        //that.startInactivityTimer();
                    }, 2000);
                }, 2000);
            }, 2000);
        });
    };

    ShowOptionsNextAfterVideoState.prototype.hide = function()
    {
        var that = this;

        that.clearTimer();
        clearTimeout(this.currentTimout);

        that.domElement.find('.video-container').removeClass('video-full-screen-on-option-screen');
        that.domElement.find('.hint-video-container').removeClass('hint-video-reposition');
        var videoWrapper = that.domElement.find('.video-container');
        videoWrapper.removeClass('video-full-screen');
        videoWrapper.css('background-image', '');

        that.hideElements(['.hint-video-container', '.fox-animation']);


        var nextBtn = that.domElement.find('.next-button');
        nextBtn.removeClass('next-button-finish');
        nextBtn.hide();

        that.domElement.find('.bottom-bar button').css('visibility', 'visible');

        that.stopSound();
        this.showOption(1, true);
        this.showOption(2, true);
        this.showOption(3, true);
    };

    ShowOptionsNextAfterVideoState.prototype.showOption = function(facePosition, withoutFadingAndSound)
    {
        var optionSelector = ['', '.first-option', '.second-option', '.third-option'];

        this.domElement.find(optionSelector[facePosition]).css('background-image',
                'url("img/emotion_' + this.options.level.options[facePosition - 1] + '.svg")');
        if (withoutFadingAndSound)
        {
            this.domElement.find(optionSelector[facePosition]).show();
        }
        else
        {
            this.domElement.find(optionSelector[facePosition]).hide().fadeIn();
            this.playSound(this.options.level.options[facePosition - 1] + '.mp3');
        }
    };

    ShowOptionsNextAfterVideoState.prototype.showBeforeCorrectState = function(callback) {
        var that = this;
        that.clearClickPrevention();
        callback();
    };

    ShowOptionsNextAfterVideoState.prototype.showBeforeFirstHintState = function(callback) {
        var that = this;

        that.clearTimer();

        that.domElement.find('.bottom-bar button:not(.is-incorrect)').hide();
        that.foxAnimation('fox-pondering');
        that.playSound('kann_sein.mp3', function() {
            that.domElement.find('.bottom-bar button').hide();
            that.playSound('aber_anders_' + that.options.level.person.salutation + '.mp3', function() {
                callback();
                that.domElement.find('.bottom-bar button').show();
                that.clearClickPrevention();
                //Disable hint for the further game instruction
                //that.startInactivityTimer();
            });
        });
    };

    ShowOptionsNextAfterVideoState.prototype.showBeforeSecondHintState = function(callback) {
        var that = this;

        that.clearTimer();

        var correct_option = null;
        for (var i = 1; i <= 3; i++) {
            if (that.options.level.options[i - 1] == that.options.level.correct) {
                correct_option = i;
            }
        }
        $(that.domElement.find('.bottom-bar button')[correct_option - 1]).addClass('is-correct');


        that.foxAnimation('fox-laying-' + correct_option);
        that.playSound('correct_' + that.options.level.correct + '.mp3', function(){
            that.clearClickPrevention();
            var nextBtn = that.domElement.find('.next-button');
            nextBtn.addClass('next-button-finish');
            nextBtn.show();
            //Disable hint for the further game instruction
            //that.setTimerWithBlinkingNextBtn();
            //callback();
        });

    };


    ShowOptionsNextAfterVideoState.prototype.onClickNextButton = function() {
        var that = this;
        that.options.completeCallback();
    };

    return ShowOptionsNextAfterVideoState;
});
