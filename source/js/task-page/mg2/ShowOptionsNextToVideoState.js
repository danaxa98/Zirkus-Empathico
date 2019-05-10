define('task-page/mg2/ShowOptionsNextToVideoState', ['jsb', 'jquery', 'services/Animations', 'task-page/BaseTaskPageState'], function(jsb, $, Animations, BaseTaskPageState)
{
    "use strict";

    var ShowOptionsNextToVideoState = BaseTaskPageState.extend('ShowOptionsNextToVideoState');

    ShowOptionsNextToVideoState.prototype.show = function()
    {
        var that = this;
        that.showElements(['.fox-animation', '.video-container', '.video', '.bottom-bar']);

        var fox = that.domElement.find('.fox-animation');

        //that.domElement.find('.no-hint-fox').show();

        that.foxAnimation("fox-pondering");
        that.addClickPrevention();
        that.playSound('question_' + that.options.level.person.salutation + '.mp3', function(){
            that.showOption(1, false);
            that.currentTimout = setTimeout(function()
            {
                that.showOption(2, false);
                that.currentTimout = setTimeout(function()
                {
                    that.clearClickPrevention();
                    that.showOption(3, false);
                    that.currentTimout = setTimeout(function() {
                        //Disable hint for the further game instruction
                        //that.startInactivityTimer();
                        setTimeout(that.options.completeCallback, 0);
                    }, 2000);
                }, 2000);
            }, 2000);
        });
    };

    ShowOptionsNextToVideoState.prototype.hide = function()
    {
        var that = this;
        that.stopSound();
        that.clearTimer();

        clearTimeout(this.currentTimout);
        that.stopSound();
        that.showOption(1, true);
        that.showOption(2, true);
        that.showOption(3, true);
    };

    ShowOptionsNextToVideoState.prototype.showOption = function(facePosition, withoutFadingAndSound)
    {
        var optionSelector = '.first-option';
        if (facePosition == 2) {
            optionSelector = '.second-option';
        }
        if (facePosition == 3) {
            optionSelector = '.third-option';
        }
        this.domElement.find(optionSelector).css('background-image',
                'url("img/emotion_' + this.options.level.options[facePosition - 1] + '.svg")');
        if (withoutFadingAndSound) {
            this.domElement.find(optionSelector).show();
        } else {
            this.domElement.find(optionSelector).hide().fadeIn();
            this.playSound(this.options.level.options[facePosition - 1] + '.mp3');
        }
    };

    return ShowOptionsNextToVideoState;
});