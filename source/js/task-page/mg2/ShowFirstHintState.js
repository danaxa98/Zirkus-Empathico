define('task-page/mg2/ShowFirstHintState', ['jsb', 'jquery', 'task-page/BaseTaskPageState'], function(jsb, $, BaseTaskPageState)
{
    "use strict";

    var ShowFirstHintState = BaseTaskPageState.extend('ShowFirstHintState');

    ShowFirstHintState.prototype.show = function() {
        var that = this;
        that.showElements(['.fox-animation', '.video-container', '.video']);
        //that.domElement.find('.bottom-bar button:not(.is-incorrect)').css('visibility', 'hidden');
        that.domElement.find('.bottom-bar button').hide();
        this.playSound('versuchsnochmal.mp3', function() {
            that.foxAnimation('fox-pointing-' + that.options.level.hint);
            that.playSound('hint_' + that.options.level.hint + '.mp3', function(){
                that.domElement.find('.bottom-bar button').removeClass('is-correct is-incorrect');
                that.domElement.find('.bottom-bar button').show();
                that.clearClickPrevention();
                //Disable hint for the further game instruction
                //that.startInactivityTimer();
            });
        });
    };

    ShowFirstHintState.prototype.hide = function()
    {
        var that = this;

        that.clearTimer();

        that.hideElements(['.fox-animation', '.video-container']);
        that.showElements(['.bottom-bar button']);

        that.stopSound();
    };


    return ShowFirstHintState;
});
