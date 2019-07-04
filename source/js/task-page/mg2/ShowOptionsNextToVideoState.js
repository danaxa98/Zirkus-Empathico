define('task-page/mg2/ShowOptionsNextToVideoState', ['jsb', 'jquery', 'services/Animations', 'services/LocalStorage', 'task-page/BaseTaskPageState'], function(jsb, $, Animations, localStorage, BaseTaskPageState)
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
                    that.showOption(3, false);
                    if ( that.options.level.options.length == 3){
                        that.clearClickPrevention();
                        setTimeout(that.options.completeCallback, 0);
                    }
                    that.currentTimout = setTimeout(function()
                    {
                        if ( that.options.level.options.length > 3) {
                            that.showOption(4, false);
                            if ( that.options.level.options.length == 4){
                                that.clearClickPrevention();
                                setTimeout(that.options.completeCallback, 0);
                            }
                            that.currentTimout = setTimeout(function()
                            {
                                if ( that.options.level.options.length > 4) {
                                    that.showOption(5, false);
                                    if ( that.options.level.options.length == 5){
                                        that.clearClickPrevention();
                                        setTimeout(that.options.completeCallback, 0);
                                    }
                                    that.currentTimout = setTimeout(function()
                                    {
                                        if ( that.options.level.options.length > 5) {
                                            that.clearClickPrevention();
                                            that.showOption(6, false);
                                            that.currentTimout = setTimeout(function() {
                                                //Disable hint for the further game instruction
                                                //that.startInactivityTimer();
                                                setTimeout(that.options.completeCallback, 0);
                                            }, 2000);
                                        }
                                    }, 2000);
                                }
                            }, 2000);
                        }
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

        for (var i = 1; i <= localStorage.getNumberOfChoicesForCurrentTask(); i++)
            that.showOption(i, true);

    };

    ShowOptionsNextToVideoState.prototype.showOption = function(facePosition, withoutFadingAndSound)
    {
        var optionSelectors = ['.first-option', '.second-option', '.third-option','.fourth-option', '.fifth-option', '.sixth-option'];


        this.domElement.find(optionSelectors[facePosition - 1]).css('background-image',
                'url("img/emotion_' + this.options.level.options[facePosition - 1] + '.svg")');

        this.domElement.find(optionSelectors[facePosition - 1]).addClass('is-used');

        if (withoutFadingAndSound) {
            this.domElement.find(optionSelectors[facePosition - 1]).show();
        } else {
            this.domElement.find(optionSelectors[facePosition - 1]).hide().fadeIn();
            this.playSound(this.options.level.options[facePosition - 1] + '.mp3');
        }
    };

    return ShowOptionsNextToVideoState;
});